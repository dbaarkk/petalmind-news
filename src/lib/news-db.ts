"use server";

import pool from './db';

export interface Article {
  id: string;
  title: string;
  summary: string;
  source_name: string;
  source_url: string;
  article_url: string;
  category: string;
  image_url: string | null;
  publish_date: string;
}

export async function getArticles(options: {
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
} = {}) {
  const { category, search, limit = 20, offset = 0 } = options;
  
  try {
    const client = await pool.connect();
    try {
      let query = `SELECT * FROM articles WHERE 1=1`;
      const params: any[] = [];

      if (category && category !== 'All News' && category !== 'general') {
        params.push(category);
        query += ` AND category = $${params.length}`;
      }

      if (search) {
        params.push(`%${search}%`);
        query += ` AND (title ILIKE $${params.length} OR summary ILIKE $${params.length})`;
      }

      query += ` ORDER BY publish_date DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(limit, offset);

      const result = await client.query(query, params);
      return result.rows as Article[];
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Error in getArticles:', err);
    return [];
  }
}

export async function getTrendingKeywords(limit: number = 10) {
  try {
    const client = await pool.connect();
    try {
      const query = `
        SELECT word, count(*) FROM (
          SELECT lower(regexp_split_to_table(title, '\\s+')) as word
          FROM articles
          WHERE publish_date > now() - interval '7 days'
        ) t
        WHERE length(word) > 4 
          AND word ~ '^[a-z]+$'
          AND word NOT IN (
            'india', 'news', 'latest', 'today', 'government', 'after', 'against', 'about', 
            'would', 'their', 'there', 'which', 'where', 'while', 'could', 'should', 'being', 
            'those', 'these', 'first', 'second', 'years', 'people', 'during', 'before', 'after',
            'between', 'under', 'through', 'around', 'because', 'could', 'might', 'must', 
            'shall', 'state', 'center', 'national', 'across', 'reports', 'report', 'points'
          )
        GROUP BY word
        HAVING count(*) > 1
        ORDER BY count(*) DESC
        LIMIT $1
      `;
      const result = await client.query(query, [limit]);
      return result.rows.map(row => row.word);
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Error in getTrendingKeywords:', err);
    return [];
  }
}

export async function getArticleById(id: string) {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM articles WHERE id = $1', [id]);
      return result.rows[0] as Article | null;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Error in getArticleById:', err);
    return null;
  }
}
