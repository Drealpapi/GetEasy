// Complete Nigeria Location Data with States, Cities, and Local Government Areas (LGAs)

export interface LocationData {
    state: string;
    capital: string;
    lgas: {
        name: string;
        cities: string[];
    }[];
}

export const NIGERIA_LOCATIONS: LocationData[] = [
    {
        state: "Abia",
        capital: "Umuahia",
        lgas: [
            { name: "Aba North", cities: ["Aba", "Eziama", "Umuogor"] },
            { name: "Aba South", cities: ["Aba", "Ngwa Road", "Ariaria"] },
            { name: "Arochukwu", cities: ["Arochukwu", "Ohafia"] },
            { name: "Bende", cities: ["Bende", "Uzuakoli", "Item"] },
            { name: "Ikwuano", cities: ["Isiala Oboro", "Ibere", "Ariam"] },
            { name: "Isiala Ngwa North", cities: ["Isiala Ngwa", "Nsulu"] },
            { name: "Isiala Ngwa South", cities: ["Omoba", "Mbutu Ukwu"] },
            { name: "Isuikwuato", cities: ["Isuikwuato", "Uturu"] },
            { name: "Obi Ngwa", cities: ["Mgboko Amairi", "Akoli"] },
            { name: "Ohafia", cities: ["Ohafia", "Ebem", "Abiriba"] },
            { name: "Osisioma", cities: ["Osisioma", "Aba"] },
            { name: "Ugwunagbo", cities: ["Ugwunagbo", "Ohanze"] },
            { name: "Ukwa East", cities: ["Akwete", "Azumini"] },
            { name: "Ukwa West", cities: ["Asa", "Obohia"] },
            { name: "Umuahia North", cities: ["Umuahia", "Ibeku"] },
            { name: "Umuahia South", cities: ["Umuahia", "Olokoro"] },
            { name: "Umu Nneochi", cities: ["Nneochi", "Lomara"] },
        ]
    },
    {
        state: "Adamawa",
        capital: "Yola",
        lgas: [
            { name: "Demsa", cities: ["Demsa", "Borrong", "Dong"] },
            { name: "Fufure", cities: ["Fufore", "Gurin", "Ribadu"] },
            { name: "Ganye", cities: ["Ganye", "Gamu", "Timdore"] },
            { name: "Girei", cities: ["Girei", "Damare", "Gereng"] },
            { name: "Gombi", cities: ["Gombi", "Garkida", "Hong"] },
            { name: "Guyuk", cities: ["Guyuk", "Chikila", "Kola"] },
            { name: "Hong", cities: ["Hong", "Uba", "Hildi"] },
            { name: "Jada", cities: ["Jada", "Mayo Lope", "Ganye"] },
            { name: "Lamurde", cities: ["Lamurde", "Gyawana", "Ribadu"] },
            { name: "Madagali", cities: ["Madagali", "Gulak", "Shuwa"] },
            { name: "Maiha", cities: ["Maiha", "Belel", "Sorau"] },
            { name: "Mayo Belwa", cities: ["Mayo Belwa", "Ribadu", "Toungo"] },
            { name: "Michika", cities: ["Michika", "Moda", "Wuro Ngayandi"] },
            { name: "Mubi North", cities: ["Mubi", "Digil", "Lokuwa"] },
            { name: "Mubi South", cities: ["Mubi", "Gella", "Muchalla"] },
            { name: "Numan", cities: ["Numan", "Zing", "Bare"] },
            { name: "Shelleng", cities: ["Shelleng", "Bakta", "Gundo"] },
            { name: "Song", cities: ["Song", "Dirma", "Gudu"] },
            { name: "Toungo", cities: ["Toungo", "Dawo", "Kiri"] },
            { name: "Yola North", cities: ["Yola", "Jimeta", "Karewa"] },
            { name: "Yola South", cities: ["Yola", "Namtari", "Mbamba"] },
        ]
    },
    {
        state: "Akwa Ibom",
        capital: "Uyo",
        lgas: [
            { name: "Abak", cities: ["Abak", "Midim", "Ikot Akpa Nkuk"] },
            { name: "Eastern Obolo", cities: ["Okoroete", "Agwut Obolo"] },
            { name: "Eket", cities: ["Eket", "Afaha Eket", "Idua"] },
            { name: "Esit Eket", cities: ["Uquo", "Etebi"] },
            { name: "Essien Udim", cities: ["Afaha Ikot Ebak", "Ikot Akpa Nkuk"] },
            { name: "Etim Ekpo", cities: ["Utu Etim Ekpo", "Ikot Akpa Nkuk"] },
            { name: "Etinan", cities: ["Etinan", "Nung Udoe"] },
            { name: "Ibeno", cities: ["Ibeno", "Mkpanak"] },
            { name: "Ibesikpo Asutan", cities: ["Nung Udoe", "Ikot Akpan"] },
            { name: "Ibiono Ibom", cities: ["Ibiaku Ntok Okpo", "Ikot Akpan"] },
            { name: "Ika", cities: ["Urua Inyang", "Ikot Akpan"] },
            { name: "Ikono", cities: ["Ikono", "Ibiaku Ntok Okpo"] },
            { name: "Ikot Abasi", cities: ["Ikot Abasi", "Ukpum Ete"] },
            { name: "Ikot Ekpene", cities: ["Ikot Ekpene", "Ikot Akpan"] },
            { name: "Ini", cities: ["Odoro Ikpe", "Ikpe Ikot Nkon"] },
            { name: "Itu", cities: ["Itu", "Ikot Ekpene"] },
            { name: "Mbo", cities: ["Enwang", "Ebughu"] },
            { name: "Mkpat Enin", cities: ["Mkpat Enin", "Ikot Akpan"] },
            { name: "Nsit Atai", cities: ["Odoro Ikot", "Mbiaso"] },
            { name: "Nsit Ibom", cities: ["Afaha Offiong", "Ikot Akpan"] },
            { name: "Nsit Ubium", cities: ["Ikot Ekpene", "Ikot Akpan"] },
            { name: "Obot Akara", cities: ["Nto Edino", "Ikot Akpan"] },
            { name: "Okobo", cities: ["Okobo", "Nung Atai"] },
            { name: "Onna", cities: ["Abat", "Awa"] },
            { name: "Oron", cities: ["Oron", "Udung Uko"] },
            { name: "Oruk Anam", cities: ["Ikot Ibritam", "Ikot Akpan"] },
            { name: "Udung Uko", cities: ["Eyofin", "Afaha Okpo"] },
            { name: "Ukanafun", cities: ["Ukanafun", "Ikot Akpan"] },
            { name: "Uruan", cities: ["Uruan", "Ikot Akpan"] },
            { name: "Urue Offong/Oruko", cities: ["Urue Offong", "Ikot Akpan"] },
            { name: "Uyo", cities: ["Uyo", "Eket Road", "Ikot Ekpene Road"] },
        ]
    },
    {
        state: "Anambra",
        capital: "Awka",
        lgas: [
            { name: "Aguata", cities: ["Aguata", "Ekwulobia", "Igbo-Ukwu"] },
            { name: "Anambra East", cities: ["Otuocha", "Aguleri", "Nando"] },
            { name: "Anambra West", cities: ["Nzam", "Ifite-Ogwari"] },
            { name: "Anaocha", cities: ["Neni", "Agulu", "Adazi"] },
            { name: "Awka North", cities: ["Achalla", "Amansea", "Amanuke"] },
            { name: "Awka South", cities: ["Awka", "Amawbia", "Nibo"] },
            { name: "Ayamelum", cities: ["Anaku", "Ifite Ogwari", "Omor"] },
            { name: "Dunukofia", cities: ["Ukpo", "Umudioka", "Umunnachi"] },
            { name: "Ekwusigo", cities: ["Ozubulu", "Ihembosi", "Oraifite"] },
            { name: "Idemili North", cities: ["Ogidi", "Abatete", "Oraukwu"] },
            { name: "Idemili South", cities: ["Ojoto", "Nnokwa", "Akwa Ukwu"] },
            { name: "Ihiala", cities: ["Ihiala", "Uli", "Mbosi"] },
            { name: "Njikoka", cities: ["Abagana", "Enugwu-Ukwu", "Nawfia"] },
            { name: "Nnewi North", cities: ["Nnewi", "Uruagu", "Umudim"] },
            { name: "Nnewi South", cities: ["Ukpor", "Ezinifite", "Unubi"] },
            { name: "Ogbaru", cities: ["Atani", "Okpoko", "Ossomala"] },
            { name: "Onitsha North", cities: ["Onitsha", "Inland Town", "GRA"] },
            { name: "Onitsha South", cities: ["Onitsha", "Fegge", "Woliwo"] },
            { name: "Orumba North", cities: ["Ajalli", "Awa", "Ndiokolo"] },
            { name: "Orumba South", cities: ["Umunze", "Ezira", "Ihite"] },
            { name: "Oyi", cities: ["Nteje", "Awkuzu", "Umunya"] },
        ]
    },
    {
        state: "Lagos",
        capital: "Ikeja",
        lgas: [
            { name: "Agege", cities: ["Agege", "Dopemu", "Orile Agege"] },
            { name: "Ajeromi-Ifelodun", cities: ["Ajegunle", "Olodi", "Temidire"] },
            { name: "Alimosho", cities: ["Ikotun", "Egbeda", "Idimu", "Iyana Ipaja"] },
            { name: "Amuwo-Odofin", cities: ["Festac", "Satellite Town", "Mile 2"] },
            { name: "Apapa", cities: ["Apapa", "Ajegunle", "Liverpool"] },
            { name: "Badagry", cities: ["Badagry", "Ajara", "Apa", "Iworo"] },
            { name: "Epe", cities: ["Epe", "Ejinrin", "Poka"] },
            { name: "Eti-Osa", cities: ["Lekki", "Victoria Island", "Ikoyi", "Ajah"] },
            { name: "Ibeju-Lekki", cities: ["Ibeju", "Lekki", "Akodo", "Bogije"] },
            { name: "Ifako-Ijaiye", cities: ["Ifako", "Ijaiye", "Agbado", "Iju"] },
            { name: "Ikeja", cities: ["Ikeja", "Allen", "Opebi", "Alausa", "GRA"] },
            { name: "Ikorodu", cities: ["Ikorodu", "Igbogbo", "Imota", "Ijede"] },
            { name: "Kosofe", cities: ["Ketu", "Ikosi", "Oworonshoki", "Ojota"] },
            { name: "Lagos Island", cities: ["Lagos Island", "Marina", "Isale Eko"] },
            { name: "Lagos Mainland", cities: ["Yaba", "Ebute Metta", "Oyingbo"] },
            { name: "Mushin", cities: ["Mushin", "Idi Oro", "Papa Ajao", "Odi Olowo"] },
            { name: "Ojo", cities: ["Ojo", "Alaba", "Okokomaiko", "Ajangbadi"] },
            { name: "Oshodi-Isolo", cities: ["Oshodi", "Isolo", "Okota", "Ejigbo"] },
            { name: "Shomolu", cities: ["Shomolu", "Bariga", "Gbagada", "Akoka"] },
            { name: "Surulere", cities: ["Surulere", "Iponri", "Itire", "Aguda"] },
        ]
    },
    {
        state: "FCT",
        capital: "Abuja",
        lgas: [
            { name: "Abaji", cities: ["Abaji", "Gawu", "Pandagi"] },
            { name: "Abuja Municipal", cities: ["Central Area", "Garki", "Wuse", "Maitama", "Asokoro"] },
            { name: "Bwari", cities: ["Bwari", "Kubwa", "Dutse", "Ushafa"] },
            { name: "Gwagwalada", cities: ["Gwagwalada", "Zuba", "Tungan Maje"] },
            { name: "Kuje", cities: ["Kuje", "Chibiri", "Gudunkarya"] },
            { name: "Kwali", cities: ["Kwali", "Kilankwa", "Pai"] },
        ]
    },
];

// Helper functions
export const getAllStates = (): string[] => {
    return NIGERIA_LOCATIONS.map(loc => loc.state).sort();
};

export const getStateData = (stateName: string): LocationData | undefined => {
    return NIGERIA_LOCATIONS.find(loc => loc.state === stateName);
};

export const getLGAsByState = (stateName: string): string[] => {
    const state = getStateData(stateName);
    return state ? state.lgas.map(lga => lga.name) : [];
};

export const getCitiesByLGA = (stateName: string, lgaName: string): string[] => {
    const state = getStateData(stateName);
    if (!state) return [];

    const lga = state.lgas.find(l => l.name === lgaName);
    return lga ? lga.cities : [];
};

export const getAllCitiesInState = (stateName: string): string[] => {
    const state = getStateData(stateName);
    if (!state) return [];

    const allCities = new Set<string>();
    state.lgas.forEach(lga => {
        lga.cities.forEach(city => allCities.add(city));
    });

    return Array.from(allCities).sort();
};

export const searchLocations = (query: string): {
    state: string;
    lgas: { name: string; cities: string[] }[];
}[] => {
    const lowerQuery = query.toLowerCase();
    const results: { state: string; lgas: { name: string; cities: string[] }[] }[] = [];

    NIGERIA_LOCATIONS.forEach(location => {
        // Check if state matches
        if (location.state.toLowerCase().includes(lowerQuery)) {
            results.push({ state: location.state, lgas: location.lgas });
            return;
        }

        // Check LGAs and cities
        const matchingLGAs = location.lgas.filter(lga => {
            const lgaMatches = lga.name.toLowerCase().includes(lowerQuery);
            const cityMatches = lga.cities.some(city =>
                city.toLowerCase().includes(lowerQuery)
            );
            return lgaMatches || cityMatches;
        });

        if (matchingLGAs.length > 0) {
            results.push({ state: location.state, lgas: matchingLGAs });
        }
    });

    return results;
};

// Popular locations for quick access
export const POPULAR_LOCATIONS = [
    { state: "Lagos", lga: "Ikeja", city: "Ikeja" },
    { state: "Lagos", lga: "Eti-Osa", city: "Lekki" },
    { state: "Lagos", lga: "Lagos Island", city: "Lagos Island" },
    { state: "FCT", lga: "Abuja Municipal", city: "Central Area" },
    { state: "FCT", lga: "Bwari", city: "Kubwa" },
    { state: "Lagos", lga: "Alimosho", city: "Ikotun" },
    { state: "Lagos", lga: "Ikorodu", city: "Ikorodu" },
    { state: "Lagos", lga: "Surulere", city: "Surulere" },
];
