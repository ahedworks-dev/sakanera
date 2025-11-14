// LOCAL AUTH SYSTEM - Funktioniert ohne Supabase!
// Nutzt localStorage für Daten

// Helper Funktionen für localStorage
const STORAGE_KEYS = {
    USERS: 'sakanera_users',
    CURRENT_USER: 'sakanera_current_user',
    PROFILES: 'sakanera_profiles',
    LISTINGS: 'sakanera_listings',
    FAVORITES: 'sakanera_favorites'
};

// User laden
const getUsers = () => {
    const users = localStorage.getItem(STORAGE_KEYS.USERS);
    return users ? JSON.parse(users) : [];
};

// User speichern
const saveUsers = (users) => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

// Current User
const getCurrentUser = () => {
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
};

const setCurrentUser = (user) => {
    if (user) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
};

// Profile laden
const getProfiles = () => {
    const profiles = localStorage.getItem(STORAGE_KEYS.PROFILES);
    return profiles ? JSON.parse(profiles) : {};
};

const saveProfiles = (profiles) => {
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
};

// Listings laden
const getListings = () => {
    const listings = localStorage.getItem(STORAGE_KEYS.LISTINGS);
    return listings ? JSON.parse(listings) : [];
};

const saveListings = (listings) => {
    localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(listings));
};

// Favorites laden
const getFavorites = () => {
    const favorites = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return favorites ? JSON.parse(favorites) : {};
};

const saveFavorites = (favorites) => {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
};

// UUID Generator
const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

// AUTH HELPERS
export const authHelpers = {
    // Registrierung
    async signUp(email, password, userData) {
        try {
            const users = getUsers();

            // Prüfe ob Email schon existiert
            if (users.find(u => u.email === email)) {
                return {
                    data: null,
                    error: { message: 'Email already registered' }
                };
            }

            // Erstelle neuen User
            const newUser = {
                id: generateUUID(),
                email,
                password, // In Production würde man das hashen!
                created_at: new Date().toISOString(),
                ...userData
            };

            users.push(newUser);
            saveUsers(users);

            // Auto-Login nach Registrierung
            const userWithoutPassword = { ...newUser };
            delete userWithoutPassword.password;
            setCurrentUser(userWithoutPassword);

            return {
                data: { user: userWithoutPassword },
                error: null
            };
        } catch (error) {
            return {
                data: null,
                error: { message: error.message }
            };
        }
    },

    // Login
    async signIn(email, password) {
        try {
            const users = getUsers();
            const user = users.find(u => u.email === email && u.password === password);

            if (!user) {
                return {
                    data: null,
                    error: { message: 'Invalid email or password' }
                };
            }

            const userWithoutPassword = { ...user };
            delete userWithoutPassword.password;
            setCurrentUser(userWithoutPassword);

            return {
                data: { user: userWithoutPassword },
                error: null
            };
        } catch (error) {
            return {
                data: null,
                error: { message: error.message }
            };
        }
    },

    // Logout
    async signOut() {
        setCurrentUser(null);
        return { error: null };
    },

    // Aktuellen User abrufen
    async getCurrentUser() {
        return getCurrentUser();
    },

    // Auth State änderungen (Mock)
    onAuthStateChange(callback) {
        // Initial callback
        const currentUser = getCurrentUser();
        callback('SIGNED_IN', { user: currentUser });

        // Return dummy subscription
        return {
            data: {
                subscription: {
                    unsubscribe: () => {}
                }
            }
        };
    }
};

// PROFILE HELPERS
export const profileHelpers = {
    // Profil erstellen
    async createProfile(userId, profileData) {
        try {
            const profiles = getProfiles();
            profiles[userId] = {
                id: userId,
                ...profileData,
                created_at: new Date().toISOString()
            };
            saveProfiles(profiles);

            return {
                data: profiles[userId],
                error: null
            };
        } catch (error) {
            return {
                data: null,
                error: { message: error.message }
            };
        }
    },

    // Profil abrufen
    async getProfile(userId) {
        try {
            const profiles = getProfiles();
            const profile = profiles[userId];

            if (!profile) {
                return {
                    data: null,
                    error: { message: 'Profile not found' }
                };
            }

            return {
                data: profile,
                error: null
            };
        } catch (error) {
            return {
                data: null,
                error: { message: error.message }
            };
        }
    },

    // Profil aktualisieren
    async updateProfile(userId, updates) {
        try {
            const profiles = getProfiles();

            if (!profiles[userId]) {
                return {
                    data: null,
                    error: { message: 'Profile not found' }
                };
            }

            profiles[userId] = {
                ...profiles[userId],
                ...updates,
                updated_at: new Date().toISOString()
            };
            saveProfiles(profiles);

            return {
                data: profiles[userId],
                error: null
            };
        } catch (error) {
            return {
                data: null,
                error: { message: error.message }
            };
        }
    }
};

// LISTING HELPERS
export const listingHelpers = {
    // Alle Listings abrufen
    async getAllListings(filters = {}) {
        try {
            let listings = getListings().filter(l => l.is_active);

            // Filter anwenden
            if (filters.city && filters.city !== 'all') {
                listings = listings.filter(l => l.city === filters.city);
            }
            if (filters.type && filters.type !== 'all') {
                listings = listings.filter(l => l.type === filters.type);
            }
            if (filters.maxRent && filters.maxRent !== 'all') {
                listings = listings.filter(l => l.rent <= parseInt(filters.maxRent));
            }
            if (filters.gender && filters.gender !== 'all') {
                listings = listings.filter(l => l.gender === filters.gender || l.gender === 'all');
            }

            return { data: listings, error: null };
        } catch (error) {
            return { data: null, error: { message: error.message } };
        }
    },

    // Listing erstellen
    async createListing(listingData) {
        try {
            const listings = getListings();
            const newListing = {
                id: generateUUID(),
                ...listingData,
                created_at: new Date().toISOString()
            };

            listings.push(newListing);
            saveListings(listings);

            return { data: newListing, error: null };
        } catch (error) {
            return { data: null, error: { message: error.message } };
        }
    },

    // Listing löschen
    async deleteListing(listingId) {
        try {
            let listings = getListings();
            listings = listings.filter(l => l.id !== listingId);
            saveListings(listings);

            return { data: true, error: null };
        } catch (error) {
            return { data: null, error: { message: error.message } };
        }
    },

    // Listing aktualisieren
    async updateListing(listingId, updates) {
        try {
            let listings = getListings();
            const index = listings.findIndex(l => l.id === listingId);

            if (index === -1) {
                throw new Error('Listing not found');
            }

            // Update das Listing
            listings[index] = {
                ...listings[index],
                ...updates,
                updated_at: new Date().toISOString()
            };

            saveListings(listings);

            return { data: listings[index], error: null };
        } catch (error) {
            return { data: null, error: { message: error.message } };
        }
    },

    // User's eigene Listings
    async getUserListings(userId) {
        try {
            const listings = getListings().filter(l => l.user_id === userId);
            return { data: listings, error: null };
        } catch (error) {
            return { data: null, error: { message: error.message } };
        }
    }
};

// FAVORITE HELPERS
export const favoriteHelpers = {
    // Favoriten abrufen
    async getUserFavorites(userId) {
        try {
            const favorites = getFavorites();
            const userFavorites = favorites[userId] || [];
            const listings = getListings();

            const favoriteListings = userFavorites.map(favId => {
                const listing = listings.find(l => l.id === favId);
                return listing ? { listing } : null;
            }).filter(Boolean);

            return { data: favoriteListings, error: null };
        } catch (error) {
            return { data: null, error: { message: error.message } };
        }
    },

    // Favorit hinzufügen
    async addFavorite(userId, listingId) {
        try {
            const favorites = getFavorites();

            if (!favorites[userId]) {
                favorites[userId] = [];
            }

            if (!favorites[userId].includes(listingId)) {
                favorites[userId].push(listingId);
                saveFavorites(favorites);
            }

            return { data: true, error: null };
        } catch (error) {
            return { data: null, error: { message: error.message } };
        }
    },

    // Favorit entfernen
    async removeFavorite(userId, listingId) {
        try {
            const favorites = getFavorites();

            if (favorites[userId]) {
                favorites[userId] = favorites[userId].filter(id => id !== listingId);
                saveFavorites(favorites);
            }

            return { data: true, error: null };
        } catch (error) {
            return { data: null, error: { message: error.message } };
        }
    }
};

// Dummy Export für Kompatibilität
export const supabase = {
    auth: {
        getUser: authHelpers.getCurrentUser,
        signOut: authHelpers.signOut,
        onAuthStateChange: authHelpers.onAuthStateChange
    }
};