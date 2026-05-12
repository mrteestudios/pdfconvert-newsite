import Link from 'next/link'
import { FileText } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <FileText className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">PDFly</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Fast, secure, and free online PDF tools. No installation required.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Tools</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/tools/compress" className="hover:text-foreground">Compress PDF</Link></li>
              <li><Link href="/tools/merge" className="hover:text-foreground">Merge PDFs</Link></li>
              <li><Link href="/tools/split" className="hover:text-foreground">Split PDF</Link></li>
              <li><Link href="/tools/convert" className="hover:text-foreground">PDF to Word</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/pricing" className="hover:text-foreground">Pricing</Link></li>
              <li><Link href="/about" className="hover:text-foreground">About</Link></li>
              <li><Link href="/contact" className="hover:text-foreground">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-foreground">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} PDFly. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
