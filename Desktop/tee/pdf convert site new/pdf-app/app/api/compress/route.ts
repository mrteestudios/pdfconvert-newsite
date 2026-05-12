import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument } from 'pdf-lib'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'File must be a PDF' }, { status: 400 })
    }

    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 50MB' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()

    // Load and re-save with pdf-lib — removes redundant objects, compresses streams
    const pdfDoc = await PDFDocument.load(arrayBuffer, {
      ignoreEncryption: true,
    })

    const compressedBytes = await pdfDoc.save({
      useObjectStreams: true,
      addDefaultPage: false,
    })

    const compressedSize = compressedBytes.byteLength
    const base64 = Buffer.from(compressedBytes).toString('base64')
    const downloadUrl = `data:application/pdf;base64,${base64}`

    return NextResponse.json({
      success: true,
      downloadUrl,
      compressedSize,
      originalSize: file.size,
    })
  } catch (error) {
    console.error('Compress error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to compress PDF' },
      { status: 500 }
    )
  }
}
