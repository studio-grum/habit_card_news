export interface RichText {
  plain_text: string
  href?: string | null
  annotations: {
    bold: boolean
    italic: boolean
    code: boolean
    strikethrough: boolean
    underline: boolean
  }
}

export type BlockType =
  | 'paragraph'
  | 'heading_1'
  | 'heading_2'
  | 'heading_3'
  | 'code'
  | 'quote'
  | 'bulleted_list_item'
  | 'numbered_list_item'
  | 'image'

export interface Block {
  id: string
  type: BlockType
  [key: string]: unknown
}

export interface Post {
  id: string
  slug: string
  title: string
  category: string
  tags: string[]
  publishedAt: string
  status: 'draft' | 'published'
  coverImage?: string
}

export type Category = string
export type Tag = string

export interface Comment {
  id: string
  postId: string
  author: string
  content: string
  createdAt: string
}
