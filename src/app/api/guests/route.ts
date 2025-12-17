import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { randomBytes } from 'crypto'

export async function POST(request: Request) {
  try {
    const { name, whatsapp, to, purpose } = await request.json()

    // Validasi input
    if (!name || !whatsapp || !to || !purpose) {
      return NextResponse.json(
        { error: 'Semua field harus diisi' },
        { status: 400 }
      )
    }

    // Generate QR Code unique
    const qrCode = randomBytes(16).toString('hex')

    // Simpan ke database
    const guest = await prisma.guest.create({
      data: {
        name,
        whatsapp,
        to,
        purpose,
        qrCode,
        checkedIn: false,
      },
    })

    return NextResponse.json({
      success: true,
      guest,
      qrCode
    })

  } catch (error) {
    console.error('Error creating guest:', error)
    return NextResponse.json(
      { error: 'Gagal menyimpan data tamu' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const qrCode = searchParams.get('qrCode')

    if (qrCode) {
      // Get guest by QR code
      const guest = await prisma.guest.findUnique({
        where: { qrCode },
      })

      if (!guest) {
        return NextResponse.json(
          { error: 'QR Code tidak ditemukan' },
          { status: 404 }
        )
      }

      return NextResponse.json({ guest })
    }

    // Get all guests
    const guests = await prisma.guest.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ guests })

  } catch (error) {
    console.error('Error fetching guests:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil data tamu' },
      { status: 500 }
    )
  }
}
