'use client';

import { createClient } from '@/lib/supabase';
import { useState } from 'react';
import ErrorMessage from './ErrorMessage';

interface BookmarkFormProps {
  onBookmarkAdded: () => void;
}

const URL_REGEX = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

export default function BookmarkForm({ onBookmarkAdded }: BookmarkFormProps) {
  const supabase = createClient();
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateUrl = (urlString: string): boolean => {
    return URL_REGEX.test(urlString);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!url.trim() || !title.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (!validateUrl(url)) {
      setError('Please enter a valid URL (e.g., https://example.com)');
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError('You must be logged in to add bookmarks');
        return;
      }

      const formattedUrl = url.startsWith('http://') || url.startsWith('https://') 
        ? url 
        : `https://${url}`;

      const { error: insertError } = await supabase
        .from('bookmarks')
        .insert({
          user_id: user.id,
          url: formattedUrl,
          title: title.trim(),
        });

      if (insertError) {
        throw insertError;
      }

      setUrl('');
      setTitle('');
      onBookmarkAdded();
    } catch (err: any) {
      setError(err.message || 'Failed to add bookmark');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Add New Bookmark
      </h2>
      
      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}
      
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="My Awesome Website"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            URL
          </label>
          <input
            id="url"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Adding...
            </span>
          ) : (
            '+ Add Bookmark'
          )}
        </button>
      </form>
    </div>
  );
}
