export const dynamic = 'force-dynamic'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { createClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'Terms of Service | PDFly',
  description: 'Terms and conditions for using PDFly.',
}

const LAST_UPDATED = 'May 2026'

export default async function TermsPage() {
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
          <h1 className="mb-2 text-4xl font-bold">Terms of Service</h1>
          <p className="mb-12 text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>

          <div className="space-y-10 text-muted-foreground leading-relaxed">

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing or using PDFly (&quot;the Service&quot;), you agree to be bound by these
                Terms of Service. If you do not agree, please do not use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">2. Description of Service</h2>
              <p>
                PDFly provides browser-based tools to compress, merge, split, and convert PDF
                files. Core tools are available free of charge. A paid Pro subscription unlocks
                higher usage limits and additional features.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">3. Acceptable Use</h2>
              <p className="mb-3">You agree not to use PDFly to:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Upload or process files containing illegal content</li>
                <li>Infringe upon the intellectual property rights of others</li>
                <li>Attempt to reverse-engineer, scrape, or abuse the service</li>
                <li>Upload malware, viruses, or otherwise harmful files</li>
                <li>Circumvent rate limits or usage restrictions through automated means</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">4. Free Plan Limits</h2>
              <p>
                Free accounts may process up to 3 files per day per tool. File size is limited to
                50 MB per upload. We reserve the right to adjust these limits at any time.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">5. Pro Subscriptions &amp; Billing</h2>
              <p>
                Pro subscriptions are billed monthly or annually via Stripe. You may cancel at
                any time from your account dashboard; your Pro access continues until the end of
                the current billing period. We do not offer refunds for partial billing periods
                except where required by law.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">6. Intellectual Property</h2>
              <p>
                You retain full ownership of any files you upload. By uploading files, you grant
                PDFly a temporary, limited licence to process them solely for the purpose of
                delivering the requested tool output to you. We claim no ownership over your content.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">7. Disclaimers</h2>
              <p>
                The Service is provided &quot;as is&quot; without warranties of any kind. We do not
                guarantee that the Service will be error-free or uninterrupted. We are not
                responsible for any loss of data arising from use of the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">8. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, PDFly&apos;s liability for any claim arising
                from use of the Service is limited to the amount you paid us in the 12 months
                preceding the claim.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">9. Changes to Terms</h2>
              <p>
                We may update these terms at any time. Continued use of the Service after changes
                are posted constitutes acceptance of the revised terms. We will notify registered
                users of material changes by email.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">10. Contact</h2>
              <p>
                Questions about these terms? Contact us at{' '}
                <a href="mailto:legal@pdfly.io" className="text-primary underline">
                  legal@pdfly.io
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
