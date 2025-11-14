# 🔌 App Integration mit Supabase

Diese Datei erklärt, wie du deine bestehende `App.jsx` mit Supabase verbindest.

---

## 📋 Überblick

**Aktueller Zustand:**
- ✅ App.jsx vorhanden mit komplettem UI
- ✅ Lokaler State (useState) für Daten
- ⚠️ Daten werden nicht gespeichert (gehen bei Reload verloren)

**Nach Integration:**
- ✅ Echte Datenbank (PostgreSQL via Supabase)
- ✅ User Authentication
- ✅ Persistent gespeicherte Daten
- ✅ Bild-Uploads möglich

---

## 🔧 Änderungen die notwendig sind

### 1. Import Supabase Client

**Am Anfang von App.jsx hinzufügen:**

```javascript
import { supabase, authHelpers, profileHelpers, listingHelpers, favoriteHelpers, storageHelpers } from './supabaseClient';
```

### 2. Auth State Management

**Ersetze das lokale userProfile State Management:**

```javascript
// ALT (nur lokal):
const [userProfile, setUserProfile] = useState(null);

// NEU (mit Supabase):
const [userProfile, setUserProfile] = useState(null);
const [user, setUser] = useState(null);

useEffect(() => {
  // Check initial auth state
  authHelpers.getCurrentUser().then(user => {
    if (user) {
      setUser(user);
      // Load profile
      profileHelpers.getProfile(user.id).then(({ data, error }) => {
        if (data) setUserProfile(data);
      });
    }
  });

  // Subscribe to auth changes
  const { data: { subscription } } = authHelpers.onAuthStateChange((event, session) => {
    if (session?.user) {
      setUser(session.user);
      profileHelpers.getProfile(session.user.id).then(({ data }) => {
        if (data) setUserProfile(data);
      });
    } else {
      setUser(null);
      setUserProfile(null);
    }
  });

  return () => subscription.unsubscribe();
}, []);
```

### 3. Registration/Login Funktionen

**Registrierung:**

```javascript
const handleRegister = async (formData) => {
  // 1. Register User
  const { data: authData, error: authError } = await authHelpers.signUp(
    formData.email,
    formData.password,
    {
      firstName: formData.firstName,
      lastName: formData.lastName
    }
  );

  if (authError) {
    alert('Fehler bei der Registrierung: ' + authError.message);
    return;
  }

  // 2. Create Profile
  const { data: profileData, error: profileError } = await profileHelpers.createProfile(
    authData.user.id,
    {
      email: formData.email,
      first_name: formData.firstName,
      last_name: formData.lastName,
      phone: formData.phone,
      age: formData.age,
      occupation: formData.occupation
    }
  );

  if (profileError) {
    alert('Fehler beim Erstellen des Profils: ' + profileError.message);
    return;
  }

  setUserProfile(profileData);
  alert('Registrierung erfolgreich!');
};
```

**Login:**

```javascript
const handleLogin = async (email, password) => {
  const { data, error } = await authHelpers.signIn(email, password);
  
  if (error) {
    alert('Login fehlgeschlagen: ' + error.message);
    return;
  }

  // Profile wird automatisch geladen durch den auth listener
  alert('Login erfolgreich!');
};
```

**Logout:**

```javascript
const handleLogout = async () => {
  await authHelpers.signOut();
  setUserProfile(null);
  setUser(null);
};
```

### 4. Listings laden

**Statt lokalem State:**

```javascript
// ALT:
const [listings, setListings] = useState([]);

// NEU - Listings aus Datenbank laden:
const [listings, setListings] = useState([]);

const loadListings = async (filters = {}) => {
  const { data, error } = await listingHelpers.getAllListings(filters);
  
  if (error) {
    console.error('Fehler beim Laden der Listings:', error);
    return;
  }
  
  setListings(data || []);
};

// Beim Start laden
useEffect(() => {
  loadListings();
}, []);
```

### 5. Neues Listing erstellen

```javascript
const handleSubmitListing = async (formData) => {
  if (!user) {
    alert('Bitte melde dich an!');
    return;
  }

  // Listing-Daten vorbereiten
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
    gender: formData.gender,
    occupation: formData.occupation,
    smoking: formData.smoking,
    cleanliness: formData.cleanliness,
    amenities: formData.amenities,
    contact_name: `${userProfile.first_name} ${userProfile.last_name}`,
    contact_email: userProfile.email,
    contact_phone: userProfile.phone,
    subscription_type: formData.subscriptionType || 'basic'
  };

  // In Datenbank speichern
  const { data, error } = await listingHelpers.createListing(listingData);
  
  if (error) {
    alert('Fehler beim Erstellen des Inserats: ' + error.message);
    return;
  }

  alert('Inserat erfolgreich erstellt!');
  
  // Listings neu laden
  loadListings();
  setShowAddListing(false);
};
```

### 6. Favoriten Management

```javascript
const handleToggleFavorite = async (listingId) => {
  if (!user) {
    alert('Bitte melde dich an!');
    return;
  }

  // Prüfen ob bereits favorisiert
  const { isFavorite } = await favoriteHelpers.isFavorite(user.id, listingId);
  
  if (isFavorite) {
    // Entfernen
    await favoriteHelpers.removeFavorite(user.id, listingId);
  } else {
    // Hinzufügen
    await favoriteHelpers.addFavorite(user.id, listingId);
  }
  
  // Favoriten neu laden
  loadFavorites();
};

const loadFavorites = async () => {
  if (!user) return;
  
  const { data, error } = await favoriteHelpers.getUserFavorites(user.id);
  
  if (data) {
    // data enthält favorites mit eingebetteten listings
    setFavorites(data.map(f => f.listing));
  }
};
```

### 7. Bild-Upload

```javascript
const handleImageUpload = async (file, type = 'profile') => {
  if (!user) return;

  let uploadResult;
  
  if (type === 'profile') {
    uploadResult = await storageHelpers.uploadProfileImage(user.id, file);
  } else if (type === 'listing') {
    uploadResult = await storageHelpers.uploadListingImage(listingId, file);
  }

  if (uploadResult.error) {
    alert('Fehler beim Hochladen: ' + uploadResult.error.message);
    return;
  }

  // URL des hochgeladenen Bildes
  const imageUrl = uploadResult.data;
  
  return imageUrl;
};
```

---

## 🔄 Filter mit Supabase

Die Filter-Funktionalität ist bereits in `listingHelpers.getAllListings()` eingebaut:

```javascript
const handleFilterChange = async (newFilters) => {
  setFilters(newFilters);
  
  // Listings mit Filtern laden
  await loadListings(newFilters);
};
```

---

## 📝 Vollständiges Beispiel: Listings View

```javascript
const ListingsView = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    city: 'all',
    type: 'all',
    maxRent: null,
    gender: 'all'
  });

  const loadListings = async () => {
    setLoading(true);
    const { data, error } = await listingHelpers.getAllListings(filters);
    
    if (error) {
      console.error('Error loading listings:', error);
    } else {
      setListings(data || []);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    loadListings();
  }, [filters]);

  if (loading) {
    return <div>Lade Inserate...</div>;
  }

  return (
    <div>
      {/* Filter UI */}
      <FilterComponent filters={filters} onChange={setFilters} />
      
      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {listings.map(listing => (
          <ListingCard 
            key={listing.id} 
            listing={listing}
            onToggleFavorite={handleToggleFavorite}
          />
        ))}
      </div>
    </div>
  );
};
```

---

## ⚠️ Wichtige Sicherheitshinweise

1. **Niemals `service_role` Key im Frontend verwenden!**
   - Nur `anon` (public) Key verwenden
   - Service Role Key hat Admin-Rechte

2. **Row Level Security (RLS) ist aktiviert:**
   - User können nur ihre eigenen Daten ändern
   - Alle Listings sind öffentlich lesbar

3. **Environment Variables:**
   - Niemals API Keys direkt in Code schreiben
   - Immer über `import.meta.env.VITE_SUPABASE_URL` zugreifen

---

## 🧪 Testing

**Lokales Testen mit echten Daten:**

1. `.env` Datei erstellen mit Supabase Credentials
2. `npm run dev` ausführen
3. Registriere einen Test-User
4. Erstelle Test-Listings
5. Teste alle Funktionen

---

## 🚀 Deployment Checklist

Vor dem Deployment auf Vercel:

- [ ] Alle Supabase Helper in `supabaseClient.js` importiert
- [ ] Auth State Management eingebaut
- [ ] Login/Register Funktionen integriert
- [ ] Listings laden aus Datenbank
- [ ] Listings erstellen in Datenbank
- [ ] Favoriten Management funktioniert
- [ ] Environment Variables in Vercel konfiguriert
- [ ] Lokal getestet mit echten Supabase-Daten

---

## 💡 Nächste Features (Optional)

Nach dem Basic-Setup kannst du hinzufügen:

1. **Real-time Updates:**
   ```javascript
   useEffect(() => {
     const subscription = realtimeHelpers.subscribeToNewListings((payload) => {
       setListings(prev => [payload.new, ...prev]);
     });
     
     return () => subscription.unsubscribe();
   }, []);
   ```

2. **Messaging System:**
   - Nutze die `messages` Tabelle
   - Real-time Chat mit Supabase Realtime

3. **Email Notifications:**
   - Supabase Edge Functions
   - SendGrid Integration

4. **Advanced Search:**
   - Full-text search in PostgreSQL
   - Elasticsearch Integration

---

## 📚 Ressourcen

- **Supabase Docs:** https://supabase.com/docs
- **Supabase Auth:** https://supabase.com/docs/guides/auth
- **Supabase Storage:** https://supabase.com/docs/guides/storage
- **Row Level Security:** https://supabase.com/docs/guides/auth/row-level-security

---

**Die grundlegende Integration ist in `src/supabaseClient.js` bereits vorbereitet.**
**Du musst nur die Funktionen in deiner `App.jsx` verwenden!**
