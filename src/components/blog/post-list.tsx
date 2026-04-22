'use client'

import { useState, useMemo } from 'react'
import { PostCard } from '@/components/blog/post-card'
import { CategoryFilter } from '@/components/blog/category-filter'
import { SearchBar } from '@/components/blog/search-bar'
import type { Post } from '@/lib/types/notion'

interface PostListProps {
  posts: Post[]
}

export function PostList({ posts }: PostListProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  const categories = useMemo(
    () => [...new Set(posts.map(p => p.category))],
    [posts]
  )

  const filtered = useMemo(
    () =>
      posts.filter(post => {
        const matchesCategory =
          activeCategory === null || post.category === activeCategory
        const matchesQuery = post.title
          .toLowerCase()
          .includes(query.toLowerCase())
        return matchesCategory && matchesQuery
      }),
    [posts, activeCategory, query]
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex-1">
          <SearchBar value={query} onChange={setQuery} />
        </div>
      </div>
      <CategoryFilter
        categories={categories}
        active={activeCategory}
        onChange={setActiveCategory}
      />
      {filtered.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center">
          검색 결과가 없습니다.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
