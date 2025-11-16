import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('🔍 Supabase Config Check:')
console.log('   URL:', supabaseUrl ? '✅ Vorhanden' : '❌ FEHLT!')
console.log('   Key:', supabaseAnonKey ? '✅ Vorhanden' : '❌ FEHLT!')

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('⚠️⚠️⚠️ KRITISCH: Supabase URL oder Key fehlt!')
    console.error('📝 Prüfe ob .env Datei existiert:')
    console.error('   1. Datei: .env im Root-Verzeichnis')
    console.error('   2. Inhalt: VITE_SUPABASE_URL=...')
    console.error('   3. Inhalt: VITE_SUPABASE_ANON_KEY=...')
    console.error('   4. Server neu starten: npm run dev')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storage: window.localStorage,
        storageKey: 'sakanera-auth-token'
    }
})

// Auth Helpers
export const authHelpers = {
    async signUp(email, password, userData) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: userData
            }
        })
        return { data, error }
    },

    async signIn(email, password) {
        console.log('🔑 signIn aufgerufen mit:', email)
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })
        console.log('🔑 signIn Antwort:', {
            success: !error,
            user: data?.user?.email,
            error: error?.message
        })
        return { data, error }
    },

    async signOut() {
        console.log('🚪 signOut aufgerufen')
        const { error } = await supabase.auth.signOut()
        if (error) {
            console.error('❌ signOut Error:', error)
        } else {
            console.log('✅ signOut erfolgreich')
        }
        return { error }
    },

    async getCurrentUser() {
        const { data: { user } } = await supabase.auth.getUser()
        return user
    },

    onAuthStateChange(callback) {
        return supabase.auth.onAuthStateChange(callback)
    }
}

// Profile Helpers
export const profileHelpers = {
    async createProfile(userId, profileData) {
        const { data, error } = await supabase
            .from('profiles')
            .insert([{ id: userId, ...profileData }])
            .select()
            .single()
        return { data, error }
    },

    async getProfile(userId) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single()
        return { data, error }
    },

    async updateProfile(userId, updates) {
        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', userId)
            .select()
            .single()
        return { data, error }
    }
}

// Listing Helpers
export const listingHelpers = {
    async getAllListings(filters = {}) {
        let query = supabase
            .from('listings')
            .select('*')
            .eq('is_active', true)

        if (filters.city && filters.city !== 'all') {
            query = query.eq('city', filters.city)
        }
        if (filters.type && filters.type !== 'all') {
            query = query.eq('type', filters.type)
        }
        if (filters.maxRent && filters.maxRent !== 'all') {
            query = query.lte('rent', parseInt(filters.maxRent))
        }
        if (filters.gender && filters.gender !== 'all') {
            query = query.or(`gender.eq.${filters.gender},gender.eq.all`)
        }

        const { data, error } = await query.order('created_at', { ascending: false })
        return { data, error }
    },

    async createListing(listingData) {
        const { data, error } = await supabase
            .from('listings')
            .insert([listingData])
            .select()
            .single()
        return { data, error }
    },

    async updateListing(listingId, updates) {
        const { data, error } = await supabase
            .from('listings')
            .update(updates)
            .eq('id', listingId)
            .select()
            .single()
        return { data, error }
    },

    async deleteListing(listingId) {
        const { error } = await supabase
            .from('listings')
            .delete()
            .eq('id', listingId)
        return { error }
    },

    async getUserListings(userId) {
        const { data, error } = await supabase
            .from('listings')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
        return { data, error }
    }
}

// Favorite Helpers
export const favoriteHelpers = {
    async getUserFavorites(userId) {
        const { data, error } = await supabase
            .from('favorites')
            .select(`
        *,
        listing:listings(*)
      `)
            .eq('user_id', userId)

        if (error) return { data: null, error }

        const favorites = data.map(fav => fav.listing).filter(Boolean)
        return { data: favorites, error: null }
    },

    async addFavorite(userId, listingId) {
        const { data, error } = await supabase
            .from('favorites')
            .insert([{ user_id: userId, listing_id: listingId }])
            .select()
            .single()
        return { data, error }
    },

    async removeFavorite(userId, listingId) {
        const { error } = await supabase
            .from('favorites')
            .delete()
            .eq('user_id', userId)
            .eq('listing_id', listingId)
        return { error }
    },

    async isFavorite(userId, listingId) {
        const { data, error } = await supabase
            .from('favorites')
            .select('id')
            .eq('user_id', userId)
            .eq('listing_id', listingId)
            .single()
        return { isFavorite: !!data, error }
    }
}

// Feedback Helpers
export const feedbackHelpers = {
    async createFeedback(feedbackData) {
        const { data, error } = await supabase
            .from('feedback')
            .insert([feedbackData])
            .select()
            .single()
        return { data, error }
    },

    async getUserFeedback(userId) {
        const { data, error } = await supabase
            .from('feedback')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
        return { data, error }
    },

    async getAllFeedback() {
        const { data, error } = await supabase
            .from('feedback')
            .select('*')
            .order('created_at', { ascending: false })
        return { data, error }
    }
}