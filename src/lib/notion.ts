import { Client } from '@notionhq/client'
import type {
  PageObjectResponse,
  BlockObjectResponse,
} from '@notionhq/client/build/src/api-endpoints'
import { env } from '@/lib/env'
import type { Post, Block, BlockType } from '@/lib/types/notion'

const notion = new Client({ auth: env.NOTION_API_KEY })

const SUPPORTED_BLOCK_TYPES: BlockType[] = [
  'paragraph',
  'heading_1',
  'heading_2',
  'heading_3',
  'code',
  'quote',
  'bulleted_list_item',
  'numbered_list_item',
  'image',
]

function pageToPost(page: PageObjectResponse): Post {
  const props = page.properties

  const titleProp = props['Title']
  const title =
    titleProp?.type === 'title'
      ? (titleProp.title[0]?.plain_text ?? '(제목 없음)')
      : '(제목 없음)'

  const categoryProp = props['Category']
  const category =
    categoryProp?.type === 'select'
      ? (categoryProp.select?.name ?? '기타')
      : '기타'

  const tagsProp = props['Tags']
  const tags =
    tagsProp?.type === 'multi_select'
      ? tagsProp.multi_select.map(t => t.name)
      : []

  const publishedProp = props['Published']
  const publishedAt =
    publishedProp?.type === 'date'
      ? (publishedProp.date?.start ?? page.created_time)
      : page.created_time

  const coverImage =
    page.cover?.type === 'external'
      ? page.cover.external.url
      : page.cover?.type === 'file'
        ? page.cover.file.url
        : undefined

  return {
    id: page.id,
    slug: page.id,
    title,
    category,
    tags,
    publishedAt,
    status: 'published',
    coverImage,
  }
}

export async function fetchPages(category?: string): Promise<Post[]> {
  const response = await notion.databases.query({
    database_id: env.NOTION_DATABASE_ID,
    filter: {
      property: 'Status',
      select: { equals: '발행됨' },
    },
    sorts: [{ property: 'Published', direction: 'descending' }],
  })

  const posts = (response.results as PageObjectResponse[]).map(pageToPost)

  if (category) {
    return posts.filter(p => p.category === category)
  }

  return posts
}

export async function fetchPageContent(pageId: string): Promise<Block[]> {
  const response = await notion.blocks.children.list({ block_id: pageId })

  return response.results
    .filter(
      (block): block is BlockObjectResponse =>
        'type' in block &&
        SUPPORTED_BLOCK_TYPES.includes(
          (block as BlockObjectResponse).type as BlockType
        )
    )
    .map(block => ({ ...block, type: block.type as BlockType })) as Block[]
}
