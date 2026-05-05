export type BusStop = {
  id: number;
  name: string;
  lat: number;
  lng: number;
};

// Direction 1: Colchis Fountain → Rioni Railway Station
export const toStationStops: BusStop[] = [
  { id: 1,  name: "Colchis Fountain",        lat: 42.2715446226412,   lng: 42.70544721681055 },
  { id: 2,  name: "Bazaar",                  lat: 42.27177529022075,  lng: 42.70190118127913 },
  { id: 3,  name: "Family Super Market",     lat: 42.27023445067608,  lng: 42.7046668356434  },
  { id: 4,  name: "Music School",            lat: 42.26650588770381,  lng: 42.70431810479281 },
  { id: 5,  name: "Balakhvani",              lat: 42.26178713918192,  lng: 42.70757887674272 },
  { id: 6,  name: "Judo School",             lat: 42.2585762551442,   lng: 42.70849816385021 },
  { id: 7,  name: "Former Beeline Office",   lat: 42.25339681363742,  lng: 42.70946807025002 },
  { id: 8,  name: "Police Station",          lat: 42.2435061946532,   lng: 42.71232552271654 },
  { id: 9,  name: "Tsereteli Uni (Former GPI)", lat: 42.234261053052144, lng: 42.7119663525895 },
  { id: 10, name: "KIU (K Building)",        lat: 42.21359053179239,  lng: 42.71027182263266 },
  { id: 11, name: "KIU Campus",              lat: 42.20213804449016,  lng: 42.71453244921337 },
  { id: 12, name: "Riongesi",                lat: 42.20215323101936,  lng: 42.72141295460582 },
  { id: 13, name: "KIU Campus (Back)",       lat: 42.20213804449016,  lng: 42.71453244921337 },
  { id: 14, name: "Rioni Railway Station",   lat: 42.198911487378304, lng: 42.70948869317411 },
];

// Direction 2: Railway Station → Colchis Fountain (City Centre)
export const toCityCentreStops: BusStop[] = [
  { id: 1,  name: "Railway Station",             lat: 42.198911487378304, lng: 42.70948869317411 },
  { id: 2,  name: "Campus Station (Mushroom)",   lat: 42.202917072145006, lng: 42.709375875062115 },
  { id: 3,  name: "KIU (K Building)",            lat: 42.214693245874834, lng: 42.710513194026404 },
  { id: 4,  name: "Tsereteli Uni (Former GPI)",  lat: 42.23237285722318,  lng: 42.71203657006255 },
  { id: 5,  name: "Stop",                        lat: 42.2371535081697,   lng: 42.71241596344851 },
  { id: 6,  name: "Stop",                        lat: 42.24542483181946,  lng: 42.71209882451696 },
  { id: 7,  name: "Gurmani",                     lat: 42.254105552538135, lng: 42.70963470154174 },
  { id: 8,  name: "Kutaisi 12th public school",  lat: 42.25897676066516,  lng: 42.70902020271069 },
  { id: 9,  name: "Galileo and Kutaisi Railway Station", lat: 42.26145541007716, lng: 42.712603251224415 },
  { id: 10, name: "Tsereteli Uni (OG Buildings)", lat: 42.264482568985535, lng: 42.70886727645249 },
  { id: 11, name: "Bublikebi",                   lat: 42.26827377147613,  lng: 42.70631659372671 },
  { id: 12, name: "Colchis Fountain",            lat: 42.27147419883605,  lng: 42.70554985420595 },
];

// Legacy export for backward compatibility (uses toStationStops)
export const route3Stops = toStationStops;
