# Smart Bookmark App

Production-ready bookmark management application built with Next.js 16, Supabase, and Tailwind CSS.

## Live Demo

**[View Application](#)** - Add your Vercel URL here after deployment

## Features

- Google OAuth authentication via Supabase
- Real-time bookmark synchronization across devices
- Private bookmarks with Row Level Security
- Responsive design for all screen sizes
- URL validation and auto-formatting
- Modern UI with dark mode support

## Tech Stack

- Next.js 16 with App Router
- Supabase (PostgreSQL + Auth + Realtime)
- TypeScript 5
- Tailwind CSS 4
- Jest + React Testing Library

## Quick Start

### Prerequisites

- Node.js 18+
- Supabase account
- Google Cloud Console project

### Installation

1. Clone repository:
   ```bash
   git clone https://github.com/YOUR-USERNAME/smart-bookmark-app.git
   cd smart-bookmark-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Supabase:
   - Follow `SUPABASE_SETUP.md` for detailed instructions
   - Create Supabase project
   - Run `supabase-schema.sql`
   - Enable Realtime for bookmarks table

4. Set up environment variables:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Update `.env.local` with your credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

5. Configure Google OAuth:
   - Create OAuth client in Google Cloud Console
   - Add redirect URIs
   - Configure in Supabase Auth settings

6. Run development server:
   ```bash
   npm run dev
   ```
   
   Open http://localhost:3000

### Testing

```bash
npm test
```

### Build

```bash
npm run build
npm start
```

## Deployment

See `DEPLOYMENT.md` for detailed Vercel deployment instructions.

Quick deploy:
```bash
vercel --prod
```

## Project Structure

```
smart-bookmark-app/
├── app/              # Next.js pages
├── components/       # React components
├── lib/              # Utilities and types
├── tests/            # Unit tests
├── supabase-schema.sql
└── README.md
```

## Key Features Implementation

### Real-time Sync
Uses Supabase Realtime with PostgreSQL replication for instant updates across all devices.

### Security
Row Level Security policies ensure users only access their own bookmarks.

### Authentication
Google OAuth integration via Supabase Auth with session management.

## Documentation

- `README.md` - This file
- `SUPABASE_SETUP.md` - Detailed Supabase configuration
- `DEPLOYMENT.md` - Deployment checklist

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run linter

## License

MIT

## Author

Your Name

## Support

For issues or questions, open an issue on GitHub.
