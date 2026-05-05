export type BusStop = {
  id: number;
  name: string;
  lat: number;
  lng: number;
};

// Estimated coordinates tracing from Kutaisi center down towards Rioni Station
export const route3Stops: BusStop[] = [
  { id: 1, name: "13 ფალიაშვილის ქ. Phaliashvili St.", lat: 42.2705, lng: 42.7051 },
  { id: 2, name: "2 წერეთლის ქუჩა", lat: 42.2690, lng: 42.7040 },
  { id: 3, name: "30 წერეთლის ქ. Tseretli St.", lat: 42.2675, lng: 42.7030 },
  { id: 4, name: "98 წერეთლის ქ. Tsereteli St.", lat: 42.2660, lng: 42.7015 },
  { id: 5, name: "12 საჯარო სკოლა Public School", lat: 42.2645, lng: 42.7000 },
  { id: 6, name: "ქუთაისი 1 ცენტრალური რკინიგზის სადგური", lat: 42.2620, lng: 42.6980 },
  { id: 7, name: "95 თამარ მეფის ქ. Tamar Mepe St.", lat: 42.2600, lng: 42.6965 },
  { id: 8, name: "8 კუპრაძის ქ. Kupradze St.", lat: 42.2580, lng: 42.6950 },
  { id: 9, name: "20 კუპრაძის ქ. Kupradze St.", lat: 42.2560, lng: 42.6930 },
  { id: 10, name: "40 კუპრაძის ქ. Kupradze St.", lat: 42.2540, lng: 42.6910 },
  { id: 11, name: "8 ბაგრატიონის ქ. Bagrationi St.", lat: 42.2520, lng: 42.6890 },
  { id: 12, name: "27 აბაშიძის ქ. Abashidze St.", lat: 42.2500, lng: 42.6870 },
  { id: 13, name: "11 აბაშიის ქ. Abashidze St.", lat: 42.2480, lng: 42.6850 },
  { id: 14, name: "3 აბაშიძის ქ. Abashidze St.", lat: 42.2460, lng: 42.6830 },
  { id: 15, name: "25 ახაგაზრდობის I შესახვევი", lat: 42.2430, lng: 42.6800 },
  { id: 16, name: "44 ახალგაზრდობის გამზ. Akhalgazrdoba Ave.", lat: 42.2400, lng: 42.6780 },
  { id: 17, name: "66 ახალგაზრდობის გამზ. Akhalgazrdoba Ave.", lat: 42.2370, lng: 42.6760 },
  { id: 18, name: "80 ახალგაზრდობის გამზ. Akhalgazrdoba Ave.", lat: 42.2340, lng: 42.6740 },
  { id: 19, name: "სპორტის სასახლე Sports Place", lat: 42.2300, lng: 42.6720 },
  { id: 20, name: "102 ახალგაზრდობის გამზ. Akhalgazrdoba Ave.", lat: 42.2270, lng: 42.6700 },
  { id: 21, name: "ქუთაისის ტექნოლოგიური უნივერსიტეტი KIU", lat: 42.2230, lng: 42.6680 },
  { id: 22, name: "მუხნარის დასახლება Mukhnari Settlement", lat: 42.2200, lng: 42.6650 },
  { id: 23, name: "მუხნარის გადასახვევი Mukhnari Trun", lat: 42.2170, lng: 42.6620 },
  { id: 24, name: "რკინიგზის სადგური რიონი Rioni Railway Station", lat: 42.2100, lng: 42.6550 },
];
