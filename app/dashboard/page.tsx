import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Header } from '@/components/header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { FileText, Crown, Zap, Clock, Download } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Fetch recent files
  const { data: files } = await supabase
    .from('files')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10)

  const isPro = profile?.plan === 'pro'
  const dailyLimit = isPro ? 'Unlimited' : '3'
  const usedToday = profile?.daily_conversions ?? 0

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Welcome back, {profile?.name || user.email?.split('@')[0]}
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage your files and account settings
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Plan Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
              <Crown className={`h-5 w-5 ${isPro ? 'text-amber-500' : 'text-muted-foreground'}`} />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{isPro ? 'Pro' : 'Free'}</span>
                <Badge variant={isPro ? 'default' : 'secondary'}>
                  {isPro ? 'Active' : 'Limited'}
                </Badge>
              </div>
              {!isPro && (
                <Link href="/pricing">
                  <Button size="sm" className="mt-4 w-full">
                    Upgrade to Pro
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>

          {/* Daily Usage Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Daily Conversions</CardTitle>
              <Zap className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {usedToday} / {dailyLimit}
              </div>
              <p className="text-sm text-muted-foreground">
                {isPro ? 'Unlimited conversions' : 'Resets daily at midnight'}
              </p>
            </CardContent>
          </Card>

          {/* Total Files Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Files</CardTitle>
              <FileText className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{files?.length ?? 0}</div>
              <p className="text-sm text-muted-foreground">
                Files processed
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Start a new conversion</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              <Link href="/tools/compress">
                <Button variant="outline" className="h-auto w-full flex-col py-6">
                  <FileText className="mb-2 h-6 w-6" />
                  Compress PDF
                </Button>
              </Link>
              <Link href="/tools/merge">
                <Button variant="outline" className="h-auto w-full flex-col py-6">
                  <FileText className="mb-2 h-6 w-6" />
                  Merge PDFs
                </Button>
              </Link>
              <Link href="/tools/split">
                <Button variant="outline" className="h-auto w-full flex-col py-6">
                  <FileText className="mb-2 h-6 w-6" />
                  Split PDF
                </Button>
              </Link>
              <Link href="/tools/convert">
                <Button variant="outline" className="h-auto w-full flex-col py-6">
                  <FileText className="mb-2 h-6 w-6" />
                  PDF to Word
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Files */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Files</CardTitle>
            <CardDescription>Your recently processed files</CardDescription>
          </CardHeader>
          <CardContent>
            {files && files.length > 0 ? (
              <div className="space-y-4">
                {files.map((file) => (
                  <div 
                    key={file.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{file.original_name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline">{file.tool_type}</Badge>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(file.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    {file.download_url && file.status === 'completed' && (
                      <a href={file.download_url} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="outline">
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <FileText className="mx-auto mb-4 h-12 w-12 opacity-50" />
                <p>No files processed yet</p>
                <p className="text-sm">Start by using one of our PDF tools above</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
