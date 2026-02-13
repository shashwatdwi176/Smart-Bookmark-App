-- Create bookmarks table
CREATE TABLE IF NOT EXISTS public.bookmarks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- Create policy for SELECT: Users can only see their own bookmarks
CREATE POLICY "Users can view own bookmarks"
    ON public.bookmarks
    FOR SELECT
    USING (auth.uid() = user_id);

-- Create policy for INSERT: Users can only insert their own bookmarks
CREATE POLICY "Users can insert own bookmarks"
    ON public.bookmarks
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create policy for UPDATE: Users can only update their own bookmarks
CREATE POLICY "Users can update own bookmarks"
    ON public.bookmarks
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create policy for DELETE: Users can only delete their own bookmarks
CREATE POLICY "Users can delete own bookmarks"
    ON public.bookmarks
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON public.bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_created_at ON public.bookmarks(created_at DESC);

-- Enable Realtime for the bookmarks table
-- This must be done in the Supabase dashboard under Database > Replication
-- Or via SQL:
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookmarks;
