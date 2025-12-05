// Complete US States and Major Cities Data
export const US_STATES_CITIES: Record<string, string[]> = {
  Alabama: ["Birmingham", "Montgomery", "Mobile", "Huntsville", "Tuscaloosa"],
  Alaska: ["Anchorage", "Fairbanks", "Juneau", "Sitka", "Ketchikan"],
  Arizona: ["Phoenix", "Tucson", "Mesa", "Chandler", "Scottsdale"],
  Arkansas: ["Little Rock", "Fort Smith", "Fayetteville", "Springdale", "Jonesboro"],
  California: ["Los Angeles", "San Francisco", "San Diego", "San Jose", "Sacramento"],
  Colorado: ["Denver", "Colorado Springs", "Aurora", "Fort Collins", "Lakewood"],
  Connecticut: ["Bridgeport", "New Haven", "Hartford", "Stamford", "Waterbury"],
  Delaware: ["Wilmington", "Dover", "Newark", "Middletown", "Smyrna"],
  Florida: ["Miami", "Orlando", "Tampa", "Jacksonville", "Fort Lauderdale"],
  Georgia: ["Atlanta", "Augusta", "Columbus", "Savannah", "Athens"],
  Hawaii: ["Honolulu", "Pearl City", "Hilo", "Kailua", "Waipahu"],
  Idaho: ["Boise", "Meridian", "Nampa", "Idaho Falls", "Pocatello"],
  Illinois: ["Chicago", "Aurora", "Naperville", "Joliet", "Rockford"],
  Indiana: ["Indianapolis", "Fort Wayne", "Evansville", "South Bend", "Carmel"],
  Iowa: ["Des Moines", "Cedar Rapids", "Davenport", "Sioux City", "Iowa City"],
  Kansas: ["Wichita", "Overland Park", "Kansas City", "Topeka", "Olathe"],
  Kentucky: ["Louisville", "Lexington", "Bowling Green", "Owensboro", "Covington"],
  Louisiana: ["New Orleans", "Baton Rouge", "Shreveport", "Lafayette", "Lake Charles"],
  Maine: ["Portland", "Lewiston", "Bangor", "South Portland", "Auburn"],
  Maryland: ["Baltimore", "Columbia", "Germantown", "Silver Spring", "Waldorf"],
  Massachusetts: ["Boston", "Worcester", "Springfield", "Cambridge", "Lowell"],
  Michigan: ["Detroit", "Grand Rapids", "Warren", "Sterling Heights", "Ann Arbor"],
  Minnesota: ["Minneapolis", "St. Paul", "Rochester", "Duluth", "Bloomington"],
  Mississippi: ["Jackson", "Gulfport", "Southaven", "Hattiesburg", "Biloxi"],
  Missouri: ["Kansas City", "St. Louis", "Springfield", "Columbia", "Independence"],
  Montana: ["Billings", "Missoula", "Great Falls", "Bozeman", "Butte"],
  Nebraska: ["Omaha", "Lincoln", "Bellevue", "Grand Island", "Kearney"],
  Nevada: ["Las Vegas", "Henderson", "Reno", "North Las Vegas", "Sparks"],
  "New Hampshire": ["Manchester", "Nashua", "Concord", "Derry", "Rochester"],
  "New Jersey": ["Newark", "Jersey City", "Paterson", "Elizabeth", "Edison"],
  "New Mexico": ["Albuquerque", "Las Cruces", "Rio Rancho", "Santa Fe", "Roswell"],
  "New York": ["New York City", "Buffalo", "Rochester", "Yonkers", "Syracuse"],
  "North Carolina": ["Charlotte", "Raleigh", "Greensboro", "Durham", "Winston-Salem"],
  "North Dakota": ["Fargo", "Bismarck", "Grand Forks", "Minot", "West Fargo"],
  Ohio: ["Columbus", "Cleveland", "Cincinnati", "Toledo", "Akron"],
  Oklahoma: ["Oklahoma City", "Tulsa", "Norman", "Broken Arrow", "Edmond"],
  Oregon: ["Portland", "Salem", "Eugene", "Gresham", "Hillsboro"],
  Pennsylvania: ["Philadelphia", "Pittsburgh", "Allentown", "Erie", "Reading"],
  "Rhode Island": ["Providence", "Warwick", "Cranston", "Pawtucket", "East Providence"],
  "South Carolina": ["Charleston", "Columbia", "North Charleston", "Mount Pleasant", "Rock Hill"],
  "South Dakota": ["Sioux Falls", "Rapid City", "Aberdeen", "Brookings", "Watertown"],
  Tennessee: ["Nashville", "Memphis", "Knoxville", "Chattanooga", "Clarksville"],
  Texas: ["Houston", "San Antonio", "Dallas", "Austin", "Fort Worth"],
  Utah: ["Salt Lake City", "West Valley City", "Provo", "West Jordan", "Orem"],
  Vermont: ["Burlington", "South Burlington", "Rutland", "Barre", "Montpelier"],
  Virginia: ["Virginia Beach", "Norfolk", "Chesapeake", "Richmond", "Newport News"],
  Washington: ["Seattle", "Spokane", "Tacoma", "Vancouver", "Bellevue"],
  "West Virginia": ["Charleston", "Huntington", "Morgantown", "Parkersburg", "Wheeling"],
  Wisconsin: ["Milwaukee", "Madison", "Green Bay", "Kenosha", "Racine"],
  Wyoming: ["Cheyenne", "Casper", "Laramie", "Gillette", "Rock Springs"],
};

export const getAllUSStates = (): string[] => {
  return Object.keys(US_STATES_CITIES).sort();
};

export const getCitiesByState = (state: string): string[] => {
  return US_STATES_CITIES[state] || [];
};

export const searchStatesAndCities = (query: string): { states: string[]; cities: { state: string; city: string }[] } => {
  const lowerQuery = query.toLowerCase();
  const states = getAllUSStates().filter(state => 
    state.toLowerCase().includes(lowerQuery)
  );
  
  const cities: { state: string; city: string }[] = [];
  Object.entries(US_STATES_CITIES).forEach(([state, cityList]) => {
    cityList.forEach(city => {
      if (city.toLowerCase().includes(lowerQuery)) {
        cities.push({ state, city });
      }
    });
  });
  
  return { states, cities };
};

export const getPopularLocations = () => [
  { state: "California", city: "Los Angeles", count: 150 },
  { state: "New York", city: "New York City", count: 145 },
  { state: "Texas", city: "Houston", count: 120 },
  { state: "Florida", city: "Miami", count: 110 },
  { state: "Illinois", city: "Chicago", count: 105 },
  { state: "California", city: "San Francisco", count: 95 },
  { state: "Texas", city: "Austin", count: 90 },
  { state: "Washington", city: "Seattle", count: 85 },
];
