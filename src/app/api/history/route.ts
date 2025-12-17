import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get all reception logs with guest and recipient information
    const receptionLogs = await prisma.receptionLog.findMany({
      include: {
        guest: {
          include: {
            // We can add more relations if needed
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 100 // Limit to last 100 records for performance
    })

    // Format data for frontend
    const historyData = receptionLogs.map((log: any) => {
      // Find recipient based on guest.to field (recipient name)
      const recipientName = log.guest.to

      // Format date and time
      const date = log.createdAt.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      const time = log.createdAt.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
      })
      const formattedDateTime = `${date} - ${time}`

      // Determine status based on action and check-in status
      let status = 'Selesai'
      if (log.action === 'checkin' && log.guest.checkedIn) {
        status = 'Check-in Berhasil'
      } else if (log.action === 'checkout') {
        status = 'Check-out'
      } else if (!log.guest.checkedIn) {
        status = 'Menunggu Check-in'
      }

      return {
        id: log.id,
        nama: log.guest.name,
        host: recipientName,
        whatsapp: log.guest.whatsapp,
        waktu: formattedDateTime,
        status: status,
        action: log.action,
        notes: log.notes,
        qrCode: log.guest.qrCode
      }
    })

    return NextResponse.json({
      history: historyData,
      total: historyData.length
    })

  } catch (error) {
    console.error('Error fetching history:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil data riwayat' },
      { status: 500 }
    )
  }
}
