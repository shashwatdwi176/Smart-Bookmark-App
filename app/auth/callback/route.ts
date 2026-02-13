import { createServerSupabaseClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const origin = requestUrl.origin;

    if (code) {
        const supabase = await createServerSupabaseClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
            return NextResponse.redirect(
                `${origin}/auth?error=true&error_description=${encodeURIComponent(error.message)}`
            );
        }
    }

    return NextResponse.redirect(`${origin}/bookmarks`);
}
