import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument } from 'pdf-lib'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files: File[] = []

    for (const [key, value] of formData.entries()) {
      if (key.startsWith('file') && value instanceof File) {
        files.push(value)
      }
    }

    if (files.length < 2) {
      return NextResponse.json({ error: 'At least 2 PDF files are required' }, { status: 400 })
    }

    for (const file of files) {
      if (file.type !== 'application/pdf') {
        return NextResponse.json({ error: 'All files must be PDFs' }, { status: 400 })
      }
    }

    const mergedPdf = await PDFDocument.create()

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
      pages.forEach((page) => mergedPdf.addPage(page))
    }

    const mergedBytes = await mergedPdf.save({ useObjectStreams: true })
    const base64 = Buffer.from(mergedBytes).toString('base64')
    const downloadUrl = `data:application/pdf;base64,${base64}`

    return NextResponse.json({ success: true, downloadUrl })
  } catch (error) {
    console.error('Merge error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to merge PDFs' },
      { status: 500 }
    )
  }
}
