import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument } from 'pdf-lib'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

function parsePageRanges(input: string, totalPages: number): number[] {
  const pages: number[] = []
  const parts = input.split(',').map(p => p.trim())

  for (const part of parts) {
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(n => parseInt(n.trim(), 10))
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = start; i <= Math.min(end, totalPages); i++) {
          pages.push(i)
        }
      }
    } else {
      const n = parseInt(part, 10)
      if (!isNaN(n) && n >= 1 && n <= totalPages) {
        pages.push(n)
      }
    }
  }

  // Remove duplicates and sort
  return [...new Set(pages)].sort((a, b) => a - b)
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const pages = (formData.get('pages') as string) || 'all'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'File must be a PDF' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const sourcePdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
    const totalPages = sourcePdf.getPageCount()

    const newPdf = await PDFDocument.create()

    let pageIndices: number[]

    if (pages === 'all') {
      pageIndices = sourcePdf.getPageIndices()
    } else {
      const pageNumbers = parsePageRanges(pages, totalPages)
      if (pageNumbers.length === 0) {
        return NextResponse.json(
          { error: `Invalid page range. PDF has ${totalPages} pages.` },
          { status: 400 }
        )
      }
      // Convert 1-based page numbers to 0-based indices
      pageIndices = pageNumbers.map(n => n - 1)
    }

    const copiedPages = await newPdf.copyPages(sourcePdf, pageIndices)
    copiedPages.forEach((page) => newPdf.addPage(page))

    const splitBytes = await newPdf.save({ useObjectStreams: true })
    const base64 = Buffer.from(splitBytes).toString('base64')
    const downloadUrl = `data:application/pdf;base64,${base64}`

    return NextResponse.json({
      success: true,
      downloadUrl,
      pageCount: pageIndices.length,
    })
  } catch (error) {
    console.error('Split error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to split PDF' },
      { status: 500 }
    )
  }
}
