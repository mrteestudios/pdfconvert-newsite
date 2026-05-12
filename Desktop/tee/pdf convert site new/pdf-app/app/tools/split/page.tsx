'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { UploadBox } from '@/components/upload-box'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Scissors, Loader2, Download, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

type Status = 'idle' | 'uploading' | 'processing' | 'completed' | 'error'

export default function SplitPage() {
  const [files, setFiles] = useState<File[]>([])
  const [pageRange, setPageRange] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [result, setResult] = useState<{ url: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleUpload = (uploadedFiles: File[]) => {
    setFiles(uploadedFiles)
    setStatus('idle')
    setResult(null)
    setError(null)
  }

  const handleSplit = async () => {
    if (files.length === 0) return

    setStatus('uploading')
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', files[0])
      formData.append('pages', pageRange || 'all')

      setStatus('processing')

      const response = await fetch('/api/split', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to split PDF')
      }

      setResult({ url: data.downloadUrl })
      setStatus('completed')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setStatus('error')
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header user={null} />
      
      <main className="flex-1 bg-muted/30 py-12">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500">
              <Scissors className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold">Split PDF</h1>
            <p className="mt-2 text-muted-foreground">
              Extract specific pages or split into multiple files
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Upload your PDF</CardTitle>
              <CardDescription>
                Select the PDF you want to split
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {status === 'idle' || status === 'error' ? (
                <>
                  <UploadBox onUpload={handleUpload} accept="application/pdf" />
                  
                  {files.length > 0 && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="pages">Page Range (optional)</Label>
                        <Input
                          id="pages"
                          placeholder="e.g., 1-3, 5, 7-10 (leave empty for all pages)"
                          value={pageRange}
                          onChange={(e) => setPageRange(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          Specify which pages to extract. Leave empty to split each page into separate files.
                        </p>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-4 text-destructive">
                      <AlertCircle className="h-5 w-5" />
                      <p>{error}</p>
                    </div>
                  )}

                  {files.length > 0 && (
                    <Button 
                      onClick={handleSplit} 
                      className="w-full" 
                      size="lg"
                    >
                      Split PDF
                    </Button>
                  )}
                </>
              ) : status === 'uploading' || status === 'processing' ? (
                <div className="py-12 text-center">
                  <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
                  <p className="text-lg font-medium">
                    {status === 'uploading' ? 'Uploading...' : 'Splitting your PDF...'}
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
                    <h3 className="text-xl font-semibold">Split Complete!</h3>
                    <p className="mt-1 text-muted-foreground">
                      Your PDF has been split successfully
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <a href={result.url} target="_blank" rel="noopener noreferrer">
                      <Button size="lg" className="w-full sm:w-auto">
                        <Download className="mr-2 h-4 w-4" />
                        Download Split PDF
                      </Button>
                    </a>
                    <Button 
                      variant="outline" 
                      size="lg"
                      onClick={() => {
                        setFiles([])
                        setStatus('idle')
                        setResult(null)
                        setPageRange('')
                      }}
                    >
                      Split Another
                    </Button>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>

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
