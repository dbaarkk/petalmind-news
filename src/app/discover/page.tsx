"use client";

import { useState, useEffect } from "react";
import { Search, TrendingUp } from "lucide-react";
import { fetchArticlesAction, fetchTrendingKeywordsAction } from "@/lib/actions";
import { Article } from "@/lib/news-db";
import NewsCard from "@/components/NewsCard";
import Skeleton from "@/components/Skeleton";

export default function Discover() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trendingTags, setTrendingTags] = useState<string[]>([]);

  useEffect(() => {
    fetchTrendingKeywordsAction(10).then(setTrendingTags);
  }, []);

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchArticlesAction({ search: query, limit: 20 });
      setResults(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch results");
    } finally {
      setLoading(false);
    }
  };

  const COLLECTIONS = [
    { 
      title: "India Policy", 
      count: "Policy Watch", 
      image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=400&q=80",
      query: "Policy"
    },
    { 
      title: "Startup India", 
      count: "Tech News", 
      image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=400&q=80",
      query: "Technology"
    },
    { 
      title: "Public Infrastructure", 
      count: "Development", 
      image: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=400&q=80",
      query: "Infrastructure"
    },
  ];

  return (
    <div className="flex flex-col gap-8 p-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search Indian news, topics, or policy..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch(searchQuery)}
          className="w-full rounded-xl border bg-gray-50 py-3 pl-10 pr-4 text-sm focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400"
        />
      </div>

      {loading ? (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Searching...</h2>
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} />)}
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Search Results</h2>
            <button onClick={() => setResults([])} className="text-sm text-yellow-600 font-medium">Clear</button>
          </div>
          {results.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <>
          {/* Trending Topics */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Trending Topics</h2>
              <TrendingUp className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="flex flex-wrap gap-2">
              {trendingTags.length > 0 ? (
                trendingTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSearchQuery(tag);
                      handleSearch(tag);
                    }}
                    className="rounded-full border px-4 py-2 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    #{tag.charAt(0).toUpperCase() + tag.slice(1)}
                  </button>
                ))
              ) : (
                <p className="text-sm text-gray-400">Loading trends...</p>
              )}
            </div>
          </section>

          {/* Curated Collections */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold">Curated Collections</h2>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              {COLLECTIONS.map((col) => (
                <button
                  key={col.title}
                  onClick={() => {
                    setSearchQuery(col.query);
                    handleSearch(col.query);
                  }}
                  className="flex min-w-[160px] flex-col gap-2 text-left"
                >
                  <div className="aspect-[4/5] w-full overflow-hidden rounded-2xl bg-gray-100">
                    <img src={col.image} alt={col.title} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">{col.title}</h3>
                    <p className="text-xs text-gray-500">{col.count}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Suggested for You */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold">Suggested for You</h2>
            <div className="rounded-2xl border p-4 text-center text-gray-500">
              Personalized news will appear here based on your interests.
            </div>
          </section>
        </>
      )}
    </div>
  );
}
