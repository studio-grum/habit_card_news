'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import type { Comment } from '@/lib/types/notion'

interface CommentListProps {
  comments: Comment[]
  isLoading: boolean
}

export function CommentList({ comments, isLoading }: CommentListProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        {[0, 1, 2].map(i => (
          <div key={i} className="space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-14 w-full" />
          </div>
        ))}
      </div>
    )
  }

  if (comments.length === 0) {
    return (
      <p className="text-muted-foreground py-6 text-center text-sm">
        첫 번째 댓글을 남겨보세요
      </p>
    )
  }

  return (
    <div className="space-y-6">
      {comments.map(comment => (
        <div key={comment.id}>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{comment.author}</span>
              <span className="text-muted-foreground text-xs">
                {new Date(comment.createdAt).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <p className="text-sm leading-relaxed">{comment.content}</p>
          </div>
          <Separator className="mt-4" />
        </div>
      ))}
    </div>
  )
}
