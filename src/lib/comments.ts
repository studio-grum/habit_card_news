import { Client } from '@notionhq/client'
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import { env } from '@/lib/env'
import type { Comment } from '@/lib/types/notion'

const notion = new Client({ auth: env.NOTION_API_KEY })

function pageToComment(page: PageObjectResponse): Comment {
  const props = page.properties

  const postIdProp = props['PostId']
  const postId =
    postIdProp?.type === 'rich_text'
      ? (postIdProp.rich_text[0]?.plain_text ?? '')
      : ''

  const authorProp = props['Author']
  const author =
    authorProp?.type === 'rich_text'
      ? (authorProp.rich_text[0]?.plain_text ?? '익명')
      : '익명'

  const contentProp = props['Content']
  const content =
    contentProp?.type === 'rich_text'
      ? (contentProp.rich_text[0]?.plain_text ?? '')
      : ''

  return {
    id: page.id,
    postId,
    author,
    content,
    createdAt: page.created_time,
  }
}

export async function fetchComments(postSlug: string): Promise<Comment[]> {
  const response = await notion.databases.query({
    database_id: env.NOTION_COMMENTS_DATABASE_ID,
    filter: {
      property: 'PostId',
      rich_text: { equals: postSlug },
    },
    sorts: [{ timestamp: 'created_time', direction: 'ascending' }],
  })

  return (response.results as PageObjectResponse[]).map(pageToComment)
}

export async function createComment(
  postSlug: string,
  author: string,
  content: string
): Promise<Comment> {
  const page = await notion.pages.create({
    parent: { database_id: env.NOTION_COMMENTS_DATABASE_ID },
    properties: {
      Name: {
        title: [{ text: { content: `comment_${postSlug}_${Date.now()}` } }],
      },
      PostId: {
        rich_text: [{ text: { content: postSlug } }],
      },
      Author: {
        rich_text: [{ text: { content: author } }],
      },
      Content: {
        rich_text: [{ text: { content: content } }],
      },
    },
  })

  return pageToComment(page as PageObjectResponse)
}
