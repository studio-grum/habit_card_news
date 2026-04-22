'use client'

import { useState, useEffect } from 'react'
import { Separator } from '@/components/ui/separator'
import { CommentList } from '@/components/blog/comment-list'
import { CommentForm } from '@/components/blog/comment-form'
import type { Comment } from '@/lib/types/notion'

interface CommentSectionProps {
  postId: string
}

export function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setIsLoading(true)
      try {
        const res = await fetch(`/api/comments?postId=${postId}`)
        if (!res.ok) throw new Error()
        const data = await res.json()
        setComments(data.comments)
      } catch {
        // 조용히 실패 — 본문 읽기에 영향 없음
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [postId])

  function handleNewComment(comment: Comment) {
    setComments(prev => [...prev, comment])
  }

  return (
    <section className="mt-16 space-y-8">
      <div>
        <h2 className="text-xl font-semibold">
          댓글{!isLoading && ` (${comments.length})`}
        </h2>
        <Separator className="mt-4" />
      </div>
      <CommentList comments={comments} isLoading={isLoading} />
      <div>
        <h3 className="mb-4 text-base font-medium">댓글 작성</h3>
        <CommentForm postId={postId} onSuccess={handleNewComment} />
      </div>
    </section>
  )
}
