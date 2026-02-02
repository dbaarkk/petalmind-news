## Project Summary
Petalmind is a fully functional, mobile-first Indian news application. It provides real-time news updates across various categories like Economy, Tech India, Policy, and more, fetched exclusively from trusted Indian sources via the NewsAPI.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Data Source**: NewsAPI (newsapi.org)
- **Runtime**: Node.js / Bun

## Architecture
- `src/app`: Contains the main application routes (Home, Discover, Saved, Article Detail).
- `src/components`: Reusable UI components like `Navbar`, `BottomNav`, `NewsCard`, and `Skeleton`.
- `src/lib`: Utility functions and API integration logic (`news.ts`, `utils.ts`).
- `src/hooks`: Custom React hooks (if any).

## User Preferences
- **Theme**: Light theme by default, clean and modern news-app UI.
- **Mobile First**: Optimized for small screens with a sticky bottom navigation.
- **Real Data**: No mockups or dummy JSON; all content is dynamic.

## Project Guidelines
- **API Usage**: Use `country=in` and `language=en` for all news requests.
- **Source Filtering**: Prioritize trusted Indian sources (The Hindu, NDTV, Hindustan Times, etc.).
- **UI Consistency**: Yellow accent color for badges (#facc15), rounded cards, and soft shadows.
- **Performance**: Implement loading skeletons and server-side fetching/caching where applicable.

## Common Patterns
- **Local Storage**: Used for saving articles offline.
- **Dynamic Routing**: Used for article detail pages based on encoded titles/slugs.
