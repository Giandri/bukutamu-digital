import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { to, message } = await request.json()

    if (!to || !message) {
      return NextResponse.json(
        { error: 'Nomor telepon dan pesan diperlukan' },
        { status: 400 }
      )
    }

    // WAHA API configuration
    const WAHA_BASE_URL = process.env.WAHA_BASE_URL || 'http://localhost:3000'
    const WAHA_API_KEY = process.env.WAHA_API_KEY || ''

    if (!WAHA_API_KEY) {
      console.warn('WAHA_API_KEY not configured, falling back to WhatsApp Web')
      return NextResponse.json(
        { error: 'WAHA API key tidak dikonfigurasi' },
        { status: 500 }
      )
    }

    // Format phone number (remove + and ensure it starts with country code)
    const phoneNumber = to.replace(/^\+/, '').replace(/\D/g, '')

    console.log('📱 Sending WhatsApp via WAHA:', {
      to: phoneNumber,
      message: message.substring(0, 100) + '...',
      wahaUrl: WAHA_BASE_URL
    })

    try {
      // Check if session is ready
      const sessionResponse = await fetch(`${WAHA_BASE_URL}/api/sessions/default/status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': WAHA_API_KEY
        }
      })

      if (!sessionResponse.ok) {
        throw new Error('WAHA session not ready')
      }

      const sessionData = await sessionResponse.json()
      if (sessionData.status !== 'WORKING') {
        throw new Error(`WAHA session status: ${sessionData.status}`)
      }

      // Send message via WAHA
      const sendResponse = await fetch(`${WAHA_BASE_URL}/api/sendText`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': WAHA_API_KEY
        },
        body: JSON.stringify({
          chatId: `${phoneNumber}@c.us`,
          text: message,
          session: 'default'
        })
      })

      if (!sendResponse.ok) {
        const errorData = await sendResponse.json()
        throw new Error(`WAHA send failed: ${errorData.message || sendResponse.statusText}`)
      }

      const sendData = await sendResponse.json()

      console.log('✅ WhatsApp sent successfully via WAHA:', sendData)

      return NextResponse.json({
        success: true,
        message: 'Pesan WhatsApp berhasil dikirim',
        messageId: sendData.id
      })

    } catch (wahaError: any) {
      console.error('❌ WAHA Error:', wahaError)

      // Fallback to WhatsApp Web if WAHA fails
      console.log('🔄 Falling back to WhatsApp Web...')

      return NextResponse.json({
        success: false,
        fallback: true,
        whatsappUrl: `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
        error: wahaError.message
      })
    }

  } catch (error: any) {
    console.error('Error sending WhatsApp:', error)
    return NextResponse.json(
      { error: 'Gagal mengirim pesan WhatsApp' },
      { status: 500 }
    )
  }
}
