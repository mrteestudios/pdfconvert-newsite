import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import type { Tool } from '@/lib/tools'

interface ToolCardProps {
  tool: Tool
}

export function ToolCard({ tool }: ToolCardProps) {
  const Icon = tool.icon

  return (
    <Link href={tool.href}>
      <Card className="group h-full cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1">
        <CardContent className="flex flex-col items-center p-6 text-center">
          <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl ${tool.color} transition-transform group-hover:scale-110`}>
            <Icon className="h-7 w-7 text-white" />
          </div>
          <h3 className="mb-2 font-semibold text-foreground">{tool.name}</h3>
          <p className="text-sm text-muted-foreground">{tool.description}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
