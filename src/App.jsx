import React, { useState, useEffect } from 'react';
import { Home, Users, Search, Plus, MapPin, DollarSign, Calendar, User, Heart, X, MessageCircle, Filter, Globe, ChevronDown } from 'lucide-react';
import { supabase, authHelpers, profileHelpers, listingHelpers, favoriteHelpers, storageHelpers } from './supabaseClient';

export default function RoomatePlatform() {
  // State Management
  const [currentView, setCurrentView] = useState('home');
  const [listings, setListings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState('de');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showListings, setShowListings] = useState(false);
  const [showAddListing, setShowAddListing] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [listingToDelete, setListingToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);
  
  // Filter State
  const [filters, setFilters] = useState({
    city: 'all',
    type: 'all',
    maxRent: 'all',
    gender: 'all'
  });

  // Auth State Management - Supabase Integration
  useEffect(() => {
    // Check initial auth state
    const initAuth = async () => {
      const currentUser = await authHelpers.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        // Load profile
        const { data: profileData } = await profileHelpers.getProfile(currentUser.id);
        if (profileData) {
          setUserProfile(profileData);
        }
      }
      setLoading(false);
    };

    initAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = authHelpers.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        const { data: profileData } = await profileHelpers.getProfile(session.user.id);
        if (profileData) {
          setUserProfile(profileData);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load Listings from Supabase
  useEffect(() => {
    loadListings();
  }, [filters]);

  // Load Favorites when user changes
  useEffect(() => {
    if (user) {
      loadFavorites();
    } else {
      setFavorites([]);
    }
  }, [user]);

  const loadListings = async () => {
    setLoading(true);
    const { data, error } = await listingHelpers.getAllListings(filters);
    
    if (error) {
      console.error('Fehler beim Laden der Listings:', error);
    } else {
      setListings(data || []);
    }
    setLoading(false);
  };

  const loadFavorites = async () => {
    if (!user) return;
    
    const { data, error } = await favoriteHelpers.getUserFavorites(user.id);
    
    if (error) {
      console.error('Fehler beim Laden der Favoriten:', error);
    } else {
      setFavorites(data?.map(f => f.listing) || []);
    }
  };

  // Browser History Navigation
  useEffect(() => {
    window.history.replaceState({ view: 'home', showListings: false }, '', '');

    const handlePopState = (event) => {
      if (event.state) {
        setCurrentView(event.state.view);
        if (event.state.showListings !== undefined) {
          setShowListings(event.state.showListings);
        }
        if (event.state.view === 'home' && !event.state.showListings) {
          setShowAddListing(false);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileDropdown && !event.target.closest('.profile-dropdown-container')) {
        setShowProfileDropdown(false);
      }
      if (showLanguageDropdown && !event.target.closest('.language-dropdown-container')) {
        setShowLanguageDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileDropdown, showLanguageDropdown]);

  const navigateTo = (view, showListingsValue = false) => {
    setCurrentView(view);
    setShowListings(showListingsValue);
    window.history.pushState({ view, showListings: showListingsValue }, '', '');
  };

  // Translations with English support
  const t = {
    de: {
      // Header
      logo: 'sakanera',
      postAd: 'Inserieren',
      language: 'Sprache',
      
      // Hero
      heroTitle: 'Zahle die Hälfte der Miete',
      heroSubtitle: 'Spare Geld & finde coole Mitbewohner',
      heroDescription: 'Teile deine Wohnung, teile dein Leben',
      exploreCities: 'Entdecke die Städte',
      
      // Filter
      filter: 'Filter',
      allCities: 'Alle Städte',
      maxRent: 'Max. Miete',
      all: 'Alle',
      male: 'Männlich',
      female: 'Weiblich',
      anyGender: 'Egal',
      allListings: 'Alle Inserate',
      offerRoom: 'Zimmer anbieten',
      searchRoommate: 'Mitbewohner suchen',
      reset: 'Zurücksetzen',
      apply: 'Anwenden',
      
      // Listing
      perMonth: '/ Monat',
      from: 'ab',
      years: 'Jahre',
      contact: 'Kontakt aufnehmen',
      contactDetails: 'Kontaktdaten',
      deleteListing: 'Inserat löschen',
      room: 'Zimmer',
      roommate: 'Mitbewohner',
      availableFrom: 'Verfügbar ab',
      squareMeters: 'm²',
      rooms: 'Zimmer',
      
      // Smoking
      nonSmoker: 'Nichtraucher',
      balcony: 'Balkon',
      smoker: 'Raucher',
      smoking: 'Rauchen',
      
      // Cleanliness
      veryClean: 'Sehr ordentlich',
      normal: 'Normal',
      relaxed: 'Entspannt',
      cleanliness: 'Ordnung',
      
      // Navigation
      home: 'Home',
      search: 'Suchen',
      favorites: 'Favoriten',
      profile: 'Profil',
      about: 'Über Uns',
      
      // Footer
      company: 'Unternehmen',
      legal: 'Rechtliches',
      support: 'Support',
      imprint: 'Impressum',
      privacy: 'Datenschutz',
      terms: 'AGB',
      contactFooter: 'Kontakt',
      faq: 'FAQ',
      help: 'Hilfe',
      aboutUs: 'Über uns',
      careers: 'Karriere',
      press: 'Presse',
      copyright: '© 2024 sakanera. Alle Rechte vorbehalten.',
      address: 'An der Haupttribüne 1, 52070 Aachen',
      feedback: 'Feedback senden',
      feedbackTitle: 'Dein Feedback',
      feedbackDesc: 'Wir freuen uns über dein Feedback! Teile uns deine Meinung, Vorschläge oder Probleme mit.',
      yourName: 'Dein Name',
      yourEmail: 'Deine E-Mail',
      message: 'Nachricht',
      messagePlaceholder: 'Schreibe uns deine Nachricht...',
      submit: 'Absenden',
      feedbackSuccess: 'Vielen Dank für dein Feedback!',
      close: 'Schließen',
      cancel: 'Abbrechen',
      
      // Favorites
      myFavorites: 'Meine Favoriten',
      noFavorites: 'Noch keine Favoriten vorhanden',
      noFavoritesDesc: 'Speichere Inserate als Favoriten, um sie später wieder zu finden.',
      
      // Profile
      yourProfile: 'Dein Profil',
      createProfile: 'Profil erstellen',
      manageInfo: 'Verwalte deine Informationen',
      createProfileDesc: 'Erstelle dein Profil um Inserate zu erstellen',
      profileImage: 'Profilbild',
      uploadImage: 'Bild hochladen',
      imageUploaded: 'Bild hochgeladen',
      name: 'Name',
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
      saveProfile: 'Profil speichern',
      updateProfile: 'Profil aktualisieren',
      createProfileInfo: 'Erstelle dein Profil um Inserate zu veröffentlichen',
      logout: 'Abmelden',
      login: 'Anmelden',
      register: 'Registrieren',
      loggedInAs: 'Angemeldet als',
      notLoggedIn: 'Nicht angemeldet',
      pleaseLogin: 'Bitte melde dich an um diese Funktion zu nutzen',
      loggedOut: 'Erfolgreich abgemeldet',
      myListings: 'Meine Inserate',
      noMyListings: 'Du hast noch keine Inserate erstellt',
      noListingsYet: 'Noch keine Inserate vorhanden',
      beFirstToPost: 'Sei der Erste und erstelle ein Inserat!',
      
      // Create Listing
      createListing: 'Inserat erstellen',
      listingType: 'Art des Inserats',
      title: 'Titel',
      titlePlaceholder: 'z.B. Gemütliches Zimmer in Uninähe',
      description: 'Beschreibung',
      descriptionPlaceholder: 'Beschreibe dein Zimmer oder dich als Mitbewohner...',
      city: 'Stadt',
      rent: 'Miete (€)',
      roomCount: 'Anzahl Zimmer',
      size: 'Größe',
      gender: 'Geschlecht',
      amenities: 'Ausstattung',
      amenitiesPlaceholder: 'z.B. WLAN, Waschmaschine, Balkon...',
      contactData: 'Kontaktdaten',
      contactFromProfile: 'Diese Daten werden aus deinem Profil übernommen',
      post: 'Inserieren',
      
      // Subscription
      chooseSubscription: 'Wähle dein Abo',
      subscriptionDesc: 'Inseriere dein Angebot und finde den perfekten Mitbewohner',
      basic: 'Basis',
      standard: 'Standard',
      premium: 'Premium',
      popular: 'BELIEBT',
      monthRuntime: 'Monat Laufzeit',
      monthsRuntime: 'Monate Laufzeit',
      adOnlineFor: 'Inserat für',
      monthOnline: 'Monat online',
      monthsOnline: 'Monate online',
      unlimitedContact: 'Unbegrenzte Kontaktanfragen',
      fullVisibility: 'Volle Sichtbarkeit',
      cheaper: 'günstiger',
      bestValue: 'Beste Preis-Leistung',
      tip: 'Tipp:',
      longerCheaper: 'Je länger die Laufzeit, desto günstiger der Preis pro Monat!',
      continueToPayment: 'Weiter zur Zahlung',
      chooseAbo: 'Abo wählen',
      back: 'Zurück',
      
      // Delete confirmation
      roommateFound: 'Mitbewohner gefunden!',
      confirmDelete: 'Möchtest du dein Inserat löschen?',
      deleteInfo: 'Dein Inserat wird dauerhaft entfernt.',
      yesConfirm: 'Ja, löschen',
      
      // Loading & Errors
      loading: 'Laden...',
      error: 'Fehler',
      success: 'Erfolg',
      loginSuccess: 'Erfolgreich angemeldet!',
      logoutSuccess: 'Erfolgreich abgemeldet!',
      registrationSuccess: 'Registrierung erfolgreich!',
      profileUpdated: 'Profil aktualisiert!',
      listingCreated: 'Inserat erstellt!',
      listingDeleted: 'Inserat gelöscht!',
    },
    en: {
      // Header
      logo: 'sakanera',
      postAd: 'Post Ad',
      language: 'Language',
      
      // Hero
      heroTitle: 'Pay Half the Rent',
      heroSubtitle: 'Save Money & Find Cool Roommates',
      heroDescription: 'Share your apartment, share your life',
      exploreCities: 'Explore Cities',
      
      // Filter
      filter: 'Filter',
      allCities: 'All Cities',
      maxRent: 'Max. Rent',
      all: 'All',
      male: 'Male',
      female: 'Female',
      anyGender: 'Any',
      allListings: 'All Listings',
      offerRoom: 'Offer Room',
      searchRoommate: 'Search Roommate',
      reset: 'Reset',
      apply: 'Apply',
      
      // Listing
      perMonth: '/ Month',
      from: 'from',
      years: 'Years',
      contact: 'Contact',
      contactDetails: 'Contact Details',
      deleteListing: 'Delete Listing',
      room: 'Room',
      roommate: 'Roommate',
      availableFrom: 'Available from',
      squareMeters: 'sqm',
      rooms: 'Rooms',
      
      // Smoking
      nonSmoker: 'Non-Smoker',
      balcony: 'Balcony',
      smoker: 'Smoker',
      smoking: 'Smoking',
      
      // Cleanliness
      veryClean: 'Very Clean',
      normal: 'Normal',
      relaxed: 'Relaxed',
      cleanliness: 'Cleanliness',
      
      // Navigation
      home: 'Home',
      search: 'Search',
      favorites: 'Favorites',
      profile: 'Profile',
      about: 'About Us',
      
      // Footer
      company: 'Company',
      legal: 'Legal',
      support: 'Support',
      imprint: 'Imprint',
      privacy: 'Privacy',
      terms: 'Terms',
      contactFooter: 'Contact',
      faq: 'FAQ',
      help: 'Help',
      aboutUs: 'About us',
      careers: 'Careers',
      press: 'Press',
      copyright: '© 2024 sakanera. All rights reserved.',
      address: 'An der Haupttribüne 1, 52070 Aachen',
      feedback: 'Send Feedback',
      feedbackTitle: 'Your Feedback',
      feedbackDesc: 'We appreciate your feedback! Share your opinion, suggestions or problems with us.',
      yourName: 'Your Name',
      yourEmail: 'Your Email',
      message: 'Message',
      messagePlaceholder: 'Write your message...',
      submit: 'Submit',
      feedbackSuccess: 'Thank you for your feedback!',
      close: 'Close',
      cancel: 'Cancel',
      
      // Favorites
      myFavorites: 'My Favorites',
      noFavorites: 'No favorites yet',
      noFavoritesDesc: 'Save listings as favorites to find them later.',
      
      // Profile
      yourProfile: 'Your Profile',
      createProfile: 'Create Profile',
      manageInfo: 'Manage your information',
      createProfileDesc: 'Create your profile to post listings',
      profileImage: 'Profile Picture',
      uploadImage: 'Upload Picture',
      imageUploaded: 'Picture uploaded',
      name: 'Name',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      passwordMismatch: 'Passwords do not match',
      passwordMinLength: 'Password must be at least 6 characters',
      phone: 'Phone',
      age: 'Age',
      occupation: 'Occupation/Status',
      saveProfile: 'Save Profile',
      updateProfile: 'Update Profile',
      createProfileInfo: 'Create your profile to post listings',
      logout: 'Logout',
      login: 'Login',
      register: 'Register',
      loggedInAs: 'Logged in as',
      notLoggedIn: 'Not logged in',
      pleaseLogin: 'Please login to use this feature',
      loggedOut: 'Successfully logged out',
      myListings: 'My Listings',
      noMyListings: 'You have no listings yet',
      noListingsYet: 'No listings yet',
      beFirstToPost: 'Be the first to create a listing!',
      
      // Create Listing
      createListing: 'Create Listing',
      listingType: 'Listing Type',
      title: 'Title',
      titlePlaceholder: 'e.g. Cozy room near university',
      description: 'Description',
      descriptionPlaceholder: 'Describe your room or yourself as a roommate...',
      city: 'City',
      rent: 'Rent (€)',
      roomCount: 'Number of Rooms',
      size: 'Size',
      gender: 'Gender',
      amenities: 'Amenities',
      amenitiesPlaceholder: 'e.g. WiFi, Washing machine, Balcony...',
      contactData: 'Contact Data',
      contactFromProfile: 'This data is taken from your profile',
      post: 'Post',
      
      // Subscription
      chooseSubscription: 'Choose Your Plan',
      subscriptionDesc: 'Post your offer and find the perfect roommate',
      basic: 'Basic',
      standard: 'Standard',
      premium: 'Premium',
      popular: 'POPULAR',
      monthRuntime: 'Month Runtime',
      monthsRuntime: 'Months Runtime',
      adOnlineFor: 'Ad online for',
      monthOnline: 'Month online',
      monthsOnline: 'Months online',
      unlimitedContact: 'Unlimited contact requests',
      fullVisibility: 'Full visibility',
      cheaper: 'cheaper',
      bestValue: 'Best value',
      tip: 'Tip:',
      longerCheaper: 'The longer the runtime, the cheaper the price per month!',
      continueToPayment: 'Continue to payment',
      chooseAbo: 'Choose Plan',
      back: 'Back',
      
      // Delete confirmation
      roommateFound: 'Roommate Found!',
      confirmDelete: 'Do you want to delete your listing?',
      deleteInfo: 'Your listing will be permanently removed.',
      yesConfirm: 'Yes, delete',
      
      // Loading & Errors
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      loginSuccess: 'Successfully logged in!',
      logoutSuccess: 'Successfully logged out!',
      registrationSuccess: 'Registration successful!',
      profileUpdated: 'Profile updated!',
      listingCreated: 'Listing created!',
      listingDeleted: 'Listing deleted!',
    }
  };

  // Auth Functions with Supabase
  const handleRegister = async (formData) => {
    try {
      // Register user
      const { data: authData, error: authError } = await authHelpers.signUp(
        formData.email,
        formData.password,
        {
          firstName: formData.firstName,
          lastName: formData.lastName
        }
      );

      if (authError) throw authError;

      // Create profile
      const { data: profileData, error: profileError } = await profileHelpers.createProfile(
        authData.user.id,
        {
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone || '',
          age: formData.age ? parseInt(formData.age) : null,
          occupation: formData.occupation || ''
        }
      );

      if (profileError) throw profileError;

      setUserProfile(profileData);
      alert(t[language].registrationSuccess);
      setShowLoginModal(false);
    } catch (error) {
      alert(`${t[language].error}: ${error.message}`);
    }
  };

  const handleLogin = async (email, password) => {
    try {
      const { data, error } = await authHelpers.signIn(email, password);
      
      if (error) throw error;

      alert(t[language].loginSuccess);
      setShowLoginModal(false);
    } catch (error) {
      alert(`${t[language].error}: ${error.message}`);
    }
  };

  const handleLogout = async () => {
    try {
      await authHelpers.signOut();
      setUserProfile(null);
      setUser(null);
      setCurrentView('home');
      alert(t[language].logoutSuccess);
    } catch (error) {
      alert(`${t[language].error}: ${error.message}`);
    }
  };

  const handleSubmitListing = async (formData) => {
    if (!user || !userProfile) {
      alert(t[language].pleaseLogin);
      return;
    }

    try {
      const listingData = {
        user_id: user.id,
        type: formData.type,
        title: formData.title,
        description: formData.description,
        city: formData.city,
        rent: parseFloat(formData.rent),
        square_meters: formData.squareMeters ? parseInt(formData.squareMeters) : null,
        room_count: formData.roomCount ? parseInt(formData.roomCount) : null,
        available_from: formData.availableFrom || null,
        age: formData.age ? parseInt(formData.age) : null,
        gender: formData.gender || 'all',
        occupation: formData.occupation || '',
        smoking: formData.smoking,
        cleanliness: formData.cleanliness,
        amenities: formData.amenities || '',
        contact_name: `${userProfile.first_name} ${userProfile.last_name}`,
        contact_email: userProfile.email,
        contact_phone: userProfile.phone || '',
        subscription_type: 'basic',
        is_active: true
      };

      const { data, error } = await listingHelpers.createListing(listingData);
      
      if (error) throw error;

      alert(t[language].listingCreated);
      setShowAddListing(false);
      loadListings();
      setCurrentView('search');
    } catch (error) {
      alert(`${t[language].error}: ${error.message}`);
    }
  };

  const handleDeleteListing = (listing) => {
    setListingToDelete(listing);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!listingToDelete) return;

    try {
      const { error } = await listingHelpers.deleteListing(listingToDelete.id);
      
      if (error) throw error;

      alert(t[language].listingDeleted);
      setShowDeleteConfirm(false);
      setListingToDelete(null);
      loadListings();
    } catch (error) {
      alert(`${t[language].error}: ${error.message}`);
    }
  };

  const handleToggleFavorite = async (listing) => {
    if (!user) {
      alert(t[language].pleaseLogin);
      return;
    }

    try {
      const isFav = favorites.some(f => f.id === listing.id);
      
      if (isFav) {
        await favoriteHelpers.removeFavorite(user.id, listing.id);
      } else {
        await favoriteHelpers.addFavorite(user.id, listing.id);
      }
      
      loadFavorites();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  // Language switcher component
  const LanguageSwitcher = () => (
    <div className="language-dropdown-container relative">
      <button
        onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
        className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-sky-400 transition"
      >
        <Globe className="w-5 h-5" />
        <span className="hidden md:inline">{language.toUpperCase()}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {showLanguageDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-50">
          <button
            onClick={() => {
              setLanguage('de');
              setShowLanguageDropdown(false);
            }}
            className={`w-full px-4 py-2 text-left hover:bg-sky-50 transition ${
              language === 'de' ? 'bg-sky-100 text-sky-600 font-semibold' : 'text-gray-700'
            }`}
          >
            🇩🇪 Deutsch
          </button>
          <button
            onClick={() => {
              setLanguage('en');
              setShowLanguageDropdown(false);
            }}
            className={`w-full px-4 py-2 text-left hover:bg-sky-50 transition ${
              language === 'en' ? 'bg-sky-100 text-sky-600 font-semibold' : 'text-gray-700'
            }`}
          >
            🇬🇧 English
          </button>
        </div>
      )}
    </div>
  );

  // Rest of the component continues...
  // (Due to file size, I'll create this in multiple parts)

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-8">
              <h1 
                onClick={() => navigateTo('home')}
                className="text-2xl font-bold text-sky-400 cursor-pointer"
              >
                {t[language].logo}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              {/* Language Switcher */}
              <LanguageSwitcher />

              {/* Post Ad Button */}
              {userProfile && (
                <button 
                  onClick={() => setShowAddListing(true)}
                  className="hidden md:flex items-center gap-2 bg-sky-400 text-white px-6 py-2 rounded-lg hover:bg-sky-500 transition"
                >
                  <Plus className="w-5 h-5" />
                  {t[language].postAd}
                </button>
              )}

              {/* Profile Menu */}
              <div className="profile-dropdown-container relative">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-sky-400 transition"
                >
                  <User className="w-5 h-5" />
                  <ChevronDown className="w-4 h-4" />
                </button>

                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border py-2 z-50">
                    {userProfile ? (
                      <>
                        <div className="px-4 py-2 border-b">
                          <p className="text-sm text-gray-500">{t[language].loggedInAs}</p>
                          <p className="font-semibold">{userProfile.first_name} {userProfile.last_name}</p>
                        </div>
                        <button
                          onClick={() => {
                            setCurrentView('profile');
                            setShowProfileDropdown(false);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-sky-50 transition"
                        >
                          {t[language].profile}
                        </button>
                        <button
                          onClick={() => {
                            handleLogout();
                            setShowProfileDropdown(false);
                          }}
                          className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition"
                        >
                          {t[language].logout}
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          setShowLoginModal(true);
                          setShowProfileDropdown(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-sky-50 transition"
                      >
                        {t[language].login}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - I'll create remaining sections in next files */}
      <main className="flex-1">
        {currentView === 'home' && !showListings && (
          <div className="relative">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-sky-400 to-blue-500 text-white py-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-5xl md:text-6xl font-bold mb-6">
                  {t[language].heroTitle}
                </h2>
                <p className="text-2xl md:text-3xl mb-4 opacity-90">
                  {t[language].heroSubtitle}
                </p>
                <p className="text-xl mb-12 opacity-80">
                  {t[language].heroDescription}
                </p>
                <button
                  onClick={() => {
                    setShowListings(true);
                    navigateTo('home', true);
                  }}
                  className="bg-white text-sky-400 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition transform hover:scale-105 shadow-xl"
                >
                  {t[language].exploreCities}
                </button>
              </div>
            </div>

            {/* Cities Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {['Berlin', 'München', 'Hamburg', 'Köln', 'Frankfurt', 'Stuttgart', 'Düsseldorf', 'Leipzig'].map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      setFilters({ ...filters, city });
                      setShowListings(true);
                      navigateTo('home', true);
                    }}
                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition transform hover:scale-105 text-center"
                  >
                    <div className="text-4xl mb-3">🏙️</div>
                    <h3 className="font-semibold text-lg">{city}</h3>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Listings View - Placeholder for now */}
        {(currentView === 'home' && showListings) || currentView === 'search' ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-3xl font-bold mb-6">{t[language].allListings}</h2>
            
            {loading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-400 mx-auto"></div>
                <p className="mt-4 text-gray-600">{t[language].loading}</p>
              </div>
            ) : listings.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-2xl font-semibold mb-2">{t[language].noListingsYet}</h3>
                <p className="text-gray-600">{t[language].beFirstToPost}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <div key={listing.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-semibold">{listing.title}</h3>
                        <button
                          onClick={() => handleToggleFavorite(listing)}
                          className={`p-2 rounded-full transition ${
                            favorites.some(f => f.id === listing.id)
                              ? 'text-red-500'
                              : 'text-gray-400 hover:text-red-500'
                          }`}
                        >
                          <Heart className="w-5 h-5" fill={favorites.some(f => f.id === listing.id) ? 'currentColor' : 'none'} />
                        </button>
                      </div>
                      <p className="text-gray-600 mb-4 line-clamp-2">{listing.description}</p>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{listing.city}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          <span className="font-semibold text-lg text-sky-400">
                            {listing.rent}€ {t[language].perMonth}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedContact(listing);
                          setShowContactModal(true);
                        }}
                        className="w-full mt-4 bg-sky-400 text-white py-2 rounded-lg hover:bg-sky-500 transition"
                      >
                        {t[language].contact}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}

        {/* Other views: favorites, profile, about */}
        {currentView === 'favorites' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-3xl font-bold mb-6">{t[language].myFavorites}</h2>
            {favorites.length === 0 ? (
              <div className="text-center py-20">
                <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-2xl font-semibold mb-2">{t[language].noFavorites}</h3>
                <p className="text-gray-600">{t[language].noFavoritesDesc}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((listing) => (
                  <div key={listing.id} className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-semibold mb-2">{listing.title}</h3>
                    <p className="text-gray-600 mb-4">{listing.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sky-400 font-semibold">{listing.rent}€/Monat</span>
                      <button
                        onClick={() => handleToggleFavorite(listing)}
                        className="text-red-500"
                      >
                        <Heart className="w-5 h-5" fill="currentColor" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {currentView === 'profile' && (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-3xl font-bold mb-6">{t[language].yourProfile}</h2>
            {userProfile ? (
              <div className="bg-white rounded-lg shadow-md p-8">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">{t[language].firstName}</label>
                    <p className="text-lg">{userProfile.first_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t[language].lastName}</label>
                    <p className="text-lg">{userProfile.last_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t[language].email}</label>
                    <p className="text-lg">{userProfile.email}</p>
                  </div>
                  {userProfile.phone && (
                    <div>
                      <label className="block text-sm font-medium mb-1">{t[language].phone}</label>
                      <p className="text-lg">{userProfile.phone}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">{t[language].pleaseLogin}</p>
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="bg-sky-400 text-white px-6 py-3 rounded-lg hover:bg-sky-500 transition"
                >
                  {t[language].login}
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">{t[language].logo}</h3>
              <p className="text-gray-400 text-sm">{t[language].address}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t[language].company}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button className="hover:text-white transition">{t[language].aboutUs}</button></li>
                <li><button className="hover:text-white transition">{t[language].careers}</button></li>
                <li><button className="hover:text-white transition">{t[language].press}</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t[language].support}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => setShowFeedback(true)} className="hover:text-white transition">{t[language].contactFooter}</button></li>
                <li><button className="hover:text-white transition">{t[language].faq}</button></li>
                <li><button className="hover:text-white transition">{t[language].help}</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t[language].legal}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button className="hover:text-white transition">{t[language].imprint}</button></li>
                <li><button className="hover:text-white transition">{t[language].privacy}</button></li>
                <li><button className="hover:text-white transition">{t[language].terms}</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>{t[language].copyright}</p>
          </div>
        </div>
      </footer>

      {/* Bottom Navigation (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40">
        <div className="grid grid-cols-4 gap-1">
          <button
            onClick={() => navigateTo('home')}
            className={`flex flex-col items-center py-3 ${
              currentView === 'home' ? 'text-sky-400' : 'text-gray-600'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1">{t[language].home}</span>
          </button>
          <button
            onClick={() => setCurrentView('search')}
            className={`flex flex-col items-center py-3 ${
              currentView === 'search' ? 'text-sky-400' : 'text-gray-600'
            }`}
          >
            <Search className="w-6 h-6" />
            <span className="text-xs mt-1">{t[language].search}</span>
          </button>
          <button
            onClick={() => setCurrentView('favorites')}
            className={`flex flex-col items-center py-3 ${
              currentView === 'favorites' ? 'text-sky-400' : 'text-gray-600'
            }`}
          >
            <Heart className="w-6 h-6" />
            <span className="text-xs mt-1">{t[language].favorites}</span>
          </button>
          <button
            onClick={() => setCurrentView('profile')}
            className={`flex flex-col items-center py-3 ${
              currentView === 'profile' ? 'text-sky-400' : 'text-gray-600'
            }`}
          >
            <User className="w-6 h-6" />
            <span className="text-xs mt-1">{t[language].profile}</span>
          </button>
        </div>
      </nav>

      {/* Modals - Contact, Delete, Login, Create Listing, etc. */}
      {/* These would be added in full implementation */}
      {/* For brevity, showing basic structure */}
      
      {showContactModal && selectedContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{t[language].contactDetails}</h2>
              <button onClick={() => setShowContactModal(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t[language].name}</label>
                <p className="text-lg">{selectedContact.contact_name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t[language].email}</label>
                <p className="text-lg text-sky-600">{selectedContact.contact_email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t[language].phone}</label>
                <p className="text-lg text-sky-600">{selectedContact.contact_phone}</p>
              </div>
            </div>
            <button
              onClick={() => setShowContactModal(false)}
              className="w-full mt-6 bg-sky-400 text-white py-3 rounded-lg hover:bg-sky-500 transition"
            >
              {t[language].close}
            </button>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">🎉 {t[language].roommateFound}</h2>
            <p className="text-gray-700 mb-4">{t[language].confirmDelete}</p>
            <p className="text-sm text-gray-500 mb-6">{t[language].deleteInfo}</p>
            
            <div className="flex gap-3">
              <button
                onClick={handleConfirmDelete}
                className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition"
              >
                {t[language].yesConfirm}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition"
              >
                {t[language].cancel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
