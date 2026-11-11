
class TripRecord {
  constructor(data) {
    data = data || {};
    this.id = String(data.id || Date.now() + "-" + Math.random().toString(36).slice(2, 8));
    this.origin = String(data.origin || "").trim();
    this.destination = String(data.destination || "").trim();
    this.departure = String(data.departure || "");
    this.returnDate = String(data.returnDate || "");
    this.travellers = Number(data.travellers);
    this.budget = data.budget === "" ? 0 : Number(data.budget);
    this.purpose = String(data.purpose || "Leisure");
    this.notes = String(data.notes || "").trim();
  }

  getBudgetPerPerson() {
    return this.travellers > 0 ? this.budget / this.travellers : 0;
  }

  getDurationDays() {
    if (!this.returnDate) return 1;
    const start = new Date(this.departure + "T12:00:00Z");
    const end = new Date(this.returnDate + "T12:00:00Z");
    return Math.round((end - start) / 86400000) + 1;
  }

  isValid() {
    if (this.origin.length < 2 || this.destination.length < 2) return false;
    if (this.origin.toLowerCase() === this.destination.toLowerCase()) return false;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(this.departure)) return false;
    if (Number.isNaN(new Date(this.departure + "T12:00:00Z").getTime())) return false;
    if (this.returnDate) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(this.returnDate)) return false;
      if (this.returnDate <= this.departure) return false;
      if (Number.isNaN(new Date(this.returnDate + "T12:00:00Z").getTime())) return false;
    }
    if (!Number.isInteger(this.travellers) || this.travellers < 1 || this.travellers > 10) return false;
    if (!Number.isFinite(this.budget) || this.budget < 0 || this.budget > 50000) return false;
    if (this.notes.length > 240) return false;
    return true;
  }

  toJSON() {
    return {
      id: this.id,
      origin: this.origin,
      destination: this.destination,
      departure: this.departure,
      returnDate: this.returnDate,
      travellers: this.travellers,
      budget: this.budget,
      purpose: this.purpose,
      notes: this.notes
    };
  }
}

const TRIPS_STORAGE_KEY = "nomadica-final-trips-v1";

function getSavedTrips() {
  const stored = loadData(TRIPS_STORAGE_KEY, []);
  const trips = [];
  if (!Array.isArray(stored)) return trips;

  stored.forEach(function (item) {
    if (!item || typeof item !== "object" || Array.isArray(item)) return;
    if (typeof item.id !== "string" || !item.id) return;
    const trip = new TripRecord(item);
    if (trip.isValid()) trips.push(trip);
  });
  return trips;
}

function setSavedTrips(trips) {
  const data = trips.map(function (trip) { return trip.toJSON(); });
  try {
    localStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.warn("Could not save trips to localStorage:", error);
    return false;
  }
}
