// Nigerian States and Major Cities
export const NIGERIA_LOCATIONS = {
  Abia: ["Umuahia", "Aba", "Arochukwu", "Ohafia"],
  Adamawa: ["Yola", "Mubi", "Jimeta", "Numan"],
  "Akwa Ibom": ["Uyo", "Eket", "Ikot Ekpene", "Oron"],
  Anambra: ["Awka", "Onitsha", "Nnewi", "Ekwulobia"],
  Bauchi: ["Bauchi", "Azare", "Misau", "Jama'are"],
  Bayelsa: ["Yenagoa", "Brass", "Sagbama", "Ogbia"],
  Benue: ["Makurdi", "Gboko", "Otukpo", "Katsina-Ala"],
  Borno: ["Maiduguri", "Biu", "Bama", "Dikwa"],
  "Cross River": ["Calabar", "Ugep", "Ikom", "Ogoja"],
  Delta: ["Asaba", "Warri", "Sapele", "Ughelli"],
  Ebonyi: ["Abakaliki", "Afikpo", "Onueke", "Ezza"],
  Edo: ["Benin City", "Auchi", "Ekpoma", "Uromi"],
  Ekiti: ["Ado-Ekiti", "Ikere-Ekiti", "Ijero-Ekiti", "Ise-Ekiti"],
  Enugu: ["Enugu", "Nsukka", "Agbani", "Oji River"],
  "FCT": ["Abuja", "Gwagwalada", "Kuje", "Bwari"],
  Gombe: ["Gombe", "Kumo", "Deba", "Billiri"],
  Imo: ["Owerri", "Orlu", "Okigwe", "Mbaise"],
  Jigawa: ["Dutse", "Hadejia", "Gumel", "Kazaure"],
  Kaduna: ["Kaduna", "Zaria", "Kafanchan", "Kagoro"],
  Kano: ["Kano", "Wudil", "Gwarzo", "Bichi"],
  Katsina: ["Katsina", "Daura", "Funtua", "Malumfashi"],
  Kebbi: ["Birnin Kebbi", "Argungu", "Zuru", "Yauri"],
  Kogi: ["Lokoja", "Okene", "Idah", "Kabba"],
  Kwara: ["Ilorin", "Offa", "Jebba", "Lafiagi"],
  Lagos: ["Lagos", "Ikeja", "Epe", "Ikorodu", "Badagry", "Lekki", "Victoria Island"],
  Nasarawa: ["Lafia", "Keffi", "Akwanga", "Nasarawa"],
  Niger: ["Minna", "Bida", "Kontagora", "Suleja"],
  Ogun: ["Abeokuta", "Ijebu Ode", "Sagamu", "Ilaro"],
  Ondo: ["Akure", "Ondo", "Owo", "Ikare"],
  Osun: ["Osogbo", "Ile-Ife", "Ilesa", "Ede"],
  Oyo: ["Ibadan", "Ogbomosho", "Oyo", "Iseyin"],
  Plateau: ["Jos", "Bukuru", "Pankshin", "Shendam"],
  Rivers: ["Port Harcourt", "Obio-Akpor", "Bonny", "Okrika"],
  Sokoto: ["Sokoto", "Tambuwal", "Gwadabawa", "Bodinga"],
  Taraba: ["Jalingo", "Wukari", "Bali", "Ibi"],
  Yobe: ["Damaturu", "Potiskum", "Gashua", "Nguru"],
  Zamfara: ["Gusau", "Kaura Namoda", "Talata Mafara", "Bungudu"],
};

export const getAllStates = (): string[] => {
  return Object.keys(NIGERIA_LOCATIONS).sort();
};

export const getCitiesByState = (state: string): string[] => {
  return NIGERIA_LOCATIONS[state as keyof typeof NIGERIA_LOCATIONS] || [];
};

export const searchLocations = (query: string): { state: string; cities: string[] }[] => {
  const lowerQuery = query.toLowerCase();
  const results: { state: string; cities: string[] }[] = [];

  Object.entries(NIGERIA_LOCATIONS).forEach(([state, cities]) => {
    // Check if state matches
    if (state.toLowerCase().includes(lowerQuery)) {
      results.push({ state, cities });
      return;
    }

    // Check if any city matches
    const matchingCities = cities.filter((city) =>
      city.toLowerCase().includes(lowerQuery)
    );
    if (matchingCities.length > 0) {
      results.push({ state, cities: matchingCities });
    }
  });

  return results;
};

// Popular cities for quick access
export const POPULAR_CITIES = [
  { state: "Lagos", city: "Lagos" },
  { state: "FCT", city: "Abuja" },
  { state: "Kano", city: "Kano" },
  { state: "Rivers", city: "Port Harcourt" },
  { state: "Oyo", city: "Ibadan" },
  { state: "Kaduna", city: "Kaduna" },
  { state: "Edo", city: "Benin City" },
  { state: "Enugu", city: "Enugu" },
];
