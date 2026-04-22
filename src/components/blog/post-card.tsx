import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Post } from '@/lib/types/notion'

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <Link href={`/posts/${post.slug}`} aria-label={`${post.title} 글 읽기`}>
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardHeader>
          <div className="mb-2 flex items-center gap-2">
            <Badge variant="secondary">{post.category}</Badge>
          </div>
          <CardTitle className="line-clamp-2 text-lg">{post.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-3 flex flex-wrap gap-1">
            {post.tags.map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <time
            dateTime={post.publishedAt}
            className="text-muted-foreground text-sm"
          >
            {formattedDate}
          </time>
        </CardContent>
      </Card>
    </Link>
  )
}
