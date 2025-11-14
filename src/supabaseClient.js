import { createClient } from '@supabase/supabase-js'

// Diese Werte kommen aus den Environment Variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Supabase Client erstellen
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper Funktionen

// Auth Funktionen
export const authHelpers = {
  // Registrierung
  async signUp(email, password, userData) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData, // firstName, lastName, etc.
      }
    })
    return { data, error }
  },

  // Login
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  // Logout
  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Aktuellen User abrufen
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  // Auth State änderungen abonnieren
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Profile Funktionen
export const profileHelpers = {
  // Profil erstellen
  async createProfile(userId, profileData) {
    const { data, error } = await supabase
      .from('profiles')
      .insert([
        { 
          id: userId,
          ...profileData 
        }
      ])
      .select()
      .single()
    return { data, error }
  },

  // Profil abrufen
  async getProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    return { data, error }
  },

  // Profil aktualisieren
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

// Listings Funktionen
export const listingHelpers = {
  // Alle aktiven Listings abrufen
  async getAllListings(filters = {}) {
    let query = supabase
      .from('listings')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    // Filter anwenden
    if (filters.city && filters.city !== 'all') {
      query = query.eq('city', filters.city)
    }
    if (filters.type && filters.type !== 'all') {
      query = query.eq('type', filters.type)
    }
    if (filters.maxRent) {
      query = query.lte('rent', filters.maxRent)
    }
    if (filters.gender && filters.gender !== 'all') {
      query = query.or(`gender.eq.${filters.gender},gender.eq.all`)
    }

    const { data, error } = await query
    return { data, error }
  },

  // Listing erstellen
  async createListing(listingData) {
    const { data, error } = await supabase
      .from('listings')
      .insert([listingData])
      .select()
      .single()
    return { data, error }
  },

  // Listing aktualisieren
  async updateListing(listingId, updates) {
    const { data, error } = await supabase
      .from('listings')
      .update(updates)
      .eq('id', listingId)
      .select()
      .single()
    return { data, error }
  },

  // Listing löschen
  async deleteListing(listingId) {
    const { data, error } = await supabase
      .from('listings')
      .delete()
      .eq('id', listingId)
    return { data, error }
  },

  // User's eigene Listings
  async getUserListings(userId) {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    return { data, error }
  }
}

// Favorites Funktionen
export const favoriteHelpers = {
  // Favoriten eines Users abrufen
  async getUserFavorites(userId) {
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        *,
        listing:listings(*)
      `)
      .eq('user_id', userId)
    return { data, error }
  },

  // Favorit hinzufügen
  async addFavorite(userId, listingId) {
    const { data, error } = await supabase
      .from('favorites')
      .insert([{ user_id: userId, listing_id: listingId }])
      .select()
      .single()
    return { data, error }
  },

  // Favorit entfernen
  async removeFavorite(userId, listingId) {
    const { data, error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('listing_id', listingId)
    return { data, error }
  },

  // Prüfen ob Listing favorisiert ist
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

// Storage/Upload Funktionen
export const storageHelpers = {
  // Profilbild hochladen
  async uploadProfileImage(userId, file) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}-${Date.now()}.${fileExt}`
    const filePath = `${fileName}`

    const { data, error } = await supabase.storage
      .from('profile-images')
      .upload(filePath, file)

    if (error) return { data: null, error }

    // Public URL erstellen
    const { data: { publicUrl } } = supabase.storage
      .from('profile-images')
      .getPublicUrl(filePath)

    return { data: publicUrl, error: null }
  },

  // Listing Bild hochladen
  async uploadListingImage(listingId, file) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${listingId}-${Date.now()}.${fileExt}`
    const filePath = `${fileName}`

    const { data, error } = await supabase.storage
      .from('listing-images')
      .upload(filePath, file)

    if (error) return { data: null, error }

    // Public URL erstellen
    const { data: { publicUrl } } = supabase.storage
      .from('listing-images')
      .getPublicUrl(filePath)

    return { data: publicUrl, error: null }
  }
}

// Real-time Subscriptions (für später)
export const realtimeHelpers = {
  // Neue Listings abonnieren
  subscribeToNewListings(callback) {
    return supabase
      .channel('new-listings')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'listings' },
        callback
      )
      .subscribe()
  },

  // Nachrichten abonnieren
  subscribeToMessages(userId, callback) {
    return supabase
      .channel('user-messages')
      .on('postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `receiver_id=eq.${userId}`
        },
        callback
      )
      .subscribe()
  }
}
