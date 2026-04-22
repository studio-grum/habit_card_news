import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Container } from '@/components/layout/container'
import { Badge } from '@/components/ui/badge'
import { NotionRenderer } from '@/components/blog/notion-renderer'
import { fetchPages, fetchPageContent } from '@/lib/notion'

export const revalidate = 3600

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = await fetchPages()
  return posts.map(post => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const posts = await fetchPages()
  const post = posts.find(p => p.slug === slug)
  if (!post) return {}
  return {
    title: post.title,
    openGraph: {
      title: post.title,
      type: 'article',
      publishedTime: post.publishedAt,
    },
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const [posts, blocks] = await Promise.all([
    fetchPages(),
    fetchPageContent(slug),
  ])

  const postIndex = posts.findIndex(p => p.slug === slug)
  if (postIndex === -1) notFound()

  const post = posts[postIndex]
  const prevPost = posts[postIndex + 1] ?? null
  const nextPost = posts[postIndex - 1] ?? null

  const formattedDate = new Date(post.publishedAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Container size="sm" className="py-10">
          <article>
            <header className="mb-10">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{post.category}</Badge>
                {post.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <h1 className="mb-4 text-4xl leading-tight font-bold">
                {post.title}
              </h1>
              <p className="text-muted-foreground text-sm">{formattedDate}</p>
            </header>

            <NotionRenderer blocks={blocks} />
          </article>

          <nav className="mt-16 flex items-center justify-between border-t pt-8">
            {prevPost ? (
              <Link
                href={`/posts/${prevPost.slug}`}
                className="hover:text-primary flex items-center gap-1 text-sm transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="line-clamp-1 max-w-[200px]">
                  {prevPost.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {nextPost ? (
              <Link
                href={`/posts/${nextPost.slug}`}
                className="hover:text-primary flex items-center gap-1 text-sm transition-colors"
              >
                <span className="line-clamp-1 max-w-[200px]">
                  {nextPost.title}
                </span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </Container>
      </main>
      <Footer />
    </div>
  )
}
