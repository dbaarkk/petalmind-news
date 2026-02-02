import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Article } from "@/lib/news-db";

interface NewsCardProps {
  article: Article;
  category?: string;
}

export default function NewsCard({ article, category }: NewsCardProps) {
  const publishTime = formatDistanceToNow(new Date(article.publish_date), { addSuffix: true });
  
  return (
    <Link href={`/article/${article.id}`} className="flex items-start gap-4 border-b py-6 last:border-0">
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <span className="rounded bg-yellow-400 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
            {article.category || category || "NEWS"}
          </span>
          <span className="text-xs font-medium text-gray-400">
            {publishTime.replace("about ", "")} • {article.source_name.toUpperCase()}
          </span>
        </div>
        <h3 className="line-clamp-3 text-lg font-bold leading-snug text-gray-900">
          {article.title}
        </h3>
      </div>
      {article.image_url && (
        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100 shadow-sm">
          <img
            src={article.image_url}
            alt={article.title}
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}
    </Link>
  );
}
