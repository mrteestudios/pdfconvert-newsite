import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Mail } from 'lucide-react'

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Check your email</CardTitle>
          <CardDescription>
            We&apos;ve sent you a confirmation link. Please check your email to verify your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-sm text-muted-foreground">
            Once verified, you&apos;ll be able to access all PDFly features.
          </p>
          <Link href="/">
            <Button variant="outline" className="w-full">
              <FileText className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
