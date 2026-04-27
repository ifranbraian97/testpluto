'use client';

import Link from "next/link"
import Image from "next/image"
import { memo } from "react"
import { useFeaturedCategories } from "@/hooks/use-featured-categories"

function FeaturedCategories() {
  const { categories, loading } = useFeaturedCategories();

  if (loading || categories.length === 0) {
    return null; // Don't show section if loading or no categories
  }

  // Sort by position to ensure correct order (1, 2, 3)
  const sortedCategories = [...categories].sort((a, b) => a.position - b.position);

  return (
    <section className="w-full bg-card py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {sortedCategories.map((category) => (
            <Link
              key={category.id}
              href={category.redirect_link}
              className="group relative aspect-[3/4] sm:aspect-[4/5] md:aspect-[3/4] overflow-hidden rounded-lg"
            >
              <Image
                src={category.image_url || "/placeholder.svg"}
                alt={category.category_name}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 640px) 33vw, (max-width: 768px) 33vw, 33vw"
                loading="eager"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />

              <div className="absolute inset-0 flex items-end p-4 sm:p-5 md:p-8">
                <div className="w-full">
                  <h3 className="text-sm sm:text-xl md:text-2xl font-serif font-medium text-background group-hover:translate-y-[-4px] transition-transform duration-300">
                    {category.category_name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default memo(FeaturedCategories)
