import React, { useState, useEffect } from 'react';
import { Home, Users, Search, Plus, MapPin, DollarSign, Calendar, User, Heart, X, MessageCircle, Filter, Globe, ChevronDown, Mail, Lock, Phone, Briefcase, Send, ArrowLeft } from 'lucide-react';
import { supabase, authHelpers, profileHelpers, listingHelpers, favoriteHelpers, feedbackHelpers } from './supabase';
// import StripePayment from './StripePayment';
// import PayPalPayment from './PayPalPayment';
import { getCities, addCity } from './cityManager';


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
    const [showEditListing, setShowEditListing] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);
    const [listingToDelete, setListingToDelete] = useState(null);
    const [listingToEdit, setListingToEdit] = useState(null);
    const [myListings, setMyListings] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const [loading, setLoading] = useState(true);
    const [forceUpdate, setForceUpdate] = useState(0); // Force Re-render beim Logout
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [cities, setCities] = useState([]);
    const [newCityInput, setNewCityInput] = useState('');
    const [showAllCities, setShowAllCities] = useState(false);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [feedbackForm, setFeedbackForm] = useState({
        subject: '',
        message: '',
        category: 'other',
        email: ''
    });

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
        firstName: '', lastName: '', email: '', password: '', confirmPassword: '', phone: ''
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

    // Städte laden
    useEffect(() => {
        setCities(getCities());
    }, []);

    // Browser History Navigation
    useEffect(() => {
        // Initialisiere mit aktueller View
        const path = window.location.pathname;
        const view = path.replace('/', '') || 'home';
        setCurrentView(view);

        // Höre auf Browser Back/Forward Buttons
        const handlePopState = (event) => {
            const view = event.state?.view || 'home';
            setCurrentView(view);
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    // Update URL wenn View sich ändert
    useEffect(() => {
        const path = currentView === 'home' ? '/' : `/${currentView}`;

        // Nur wenn sich die URL tatsächlich ändert
        if (window.location.pathname !== path) {
            window.history.pushState({ view: currentView }, '', path);
        }
    }, [currentView]);

    // Auth State Management - VERBESSERT!
    useEffect(() => {
        console.log('🔵 Auth useEffect startet...');

        const initAuth = async () => {
            try {
                console.log('🔍 Prüfe aktuelle Session...');

                // Hole aktuelle Session
                const { data: { session }, error } = await supabase.auth.getSession();

                if (error) {
                    console.error('❌ Session Error:', error);
                    setLoading(false);
                    return;
                }

                if (session?.user) {
                    console.log('✅ Session gefunden!', session.user.email);

                    // Setze User
                    setUser(session.user);

                    // Lade Profil
                    const { data: profileData, error: profileError } = await profileHelpers.getProfile(session.user.id);

                    if (profileError || !profileData) {
                        console.error('⚠️ Profil nicht gefunden!', profileError);
                        // Logout wenn Profil fehlt
                        await authHelpers.signOut();
                        setUser(null);
                        setUserProfile(null);
                    } else {
                        setUserProfile(profileData);
                        console.log('✅ Profil geladen:', profileData.first_name, profileData.last_name);
                    }
                } else {
                    console.log('ℹ️ Keine aktive Session');
                }

            } catch (error) {
                console.error('❌ Init Auth Error:', error);
            } finally {
                setLoading(false);
            }
        };

        initAuth();

        // Auth State Change Listener
        console.log('👂 Registriere Auth Listener...');
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('🔔 Auth State Changed:', event, session?.user?.email);

            if (event === 'SIGNED_IN' && session?.user) {
                console.log('✅ SIGNED_IN Event!');
                setUser(session.user);

                // Lade Profil
                const { data: profileData } = await profileHelpers.getProfile(session.user.id);
                if (profileData) {
                    setUserProfile(profileData);
                    setForceUpdate(prev => prev + 1); // ← Force Re-render
                    console.log('✅ Profil nach Sign-In geladen');
                }
            } else if (event === 'SIGNED_OUT') {
                console.log('👋 SIGNED_OUT Event!');
                setUser(null);
                setUserProfile(null);
                setForceUpdate(prev => prev + 1); // Force Re-render
            } else if (event === 'TOKEN_REFRESHED') {
                console.log('🔄 Token refreshed');
            }
        });

        return () => {
            console.log('🧹 Cleanup Auth Listener');
            subscription.unsubscribe();
        };
    }, []);

    // Load Listings
    useEffect(() => {
        loadListings();
    }, [filters]);

    // Load Favorites
    useEffect(() => {
        if (user) {
            loadFavorites();
            loadMyListings();
        } else {
            setFavorites([]);
            setMyListings([]);
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

    const loadMyListings = async () => {
        if (!user) return;
        const { data, error } = await listingHelpers.getUserListings(user.id);
        if (error) {
            console.error('Fehler beim Laden meiner Inserate:', error);
        } else {
            setMyListings(data || []);
        }
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
            listingUpdated: 'Inserat aktualisiert!',
            editListing: 'Inserat bearbeiten',
            saveChanges: 'Änderungen speichern',
            active: 'Aktiv',
            inactive: 'Inaktiv',
            edit: 'Bearbeiten',
            delete: 'Löschen',
            markAsFound: 'Als gefunden markieren',
            activateListing: 'Inserat aktivieren',
            selectPlan: 'Wähle ein Paket',
            payment: 'Zahlung',
            month: 'Monat',
            months: 'Monate',
            perMonth: 'pro Monat',
            savePercent: 'spare',
            mostPopular: 'Beliebt',
            bestValue: 'Bester Preis',
            chooseThisPlan: 'Dieses Paket wählen',
            paymentRequired: 'Zahlung erforderlich',
            paymentInfo: 'Um dein Inserat zu veröffentlichen, wähle bitte ein Paket:',
            proceedToPayment: 'Zur Zahlung',
            paymentSuccess: 'Zahlung erfolgreich!',
            paymentCancelled: 'Zahlung abgebrochen',
            cardNumber: 'Kartennummer',
            expiryDate: 'Ablaufdatum',
            cvv: 'CVV',
            payNow: 'Jetzt bezahlen',
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
            feedback: 'Feedback',
            sendFeedback: 'Feedback senden',
            feedbackTitle: 'Gib uns dein Feedback',
            feedbackSubtitle: 'Hilf uns Sakanera zu verbessern!',
            feedbackSubject: 'Betreff',
            feedbackSubjectPlaceholder: 'Worum geht es?',
            feedbackMessage: 'Deine Nachricht',
            feedbackMessagePlaceholder: 'Erzähl uns was wir verbessern können...',
            feedbackSuccess: 'Vielen Dank für dein Feedback!',
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
            listingUpdated: 'Listing updated!',
            editListing: 'Edit Listing',
            saveChanges: 'Save Changes',
            active: 'Active',
            inactive: 'Inactive',
            edit: 'Edit',
            delete: 'Delete',
            markAsFound: 'Mark as found',
            activateListing: 'Activate listing',
            selectPlan: 'Select a plan',
            payment: 'Payment',
            month: 'month',
            months: 'months',
            perMonth: 'per month',
            savePercent: 'save',
            mostPopular: 'Popular',
            bestValue: 'Best Value',
            chooseThisPlan: 'Choose this plan',
            paymentRequired: 'Payment required',
            paymentInfo: 'To publish your listing, please select a plan:',
            proceedToPayment: 'Proceed to payment',
            paymentSuccess: 'Payment successful!',
            paymentCancelled: 'Payment cancelled',
            cardNumber: 'Card number',
            expiryDate: 'Expiry date',
            cvv: 'CVV',
            payNow: 'Pay now',
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
            feedback: 'Feedback',
            sendFeedback: 'Send Feedback',
            feedbackTitle: 'Give us your Feedback',
            feedbackSubtitle: 'Help us improve Sakanera!',
            feedbackSubject: 'Subject',
            feedbackSubjectPlaceholder: 'What is it about?',
            feedbackMessage: 'Your Message',
            feedbackMessagePlaceholder: 'Tell us what we can improve...',
            feedbackSuccess: 'Thank you for your feedback!',
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
                    phone: registerForm.phone || ''
                }
            );

            if (profileError) {
                console.error('❌ Profile Error:', profileError);
                throw profileError;
            }

            console.log('✅ Profil erstellt:', profileData);

            setUserProfile(profileData);
            setForceUpdate(prev => prev + 1); // ← Force Re-render SOFORT!

            console.log('✅ State gesetzt - User:', authData.user.email, 'Profil:', profileData.first_name);

            alert(t[language].registrationSuccess);
            setShowRegisterModal(false);
            setRegisterForm({
                firstName: '', lastName: '', email: '', password: '', confirmPassword: '', phone: ''
            });
        } catch (error) {
            alert(`${t[language].error}: ${error.message}`);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            console.log('🔵 Login startet...');
            console.log('📧 Email:', loginForm.email);

            const { data, error } = await authHelpers.signIn(loginForm.email, loginForm.password);

            if (error) {
                console.error('❌ Login Error:', error);
                alert(`Login fehlgeschlagen: ${error.message}`);
                return;
            }

            console.log('✅ Login erfolgreich!');
            console.log('👤 User:', data.user);

            // Setze User State SOFORT
            setUser(data.user);

            console.log('🔵 Lade Profil...');

            // Lade Profil
            const { data: profileData, error: profileError } = await profileHelpers.getProfile(data.user.id);

            if (profileError || !profileData) {
                console.error('⚠️ Profil nicht gefunden!', profileError);
                alert('Profil nicht gefunden! Bitte kontaktiere den Support.');
                await authHelpers.signOut();
                setUser(null);
                return;
            }

            setUserProfile(profileData);
            console.log('✅ Profil geladen:', profileData.first_name, profileData.last_name);

            // UI aktualisieren
            setShowLoginModal(false);
            setLoginForm({ email: '', password: '' });
            setForceUpdate(prev => prev + 1); // ← Force Re-render SOFORT!

            console.log('🎉 Login komplett!');
            console.log('📊 State:', { user: data.user.email, profile: profileData.first_name });

            alert('Erfolgreich angemeldet!');

        } catch (error) {
            console.error('❌ Login Fehler:', error);
            alert(`Fehler: ${error.message}`);
        }
    };

    const handleLogout = async () => {
        try {
            console.log('👋 Logout startet...');

            // SOFORT State löschen (nicht auf signOut warten)
            setUser(null);
            setUserProfile(null);
            setShowProfileDropdown(false);
            setCurrentView('home');
            setShowListings(false);
            setForceUpdate(prev => prev + 1); // Force Re-render

            console.log('🧹 State sofort gelöscht');

            // Dann Supabase Logout
            const { error } = await authHelpers.signOut();

            if (error) {
                console.error('❌ Logout Error:', error);
                // Aber State ist schon gelöscht, also OK
            } else {
                console.log('✅ Supabase Logout erfolgreich');
            }

            // LocalStorage löschen
            localStorage.removeItem('sakanera-auth-token');

            console.log('✅ Logout komplett!');

            alert('Erfolgreich abgemeldet!');

        } catch (error) {
            console.error('❌ Logout Fehler:', error);
            // State ist trotzdem gelöscht
            alert('Abgemeldet (mit Warnung)');
        }
    };

    const handleFeedbackSubmit = async (e) => {
        e.preventDefault();

        try {
            console.log('📧 Feedback Submit startet...');
            console.log('📋 Form Data:', {
                subject: feedbackForm.subject,
                message: feedbackForm.message,
                category: feedbackForm.category,
                email: feedbackForm.email,
                user: user?.email
            });

            // Validierung
            if (!feedbackForm.subject || feedbackForm.subject.trim() === '') {
                alert(language === 'de' ? 'Bitte gib einen Betreff ein!' : 'Please enter a subject!');
                return;
            }

            if (!feedbackForm.message || feedbackForm.message.trim() === '') {
                alert(language === 'de' ? 'Bitte gib eine Nachricht ein!' : 'Please enter a message!');
                return;
            }

            console.log('✅ Validierung OK');
            console.log('🔵 Sende an Supabase...');

            // Feedback Daten vorbereiten
            const feedbackData = {
                user_id: user?.id || null,
                user_email: user?.email || feedbackForm.email || 'anonymous@sakanera.com',
                user_name: userProfile ? `${userProfile.first_name} ${userProfile.last_name}` : 'Anonymous',
                subject: feedbackForm.subject.trim(),
                message: feedbackForm.message.trim(),
                category: feedbackForm.category || 'other',
                status: 'new'
            };

            console.log('📤 Sende Daten:', feedbackData);

            // Feedback in Datenbank speichern
            const { data, error } = await supabase
                .from('feedback')
                .insert([feedbackData])
                .select()
                .single();

            if (error) {
                console.error('❌ Supabase Feedback Error:', error);
                console.error('   Code:', error.code);
                console.error('   Message:', error.message);
                console.error('   Details:', error.details);

                // Spezifischer Fehler wenn Tabelle nicht existiert
                if (error.code === '42P01' || error.message.includes('relation') || error.message.includes('does not exist')) {
                    alert(language === 'de'
                        ? 'Feedback-Tabelle existiert nicht in Supabase!\n\nBitte führe das SQL aus:\n1. Supabase Dashboard → SQL Editor\n2. Führe das SQL aus der Dokumentation aus\n\nFür jetzt: Dein Feedback wurde in der Console geloggt!'
                        : 'Feedback table does not exist in Supabase!\n\nPlease run the SQL:\n1. Supabase Dashboard → SQL Editor\n2. Run the SQL from documentation\n\nFor now: Your feedback was logged in console!'
                    );

                    // Log Feedback in Console für Admin
                    console.log('📧 FEEDBACK (nicht gespeichert):');
                    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                    console.log('Von:', feedbackData.user_name, `(${feedbackData.user_email})`);
                    console.log('Kategorie:', feedbackData.category);
                    console.log('Betreff:', feedbackData.subject);
                    console.log('Nachricht:', feedbackData.message);
                    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                    console.log('⚠️ Bitte SQL in Supabase ausführen um Feedback zu speichern!');

                    // Reset Form trotzdem
                    setFeedbackForm({
                        subject: '',
                        message: '',
                        category: 'other',
                        email: ''
                    });
                    setShowFeedbackModal(false);
                    return;
                }

                throw error;
            }

            console.log('✅ Feedback erfolgreich gespeichert:', data);

            // Erfolg!
            alert(language === 'de'
                ? '✅ Vielen Dank für dein Feedback!\n\nWir haben es erhalten und werden es bei info@sakanera.com prüfen.'
                : '✅ Thank you for your feedback!\n\nWe received it and will review it at info@sakanera.com.'
            );

            // Reset Form
            setFeedbackForm({
                subject: '',
                message: '',
                category: 'other',
                email: ''
            });
            setShowFeedbackModal(false);

            console.log('🎉 Feedback komplett!');

        } catch (error) {
            console.error('❌ Feedback Fehler:', error);

            let errorMessage = language === 'de'
                ? `Fehler beim Senden: ${error.message}`
                : `Error sending feedback: ${error.message}`;

            alert(errorMessage);
        }
    };

    const handleSubmitListing = async (e) => {
        e.preventDefault();

        if (!user || !userProfile) {
            alert(t[language].pleaseLogin);
            return;
        }

        // Öffne Payment Modal ZUERST (ohne Inserat zu erstellen)
        setShowAddListing(false);
        setShowPaymentModal(true);
    };

    const handleAddCity = () => {
        if (!newCityInput || newCityInput.trim() === '') {
            alert(language === 'de' ? 'Bitte gib einen Stadt-Namen ein' : 'Please enter a city name');
            return;
        }

        const result = addCity(newCityInput);

        if (result.success) {
            // Städte-Liste aktualisieren
            setCities(getCities());
            // Stadt im Formular auswählen
            setListingForm({ ...listingForm, city: result.city });
            // Input leeren
            setNewCityInput('');
            alert(language === 'de'
                ? `Stadt "${result.city}" wurde hinzugefügt!`
                : `City "${result.city}" has been added!`
            );
        } else {
            alert(result.error);
        }
    };

    const handleSubmitFeedback = async (e) => {
        e.preventDefault();

        if (!feedbackForm.subject || !feedbackForm.message) {
            alert(language === 'de' ? 'Bitte fülle alle Felder aus' : 'Please fill all fields');
            return;
        }

        try {
            const feedbackData = {
                user_id: user?.id || null,
                email: user?.email || 'info@sakanera.com',
                name: userProfile ? `${userProfile.first_name} ${userProfile.last_name}` : 'Anonym',
                subject: feedbackForm.subject,
                message: feedbackForm.message,
                status: 'new'
            };

            console.log('📧 Sende Feedback:', feedbackData);

            const { data, error } = await feedbackHelpers.createFeedback(feedbackData);

            if (error) {
                console.error('❌ Feedback Fehler:', error);
                throw error;
            }

            console.log('✅ Feedback gespeichert:', data);

            alert(language === 'de'
                ? 'Vielen Dank für dein Feedback! Wir werden uns baldmöglichst bei dir melden.'
                : 'Thank you for your feedback! We will get back to you soon.'
            );

            setShowFeedbackModal(false);
            setFeedbackForm({
                subject: '',
                message: ''
            });

        } catch (error) {
            console.error('❌ Fehler:', error);
            alert(language === 'de'
                ? `Fehler beim Senden: ${error.message}`
                : `Error sending feedback: ${error.message}`
            );
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
            loadMyListings();
            loadListings();
        } catch (error) {
            alert(`${t[language].error}: ${error.message}`);
        }
    };

    const handleEditListing = (listing) => {
        setListingToEdit(listing);
        setListingForm({
            type: listing.type,
            title: listing.title,
            description: listing.description || '',
            city: listing.city,
            rent: listing.rent.toString(),
            squareMeters: listing.square_meters?.toString() || '',
            roomCount: listing.room_count?.toString() || '',
            availableFrom: listing.available_from || '',
            age: listing.age?.toString() || '',
            gender: listing.gender || 'all',
            occupation: listing.occupation || '',
            smoking: listing.smoking || 'no',
            cleanliness: listing.cleanliness || 'normal',
            amenities: listing.amenities || ''
        });
        setShowEditListing(true);
    };

    const handleUpdateListing = async (e) => {
        e.preventDefault();

        if (!listingToEdit) return;

        try {
            const updates = {
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
                amenities: listingForm.amenities || ''
            };

            const { error } = await listingHelpers.updateListing(listingToEdit.id, updates);
            if (error) throw error;

            alert(t[language].listingUpdated);
            setShowEditListing(false);
            setListingToEdit(null);
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
            loadMyListings();
            loadListings();
        } catch (error) {
            alert(`${t[language].error}: ${error.message}`);
        }
    };

    const handleToggleActive = async (listing) => {
        try {
            const { error } = await listingHelpers.updateListing(listing.id, {
                is_active: !listing.is_active
            });
            if (error) throw error;

            loadMyListings();
            loadListings();
        } catch (error) {
            alert(`${t[language].error}: ${error.message}`);
        }
    };

    const handleSelectPlan = (plan) => {
        setSelectedPlan(plan);
    };

    const handlePaymentSuccess = async (paymentData) => {
        console.log('✅ Zahlung erfolgreich!', paymentData);

        try {
            // Erstelle das Inserat nach erfolgreicher Zahlung
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
                subscription_type: selectedPlan.id,
                payment_method: paymentData.paymentMethod,
                payment_id: paymentData.paymentMethodId || paymentData.orderId,
                is_active: true
            };

            const { data, error } = await listingHelpers.createListing(listingData);
            if (error) throw error;

            alert(t[language].paymentSuccess + ' ' + t[language].listingCreated);

            // Reset
            setShowPaymentModal(false);
            setSelectedPlan(null);
            setSelectedPaymentMethod(null);
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

            loadMyListings();
            loadListings();
            setCurrentView('profile');

        } catch (error) {
            console.error('❌ Fehler beim Erstellen des Inserats:', error);
            alert(`${t[language].error}: ${error.message}`);
        }
    };

    const handlePaymentError = (error) => {
        console.error('❌ Zahlungsfehler:', error);
        alert(`Zahlung fehlgeschlagen: ${error.message || 'Unbekannter Fehler'}`);
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

                        <div className="flex items-center gap-4" key={`${user?.id || 'no-user'}-${forceUpdate}`}>
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
                                    {userProfile ? (
                                        <>
                                            <div className="w-8 h-8 bg-sky-400 rounded-full flex items-center justify-center text-white font-semibold">
                                                {userProfile.first_name?.[0]}{userProfile.last_name?.[0]}
                                            </div>
                                            <span className="hidden md:block font-medium">
                        {userProfile.first_name}
                      </span>
                                        </>
                                    ) : (
                                        <>
                                            <User className="w-5 h-5" />
                                        </>
                                    )}
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
                                                        setCurrentView('favorites');
                                                        setShowProfileDropdown(false);
                                                    }}
                                                    className="w-full px-4 py-2 text-left hover:bg-sky-50 transition flex items-center gap-2"
                                                >
                                                    <Heart className="w-4 h-4" />
                                                    {t[language].favorites}
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
                        {/* Zurück Button */}
                        <button
                            onClick={() => setCurrentView('home')}
                            className="flex items-center gap-2 mb-8 text-sky-600 hover:text-sky-700 transition"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            {language === 'de' ? 'Zurück' : 'Back'}
                        </button>

                        <h2 className="text-4xl font-bold mb-12 text-center">{t[language].citiesPageTitle}</h2>

                        {/* Städte Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {(showAllCities ? cities : cities.slice(0, 8)).map((city) => {
                                const cityListingsCount = listings.filter(l => l.city === city && l.is_active).length;
                                return (
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
                                        <p className="text-sm text-gray-500 mt-2">
                                            {cityListingsCount} {cityListingsCount === 1 ? 'Inserat' : 'Inserate'}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Mehr/Weniger Button */}
                        {cities.length > 8 && (
                            <div className="flex justify-center mt-8">
                                <button
                                    onClick={() => setShowAllCities(!showAllCities)}
                                    className="flex items-center gap-2 px-6 py-3 bg-sky-400 text-white rounded-lg hover:bg-sky-500 transition font-semibold"
                                >
                                    {showAllCities ? (
                                        <>
                                            <ChevronDown className="w-5 h-5 rotate-180" />
                                            {language === 'de' ? 'Weniger anzeigen' : 'Show less'}
                                        </>
                                    ) : (
                                        <>
                                            <ChevronDown className="w-5 h-5" />
                                            {language === 'de' ? 'Andere Städte anzeigen' : 'Show more cities'}
                                            {cities.length > 8 && ` (${cities.length - 8})`}
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {currentView === 'search' && (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {/* Zurück Button */}
                        <button
                            onClick={() => setCurrentView('home')}
                            className="flex items-center gap-2 mb-4 text-sky-600 hover:text-sky-700 transition"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            {language === 'de' ? 'Zurück' : 'Back'}
                        </button>

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
                                            {listing.amenities && listing.amenities.trim() !== '' && (
                                                <div className="mt-4">
                                                    <div className="flex flex-wrap gap-2">
                                                        {listing.amenities
                                                            .split(',')
                                                            .map(a => a.trim())
                                                            .filter(a => a.length > 0)
                                                            .map((amenity, index) => (
                                                                <span
                                                                    key={index}
                                                                    className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-200"
                                                                >
                                  {amenity}
                                </span>
                                                            ))
                                                        }
                                                    </div>
                                                </div>
                                            )}
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
                        {/* Zurück Button */}
                        <button
                            onClick={() => setCurrentView('home')}
                            className="flex items-center gap-2 mb-6 text-sky-600 hover:text-sky-700 transition"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            {language === 'de' ? 'Zurück' : 'Back'}
                        </button>

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
                                        {listing.amenities && listing.amenities.trim() !== '' && (
                                            <div className="mb-4">
                                                <div className="flex flex-wrap gap-2">
                                                    {listing.amenities
                                                        .split(',')
                                                        .map(a => a.trim())
                                                        .filter(a => a.length > 0)
                                                        .map((amenity, index) => (
                                                            <span
                                                                key={index}
                                                                className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-200"
                                                            >
                                {amenity}
                              </span>
                                                        ))
                                                    }
                                                </div>
                                            </div>
                                        )}
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
                                {/* Zurück Button */}
                                <button
                                    onClick={() => setCurrentView('home')}
                                    className="flex items-center gap-2 mb-6 text-sky-600 hover:text-sky-700 transition"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                    {language === 'de' ? 'Zurück' : 'Back'}
                                </button>

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
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-bold">{t[language].myListings}</h2>
                                        <button
                                            onClick={() => setShowAddListing(true)}
                                            className="bg-sky-400 text-white px-4 py-2 rounded-lg hover:bg-sky-500 transition flex items-center gap-2"
                                        >
                                            <Plus className="w-5 h-5" />
                                            {t[language].createListing}
                                        </button>
                                    </div>

                                    {myListings.length === 0 ? (
                                        <p className="text-gray-600 text-center py-8">{t[language].noMyListings}</p>
                                    ) : (
                                        <div className="space-y-4">
                                            {myListings.map((listing) => (
                                                <div
                                                    key={listing.id}
                                                    className="border rounded-lg p-6 hover:shadow-md transition"
                                                >
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <h3 className="text-xl font-bold">{listing.title}</h3>
                                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                                    listing.is_active
                                                                        ? 'bg-green-100 text-green-700'
                                                                        : 'bg-gray-100 text-gray-700'
                                                                }`}>
                                  {listing.is_active ? t[language].active : t[language].inactive}
                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-4 text-gray-600 text-sm mb-2">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                    {listing.city}
                                </span>
                                                                <span className="flex items-center gap-1">
                                  <DollarSign className="w-4 h-4" />
                                                                    {listing.rent}€
                                </span>
                                                                {listing.square_meters && (
                                                                    <span>{listing.square_meters}m²</span>
                                                                )}
                                                            </div>
                                                            {listing.description && (
                                                                <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                                                                    {listing.description}
                                                                </p>
                                                            )}
                                                            {listing.amenities && listing.amenities.trim() !== '' && (
                                                                <div className="mt-3">
                                                                    <div className="flex flex-wrap gap-2">
                                                                        {listing.amenities
                                                                            .split(',')
                                                                            .map(a => a.trim())
                                                                            .filter(a => a.length > 0)
                                                                            .map((amenity, index) => (
                                                                                <span
                                                                                    key={index}
                                                                                    className="px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-200"
                                                                                >
                                          {amenity}
                                        </span>
                                                                            ))
                                                                        }
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-2 pt-4 border-t">
                                                        <button
                                                            onClick={() => handleEditListing(listing)}
                                                            className="flex-1 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition flex items-center justify-center gap-2"
                                                        >
                                                            <User className="w-4 h-4" />
                                                            {t[language].edit}
                                                        </button>
                                                        <button
                                                            onClick={() => handleToggleActive(listing)}
                                                            className={`flex-1 px-4 py-2 rounded-lg transition flex items-center justify-center gap-2 ${
                                                                listing.is_active
                                                                    ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                                                                    : 'bg-green-50 text-green-600 hover:bg-green-100'
                                                            }`}
                                                        >
                                                            <Heart className="w-4 h-4" />
                                                            {listing.is_active ? t[language].markAsFound : t[language].activateListing}
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setListingToDelete(listing);
                                                                setShowDeleteConfirm(true);
                                                            }}
                                                            className="flex-1 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition flex items-center justify-center gap-2"
                                                        >
                                                            <X className="w-4 h-4" />
                                                            {t[language].delete}
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
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
                                        onClick={() => setShowFeedbackModal(true)}
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
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 my-8">
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
                                        {cities.map(city => (
                                            <option key={city} value={city}>{city}</option>
                                        ))}
                                    </select>

                                    {/* Neue Stadt hinzufügen */}
                                    <div className="mt-3 pt-3 border-t">
                                        <label className="block text-xs font-medium text-gray-600 mb-2">
                                            {language === 'de' ? 'Oder neue Stadt hinzufügen:' : 'Or add new city:'}
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={newCityInput}
                                                onChange={(e) => setNewCityInput(e.target.value)}
                                                placeholder={language === 'de' ? 'z.B. Bonn' : 'e.g. Bonn'}
                                                className="flex-1 px-3 py-1.5 border rounded text-sm"
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        handleAddCity();
                                                    }
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={handleAddCity}
                                                className="px-3 py-1.5 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
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

            {/* EDIT LISTING MODAL */}
            {showEditListing && listingToEdit && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 my-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">{t[language].editListing}</h2>
                            <button onClick={() => { setShowEditListing(false); setListingToEdit(null); }}>
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleUpdateListing} className="space-y-4">
                            {/* Typ */}
                            <div>
                                <label className="block text-sm font-medium mb-2">{t[language].type}</label>
                                <select
                                    value={listingForm.type}
                                    onChange={(e) => setListingForm({ ...listingForm, type: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                >
                                    <option value="room">{t[language].room}</option>
                                    <option value="roommate">{t[language].roommate}</option>
                                </select>
                            </div>

                            {/* Titel */}
                            <div>
                                <label className="block text-sm font-medium mb-2">{t[language].title}</label>
                                <input
                                    type="text"
                                    required
                                    value={listingForm.title}
                                    onChange={(e) => setListingForm({ ...listingForm, title: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            </div>

                            {/* Beschreibung */}
                            <div>
                                <label className="block text-sm font-medium mb-2">{t[language].description}</label>
                                <textarea
                                    value={listingForm.description}
                                    onChange={(e) => setListingForm({ ...listingForm, description: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    rows="4"
                                />
                            </div>

                            {/* Stadt & Miete */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">{t[language].city}</label>
                                    <select
                                        value={listingForm.city}
                                        onChange={(e) => setListingForm({ ...listingForm, city: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg"
                                    >
                                        {cities.map(city => (
                                            <option key={city} value={city}>{city}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">{t[language].rent}</label>
                                    <input
                                        type="number"
                                        required
                                        value={listingForm.rent}
                                        onChange={(e) => setListingForm({ ...listingForm, rent: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg"
                                    />
                                </div>
                            </div>

                            {/* Größe & Zimmeranzahl */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">{t[language].squareMeters}</label>
                                    <input
                                        type="number"
                                        value={listingForm.squareMeters}
                                        onChange={(e) => setListingForm({ ...listingForm, squareMeters: e.target.value })}
                                        placeholder="z.B. 20"
                                        className="w-full px-4 py-2 border rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">{t[language].roomCount}</label>
                                    <input
                                        type="number"
                                        value={listingForm.roomCount}
                                        onChange={(e) => setListingForm({ ...listingForm, roomCount: e.target.value })}
                                        placeholder="z.B. 1"
                                        className="w-full px-4 py-2 border rounded-lg"
                                    />
                                </div>
                            </div>

                            {/* Verfügbar ab */}
                            <div>
                                <label className="block text-sm font-medium mb-2">{t[language].availableFrom}</label>
                                <input
                                    type="date"
                                    value={listingForm.availableFrom}
                                    onChange={(e) => setListingForm({ ...listingForm, availableFrom: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            </div>

                            {/* Ausstattung */}
                            <div>
                                <label className="block text-sm font-medium mb-2">{t[language].amenities}</label>
                                <input
                                    type="text"
                                    value={listingForm.amenities}
                                    onChange={(e) => setListingForm({ ...listingForm, amenities: e.target.value })}
                                    placeholder={t[language].amenitiesPlaceholder}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            </div>

                            {/* Alter & Geschlecht */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">{t[language].age}</label>
                                    <input
                                        type="number"
                                        value={listingForm.age}
                                        onChange={(e) => setListingForm({ ...listingForm, age: e.target.value })}
                                        placeholder="z.B. 25"
                                        className="w-full px-4 py-2 border rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">{t[language].gender}</label>
                                    <select
                                        value={listingForm.gender}
                                        onChange={(e) => setListingForm({ ...listingForm, gender: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg"
                                    >
                                        <option value="all">{t[language].all}</option>
                                        <option value="male">{t[language].male}</option>
                                        <option value="female">{t[language].female}</option>
                                        <option value="other">{t[language].other}</option>
                                    </select>
                                </div>
                            </div>

                            {/* Beruf */}
                            <div>
                                <label className="block text-sm font-medium mb-2">{t[language].occupation}</label>
                                <input
                                    type="text"
                                    value={listingForm.occupation}
                                    onChange={(e) => setListingForm({ ...listingForm, occupation: e.target.value })}
                                    placeholder={t[language].occupationPlaceholder}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            </div>


                            {/* Buttons */}
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => { setShowEditListing(false); setListingToEdit(null); }}
                                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition"
                                >
                                    {language === 'de' ? 'Abbrechen' : 'Cancel'}
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-sky-400 text-white py-3 rounded-lg hover:bg-sky-500 transition"
                                >
                                    {t[language].saveChanges}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* PAYMENT MODAL */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">{t[language].selectPlan}</h2>
                            <button onClick={() => {
                                setShowPaymentModal(false);
                                setSelectedPlan(null);
                                setSelectedPaymentMethod(null);
                            }}>
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        {!selectedPlan ? (
                            <>
                                <p className="text-gray-600 mb-8">{t[language].paymentInfo}</p>
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="border-2 rounded-lg p-6 hover:border-sky-400 transition cursor-pointer"
                                         onClick={() => handleSelectPlan({ id: '1month', duration: 1, price: 6.99 })}>
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-sky-400 mb-2">6,99€</div>
                                            <div className="text-gray-600 mb-4">1 {t[language].month}</div>
                                            <button type="button" className="w-full bg-sky-400 text-white py-3 rounded-lg hover:bg-sky-500 transition">
                                                {t[language].chooseThisPlan}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="border-2 border-sky-400 rounded-lg p-6 relative shadow-lg cursor-pointer"
                                         onClick={() => handleSelectPlan({ id: '3months', duration: 3, price: 17.99 })}>
                                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-sky-400 text-white px-4 py-1 rounded-full text-sm font-bold">
                        {t[language].mostPopular}
                      </span>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-sky-400 mb-2">17,99€</div>
                                            <div className="text-gray-600 mb-4">3 {t[language].months}</div>
                                            <div className="text-sm text-green-600 font-semibold mb-4">{t[language].savePercent} 14%</div>
                                            <button type="button" className="w-full bg-sky-400 text-white py-3 rounded-lg hover:bg-sky-500 transition">
                                                {t[language].chooseThisPlan}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="border-2 border-green-400 rounded-lg p-6 relative shadow-lg cursor-pointer"
                                         onClick={() => handleSelectPlan({ id: '6months', duration: 6, price: 29.99 })}>
                                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                        {t[language].bestValue}
                      </span>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-green-600 mb-2">29,99€</div>
                                            <div className="text-gray-600 mb-4">6 {t[language].months}</div>
                                            <div className="text-sm text-green-600 font-semibold mb-4">{t[language].savePercent} 29%</div>
                                            <button type="button" className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition">
                                                {t[language].chooseThisPlan}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : !selectedPaymentMethod ? (
                            /* ZAHLUNGSMETHODE WÄHLEN */
                            <div className="space-y-6">
                                <div className="bg-sky-50 rounded-lg p-6 mb-6">
                                    <div className="text-center">
                                        <div className="text-lg font-semibold mb-2">
                                            {selectedPlan.duration} {selectedPlan.duration === 1 ? t[language].month : t[language].months}
                                        </div>
                                        <div className="text-3xl font-bold text-sky-600">
                                            {selectedPlan.price.toFixed(2)}€
                                        </div>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-center mb-4">
                                    {language === 'de' ? 'Zahlungsmethode wählen' : 'Choose payment method'}
                                </h3>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setSelectedPaymentMethod('stripe')}
                                        className="border-2 border-gray-200 rounded-lg p-8 hover:border-sky-400 hover:bg-sky-50 transition transform hover:scale-105"
                                    >
                                        <div className="text-center">
                                            <div className="text-5xl mb-4">💳</div>
                                            <div className="font-bold text-xl mb-2">
                                                {language === 'de' ? 'Kreditkarte' : 'Credit Card'}
                                            </div>
                                            <div className="text-sm text-gray-600 mb-2">
                                                Visa, Mastercard, Amex
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {language === 'de' ? 'via Stripe' : 'via Stripe'}
                                            </div>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => setSelectedPaymentMethod('paypal')}
                                        className="border-2 border-gray-200 rounded-lg p-8 hover:border-blue-400 hover:bg-blue-50 transition transform hover:scale-105"
                                    >
                                        <div className="text-center">
                                            <div className="text-5xl mb-4">💙</div>
                                            <div className="font-bold text-xl mb-2">PayPal</div>
                                            <div className="text-sm text-gray-600 mb-2">
                                                {language === 'de' ? 'PayPal Account' : 'PayPal Account'}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {language === 'de' ? 'Schnell & sicher' : 'Fast & secure'}
                                            </div>
                                        </div>
                                    </button>
                                </div>

                                <button
                                    onClick={() => setSelectedPlan(null)}
                                    className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition"
                                >
                                    {t[language].back}
                                </button>
                            </div>
                        ) : (
                            /* ZAHLUNG DURCHFÜHREN */
                            <>
                                {selectedPaymentMethod === 'stripe' && (
                                    <div className="space-y-6">
                                        <div className="bg-sky-50 rounded-lg p-6">
                                            <div className="flex justify-between items-center mb-4">
                                                <div>
                                                    <div className="text-sm text-gray-600">Zu zahlen:</div>
                                                    <div className="text-3xl font-bold text-sky-600">{selectedPlan.price.toFixed(2)}€</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm text-gray-600">Paket:</div>
                                                    <div className="text-lg font-semibold">{selectedPlan.duration} {selectedPlan.duration === 1 ? t[language].month : t[language].months}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                                            <label className="block text-sm font-medium mb-3 text-gray-700">Kreditkarten-Daten (Demo)</label>
                                            <input type="text" placeholder="4242 4242 4242 4242" className="w-full px-4 py-2 border rounded-lg mb-3" />
                                            <div className="grid grid-cols-2 gap-3">
                                                <input type="text" placeholder="MM/YY" className="px-4 py-2 border rounded-lg" />
                                                <input type="text" placeholder="CVV" maxLength="3" className="px-4 py-2 border rounded-lg" />
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setSelectedPaymentMethod(null)}
                                                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition"
                                            >
                                                Abbrechen
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    handlePaymentSuccess({
                                                        paymentMethod: 'stripe',
                                                        paymentMethodId: 'demo_' + Date.now(),
                                                        amount: selectedPlan.price,
                                                        plan: selectedPlan.id
                                                    });
                                                }}
                                                className="flex-1 bg-sky-500 text-white py-3 rounded-lg hover:bg-sky-600 transition font-semibold"
                                            >
                                                Jetzt bezahlen {selectedPlan.price.toFixed(2)}€
                                            </button>
                                        </div>

                                        <div className="text-center text-xs text-gray-500">
                                            <p>🔒 Demo-Zahlung (für Testzwecke)</p>
                                        </div>
                                    </div>
                                )}

                                {selectedPaymentMethod === 'paypal' && (
                                    <div className="space-y-6">
                                        <div className="bg-sky-50 rounded-lg p-6">
                                            <div className="flex justify-between items-center mb-4">
                                                <div>
                                                    <div className="text-sm text-gray-600">Zu zahlen:</div>
                                                    <div className="text-3xl font-bold text-sky-600">{selectedPlan.price.toFixed(2)}€</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm text-gray-600">Paket:</div>
                                                    <div className="text-lg font-semibold">{selectedPlan.duration} {selectedPlan.duration === 1 ? t[language].month : t[language].months}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white border-2 border-gray-200 rounded-lg p-6 text-center">
                                            <div className="text-4xl mb-4">💙</div>
                                            <div className="font-bold text-xl mb-2">PayPal Demo</div>
                                            <p className="text-gray-600 mb-4">In Production würde hier PayPal erscheinen</p>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    handlePaymentSuccess({
                                                        paymentMethod: 'paypal',
                                                        orderId: 'demo_order_' + Date.now(),
                                                        payerId: 'demo_payer',
                                                        amount: selectedPlan.price,
                                                        plan: selectedPlan.id
                                                    });
                                                }}
                                                className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition font-semibold"
                                            >
                                                Mit PayPal bezahlen (Demo)
                                            </button>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => setSelectedPaymentMethod(null)}
                                            className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition"
                                        >
                                            Abbrechen
                                        </button>

                                        <div className="text-center text-xs text-gray-500">
                                            <p>🔒 Demo-Zahlung (für Testzwecke)</p>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Feedback Modal */}
            {showFeedbackModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">{language === 'de' ? 'Feedback senden' : 'Send Feedback'}</h2>
                            <button onClick={() => setShowFeedbackModal(false)}>
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                            {/* Kategorie */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    {language === 'de' ? 'Kategorie' : 'Category'}
                                </label>
                                <select
                                    value={feedbackForm.category || 'other'}
                                    onChange={(e) => setFeedbackForm({ ...feedbackForm, category: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    required
                                >
                                    <option value="bug">{language === 'de' ? '🐛 Bug melden' : '🐛 Report Bug'}</option>
                                    <option value="feature">{language === 'de' ? '💡 Feature-Wunsch' : '💡 Feature Request'}</option>
                                    <option value="improvement">{language === 'de' ? '⚡ Verbesserungsvorschlag' : '⚡ Improvement'}</option>
                                    <option value="other">{language === 'de' ? '💬 Sonstiges' : '💬 Other'}</option>
                                </select>
                            </div>

                            {/* Email (falls nicht eingeloggt) */}
                            {!user && (
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        {language === 'de' ? 'Deine Email (optional)' : 'Your Email (optional)'}
                                    </label>
                                    <input
                                        type="email"
                                        value={feedbackForm.email || ''}
                                        onChange={(e) => setFeedbackForm({ ...feedbackForm, email: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg"
                                        placeholder="name@beispiel.de"
                                    />
                                </div>
                            )}

                            {/* Betreff */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    {language === 'de' ? 'Betreff *' : 'Subject *'}
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={feedbackForm.subject}
                                    onChange={(e) => setFeedbackForm({ ...feedbackForm, subject: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    placeholder={language === 'de' ? 'z.B. Fehler beim Inserat erstellen' : 'e.g. Error creating listing'}
                                />
                            </div>

                            {/* Nachricht */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    {language === 'de' ? 'Dein Feedback *' : 'Your Feedback *'}
                                </label>
                                <textarea
                                    required
                                    value={feedbackForm.message}
                                    onChange={(e) => setFeedbackForm({ ...feedbackForm, message: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    rows="6"
                                    placeholder={language === 'de'
                                        ? 'Beschreibe dein Anliegen so detailliert wie möglich...'
                                        : 'Describe your feedback as detailed as possible...'
                                    }
                                />
                            </div>

                            {/* Info Box */}
                            <div className="bg-sky-50 border border-sky-200 rounded-lg p-4">
                                <p className="text-sm text-sky-900">
                                    📧 {language === 'de'
                                    ? 'Dein Feedback wird an info@sakanera.com gesendet und dort bearbeitet. Wir melden uns schnellstmöglich bei dir!'
                                    : 'Your feedback will be sent to info@sakanera.com and processed there. We will get back to you as soon as possible!'
                                }
                                </p>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowFeedbackModal(false)}
                                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition"
                                >
                                    {language === 'de' ? 'Abbrechen' : 'Cancel'}
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-sky-400 text-white py-3 rounded-lg hover:bg-sky-500 transition font-semibold"
                                >
                                    {language === 'de' ? 'Feedback senden' : 'Send Feedback'}
                                </button>
                            </div>
                        </form>
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

            {/* FEEDBACK BUTTON (Floating) */}
            <button
                onClick={() => setShowFeedbackModal(true)}
                className="fixed bottom-6 right-6 bg-sky-500 text-white p-4 rounded-full shadow-lg hover:bg-sky-600 transition z-50 flex items-center gap-2"
                title={t[language].feedback}
            >
                <MessageCircle className="w-6 h-6" />
                <span className="hidden md:inline font-semibold">{t[language].feedback}</span>
            </button>

            {/* FEEDBACK MODAL */}
            {showFeedbackModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-3xl font-bold text-sky-600">{t[language].feedbackTitle}</h2>
                                <p className="text-gray-600 mt-2">{t[language].feedbackSubtitle}</p>
                            </div>
                            <button
                                onClick={() => setShowFeedbackModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmitFeedback} className="space-y-6">
                            {/* Betreff */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    {t[language].feedbackSubject} *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={feedbackForm.subject}
                                    onChange={(e) => setFeedbackForm({ ...feedbackForm, subject: e.target.value })}
                                    placeholder={t[language].feedbackSubjectPlaceholder}
                                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-transparent"
                                />
                            </div>

                            {/* Nachricht */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    {t[language].feedbackMessage} *
                                </label>
                                <textarea
                                    required
                                    value={feedbackForm.message}
                                    onChange={(e) => setFeedbackForm({ ...feedbackForm, message: e.target.value })}
                                    placeholder={t[language].feedbackMessagePlaceholder}
                                    rows="6"
                                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-transparent resize-none"
                                />
                            </div>

                            {/* User Info (read-only wenn eingeloggt) */}
                            {userProfile && (
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600 mb-2">
                                        {language === 'de' ? 'Gesendet von:' : 'Sent by:'}
                                    </p>
                                    <p className="font-semibold">
                                        {userProfile.first_name} {userProfile.last_name}
                                    </p>
                                    <p className="text-sm text-gray-600">{user.email}</p>
                                </div>
                            )}

                            {/* Info */}
                            <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3">
                                <MessageCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-blue-900">
                                    {language === 'de'
                                        ? 'Dein Feedback wird an info@sakanera.com gesendet und hilft uns die Plattform zu verbessern. Wir melden uns baldmöglichst bei dir!'
                                        : 'Your feedback will be sent to info@sakanera.com and helps us improve the platform. We will get back to you soon!'
                                    }
                                </p>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowFeedbackModal(false)}
                                    className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                                >
                                    {language === 'de' ? 'Abbrechen' : 'Cancel'}
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition font-semibold"
                                >
                                    {t[language].sendFeedback}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}