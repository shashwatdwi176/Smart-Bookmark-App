'use client';

import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import BookmarkForm from '@/components/BookmarkForm';
import BookmarkList from '@/components/BookmarkList';
import AuthButton from '@/components/AuthButton';

export default function BookmarksPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/auth');
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, [supabase, router]);

  const handleBookmarkAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Smart Bookmark Manager
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Organize and sync your bookmarks in real-time
            </p>
          </div>
          <AuthButton />
        </header>

        <BookmarkForm onBookmarkAdded={handleBookmarkAdded} />

        <BookmarkList refreshTrigger={refreshTrigger} />
      </div>
    </main>
  );
}
