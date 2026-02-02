"use client";

import { useState, useEffect } from "react";
import { Bookmark } from "lucide-react";
import { Article } from "@/lib/news-db";
import NewsCard from "@/components/NewsCard";

export default function SavedPage() {
  const [savedArticles, setSavedArticles] = useState<Article[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("saved_articles") || "[]");
    setSavedArticles(saved);
  }, []);

  const clearAll = () => {
    localStorage.setItem("saved_articles", "[]");
    setSavedArticles([]);
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Saved Articles</h1>
        {savedArticles.length > 0 && (
          <button onClick={clearAll} className="text-sm text-red-500 font-medium">Clear All</button>
        )}
      </div>

      {savedArticles.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center gap-4 text-center text-gray-500">
          <div className="rounded-full bg-gray-100 p-4">
            <Bookmark className="h-8 w-8" />
          </div>
          <p className="font-medium">No saved articles yet.</p>
          <p className="text-sm">Articles you save will appear here.</p>
        </div>
      ) : (
        <div className="flex flex-col">
          {savedArticles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
