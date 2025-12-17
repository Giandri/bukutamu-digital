import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { qrCode } = await request.json()

    if (!qrCode) {
      return NextResponse.json(
        { error: 'QR Code diperlukan' },
        { status: 400 }
      )
    }

    // Cari tamu berdasarkan QR code
    const guest = await prisma.guest.findUnique({
      where: { qrCode },
    })

    if (!guest) {
      return NextResponse.json(
        { error: 'QR Code tidak valid' },
        { status: 404 }
      )
    }

    // Cek apakah sudah check-in
    if (guest.checkedIn) {
      return NextResponse.json({
        error: 'Tamu sudah check-in sebelumnya',
        guest
      }, { status: 409 })
    }

    // Update status check-in
    const updatedGuest = await prisma.guest.update({
      where: { id: guest.id },
      data: {
        checkedIn: true,
        checkedInAt: new Date(),
      },
    })

    // Buat log reception
    await prisma.receptionLog.create({
      data: {
        guestId: guest.id,
        action: 'checkin',
        notes: `Check-in oleh resepsionis pada ${new Date().toLocaleString('id-ID')}`,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Tamu berhasil diverifikasi',
      guest: updatedGuest
    })

  } catch (error) {
    console.error('Error verifying guest:', error)
    return NextResponse.json(
      { error: 'Gagal memverifikasi tamu' },
      { status: 500 }
    )
  }
}
