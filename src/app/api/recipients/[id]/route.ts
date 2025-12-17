import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { name, position, whatsapp, isActive } = await request.json()

    if (!name || !position) {
      return NextResponse.json(
        { error: 'Nama dan jabatan harus diisi' },
        { status: 400 }
      )
    }

    const recipient = await prisma.recipient.update({
      where: { id },
      data: {
        name,
        position,
        whatsapp,
        isActive,
      },
    })

    return NextResponse.json({
      success: true,
      recipient
    })

  } catch (error) {
    console.error('Error updating recipient:', error)
    return NextResponse.json(
      { error: 'Gagal mengupdate penerima' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Soft delete by setting isActive to false
    const recipient = await prisma.recipient.update({
      where: { id },
      data: { isActive: false },
    })

    return NextResponse.json({
      success: true,
      message: 'Penerima berhasil dinonaktifkan'
    })

  } catch (error) {
    console.error('Error deleting recipient:', error)
    return NextResponse.json(
      { error: 'Gagal menghapus penerima' },
      { status: 500 }
    )
  }
}
