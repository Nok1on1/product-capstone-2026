export type BusStop = {
  id: number;
  name: { en: string; ka: string } | string;
  lat: number;
  lng: number;
  route?: 'station' | 'city'; // Add optional route field
};

export const getBusStopName = (stop: BusStop, lang: string): string => {
  if (typeof stop.name === 'string') return stop.name;
  if (lang === 'ka') return stop.name.ka || stop.name.en;
  return stop.name.en || stop.name.ka;
};

// Direction 1: Colchis Fountain → Rioni Railway Station
export const toStationStops: BusStop[] = [
  { id: 1, name: { en: "Colchis Fountain", ka: "კოლხეთის შადრევანი" }, lat: 42.2715446226412, lng: 42.70544721681055, route: 'station' },
  { id: 2, name: { en: "Bazaar", ka: "ბაზარი" }, lat: 42.27177529022075, lng: 42.70190118127913, route: 'station' },
  { id: 3, name: { en: "Family Super Market", ka: "საოჯახო სუპერმარკეტი" }, lat: 42.27023445067608, lng: 42.7046668356434, route: 'station' },
  { id: 4, name: { en: "Music School", ka: "მუსიკალური სკოლა" }, lat: 42.26650588770381, lng: 42.70431810479281, route: 'station' },
  { id: 5, name: { en: "Balakhvani", ka: "ბალახვანი" }, lat: 42.26178713918192, lng: 42.70757887674272, route: 'station' },
  { id: 6, name: { en: "Judo School", ka: "ძიუდოს სკოლა" }, lat: 42.2585762551442, lng: 42.70849816385021, route: 'station' },
  { id: 7, name: { en: "Former Beeline Office", ka: "ყოფილ ბილაინის ოფისი" }, lat: 42.25339681363742, lng: 42.70946807025002, route: 'station' },
  { id: 8, name: { en: "Police Station", ka: "პოლიციის განყოფილება" }, lat: 42.2435061946532, lng: 42.71232552271654, route: 'station' },
  { id: 9, name: { en: "Tsereteli Uni (Former GPI)", ka: "წერეთლის უნივერსიტეტი (ყოფილი პოლიტექნიკური)" }, lat: 42.234261053052144, lng: 42.7119663525895, route: 'station' },
  { id: 10, name: { en: "KIU (K Building)", ka: "ქუთაისის საერთაშორისო უნივერსიტეტი (კორპუსი K)" }, lat: 42.21359053179239, lng: 42.71027182263266, route: 'station' },
  { id: 11, name: { en: "KIU Campus", ka: "კამპუსი" }, lat: 42.20213804449016, lng: 42.71453244921337, route: 'station' },
  { id: 12, name: { en: "Riongesi", ka: "რიონჰესი" }, lat: 42.20215323101936, lng: 42.72141295460582, route: 'station' },
  { id: 13, name: { en: "KIU Campus (Back)", ka: "კამპუსი (უკანა)" }, lat: 42.20213804449016, lng: 42.71453244921337, route: 'station' },
  { id: 14, name: { en: "Rioni Railway Station", ka: "რიონის რკინიგზის სადგური" }, lat: 42.198911487378304, lng: 42.70948869317411, route: 'station' },
];

// Direction 2: Railway Station → Colchis Fountain (City Centre)
export const toCityCentreStops: BusStop[] = [
  { id: 1, name: { en: "Railway Station", ka: "რკინიგზის სადგური" }, lat: 42.198911487378304, lng: 42.70948869317411, route: 'city' },
  { id: 2, name: { en: "Campus Station (Mushroom)", ka: "კამპუსის სადგური (სოკო)" }, lat: 42.202917072145006, lng: 42.709375875062115, route: 'city' },
  { id: 3, name: { en: "KIU (K Building)", ka: "ქუთაისის საერთაშორისო უნივერსიტეტი (კორპუსი K)" }, lat: 42.214693245874834, lng: 42.710513194026404, route: 'city' },
  { id: 4, name: { en: "Tsereteli Uni (Former GPI)", ka: "წერეთლის უნივერსიტეტი (ყოფილი პოლიტექნიკური)" }, lat: 42.23237285722318, lng: 42.71203657006255, route: 'city' },
  { id: 5, name: { en: "Stop", ka: "გაჩერება" }, lat: 42.2371535081697, lng: 42.71241596344851, route: 'city' },
  { id: 6, name: { en: "Kvirikashvilta Sakhlmuzeumi", ka: "კვირიკაშვილთა სახლმუზეუმი" }, lat: 42.24542483181946, lng: 42.71209882451696, route: 'city' },
  { id: 7, name: { en: "Gurmani", ka: "გურმანი" }, lat: 42.254105552538135, lng: 42.70963470154174, route: 'city' },
  { id: 8, name: { en: "Kutaisi 12th public school", ka: "მე-12 საჯარო სკოლა" }, lat: 42.25897676066516, lng: 42.70902020271069, route: 'city' },
  { id: 9, name: { en: "Galileo and Kutaisi Railway Station", ka: "გალილეო და ქუთაისის რკინიგზის სადგური" }, lat: 42.26145541007716, lng: 42.712603251224415, route: 'city' },
  { id: 10, name: { en: "Tsereteli Uni (OG Buildings)", ka: "წერეთლის უნივერსიტეტი (ძველი კორპუსები)" }, lat: 42.264482568985535, lng: 42.70886727645249, route: 'city' },
  { id: 11, name: { en: "Bublikebi", ka: "ბუბლიკები" }, lat: 42.26827377147613, lng: 42.70631659372671, route: 'city' },
  { id: 12, name: { en: "Colchis Fountain", ka: "კოლხეთის შადრევანი" }, lat: 42.27147419883605, lng: 42.70554985420595, route: 'city' },
];

// Legacy export
export const route3Stops = [...toStationStops, ...toCityCentreStops];