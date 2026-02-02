import Parser from "rss-parser";
import pool from "./db";

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'mediaContent', { keepArray: true }],
      ['media:thumbnail', 'mediaThumbnail'],
      ['enclosure', 'enclosure'],
      ['content:encoded', 'contentEncoded']
    ],
  }
});

interface FeedConfig {
  source: string;
  url: string;
  category: string;
}

const FEEDS: FeedConfig[] = [
  // Politics & National
  { source: "The Hindu", url: "https://www.thehindu.com/news/national/feeder/default.rss", category: "Politics" },
  { source: "The Hindu", url: "https://www.thehindu.com/news/feeder/default.rss", category: "Politics" },
  { source: "Indian Express", url: "https://indianexpress.com/section/india/feed/", category: "Politics" },
  { source: "Indian Express", url: "https://indianexpress.com/feed/", category: "Politics" },
  { source: "NDTV India", url: "https://feeds.feedburner.com/ndtvnews-india-news", category: "Social" },
  { source: "Hindustan Times", url: "https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml", category: "Policy" },
  { source: "Times of India", url: "https://timesofindia.indiatimes.com/rssfeeds/-2128936835.cms", category: "Politics" },
  
  // Economy & Business
  { source: "LiveMint", url: "https://www.livemint.com/rss/economy", category: "Economy" },
  { source: "LiveMint", url: "https://www.livemint.com/rss/news", category: "Economy" },
  { source: "Business Standard", url: "https://www.business-standard.com/rss/home_page_top_stories.rss", category: "Business" },
  { source: "Economic Times", url: "https://economictimes.indiatimes.com/rssfeedstopstories.cms", category: "Economy" },
  { source: "Economic Times", url: "https://economictimes.indiatimes.com/wealth/rssfeeds/8375551.cms", category: "Economy" },
  { source: "MoneyControl", url: "https://www.moneycontrol.com/rss/latestnews.xml", category: "Economy" },
  { source: "Financial Express", url: "https://www.financialexpress.com/feed/", category: "Business" },
  
  // Tech & Infrastructure
  { source: "Times of India Tech", url: "https://timesofindia.indiatimes.com/rssfeeds/66949542.cms", category: "Technology" },
  { source: "NDTV Gadgets", url: "https://feeds.feedburner.com/gadgets360-latest", category: "Technology" },
  { source: "Digit India", url: "https://www.digit.in/feed/", category: "Technology" },
  { source: "The Hindu Tech", url: "https://www.thehindu.com/sci-tech/technology/feeder/default.rss", category: "Technology" },
  { source: "Indian Express Tech", url: "https://indianexpress.com/section/technology/feed/", category: "Technology" },
  { source: "YourStory", url: "https://yourstory.com/feed", category: "Business" },
  
  // Policy & Infrastructure
  { source: "PIB India", url: "https://pib.gov.in/RssMain.aspx", category: "Policy" },
  { source: "FirstPost", url: "https://www.firstpost.com/rss/india.xml", category: "Policy" },
  { source: "News18 India", url: "https://www.news18.com/rss/india.xml", category: "Social" },
  { source: "Business Standard Economy", url: "https://www.business-standard.com/rss/economy-policy-102.rss", category: "Policy" },
  { source: "Mint Policy", url: "https://www.livemint.com/rss/politics", category: "Policy" },
  { source: "India Today", url: "https://www.indiatoday.in/rss/1206584", category: "Politics" },
  { source: "Zee News", url: "https://zeenews.india.com/rss/india-national-news.xml", category: "Politics" },
  { source: "FirstPost Economy", url: "https://www.firstpost.com/rss/business.xml", category: "Economy" },
  { source: "Deccan Herald", url: "https://www.deccanherald.com/national/rssfeed", category: "Social" },
  { source: "Outlook India", url: "https://www.outlookindia.com/rss/national", category: "Policy" },
  { source: "DNA India", url: "https://www.dnaindia.com/feeds/india.xml", category: "Politics" },
  { source: "OneIndia", url: "https://www.oneindia.com/rss/news-india-fb.xml", category: "Social" }
];

function extractImage(item: any): string | null {
  // Try media:content
  if (item.mediaContent && item.mediaContent.length > 0) {
    const media = item.mediaContent.find((m: any) => m.$?.url);
    if (media) return media.$.url;
  }
  // Try media:thumbnail
  if (item.mediaThumbnail && item.mediaThumbnail.$?.url) {
    return item.mediaThumbnail.$.url;
  }
  // Try enclosure
  if (item.enclosure && item.enclosure.url) {
    return item.enclosure.url;
  }
  // Try parsing from content/summary (basic regex)
  const content = item.contentEncoded || item.content || item.summary || "";
  const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
  if (imgMatch && imgMatch[1]) return imgMatch[1];

  return null;
}

export async function ingestFeeds() {
  console.log("Starting RSS ingestion...");
  const client = await pool.connect();
  let newArticlesCount = 0;

  try {
    for (const feed of FEEDS) {
      try {
        console.log(`Fetching feed: ${feed.source} (${feed.url})`);
        const data = await parser.parseURL(feed.url);
        
        for (const item of data.items) {
            try {
              const title = item.title || "No Title";
              // Prioritize content:encoded for full article text, then content, then snippet
              const summary = item.contentEncoded || item.content || item.contentSnippet || "";
              const articleUrl = item.link;
              const publishDate = item.pubDate ? new Date(item.pubDate) : new Date();
              const imageUrl = extractImage(item);


            if (!articleUrl) continue;

            const result = await client.query(
              `INSERT INTO articles
               (title, summary, source_name, source_url, article_url, publish_date, image_url, category)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
               ON CONFLICT (article_url) DO NOTHING`,
              [
                title,
                summary,
                feed.source,
                feed.url,
                articleUrl,
                publishDate,
                imageUrl,
                feed.category
              ]
            );

            if (result.rowCount && result.rowCount > 0) {
              newArticlesCount++;
            }
          } catch (err: any) {
            console.error(`Failed to insert article from ${feed.source}:`, err.message);
          }
        }
      } catch (err: any) {
        console.error(`Failed to fetch feed ${feed.source}:`, err.message);
      }
    }
    console.log(`Ingestion completed. Added ${newArticlesCount} new articles.`);
  } finally {
    client.release();
  }
}
