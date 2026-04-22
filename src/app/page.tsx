import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Container } from '@/components/layout/container'
import { PostList } from '@/components/blog/post-list'
import { fetchPages } from '@/lib/notion'

export const revalidate = 3600

export default async function Home() {
  const posts = await fetchPages()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Container className="py-8">
          <h1 className="mb-8 text-3xl font-bold">최근 글</h1>
          <PostList posts={posts} />
        </Container>
      </main>
      <Footer />
    </div>
  )
}
