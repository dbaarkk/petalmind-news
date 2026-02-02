"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchArticlesAction } from "@/lib/actions";
import { Article } from "@/lib/news-db";
import NewsCard from "@/components/NewsCard";
import Skeleton from "@/components/Skeleton";
import { useInView } from "react-intersection-observer";

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const LIMIT = 12;

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
        limit: LIMIT,
        offset: 0,
      });
      setArticles(data);
      if (data.length < LIMIT) setHasMore(false);
    } catch (err: any) {
      setError(err.message || "Failed to load articles. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMoreNews = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const nextOffset = offset + LIMIT;
      const data = await fetchArticlesAction({
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
  }, [loadingMore, hasMore, offset]);

  useEffect(() => {
    loadInitialNews();
  }, [loadInitialNews]);

  useEffect(() => {
    if (inView && hasMore && !loading && !loadingMore) {
      loadMoreNews();
    }
  }, [inView, hasMore, loading, loadingMore, loadMoreNews]);

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex flex-col gap-1 border-b pb-4">
        <h1 className="text-3xl font-black tracking-tight text-gray-900 font-serif uppercase">
          Full News Archive
        </h1>
        <p className="text-sm text-gray-500 font-medium">
          The most comprehensive collection of premium Indian news.
        </p>
      </div>

      <div className="flex flex-col">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} />)
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
            No articles found in the archive.
          </div>
        ) : (
          <>
            {articles.map((article) => (
              <NewsCard 
                key={article.id} 
                article={article} 
              />
            ))}
            
            {/* Load More Trigger */}
            <div ref={ref} className="h-10 w-full flex items-center justify-center py-12">
              {loadingMore && <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>}
              {!hasMore && articles.length > 0 && (
                <div className="flex flex-col items-center gap-2">
                  <p className="text-gray-400 text-sm font-bold uppercase tracking-widest italic">
                    End of archive
                  </p>
                  <p className="text-xs text-gray-300">You've reached the beginning of time.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
