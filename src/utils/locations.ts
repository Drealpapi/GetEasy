// US States and Major Cities
export const US_LOCATIONS = {
  Alabama: ["Birmingham", "Montgomery", "Mobile", "Huntsville"],
  Alaska: ["Anchorage", "Fairbanks", "Juneau"],
  Arizona: ["Phoenix", "Tucson", "Mesa", "Chandler"],
  Arkansas: ["Little Rock", "Fort Smith", "Fayetteville"],
  California: ["Los Angeles", "San Francisco", "San Diego", "San Jose", "Sacramento"],
  Colorado: ["Denver", "Colorado Springs", "Aurora"],
  Connecticut: ["Hartford", "New Haven", "Stamford"],
  Delaware: ["Wilmington", "Dover"],
  Florida: ["Miami", "Orlando", "Tampa", "Jacksonville", "Fort Lauderdale"],
  Georgia: ["Atlanta", "Augusta", "Columbus", "Savannah"],
  Hawaii: ["Honolulu", "Hilo"],
  Idaho: ["Boise", "Meridian", "Nampa"],
  Illinois: ["Chicago", "Aurora", "Naperville", "Rockford"],
  Indiana: ["Indianapolis", "Fort Wayne", "Evansville"],
  Iowa: ["Des Moines", "Cedar Rapids", "Davenport"],
  Kansas: ["Wichita", "Overland Park", "Kansas City"],
  Kentucky: ["Louisville", "Lexington", "Bowling Green"],
  Louisiana: ["New Orleans", "Baton Rouge", "Shreveport"],
  Maine: ["Portland", "Lewiston", "Bangor"],
  Maryland: ["Baltimore", "Columbia", "Germantown"],
  Massachusetts: ["Boston", "Worcester", "Springfield"],
  Michigan: ["Detroit", "Grand Rapids", "Warren", "Ann Arbor"],
  Minnesota: ["Minneapolis", "Saint Paul", "Rochester"],
  Mississippi: ["Jackson", "Gulfport", "Southaven"],
  Missouri: ["Kansas City", "Saint Louis", "Springfield"],
  Montana: ["Billings", "Missoula", "Great Falls"],
  Nebraska: ["Omaha", "Lincoln", "Bellevue"],
  Nevada: ["Las Vegas", "Henderson", "Reno"],
  "New Hampshire": ["Manchester", "Nashua", "Concord"],
  "New Jersey": ["Newark", "Jersey City", "Paterson"],
  "New Mexico": ["Albuquerque", "Las Cruces", "Rio Rancho"],
  "New York": ["New York City", "Buffalo", "Rochester", "Syracuse"],
  "North Carolina": ["Charlotte", "Raleigh", "Greensboro", "Durham"],
  "North Dakota": ["Fargo", "Bismarck", "Grand Forks"],
  Ohio: ["Columbus", "Cleveland", "Cincinnati", "Toledo"],
  Oklahoma: ["Oklahoma City", "Tulsa", "Norman"],
  Oregon: ["Portland", "Salem", "Eugene"],
  Pennsylvania: ["Philadelphia", "Pittsburgh", "Allentown"],
  "Rhode Island": ["Providence", "Warwick", "Cranston"],
  "South Carolina": ["Charleston", "Columbia", "Greenville"],
  "South Dakota": ["Sioux Falls", "Rapid City", "Aberdeen"],
  Tennessee: ["Nashville", "Memphis", "Knoxville", "Chattanooga"],
  Texas: ["Houston", "Dallas", "Austin", "San Antonio", "Fort Worth"],
  Utah: ["Salt Lake City", "Provo", "West Valley City"],
  Vermont: ["Burlington", "South Burlington", "Rutland"],
  Virginia: ["Virginia Beach", "Norfolk", "Richmond"],
  Washington: ["Seattle", "Spokane", "Tacoma", "Vancouver"],
  "West Virginia": ["Charleston", "Huntington", "Morgantown"],
  Wisconsin: ["Milwaukee", "Madison", "Green Bay"],
  Wyoming: ["Cheyenne", "Casper", "Laramie"],
};

export const getAllStates = (): string[] => {
  return Object.keys(US_LOCATIONS).sort();
};

export const getCitiesByState = (state: string): string[] => {
  return US_LOCATIONS[state as keyof typeof US_LOCATIONS] || [];
};

export const searchLocations = (query: string): { state: string; cities: string[] }[] => {
  const lowerQuery = query.toLowerCase();
  const results: { state: string; cities: string[] }[] = [];

  Object.entries(US_LOCATIONS).forEach(([state, cities]) => {
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
