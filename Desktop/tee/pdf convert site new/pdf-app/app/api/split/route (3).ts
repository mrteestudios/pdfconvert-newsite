import { NextRequest, NextResponse } from 'next/server'
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx'
// @ts-ignore
import pdfParse from 'pdf-parse/lib/pdf-parse.js'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

function buildDocxParagraphs(text: string) {
  const lines = text.split('\n')
  const paragraphs: Paragraph[] = []

  for (const line of lines) {
    const trimmed = line.trim()

    if (!trimmed) {
      // Empty line = spacing between paragraphs
      paragraphs.push(new Paragraph({ text: '' }))
      continue
    }

    // Heuristic: short lines in ALL CAPS or ending without punctuation = heading
    const isLikelyHeading =
      trimmed.length < 80 &&
      (trimmed === trimmed.toUpperCase() || /^[A-Z][^.!?]*$/.test(trimmed))

    if (isLikelyHeading && trimmed.length > 3) {
      paragraphs.push(
        new Paragraph({
          text: trimmed,
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 240, after: 120 },
        })
      )
    } else {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: trimmed,
              size: 24, // 12pt
            }),
          ],
          spacing: { after: 120 },
          alignment: AlignmentType.LEFT,
        })
      )
    }
  }

  return paragraphs
}

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

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Extract text from PDF
    const pdfData = await pdfParse(buffer)
    const extractedText = pdfData.text || ''

    if (!extractedText.trim()) {
      return NextResponse.json(
        { error: 'Could not extract text from this PDF. It may be a scanned image.' },
        { status: 422 }
      )
    }

    // Build DOCX document
    const fileName = file.name.replace(/\.pdf$/i, '')
    const paragraphs = buildDocxParagraphs(extractedText)

    const doc = new Document({
      title: fileName,
      description: `Converted from ${file.name}`,
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              text: fileName,
              heading: HeadingLevel.HEADING_1,
              spacing: { after: 240 },
            }),
            ...paragraphs,
          ],
        },
      ],
    })

    const docxBuffer = await Packer.toBuffer(doc)
    const base64 = docxBuffer.toString('base64')
    const downloadUrl = `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${base64}`

    return NextResponse.json({ success: true, downloadUrl })
  } catch (error) {
    console.error('Convert error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to convert PDF' },
      { status: 500 }
    )
  }
}
