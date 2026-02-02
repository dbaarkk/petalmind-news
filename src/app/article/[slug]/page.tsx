"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Share2, Bookmark, ExternalLink } from "lucide-react";
import { fetchArticleByIdAction } from "@/lib/actions";
import { Article } from "@/lib/news-db";
import { format } from "date-fns";

export default function ArticlePage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    async function loadArticle() {
      const id = params.slug as string;
      try {
        const found = await fetchArticleByIdAction(id);
        setArticle(found);
        
        if (found) {
          const saved = JSON.parse(localStorage.getItem("saved_articles") || "[]");
          setIsSaved(saved.some((a: Article) => a.article_url === found.article_url));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadArticle();
  }, [params.slug]);

  const toggleSave = () => {
    if (!article) return;
    const saved = JSON.parse(localStorage.getItem("saved_articles") || "[]");
    let newSaved;
    if (isSaved) {
      newSaved = saved.filter((a: Article) => a.article_url !== article.article_url);
    } else {
      newSaved = [...saved, article];
    }
    localStorage.setItem("saved_articles", JSON.stringify(newSaved));
    setIsSaved(!isSaved);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-yellow-400 border-t-transparent"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex h-screen flex-col items-center justify-center p-4 text-center">
        <h1 className="text-xl font-bold">Article not found</h1>
        <button onClick={() => router.back()} className="mt-4 text-yellow-600 font-medium">Go Back</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 flex items-center justify-between border-b bg-white/80 p-4 backdrop-blur-md">
        <button onClick={() => router.back()} className="rounded-full bg-gray-100 p-2 text-gray-600">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex gap-4">
          <button onClick={() => {
            navigator.share?.({ title: article.title, url: article.article_url });
          }} className="rounded-full bg-gray-100 p-2 text-gray-600">
            <Share2 className="h-5 w-5" />
          </button>
          <button onClick={toggleSave} className={`rounded-full p-2 ${isSaved ? 'bg-yellow-400 text-white' : 'bg-gray-100 text-gray-600'}`}>
            <Bookmark className="h-5 w-5" fill={isSaved ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

        <article className="p-4 space-y-6 pb-24 max-w-3xl mx-auto">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 border-l-4 border-yellow-400 pl-3">
              {article.source_name}
            </span>
            <h1 className="text-3xl font-black leading-tight text-gray-900 md:text-5xl">
              {article.title}
            </h1>
            <p className="text-sm font-medium text-gray-400">
              {format(new Date(article.publish_date), "PPP p")}
            </p>
          </div>

          {article.image_url && (
            <div className="aspect-video w-full overflow-hidden rounded-3xl bg-gray-100 shadow-2xl">
              <img src={article.image_url} alt={article.title} className="h-full w-full object-cover" />
            </div>
          )}

          <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed font-medium">
            <div 
              className="article-content"
              dangerouslySetInnerHTML={{ __html: article.summary || "" }} 
            />
          </div>

          <style jsx global>{`
            .article-content img {
              border-radius: 1.5rem;
              margin: 2rem 0;
              width: 100%;
              height: auto;
            }
            .article-content p {
              margin-bottom: 1.5rem;
            }
            .article-content a {
              color: #eab308;
              text-decoration: underline;
            }
          `}</style>
        </article>
    </div>
  );
}
