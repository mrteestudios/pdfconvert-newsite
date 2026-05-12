import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import CloudConvert from 'cloudconvert'

const cloudConvert = process.env.CLOUDCONVERT_API_KEY 
  ? new CloudConvert(process.env.CLOUDCONVERT_API_KEY)
  : null

export async function POST(request: NextRequest) {
  try {
    if (!cloudConvert) {
      return NextResponse.json(
        { error: 'PDF processing service not configured. Please add CLOUDCONVERT_API_KEY.' },
        { status: 500 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const pages = formData.get('pages') as string || 'all'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'File must be a PDF' }, { status: 400 })
    }

    let user = null
    let supabase: Awaited<ReturnType<typeof createClient>> | null = null
    try {
      supabase = await createClient()
      const { data } = await supabase.auth.getUser()
      user = data.user
    } catch {}

    // Parse pages parameter
    const splitOptions: Record<string, unknown> = {
      operation: 'convert',
      input: ['upload-file'],
      input_format: 'pdf',
      output_format: 'pdf',
    }

    if (pages !== 'all') {
      splitOptions.pages = pages
    }

    const job = await cloudConvert.jobs.create({
      tasks: {
        'upload-file': {
          operation: 'import/upload',
        },
        'split-pdf': splitOptions,
        'export-file': {
          operation: 'export/url',
          input: ['split-pdf'],
        },
      },
    })

    const uploadTask = job.tasks.find(t => t.name === 'upload-file')
    if (!uploadTask || !uploadTask.result?.form) {
      throw new Error('Failed to create upload task')
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const uploadFormData = new FormData()
    for (const [key, value] of Object.entries(uploadTask.result.form.parameters)) {
      uploadFormData.append(key, value as string)
    }
    uploadFormData.append('file', new Blob([buffer]), file.name)

    await fetch(uploadTask.result.form.url, {
      method: 'POST',
      body: uploadFormData,
    })

    const completedJob = await cloudConvert.jobs.wait(job.id)

    const exportTask = completedJob.tasks.find(t => t.name === 'export-file')
    if (!exportTask || !exportTask.result?.files?.[0]) {
      throw new Error('Failed to get split file')
    }

    const downloadUrl = exportTask.result.files[0].url

    if (user && supabase) {
      await supabase.from('files').insert({
        user_id: user.id,
        original_name: file.name,
        tool_type: 'split',
        file_size: file.size,
        status: 'completed',
        download_url: downloadUrl,
      })
    }

    return NextResponse.json({ success: true, downloadUrl })
  } catch (error) {
    console.error('Split error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to split PDF' },
      { status: 500 }
    )
  }
}
