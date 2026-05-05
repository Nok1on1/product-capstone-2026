const dictionaries = {
  en: {
    nav: { home: "Home", map: "Live Map", schedule: "Schedule", feedback: "Feedback", account: "Account" },
    home: {
      title: "Where are you?",
      subtitle: "Select your stop to see live bus times.",
      currentStop: "Current Stop",
      checkStatus: "Check Status",
      checking: "Checking...",
      stillChecking: "Still checking...",
      typically: "Next bus typically arrives in 15 mins.",
      activeBuses: "Active Buses",
      alerts: "Alerts",
      none: "None",
      confirmed: "Confirmed",
      arrivingSoon: "Bus #3 arriving soon",
      crowding: "Crowding",
      checkAgain: "Check Again",
      mins: "mins",
    },
    routes: {
      title: "Bus #3",
      subtitle: "Daily Schedule",
      operatingHours: "Operating Hours",
      operatingHoursValue: "7:30 AM - 10:00 PM",
      frequency: "Frequency",
      frequencyValue: "Every 30 minutes",
      infoTitle: "Exceptions",
      infoText: "Please note that the 8:00 PM bus does not run. After this time, only one bus continues making trips until 10:00 PM.",
    },
    feedback: {
      title: "How was the ride?",
      subtitle: "Help us improve crowding accuracy",
      empty: "Empty",
      emptyDesc: "Plenty of seats available",
      normal: "Normal",
      normalDesc: "Standing room mostly",
      packed: "Packed",
      packedDesc: "Hardly any room to stand",
      thankYou: "Thank You!",
      thankYouDesc: "Your feedback helps everyone.",
      returning: "Returning to home..."
    },
    common: { login: "Log In", signup: "Sign Up", logout: "Log Out" }
  },
  ka: {
    nav: { home: "მთავარი", map: "რუკა", schedule: "განრიგი", feedback: "შეფასება", account: "პროფილი" },
    home: {
      title: "სად ხართ?",
      subtitle: "აირჩიეთ გაჩერება დროის სანახავად.",
      currentStop: "მიმდინარე გაჩერება",
      checkStatus: "სტატუსის შემოწმება",
      checking: "მოწმდება...",
      stillChecking: "კიდევ მოწმდება...",
      typically: "შემდეგი ავტობუსი ჩვეულებრივ 15 წუთში მოდის.",
      activeBuses: "აქტიური ავტობუსები",
      alerts: "შეტყობინებები",
      none: "არცერთი",
      confirmed: "დადასტურებულია",
      arrivingSoon: "ავტობუსი #3 მალე მოვა",
      crowding: "გადატვირთულობა",
      checkAgain: "თავიდან შემოწმება",
      mins: "წთ",
    },
    routes: {
      title: "ავტობუსი #3",
      subtitle: "ყოველდღიური განრიგი",
      operatingHours: "სამუშაო საათები",
      operatingHoursValue: "07:30 - 22:00",
      frequency: "ინტერვალი",
      frequencyValue: "ყოველ 30 წუთში",
      infoTitle: "გამონაკლისები",
      infoText: "გთხოვთ გაითვალისწინოთ, რომ 20:00 საათზე ავტობუსი არ მოძრაობს. ამ დროის შემდეგ მხოლოდ ერთი ავტობუსი აგრძელებს მუშაობას 22:00 საათამდე.",
    },
    feedback: {
      title: "როგორი მგზავრობა იყო?",
      subtitle: "დაგვეხმარეთ სიზუსტის გაუმჯობესებაში",
      empty: "ცარიელი",
      emptyDesc: "ბევრი თავისუფალი ადგილია",
      normal: "ნორმალური",
      normalDesc: "ძირითადად ფეხზე დგომა",
      packed: "გადაჭედილი",
      packedDesc: "დასადგომი ადგილიც კი ძლივს არის",
      thankYou: "გმადლობთ!",
      thankYouDesc: "თქვენი შეფასება ყველას ეხმარება.",
      returning: "მთავარზე დაბრუნება..."
    },
    common: { login: "შესვლა", signup: "რეგისტრაცია", logout: "გასვლა" }
  }
};

export type Locale = keyof typeof dictionaries;

export const getDictionary = (locale: Locale) => dictionaries[locale] || dictionaries.en;
