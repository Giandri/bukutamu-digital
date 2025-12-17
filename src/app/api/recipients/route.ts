import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const recipients = await prisma.recipient.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json({ recipients })
  } catch (error) {
    console.error('Error fetching recipients:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil data penerima' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { name, position, whatsapp } = await request.json()

    if (!name || !position) {
      return NextResponse.json(
        { error: 'Nama dan jabatan harus diisi' },
        { status: 400 }
      )
    }

    const recipient = await prisma.recipient.create({
      data: {
        name,
        position,
        whatsapp,
        isActive: true,
      },
    })

    return NextResponse.json({
      success: true,
      recipient
    })

  } catch (error) {
    console.error('Error creating recipient:', error)
    return NextResponse.json(
      { error: 'Gagal menambahkan penerima' },
      { status: 500 }
    )
  }
}
