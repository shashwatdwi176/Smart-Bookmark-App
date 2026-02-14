import { createServerSupabaseClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const origin = requestUrl.origin;

    console.log('🔄 Auth callback received:', { code: code?.substring(0, 10) + '...', origin });

    if (!code) {
        console.error('❌ No code provided in callback');
        return NextResponse.redirect(
            `${origin}/auth?error=true&error_description=${encodeURIComponent('No authorization code provided')}`
        );
    }

    try {
        const supabase = await createServerSupabaseClient();
        console.log('✅ Supabase client created');

        // Debug: Log config (masked)
        const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        console.log('🔧 Config check:', {
            url: process.env.NEXT_PUBLIC_SUPABASE_URL,
            keyPrefix: anonKey?.substring(0, 10),
            keyLength: anonKey?.length,
            hasWhitespace: anonKey ? /\s/.test(anonKey) : false,
            keyEnd: anonKey ? anonKey.slice(-5) : 'MISSING'
        });

        // Test DB connection
        const { count, error: dbError } = await supabase
            .from('bookmarks')
            .select('*', { count: 'exact', head: true });

        console.log('📡 DB Connection Test:', {
            success: !dbError,
            count,
            error: dbError ? dbError.message : null
        });

        console.log('🔄 Attempting code exchange...');
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        console.log('📊 Exchange code for session result:', {
            hasData: !!data,
            hasSession: !!data?.session,
            hasUser: !!data?.user,
            error: error ? {
                message: error.message,
                status: error.status,
                name: error.name
            } : null
        });

        if (error) {
            console.error('❌ Session exchange error:', error);
            return NextResponse.redirect(
                `${origin}/auth?error=true&error_description=${encodeURIComponent(error.message)}`
            );
        }

        if (!data?.session) {
            console.error('❌ No session returned despite no error');
            return NextResponse.redirect(
                `${origin}/auth?error=true&error_description=${encodeURIComponent('Failed to create session')}`
            );
        }

        console.log('✅ Session created successfully, redirecting to /bookmarks');
        return NextResponse.redirect(`${origin}/bookmarks`);
    } catch (err: any) {
        console.error('❌ Unexpected error in callback:', err);
        return NextResponse.redirect(
            `${origin}/auth?error=true&error_description=${encodeURIComponent(err.message || 'Unknown error')}`
        );
    }
}
