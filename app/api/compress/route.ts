import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import CloudConvert from 'cloudconvert'

const cloudConvert = process.env.CLOUDCONVERT_API_KEY 
  ? new CloudConvert(process.env.CLOUDCONVERT_API_KEY)
  : null

export async function POST(request: NextRequest) {
  try {
    // Check if CloudConvert API key is configured
    if (!cloudConvert) {
      return NextResponse.json(
        { error: 'PDF processing service not configured. Please add CLOUDCONVERT_API_KEY.' },
        { status: 500 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Check file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'File must be a PDF' }, { status: 400 })
    }

    // Check file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 50MB' }, { status: 400 })
    }

    // Get current user (optional - for tracking)
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Check daily limit for free users
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('plan, daily_conversions, last_conversion_date')
        .eq('id', user.id)
        .single()

      if (profile) {
        const today = new Date().toISOString().split('T')[0]
        const lastDate = profile.last_conversion_date

        // Reset counter if new day
        if (lastDate !== today) {
          await supabase
            .from('profiles')
            .update({ daily_conversions: 0, last_conversion_date: today })
            .eq('id', user.id)
        } else if (profile.plan === 'free' && profile.daily_conversions >= 3) {
          return NextResponse.json(
            { error: 'Daily limit reached. Upgrade to Pro for unlimited conversions.' },
            { status: 429 }
          )
        }
      }
    }

    // Create CloudConvert job
    const job = await cloudConvert.jobs.create({
      tasks: {
        'upload-file': {
          operation: 'import/upload',
        },
        'optimize-pdf': {
          operation: 'optimize',
          input: ['upload-file'],
          input_format: 'pdf',
          profile: 'web', // web, print, ebook, or prepress
        },
        'export-file': {
          operation: 'export/url',
          input: ['optimize-pdf'],
        },
      },
    })

    // Get upload task
    const uploadTask = job.tasks.find(t => t.name === 'upload-file')
    if (!uploadTask || !uploadTask.result?.form) {
      throw new Error('Failed to create upload task')
    }

    // Upload file to CloudConvert
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

    // Wait for job completion
    const completedJob = await cloudConvert.jobs.wait(job.id)

    // Get export task result
    const exportTask = completedJob.tasks.find(t => t.name === 'export-file')
    if (!exportTask || !exportTask.result?.files?.[0]) {
      throw new Error('Failed to get compressed file')
    }

    const downloadUrl = exportTask.result.files[0].url
    const compressedSize = exportTask.result.files[0].size || file.size * 0.7

    // Track conversion for logged-in users
    if (user) {
      // Increment daily conversions
      await supabase.rpc('increment_daily_conversions', { user_id: user.id })
      
      // Save file record
      await supabase.from('files').insert({
        user_id: user.id,
        original_name: file.name,
        tool_type: 'compress',
        file_size: file.size,
        status: 'completed',
        download_url: downloadUrl,
      })
    }

    return NextResponse.json({
      success: true,
      downloadUrl,
      compressedSize,
    })
  } catch (error) {
    console.error('Compress error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to compress PDF' },
      { status: 500 }
    )
  }
}
