import { createServerSupabaseClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function Home() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect('/bookmarks');
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Smart Bookmark Manager
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Organize, sync, and access your bookmarks in real-time across all devices
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 my-12">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="font-semibold text-lg mb-2">Secure Login</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Google OAuth authentication for secure access
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="font-semibold text-lg mb-2">Real-time Sync</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Instant updates across all your devices
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="font-semibold text-lg mb-2">Private & Secure</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your bookmarks are completely private
            </p>
          </div>
        </div>

        <div className="pt-8">
          <Link
            href="/auth"
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-8 py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
          >
            Get Started with Google
          </Link>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 pt-8">
          No email or password required. Just sign in with your Google account.
        </p>
      </div>
    </main>
  );
}
