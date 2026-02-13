# Smart Bookmark Manager

A production-ready, real-time bookmark management application built with Next.js, Supabase, and Tailwind CSS. Features secure Google OAuth authentication and instant synchronization across devices.

![Smart Bookmark Manager](https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge&logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-Latest-3ECF8E?style=for-the-badge&logo=supabase)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=for-the-badge&logo=tailwind-css)

## 🚀 Live Demo

**[View Live Application](#)** _(Deploy to Vercel and add URL here)_

## ✨ Features

- 🔐 **Secure Authentication** - Google OAuth integration via Supabase Auth
- ⚡ **Real-time Sync** - Instant bookmark updates across all devices and tabs
- 🔒 **Privacy First** - Row-level security ensures bookmarks are strictly private
- 📱 **Responsive Design** - Beautiful UI that works on mobile, tablet, and desktop
- ✅ **Form Validation** - URL validation with user-friendly error messages
- 🎨 **Modern UI** - Clean, gradient-based design with smooth animations
- 🧪 **Fully Tested** - Comprehensive unit tests with Jest and React Testing Library
- 🚀 **Production Ready** - Optimized for deployment with best practices

## 🛠️ Tech Stack

### Frontend
- **Next.js 16.1.6** - React framework with App Router
- **React 19** - Latest React features
- **TypeScript 5** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling

### Backend & Database
- **Supabase** - PostgreSQL database, authentication, and real-time subscriptions
- **Supabase Auth** - Google OAuth integration
- **Supabase Realtime** - WebSocket-based real-time updates

### Testing
- **Jest** - Unit testing framework
- **React Testing Library** - Component testing
- **@testing-library/user-event** - User interaction simulation

## 📋 Prerequisites

Before you begin, ensure you have:
- **Node.js 18+** installed ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- A **Supabase account** ([Sign up free](https://supabase.com))
- A **Google Cloud Console** project for OAuth ([Setup guide](https://console.cloud.google.com))

## 🚀 Quick Start

### 1. Clone the Repository

\`\`\`bash
git clone <your-repo-url>
cd smart-bookmark-app
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Set Up Supabase

#### 3.1 Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the database to initialize

#### 3.2 Create Database Schema
1. Navigate to **SQL Editor** in your Supabase dashboard
2. Copy contents from `supabase-schema.sql`
3. Execute the SQL to create tables, policies, and indexes

#### 3.3 Enable Realtime
1. Go to **Database** > **Replication**
2. Enable replication for the `bookmarks` table

#### 3.4 Configure Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable **Google+ API**
4. Go to **Credentials** > **Create Credentials** > **OAuth 2.0 Client ID**
5. Set authorized redirect URIs:
   - `https://<your-project-ref>.supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback` (for development)
6. Copy **Client ID** and **Client Secret**
7. In Supabase dashboard, go to **Authentication** > **Providers** > **Google**
8. Enable Google provider and paste Client ID and Secret
9. Save configuration

### 4. Configure Environment Variables

Create `.env.local` file in the project root:

\`\`\`bash
cp .env.local.example .env.local
\`\`\`

Edit `.env.local` and add your Supabase credentials:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
\`\`\`

**Finding your credentials:**
- Supabase Dashboard > **Settings** > **API**
- Copy **Project URL** and **anon public** key

### 5. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Run Tests

\`\`\`bash
npm test
\`\`\`

## 📁 Project Structure

\`\`\`
smart-bookmark-app/
├── app/                        # Next.js App Router pages
│   ├── auth/                   # Authentication pages
│   │   ├── callback/           # OAuth callback handler
│   │   │   └── route.ts
│   │   └── page.tsx            # Login page
│   ├── bookmarks/              # Bookmarks management page
│   │   └── page.tsx
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page
│   └── globals.css             # Global styles
├── components/                 # Reusable React components
│   ├── AuthButton.tsx          # Login/Logout button
│   ├── BookmarkForm.tsx        # Add bookmark form
│   ├── BookmarkList.tsx        # Bookmarks display with real-time
│   └── ErrorMessage.tsx        # Error display component
├── lib/                        # Utilities and configuration
│   ├── supabase.ts             # Supabase client setup
│   └── types.ts                # TypeScript type definitions
├── tests/                      # Unit tests
│   └── components/             # Component tests
├── public/                     # Static assets
├── middleware.ts               # Auth middleware
├── supabase-schema.sql         # Database schema
├── jest.config.js              # Jest configuration
├── jest.setup.js               # Jest setup
├── tailwind.config.js          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
├── .env.local.example          # Environment variables template
└── README.md                   # This file
\`\`\`

## 🏗️ Architecture

### Authentication Flow
1. User clicks "Sign in with Google" on `/auth` page
2. Supabase redirects to Google OAuth consent screen
3. After approval, Google redirects to `/auth/callback`
4. Callback exchanges authorization code for session
5. User redirected to `/bookmarks` with active session
6. Middleware refreshes session on each request

### Real-time Sync
- Supabase Realtime uses PostgreSQL's replication
- Client subscribes to `bookmarks` table changes
- On INSERT/UPDATE/DELETE, event broadcast to all subscribers
- React state automatically updates, triggering re-render
- Works across multiple tabs and devices instantly

### Security
- **Row Level Security (RLS)**: Database policies ensure users only access their own bookmarks
- **Authentication checks**: Server-side validation on all API routes
- **HTTPS only**: OAuth requires secure connections
- **Input validation**: URL regex and sanitization prevent malicious input

## 🎯 Problems Solved

### 1. Real-time Synchronization Without Polling
**Challenge**: Traditional bookmark managers require manual refresh or inefficient polling.

**Solution**: Implemented Supabase Realtime subscriptions using PostgreSQL's `LISTEN/NOTIFY`. When any user adds/deletes a bookmark, the change propagates instantly to all their active sessions via WebSocket. This eliminates polling overhead and provides true real-time collaboration across devices.

**Implementation**:
\`\`\`typescript
const channel = supabase
  .channel('bookmarks-changes')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'bookmarks' },
    (payload) => {
      // Update local state based on event type
    }
  )
  .subscribe();
\`\`\`

### 2. Secure Multi-tenant Data Isolation
**Challenge**: Ensuring users can never access another user's private bookmarks, even with direct API calls.

**Solution**: Implemented Supabase Row Level Security (RLS) policies at the database level. All queries automatically filter by `user_id = auth.uid()`, making it impossible to bypass security checks even if the client is compromised.

**Implementation**:
\`\`\`sql
CREATE POLICY "Users can view own bookmarks"
  ON bookmarks FOR SELECT
  USING (auth.uid() = user_id);
\`\`\`

### 3. OAuth Redirect Handling in Next.js App Router
**Challenge**: Next.js App Router requires server components by default, but OAuth callbacks need server-side session handling.

**Solution**: Created dedicated route handler at `/auth/callback/route.ts` that exchanges OAuth code for session server-side, then redirects. Combined with middleware that refreshes sessions on every request to prevent stale tokens.

**Implementation**:
\`\`\`typescript
export async function GET(request: Request) {
  const code = requestUrl.searchParams.get('code');
  const supabase = await createServerSupabaseClient();
  await supabase.auth.exchangeCodeForSession(code);
  return NextResponse.redirect('/bookmarks');
}
\`\`\`

### 4. Client-Server Hydration with Real-time Data
**Challenge**: Next.js server components pre-render, but real-time subscriptions are client-side only.

**Solution**: Designed hybrid architecture where initial data fetches server-side for SEO/performance, then client components take over for real-time updates. Used `'use client'` directive strategically only for interactive components.

### 5. URL Validation and Auto-formatting
**Challenge**: Users may enter URLs in various formats (with/without protocol, typos).

**Solution**: Implemented regex validation (`/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/`) with auto-prefixing of `https://` if missing. Provides instant feedback for invalid URLs before submission.

## 🧪 Testing

Run the test suite:

\`\`\`bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm test -- --coverage
\`\`\`

**Test Coverage**:
- ✅ ErrorMessage component (4 tests)
- ✅ BookmarkForm validation and submission (4 tests)
- ✅ BookmarkList rendering and states (4 tests)

## 🚀 Deployment to Vercel

### Option 1: Deploy via Vercel Dashboard

1. Push code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Click **Import Project**
4. Select your GitHub repository
5. Configure environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Click **Deploy**

### Option 2: Deploy via Vercel CLI

\`\`\`bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY

# Deploy to production
vercel --prod
\`\`\`

### Post-Deployment Steps

1. **Update OAuth Redirect URIs** in Google Cloud Console:
   - Add: `https://your-app.vercel.app/auth/callback`
   - Add: `https://<your-project>.supabase.co/auth/v1/callback`

2. **Update Supabase Site URL**:
   - Go to Supabase Dashboard > **Settings** > **Auth**
   - Set **Site URL** to `https://your-app.vercel.app`

3. **Test Authentication**: Visit your deployed URL and test Google login

## 📝 Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://abc123.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key (safe for client) | `eyJhbGci...` |

**Note**: `NEXT_PUBLIC_` prefix makes variables available to the browser.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend as a service
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Vercel](https://vercel.com/) - Deployment platform

## 📧 Support

For issues or questions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review Supabase documentation for auth/database questions

---

**Built with ❤️ using Next.js, Supabase, and TypeScript**
