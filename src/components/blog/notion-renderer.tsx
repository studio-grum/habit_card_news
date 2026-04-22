import Image from 'next/image'
import type { Block, RichText } from '@/lib/types/notion'

interface NotionRendererProps {
  blocks: Block[]
}

function renderRichText(richTexts: RichText[]): React.ReactNode {
  return richTexts.map((rt, i) => {
    let node: React.ReactNode = rt.plain_text
    const { bold, italic, code, strikethrough, underline } = rt.annotations

    if (code)
      node = (
        <code
          key={i}
          className="bg-muted rounded px-1 py-0.5 font-mono text-sm"
        >
          {node}
        </code>
      )
    if (bold) node = <strong key={i}>{node}</strong>
    if (italic) node = <em key={i}>{node}</em>
    if (strikethrough) node = <s key={i}>{node}</s>
    if (underline) node = <u key={i}>{node}</u>
    if (rt.href)
      node = (
        <a
          key={i}
          href={rt.href}
          className="text-primary underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {node}
        </a>
      )

    return <span key={i}>{node}</span>
  })
}

function getRichTexts(block: Block): RichText[] {
  const data = block[block.type] as { rich_text?: RichText[] } | undefined
  return data?.rich_text ?? []
}

function renderBlock(block: Block): React.ReactNode {
  switch (block.type) {
    case 'paragraph':
      return (
        <p key={block.id} className="mb-4 leading-7">
          {renderRichText(getRichTexts(block))}
        </p>
      )
    case 'heading_1':
      return (
        <h1 key={block.id} className="mt-8 mb-4 text-3xl font-bold">
          {renderRichText(getRichTexts(block))}
        </h1>
      )
    case 'heading_2':
      return (
        <h2 key={block.id} className="mt-6 mb-3 text-2xl font-bold">
          {renderRichText(getRichTexts(block))}
        </h2>
      )
    case 'heading_3':
      return (
        <h3 key={block.id} className="mt-4 mb-2 text-xl font-semibold">
          {renderRichText(getRichTexts(block))}
        </h3>
      )
    case 'code': {
      const codeData = block[block.type] as {
        rich_text: RichText[]
        language?: string
      }
      return (
        <pre
          key={block.id}
          className="bg-muted mb-4 overflow-x-auto rounded-lg p-4"
        >
          <code className="font-mono text-sm">
            {codeData.rich_text.map(rt => rt.plain_text).join('')}
          </code>
        </pre>
      )
    }
    case 'quote':
      return (
        <blockquote
          key={block.id}
          className="border-primary mb-4 border-l-4 pl-4 italic"
        >
          {renderRichText(getRichTexts(block))}
        </blockquote>
      )
    case 'bulleted_list_item':
      return (
        <li key={block.id} className="mb-1 ml-6 list-disc">
          {renderRichText(getRichTexts(block))}
        </li>
      )
    case 'numbered_list_item':
      return (
        <li key={block.id} className="mb-1 ml-6 list-decimal">
          {renderRichText(getRichTexts(block))}
        </li>
      )
    case 'image': {
      const imgData = block[block.type] as {
        type: 'external' | 'file'
        external?: { url: string }
        file?: { url: string }
        caption?: RichText[]
      }
      const src =
        imgData.type === 'external'
          ? (imgData.external?.url ?? '')
          : (imgData.file?.url ?? '')
      const alt = imgData.caption?.map(rt => rt.plain_text).join('') ?? ''
      return (
        <figure key={block.id} className="mb-6">
          <div
            className="relative w-full overflow-hidden rounded-lg"
            style={{ paddingTop: '56.25%' }}
          >
            <Image src={src} alt={alt} fill className="object-cover" />
          </div>
          {alt && (
            <figcaption className="text-muted-foreground mt-2 text-center text-sm">
              {alt}
            </figcaption>
          )}
        </figure>
      )
    }
    default:
      return null
  }
}

export function NotionRenderer({ blocks }: NotionRendererProps) {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      {blocks.map(block => renderBlock(block))}
    </div>
  )
}
