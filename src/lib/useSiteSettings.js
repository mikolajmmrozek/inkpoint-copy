import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

export const DEFAULT_SITE = {
  site_name: 'STUDIO TATTOO',
  site_name_top: 'STUDIO',
  site_name_bottom: 'TATTOO',
  hero_tagline: 'STUDIO\nTATTOO',
  hero_subtext: 'Studio tatuażu i piercingu.\nSztuka trwała — precyzyjna — Twoja.',
  hero_video_url: '',
  about_heading: 'Sztuka, która',
  about_highlight_word: 'POZOSTAJE',
  about_paragraph_1: 'Studio tatuażu i piercingu, gdzie precyzja spotyka pasję. Nasi artyści łączą doświadczenie z nieustannym dążeniem do perfekcji, tworząc dzieła dopasowane do każdego klienta.',
  about_paragraph_2: 'Każda sesja zaczyna się od rozmowy. Słuchamy, projektujemy, tworzymy.',
  about_image_url: 'https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?w=800&q=85',
  about_stats_number: '4+',
  about_stats_text: 'DOŚWIADCZENIA',
  contact_email: '',
  contact_address_street: '',
  contact_address_city: '',
  contact_address_country: 'Polska',
  contact_phone: '',
  contact_hours: '',
  contact_instagram: '',
  contact_instagram_url: '',
  contact_facebook: '',
  contact_facebook_url: '',
  contact_youtube: '',
  contact_youtube_url: '',
  contact_tiktok: '',
  contact_tiktok_url: '',
  contact_google_maps_url: '',
  site_logo_url: '',
  app_icon_url: '',
  app_description: '',
};

// Ładuje ustawienia o kluczach ['hero','about','contact','branding'] i scali je w jeden obiekt.
export function useSiteSettings() {
  const [settings, setSettings] = useState(DEFAULT_SITE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    base44.entities.SiteSettings.list()
      .then(records => {
        if (cancelled) return;
        const merged = { ...DEFAULT_SITE };
        records.forEach(rec => {
          Object.keys(rec).forEach(k => {
            if (rec[k] !== undefined && rec[k] !== null && rec[k] !== '') {
              merged[k] = rec[k];
            }
          });
        });
        setSettings(merged);
      })
      .catch(() => {})
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, []);

  return { settings, loading };
}

// Wyciąga miasto i kraj z pól kontaktowych: "64-200 Wolsztyn" -> "Wolsztyn", a kraj z osobnego pola (fallback "Polska").
export function getCity(settings) {
  const cityRaw = settings.contact_address_city || '';
  // "64-200 Wolsztyn" → "Wolsztyn"
  const parts = cityRaw.trim().split(/\s+/);
  if (parts.length > 1 && /^\d{2}-\d{3}$/.test(parts[0])) {
    return parts.slice(1).join(' ');
  }
  return cityRaw.trim();
}

export function getCountry(settings) {
  return (settings.contact_address_country || 'Polska').trim();
}

// Zwraca "Wolsztyn, Polska" do wyświetlenia nad tytułem w hero.
export function getLocationLabel(settings) {
  const city = getCity(settings);
  const country = getCountry(settings);
  if (city && country) return `${city.toUpperCase()}, ${country.toUpperCase()}`;
  if (city) return city.toUpperCase();
  if (country) return country.toUpperCase();
  return '';
}