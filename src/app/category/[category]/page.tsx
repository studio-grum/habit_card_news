import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Container } from '@/components/layout/container'
import { PostCard } from '@/components/blog/post-card'
import { fetchPages } from '@/lib/notion'

export const revalidate = 3600

interface Props {
  params: Promise<{ category: string }>
}

export async function generateStaticParams() {
  const posts = await fetchPages()
  const categories = [...new Set(posts.map(p => p.category))]
  return categories.map(category => ({
    category: encodeURIComponent(category),
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const decoded = decodeURIComponent(category)
  return {
    title: `${decoded} 글 목록`,
    description: `${decoded} 카테고리의 블로그 글 목록`,
  }
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params
  const decoded = decodeURIComponent(category)
  const posts = await fetchPages(decoded)

  if (posts.length === 0) notFound()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Container className="py-8">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-1 text-sm transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            전체 글 보기
          </Link>
          <h1 className="mb-8 text-3xl font-bold">{decoded}</h1>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  )
}
