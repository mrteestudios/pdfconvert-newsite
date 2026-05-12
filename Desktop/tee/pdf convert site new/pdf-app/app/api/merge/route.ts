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
    const files: File[] = []
    
    // Collect all files from formData
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('file') && value instanceof File) {
        files.push(value)
      }
    }

    if (files.length < 2) {
      return NextResponse.json({ error: 'At least 2 PDF files are required' }, { status: 400 })
    }

    // Check file types
    for (const file of files) {
      if (file.type !== 'application/pdf') {
        return NextResponse.json({ error: 'All files must be PDFs' }, { status: 400 })
      }
    }

    let user = null
    let supabase: Awaited<ReturnType<typeof createClient>> | null = null
    try {
      supabase = await createClient()
      const { data } = await supabase.auth.getUser()
      user = data.user
    } catch {}

    // Build tasks for CloudConvert
    const uploadTasks: Record<string, { operation: string }> = {}
    const mergeInputs: string[] = []
    
    files.forEach((_, index) => {
      const taskName = `upload-file-${index}`
      uploadTasks[taskName] = { operation: 'import/upload' }
      mergeInputs.push(taskName)
    })

    const job = await cloudConvert.jobs.create({
      tasks: {
        ...uploadTasks,
        'merge-pdfs': {
          operation: 'merge',
          input: mergeInputs,
          output_format: 'pdf',
        },
        'export-file': {
          operation: 'export/url',
          input: ['merge-pdfs'],
        },
      },
    })

    // Upload each file
    for (let i = 0; i < files.length; i++) {
      const uploadTask = job.tasks.find(t => t.name === `upload-file-${i}`)
      if (!uploadTask || !uploadTask.result?.form) continue

      const file = files[i]
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
    }

    // Wait for job completion
    const completedJob = await cloudConvert.jobs.wait(job.id)

    const exportTask = completedJob.tasks.find(t => t.name === 'export-file')
    if (!exportTask || !exportTask.result?.files?.[0]) {
      throw new Error('Failed to get merged file')
    }

    const downloadUrl = exportTask.result.files[0].url

    // Track for logged-in users
    if (user && supabase) {
      await supabase.from('files').insert({
        user_id: user.id,
        original_name: `merged_${files.length}_files.pdf`,
        tool_type: 'merge',
        file_size: files.reduce((sum, f) => sum + f.size, 0),
        status: 'completed',
        download_url: downloadUrl,
      })
    }

    return NextResponse.json({ success: true, downloadUrl })
  } catch (error) {
    console.error('Merge error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to merge PDFs' },
      { status: 500 }
    )
  }
}
