import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { fetchComments, createComment } from '@/lib/comments'

const getQuerySchema = z.object({
  postId: z.string().min(1),
})

const postBodySchema = z.object({
  postId: z.string().min(1),
  author: z.string().min(1).max(50),
  content: z.string().min(1).max(1000),
})

export async function GET(request: NextRequest) {
  const postId = request.nextUrl.searchParams.get('postId')
  const parsed = getQuerySchema.safeParse({ postId })

  if (!parsed.success) {
    return NextResponse.json({ error: 'postId is required' }, { status: 400 })
  }

  try {
    const comments = await fetchComments(parsed.data.postId)
    return NextResponse.json({ comments })
  } catch {
    return NextResponse.json(
      { error: '댓글을 불러오는 데 실패했습니다' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: '잘못된 요청입니다' }, { status: 400 })
  }

  const parsed = postBodySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: parsed.error.issues[0]?.message ?? '입력값이 올바르지 않습니다',
      },
      { status: 400 }
    )
  }

  try {
    const comment = await createComment(
      parsed.data.postId,
      parsed.data.author,
      parsed.data.content
    )
    return NextResponse.json({ comment }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: '댓글 등록에 실패했습니다' },
      { status: 500 }
    )
  }
}
