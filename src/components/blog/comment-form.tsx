'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import type { Comment } from '@/lib/types/notion'

const commentSchema = z.object({
  author: z.string().min(1, '이름을 입력해주세요').max(50, '이름은 50자 이하'),
  content: z
    .string()
    .min(1, '댓글을 입력해주세요')
    .max(1000, '댓글은 1000자 이하'),
})

type CommentFormValues = z.infer<typeof commentSchema>

interface CommentFormProps {
  postId: string
  onSuccess: (comment: Comment) => void
}

export function CommentForm({ postId, onSuccess }: CommentFormProps) {
  const form = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: { author: '', content: '' },
  })

  async function onSubmit(values: CommentFormValues) {
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, ...values }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? '오류가 발생했습니다')
      }

      const data = await res.json()
      form.reset()
      onSuccess(data.comment)
      toast.success('댓글이 등록되었습니다')
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : '댓글 등록에 실패했습니다'
      )
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이름</FormLabel>
              <FormControl>
                <Input placeholder="이름을 입력해주세요" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>댓글</FormLabel>
              <FormControl>
                <Textarea placeholder="댓글을 작성해주세요" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? '등록 중...' : '댓글 등록'}
        </Button>
      </form>
    </Form>
  )
}
