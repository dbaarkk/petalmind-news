"use server";

import { getArticles, getArticleById, getTrendingKeywords, Article } from "@/lib/news-db";

export async function fetchArticlesAction(options: {
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
}) {
  return await getArticles(options);
}

export async function fetchTrendingKeywordsAction(limit: number = 10) {
  return await getTrendingKeywords(limit);
}

export async function fetchArticleByIdAction(id: string) {
  return await getArticleById(id);
}
