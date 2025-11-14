// STÄDTE-VERWALTUNG für Sakanera
// Verwaltet dynamische Städte-Liste in localStorage

// Default Städte
const DEFAULT_CITIES = [
  'Aachen',
  'Berlin',
  'Hamburg',
  'München',
  'Köln',
  'Frankfurt',
  'Stuttgart',
  'Düsseldorf',
  'Dortmund',
  'Essen',
  'Leipzig',
  'Bremen',
  'Dresden',
  'Hannover',
  'Nürnberg'
];

// Städte aus localStorage holen
export const getCities = () => {
  try {
    const stored = localStorage.getItem('sakanera_cities');
    if (stored) {
      const cities = JSON.parse(stored);
      // Merge mit Default Cities und dedupliziere
      const allCities = [...new Set([...DEFAULT_CITIES, ...cities])];
      return allCities.sort();
    }
    return DEFAULT_CITIES.sort();
  } catch (error) {
    console.error('Fehler beim Laden der Städte:', error);
    return DEFAULT_CITIES.sort();
  }
};

// Stadt hinzufügen
export const addCity = (cityName) => {
  try {
    if (!cityName || cityName.trim() === '') {
      return { success: false, error: 'Stadt-Name darf nicht leer sein' };
    }

    const trimmedCity = cityName.trim();
    const cities = getCities();

    // Prüfe ob Stadt bereits existiert (case-insensitive)
    const cityExists = cities.some(
      city => city.toLowerCase() === trimmedCity.toLowerCase()
    );

    if (cityExists) {
      return { success: false, error: 'Stadt existiert bereits' };
    }

    // Stadt hinzufügen
    const customCities = getCustomCities();
    customCities.push(trimmedCity);
    localStorage.setItem('sakanera_cities', JSON.stringify(customCities));

    return { success: true, city: trimmedCity };
  } catch (error) {
    console.error('Fehler beim Hinzufügen der Stadt:', error);
    return { success: false, error: error.message };
  }
};

// Nur custom Städte (ohne Default)
export const getCustomCities = () => {
  try {
    const stored = localStorage.getItem('sakanera_cities');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    return [];
  }
};

// Stadt löschen (nur custom cities)
export const removeCity = (cityName) => {
  try {
    const customCities = getCustomCities();
    const filtered = customCities.filter(
      city => city.toLowerCase() !== cityName.toLowerCase()
    );
    localStorage.setItem('sakanera_cities', JSON.stringify(filtered));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Prüfe ob Stadt custom ist (kann gelöscht werden)
export const isCustomCity = (cityName) => {
  return !DEFAULT_CITIES.includes(cityName);
};
