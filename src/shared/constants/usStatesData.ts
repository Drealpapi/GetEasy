// Nigerian States and Cities Data
export const NIGERIA_STATES_CITIES: { [key: string]: string[] } = {
  "Abia": ["Umuahia", "Aba", "Arochukwu", "Ohafia", "Bende"],
  "Adamawa": ["Yola", "Mubi", "Jimeta", "Numan", "Ganye"],
  "Akwa Ibom": ["Uyo", "Eket", "Ikot Ekpene", "Oron", "Abak"],
  "Anambra": ["Awka", "Onitsha", "Nnewi", "Ekwulobia", "Ihiala"],
  "Bauchi": ["Bauchi", "Azare", "Misau", "Jama'are", "Katagum"],
  "Bayelsa": ["Yenagoa", "Brass", "Sagbama", "Ogbia", "Nembe"],
  "Benue": ["Makurdi", "Gboko", "Otukpo", "Katsina-Ala", "Vandeikya"],
  "Borno": ["Maiduguri", "Biu", "Bama", "Dikwa", "Monguno"],
  "Cross River": ["Calabar", "Ugep", "Ikom", "Ogoja", "Obudu"],
  "Delta": ["Asaba", "Warri", "Sapele", "Ughelli", "Agbor"],
  "Ebonyi": ["Abakaliki", "Afikpo", "Onueke", "Ezza", "Ishielu"],
  "Edo": ["Benin City", "Auchi", "Ekpoma", "Uromi", "Igarra"],
  "Ekiti": ["Ado-Ekiti", "Ikere-Ekiti", "Ijero-Ekiti", "Ise-Ekiti", "Ikole"],
  "Enugu": ["Enugu", "Nsukka", "Agbani", "Oji River", "Udi"],
  "FCT": ["Abuja", "Gwagwalada", "Kuje", "Bwari", "Kwali"],
  "Gombe": ["Gombe", "Kumo", "Deba", "Billiri", "Kaltungo"],
  "Imo": ["Owerri", "Orlu", "Okigwe", "Mbaise", "Oguta"],
  "Jigawa": ["Dutse", "Hadejia", "Gumel", "Kazaure", "Ringim"],
  "Kaduna": ["Kaduna", "Zaria", "Kafanchan", "Kagoro", "Saminaka"],
  "Kano": ["Kano", "Wudil", "Gwarzo", "Bichi", "Rano"],
  "Katsina": ["Katsina", "Daura", "Funtua", "Malumfashi", "Dutsin-Ma"],
  "Kebbi": ["Birnin Kebbi", "Argungu", "Zuru", "Yauri", "Jega"],
  "Kogi": ["Lokoja", "Okene", "Idah", "Kabba", "Ankpa"],
  "Kwara": ["Ilorin", "Offa", "Jebba", "Lafiagi", "Patigi"],
  "Lagos": ["Lagos", "Ikeja", "Epe", "Ikorodu", "Badagry", "Lekki", "Victoria Island", "Surulere", "Yaba"],
  "Nasarawa": ["Lafia", "Keffi", "Akwanga", "Nasarawa", "Doma"],
  "Niger": ["Minna", "Bida", "Kontagora", "Suleja", "Lapai"],
  "Ogun": ["Abeokuta", "Ijebu Ode", "Sagamu", "Ilaro", "Ota"],
  "Ondo": ["Akure", "Ondo", "Owo", "Ikare", "Ore"],
  "Osun": ["Osogbo", "Ile-Ife", "Ilesa", "Ede", "Iwo"],
  "Oyo": ["Ibadan", "Ogbomosho", "Oyo", "Iseyin", "Saki"],
  "Plateau": ["Jos", "Bukuru", "Pankshin", "Shendam", "Vom"],
  "Rivers": ["Port Harcourt", "Obio-Akpor", "Bonny", "Okrika", "Eleme"],
  "Sokoto": ["Sokoto", "Tambuwal", "Gwadabawa", "Bodinga", "Wamako"],
  "Taraba": ["Jalingo", "Wukari", "Bali", "Ibi", "Takum"],
  "Yobe": ["Damaturu", "Potiskum", "Gashua", "Nguru", "Geidam"],
  "Zamfara": ["Gusau", "Kaura Namoda", "Talata Mafara", "Bungudu", "Anka"],
};

export const getAllUSStates = (): string[] => {
  return Object.keys(NIGERIA_STATES_CITIES).sort();
};

export const getCitiesByState = (state: string): string[] => {
  return NIGERIA_STATES_CITIES[state] || [];
};

export const searchStatesAndCities = (query: string): { state: string; cities: string[] }[] => {
  const lowerQuery = query.toLowerCase();
  const results: { state: string; cities: string[] }[] = [];

  Object.entries(NIGERIA_STATES_CITIES).forEach(([state, cities]) => {
    if (state.toLowerCase().includes(lowerQuery)) {
      results.push({ state, cities });
      return;
    }

    const matchingCities = cities.filter((city) =>
      city.toLowerCase().includes(lowerQuery)
    );
    if (matchingCities.length > 0) {
      results.push({ state, cities: matchingCities });
    }
  });

  return results;
};

export const getPopularLocations = () => [
  { state: "Lagos", city: "Lagos" },
  { state: "FCT", city: "Abuja" },
  { state: "Kano", city: "Kano" },
  { state: "Rivers", city: "Port Harcourt" },
  { state: "Oyo", city: "Ibadan" },
  { state: "Kaduna", city: "Kaduna" },
  { state: "Edo", city: "Benin City" },
  { state: "Enugu", city: "Enugu" },
];

// Export for backward compatibility
export const US_STATES_CITIES = NIGERIA_STATES_CITIES;
