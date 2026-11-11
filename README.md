# Nomadica — Event Travel Planning (Final Project)

Nomadica is a responsive multi-page website that helps people plan trips to concerts, festivals, sports events, business events and city breaks. The Final Project continues our Midterm and Endterm work: the topic, team, pages and all earlier HTML, CSS, Bootstrap, JavaScript, validation and jQuery features stay the same, and five new features were added.

**Group:** Gauhar · Beksultan · Nazar
**Repository:** https://github.com/gauharb/web-final
**Live site:** https://gauharb.github.io/web-final/

## Final features

| # | Requirement | Feature | Files |
|---|---|---|---|
| 1 | API (mandatory) | City search and 5-day weather forecast from Open-Meteo with loading, success, empty and error states | `pages/weather.html`, `css/weather.css`, `js/pages/weather.js` |
| 2 | OOP (mandatory) | `TripRecord` class with a constructor, properties and four methods; every saved trip is a `TripRecord` object | `js/core/trips.js` |
| 3 | localStorage (mandatory) | Trips are saved as JSON, restored when the page opens, updated after every change and can be cleared; invalid saved data is skipped | `js/core/trips.js`, `js/pages/my-trips.js` |
| 4 | CRUD | Create, read, update and delete trips on the My trips page, plus "Clear all" | `pages/my-trips.html`, `js/pages/my-trips.js` |
| 5 | Dashboard | Number of trips, total travellers, total budget and a budget bar chart built from the saved trips | `pages/my-trips.html`, `css/my-trips.css`, `js/pages/my-trips.js` |

The pages are connected: **Save this trip** on the Plan page fills the My trips form, and **Check weather** on a saved trip opens the Weather page with the city already entered.

## API

- Service: [Open-Meteo Forecast API](https://open-meteo.com/en/docs) and [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api)
- No API key is needed, so there is no secret in the code.
- `weather.js` uses `fetch` with `async`/`await`, checks `response.ok`, converts the response with `response.json()` and handles errors with `try/catch/finally`.
- First request: city name → latitude and longitude. Second request: coordinates → current weather and 5-day forecast.

## How to test the Final features

1. **My trips:** add two trips. Reload the page: both trips are still there. Edit one, delete the other, then press **Clear all**.
2. **Validation:** try to save a trip with the same origin and destination, a return date before departure, or 15 travellers. An error message appears and nothing is saved.
3. **Dashboard:** the totals and budget bars change after every save, edit and delete.
4. **Plan → My trips:** fill in the Plan form correctly and press **Save this trip →**. The My trips form opens already filled in.
5. **Weather:** search `London` to see the forecast. Search a city that does not exist to see the empty state. Turn on Offline mode in DevTools → Network and search again to see the error state.
6. **Check weather:** on a saved trip, press **Check weather**. The Weather page opens with the destination filled in.
7. Open DevTools → Console: there are no errors during normal use.

## Pages

| Page | What it does |
|---|---|
| `index.html` | Home page. "Plan a … trip" cards open the Plan form with the purpose already chosen. |
| `pages/plan.html` | Trip form with JavaScript validation, a success summary and the Save this trip link. |
| `pages/routes.html` | Route table built from an array, with filters, sorting, a price slider and a shortlist. |
| `pages/timeline.html` | jQuery accordion itinerary, checklist with a progress bar, add and remove activities. |
| `pages/discover.html` | Place cards built from an array, category filter, live search and saved places. |
| `pages/about.html` | Contact form validation, character counter and jQuery FAQ accordion. |
| `pages/sitemap.html` | Links to all pages. |
| `pages/my-trips.html` | **Final:** saved trips, CRUD and budget dashboard. |
| `pages/weather.html` | **Final:** live weather from the Open-Meteo API. |

Every page has a dark/light theme switcher (saved in localStorage), a mobile menu (jQuery `slideToggle`) and a back-to-top button (jQuery `fadeIn`/`fadeOut` and `animate`).

## Project structure

```
index.html            Home page
pages/                plan, routes, timeline, discover, about, sitemap, my-trips, weather
css/                  One stylesheet per page
js/
  data/data.js        Arrays: routeOptions, places, tripPurposes, placeCategories
  core/main.js        Shared helpers, theme switcher, mobile menu, back-to-top
  core/validation.js  Reusable form validation functions
  core/trips.js       TripRecord class and localStorage functions
  pages/              One script per page
images/               Home, Plan and About images
```

## Course topics used in the project

- **Arrays and loops:** `data.js` arrays; `for`, `for...of`, `for...in`, `forEach`, `filter`, `find`.
- **Functions:** `formatPrice`, `isValidEmail`, `validateField`, `getVisibleRoutes`, `fetchJson` and others.
- **DOM:** `querySelector`, `createElement`, `appendChild`, `textContent`, `classList`, `dataset`, `style`. Tables, cards, lists, weather cards and budget bars are created with JavaScript.
- **Events:** `submit`, `click`, `input`, `change`, `keydown`, `DOMContentLoaded`; `event.preventDefault()`, `event.target` and event delegation.
- **Form validation:** the Plan, About and My trips forms are checked by our own code before saving.
- **jQuery 3.7.1:** selectors, traversal (`next`, `closest`, `find`, `siblings`), events (`.on`) and effects (`slideToggle`, `fadeIn`, `fadeOut`, `animate`).
- **Final topics:** API with `fetch` and `async`/`await`, JSON, OOP with a class, localStorage.

## Team contributions

| Member | Pages and files |
|---|---|
| **Gauhar** | Home, Plan, Sitemap — `index.html`, `css/index.css`, `pages/plan.html`, `css/plan.css`, `js/pages/plan.js`, `pages/sitemap.html`, `css/sitemap.css`, Home and Plan images. **Final:** `js/core/trips.js` (OOP + localStorage), `js/pages/my-trips.js` (CRUD + dashboard), README |
| **Beksultan** | Discover, Timeline — `pages/discover.html`, `css/discover.css`, `js/pages/discover.js`, `pages/timeline.html`, `css/timeline.css`, `js/pages/timeline.js`, `js/data/data.js`, `js/core/main.js`. **Final:** `pages/my-trips.html`, `css/my-trips.css` |
| **Nazar** | About, Routes — `pages/about.html`, `css/about.css`, `js/pages/contact.js`, `pages/routes.html`, `css/routes.css`, `js/pages/routes.js`, `js/core/validation.js`, About image. **Final:** `pages/weather.html`, `css/weather.css`, `js/pages/weather.js` (API) |

## Run locally

Open `index.html` in a browser or use the VS Code Live Server extension. An internet connection is needed for Bootstrap, jQuery and the weather API.

## Publish

GitHub Pages: Settings → Pages → Deploy from a branch → `main` / root.
