export const dynamic = 'force-dynamic'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { createClient } from '@/lib/supabase/server'
import { Shield, Zap, Globe, Users, Heart, Lock } from 'lucide-react'

export const metadata = {
  title: 'About Us | PDFly',
  description: 'Learn about PDFly — the free, fast, and secure online PDF toolkit.',
}

export default async function AboutPage() {
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
        {/* Hero */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-20">
          <div className="container mx-auto max-w-3xl px-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              About PDFly
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              We believe working with PDFs shouldn&apos;t be painful. PDFly gives everyone access to
              fast, secure, browser-based PDF tools — for free, no sign-up required.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16">
          <div className="container mx-auto max-w-3xl px-4">
            <h2 className="mb-6 text-2xl font-bold">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              PDFly was built out of frustration with bloated, ad-ridden, or paywalled PDF tools.
              Our goal is simple: give people a clean, reliable set of PDF utilities that just work.
              Whether you&apos;re compressing a CV to email, merging lecture notes, splitting a
              contract, or converting a report to Word — PDFly has you covered in seconds.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="border-t bg-muted/30 py-16">
          <div className="container mx-auto max-w-4xl px-4">
            <h2 className="mb-12 text-center text-2xl font-bold">What We Stand For</h2>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  icon: Lock,
                  title: 'Privacy First',
                  desc: 'Your files are processed securely and never stored beyond what is needed to complete your task. We do not sell your data.',
                },
                {
                  icon: Zap,
                  title: 'Speed',
                  desc: 'We use best-in-class processing pipelines so you spend seconds, not minutes, waiting for your PDF.',
                },
                {
                  icon: Heart,
                  title: 'Free for Everyone',
                  desc: 'Core tools are free forever. Pro plans exist to fund the service, not to lock people out of basic functionality.',
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="rounded-xl border bg-background p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 font-semibold">{title}</h3>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16">
          <div className="container mx-auto max-w-4xl px-4">
            <div className="grid gap-8 text-center md:grid-cols-3">
              {[
                { value: '500K+', label: 'PDFs Processed' },
                { value: '4', label: 'Free Tools' },
                { value: '99.9%', label: 'Uptime' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="text-4xl font-bold text-primary">{value}</p>
                  <p className="mt-2 text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
