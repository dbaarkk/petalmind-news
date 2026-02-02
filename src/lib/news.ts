export interface Article {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
  category?: string;
}

export interface NewsResponse {
  status: string;
  totalResults: number;
  articles: Article[];
  code?: string;
  message?: string;
}

const API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_NEWS_API_URL;

export async function fetchNews(category: string = "general", query: string = ""): Promise<NewsResponse> {
  const endpoint = query ? "/everything" : "/top-headlines";
  const params = new URLSearchParams({
    apiKey: API_KEY || "",
    language: "en",
  });

  if (query) {
    params.append("q", `${query} AND India`);
    params.append("sortBy", "publishedAt");
  } else {
    params.append("country", "in");
    if (category !== "all") {
      params.append("category", category === "all news" ? "general" : category);
    }
  }

  try {
    const res = await fetch(`${BASE_URL}${endpoint}?${params.toString()}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch news");
    }

    return data;
  } catch (error) {
    console.error("News API Error:", error);
    throw error;
  }
}
