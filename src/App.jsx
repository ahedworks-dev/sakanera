import React, { useState, useEffect } from 'react';
import { Home, Users, Search, Plus, MapPin, DollarSign, Calendar, User, Heart, X, MessageCircle, Filter } from 'lucide-react';

export default function RoomatePlatform() {
  const [currentView, setCurrentView] = useState('home');
  const [listings, setListings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [language, setLanguage] = useState('de');
  
  const t = {
    de: {
      // Header
      logo: 'sakanera',
      postAd: 'Inserieren',
      
      // Hero
      heroTitle: 'Zahle die Hälfte der Miete',
      heroSubtitle: 'Spare Geld & finde coole Mitbewohner',
      heroDescription: 'Teile deine Wohnung, teile dein Leben',
      
      // Filter
      filter: 'Filter',
      allCities: 'Alle Städte',
      maxRent: 'Max. Miete',
      all: 'Alle',
      male: 'Männlich',
      female: 'Weiblich',
      allListings: 'Alle Inserate',
      offerRoom: 'Zimmer anbieten',
      searchRoommate: 'Mitbewohner suchen',
      reset: 'Zurücksetzen',
      
      // Listing
      perMonth: '/ Monat',
      from: 'ab',
      years: 'Jahre',
      contact: 'Kontakt aufnehmen',
      deleteListing: 'Inserat löschen',
      room: 'Zimmer',
      roommate: 'Mitbewohner',
      
      // Smoking
      nonSmoker: 'Nichtraucher',
      balcony: 'Balkon',
      smoker: 'Raucher',
      
      // Cleanliness
      veryClean: 'Sehr ordentlich',
      normal: 'Normal',
      relaxed: 'Entspannt',
      
      // Navigation
      home: 'Home',
      search: 'Suchen',
      favorites: 'Favoriten',
      profile: 'Profil',
      
      // Favorites
      myFavorites: 'Meine Favoriten',
      noFavorites: 'Noch keine Favoriten vorhanden',
      
      // Profile
      yourProfile: 'Dein Profil',
      createProfile: 'Profil erstellen',
      manageInfo: 'Verwalte deine Informationen',
      createProfileDesc: 'Erstelle dein Profil um Inserate zu erstellen',
      profileImage: 'Profilbild',
      uploadImage: 'Profilbild hochladen',
      imageUploaded: 'Bild hochgeladen',
      name: 'Name',
      email: 'E-Mail',
      phone: 'Telefon',
      age: 'Alter',
      occupation: 'Beruf/Status',
      saveProfile: 'Profil speichern',
      updateProfile: 'Profil aktualisieren',
      createProfileInfo: 'Erstelle dein Profil um Inserate zu veröffentlichen',
      logout: 'Abmelden',
      login: 'Anmelden',
      loggedInAs: 'Angemeldet als',
      notLoggedIn: 'Nicht angemeldet',
      pleaseLogin: 'Bitte melde dich an um diese Funktion zu nutzen',
      loggedOut: 'Erfolgreich abgemeldet',
      myListings: 'Meine Inserate',
      noMyListings: 'Du hast noch keine Inserate erstellt',
      
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
      
      // Payment
      choosePayment: 'Zahlungsmethode wählen',
      paypal: 'PayPal',
      paypalDesc: 'Schnell und sicher mit PayPal bezahlen',
      creditCard: 'Kreditkarte',
      creditCardDesc: 'Visa, Mastercard, American Express',
      sepa: 'SEPA-Lastschrift',
      sepaDesc: 'Bequem per Bankeinzug bezahlen',
      sofort: 'Sofortüberweisung',
      sofortDesc: 'Direkt mit deinem Online-Banking',
      giropay: 'Giropay',
      giropayDesc: 'Sichere Zahlung über deutsche Banken',
      secure: '100% Sicher:',
      secureDesc: 'Alle Zahlungen sind SSL-verschlüsselt und DSGVO-konform',
      testMode: 'Testmodus aktiv - Keine echten Zahlungen',
      back: 'Zurück',
      payNow: 'Jetzt bezahlen',
      choosePaymentMethod: 'Zahlungsmethode wählen',
      
      // Add Listing
      createListing: 'Neues Inserat erstellen',
      listingType: 'Art des Inserats',
      offerRoomDesc: 'Ich biete ein Zimmer an',
      searchRoommateDesc: 'Ich suche einen Mitbewohner',
      offerRoomHelp: 'Du hast ein Zimmer/Wohnung und suchst jemanden zum Einziehen',
      searchRoommateHelp: 'Du suchst eine WG oder jemanden zum Zusammenziehen',
      uploadListingImage: 'Bild hochladen',
      uploadImageHelp: 'Bild hochladen (JPG, PNG)',
      title: 'Titel',
      titlePlaceholder: 'z.B. Gemütliches WG-Zimmer',
      city: 'Stadt',
      chooseCity: 'Stadt wählen',
      otherCity: 'Andere Stadt...',
      enterCity: 'Stadt eingeben',
      cityAutoAdd: 'Diese Stadt wird automatisch zur Liste hinzugefügt',
      rentPerMonth: 'Miete (€/Monat)',
      moveInDate: 'Einzugsdatum',
      gender: 'Geschlecht',
      anyGender: 'Egal',
      smoking: 'Rauchen',
      cleanliness: 'Sauberkeit',
      description: 'Beschreibung',
      amenities: 'Ausstattung (durch Komma getrennt)',
      amenitiesPlaceholder: 'z.B. WLAN, Küche, Balkon',
      contactData: 'Kontaktdaten (aus deinem Profil)',
      contactFromProfile: 'Diese Daten stammen aus deinem Profil und können dort bearbeitet werden',
      post: 'Inserieren',
      cancel: 'Abbrechen',
      
      // Delete Confirmation
      roommateFound: 'Mitbewohner gefunden?',
      confirmDelete: 'Bestätige, dass ein Suchender dich kontaktiert hat und ihr euch geeinigt habt.',
      deleteInfo: 'Das Inserat wird nach Bestätigung permanent gelöscht',
      yesConfirm: 'Ja, bestätigen',
      markAsCompleted: 'Als erledigt markieren',
      listingCompleted: 'Inserat erfolgreich als erledigt markiert!',
      
      // Contact Modal
      contactDetails: 'Kontaktdaten',
      close: 'Schließen',
      
      // Alerts
      createProfileFirst: 'Bitte erstelle zuerst dein Profil, bevor du inserieren kannst!',
      fillAllFields: 'Bitte fülle alle Pflichtfelder aus',
      enterCityName: 'Bitte gib einen Stadtnamen ein',
      profileSaved: 'Profil erfolgreich gespeichert! Du kannst jetzt Inserate erstellen.',
      listingDeleted: 'Glückwunsch! Das Inserat wurde erfolgreich gelöscht.',
      paymentSuccess: 'Zahlung erfolgreich! Du kannst jetzt dein Inserat erstellen.',
      choosePaymentFirst: 'Bitte wähle eine Zahlungsmethode aus',
      chooseAboFirst: 'Bitte wähle ein Abo-Paket aus'
    },
    en: {
      // Header
      logo: 'sakanera',
      postAd: 'Post Ad',
      
      // Hero
      heroTitle: 'Pay Half the Rent',
      heroSubtitle: 'Save Money & Find Cool Roommates',
      heroDescription: 'Share Your Place, Share Your Life',
      
      // Filter
      filter: 'Filter',
      allCities: 'All Cities',
      maxRent: 'Max. Rent',
      all: 'All',
      male: 'Male',
      female: 'Female',
      allListings: 'All Listings',
      offerRoom: 'Offer Room',
      searchRoommate: 'Search Roommate',
      reset: 'Reset',
      
      // Listing
      perMonth: '/ Month',
      from: 'from',
      years: 'years',
      contact: 'Contact',
      deleteListing: 'Delete Listing',
      room: 'Room',
      roommate: 'Roommate',
      
      // Smoking
      nonSmoker: 'Non-Smoker',
      balcony: 'Balcony',
      smoker: 'Smoker',
      
      // Cleanliness
      veryClean: 'Very Clean',
      normal: 'Normal',
      relaxed: 'Relaxed',
      
      // Navigation
      home: 'Home',
      search: 'Search',
      favorites: 'Favorites',
      profile: 'Profile',
      
      // Favorites
      myFavorites: 'My Favorites',
      noFavorites: 'No favorites yet',
      
      // Profile
      yourProfile: 'Your Profile',
      createProfile: 'Create Profile',
      manageInfo: 'Manage your information',
      createProfileDesc: 'Create your profile to post listings',
      profileImage: 'Profile Picture',
      uploadImage: 'Upload Profile Picture',
      imageUploaded: 'Image uploaded',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      age: 'Age',
      occupation: 'Occupation/Status',
      saveProfile: 'Save Profile',
      updateProfile: 'Update Profile',
      createProfileInfo: 'Create your profile to post listings',
      logout: 'Logout',
      login: 'Login',
      loggedInAs: 'Logged in as',
      notLoggedIn: 'Not logged in',
      pleaseLogin: 'Please login to use this feature',
      loggedOut: 'Successfully logged out',
      myListings: 'My Listings',
      noMyListings: 'You have not created any listings yet',
      
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
      unlimitedContact: 'Unlimited Contact Requests',
      fullVisibility: 'Full Visibility',
      cheaper: 'cheaper',
      bestValue: 'Best Value',
      tip: 'Tip:',
      longerCheaper: 'The longer the runtime, the cheaper the price per month!',
      continueToPayment: 'Continue to Payment',
      chooseAbo: 'Choose Plan',
      
      // Payment
      choosePayment: 'Choose Payment Method',
      paypal: 'PayPal',
      paypalDesc: 'Fast and secure payment with PayPal',
      creditCard: 'Credit Card',
      creditCardDesc: 'Visa, Mastercard, American Express',
      sepa: 'SEPA Direct Debit',
      sepaDesc: 'Convenient payment via bank transfer',
      sofort: 'Instant Transfer',
      sofortDesc: 'Directly with your online banking',
      giropay: 'Giropay',
      giropayDesc: 'Secure payment via German banks',
      secure: '100% Secure:',
      secureDesc: 'All payments are SSL-encrypted and GDPR-compliant',
      testMode: 'Test Mode Active - No Real Payments',
      back: 'Back',
      payNow: 'Pay Now',
      choosePaymentMethod: 'Choose Payment Method',
      
      // Add Listing
      createListing: 'Create New Listing',
      listingType: 'Listing Type',
      offerRoomDesc: 'I offer a room',
      searchRoommateDesc: 'I search for a roommate',
      offerRoomHelp: 'You have a room/apartment and are looking for someone to move in',
      searchRoommateHelp: 'You are looking for a shared apartment or someone to move in together',
      uploadListingImage: 'Upload Image',
      uploadImageHelp: 'Upload image (JPG, PNG)',
      title: 'Title',
      titlePlaceholder: 'e.g. Cozy shared room',
      city: 'City',
      chooseCity: 'Choose city',
      otherCity: 'Other city...',
      enterCity: 'Enter city',
      cityAutoAdd: 'This city will be automatically added to the list',
      rentPerMonth: 'Rent (€/Month)',
      moveInDate: 'Move-in Date',
      gender: 'Gender',
      anyGender: 'Any',
      smoking: 'Smoking',
      cleanliness: 'Cleanliness',
      description: 'Description',
      amenities: 'Amenities (comma separated)',
      amenitiesPlaceholder: 'e.g. WiFi, Kitchen, Balcony',
      contactData: 'Contact Data (from your profile)',
      contactFromProfile: 'This data is from your profile and can be edited there',
      post: 'Post',
      cancel: 'Cancel',
      
      // Delete Confirmation
      roommateFound: 'Roommate Found?',
      confirmDelete: 'Confirm that a seeker has contacted you and you have agreed.',
      deleteInfo: 'The listing will be permanently deleted after confirmation',
      yesConfirm: 'Yes, confirm',
      markAsCompleted: 'Mark as Completed',
      listingCompleted: 'Listing successfully marked as completed!',
      
      // Contact Modal
      contactDetails: 'Contact Details',
      close: 'Close',
      
      // Alerts
      createProfileFirst: 'Please create your profile first before posting!',
      fillAllFields: 'Please fill in all required fields',
      enterCityName: 'Please enter a city name',
      profileSaved: 'Profile successfully saved! You can now create listings.',
      listingDeleted: 'Congratulations! The listing was successfully deleted.',
      paymentSuccess: 'Payment successful! You can now create your listing.',
      choosePaymentFirst: 'Please choose a payment method',
      chooseAboFirst: 'Please choose a subscription package'
    }
  };

  const [showAddListing, setShowAddListing] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteListingId, setDeleteListingId] = useState(null);
  const [availableCities, setAvailableCities] = useState(['Berlin', 'München', 'Hamburg', 'Köln', 'Frankfurt']);
  const [showCustomCity, setShowCustomCity] = useState(false);
  const [customCity, setCustomCity] = useState('');

  const [filters, setFilters] = useState({
    city: '',
    maxRent: '',
    gender: 'all',
    type: 'all'
  });

  const [formData, setFormData] = useState({
    type: 'room',
    image: null,
    title: '',
    city: '',
    rent: '',
    moveInDate: '',
    gender: 'all',
    age: '',
    occupation: '',
    description: '',
    amenities: '',
    smoking: 'no',
    cleanliness: 'normal',
    contactName: '',
    contactEmail: '',
    contactPhone: ''
  });

  const [profileData, setProfileData] = useState({
    image: null,
    name: '',
    email: '',
    phone: '',
    age: '',
    occupation: ''
  });

  useEffect(() => {
    const sampleListings = [
      {
        id: 1,
        type: 'room',
        image: '🏠',
        title: 'Gemütliches Zimmer in Berlin Mitte',
        city: 'Berlin',
        rent: 450,
        moveInDate: '2025-11-01',
        gender: 'all',
        age: 28,
        occupation: 'Software Engineer',
        description: 'Helles 15qm Zimmer in netter 3er-WG',
        amenities: ['WLAN', 'Küche', 'Balkon'],
        smoking: 'no',
        cleanliness: 'very-clean',
        contactName: 'Max Mustermann',
        contactEmail: 'max@example.com',
        contactPhone: '+49 123 456789'
      },
      {
        id: 2,
        type: 'roommate',
        image: '👤',
        title: 'Suche Mitbewohner für 2-Zimmer Wohnung',
        city: 'München',
        rent: 600,
        moveInDate: '2025-12-01',
        gender: 'female',
        age: 25,
        occupation: 'Studentin',
        description: 'Suche entspannte Mitbewohnerin',
        amenities: ['WLAN', 'Waschmaschine'],
        smoking: 'outside',
        cleanliness: 'normal',
        contactName: 'Anna Schmidt',
        contactEmail: 'anna@example.com',
        contactPhone: '+49 987 654321'
      }
    ];
    setListings(sampleListings);
  }, []);

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'listing') {
          setFormData({...formData, image: reader.result});
        } else {
          setProfileData({...profileData, image: reader.result});
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePostAdClick = () => {
    if (!userProfile) {
      alert(t[language].createProfileFirst);
      setCurrentView('profile');
    } else {
      setShowSubscription(true);
    }
  };

  const handleSubscriptionSelect = (plan) => {
    setSelectedSubscription(plan);
    setShowSubscription(false);
    setShowPayment(true);
  };

  const handlePaymentSubmit = () => {
    if (!selectedPayment) {
      alert(t[language].choosePaymentFirst);
      return;
    }
    if (!selectedSubscription) {
      alert(t[language].chooseAboFirst);
      return;
    }
    
    alert(t[language].paymentSuccess);
    setShowPayment(false);
    setSelectedPayment(null);
    setShowAddListing(true);
  };

  const handleSubmitListing = () => {
    // Validierung: Nur die Felder prüfen die der User ausfüllen muss
    // contactName, contactEmail, contactPhone kommen automatisch vom Profil
    if (!formData.title || !formData.city || !formData.rent || !formData.moveInDate || 
        !formData.age || !formData.occupation || !formData.description) {
      alert(t[language].fillAllFields);
      return;
    }

    if (showCustomCity && !customCity.trim()) {
      alert(t[language].enterCityName);
      return;
    }

    const cityToUse = showCustomCity ? customCity : formData.city;
    
    if (showCustomCity && !availableCities.includes(customCity)) {
      setAvailableCities([...availableCities, customCity]);
    }

    const newListing = {
      ...formData,
      city: cityToUse,
      id: Date.now(),
      amenities: formData.amenities.split(',').map(a => a.trim()).filter(a => a),
      contactName: userProfile.name,
      contactEmail: userProfile.email,
      contactPhone: userProfile.phone
    };

    setListings([...listings, newListing]);
    setShowAddListing(false);
    setShowCustomCity(false);
    setCustomCity('');
    setFormData({
      type: 'room',
      image: null,
      title: '',
      city: '',
      rent: '',
      moveInDate: '',
      gender: 'all',
      age: '',
      occupation: '',
      description: '',
      amenities: '',
      smoking: 'no',
      cleanliness: 'normal',
      contactName: '',
      contactEmail: '',
      contactPhone: ''
    });
  };

  const handleSaveProfile = () => {
    if (!profileData.name || !profileData.email || !profileData.phone || 
        !profileData.age || !profileData.occupation) {
      alert(t[language].fillAllFields);
      return;
    }

    setUserProfile(profileData);
    alert(t[language].profileSaved);
    // Nach Profil speichern direkt zur Abo-Auswahl
    setShowSubscription(true);
  };

  const handleLogout = () => {
    setUserProfile(null);
    setProfileData({
      image: null,
      name: '',
      email: '',
      phone: '',
      age: '',
      occupation: ''
    });
    alert(t[language].loggedOut);
    setCurrentView('home');
  };

  const toggleFavorite = (listingId) => {
    if (favorites.includes(listingId)) {
      setFavorites(favorites.filter(id => id !== listingId));
    } else {
      setFavorites([...favorites, listingId]);
    }
  };

  const handleDeleteClick = (listingId) => {
    setDeleteListingId(listingId);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    setListings(listings.filter(l => l.id !== deleteListingId));
    setShowDeleteConfirm(false);
    setDeleteListingId(null);
    alert(t[language].listingCompleted);
  };

  const handleContactClick = (listing) => {
    setSelectedContact(listing);
    setShowContactModal(true);
  };

  const filteredListings = listings.filter(listing => {
    if (filters.city && listing.city !== filters.city) return false;
    if (filters.maxRent && listing.rent > parseInt(filters.maxRent)) return false;
    if (filters.gender !== 'all' && listing.gender !== 'all' && listing.gender !== filters.gender) return false;
    if (filters.type !== 'all' && listing.type !== filters.type) return false;
    return true;
  });

  const favoriteListings = listings.filter(l => favorites.includes(l.id));

  const getSmokingLabel = (smoking) => {
    if (smoking === 'no') return `🚭 ${t[language].nonSmoker}`;
    if (smoking === 'outside') return `🚬 ${t[language].balcony}`;
    return `✅ ${t[language].smoker}`;
  };

  const getCleanlinessLabel = (cleanliness) => {
    if (cleanliness === 'very-clean') return `✨ ${t[language].veryClean}`;
    if (cleanliness === 'normal') return `👍 ${t[language].normal}`;
    return `😌 ${t[language].relaxed}`;
  };

  return (
    <div className="max-w-6xl mx-auto bg-white min-h-screen pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-400 to-blue-500 text-white p-4 sticky top-0 z-50 shadow-lg">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Home className="w-8 h-8" />
            <h1 className="text-2xl font-bold">{t[language].logo}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setLanguage(language === 'de' ? 'en' : 'de')}
              className="px-3 py-1 bg-white/20 rounded-lg hover:bg-white/30 transition"
            >
              {language === 'de' ? '🇩🇪' : '🇬🇧'}
            </button>
            <button
              onClick={handlePostAdClick}
              className="bg-white text-sky-500 px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>{t[language].postAd}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      {currentView === 'home' && !showAddListing && (
        <div className="bg-gradient-to-r from-sky-50 to-blue-50 p-8 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">{t[language].heroTitle}</h2>
          <p className="text-xl text-sky-600 mb-1">{t[language].heroSubtitle}</p>
          <p className="text-gray-600">{t[language].heroDescription}</p>
        </div>
      )}

      {/* Main Content */}
      <div className="p-4">
        {currentView === 'home' && !showAddListing && (
          <>
            {/* Filter Section */}
            <div className="bg-white border rounded-lg p-4 mb-6 shadow-sm">
              <div className="flex items-center space-x-2 mb-4">
                <Filter className="w-5 h-5 text-sky-500" />
                <h3 className="font-semibold text-lg">{t[language].filter}</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">{t[language].city}</label>
                  <select
                    value={filters.city}
                    onChange={(e) => setFilters({...filters, city: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="">{t[language].allCities}</option>
                    {availableCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">{t[language].maxRent}</label>
                  <input
                    type="number"
                    value={filters.maxRent}
                    onChange={(e) => setFilters({...filters, maxRent: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="€"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">{t[language].gender}</label>
                  <select
                    value={filters.gender}
                    onChange={(e) => setFilters({...filters, gender: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="all">{t[language].all}</option>
                    <option value="male">{t[language].male}</option>
                    <option value="female">{t[language].female}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">{t[language].listingType}</label>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters({...filters, type: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="all">{t[language].allListings}</option>
                    <option value="room">{t[language].offerRoom}</option>
                    <option value="roommate">{t[language].searchRoommate}</option>
                  </select>
                </div>
              </div>

              <button
                onClick={() => setFilters({city: '', maxRent: '', gender: 'all', type: 'all'})}
                className="mt-4 text-sky-500 hover:text-sky-600 text-sm font-medium"
              >
                {t[language].reset}
              </button>
            </div>

            {/* Listings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredListings.map(listing => (
                <div key={listing.id} className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition">
                  <div className="h-48 bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center text-6xl">
                    {listing.image || (listing.type === 'room' ? '🏠' : '👤')}
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg flex-1">{listing.title}</h3>
                      <button
                        onClick={() => toggleFavorite(listing.id)}
                        className="ml-2"
                      >
                        <Heart
                          className={`w-6 h-6 ${favorites.includes(listing.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                        />
                      </button>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600 mb-3">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>{listing.city}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-semibold text-sky-600 text-lg">€{listing.rent} {t[language].perMonth}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{t[language].from} {listing.moveInDate}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>{listing.age} {t[language].years} • {listing.occupation}</span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 mb-3">{listing.description}</p>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {listing.amenities.map((amenity, i) => (
                        <span key={i} className="px-2 py-1 bg-sky-50 text-sky-600 rounded-full text-xs">
                          {amenity}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2 mb-3 text-xs">
                      <span className="px-2 py-1 bg-gray-100 rounded">{getSmokingLabel(listing.smoking)}</span>
                      <span className="px-2 py-1 bg-gray-100 rounded">{getCleanlinessLabel(listing.cleanliness)}</span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleContactClick(listing)}
                        className="flex-1 bg-sky-400 text-white py-2 rounded-lg hover:bg-sky-500 transition flex items-center justify-center space-x-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>{t[language].contact}</span>
                      </button>
                      
                      {userProfile && listing.contactEmail === userProfile.email && (
                        <button
                          onClick={() => handleDeleteClick(listing.id)}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold text-sm"
                        >
                          ✓ {t[language].markAsCompleted}
                        </button>
                      )}
                    </div>

                    <div className="mt-2 text-xs text-gray-500 text-center">
                      {listing.type === 'room' ? `🏠 ${t[language].room}` : `👥 ${t[language].roommate}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {currentView === 'favorites' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">{t[language].myFavorites}</h2>
            {favoriteListings.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>{t[language].noFavorites}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {favoriteListings.map(listing => (
                  <div key={listing.id} className="border rounded-lg overflow-hidden shadow-lg">
                    <div className="h-48 bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center text-6xl">
                      {listing.image || (listing.type === 'room' ? '🏠' : '👤')}
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-2">{listing.title}</h3>
                      <div className="space-y-2 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span>{listing.city}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4" />
                          <span className="font-semibold text-sky-600">€{listing.rent} {t[language].perMonth}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleContactClick(listing)}
                        className="w-full bg-sky-400 text-white py-2 rounded-lg hover:bg-sky-500 transition"
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

        {currentView === 'profile' && (
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{userProfile ? t[language].yourProfile : t[language].createProfile}</h2>
              {userProfile && (
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-semibold"
                >
                  {t[language].logout}
                </button>
              )}
            </div>
            
            {userProfile && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-green-800">
                  <span className="font-semibold">✓ {t[language].loggedInAs}:</span> {userProfile.name} ({userProfile.email})
                </p>
              </div>
            )}
            
            {!userProfile && (
              <div className="bg-sky-50 border border-sky-200 rounded-lg p-4 mb-6">
                <p className="text-sky-800">{t[language].createProfileInfo}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t[language].profileImage}</label>
                <div className="flex items-center space-x-4">
                  {profileData.image ? (
                    <img src={profileData.image} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <label className="px-4 py-2 bg-sky-400 text-white rounded-lg cursor-pointer hover:bg-sky-500 transition">
                    {t[language].uploadImage}
                    <input
                      type="file"
                      onChange={(e) => handleImageUpload(e, 'profile')}
                      accept="image/*"
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">{t[language].name} *</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
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
                <label className="block text-sm font-medium mb-1">{t[language].phone} *</label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

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

              <button
                onClick={handleSaveProfile}
                className="w-full bg-sky-400 text-white py-3 rounded-lg hover:bg-sky-500 transition font-semibold"
              >
                {userProfile ? t[language].updateProfile : t[language].saveProfile}
              </button>
            </div>

            {/* Meine Inserate Sektion */}
            {userProfile && (
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">{t[language].myListings}</h3>
                {listings.filter(l => l.contactEmail === userProfile.email).length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">{t[language].noMyListings}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {listings.filter(l => l.contactEmail === userProfile.email).map(listing => (
                      <div key={listing.id} className="border rounded-lg p-4 bg-white shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-bold text-lg">{listing.title}</h4>
                            <p className="text-sm text-gray-600">{listing.city} • €{listing.rent}/Monat</p>
                          </div>
                          <button
                            onClick={() => handleDeleteClick(listing.id)}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition text-sm font-semibold"
                          >
                            ✓ {t[language].markAsCompleted}
                          </button>
                        </div>
                        <p className="text-sm text-gray-700">{listing.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Subscription Modal */}
      {showSubscription && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{t[language].chooseSubscription}</h2>
              <button onClick={() => setShowSubscription(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <p className="text-gray-600 mb-8">{t[language].subscriptionDesc}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Basic */}
              <div className="border-2 rounded-lg p-6 hover:border-sky-400 transition cursor-pointer">
                <h3 className="text-xl font-bold mb-2">{t[language].basic}</h3>
                <div className="text-3xl font-bold text-sky-500 mb-4">€9.99</div>
                <ul className="space-y-2 mb-6 text-sm">
                  <li>✓ 1 {t[language].monthRuntime}</li>
                  <li>✓ {t[language].adOnlineFor} 1 {t[language].monthOnline}</li>
                  <li>✓ {t[language].unlimitedContact}</li>
                </ul>
                <button
                  onClick={() => handleSubscriptionSelect({ name: 'basic', price: 9.99, duration: 1 })}
                  className="w-full bg-sky-400 text-white py-2 rounded-lg hover:bg-sky-500 transition"
                >
                  {t[language].chooseAbo}
                </button>
              </div>

              {/* Standard */}
              <div className="border-2 border-sky-500 rounded-lg p-6 hover:border-sky-600 transition cursor-pointer relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-sky-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  {t[language].popular}
                </div>
                <h3 className="text-xl font-bold mb-2">{t[language].standard}</h3>
                <div className="text-3xl font-bold text-sky-500 mb-1">€24.99</div>
                <div className="text-sm text-gray-500 mb-4">17% {t[language].cheaper}</div>
                <ul className="space-y-2 mb-6 text-sm">
                  <li>✓ 3 {t[language].monthsRuntime}</li>
                  <li>✓ {t[language].adOnlineFor} 3 {t[language].monthsOnline}</li>
                  <li>✓ {t[language].unlimitedContact}</li>
                  <li>✓ {t[language].fullVisibility}</li>
                </ul>
                <button
                  onClick={() => handleSubscriptionSelect({ name: 'standard', price: 24.99, duration: 3 })}
                  className="w-full bg-sky-500 text-white py-2 rounded-lg hover:bg-sky-600 transition"
                >
                  {t[language].chooseAbo}
                </button>
              </div>

              {/* Premium */}
              <div className="border-2 rounded-lg p-6 hover:border-sky-400 transition cursor-pointer">
                <h3 className="text-xl font-bold mb-2">{t[language].premium}</h3>
                <div className="text-3xl font-bold text-sky-500 mb-1">€44.99</div>
                <div className="text-sm text-gray-500 mb-4">25% {t[language].cheaper}</div>
                <ul className="space-y-2 mb-6 text-sm">
                  <li>✓ 6 {t[language].monthsRuntime}</li>
                  <li>✓ {t[language].adOnlineFor} 6 {t[language].monthsOnline}</li>
                  <li>✓ {t[language].unlimitedContact}</li>
                  <li>✓ {t[language].fullVisibility}</li>
                  <li>✓ {t[language].bestValue}</li>
                </ul>
                <button
                  onClick={() => handleSubscriptionSelect({ name: 'premium', price: 44.99, duration: 6 })}
                  className="w-full bg-sky-400 text-white py-2 rounded-lg hover:bg-sky-500 transition"
                >
                  {t[language].chooseAbo}
                </button>
              </div>
            </div>

            <div className="mt-6 bg-sky-50 border border-sky-200 rounded-lg p-4">
              <p className="text-sm text-sky-800">
                <span className="font-semibold">{t[language].tip}</span> {t[language].longerCheaper}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{t[language].choosePayment}</h2>
              <button onClick={() => setShowPayment(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            {selectedSubscription && (
              <div className="bg-sky-50 border border-sky-200 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{t[language][selectedSubscription.name]}</p>
                    <p className="text-sm text-gray-600">{selectedSubscription.duration} {selectedSubscription.duration === 1 ? t[language].monthRuntime : t[language].monthsRuntime}</p>
                  </div>
                  <div className="text-2xl font-bold text-sky-600">€{selectedSubscription.price}</div>
                </div>
              </div>
            )}

            <div className="space-y-3 mb-6">
              {[
                { id: 'paypal', icon: '💳', name: t[language].paypal, desc: t[language].paypalDesc },
                { id: 'card', icon: '💳', name: t[language].creditCard, desc: t[language].creditCardDesc },
                { id: 'sepa', icon: '🏦', name: t[language].sepa, desc: t[language].sepaDesc },
                { id: 'sofort', icon: '⚡', name: t[language].sofort, desc: t[language].sofortDesc },
                { id: 'giropay', icon: '🇩🇪', name: t[language].giropay, desc: t[language].giropayDesc }
              ].map(method => (
                <div
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition ${
                    selectedPayment === method.id ? 'border-sky-500 bg-sky-50' : 'border-gray-200 hover:border-sky-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{method.icon}</span>
                    <div className="flex-1">
                      <p className="font-semibold">{method.name}</p>
                      <p className="text-sm text-gray-600">{method.desc}</p>
                    </div>
                    {selectedPayment === method.id && (
                      <div className="w-6 h-6 bg-sky-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">✓</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-800">
                <span className="font-semibold">{t[language].secure}</span> {t[language].secureDesc}
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800 text-center font-semibold">
                ⚠️ {t[language].testMode}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowPayment(false);
                  setShowSubscription(true);
                }}
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition"
              >
                {t[language].back}
              </button>
              <button
                onClick={handlePaymentSubmit}
                className="flex-1 bg-sky-500 text-white py-3 rounded-lg hover:bg-sky-600 transition font-semibold"
              >
                {t[language].payNow} €{selectedSubscription?.price}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Listing Modal */}
      {showAddListing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{t[language].createListing}</h2>
              <button onClick={() => setShowAddListing(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">{t[language].listingType} *</label>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    onClick={() => setFormData({...formData, type: 'room'})}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition ${
                      formData.type === 'room' ? 'border-sky-500 bg-sky-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-2">🏠</div>
                      <p className="font-semibold">{t[language].offerRoomDesc}</p>
                      <p className="text-xs text-gray-600 mt-1">{t[language].offerRoomHelp}</p>
                    </div>
                  </div>
                  <div
                    onClick={() => setFormData({...formData, type: 'roommate'})}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition ${
                      formData.type === 'roommate' ? 'border-sky-500 bg-sky-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-2">👤</div>
                      <p className="font-semibold">{t[language].searchRoommateDesc}</p>
                      <p className="text-xs text-gray-600 mt-1">{t[language].searchRoommateHelp}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">{t[language].uploadListingImage}</label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  {formData.image ? (
                    <div>
                      <img src={formData.image} alt="Listing" className="max-h-40 mx-auto rounded mb-3" />
                      <label className="inline-block px-4 py-2 bg-sky-400 text-white rounded-lg cursor-pointer hover:bg-sky-500 transition">
                        {t[language].uploadImage}
                        <input
                          type="file"
                          onChange={(e) => handleImageUpload(e, 'listing')}
                          accept="image/*"
                          className="hidden"
                        />
                      </label>
                    </div>
                  ) : (
                    <div className="text-gray-400">
                      <Plus className="w-12 h-12 mx-auto mb-2" />
                      <p className="text-sm mb-3">{t[language].uploadImageHelp}</p>
                      <label className="inline-block px-4 py-2 bg-sky-400 text-white rounded-lg cursor-pointer hover:bg-sky-500 transition">
                        {t[language].uploadImage}
                        <input
                          type="file"
                          onChange={(e) => handleImageUpload(e, 'listing')}
                          accept="image/*"
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">{t[language].title} *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder={t[language].titlePlaceholder}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">{t[language].city} *</label>
                  {!showCustomCity ? (
                    <select
                      value={formData.city}
                      onChange={(e) => {
                        if (e.target.value === 'other') {
                          setShowCustomCity(true);
                          setFormData({...formData, city: ''});
                        } else {
                          setFormData({...formData, city: e.target.value});
                        }
                      }}
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      <option value="">{t[language].chooseCity}</option>
                      {availableCities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                      <option value="other">➕ {t[language].otherCity}</option>
                    </select>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customCity}
                        onChange={(e) => setCustomCity(e.target.value)}
                        className="flex-1 px-4 py-2 border rounded-lg"
                        placeholder={t[language].enterCity}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setShowCustomCity(false);
                          setCustomCity('');
                        }}
                        className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                  {showCustomCity && (
                    <p className="text-xs text-sky-600 mt-1">
                      ✨ {t[language].cityAutoAdd}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t[language].rentPerMonth} *</label>
                  <input
                    type="number"
                    value={formData.rent}
                    onChange={(e) => setFormData({...formData, rent: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">{t[language].moveInDate} *</label>
                  <input
                    type="date"
                    value={formData.moveInDate}
                    onChange={(e) => setFormData({...formData, moveInDate: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t[language].gender}</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="all">{t[language].anyGender}</option>
                    <option value="male">{t[language].male}</option>
                    <option value="female">{t[language].female}</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">{t[language].age} *</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t[language].occupation} *</label>
                  <input
                    type="text"
                    value={formData.occupation}
                    onChange={(e) => setFormData({...formData, occupation: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">{t[language].description} *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows="3"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">{t[language].amenities}</label>
                <input
                  type="text"
                  value={formData.amenities}
                  onChange={(e) => setFormData({...formData, amenities: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder={t[language].amenitiesPlaceholder}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">{t[language].smoking} *</label>
                  <select
                    value={formData.smoking}
                    onChange={(e) => setFormData({...formData, smoking: e.target.value})}
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
                    value={formData.cleanliness}
                    onChange={(e) => setFormData({...formData, cleanliness: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="very-clean">✨ {t[language].veryClean}</option>
                    <option value="normal">👍 {t[language].normal}</option>
                    <option value="relaxed">😌 {t[language].relaxed}</option>
                  </select>
                </div>
              </div>
              
              <div className="border-t pt-4 mt-4">
                <h4 className="font-semibold mb-3 text-lg">{t[language].contactData}</h4>
                <div className="space-y-4 bg-sky-50 p-4 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium mb-1">{t[language].name}</label>
                    <input
                      type="text"
                      value={userProfile?.name || ''}
                      disabled
                      className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t[language].email}</label>
                    <input
                      type="email"
                      value={userProfile?.email || ''}
                      disabled
                      className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t[language].phone}</label>
                    <input
                      type="tel"
                      value={userProfile?.phone || ''}
                      disabled
                      className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-600"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    💡 {t[language].contactFromProfile}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={handleSubmitListing} 
                  className="flex-1 bg-sky-400 text-white py-3 rounded-lg hover:bg-sky-500 transition"
                >
                  {t[language].post}
                </button>
                <button 
                  onClick={() => setShowAddListing(false)} 
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition"
                >
                  {t[language].cancel}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {showContactModal && selectedContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{t[language].contactDetails}</h2>
              <button onClick={() => setShowContactModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t[language].name}</label>
                <p className="text-lg">{selectedContact.contactName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t[language].email}</label>
                <p className="text-lg text-sky-600">{selectedContact.contactEmail}</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t[language].phone}</label>
                <p className="text-lg text-sky-600">{selectedContact.contactPhone}</p>
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

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-around items-center py-3">
          <button
            onClick={() => setCurrentView('home')}
            className={`flex flex-col items-center space-y-1 ${currentView === 'home' ? 'text-sky-500' : 'text-gray-400'}`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs">{t[language].home}</span>
          </button>
          <button
            onClick={() => setCurrentView('home')}
            className={`flex flex-col items-center space-y-1 ${currentView === 'home' ? 'text-sky-500' : 'text-gray-400'}`}
          >
            <Search className="w-6 h-6" />
            <span className="text-xs">{t[language].search}</span>
          </button>
          <button
            onClick={() => setCurrentView('favorites')}
            className={`flex flex-col items-center space-y-1 ${currentView === 'favorites' ? 'text-sky-500' : 'text-gray-400'}`}
          >
            <Heart className="w-6 h-6" />
            <span className="text-xs">{t[language].favorites}</span>
          </button>
          <button
            onClick={() => setCurrentView('profile')}
            className={`flex flex-col items-center space-y-1 ${currentView === 'profile' ? 'text-sky-500' : 'text-gray-400'}`}
          >
            <User className="w-6 h-6" />
            <span className="text-xs">{t[language].profile}</span>
          </button>
        </div>
      </div>
    </div>
  );
}