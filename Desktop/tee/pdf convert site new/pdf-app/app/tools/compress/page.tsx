'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { UploadBox } from '@/components/upload-box'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileDown, Loader2, Download, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

type Status = 'idle' | 'uploading' | 'processing' | 'completed' | 'error'

export default function CompressPage() {
  const [files, setFiles] = useState<File[]>([])
  const [status, setStatus] = useState<Status>('idle')
  const [result, setResult] = useState<{ url: string; originalSize: number; compressedSize: number } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleUpload = (uploadedFiles: File[]) => {
    setFiles(uploadedFiles)
    setStatus('idle')
    setResult(null)
    setError(null)
  }

  const handleCompress = async () => {
    if (files.length === 0) return

    setStatus('uploading')
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', files[0])

      setStatus('processing')

      const response = await fetch('/api/compress', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to compress PDF')
      }

      setResult({
        url: data.downloadUrl,
        originalSize: files[0].size,
        compressedSize: data.compressedSize,
      })
      setStatus('completed')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setStatus('error')
    }
  }

  const compressionRatio = result 
    ? Math.round((1 - result.compressedSize / result.originalSize) * 100) 
    : 0

  return (
    <div className="flex min-h-screen flex-col">
      <Header user={null} />
      
      <main className="flex-1 bg-muted/30 py-12">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500">
              <FileDown className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold">Compress PDF</h1>
            <p className="mt-2 text-muted-foreground">
              Reduce your PDF file size while maintaining quality
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Upload your PDF</CardTitle>
              <CardDescription>
                Select or drag and drop your PDF file to compress
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {status === 'idle' || status === 'error' ? (
                <>
                  <UploadBox onUpload={handleUpload} accept="application/pdf" />
                  
                  {error && (
                    <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-4 text-destructive">
                      <AlertCircle className="h-5 w-5" />
                      <p>{error}</p>
                    </div>
                  )}

                  {files.length > 0 && (
                    <Button 
                      onClick={handleCompress} 
                      className="w-full" 
                      size="lg"
                    >
                      Compress PDF
                    </Button>
                  )}
                </>
              ) : status === 'uploading' || status === 'processing' ? (
                <div className="py-12 text-center">
                  <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
                  <p className="text-lg font-medium">
                    {status === 'uploading' ? 'Uploading...' : 'Compressing your PDF...'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    This may take a few moments
                  </p>
                </div>
              ) : status === 'completed' && result ? (
                <div className="space-y-6 py-4 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Compression Complete!</h3>
                    <p className="mt-1 text-muted-foreground">
                      Your PDF has been compressed successfully
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 rounded-lg bg-muted p-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Original</p>
                      <p className="text-lg font-semibold">
                        {(result.originalSize / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Compressed</p>
                      <p className="text-lg font-semibold">
                        {(result.compressedSize / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Saved</p>
                      <p className="text-lg font-semibold text-green-600">
                        {compressionRatio}%
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <a href={result.url} target="_blank" rel="noopener noreferrer">
                      <Button size="lg" className="w-full sm:w-auto">
                        <Download className="mr-2 h-4 w-4" />
                        Download Compressed PDF
                      </Button>
                    </a>
                    <Button 
                      variant="outline" 
                      size="lg"
                      onClick={() => {
                        setFiles([])
                        setStatus('idle')
                        setResult(null)
                      }}
                    >
                      Compress Another
                    </Button>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>

          {/* Info Section */}
          <div className="mt-8 grid gap-4 text-center sm:grid-cols-3">
            <div className="rounded-lg bg-background p-4">
              <h3 className="font-semibold">Fast Processing</h3>
              <p className="text-sm text-muted-foreground">
                Compress PDFs in seconds
              </p>
            </div>
            <div className="rounded-lg bg-background p-4">
              <h3 className="font-semibold">Maintain Quality</h3>
              <p className="text-sm text-muted-foreground">
                Readable text and clear images
              </p>
            </div>
            <div className="rounded-lg bg-background p-4">
              <h3 className="font-semibold">Secure</h3>
              <p className="text-sm text-muted-foreground">
                Files deleted after processing
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              Back to all tools
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
