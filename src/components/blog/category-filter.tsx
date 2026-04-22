'use client'

import { Button } from '@/components/ui/button'

interface CategoryFilterProps {
  categories: string[]
  active: string | null
  onChange: (category: string | null) => void
}

export function CategoryFilter({
  categories,
  active,
  onChange,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={active === null ? 'default' : 'outline'}
        size="sm"
        onClick={() => onChange(null)}
      >
        전체
      </Button>
      {categories.map(category => (
        <Button
          key={category}
          variant={active === category ? 'default' : 'outline'}
          size="sm"
          onClick={() => onChange(category)}
        >
          {category}
        </Button>
      ))}
    </div>
  )
}
