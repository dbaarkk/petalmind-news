"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchArticlesAction } from "@/lib/actions";
import { Article } from "@/lib/news-db";
import NewsCard from "@/components/NewsCard";
import Skeleton from "@/components/Skeleton";
import { cn } from "@/lib/utils";
import { useInView } from "react-intersection-observer";

const CATEGORIES = [
  "All News",
  "Politics",
  "Economy",
  "Business",
  "Technology",
  "Infrastructure",
  "Social",
  "Policy",
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All News");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const LIMIT = 10;

  const { ref, inView } = useInView({
    threshold: 0,
  });

  const loadInitialNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    setOffset(0);
    setHasMore(true);
    try {
      const data = await fetchArticlesAction({
        category: activeCategory === "All News" ? undefined : activeCategory,
        limit: LIMIT,
        offset: 0,
      });
      setArticles(data);
      if (data.length < LIMIT) setHasMore(false);
    } catch (err: any) {
      setError(err.message || "Failed to load news. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [activeCategory]);

  const loadMoreNews = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const nextOffset = offset + LIMIT;
      const data = await fetchArticlesAction({
        category: activeCategory === "All News" ? undefined : activeCategory,
        limit: LIMIT,
        offset: nextOffset,
      });
      
      if (data.length === 0) {
        setHasMore(false);
      } else {
        setArticles((prev) => [...prev, ...data]);
        setOffset(nextOffset);
        if (data.length < LIMIT) setHasMore(false);
      }
    } catch (err: any) {
      console.error("Load more failed:", err);
    } finally {
      setLoadingMore(false);
    }
  }, [activeCategory, loadingMore, hasMore, offset]);

  useEffect(() => {
    loadInitialNews();
  }, [loadInitialNews]);

  useEffect(() => {
    if (inView && hasMore && !loading && !loadingMore) {
      loadMoreNews();
    }
  }, [inView, hasMore, loading, loadingMore, loadMoreNews]);

  return (
    <div className="flex flex-col">
      {/* Category Tabs */}
      <div className="sticky top-16 z-40 flex overflow-x-auto border-b bg-white px-4 py-3 no-scrollbar scroll-smooth">
        <div className="flex gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors",
                activeCategory === cat
                  ? "bg-yellow-400 text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* News Feed */}
      <div className="px-4">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} />)
        ) : error ? (
          <div className="flex h-64 flex-col items-center justify-center text-center">
            <p className="text-red-500 font-medium">{error}</p>
            <button 
              onClick={() => loadInitialNews()}
              className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white"
            >
              Retry
            </button>
          </div>
        ) : articles.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-gray-500">
            No news found for this category.
          </div>
        ) : (
          <>
            {articles.map((article) => (
              <NewsCard 
                key={article.id} 
                article={article} 
                category={activeCategory === "All News" ? undefined : activeCategory.toUpperCase()} 
              />
            ))}
            
            {/* Load More Trigger */}
            <div ref={ref} className="h-10 w-full flex items-center justify-center py-8">
              {loadingMore && <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-400"></div>}
              {!hasMore && articles.length > 0 && <p className="text-gray-400 text-sm">No more news to show.</p>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
