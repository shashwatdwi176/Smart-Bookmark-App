'use client';

import { createClient } from '@/lib/supabase';
import type { Bookmark } from '@/lib/types';
import { useEffect, useState, useMemo } from 'react';
import ErrorMessage from './ErrorMessage';

interface BookmarkListProps {
  refreshTrigger: number;
}

export default function BookmarkList({ refreshTrigger }: BookmarkListProps) {
  const supabase = useMemo(() => createClient(), []);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchBookmarks = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUserId(user.id);
      }
      
      if (!user) {
        setError('You must be logged in to view bookmarks');
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setBookmarks(data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load bookmarks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();

    if (!userId) return;

    console.log('🔌 Setting up Realtime subscription for user:', userId);

      // INSERT events (Filtered by user_id)
    const channel = supabase
      .channel('bookmarks-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const newBookmark = payload.new as Bookmark;
          console.log('✨ New bookmark inserted:', newBookmark);
          setBookmarks((prev) => [newBookmark, ...prev]);
        }
      )
      // UPDATE events (Filtered by user_id)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const updatedBookmark = payload.new as Bookmark;
          console.log('📝 Bookmark updated:', updatedBookmark);
          setBookmarks((prev) =>
            prev.map((b) => (b.id === updatedBookmark.id ? updatedBookmark : b))
          );
        }
      )
      // DELETE events (Global - cannot filter by user_id as it's missing in payload)
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'bookmarks',
        },
        (payload) => {
          const deletedBookmark = payload.old as Bookmark;
          console.log('🗑️ Bookmark deleted (Realtime):', deletedBookmark);
          // Only remove if it exists in our list (security via obscurity/filtering)
          setBookmarks((prev) => prev.filter((b) => b.id !== deletedBookmark.id));
        }
      )
      .subscribe((status) => {
        console.log('📡 Realtime subscription status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, userId]);

  useEffect(() => {
    if (refreshTrigger > 0) {
      fetchBookmarks();
    }
  }, [refreshTrigger]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setError(null);

    try {
      const { error: deleteError } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw deleteError;
      }
      
      // Optimistic update
      setBookmarks(prev => prev.filter(b => b.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete bookmark');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-pulse"
          >
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          My Bookmarks ({bookmarks.length})
        </h2>
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

      {bookmarks.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            No bookmarks yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Add your first bookmark using the form above
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {bookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:scale-[1.01] group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {bookmark.title}
                  </h3>
                  <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 break-all"
                  >
                    <span className="truncate">{bookmark.url}</span>
                    <svg
                      className="w-4 h-4 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Added {formatDate(bookmark.created_at)}
                  </p>
                </div>

                <button
                  onClick={() => handleDelete(bookmark.id)}
                  disabled={deletingId === bookmark.id}
                  className="flex-shrink-0 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 px-4 py-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  aria-label="Delete bookmark"
                >
                  {deletingId === bookmark.id ? (
                    <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
