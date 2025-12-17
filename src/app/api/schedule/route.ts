import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get all guests who haven't checked in yet
    const pendingGuests = await prisma.guest.findMany({
      where: {
        checkedIn: false,
        // Optional: filter by recent guests (last 30 days)
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 100 // Limit for performance
    })

    // Format data for frontend
    const scheduleData = pendingGuests.map(guest => {
      // Format date and time
      const date = guest.createdAt.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      const time = guest.createdAt.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
      })
      const formattedDateTime = `${date} - ${time}`

      return {
        id: guest.id,
        nama: guest.name,
        host: guest.to,
        whatsapp: guest.whatsapp,
        waktu: formattedDateTime,
        status: 'Menunggu Check-in',
        purpose: guest.purpose,
        qrCode: guest.qrCode,
        createdAt: guest.createdAt
      }
    })

    return NextResponse.json({
      schedule: scheduleData,
      total: scheduleData.length
    })

  } catch (error) {
    console.error('Error fetching schedule:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil data jadwal temu' },
      { status: 500 }
    )
  }
}
