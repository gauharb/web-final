const routeOptions = [
  { id: 1, type: "Budget",  flight: "JFK → AMS → LHR", duration: "14h 15m", stops: 1, hotel: "The Pilgrm Hotel, London W2",     price: 480 },
  { id: 2, type: "Popular", flight: "JFK → LHR",       duration: "7h 10m",  stops: 0, hotel: "citizenM London Bankside",        price: 620 },
  { id: 3, type: "Fastest", flight: "JFK → LHR",       duration: "6h 10m",  stops: 0, hotel: "Park Plaza London Riverbank",     price: 780 },
  { id: 4, type: "Budget",  flight: "JFK → DUB → LHR", duration: "12h 40m", stops: 1, hotel: "Generator London, King's Cross",  price: 455 },
  { id: 5, type: "Comfort", flight: "JFK → LHR",       duration: "7h 00m",  stops: 0, hotel: "The Hoxton, Holborn",             price: 890 },
  { id: 6, type: "Value",   flight: "EWR → LHR",       duration: "7h 05m",  stops: 0, hotel: "Premier Inn London Southwark",    price: 560 }
];



const places = [
  { id: 1,  name: "Borough Market",          category: "food",      area: "London Bridge", text: "Street food, bakeries and local produce in one of London's oldest markets." },
  { id: 2,  name: "Glastonbury Abbey",        category: "culture",   area: "Glastonbury",   text: "Ruins and gardens of a medieval abbey, a short walk from the town centre." },
  { id: 3,  name: "Glastonbury Tor",          category: "nature",    area: "Glastonbury",   text: "A hill with wide views over Somerset — good for a sunrise walk." },
  { id: 4,  name: "Tate Modern",              category: "culture",   area: "Bankside",      text: "Free modern art museum next to the river, close to several sample hotels." },
  { id: 5,  name: "Camden Town",              category: "nightlife", area: "Camden",        text: "Live music venues and late bars for an evening after the event." },
  { id: 6,  name: "Hyde Park",                category: "nature",    area: "Central London",text: "Large park for a calm morning before a long travel day." },
  { id: 7,  name: "Dishoom Shoreditch",       category: "food",      area: "Shoreditch",    text: "Popular Bombay-style café — book ahead or arrive early." },
  { id: 8,  name: "Covent Garden",            category: "shopping",  area: "West End",      text: "Shops, street performers and small boutiques in a covered market." },
  { id: 9,  name: "Shepton Mallet Outlet",    category: "shopping",  area: "Somerset",      text: "Outdoor gear and last-minute festival supplies near the venue." },
  { id: 10, name: "Southbank Centre",         category: "nightlife", area: "South Bank",    text: "Evening concerts, riverside bars and free events." }
];

const tripPurposes = ["Concert", "Festival", "Business event", "Sports event", "Leisure", "Other"];

const placeCategories = ["all", "food", "culture", "nature", "nightlife", "shopping"];
