import React, { useState, useEffect } from 'react';
import { Home, Users, Search, Plus, MapPin, DollarSign, Calendar, User, Heart, X, MessageCircle, Filter, LogOut } from 'lucide-react';
import { useAuth } from './AuthContext';
import { supabase } from './supabaseClient';

export default function RoomatePlatform() {
  const { user, profile, signUp, signIn, signOut, loading: authLoading } = useAuth();
  
  const [currentView, setCurrentView] = useState('home');
  const [listings, setListings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [language, setLanguage] = useState('de');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);
  const [showAddListing, setShowAddListing] = useState(false);
  const [showListings, setShowListings] = useState(false);
  const [filterCity, setFilterCity] = useState('');
  const [filterMaxRent, setFilterMaxRent] = useState('');
  const [loading, setLoading] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    age: '',
    occupation: ''
  });

  const [listingData, setListingData] = useState({
    type: 'room',
    title: '',
    description: '',
    city: '',
    address: '',
    postalCode: '',
    rent: '',
    size: '',
    availableFrom: '',
    genderPreference: 'any',
    ageMin: '',
    ageMax: '',
    smokingPreference: 'any',
    cleanlinessPreference: 'normal'
  });

  // Übersetzungen
  const t = {
    de: {
      home: 'Startseite',
      search: 'Suchen',
      addListing: 'Inserieren',
      profile: 'Profil',
      login: 'Anmelden',
      logout: 'Abmelden',
      welcome: 'Finde dein Zuhause',
      welcomeSubtitle: 'Die beste Plattform für WG-Zimmer und Wohnungen',
      quickSearch: 'Schnellsuche',
      city: 'Stadt',
      enterCity: 'Stadt eingeben...',
      searchButton: 'Suchen',
      availableListings: 'Verfügbare Inserate',
      noListings: 'Keine Inserate gefunden',
      createFirstListing: 'Erstelle dein erstes Inserat!',
      viewDetails: 'Details anzeigen',
      perMonth: '/Monat',
      from: 'Ab',
      room: 'Zimmer',
      apartment: 'Wohnung',
      roommate: 'Mitbewohner gesucht',
      favorites: 'Favoriten',
      myFavorites: 'Meine Favoriten',
      noFavorites: 'Keine Favoriten',
      addToFavorites: 'Zu Favoriten hinzufügen',
      createProfile: 'Profil erstellen',
      saveProfile: 'Profil speichern',
      firstName: 'Vorname',
      lastName: 'Nachname',
      email: 'E-Mail',
      password: 'Passwort',
      confirmPassword: 'Passwort bestätigen',
      passwordMismatch: 'Passwörter stimmen nicht überein',
      passwordMinLength: 'Passwort muss mindestens 6 Zeichen lang sein',
      phone: 'Telefon',
      age: 'Alter',
      occupation: 'Beruf/Status',
      profileSaved: 'Profil gespeichert!',
      fillAllFields: 'Bitte fülle alle Felder aus',
      createListing: 'Inserat erstellen',
      listingType: 'Inserattyp',
      title: 'Titel',
      description: 'Beschreibung',
      address: 'Adresse',
      postalCode: 'Postleitzahl',
      rent: 'Miete',
      size: 'Größe',
      availableFrom: 'Verfügbar ab',
      preferences: 'Präferenzen',
      genderPreference: 'Geschlecht',
      male: 'Männlich',
      female: 'Weiblich',
      any: 'Egal',
      ageRange: 'Altersbereich',
      smokingPreference: 'Rauchen',
      nonSmoker: 'Nichtraucher',
      smoker: 'Raucher',
      balcony: 'Balkon',
      cleanlinessPreference: 'Sauberkeit',
      veryClean: 'Sehr sauber',
      normal: 'Normal',
      relaxed: 'Entspannt',
      publishListing: 'Inserat veröffentlichen',
      needSubscription: 'Du benötigst ein Abo um Inserate zu erstellen',
      chooseSubscription: 'Wähle dein Abo',
      basic: 'Basic',
      standard: 'Standard',
      premium: 'Premium',
      month: 'Monat',
      months: 'Monate',
      selectPlan: 'Auswählen',
      contact: 'Kontakt',
      contactUs: 'Kontaktiere uns',
      name: 'Name',
      message: 'Nachricht',
      send: 'Senden',
      aboutUs: 'Über uns',
      aboutText: 'sakanera ist die moderne Plattform für die Wohnungssuche in Deutschland.',
      termsOfService: 'AGB',
      privacyPolicy: 'Datenschutz',
      imprint: 'Impressum',
      allRightsReserved: 'Alle Rechte vorbehalten',
      filterResults: 'Ergebnisse filtern',
      maxRent: 'Max. Miete',
      applyFilters: 'Filter anwenden',
      sqm: 'm²',
      loggedOut: 'Erfolgreich abgemeldet',
      loginSuccess: 'Erfolgreich eingeloggt!',
      loginFailed: 'Login fehlgeschlagen',
      registrationSuccess: 'Registrierung erfolgreich!',
      registrationFailed: 'Registrierung fehlgeschlagen',
    },
    en: {
      home: 'Home',
      search: 'Search',
      addListing: 'Post Listing',
      profile: 'Profile',
      login: 'Login',
      logout: 'Logout',
      welcome: 'Find Your Home',
      welcomeSubtitle: 'The best platform for shared apartments and housing',
      quickSearch: 'Quick Search',
      city: 'City',
      enterCity: 'Enter city...',
      searchButton: 'Search',
      availableListings: 'Available Listings',
      noListings: 'No listings found',
      createFirstListing: 'Create your first listing!',
      viewDetails: 'View Details',
      perMonth: '/month',
      from: 'From',
      room: 'Room',
      apartment: 'Apartment',
      roommate: 'Looking for Roommate',
      favorites: 'Favorites',
      myFavorites: 'My Favorites',
      noFavorites: 'No Favorites',
      addToFavorites: 'Add to Favorites',
      createProfile: 'Create Profile',
      saveProfile: 'Save Profile',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      passwordMismatch: 'Passwords do not match',
      passwordMinLength: 'Password must be at least 6 characters',
      phone: 'Phone',
      age: 'Age',
      occupation: 'Occupation',
      profileSaved: 'Profile saved!',
      fillAllFields: 'Please fill all fields',
      createListing: 'Create Listing',
      listingType: 'Listing Type',
      title: 'Title',
      description: 'Description',
      address: 'Address',
      postalCode: 'Postal Code',
      rent: 'Rent',
      size: 'Size',
      availableFrom: 'Available From',
      preferences: 'Preferences',
      genderPreference: 'Gender',
      male: 'Male',
      female: 'Female',
      any: 'Any',
      ageRange: 'Age Range',
      smokingPreference: 'Smoking',
      nonSmoker: 'Non-smoker',
      smoker: 'Smoker',
      balcony: 'Balcony',
      cleanlinessPreference: 'Cleanliness',
      veryClean: 'Very Clean',
      normal: 'Normal',
      relaxed: 'Relaxed',
      publishListing: 'Publish Listing',
      needSubscription: 'You need a subscription to create listings',
      chooseSubscription: 'Choose Your Plan',
      basic: 'Basic',
      standard: 'Standard',
      premium: 'Premium',
      month: 'Month',
      months: 'Months',
      selectPlan: 'Select',
      contact: 'Contact',
      contactUs: 'Contact Us',
      name: 'Name',
      message: 'Message',
      send: 'Send',
      aboutUs: 'About Us',
      aboutText: 'sakanera is the modern platform for finding housing in Germany.',
      termsOfService: 'Terms of Service',
      privacyPolicy: 'Privacy Policy',
      imprint: 'Imprint',
      allRightsReserved: 'All rights reserved',
      filterResults: 'Filter Results',
      maxRent: 'Max Rent',
      applyFilters: 'Apply Filters',
      sqm: 'sqm',
      loggedOut: 'Successfully logged out',
      loginSuccess: 'Successfully logged in!',
      loginFailed: 'Login failed',
      registrationSuccess: 'Registration successful!',
      registrationFailed: 'Registration failed',
    }
  };

  // Lade Listings aus Supabase
  const loadListings = async () => {
    if (!supabase) return;
    
    try {
      setLoading(true);
      let query = supabase
        .from('listings')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (filterCity) {
        query = query.ilike('city', `%${filterCity}%`);
      }

      if (filterMaxRent) {
        query = query.lte('rent', parseFloat(filterMaxRent));
      }

      const { data, error } = await query;

      if (error) throw error;

      setListings(data || []);
    } catch (error) {
      console.error('Error loading listings:', error);
      alert(language === 'de' ? 'Fehler beim Laden der Inserate' : 'Error loading listings');
    } finally {
      setLoading(false);
    }
  };

  // Lade Favoriten
  const loadFavorites = async () => {
    if (!supabase || !user) return;

    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('listing_id')
        .eq('user_id', user.id);

      if (error) throw error;

      setFavorites(data?.map(f => f.listing_id) || []);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  // Initial load
  useEffect(() => {
    loadListings();
    if (user) {
      loadFavorites();
    }
  }, [user]);

  // Reload listings when filters change
  useEffect(() => {
    if (showListings) {
      loadListings();
    }
  }, [filterCity, filterMaxRent, showListings]);

  // Navigation
  const navigateTo = (view) => {
    setCurrentView(view);
    window.history.pushState({ view }, '', '');
  };

  // Handle Profile Save
  const handleSaveProfile = async () => {
    if (!profileData.firstName || !profileData.lastName || !profileData.email || 
        !profileData.password || !profileData.confirmPassword || !profileData.phone || 
        !profileData.age || !profileData.occupation) {
      alert(t[language].fillAllFields);
      return;
    }

    if (profileData.password.length < 6) {
      alert(t[language].passwordMinLength);
      return;
    }

    if (profileData.password !== profileData.confirmPassword) {
      alert(t[language].passwordMismatch);
      return;
    }

    try {
      setLoading(true);
      
      const { data, error } = await signUp(
        profileData.email,
        profileData.password,
        profileData.firstName,
        profileData.lastName,
        profileData.phone,
        profileData.age,
        profileData.occupation
      );

      if (error) throw error;

      alert(t[language].registrationSuccess);
      setShowSubscription(true);
    } catch (error) {
      console.error('Registration error:', error);
      alert(t[language].registrationFailed + ': ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await signOut();
      setProfileData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        age: '',
        occupation: ''
      });
      alert(t[language].loggedOut);
      setCurrentView('home');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Toggle Favorite
  const toggleFavorite = async (listingId) => {
    if (!user) {
      alert(language === 'de' ? 'Bitte melde dich an!' : 'Please log in!');
      return;
    }

    try {
      if (favorites.includes(listingId)) {
        // Remove favorite
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('listing_id', listingId);

        if (error) throw error;

        setFavorites(favorites.filter(id => id !== listingId));
      } else {
        // Add favorite
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            listing_id: listingId
          });

        if (error) throw error;

        setFavorites([...favorites, listingId]);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert(language === 'de' ? 'Fehler beim Speichern' : 'Error saving');
    }
  };

  // Create Listing
  const handleCreateListing = async () => {
    if (!user || !profile) {
      alert(t[language].needSubscription);
      setShowSubscription(true);
      return;
    }

    // Check if user has active subscription
    if (!profile.has_active_subscription) {
      alert(t[language].needSubscription);
      setShowSubscription(true);
      return;
    }

    if (!listingData.title || !listingData.description || !listingData.city || 
        !listingData.rent || !listingData.availableFrom) {
      alert(t[language].fillAllFields);
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('listings')
        .insert({
          user_id: user.id,
          type: listingData.type,
          title: listingData.title,
          description: listingData.description,
          city: listingData.city,
          address: listingData.address,
          postal_code: listingData.postalCode,
          rent: parseFloat(listingData.rent),
          size: listingData.size ? parseInt(listingData.size) : null,
          available_from: listingData.availableFrom,
          gender_preference: listingData.genderPreference,
          age_min: listingData.ageMin ? parseInt(listingData.ageMin) : null,
          age_max: listingData.ageMax ? parseInt(listingData.ageMax) : null,
          smoking_preference: listingData.smokingPreference,
          cleanliness_preference: listingData.cleanlinessPreference,
          is_active: true
        });

      if (error) throw error;

      alert(language === 'de' ? '✅ Inserat erstellt!' : '✅ Listing created!');
      
      // Reset form
      setListingData({
        type: 'room',
        title: '',
        description: '',
        city: '',
        address: '',
        postalCode: '',
        rent: '',
        size: '',
        availableFrom: '',
        genderPreference: 'any',
        ageMin: '',
        ageMax: '',
        smokingPreference: 'any',
        cleanlinessPreference: 'normal'
      });
      
      setShowAddListing(false);
      setShowListings(true);
      loadListings();
    } catch (error) {
      console.error('Error creating listing:', error);
      alert(language === 'de' ? 'Fehler beim Erstellen' : 'Error creating listing');
    } finally {
      setLoading(false);
    }
  };

  // Favoriten-Listings laden
  const favoriteListings = listings.filter(l => favorites.includes(l.id));

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-400 to-blue-500">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-sky-400 to-blue-500 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Home className="w-8 h-8" />
              <span className="text-2xl font-bold">sakanera</span>
            </div>

            <nav className="hidden md:flex space-x-6">
              <button
                onClick={() => navigateTo('home')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                  currentView === 'home' ? 'bg-white/20' : 'hover:bg-white/10'
                }`}
              >
                <Home className="w-5 h-5" />
                <span>{t[language].home}</span>
              </button>
              <button
                onClick={() => {
                  setShowListings(true);
                  navigateTo('home');
                }}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-white/10 transition"
              >
                <Search className="w-5 h-5" />
                <span>{t[language].search}</span>
              </button>
              <button
                onClick={() => {
                  if (!user) {
                    alert(language === 'de' ? 'Bitte melde dich an!' : 'Please log in!');
                    return;
                  }
                  setShowAddListing(true);
                }}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-white/10 transition"
              >
                <Plus className="w-5 h-5" />
                <span>{t[language].addListing}</span>
              </button>
            </nav>

            <div className="flex items-center space-x-4">
              {/* Profile Dropdown */}
              <div className="relative profile-dropdown-container">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-white/10 transition"
                >
                  <User className="w-5 h-5" />
                  <span>{profile ? profile.first_name : t[language].profile}</span>
                  <span className="text-xs">▼</span>
                </button>

                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border py-2 z-50">
                    <button
                      onClick={() => {
                        navigateTo('profile');
                        setShowProfileDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-2 text-gray-700"
                    >
                      <User className="w-4 h-4" />
                      <span>{t[language].profile}</span>
                    </button>

                    {!user && (
                      <button
                        onClick={() => {
                          setShowLoginModal(true);
                          setShowProfileDropdown(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-sky-50 flex items-center space-x-2 text-sky-600"
                      >
                        <User className="w-4 h-4" />
                        <span>{t[language].login}</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        navigateTo('favorites');
                        setShowProfileDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-2 text-gray-700"
                    >
                      <Heart className="w-4 h-4" />
                      <span>{t[language].favorites}</span>
                    </button>

                    {user && (
                      <>
                        <div className="border-t my-1"></div>
                        <button
                          onClick={() => {
                            handleLogout();
                            setShowProfileDropdown(false);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-red-50 flex items-center space-x-2 text-red-600"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>{t[language].logout}</span>
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Language Toggle */}
              <button
                onClick={() => setLanguage(language === 'de' ? 'en' : 'de')}
                className="px-3 py-2 rounded-lg hover:bg-white/10 transition font-medium"
              >
                {language.toUpperCase()}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Home View */}
        {currentView === 'home' && !showListings && !showAddListing && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-gray-800 mb-4">
                🏠 {t[language].welcome}
              </h1>
              <p className="text-xl text-gray-600">{t[language].welcomeSubtitle}</p>
            </div>

            {/* Quick Search */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6">{t[language].quickSearch}</h2>
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  placeholder={t[language].enterCity}
                  value={filterCity}
                  onChange={(e) => setFilterCity(e.target.value)}
                  className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
                <button
                  onClick={() => setShowListings(true)}
                  className="px-8 py-3 bg-gradient-to-r from-sky-400 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition"
                >
                  🔍 {t[language].searchButton}
                </button>
              </div>
            </div>

            {/* Stats or Info Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <div className="text-4xl mb-2">🏘️</div>
                <h3 className="font-bold text-gray-800 mb-2">{t[language].room}</h3>
                <p className="text-gray-600 text-sm">
                  {language === 'de' ? 'Finde dein WG-Zimmer' : 'Find your shared room'}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <div className="text-4xl mb-2">🏢</div>
                <h3 className="font-bold text-gray-800 mb-2">{t[language].apartment}</h3>
                <p className="text-gray-600 text-sm">
                  {language === 'de' ? 'Ganze Wohnung mieten' : 'Rent entire apartment'}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <div className="text-4xl mb-2">👥</div>
                <h3 className="font-bold text-gray-800 mb-2">{t[language].roommate}</h3>
                <p className="text-gray-600 text-sm">
                  {language === 'de' ? 'Mitbewohner finden' : 'Find roommates'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Listings View */}
        {showListings && !showAddListing && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">{t[language].availableListings}</h2>
              <button
                onClick={() => setShowListings(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <div className="grid md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder={t[language].city}
                  value={filterCity}
                  onChange={(e) => setFilterCity(e.target.value)}
                  className="px-4 py-2 border rounded-lg"
                />
                <input
                  type="number"
                  placeholder={t[language].maxRent}
                  value={filterMaxRent}
                  onChange={(e) => setFilterMaxRent(e.target.value)}
                  className="px-4 py-2 border rounded-lg"
                />
                <button
                  onClick={loadListings}
                  className="px-4 py-2 bg-sky-400 text-white rounded-lg hover:bg-sky-500"
                >
                  {t[language].applyFilters}
                </button>
              </div>
            </div>

            {/* Listings Grid */}
            {loading ? (
              <div className="text-center py-12">
                <div className="text-xl text-gray-600">Loading...</div>
              </div>
            ) : listings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600 mb-4">{t[language].noListings}</p>
                {user && (
                  <button
                    onClick={() => setShowAddListing(true)}
                    className="px-6 py-3 bg-gradient-to-r from-sky-400 to-blue-500 text-white rounded-lg"
                  >
                    {t[language].createFirstListing}
                  </button>
                )}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <div key={listing.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
                    <div className="h-48 bg-gradient-to-br from-sky-200 to-blue-300 flex items-center justify-center">
                      <Home className="w-16 h-16 text-white" />
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg">{listing.title}</h3>
                        <button
                          onClick={() => toggleFavorite(listing.id)}
                          className={favorites.includes(listing.id) ? 'text-red-500' : 'text-gray-400'}
                        >
                          <Heart className={`w-6 h-6 ${favorites.includes(listing.id) ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{listing.description}</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center text-gray-700">
                          <MapPin className="w-4 h-4 mr-2" />
                          {listing.city}
                        </div>
                        <div className="flex items-center text-gray-700">
                          <DollarSign className="w-4 h-4 mr-2" />
                          €{listing.rent}{t[language].perMonth}
                        </div>
                        {listing.size && (
                          <div className="flex items-center text-gray-700">
                            <Home className="w-4 h-4 mr-2" />
                            {listing.size} {t[language].sqm}
                          </div>
                        )}
                        <div className="flex items-center text-gray-700">
                          <Calendar className="w-4 h-4 mr-2" />
                          {t[language].from} {new Date(listing.available_from).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Add Listing View */}
        {showAddListing && (
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">{t[language].createListing}</h2>
              <button
                onClick={() => setShowAddListing(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">{t[language].listingType}</label>
                  <select
                    value={listingData.type}
                    onChange={(e) => setListingData({...listingData, type: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="room">{t[language].room}</option>
                    <option value="apartment">{t[language].apartment}</option>
                    <option value="roommate">{t[language].roommate}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">{t[language].title} *</label>
                  <input
                    type="text"
                    value={listingData.title}
                    onChange={(e) => setListingData({...listingData, title: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder={language === 'de' ? 'z.B. Schönes WG-Zimmer in Berlin' : 'e.g. Nice shared room in Berlin'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">{t[language].description} *</label>
                  <textarea
                    value={listingData.description}
                    onChange={(e) => setListingData({...listingData, description: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg"
                    rows={4}
                    placeholder={language === 'de' ? 'Beschreibe dein Inserat...' : 'Describe your listing...'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">{t[language].city} *</label>
                  <input
                    type="text"
                    value={listingData.city}
                    onChange={(e) => setListingData({...listingData, city: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Berlin, München, Hamburg..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">{t[language].rent} (€) *</label>
                    <input
                      type="number"
                      value={listingData.rent}
                      onChange={(e) => setListingData({...listingData, rent: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder="500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t[language].size} ({t[language].sqm})</label>
                    <input
                      type="number"
                      value={listingData.size}
                      onChange={(e) => setListingData({...listingData, size: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder="20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">{t[language].availableFrom} *</label>
                  <input
                    type="date"
                    value={listingData.availableFrom}
                    onChange={(e) => setListingData({...listingData, availableFrom: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-4">{t[language].preferences}</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">{t[language].genderPreference}</label>
                      <select
                        value={listingData.genderPreference}
                        onChange={(e) => setListingData({...listingData, genderPreference: e.target.value})}
                        className="w-full px-4 py-2 border rounded-lg"
                      >
                        <option value="any">{t[language].any}</option>
                        <option value="male">{t[language].male}</option>
                        <option value="female">{t[language].female}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">{t[language].smokingPreference}</label>
                      <select
                        value={listingData.smokingPreference}
                        onChange={(e) => setListingData({...listingData, smokingPreference: e.target.value})}
                        className="w-full px-4 py-2 border rounded-lg"
                      >
                        <option value="any">{t[language].any}</option>
                        <option value="non-smoker">{t[language].nonSmoker}</option>
                        <option value="smoker">{t[language].smoker}</option>
                        <option value="balcony">{t[language].balcony}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">{t[language].cleanlinessPreference}</label>
                      <select
                        value={listingData.cleanlinessPreference}
                        onChange={(e) => setListingData({...listingData, cleanlinessPreference: e.target.value})}
                        className="w-full px-4 py-2 border rounded-lg"
                      >
                        <option value="very-clean">{t[language].veryClean}</option>
                        <option value="normal">{t[language].normal}</option>
                        <option value="relaxed">{t[language].relaxed}</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCreateListing}
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-sky-400 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
                >
                  {loading ? 'Loading...' : t[language].publishListing}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Profile View */}
        {currentView === 'profile' && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">{t[language].profile}</h2>

            {user && profile ? (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center mx-auto mb-4">
                    <User className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold">{profile.name}</h3>
                  <p className="text-gray-600">{profile.email}</p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600">{t[language].phone}</label>
                      <p className="font-medium">{profile.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">{t[language].age}</label>
                      <p className="font-medium">{profile.age}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">{t[language].occupation}</label>
                    <p className="font-medium">{profile.occupation}</p>
                  </div>
                  {profile.has_active_subscription && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 font-medium">
                        ✅ {language === 'de' ? 'Aktives Abo' : 'Active Subscription'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-xl font-bold mb-6">{t[language].createProfile}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">{t[language].firstName} *</label>
                    <input
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">{t[language].lastName} *</label>
                    <input
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">{t[language].email} *</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">{t[language].password} *</label>
                    <input
                      type="password"
                      value={profileData.password}
                      onChange={(e) => setProfileData({...profileData, password: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg"
                      minLength={6}
                    />
                    <p className="text-xs text-gray-500 mt-1">{t[language].passwordMinLength}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">{t[language].confirmPassword} *</label>
                    <input
                      type="password"
                      value={profileData.confirmPassword}
                      onChange={(e) => setProfileData({...profileData, confirmPassword: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg"
                      minLength={6}
                    />
                    {profileData.password && profileData.confirmPassword && 
                     profileData.password !== profileData.confirmPassword && (
                      <p className="text-xs text-red-600 mt-1">❌ {t[language].passwordMismatch}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">{t[language].phone} *</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">{t[language].age} *</label>
                      <input
                        type="number"
                        value={profileData.age}
                        onChange={(e) => setProfileData({...profileData, age: e.target.value})}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">{t[language].occupation} *</label>
                      <input
                        type="text"
                        value={profileData.occupation}
                        onChange={(e) => setProfileData({...profileData, occupation: e.target.value})}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-sky-400 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
                  >
                    {loading ? 'Loading...' : t[language].saveProfile}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Favorites View */}
        {currentView === 'favorites' && (
          <div>
            <h2 className="text-3xl font-bold mb-6">{t[language].myFavorites}</h2>

            {favoriteListings.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-xl text-gray-600">{t[language].noFavorites}</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteListings.map((listing) => (
                  <div key={listing.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="h-48 bg-gradient-to-br from-sky-200 to-blue-300 flex items-center justify-center">
                      <Home className="w-16 h-16 text-white" />
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg">{listing.title}</h3>
                        <button
                          onClick={() => toggleFavorite(listing.id)}
                          className="text-red-500"
                        >
                          <Heart className="w-6 h-6 fill-current" />
                        </button>
                      </div>
                      <p className="text-gray-600 text-sm mb-4">{listing.description}</p>
                      <div className="flex items-center text-gray-700 mb-2">
                        <MapPin className="w-4 h-4 mr-2" />
                        {listing.city}
                      </div>
                      <div className="flex items-center text-gray-700">
                        <DollarSign className="w-4 h-4 mr-2" />
                        €{listing.rent}{t[language].perMonth}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">{t[language].aboutUs}</h3>
              <p className="text-gray-300">{t[language].aboutText}</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">{t[language].contact}</h3>
              <p className="text-gray-300">info@sakanera.com</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Links</h3>
              <div className="space-y-2">
                <a href="#" className="block text-gray-300 hover:text-white">{t[language].termsOfService}</a>
                <a href="#" className="block text-gray-300 hover:text-white">{t[language].privacyPolicy}</a>
                <a href="#" className="block text-gray-300 hover:text-white">{t[language].imprint}</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>© 2024 sakanera. {t[language].allRightsReserved}</p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{t[language].login}</h2>
              <button onClick={() => setShowLoginModal(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <form className="space-y-4" onSubmit={async (e) => {
              e.preventDefault();
              const email = e.target.email.value;
              const password = e.target.password.value;
              
              try {
                setLoading(true);
                const { data, error } = await signIn(email, password);
                
                if (error) throw error;
                
                alert(t[language].loginSuccess);
                setShowLoginModal(false);
              } catch (error) {
                console.error('Login error:', error);
                alert(t[language].loginFailed + ': ' + error.message);
              } finally {
                setLoading(false);
              }
            }}>
              <div>
                <label className="block text-sm font-medium mb-1">{t[language].email}</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t[language].password}</label>
                <input
                  type="password"
                  name="password"
                  required
                  minLength={6}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-sky-400 to-blue-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
              >
                {loading ? 'Loading...' : t[language].login}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {language === 'de' ? 'Noch kein Account?' : "Don't have an account?"}{' '}
                <button
                  onClick={() => {
                    setShowLoginModal(false);
                    navigateTo('profile');
                  }}
                  className="text-sky-600 hover:underline font-medium"
                >
                  {language === 'de' ? 'Jetzt registrieren' : 'Sign up now'}
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Subscription Modal */}
      {showSubscription && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{t[language].chooseSubscription}</h2>
              <button onClick={() => setShowSubscription(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Basic */}
              <div className="border-2 rounded-lg p-6 hover:border-sky-400 transition">
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-2">{t[language].basic}</h3>
                  <div className="text-4xl font-bold text-sky-600 mb-4">€9.99</div>
                  <p className="text-gray-600 mb-6">1 {t[language].month}</p>
                  <button
                    onClick={() => {
                      alert(language === 'de' ? 'Stripe Integration kommt bald!' : 'Stripe integration coming soon!');
                      setShowSubscription(false);
                    }}
                    className="w-full py-3 bg-sky-400 text-white rounded-lg font-semibold hover:bg-sky-500"
                  >
                    {t[language].selectPlan}
                  </button>
                </div>
              </div>

              {/* Standard */}
              <div className="border-2 border-sky-400 rounded-lg p-6 relative">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-sky-400 text-white px-4 py-1 rounded-full text-sm font-bold">
                    {language === 'de' ? 'Beliebt' : 'Popular'}
                  </span>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-2">{t[language].standard}</h3>
                  <div className="text-4xl font-bold text-sky-600 mb-4">€24.99</div>
                  <p className="text-gray-600 mb-6">3 {t[language].months}</p>
                  <button
                    onClick={() => {
                      alert(language === 'de' ? 'Stripe Integration kommt bald!' : 'Stripe integration coming soon!');
                      setShowSubscription(false);
                    }}
                    className="w-full py-3 bg-sky-400 text-white rounded-lg font-semibold hover:bg-sky-500"
                  >
                    {t[language].selectPlan}
                  </button>
                </div>
              </div>

              {/* Premium */}
              <div className="border-2 rounded-lg p-6 hover:border-sky-400 transition">
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-2">{t[language].premium}</h3>
                  <div className="text-4xl font-bold text-sky-600 mb-4">€44.99</div>
                  <p className="text-gray-600 mb-6">6 {t[language].months}</p>
                  <button
                    onClick={() => {
                      alert(language === 'de' ? 'Stripe Integration kommt bald!' : 'Stripe integration coming soon!');
                      setShowSubscription(false);
                    }}
                    className="w-full py-3 bg-sky-400 text-white rounded-lg font-semibold hover:bg-sky-500"
                  >
                    {t[language].selectPlan}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
