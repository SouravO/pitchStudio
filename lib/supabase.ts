import { createBrowserClient } from '@supabase/ssr';

export function getSupabase() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error(
            'Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local'
        );
    }

    return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

// Convenience export
export const supabase = (() => {
    try {
        return getSupabase();
    } catch {
        // Return null during build time — will be initialized at runtime
        return null;
    }
})();
