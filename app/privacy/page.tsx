import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { createClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'Privacy Policy | PDFly',
  description: 'How PDFly collects, uses, and protects your information.',
}

const LAST_UPDATED = 'May 2026'

export default async function PrivacyPage() {
  let user = null
  try {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch {}

  return (
    <div className="flex min-h-screen flex-col">
      <Header user={user} />

      <main className="flex-1 py-16">
        <div className="container mx-auto max-w-3xl px-4">
          <h1 className="mb-2 text-4xl font-bold">Privacy Policy</h1>
          <p className="mb-12 text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-10 text-muted-foreground leading-relaxed">

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">1. Introduction</h2>
              <p>
                PDFly (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy.
                This Privacy Policy explains how we collect, use, disclose, and safeguard your
                information when you use our website and services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">2. Information We Collect</h2>
              <p className="mb-3"><strong className="text-foreground">Files you upload:</strong> Files are transmitted securely for processing and are automatically deleted from our servers within 1 hour of processing. We do not read, index, or retain the content of your files.</p>
              <p className="mb-3"><strong className="text-foreground">Account information:</strong> If you create an account, we collect your email address and a hashed password. We do not collect payment card details directly — payments are handled by Stripe.</p>
              <p><strong className="text-foreground">Usage data:</strong> We collect anonymised usage statistics (pages visited, tool used, file size category) to improve the service. This data is never linked to your identity.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">3. How We Use Your Information</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>To process your PDF files as requested</li>
                <li>To manage your account and subscription</li>
                <li>To send transactional emails (password reset, receipt)</li>
                <li>To improve and debug the service using anonymised analytics</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">4. File Handling &amp; Security</h2>
              <p>
                All file transfers are encrypted in transit using TLS 1.2+. Files are processed
                in isolated environments and purged within 1 hour. We do not share your files
                with third parties except the processing provider (CloudConvert), who operate
                under strict data processing agreements.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">5. Cookies</h2>
              <p>
                We use strictly necessary cookies to maintain your session. We do not use
                advertising or tracking cookies. Our analytics are privacy-preserving and
                cookieless.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">6. Third-Party Services</h2>
              <p>We use the following third-party services:</p>
              <ul className="list-disc list-inside space-y-2 mt-3">
                <li><strong className="text-foreground">Supabase</strong> — authentication and database</li>
                <li><strong className="text-foreground">CloudConvert</strong> — PDF processing</li>
                <li><strong className="text-foreground">Stripe</strong> — payment processing</li>
              </ul>
              <p className="mt-3">Each provider has their own privacy policy and data processing terms.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">7. Your Rights</h2>
              <p>
                You may request access to, correction of, or deletion of your personal data at any
                time by contacting us at <a href="mailto:privacy@pdfly.io" className="text-primary underline">privacy@pdfly.io</a>.
                Account holders can delete their accounts from the dashboard settings page.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">8. Changes to This Policy</h2>
              <p>
                We may update this policy from time to time. We will notify registered users of
                material changes by email. Continued use of the service after changes constitutes
                acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">9. Contact</h2>
              <p>
                Questions about this policy? Email us at{' '}
                <a href="mailto:privacy@pdfly.io" className="text-primary underline">
                  privacy@pdfly.io
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
