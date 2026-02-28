'use server';

import { createServerSupabase } from './supabase-server';
import { Startup, StartupFormData } from '@/types/startup';

// Submit a new startup (public — no auth needed)
export async function submitStartup(data: StartupFormData): Promise<{ success: boolean; error?: string }> {
    try {
        const supabase = await createServerSupabase();
        const { error } = await supabase
            .from('startups')
            .insert([data]);

        if (error) {
            console.error('Supabase insert error:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (err) {
        console.error('Submit startup error:', err);
        return { success: false, error: 'An unexpected error occurred' };
    }
}

// Columns needed for admin list/table views (avoids fetching all 50+ columns)
const LIST_VIEW_COLUMNS = 'id,startup_name,founder_names,email,city,country,current_stage,status,current_monthly_revenue,created_at';

// Get all startups with pagination (full data)
export async function getStartups(
    page: number = 1,
    pageSize: number = 10,
    filters?: {
        search?: string;
        status?: string;
        stage?: string;
        city?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }
): Promise<{ data: Startup[]; count: number; error?: string }> {
    try {
        const supabase = await createServerSupabase();
        let query = supabase
            .from('startups')
            .select('*', { count: 'exact' });

        // Apply filters
        if (filters?.status) {
            query = query.eq('status', filters.status);
        }
        if (filters?.stage) {
            query = query.eq('current_stage', filters.stage);
        }
        if (filters?.city) {
            query = query.ilike('city', `%${filters.city}%`);
        }
        if (filters?.search) {
            query = query.or(
                `startup_name.ilike.%${filters.search}%,founder_names.ilike.%${filters.search}%,city.ilike.%${filters.search}%,email.ilike.%${filters.search}%`
            );
        }

        // Apply sorting
        const sortBy = filters?.sortBy || 'created_at';
        const sortOrder = filters?.sortOrder || 'desc';
        query = query.order(sortBy, { ascending: sortOrder === 'asc' });

        // Apply pagination
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;
        query = query.range(from, to);

        const { data, count, error } = await query;

        if (error) {
            console.error('Supabase fetch error:', error);
            return { data: [], count: 0, error: error.message };
        }

        return { data: data as Startup[], count: count || 0 };
    } catch (err) {
        console.error('Get startups error:', err);
        return { data: [], count: 0, error: 'An unexpected error occurred' };
    }
}

// Get startups for list/table views — only fetches the columns displayed in tables
export async function getStartupsList(
    page: number = 1,
    pageSize: number = 10,
    filters?: {
        search?: string;
        status?: string;
        stage?: string;
        city?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }
): Promise<{ data: Partial<Startup>[]; count: number; error?: string }> {
    try {
        const supabase = await createServerSupabase();
        let query = supabase
            .from('startups')
            .select(LIST_VIEW_COLUMNS, { count: 'exact' });

        // Apply filters
        if (filters?.status) {
            query = query.eq('status', filters.status);
        }
        if (filters?.stage) {
            query = query.eq('current_stage', filters.stage);
        }
        if (filters?.city) {
            query = query.ilike('city', `%${filters.city}%`);
        }
        if (filters?.search) {
            query = query.or(
                `startup_name.ilike.%${filters.search}%,founder_names.ilike.%${filters.search}%,city.ilike.%${filters.search}%,email.ilike.%${filters.search}%`
            );
        }

        // Apply sorting
        const sortBy = filters?.sortBy || 'created_at';
        const sortOrder = filters?.sortOrder || 'desc';
        query = query.order(sortBy, { ascending: sortOrder === 'asc' });

        // Apply pagination
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;
        query = query.range(from, to);

        const { data, count, error } = await query;

        if (error) {
            console.error('Supabase fetch error:', error);
            return { data: [], count: 0, error: error.message };
        }

        return { data: data as Partial<Startup>[], count: count || 0 };
    } catch (err) {
        console.error('Get startups list error:', err);
        return { data: [], count: 0, error: 'An unexpected error occurred' };
    }
}

// Get a single startup by ID
export async function getStartupById(id: string): Promise<{ data: Startup | null; error?: string }> {
    try {
        const supabase = await createServerSupabase();
        const { data, error } = await supabase
            .from('startups')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Supabase fetch error:', error);
            return { data: null, error: error.message };
        }

        return { data: data as Startup };
    } catch (err) {
        console.error('Get startup error:', err);
        return { data: null, error: 'An unexpected error occurred' };
    }
}

// Update startup status
export async function updateStartupStatus(
    id: string,
    status: 'Pending' | 'Selected'
): Promise<{ success: boolean; error?: string }> {
    try {
        const supabase = await createServerSupabase();
        const { error } = await supabase
            .from('startups')
            .update({ status })
            .eq('id', id);

        if (error) {
            console.error('Supabase update error:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (err) {
        console.error('Update status error:', err);
        return { success: false, error: 'An unexpected error occurred' };
    }
}

// Get analytics data — runs both count queries in parallel
export async function getAnalytics(): Promise<{
    total: number;
    selected: number;
    pending: number;
    selectionRatio: number;
    error?: string;
}> {
    try {
        const supabase = await createServerSupabase();

        // Run both count queries in parallel instead of sequentially
        const [totalResult, selectedResult] = await Promise.all([
            supabase.from('startups').select('*', { count: 'exact', head: true }),
            supabase.from('startups').select('*', { count: 'exact', head: true }).eq('status', 'Selected'),
        ]);

        if (totalResult.error) {
            return { total: 0, selected: 0, pending: 0, selectionRatio: 0, error: totalResult.error.message };
        }
        if (selectedResult.error) {
            return { total: totalResult.count || 0, selected: 0, pending: 0, selectionRatio: 0, error: selectedResult.error.message };
        }

        const totalCount = totalResult.count || 0;
        const selectedCount = selectedResult.count || 0;
        const pendingCount = totalCount - selectedCount;
        const selectionRatio = totalCount > 0 ? (selectedCount / totalCount) * 100 : 0;

        return {
            total: totalCount,
            selected: selectedCount,
            pending: pendingCount,
            selectionRatio: Math.round(selectionRatio * 10) / 10,
        };
    } catch (err) {
        console.error('Get analytics error:', err);
        return { total: 0, selected: 0, pending: 0, selectionRatio: 0, error: 'An unexpected error occurred' };
    }
}
