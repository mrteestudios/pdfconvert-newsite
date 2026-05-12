export const dynamic = 'force-dynamic'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { createClient } from '@/lib/supabase/server'
import { Mail, MessageSquare, Clock } from 'lucide-react'

export const metadata = {
  title: 'Contact | PDFly',
  description: 'Get in touch with the PDFly team.',
}

export default async function ContactPage() {
  let user = null
  try {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch {}

  return (
    <div className="flex min-h-screen flex-col">
      <Header user={user} />

      <main className="flex-1">
        <section className="bg-gradient-to-b from-primary/5 to-background py-20">
          <div className="container mx-auto max-w-3xl px-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Get in Touch</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Have a question, bug report, or feature request? We&apos;d love to hear from you.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto max-w-4xl px-4">
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  icon: Mail,
                  title: 'General Enquiries',
                  description: 'Questions about the product, your account, or anything else.',
                  contact: 'hello@pdfly.io',
                  href: 'mailto:hello@pdfly.io',
                },
                {
                  icon: MessageSquare,
                  title: 'Support',
                  description: 'Having trouble with a tool or your subscription? We\'re here.',
                  contact: 'support@pdfly.io',
                  href: 'mailto:support@pdfly.io',
                },
                {
                  icon: Clock,
                  title: 'Response Time',
                  description: 'We aim to reply within 1 business day, Monday to Friday.',
                  contact: null,
                  href: null,
                },
              ].map(({ icon: Icon, title, description, contact, href }) => (
                <div key={title} className="rounded-xl border bg-muted/30 p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 font-semibold">{title}</h3>
                  <p className="mb-4 text-sm text-muted-foreground">{description}</p>
                  {href && contact && (
                    <a
                      href={href}
                      className="text-sm font-medium text-primary underline underline-offset-4 hover:opacity-80"
                    >
                      {contact}
                    </a>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-16 rounded-xl border bg-muted/30 p-8 text-center">
              <h2 className="mb-2 text-xl font-semibold">Found a bug?</h2>
              <p className="text-muted-foreground">
                Please include the tool you were using, file size, browser, and a description of
                what happened. Screenshots are always helpful. Email us at{' '}
                <a href="mailto:bugs@pdfly.io" className="text-primary underline underline-offset-4">
                  bugs@pdfly.io
                </a>
                .
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
