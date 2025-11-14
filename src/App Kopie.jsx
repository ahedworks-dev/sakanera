import React, { useState, useEffect } from 'react';
import { Home, Users, Search, Plus, MapPin, DollarSign, Calendar, User, Heart, X, MessageCircle, Filter, Globe, ChevronDown, Mail, Lock, Phone, Briefcase, Send, ArrowLeft } from 'lucide-react';
import { supabase, authHelpers, profileHelpers, listingHelpers, favoriteHelpers } from './localAuth';

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
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showListings, setShowListings] = useState(false);
  const [showAddListing, setShowAddListing] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [listingToDelete, setListingToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoginMode, setIsLoginMode] = useState(true);
  
  // Contact Form State
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [contactSuccess, setContactSuccess] = useState(false);
  
  // Form States
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '', phone: '', age: '', occupation: ''
  });
  const [listingForm, setListingForm] = useState({
    type: 'room',
    title: '',
    description: '',
    city: 'Aachen',
    rent: '',
    squareMeters: '',
    roomCount: '',
    availableFrom: '',
    age: '',
    gender: 'all',
    occupation: '',
    smoking: 'no',
    cleanliness: 'normal',
    amenities: ''
  });
  
  // Filter State
  const [filters, setFilters] = useState({
    city: 'all',
    type: 'all',
    maxRent: 'all',
    gender: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);

  // Auth State Management
  useEffect(() => {
    const initAuth = async () => {
      const currentUser = await authHelpers.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        const { data: profileData } = await profileHelpers.getProfile(currentUser.id);
        if (profileData) {
          setUserProfile(profileData);
        }
      }
      setLoading(false);
    };

    initAuth();

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

  // Load Listings
  useEffect(() => {
    loadListings();
  }, [filters]);

  // Load Favorites
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

  // Translations
  const t = {
    de: {
      logo: 'sakanera',
      postAd: 'Inserieren',
      language: 'Sprache',
      heroTitle: 'Zahle die Hälfte der Miete',
      heroSubtitle: 'Spare Geld & finde coole Mitbewohner',
      heroDescription: 'Teile deine Wohnung, teile dein Leben',
      exploreCities: 'Entdecke die Städte',
      backButton: '← Zurück',
      citiesPageTitle: 'Wähle deine Stadt',
      accountSettings: 'Account Einstellungen',
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
      nonSmoker: 'Nichtraucher',
      balcony: 'Balkon',
      smoker: 'Raucher',
      smoking: 'Rauchen',
      veryClean: 'Sehr ordentlich',
      normal: 'Normal',
      relaxed: 'Entspannt',
      cleanliness: 'Ordnung',
      home: 'Home',
      search: 'Suchen',
      favorites: 'Favoriten',
      profile: 'Profil',
      about: 'Über Uns',
      company: 'Unternehmen',
      legal: 'Rechtliches',
      support: 'Support',
      imprint: 'Impressum',
      privacy: 'Datenschutz',
      terms: 'AGB',
      contactFooter: 'Kontakt',
      feedback: 'Feedback senden',
      aboutUs: 'Über uns',
      careers: 'Karriere',
      press: 'Presse',
      copyright: '© 2025 sakanera. Alle Rechte vorbehalten.',
      address: 'An der Haupttribüne 1, 52070 Aachen',
      close: 'Schließen',
      cancel: 'Abbrechen',
      myFavorites: 'Meine Favoriten',
      noFavorites: 'Noch keine Favoriten vorhanden',
      noFavoritesDesc: 'Speichere Inserate als Favoriten, um sie später wieder zu finden.',
      yourProfile: 'Dein Profil',
      createProfile: 'Profil erstellen',
      manageInfo: 'Verwalte deine Informationen',
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
      logout: 'Abmelden',
      login: 'Anmelden',
      register: 'Registrieren',
      loggedInAs: 'Angemeldet als',
      notLoggedIn: 'Nicht angemeldet',
      pleaseLogin: 'Bitte melde dich an um diese Funktion zu nutzen',
      myListings: 'Meine Inserate',
      noMyListings: 'Du hast noch keine Inserate erstellt',
      noListingsYet: 'Noch keine Inserate vorhanden',
      beFirstToPost: 'Sei der Erste und erstelle ein Inserat!',
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
      roommateFound: 'Mitbewohner gefunden!',
      confirmDelete: 'Möchtest du dein Inserat löschen?',
      deleteInfo: 'Dein Inserat wird dauerhaft entfernt.',
      yesConfirm: 'Ja, löschen',
      loading: 'Laden...',
      error: 'Fehler',
      loginSuccess: 'Erfolgreich angemeldet!',
      registrationSuccess: 'Registrierung erfolgreich!',
      listingCreated: 'Inserat erstellt!',
      listingDeleted: 'Inserat gelöscht!',
      alreadyHaveAccount: 'Bereits registriert?',
      noAccountYet: 'Noch kein Account?',
      clickHere: 'Hier klicken',
      contactPageTitle: 'Kontaktiere uns',
      contactPageSubtitle: 'Wir freuen uns von dir zu hören!',
      yourName: 'Dein Name',
      yourEmail: 'Deine E-Mail',
      yourMessage: 'Deine Nachricht',
      messagePlaceholder: 'Schreib uns deine Nachricht...',
      send: 'Absenden',
      messageSent: 'Nachricht gesendet! Wir melden uns bald bei dir.',
      ourAddress: 'Unsere Adresse',
      writeUs: 'Schreib uns',
    },
    en: {
      logo: 'sakanera',
      postAd: 'Post Ad',
      language: 'Language',
      heroTitle: 'Pay Half the Rent',
      heroSubtitle: 'Save Money & Find Cool Roommates',
      heroDescription: 'Share your apartment, share your life',
      exploreCities: 'Explore Cities',
      backButton: '← Back',
      citiesPageTitle: 'Choose your city',
      accountSettings: 'Account Settings',
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
      nonSmoker: 'Non-Smoker',
      balcony: 'Balcony',
      smoker: 'Smoker',
      smoking: 'Smoking',
      veryClean: 'Very Clean',
      normal: 'Normal',
      relaxed: 'Relaxed',
      cleanliness: 'Cleanliness',
      home: 'Home',
      search: 'Search',
      favorites: 'Favorites',
      profile: 'Profile',
      about: 'About Us',
      company: 'Company',
      legal: 'Legal',
      support: 'Support',
      imprint: 'Imprint',
      privacy: 'Privacy',
      terms: 'Terms',
      contactFooter: 'Contact',
      feedback: 'Send Feedback',
      aboutUs: 'About us',
      careers: 'Careers',
      press: 'Press',
      copyright: '© 2025 sakanera. All rights reserved.',
      address: 'An der Haupttribüne 1, 52070 Aachen',
      close: 'Close',
      cancel: 'Cancel',
      myFavorites: 'My Favorites',
      noFavorites: 'No favorites yet',
      noFavoritesDesc: 'Save listings as favorites to find them later.',
      yourProfile: 'Your Profile',
      createProfile: 'Create Profile',
      manageInfo: 'Manage your information',
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
      logout: 'Logout',
      login: 'Login',
      register: 'Register',
      loggedInAs: 'Logged in as',
      notLoggedIn: 'Not logged in',
      pleaseLogin: 'Please login to use this feature',
      myListings: 'My Listings',
      noMyListings: 'You have no listings yet',
      noListingsYet: 'No listings yet',
      beFirstToPost: 'Be the first to create a listing!',
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
      roommateFound: 'Roommate Found!',
      confirmDelete: 'Do you want to delete your listing?',
      deleteInfo: 'Your listing will be permanently removed.',
      yesConfirm: 'Yes, delete',
      loading: 'Loading...',
      error: 'Error',
      loginSuccess: 'Successfully logged in!',
      registrationSuccess: 'Registration successful!',
      listingCreated: 'Listing created!',
      listingDeleted: 'Listing deleted!',
      alreadyHaveAccount: 'Already registered?',
      noAccountYet: 'No account yet?',
      clickHere: 'Click here',
      contactPageTitle: 'Contact Us',
      contactPageSubtitle: 'We would love to hear from you!',
      yourName: 'Your Name',
      yourEmail: 'Your Email',
      yourMessage: 'Your Message',
      messagePlaceholder: 'Write your message...',
      send: 'Send',
      messageSent: 'Message sent! We will get back to you soon.',
      ourAddress: 'Our Address',
      writeUs: 'Write to us',
    }
  };

  // Auth Functions
  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (registerForm.password !== registerForm.confirmPassword) {
      alert(t[language].passwordMismatch);
      return;
    }
    
    if (registerForm.password.length < 6) {
      alert(t[language].passwordMinLength);
      return;
    }

    try {
      console.log('🔵 Registrierung startet...');
      
      const { data: authData, error: authError } = await authHelpers.signUp(
        registerForm.email,
        registerForm.password,
        {
          firstName: registerForm.firstName,
          lastName: registerForm.lastName
        }
      );

      if (authError) {
        console.error('❌ Auth Error:', authError);
        throw authError;
      }

      console.log('✅ User erstellt:', authData.user);

      // Setze User State SOFORT
      setUser(authData.user);

      console.log('🔵 Erstelle Profil...');

      const { data: profileData, error: profileError } = await profileHelpers.createProfile(
        authData.user.id,
        {
          email: registerForm.email,
          first_name: registerForm.firstName,
          last_name: registerForm.lastName,
          phone: registerForm.phone || '',
          age: registerForm.age ? parseInt(registerForm.age) : null,
          occupation: registerForm.occupation || ''
        }
      );

      if (profileError) {
        console.error('❌ Profile Error:', profileError);
        throw profileError;
      }

      console.log('✅ Profil erstellt:', profileData);

      setUserProfile(profileData);
      
      console.log('✅ State gesetzt - User:', authData.user.email, 'Profil:', profileData.first_name);
      
      alert(t[language].registrationSuccess);
      setShowRegisterModal(false);
      setRegisterForm({
        firstName: '', lastName: '', email: '', password: '', confirmPassword: '', phone: '', age: '', occupation: ''
      });
    } catch (error) {
      alert(`${t[language].error}: ${error.message}`);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      console.log('🔵 Login startet...');
      
      const { data, error } = await authHelpers.signIn(loginForm.email, loginForm.password);
      
      if (error) {
        console.error('❌ Login Error:', error);
        throw error;
      }

      console.log('✅ Login erfolgreich:', data.user);

      // Setze User State
      setUser(data.user);

      console.log('🔵 Lade Profil...');

      // Lade Profil
      const { data: profileData, error: profileError } = await profileHelpers.getProfile(data.user.id);
      
      if (profileError) {
        console.error('⚠️ Profil nicht gefunden:', profileError);
      }
      
      if (profileData) {
        setUserProfile(profileData);
        console.log('✅ Profil geladen:', profileData.first_name);
      } else {
        console.warn('⚠️ Kein Profil gefunden für User:', data.user.id);
      }

      alert(t[language].loginSuccess);
      setShowLoginModal(false);
      setLoginForm({ email: '', password: '' });
    } catch (error) {
      console.error('❌ Login Fehler:', error);
      alert(`${t[language].error}: ${error.message}`);
    }
  };

  const handleLogout = async () => {
    try {
      await authHelpers.signOut();
      setUserProfile(null);
      setUser(null);
      setCurrentView('home');
      setShowListings(false);
    } catch (error) {
      alert(`${t[language].error}: ${error.message}`);
    }
  };

  const handleSubmitListing = async (e) => {
    e.preventDefault();
    
    if (!user || !userProfile) {
      alert(t[language].pleaseLogin);
      return;
    }

    try {
      const listingData = {
        user_id: user.id,
        type: listingForm.type,
        title: listingForm.title,
        description: listingForm.description,
        city: listingForm.city,
        rent: parseFloat(listingForm.rent),
        square_meters: listingForm.squareMeters ? parseInt(listingForm.squareMeters) : null,
        room_count: listingForm.roomCount ? parseInt(listingForm.roomCount) : null,
        available_from: listingForm.availableFrom || null,
        age: listingForm.age ? parseInt(listingForm.age) : null,
        gender: listingForm.gender || 'all',
        occupation: listingForm.occupation || '',
        smoking: listingForm.smoking,
        cleanliness: listingForm.cleanliness,
        amenities: listingForm.amenities || '',
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
      setListingForm({
        type: 'room',
        title: '',
        description: '',
        city: 'Aachen',
        rent: '',
        squareMeters: '',
        roomCount: '',
        availableFrom: '',
        age: '',
        gender: 'all',
        occupation: '',
        smoking: 'no',
        cleanliness: 'normal',
        amenities: ''
      });
      loadListings();
      setCurrentView('search');
    } catch (error) {
      alert(`${t[language].error}: ${error.message}`);
    }
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

  const handleContactSubmit = (e) => {
    e.preventDefault();
    console.log('Contact form submitted:', contactForm);
    setContactSuccess(true);
    setContactForm({ name: '', email: '', message: '' });
    setTimeout(() => setContactSuccess(false), 5000);
  };

  // Language Switcher Component
  const LanguageSwitcher = () => (
    <div className="language-dropdown-container relative">
      <button
        onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
        className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-sky-400 transition rounded-lg hover:bg-gray-50"
      >
        <Globe className="w-5 h-5" />
        <span className="hidden md:inline font-medium">{language.toUpperCase()}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {showLanguageDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-50">
          <button
            onClick={() => {
              setLanguage('de');
              setShowLanguageDropdown(false);
            }}
            className={`w-full px-4 py-2 text-left hover:bg-sky-50 transition flex items-center gap-2 ${
              language === 'de' ? 'bg-sky-100 text-sky-600 font-semibold' : 'text-gray-700'
            }`}
          >
            <span className="text-xl">🇩🇪</span>
            <span>Deutsch</span>
          </button>
          <button
            onClick={() => {
              setLanguage('en');
              setShowLanguageDropdown(false);
            }}
            className={`w-full px-4 py-2 text-left hover:bg-sky-50 transition flex items-center gap-2 ${
              language === 'en' ? 'bg-sky-100 text-sky-600 font-semibold' : 'text-gray-700'
            }`}
          >
            <span className="text-xl">🇬🇧</span>
            <span>English</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-8">
              <button 
                onClick={() => {
                  setCurrentView('home');
                  setShowListings(false);
                }}
                className="flex items-center gap-2 group"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-500 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
                  {t[language].logo}
                </h1>
              </button>
            </div>

            <div className="flex items-center gap-4">
              <LanguageSwitcher />

              {userProfile && (
                <button 
                  onClick={() => setShowAddListing(true)}
                  className="hidden md:flex items-center gap-2 bg-sky-400 text-white px-6 py-2 rounded-lg hover:bg-sky-500 transition shadow-md hover:shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  {t[language].postAd}
                </button>
              )}

              <div className="profile-dropdown-container relative">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-sky-400 transition rounded-lg hover:bg-gray-50"
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
                          className="w-full px-4 py-2 text-left hover:bg-sky-50 transition flex items-center gap-2"
                        >
                          <User className="w-4 h-4" />
                          {t[language].profile}
                        </button>
                        <button
                          onClick={() => {
                            handleLogout();
                            setShowProfileDropdown(false);
                          }}
                          className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition flex items-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          {t[language].logout}
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setIsLoginMode(true);
                            setShowLoginModal(true);
                            setShowProfileDropdown(false);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-sky-50 transition flex items-center gap-2"
                        >
                          <User className="w-4 h-4" />
                          {t[language].login}
                        </button>
                        <button
                          onClick={() => {
                            setIsLoginMode(false);
                            setShowRegisterModal(true);
                            setShowProfileDropdown(false);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-sky-50 transition flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          {t[language].register}
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {currentView === 'home' && !showListings && (
          <div className="relative">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-sky-400 to-blue-500 text-white py-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="text-7xl md:text-8xl font-bold mb-8 animate-fade-in tracking-tight">
                  sakanera
                </h1>
                <h2 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
                  {t[language].heroTitle}
                </h2>
                <p className="text-2xl md:text-3xl mb-4 opacity-90">
                  {t[language].heroSubtitle}
                </p>
                <p className="text-xl mb-12 opacity-80">
                  {t[language].heroDescription}
                </p>
                <button
                  onClick={() => setCurrentView('cities')}
                  className="bg-white text-sky-400 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition transform hover:scale-105 shadow-xl"
                >
                  {t[language].exploreCities}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CITIES VIEW */}
        {currentView === 'cities' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            
            <h2 className="text-4xl font-bold mb-12 text-center">{t[language].citiesPageTitle}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {['Berlin', 'München', 'Hamburg', 'Köln', 'Frankfurt', 'Stuttgart', 'Düsseldorf', 'Aachen'].map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    setFilters({ ...filters, city });
                    setCurrentView('search');
                  }}
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition transform hover:scale-105 text-center"
                >
                  <div className="text-4xl mb-3">🏙️</div>
                  <h3 className="font-semibold text-lg">{city}</h3>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentView === 'search' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">{t[language].allListings}</h2>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition"
              >
                <Filter className="w-5 h-5" />
                {t[language].filter}
              </button>
            </div>

            {showFilters && (
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">{t[language].city}</label>
                    <select
                      value={filters.city}
                      onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      <option value="all">{t[language].allCities}</option>
                      <option value="Aachen">Aachen</option>
                      <option value="Berlin">Berlin</option>
                      <option value="München">München</option>
                      <option value="Hamburg">Hamburg</option>
                      <option value="Köln">Köln</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t[language].listingType}</label>
                    <select
                      value={filters.type}
                      onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      <option value="all">{t[language].all}</option>
                      <option value="room">{t[language].room}</option>
                      <option value="roommate">{t[language].roommate}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t[language].maxRent}</label>
                    <select
                      value={filters.maxRent}
                      onChange={(e) => setFilters({ ...filters, maxRent: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      <option value="all">{t[language].all}</option>
                      <option value="400">400€</option>
                      <option value="500">500€</option>
                      <option value="600">600€</option>
                      <option value="800">800€</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t[language].gender}</label>
                    <select
                      value={filters.gender}
                      onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      <option value="all">{t[language].all}</option>
                      <option value="male">{t[language].male}</option>
                      <option value="female">{t[language].female}</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={() => setFilters({ city: 'all', type: 'all', maxRent: 'all', gender: 'all' })}
                  className="mt-4 text-sky-400 hover:text-sky-500 font-medium"
                >
                  {t[language].reset}
                </button>
              </div>
            )}
            
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
                        <div className="flex-1">
                          <span className="inline-block px-3 py-1 bg-sky-100 text-sky-600 rounded-full text-xs font-medium mb-2">
                            {listing.type === 'room' ? t[language].room : t[language].roommate}
                          </span>
                          <h3 className="text-xl font-semibold">{listing.title}</h3>
                        </div>
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
                          <MapPin className="w-4 h-4 text-sky-400" />
                          <span>{listing.city}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-sky-400" />
                          <span className="font-semibold text-lg text-sky-400">
                            {listing.rent}€ {t[language].perMonth}
                          </span>
                        </div>
                        {listing.square_meters && (
                          <div className="flex items-center gap-2">
                            <Home className="w-4 h-4 text-sky-400" />
                            <span>{listing.square_meters} {t[language].squareMeters}</span>
                          </div>
                        )}
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
        )}

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
                    <p className="text-gray-600 mb-4 line-clamp-2">{listing.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sky-400 font-semibold">{listing.rent}€ {t[language].perMonth}</span>
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
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {userProfile ? (
              <>
                {/* Header mit Name und Avatar */}
                <div className="bg-gradient-to-r from-sky-400 to-blue-500 rounded-lg shadow-lg p-8 mb-8 text-white">
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-4xl font-bold">
                      {userProfile.first_name?.[0]}{userProfile.last_name?.[0]}
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold mb-2">
                        {userProfile.first_name} {userProfile.last_name}
                      </h1>
                      <p className="text-white/90 text-lg">{userProfile.email}</p>
                    </div>
                  </div>
                </div>

                {/* Account Settings */}
                <div className="bg-white rounded-lg shadow-md p-8 mb-6">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <User className="w-6 h-6 text-sky-400" />
                    {t[language].accountSettings}
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="border-l-4 border-sky-400 pl-4">
                      <label className="block text-sm font-medium text-gray-500 mb-1">{t[language].firstName}</label>
                      <p className="text-lg font-semibold">{userProfile.first_name}</p>
                    </div>
                    <div className="border-l-4 border-sky-400 pl-4">
                      <label className="block text-sm font-medium text-gray-500 mb-1">{t[language].lastName}</label>
                      <p className="text-lg font-semibold">{userProfile.last_name}</p>
                    </div>
                    <div className="border-l-4 border-sky-400 pl-4">
                      <label className="block text-sm font-medium text-gray-500 mb-1">{t[language].email}</label>
                      <p className="text-lg font-semibold">{userProfile.email}</p>
                    </div>
                    {userProfile.phone && (
                      <div className="border-l-4 border-sky-400 pl-4">
                        <label className="block text-sm font-medium text-gray-500 mb-1">{t[language].phone}</label>
                        <p className="text-lg font-semibold">{userProfile.phone}</p>
                      </div>
                    )}
                    {userProfile.age && (
                      <div className="border-l-4 border-sky-400 pl-4">
                        <label className="block text-sm font-medium text-gray-500 mb-1">{t[language].age}</label>
                        <p className="text-lg font-semibold">{userProfile.age} {t[language].years}</p>
                      </div>
                    )}
                    {userProfile.occupation && (
                      <div className="border-l-4 border-sky-400 pl-4">
                        <label className="block text-sm font-medium text-gray-500 mb-1">{t[language].occupation}</label>
                        <p className="text-lg font-semibold">{userProfile.occupation}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Meine Inserate Section */}
                <div className="bg-white rounded-lg shadow-md p-8">
                  <h2 className="text-2xl font-bold mb-6">{t[language].myListings}</h2>
                  <p className="text-gray-600 mb-4">{t[language].noMyListings}</p>
                  <button
                    onClick={() => setShowAddListing(true)}
                    className="bg-sky-400 text-white px-6 py-3 rounded-lg hover:bg-sky-500 transition flex items-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <Plus className="w-5 h-5" />
                    {t[language].createListing}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <User className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h2 className="text-2xl font-bold mb-4">{t[language].yourProfile}</h2>
                <p className="text-gray-600 mb-6">{t[language].pleaseLogin}</p>
                <button
                  onClick={() => {
                    setIsLoginMode(true);
                    setShowLoginModal(true);
                  }}
                  className="bg-sky-400 text-white px-6 py-3 rounded-lg hover:bg-sky-500 transition shadow-md hover:shadow-lg"
                >
                  {t[language].login}
                </button>
              </div>
            )}
          </div>
        )}

        {/* CONTACT VIEW */}
        {currentView === 'contact' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">{t[language].contactPageTitle}</h2>
              <p className="text-xl text-gray-600">{t[language].contactPageSubtitle}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Contact Form */}
              <div className="bg-white rounded-lg shadow-md p-8">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Mail className="w-6 h-6 text-sky-400" />
                  {t[language].writeUs}
                </h3>
                
                {contactSuccess && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                    ✅ {t[language].messageSent}
                  </div>
                )}

                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">{t[language].yourName}</label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-transparent"
                      placeholder="Max Mustermann"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t[language].yourEmail}</label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-transparent"
                      placeholder="email@beispiel.de"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t[language].yourMessage}</label>
                    <textarea
                      required
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-transparent"
                      rows="5"
                      placeholder={t[language].messagePlaceholder}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-sky-400 text-white py-3 rounded-lg hover:bg-sky-500 transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <Send className="w-5 h-5" />
                    {t[language].send}
                  </button>
                </form>
              </div>

              {/* Contact Info - ADRESSE NUR HIER! */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-sky-400 to-blue-500 text-white rounded-lg shadow-md p-8">
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <MapPin className="w-6 h-6" />
                    {t[language].ourAddress}
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Home className="w-6 h-6 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-lg mb-1">sakanera</p>
                        <p className="text-white/90">{t[language].address}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-6 h-6 flex-shrink-0" />
                      <a href="mailto:info@sakanera.com" className="text-white/90 hover:text-white transition">
                        info@sakanera.com
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-6 h-6 flex-shrink-0" />
                      <a href="tel:+4924112345678" className="text-white/90 hover:text-white transition">
                        +49 241 123 456 78
                      </a>
                    </div>
                  </div>
                </div>

                {/* Map Placeholder */}
                <div className="bg-gray-200 rounded-lg shadow-md h-64 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <MapPin className="w-12 h-12 mx-auto mb-2" />
                    <p>An der Haupttribüne 1</p>
                    <p>52070 Aachen</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ABOUT VIEW */}
        {currentView === 'about' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            
            <h2 className="text-4xl font-bold mb-8 text-center">{t[language].aboutUs}</h2>
            <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
              <p className="text-lg text-gray-700">
                {language === 'de' 
                  ? 'Willkommen bei sakanera - Deiner Plattform für Mitbewohner-Suche! Wir helfen Dir, die perfekte WG zu finden und dabei Geld zu sparen.'
                  : 'Welcome to sakanera - Your platform for finding roommates! We help you find the perfect shared apartment and save money.'}
              </p>
              <p className="text-gray-600">
                {language === 'de'
                  ? 'Unser Ziel ist es, das Zusammenleben einfacher und bezahlbarer zu machen.'
                  : 'Our goal is to make shared living easier and more affordable.'}
              </p>
            </div>
          </div>
        )}

        {/* FEEDBACK VIEW */}
        {currentView === 'feedback' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 className="text-4xl font-bold mb-8 text-center">{t[language].feedback}</h2>
            <div className="bg-white rounded-lg shadow-md p-8">
              <p className="text-lg text-gray-700 mb-6">
                {language === 'de'
                  ? 'Wir freuen uns über dein Feedback! Teile uns deine Meinung, Vorschläge oder Probleme mit.'
                  : 'We appreciate your feedback! Share your opinion, suggestions or issues with us.'}
              </p>
              
              {contactSuccess && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                  ✅ {t[language].messageSent}
                </div>
              )}

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{t[language].yourName}</label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-transparent"
                    placeholder="Max Mustermann"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t[language].yourEmail}</label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-transparent"
                    placeholder="email@beispiel.de"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t[language].yourMessage}</label>
                  <textarea
                    required
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-transparent"
                    rows="6"
                    placeholder={t[language].messagePlaceholder}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-sky-400 text-white py-3 rounded-lg hover:bg-sky-500 transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  <Send className="w-5 h-5" />
                  {t[language].send}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* IMPRINT VIEW */}
        {currentView === 'imprint' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 className="text-4xl font-bold mb-8 text-center">{t[language].imprint}</h2>
            <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
              <h3 className="text-2xl font-semibold text-sky-600">
                {language === 'de' ? 'Angaben gemäß § 5 TMG' : 'Information according to § 5 TMG'}
              </h3>
              
              <div className="text-gray-700 space-y-4">
                <div className="border-l-4 border-sky-400 pl-4">
                  <p className="text-xl font-bold text-gray-900">sakanera GmbH</p>
                  <p className="text-gray-700">An der Haupttribüne 1</p>
                  <p className="text-gray-700">52070 Aachen</p>
                  <p className="text-gray-700">Deutschland</p>
                </div>

                <div className="border-l-4 border-sky-400 pl-4">
                  <p className="font-semibold text-gray-900 mb-2">
                    {language === 'de' ? 'Vertreten durch:' : 'Represented by:'}
                  </p>
                  <p className="text-gray-700">Ahed Ahmad (Geschäftsführer)</p>
                </div>

                <div className="border-l-4 border-sky-400 pl-4">
                  <p className="font-semibold text-gray-900 mb-2">Kontakt:</p>
                  <p className="text-gray-700">
                    <strong>E-Mail:</strong> <a href="mailto:info@sakanera.com" className="text-sky-500 hover:text-sky-600">info@sakanera.com</a>
                  </p>
                  <p className="text-gray-700">
                    <strong>Telefon:</strong> <a href="tel:+4924112345678" className="text-sky-500 hover:text-sky-600">+49 241 123 456 78</a>
                  </p>
                </div>

                <div className="border-l-4 border-sky-400 pl-4">
                  <p className="font-semibold text-gray-900 mb-2">Registereintrag:</p>
                  <p className="text-gray-700"><strong>Handelsregister:</strong> HRB 12345</p>
                  <p className="text-gray-700"><strong>Amtsgericht:</strong> Aachen</p>
                </div>

                <div className="border-l-4 border-sky-400 pl-4">
                  <p className="font-semibold text-gray-900 mb-2">USt-IdNr.:</p>
                  <p className="text-gray-700">DE123456789</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PRIVACY VIEW */}
        {currentView === 'privacy' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            
            <h2 className="text-4xl font-bold mb-8 text-center">{t[language].privacy}</h2>
            <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
              <h3 className="text-xl font-semibold">
                {language === 'de' ? 'Datenschutzerklärung' : 'Privacy Policy'}
              </h3>
              <p className="text-gray-700">
                {language === 'de'
                  ? 'Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Diese Datenschutzerklärung informiert Sie über die Verarbeitung Ihrer Daten auf unserer Website.'
                  : 'We take the protection of your personal data very seriously. This privacy policy informs you about the processing of your data on our website.'}
              </p>
              <p className="text-gray-600">
                {language === 'de'
                  ? 'Detaillierte Informationen werden in Kürze ergänzt.'
                  : 'Detailed information will be added soon.'}
              </p>
            </div>
          </div>
        )}

        {/* TERMS VIEW */}
        {currentView === 'terms' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            
            <h2 className="text-4xl font-bold mb-8 text-center">{t[language].terms}</h2>
            <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
              <h3 className="text-xl font-semibold">
                {language === 'de' ? 'Allgemeine Geschäftsbedingungen' : 'Terms and Conditions'}
              </h3>
              <p className="text-gray-700">
                {language === 'de'
                  ? 'Willkommen bei sakanera. Durch die Nutzung unserer Plattform akzeptieren Sie diese Nutzungsbedingungen.'
                  : 'Welcome to sakanera. By using our platform, you accept these terms of use.'}
              </p>
              <p className="text-gray-600">
                {language === 'de'
                  ? 'Die vollständigen AGB werden in Kürze veröffentlicht.'
                  : 'The complete terms and conditions will be published soon.'}
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <Home className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold">{t[language].logo}</h3>
              </div>
              <p className="text-gray-400 text-sm">{t[language].heroDescription}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t[language].company}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <button 
                    onClick={() => setCurrentView('about')}
                    className="hover:text-white transition"
                  >
                    {t[language].aboutUs}
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t[language].legal}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <button 
                    onClick={() => setCurrentView('imprint')}
                    className="hover:text-white transition"
                  >
                    {t[language].imprint}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setCurrentView('privacy')}
                    className="hover:text-white transition"
                  >
                    {t[language].privacy}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setCurrentView('terms')}
                    className="hover:text-white transition"
                  >
                    {t[language].terms}
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t[language].support}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <button 
                    onClick={() => setCurrentView('feedback')}
                    className="hover:text-white transition"
                  >
                    {t[language].feedback}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setCurrentView('contact')}
                    className="hover:text-white transition"
                  >
                    {t[language].contactFooter}
                  </button>
                </li>
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
        <div className="grid grid-cols-5 gap-0">
          <button
            onClick={() => {
              setCurrentView('home');
              setShowListings(false);
            }}
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
            onClick={() => setCurrentView('contact')}
            className={`flex flex-col items-center py-3 ${
              currentView === 'contact' ? 'text-sky-400' : 'text-gray-600'
            }`}
          >
            <MessageCircle className="w-6 h-6" />
            <span className="text-xs mt-1">{t[language].contactUs}</span>
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
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t[language].email}</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                    placeholder="email@beispiel.de"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t[language].password}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-sky-400 text-white py-3 rounded-lg hover:bg-sky-500 transition"
              >
                {t[language].login}
              </button>
            </form>
            <p className="text-center mt-4 text-sm text-gray-600">
              {t[language].noAccountYet}{' '}
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  setShowRegisterModal(true);
                }}
                className="text-sky-400 hover:text-sky-500 font-medium"
              >
                {t[language].clickHere}
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 my-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{t[language].register}</h2>
              <button onClick={() => setShowRegisterModal(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">{t[language].firstName} *</label>
                  <input
                    type="text"
                    required
                    value={registerForm.firstName}
                    onChange={(e) => setRegisterForm({ ...registerForm, firstName: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t[language].lastName} *</label>
                  <input
                    type="text"
                    required
                    value={registerForm.lastName}
                    onChange={(e) => setRegisterForm({ ...registerForm, lastName: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t[language].email} *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">{t[language].password} *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      required
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t[language].confirmPassword} *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      required
                      value={registerForm.confirmPassword}
                      onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">{t[language].phone}</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={registerForm.phone}
                      onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t[language].age}</label>
                  <input
                    type="number"
                    value={registerForm.age}
                    onChange={(e) => setRegisterForm({ ...registerForm, age: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t[language].occupation}</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={registerForm.occupation}
                    onChange={(e) => setRegisterForm({ ...registerForm, occupation: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                    placeholder="z.B. Student, Berufstätig..."
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-sky-400 text-white py-3 rounded-lg hover:bg-sky-500 transition"
              >
                {t[language].register}
              </button>
            </form>
            <p className="text-center mt-4 text-sm text-gray-600">
              {t[language].alreadyHaveAccount}{' '}
              <button
                onClick={() => {
                  setShowRegisterModal(false);
                  setShowLoginModal(true);
                }}
                className="text-sky-400 hover:text-sky-500 font-medium"
              >
                {t[language].clickHere}
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Create Listing Modal */}
      {showAddListing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-3xl w-full p-6 my-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{t[language].createListing}</h2>
              <button onClick={() => setShowAddListing(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmitListing} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t[language].listingType} *</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setListingForm({ ...listingForm, type: 'room' })}
                    className={`p-4 border-2 rounded-lg transition ${
                      listingForm.type === 'room'
                        ? 'border-sky-400 bg-sky-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <h3 className="font-semibold">{t[language].offerRoom}</h3>
                  </button>
                  <button
                    type="button"
                    onClick={() => setListingForm({ ...listingForm, type: 'roommate' })}
                    className={`p-4 border-2 rounded-lg transition ${
                      listingForm.type === 'roommate'
                        ? 'border-sky-400 bg-sky-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <h3 className="font-semibold">{t[language].searchRoommate}</h3>
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">{t[language].title} *</label>
                <input
                  type="text"
                  required
                  value={listingForm.title}
                  onChange={(e) => setListingForm({ ...listingForm, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder={t[language].titlePlaceholder}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">{t[language].description} *</label>
                <textarea
                  required
                  value={listingForm.description}
                  onChange={(e) => setListingForm({ ...listingForm, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows="4"
                  placeholder={t[language].descriptionPlaceholder}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">{t[language].city} *</label>
                  <select
                    required
                    value={listingForm.city}
                    onChange={(e) => setListingForm({ ...listingForm, city: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="Aachen">Aachen</option>
                    <option value="Berlin">Berlin</option>
                    <option value="München">München</option>
                    <option value="Hamburg">Hamburg</option>
                    <option value="Köln">Köln</option>
                    <option value="Frankfurt">Frankfurt</option>
                    <option value="Stuttgart">Stuttgart</option>
                    <option value="Düsseldorf">Düsseldorf</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t[language].rent} *</label>
                  <input
                    type="number"
                    required
                    value={listingForm.rent}
                    onChange={(e) => setListingForm({ ...listingForm, rent: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="450"
                  />
                </div>
              </div>

              {listingForm.type === 'room' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">{t[language].size} (m²)</label>
                    <input
                      type="number"
                      value={listingForm.squareMeters}
                      onChange={(e) => setListingForm({ ...listingForm, squareMeters: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder="20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t[language].roomCount}</label>
                    <input
                      type="number"
                      value={listingForm.roomCount}
                      onChange={(e) => setListingForm({ ...listingForm, roomCount: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder="3"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">{t[language].smoking} *</label>
                  <select
                    value={listingForm.smoking}
                    onChange={(e) => setListingForm({ ...listingForm, smoking: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="no">🚭 {t[language].nonSmoker}</option>
                    <option value="outside">🚬 {t[language].balcony}</option>
                    <option value="yes">✅ {t[language].smoker}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t[language].cleanliness} *</label>
                  <select
                    value={listingForm.cleanliness}
                    onChange={(e) => setListingForm({ ...listingForm, cleanliness: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="very-clean">✨ {t[language].veryClean}</option>
                    <option value="normal">👍 {t[language].normal}</option>
                    <option value="relaxed">😌 {t[language].relaxed}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">{t[language].amenities}</label>
                <input
                  type="text"
                  value={listingForm.amenities}
                  onChange={(e) => setListingForm({ ...listingForm, amenities: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder={t[language].amenitiesPlaceholder}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="submit"
                  className="flex-1 bg-sky-400 text-white py-3 rounded-lg hover:bg-sky-500 transition"
                >
                  {t[language].post}
                </button>
                <button 
                  type="button"
                  onClick={() => setShowAddListing(false)} 
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition"
                >
                  {t[language].cancel}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contact Modal */}
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
                <label className="block text-sm font-medium text-gray-600 mb-1">{t[language].name}</label>
                <p className="text-lg">{selectedContact.contact_name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">{t[language].email}</label>
                <a href={`mailto:${selectedContact.contact_email}`} className="text-lg text-sky-600 hover:text-sky-700">
                  {selectedContact.contact_email}
                </a>
              </div>
              {selectedContact.contact_phone && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">{t[language].phone}</label>
                  <a href={`tel:${selectedContact.contact_phone}`} className="text-lg text-sky-600 hover:text-sky-700">
                    {selectedContact.contact_phone}
                  </a>
                </div>
              )}
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

      {/* Delete Confirmation Modal */}
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