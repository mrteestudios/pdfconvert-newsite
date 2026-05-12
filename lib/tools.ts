import { FileDown, Merge, Scissors, FileType, Image, Lock, Unlock, RotateCw } from 'lucide-react'

export interface Tool {
  id: string
  name: string
  description: string
  icon: typeof FileDown
  href: string
  color: string
  seoKeywords: string[]
}

export const TOOLS: Tool[] = [
  {
    id: 'compress',
    name: 'Compress PDF',
    description: 'Reduce PDF file size while maintaining quality. Perfect for email attachments.',
    icon: FileDown,
    href: '/tools/compress',
    color: 'bg-red-500',
    seoKeywords: ['compress pdf', 'reduce pdf size', 'pdf too large', 'pdf for email'],
  },
  {
    id: 'merge',
    name: 'Merge PDFs',
    description: 'Combine multiple PDF files into one document in seconds.',
    icon: Merge,
    href: '/tools/merge',
    color: 'bg-blue-500',
    seoKeywords: ['merge pdf', 'combine pdf', 'join pdf files'],
  },
  {
    id: 'split',
    name: 'Split PDF',
    description: 'Extract pages or split a PDF into multiple smaller files.',
    icon: Scissors,
    href: '/tools/split',
    color: 'bg-green-500',
    seoKeywords: ['split pdf', 'extract pdf pages', 'separate pdf'],
  },
  {
    id: 'convert',
    name: 'PDF to Word',
    description: 'Convert PDF documents to editable Word files.',
    icon: FileType,
    href: '/tools/convert',
    color: 'bg-amber-500',
    seoKeywords: ['pdf to word', 'pdf to docx', 'convert pdf'],
  },
  {
    id: 'jpg-to-pdf',
    name: 'JPG to PDF',
    description: 'Convert images to PDF format quickly and easily.',
    icon: Image,
    href: '/tools/jpg-to-pdf',
    color: 'bg-pink-500',
    seoKeywords: ['jpg to pdf', 'image to pdf', 'photo to pdf'],
  },
  {
    id: 'protect',
    name: 'Protect PDF',
    description: 'Add password protection to your PDF documents.',
    icon: Lock,
    href: '/tools/protect',
    color: 'bg-slate-600',
    seoKeywords: ['protect pdf', 'password pdf', 'secure pdf'],
  },
  {
    id: 'unlock',
    name: 'Unlock PDF',
    description: 'Remove password protection from PDF files.',
    icon: Unlock,
    href: '/tools/unlock',
    color: 'bg-teal-500',
    seoKeywords: ['unlock pdf', 'remove password pdf'],
  },
  {
    id: 'rotate',
    name: 'Rotate PDF',
    description: 'Rotate PDF pages to the correct orientation.',
    icon: RotateCw,
    href: '/tools/rotate',
    color: 'bg-indigo-500',
    seoKeywords: ['rotate pdf', 'flip pdf pages'],
  },
]
