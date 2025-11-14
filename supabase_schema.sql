-- ============================================
-- SAKANERA DATENBANK SCHEMA
-- Für Supabase PostgreSQL
-- ============================================

-- 1. PROFILES TABELLE (Benutzerprofile)
-- ============================================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  age INTEGER,
  occupation TEXT,
  profile_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. LISTINGS TABELLE (Inserate)
-- ============================================
CREATE TABLE listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Grunddaten
  type TEXT NOT NULL CHECK (type IN ('room', 'roommate')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  city TEXT NOT NULL,
  rent DECIMAL(10,2) NOT NULL,
  
  -- Zimmer-Details
  square_meters INTEGER,
  room_count INTEGER,
  available_from DATE,
  
  -- Persönliche Präferenzen
  age INTEGER,
  gender TEXT CHECK (gender IN ('male', 'female', 'all')),
  occupation TEXT,
  smoking TEXT NOT NULL CHECK (smoking IN ('no', 'outside', 'yes')),
  cleanliness TEXT NOT NULL CHECK (cleanliness IN ('very-clean', 'normal', 'relaxed')),
  
  -- Zusatzinfos
  amenities TEXT,
  
  -- Kontaktdaten (aus Profil)
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  
  -- Abo/Status
  subscription_type TEXT DEFAULT 'basic' CHECK (subscription_type IN ('basic', 'standard', 'premium')),
  subscription_ends_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  
  -- Bilder
  images TEXT[], -- Array von Bild-URLs
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. FAVORITES TABELLE (Favoriten)
-- ============================================
CREATE TABLE favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  
  -- Ein User kann ein Listing nur einmal favorisieren
  UNIQUE(user_id, listing_id)
);

-- 4. MESSAGES TABELLE (Nachrichten - optional für später)
-- ============================================
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================
-- INDICES für bessere Performance
-- ============================================
CREATE INDEX idx_listings_user_id ON listings(user_id);
CREATE INDEX idx_listings_city ON listings(city);
CREATE INDEX idx_listings_type ON listings(type);
CREATE INDEX idx_listings_is_active ON listings(is_active);
CREATE INDEX idx_listings_created_at ON listings(created_at DESC);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_listing_id ON favorites(listing_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON messages(receiver_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Profiles: Jeder kann Profile lesen, aber nur eigenes bearbeiten
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles sind öffentlich lesbar"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "User können eigenes Profil erstellen"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "User können eigenes Profil aktualisieren"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Listings: Jeder kann lesen, nur Besitzer können bearbeiten/löschen
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Listings sind öffentlich lesbar"
  ON listings FOR SELECT
  USING (true);

CREATE POLICY "User können eigene Listings erstellen"
  ON listings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "User können eigene Listings aktualisieren"
  ON listings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "User können eigene Listings löschen"
  ON listings FOR DELETE
  USING (auth.uid() = user_id);

-- Favorites: Nur eigene Favoriten sehen und verwalten
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User können eigene Favorites sehen"
  ON favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "User können Favorites erstellen"
  ON favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "User können eigene Favorites löschen"
  ON favorites FOR DELETE
  USING (auth.uid() = user_id);

-- Messages: Nur eigene Nachrichten sehen
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User können eigene Nachrichten sehen"
  ON messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "User können Nachrichten senden"
  ON messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "User können eigene Nachrichten aktualisieren"
  ON messages FOR UPDATE
  USING (auth.uid() = receiver_id);

-- ============================================
-- FUNKTIONEN für automatische Timestamps
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger für alle Tabellen
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- STORAGE BUCKETS für Bilder
-- ============================================

-- Bucket für Profilbilder erstellen (über Supabase UI oder Storage API)
-- Name: profile-images
-- Public: true

-- Bucket für Listing-Bilder erstellen
-- Name: listing-images
-- Public: true

-- Storage Policies werden später über die Supabase UI konfiguriert

-- ============================================
-- TESTDATEN (Optional - zum Testen)
-- ============================================

-- Beispiel-Listing (nach der Registrierung eines Users)
-- INSERT INTO listings (user_id, type, title, description, city, rent, ...)
-- VALUES (...);

-- ============================================
-- FERTIG! 🎉
-- ============================================
