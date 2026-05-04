# QuakeStrike PH — Design Specification for Wireframe & Prototype
**Google Stitch Wireframe & Prototype Brief**

---

## Design Philosophy

QuakeStrike PH is a public-facing seismic monitoring and aftershock likelihood forecasting web application for the Philippines. The design must strike a balance between **scientific credibility** and **public accessibility** — it should feel trustworthy, modern, and easy to interpret even for non-expert users.

### Target Users
- **General public**: needs plain-language answers to what happened, where it happened, and what the aftershock likelihood means.
- **DRRM / LGU responders**: needs fast scanning of location, magnitude, depth, likelihood category, forecast status, and official-source reminders.
- **Researchers / technical reviewers**: needs coordinates, data source, model/preprocessing notes, confidence notes, and forecast history for audit and comparison.

### Core Usability Question
Every primary screen should answer: **What happened, where did it happen, and how likely are aftershocks within the next 24 hours?**

### Aesthetic Direction
- **Style**: Modern, data-forward, professional — inspired by emergency response dashboards and geospatial platforms. Think clean government-grade authority with a refined digital edge.
- **Tone**: Calm authority. The interface should reduce anxiety, not amplify it. Colors should convey clarity and confidence.
- **Inspiration**: Shadcn/ui component patterns — clean cards, precise borders, consistent radius, well-spaced typography, accessible form controls.
- **Each page must have its own unique wireframe layout** — no two pages share the same arrangement.

### Color Palette
| Role | Color | Hex |
|------|-------|-----|
| Primary Background | White | `#ffffff` |
| Primary Accent / Brand | Deep Blue | `#023e8a` |
| Text / High Contrast | Black | `#000000` |
| Secondary Text | Dark Gray | `#1e1e2e` |
| Subtle Background | Light Gray | `#f4f6f9` |
| Border | Gray | `#e2e8f0` |
| Likelihood — Low | Safe Green | `#16a34a` |
| Likelihood — Medium | Amber | `#d97706` |
| Likelihood — High | Alert Red | `#dc2626` |
| Muted Text | Slate Gray | `#64748b` |

### Typography Pairing
- **Display / Headings**: `DM Serif Display` — authoritative, editorial weight
- **Body / UI Labels**: `DM Sans` — clean, readable, modern
- **Data / Numbers**: `JetBrains Mono` — monospaced for earthquake values, coordinates, timestamps

### Component Style (Shadcn/ui-Inspired)
- Rounded corners: `border-radius: 8px` for cards, `4px` for inputs and badges
- Subtle drop shadows: `box-shadow: 0 1px 4px rgba(0,0,0,0.08)`
- Consistent 8pt spacing grid
- Dividers use `1px solid #e2e8f0`
- All interactive elements have visible hover and focus states
- Buttons use `#023e8a` fill with white text for primary actions; outlined white-bg for secondary

### Technology Stack
| Layer | Technology | Version |
|-------|------------|---------|
| Framework | Next.js (App Router) | 16.2.4 |
| UI Library | React | 19.2.4 |
| Language | TypeScript | ^5 |
| Styling | Tailwind CSS | v4 |
| Map Rendering | Leaflet.js (react-leaflet) | Latest |
| Fonts | Google Fonts (DM Serif Display, DM Sans, JetBrains Mono) | — |
| Data Source | PHIVOLCS Earthquake Catalog (web-scraped) | — |
| Deployment | Vercel (recommended) | — |

---

## Site Map

```
QuakeStrike PH
├── 1. Landing / Home Page
├── 2. Earthquake Event Dashboard (Map View)
├── 3. Earthquake Event List Page
├── 4. Event Detail Page (Single Earthquake)
├── 5. Aftershock Likelihood Forecast Page
├── 6. Forecast History Page
└── 7. About / System Information Page
```

### Next.js App Router Routes
| Page | Route Path | Type |
|------|------------|------|
| Landing / Home | `/` | Static |
| Earthquake Dashboard (Map) | `/dashboard` | Client-interactive |
| Earthquake Event List | `/events` | Server + Client |
| Event Detail | `/events/[id]` | Dynamic |
| Aftershock Forecast | `/events/[id]/forecast` | Dynamic |
| Forecast History | `/forecast-history` | Server + Client |
| About / System Info | `/about` | Static |

> **Note:** Pages 4 (Event Detail) and 5 (Forecast) are drill-down views accessed from other pages. They are **not** shown in the top navigation bar — only the 5 top-level routes appear as nav links.

---

## Page 1: Landing / Home Page

### Purpose
Introduce QuakeStrike PH to new visitors. Provide quick access to the dashboard and surface the most recent seismic events at a glance.

### Layout
- **Full-width hero section** spanning 100vw
- Two-column layout below the hero: left = recent events list, right = a small embedded static map preview
- Footer with disclaimer

### Wireframe Elements

#### Navigation Bar (Top, Sticky)
- **Left**: Plain `Home` text link
- **Center**: Navigation links — `Home`, `Dashboard`, `Event List`, `Forecast History`, `About`
  - Each link underlines on hover with `#023e8a` color
  - Active link is bold and underlined
- **Right**: `View Live Dashboard` — filled primary button (`#023e8a`, white text, 8px radius)
- Navbar has a `1px` bottom border `#e2e8f0` and white background with `backdrop-blur` on scroll

#### Hero Section
- **Background**: Deep blue `#023e8a` gradient with a subtle seismic waveform SVG pattern overlaid at 10% opacity (decorative)
- **Headline** (DM Serif Display, 48px, white): `"Know What Comes After."`
- **Subheadline** (DM Sans, 18px, white/80%): `"QuakeStrike PH monitors Philippine seismic activity and provides probability-based aftershock likelihood forecasts using PHIVOLCS earthquake data."`
- **CTA Buttons** (row, center-aligned):
  - Primary: `Go to Dashboard` — white background, `#023e8a` text → on hover: inverts to `#023e8a` background with white text
  - Secondary: `Learn How It Works` — outlined white border, white text → on hover: fills white background with `#023e8a` text. Navigates to About page
- **Disclaimer badge** below buttons (small pill-shaped, semi-transparent white bg): `"This is an academic prototype. Not an official PHIVOLCS product."`

#### Recent Activity Section (Below Hero)
- Section title: `"Recent Seismic Activity"` (DM Serif Display, 28px, `#000000`)
- **Left Column (60%)**: Recent Events Mini-List
  - Shows the 5 most recent earthquake events
  - Each row is a card with:
    - Magnitude badge (colored circle: green/amber/red based on magnitude)
    - Location name (bold, DM Sans)
    - Date & time (monospaced, muted gray)
    - Depth label (small badge)
    - Likelihood pill badge: `LOW` / `MEDIUM` / `HIGH` (colored accordingly)
  - `View All Events` link at the bottom → navigates to Event List Page
- **Right Column (40%)**: Static Map Preview Card
  - Card with `8px` radius, border `#e2e8f0`, shadow
  - Embedded mini-map showing the Philippines with recent event markers as colored dots
  - Overlay text: `"Live Map View"` with a pulsing dot indicator (CSS animation)
  - `Open Full Dashboard →` link in bottom-right of card → navigates to Dashboard

#### Footer
- Background: `#000000`
- Text: `#ffffff` / 70% opacity
- Left: Small section label `Seismic Monitoring`
- Center: Quick links (Home, Dashboard, About)
- Right: Disclaimer — `"Data sourced from PHIVOLCS. For academic use only. Not an official warning system."`
- Bottom bar: `"Developed by Armenta, Buergo, Candelaria, Pispis — Bicol University BSIT 2025"`

---

## Page 2: Earthquake Event Dashboard (Map View)

### Purpose
The primary interface. Displays real-time earthquake data on an interactive map with filters and a side panel for event summaries.

### Layout
- **Full-screen layout** — no scroll on initial load (viewport-filling)
- **Left Sidebar** (360px wide, fixed): Filter controls + event list cards
- **Right Area** (remainder, full height): Interactive map
- Navbar at top (same as all pages)

### Wireframe Elements

#### Left Sidebar

**Header**
- Title: `"Earthquake Events"` (DM Serif Display, 22px)
- Subtitle: `"Philippine Area of Responsibility"` (DM Sans, 12px, muted)
- Live indicator: green pulsing dot + `"Live"` label

**Filter Panel** (Shadcn/ui Accordion-style, collapsible)
- Section header: `"Filters"` with collapse chevron icon (toggles the panel open/closed)
- When open, shows:

  1. **Magnitude Range Slider** (dual-handle drag bar)
     - Label: `"Magnitude"` with current values displayed (e.g., `2.0 — 8.0`)
     - Dual-thumb range slider component
     - Track color: `#023e8a`; thumb: white circle with `#023e8a` border
     - Min: 0, Max: 9, step: 0.1
     - Values update live as thumbs are dragged
     - On release, filters the event list and map markers

  2. **Depth Range Slider** (dual-handle drag bar)
     - Label: `"Depth (km)"` with current values (e.g., `0 — 700`)
     - Same styling as magnitude slider
     - Min: 0, Max: 700, step: 1

  3. **Date Range Picker** (two date input fields)
     - Label: `"Date / Time Range"`
     - Two fields: `From` and `To`, each showing a calendar icon (clickable)
     - Clicking opens a calendar popover (Shadcn/ui Calendar-style)
     - Below inputs: Quick presets as pill buttons — `Last 24h` | `Last 7 days` | `Last 30 days`
       - Each is a small outlined pill; clicking it fills the date range automatically and turns it solid `#023e8a` to indicate active state

  4. **Likelihood Filter** (checkbox group)
     - Label: `"Aftershock Likelihood"`
     - Three checkboxes with colored labels:
       - ✅ `LOW` (green `#16a34a`)
       - ✅ `MEDIUM` (amber `#d97706`)
       - ✅ `HIGH` (red `#dc2626`)
     - Checking/unchecking filters both the list and map markers

  5. **Location Search** (text input)
     - Label: `"Location"`
     - Placeholder: `"Search province or region..."`
     - Has a search (magnifying glass) icon inside the input on the right
     - As user types, list below filters in real time (debounced)

  6. **Apply Filters Button**
     - Full-width, primary filled button: `"Apply Filters"` (`#023e8a`, white text)
     - Applies all filter selections at once
  
  7. **Reset Filters Link**
     - Inline below the button: `"Reset all filters"` (small, `#023e8a` colored text link)
     - Clicking it clears all filters and reloads the unfiltered view

**Event Cards List** (scrollable, below the filter panel)
- Scroll area fills remaining sidebar height
- Each card:
  - White background, `1px` border `#e2e8f0`, `8px` radius, subtle shadow
  - Hovering card highlights with `#023e8a` left border (4px) and light blue background tint
  - Clicking a card: highlights the card, pans/zooms the map to the event, and opens the detail panel on the map (or navigates to Event Detail Page)
  - Card contents:
    - **Top row**: Magnitude badge (circle, colored by intensity) + Location name (bold)
    - **Middle row**: Date/time (monospaced, muted) + Depth badge (small outlined pill)
    - **Bottom row**: Likelihood badge pill (`LOW` / `MEDIUM` / `HIGH`) + `"View Details →"` text link (right-aligned)
- **Load More Button** at bottom of list: `"Load More Events"` (outlined button, full-width)
- **Empty state**: If no events match filters — illustration of an empty seismograph + `"No events match your filters."` + `"Reset Filters"` link

#### Right Area: Interactive Map
- Full-height, full-width map (Leaflet.js or Mapbox-style)
- Map tiles: Clean light basemap (OpenStreetMap or CartoDB Positron)
- **Earthquake Markers**: Circular dots
  - Size scales with magnitude (larger = bigger dot)
  - Color by likelihood: green (LOW), amber (MEDIUM), red (HIGH)
  - Clicking a marker opens a **Map Popup** (tooltip card):
    - Location name
    - Magnitude + Depth
    - Date/time
    - Likelihood badge
    - `"View Full Details"` button → navigates to Event Detail Page
- **Map Controls** (top-right corner of map):
  - Zoom In (`+`) button
  - Zoom Out (`-`) button
  - `"Center on Philippines"` button (crosshair icon) — resets map view
  - All styled as white icon buttons with shadow, `8px` radius

---

## Page 3: Earthquake Event List Page

### Purpose
A dedicated, full-page searchable and sortable table/list of all earthquake events with filtering.

### Layout
- Standard page scroll layout
- Full-width header area
- Filter bar below header
- Data table / card grid below filters
- Pagination at bottom

### Wireframe Elements

#### Page Header
- Background: `#023e8a`
- Title: `"All Earthquake Events"` (DM Serif Display, 36px, white)
- Subtitle: `"Browse, search, and filter recorded seismic events within the Philippine Area of Responsibility."` (DM Sans, 16px, white/80%)
- Breadcrumb: `Home > Event List` (small, white/60%)

#### Search & Filter Bar (Sticky below navbar on scroll)
- White background, `1px` bottom border, light shadow
- **Search Input** (left, ~40% width):
  - Placeholder: `"Search by location, province, or region..."`
  - Magnifying glass icon inside input
  - Clears with an `✕` icon when text is present
- **Filter Dropdowns** (right side, inline row):
  - `Magnitude` dropdown (select: All, 1-2, 2-3, 3-4, 4-5, 5+, 6+, 7+)
  - `Depth` dropdown (select: All, Shallow <70km, Intermediate 70-300km, Deep >300km)
  - `Likelihood` dropdown (select: All, LOW, MEDIUM, HIGH)
  - `Date Range` picker (same as dashboard)
  - Each dropdown is a Shadcn/ui Select-style component: clean border, chevron icon, opens a popover list
- **Sort By** (far right): `"Sort by:"` label + dropdown — options: `Date (Newest)`, `Date (Oldest)`, `Magnitude (High-Low)`, `Magnitude (Low-High)`, `Likelihood`
- **Active Filter Tags** (row below the search bar):
  - Each applied filter shows as a removable tag pill: e.g., `Magnitude: 5+ ✕` | `Likelihood: HIGH ✕`
  - Tag pill: white bg, `#023e8a` text + border, `✕` icon removes that filter
  - `"Clear All"` link at the end of the tag row

#### Event Data Table
- White card container, full-width, `8px` radius, border
- Table header row: dark gray background `#1e1e2e`, white text, sticky on scroll
  - Columns: `#` | `Date & Time` | `Location` | `Magnitude` | `Depth` | `Likelihood` | `Actions`
  - Each column header is clickable to sort (shows ▲/▼ arrow icon when sorted)
- Table rows:
  - Alternating white / `#f4f6f9` row striping
  - Hover: left border highlight `#023e8a` (4px) + light tint
  - `Magnitude` cell: colored badge (circle dot + number, color by intensity)
  - `Depth` cell: plain text with `km` label in muted color
  - `Date & Time` cell: monospaced font (JetBrains Mono), format `YYYY-MM-DD HH:mm PHT`
  - `Location` cell: bold name, muted province/region below in smaller text
  - `Likelihood` cell: colored pill badge — `LOW` (green), `MEDIUM` (amber), `HIGH` (red)
  - `Actions` cell:
    - `"Details"` button — small outlined button → navigates to Event Detail Page
    - `"View on Map"` icon button (map pin icon) → opens Dashboard with that event highlighted

#### Pagination Bar
- Centered below the table
- Previous `‹` and Next `›` arrow buttons
- Page number buttons (e.g., `1 2 3 ... 10`) — current page is `#023e8a` filled circle
- `"Showing 1–20 of 847 events"` text (left-aligned, muted)
- `"Rows per page:"` selector (right-aligned): dropdown — `20`, `50`, `100`

---

## Page 4: Event Detail Page (Single Earthquake)

### Purpose
Detailed view of a single earthquake event, including event parameters, a localized map, and the aftershock likelihood forecast summary.

### Layout
- Two-column layout (60/40 split)
- Left: Event information + forecast summary
- Right: Localized event map + related events

### Wireframe Elements

#### Back Navigation
- `‹ Back to Event List` link (top-left, `#023e8a`, DM Sans)
- Breadcrumb: `Home > Event List > Event #XXXXX`

#### Event Header Card (Full-width, top)
- Background: `#023e8a`
- **Left**: Large magnitude display (DM Serif Display, 72px, white) — e.g., `M 6.6`
- **Center**: Location name (DM Serif Display, 28px, white) + region/province (muted white, 16px) + date/time (JetBrains Mono, 14px, white/70%)
- **Right**: Likelihood badge (large pill, color-coded: LOW/MEDIUM/HIGH) + `"Forecast Updated"` timestamp below it

#### Left Column — Event Parameters Card
- White card, border, `8px` radius
- Title: `"Event Parameters"` (DM Serif Display, 20px)
- Grid layout (2 columns) of labeled data pairs:
  - `Magnitude` → value (monospaced, large)
  - `Depth` → value with `km` unit
  - `Latitude` → decimal degrees (monospaced)
  - `Longitude` → decimal degrees (monospaced)
  - `Date & Time` → formatted timestamp (PHT)
  - `Event ID` → system identifier (monospaced, muted)
  - `Classification` → badge pill (e.g., `Tectonic`)
  - `Data Source` → `PHIVOLCS` with external link icon

#### Left Column — Aftershock Likelihood Summary Card
- White card, border, `8px` radius, subtle left border `4px` colored by likelihood level
- Title: `"Aftershock Likelihood Forecast"` (DM Serif Display, 20px)
- Subtitle: `"24-hour forecast window"` (muted, 13px)
- **Main percentage display** (center):
  - Large percentage number (DM Serif Display, 64px, colored by likelihood) — e.g., `78%`
  - Label below: `"Probability of at least one aftershock"` (DM Sans, 14px, muted)
- **Likelihood Level Badge**: Large pill — `HIGH` / `MEDIUM` / `LOW` with colored background
- **Divider**
- **Additional Outputs** (grid, 2-column):
  - `Estimated Distance Range` → e.g., `0 – 45 km from epicenter`
  - `Possible Max Aftershock Magnitude` → e.g., `Up to M 5.6`
- **Disclaimer block** (light gray bg, `8px` radius, small text):
  > "This is a probability-based estimate, not an exact earthquake prediction. Aftershocks may or may not occur. This system is an academic prototype and is not an official PHIVOLCS advisory."
- `"View Full Forecast History →"` link (bottom-right, `#023e8a`)

#### Right Column — Localized Event Map
- Card with `8px` radius, border
- Title: `"Event Location"` (DM Sans, 16px, bold)
- Embedded map centered on the event epicenter
- Single marker at epicenter (pulsing ring animation in CSS)
- Concentric circle overlays showing estimated aftershock distance ranges (translucent blue rings)
- Zoom controls (same style as Dashboard map)
- `"Open in Full Dashboard"` button (bottom of card, outlined)

#### Right Column — Related Events Card
- White card, border, `8px` radius
- Title: `"Nearby Events (±7 days, ±100 km)"` (DM Sans, 16px, bold)
- Compact event rows (similar to sidebar cards in Dashboard but smaller)
- Each row: Magnitude dot + Location + Date + Likelihood pill
- Clicking a row navigates to that event's detail page
- `"View all related events"` link at bottom

---

## Page 5: Aftershock Likelihood Forecast Page

### Purpose
A focused forecast page for a given earthquake event, showing the full aftershock likelihood output, visual probability indicators, and forecast metadata.

### Layout
- Single-column centered layout (max-width 900px, centered)
- Designed for focused reading — no sidebar

### Wireframe Elements

#### Page Header
- Centered
- Tag: `"Forecast Report"` (small uppercase label, `#023e8a`, DM Sans)
- Title: `"Aftershock Likelihood Forecast"` (DM Serif Display, 40px, black)
- Subtitle: Event name + magnitude + date (e.g., `"M 6.6 — Cataingan, Masbate — Aug 18, 2020"`)
- Forecast window label: `"24-Hour Forecast Window"` (badge pill, `#023e8a` bg, white text)

#### Forecast Summary Card (Top, full-width)
- White card, `8px` radius, border, shadow
- **Center column** (main probability):
  - Giant percentage (DM Serif Display, 96px) — e.g., `78%`
  - Colored by likelihood: green/amber/red
  - Label: `"Probability of ≥1 Aftershock Occurring"` (DM Sans, 16px, muted)
- **Likelihood Level Indicator** (below percentage):
  - Large pill badge: `HIGH LIKELIHOOD` / `MEDIUM LIKELIHOOD` / `LOW LIKELIHOOD`
  - Color-coded backgrounds

#### Visual Probability Gauge
- Horizontal progress bar (full-width, `12px` height, `6px` radius)
- Fill color transitions: `#16a34a` → `#d97706` → `#dc2626` (gradient from 0% to 100%)
- Current value marked with a white thumb/indicator with shadow
- Labels below: `0%` (left), `50%` (center), `100%` (right)
- Below bar: `"Current estimate: 78%"` (centered, monospaced)
- This bar is **read-only / display-only** (not interactive)

#### Forecast Detail Cards (Three cards in a row)
Each card: white bg, `8px` radius, border, shadow

1. **Card 1 — Aftershock Probability**
   - Icon: waveform icon
   - Label: `"At Least One Aftershock"`
   - Value: `78%`
   - Subtext: `"within 24 hours"`

2. **Card 2 — Estimated Distance Range**
   - Icon: circle/radius icon
   - Label: `"Estimated Epicentral Distance"`
   - Value: `0 – 45 km`
   - Subtext: `"from epicenter"`

3. **Card 3 — Max Expected Magnitude**
   - Icon: magnitude scale icon
   - Label: `"Possible Max Aftershock Magnitude"`
   - Value: `Up to M 5.6`
   - Subtext: `"within forecast window"`

#### Forecast Metadata Card
- Light gray background (`#f4f6f9`), `8px` radius, border
- Grid of metadata (2 columns):
  - `Model Used` → `Machine Learning (Random Forest / Gradient Boosting)`
  - `Preprocessing` → `Zaliapin Nearest-Neighbor Declustering`
  - `Data Source` → `PHIVOLCS Earthquake Catalog`
  - `Forecast Generated` → timestamp (monospaced)
  - `Forecast Window` → `24 Hours`
  - `Training Data Period` → e.g., `2010 – 2024 (Philippine PAR)`

#### Disclaimer Section
- Bordered box with amber left border (`#d97706`, 4px), light amber background
- Icon: ⚠️ warning triangle
- Bold label: `"Important Disclaimer"`
- Body text: `"This forecast is an academic prototype output. It is a probability estimate, not an exact earthquake prediction. Aftershocks may or may not occur. Do not use this as a sole basis for emergency decisions. Refer to official PHIVOLCS advisories for authoritative information."`

#### Navigation Buttons (Bottom)
- Row of two buttons:
  - `‹ Back to Event Details` (outlined, left)
  - `View Forecast History →` (primary filled `#023e8a`, right)

---

## Page 6: Forecast History Page

### Purpose
A log of all past aftershock likelihood forecasts, searchable and filterable. Allows users to track how forecasts were issued for past events.

### Layout
- Full-page scroll layout
- Filter bar at top
- Timeline-style list or table below

### Wireframe Elements

#### Page Header
- Background: `#023e8a`
- Title: `"Forecast History"` (DM Serif Display, 36px, white)
- Subtitle: `"Browse all previously generated aftershock likelihood forecasts."` (DM Sans, 16px, white/80%)

#### Filter & Search Bar
- White background bar, sticky on scroll, bottom border
- **Search input** (left): `"Search by location or event ID..."` + magnifying glass icon
- **Filters** (right, inline):
  - `Likelihood Level` dropdown: All / LOW / MEDIUM / HIGH
    - When selected, fills dropdown trigger with the matching color
  - `Date Range` picker (same calendar popover component)
  - `Magnitude` dropdown: All / 1-2 / 2-3 / 3-4 / 4-5 / 5+ / 6+ / 7+
- **Active filter tags** row below (removable pills, same as Event List Page)
- **Export Button** (far right of filter bar): `"Export CSV"` — outlined button with download icon
  - Clicking triggers a CSV download of the filtered forecast records

#### Forecast History Table
- White card, full-width, `8px` radius, border
- Sticky table header (dark `#1e1e2e` bg, white text)
- Columns: `Forecast ID` | `Event Date` | `Location` | `Magnitude` | `Likelihood Level` | `Probability` | `Max Magnitude` | `Distance Range` | `Generated At` | `Actions`
- Column headers: clickable to sort, show ▲/▼ icons
- Row behavior:
  - Alternating row striping (white / `#f4f6f9`)
  - Hover: left border highlight + light tint
  - `Likelihood Level` cell: colored pill badge
  - `Probability` cell: small inline bar behind the percentage value (like a mini progress bar inside the cell, colored by level)
  - `Actions` cell:
    - `"View Forecast"` small outlined button → navigates to Forecast Page for that event
    - `"View Event"` icon button (info icon) → navigates to Event Detail Page

#### Pagination
- Same pagination component as Event List Page
- `"Showing 1–20 of 312 forecasts"` (left)
- Page number buttons (center)
- Rows per page selector (right)

#### Responsive Table Behavior
- **Desktop (≥1280px)**: All 10 columns visible
- **Tablet (768px–1279px)**: Hide `Forecast ID`, `Distance Range`, `Generated At`; show 7 columns
- **Mobile (<768px)**: Collapse into card-based list — each forecast is a stacked card showing Location, Magnitude, Likelihood badge, Probability bar, and a `"View"` button

---

## Page 7: About / System Information Page

### Purpose
Explains what QuakeStrike PH is, how it works, who built it, and important disclaimers. Also surfaces key technical and academic context.

### Layout
- Single-column editorial layout (max-width 800px, centered)
- Section-by-section vertical scroll

### Wireframe Elements

#### Hero Section
- Background: `#023e8a`
- Eyebrow label: `Academic Prototype`
- Title: `"About QuakeStrike PH"` (DM Serif Display, 40px, white)
- Tagline: `"A web-based aftershock likelihood forecasting system using PHIVOLCS earthquake data."` (DM Sans, 18px, white/80%)

#### Section 1 — What Is QuakeStrike PH?
- Section label (uppercase, `#023e8a`, small): `"OVERVIEW"`
- Heading (DM Serif Display, 28px): `"What Is QuakeStrike PH?"`
- Body text (DM Sans, 16px, leading `1.7`): paragraph explaining the system purpose, the Philippine seismic context, and the gap it addresses (drawn from the background of the study).
- Inline callout box (light blue bg, left border `#023e8a`):
  > "QuakeStrike PH is an academic capstone prototype. It is not an official PHIVOLCS product and should not be used as the sole basis for emergency decisions."

#### Section 2 — How It Works
- Section label: `"METHODOLOGY"`
- Heading: `"How It Works"`
- **Three-step visual flow** (horizontal on desktop, vertical on mobile):
  - **Step 1**: `"Data Collection"` — icon (database) + description: PHIVOLCS earthquake catalog data is scraped every 15 minutes and stored in a database.
  - **Step 2**: `"Sequence Detection"` — icon (cluster/network) + description: Zaliapin nearest-neighbor declustering identifies historical mainshock-aftershock relationships.
  - **Step 3**: `"Likelihood Estimation"` — icon (graph/bar chart) + description: A machine learning model generates percentage-based aftershock likelihood outputs within 24 hours.
  - Each step: white card, `8px` radius, icon at top (`#023e8a` colored), title bold, body muted
  - Steps connected by arrow `→` between cards

#### Section 3 — Understanding the Likelihood Levels
- Section label: `"INTERPRETATION GUIDE"`
- Heading: `"Understanding Likelihood Levels"`
- Three cards in a row:
  - **LOW** — green pill badge, description: `"Lower probability of significant aftershock activity within 24 hours. Normal precautions advised."`
  - **MEDIUM** — amber pill badge, description: `"Moderate probability. Continued awareness and preparedness are recommended."`
  - **HIGH** — red pill badge, description: `"Higher probability of aftershock activity. Follow official PHIVOLCS advisories and local government guidelines."`

#### Section 4 — Data Source
- Section label: `"DATA"`
- Heading: `"Data Source"`
- Body: Explanation of PHIVOLCS as the primary data source; description of earthquake catalog fields used (date-time, latitude, longitude, depth, magnitude).
- Source badge: `"Philippine Institute of Volcanology and Seismology"` label + external link icon

#### Section 5 — The Team
- Section label: `"DEVELOPERS"`
- Heading: `"Development Team"`
- Four member cards (2×2 grid):
  - Each card: white bg, border, `8px` radius, avatar placeholder (circle), name (bold), role label (muted)
  - Members: Armenta, Sean Dylan L. | Buergo, Chenie Niña E. | Candelaria, John Benedict B. | Pispis, Dan Emanuel G.
  - Institution: `"Bicol University College of Science — Information Technology Department, Legazpi City"`
  - Adviser: `"Dr. Aris J. Ordoñez"` (content + programming adviser)

#### Section 6 — Disclaimer
- Dark background `#1e1e2e`, white text
- Warning icon (large, amber)
- Heading: `"Important Disclaimer"` (white, DM Serif Display, 24px)
- Body: Full disclaimer text — prototype status, not a PHIVOLCS product, not for emergency decisions, probability-based not deterministic, refer to official sources.
- Button: `"Visit PHIVOLCS Official Website"` (outlined white border, white text) → external link

---

## Global & Reusable Components

### 1. Navigation Bar
- Sticky, white bg, bottom `1px` border `#e2e8f0`
- Home link + nav links + CTA button
- Mobile: Hamburger menu (☰) that opens a slide-in drawer from the right
  - Drawer: white bg, full-height, links stacked vertically, close `✕` button

### 2. Likelihood Badge Pill
- Small rounded pill (`4px` radius, `6px 12px` padding)
- `LOW`: green bg `#16a34a`, white text
- `MEDIUM`: amber bg `#d97706`, white text
- `HIGH`: red bg `#dc2626`, white text
- Uppercase, DM Sans bold, 12px

### 3. Magnitude Badge
- Circular badge (24px diameter)
- Color by magnitude:
  - `< 3.0`: light gray
  - `3.0–4.9`: amber `#d97706`
  - `5.0–5.9`: orange `#ea580c`
  - `≥ 6.0`: red `#dc2626`
- White text (monospaced), centered

### 4. Range Slider (Dual-Handle)
- Dual-thumb slider with a colored fill track between thumbs
- Track: `#023e8a`; unfilled portions: `#e2e8f0`
- Thumbs: white circle, `#023e8a` border `2px`, shadow on hover
- Value tooltip appears above each thumb on drag (shows current value)
- Fully functional drag interaction

### 5. Date Range Picker
- Two text inputs (From / To) with calendar icon buttons
- Clicking either input or icon opens a floating popover calendar
- Calendar: month/year header with prev/next arrows, 7-column day grid
- Selected dates highlighted `#023e8a`; range between dates light blue tint
- Quick preset pills: `Last 24h`, `Last 7 days`, `Last 30 days`

### 6. Dropdown / Select
- Trigger: input-style box with label + chevron `▾` icon
- Opens: floating popover list with options
- Selected option shown in trigger with checkmark `✓`
- Multi-select variant: checkbox next to each option

### 7. Data Table
- Header: dark `#1e1e2e` bg, white text, sortable columns (click = sort, show arrow)
- Rows: alternating white/light gray, hover left-border highlight
- Pagination: prev/next arrows + page number buttons + rows per page

### 8. Map Popup (Tooltip)
- White card, `8px` radius, shadow
- Earthquake icon at top
- Event name bold, location muted
- Magnitude + Likelihood badge row
- `"View Details"` button (full-width, primary, small)

### 9. Empty State
- Centered in its container
- SVG illustration (seismograph flatline or empty map)
- Heading: context-specific (e.g., `"No events found"`)
- Subtext: helpful instruction
- Action button (optional)

### 10. Loading Skeleton
- Gray animated shimmer blocks replacing content while data loads
- Matches the shape of the content it replaces (card skeletons, table row skeletons)

### 11. Error / 404 Page
- Centered layout, max-width 600px
- **404 Not Found**:
  - SVG illustration: broken seismograph or disconnected map pin
  - Heading: `"Page Not Found"` (DM Serif Display, 36px)
  - Subtext: `"The page you're looking for doesn't exist or has been moved."` (DM Sans, 16px, muted)
  - Button: `"Go to Home"` (primary filled, `#023e8a`)
- **General Error**:
  - SVG illustration: warning triangle with waveform
  - Heading: `"Something Went Wrong"` (DM Serif Display, 36px)
  - Subtext: `"An unexpected error occurred. Please try again later."` (DM Sans, 16px, muted)
  - Button: `"Retry"` (primary) + `"Go to Home"` (outlined)

### 12. Toast / Notification
- Appears at top-right of viewport, slides in from right
- White card, `8px` radius, shadow, left border colored by type:
  - Success: `#16a34a` (green)
  - Error: `#dc2626` (red)
  - Info: `#023e8a` (blue)
- Auto-dismisses after 5 seconds; has `✕` close button
- Used for: CSV export confirmation, filter reset confirmation, data refresh notices

---

## Responsive Design Notes

- **Desktop** (≥1280px): All multi-column layouts as described above
- **Tablet** (768px–1279px): Sidebar collapses to a top filter bar; map goes full-width below
- **Mobile** (<768px): Single-column stack; map takes 50vh; filter panel opens as a bottom drawer sheet (swipe up)
- All touch targets ≥44px
- Map controls enlarged on mobile

---

## Accessibility (a11y) Requirements

This application must meet **WCAG 2.1 Level AA** standards as a public-facing, emergency-adjacent information tool.

### Color & Contrast
- All text must have a **minimum contrast ratio of 4.5:1** against its background (body text) or **3:1** (large text ≥18px bold / ≥24px regular)
- Likelihood badges (LOW/MEDIUM/HIGH) use white text on colored backgrounds — verify contrast for each:
  - `#16a34a` green on white text: ✓ passes (4.6:1)
  - `#d97706` amber on white text: ⚠ borderline (3.2:1) — use bold text or darken to `#b45309` for small text
  - `#dc2626` red on white text: ✓ passes (4.6:1)
- Never convey information by color alone — always pair with text labels (e.g., "HIGH" text inside the red pill, not just a red dot)

### Keyboard Navigation
- All interactive elements must be reachable and operable via keyboard (Tab, Enter, Space, Escape, Arrow keys)
- Focus indicators: `2px solid #023e8a` outline with `2px` offset on all focusable elements
- Map controls must have keyboard shortcuts (documented in a tooltip)
- Modal/drawer focus trapping: when the mobile nav drawer or filter bottom sheet is open, focus is trapped inside until closed

### Screen Readers & Semantic HTML
- Use semantic elements: `<nav>`, `<main>`, `<header>`, `<footer>`, `<section>`, `<article>`, `<table>`, `<thead>`, `<tbody>`
- All images and icons must have `alt` text or `aria-label`
- Likelihood badges: use `aria-label="Likelihood: HIGH"` (not just visual color)
- Map markers: provide `aria-label` with location name, magnitude, and likelihood
- Data tables: use `<th scope="col">` for column headers
- Loading skeletons: use `aria-busy="true"` and `aria-label="Loading content"`
- Page titles: each page sets a unique `<title>` via Next.js metadata

### Motion & Reduced Motion
- All CSS animations must respect `prefers-reduced-motion: reduce` — disable pulsing dots, fade transitions, and skeleton shimmer for users who prefer reduced motion
- Map marker pulse animation: replaced with a static ring when reduced motion is active

---

## Interaction & Motion Notes

- **Page transitions**: Fade-in (200ms) on route change
- **Card hover**: Smooth left-border slide-in (150ms transition)
- **Map markers**: Subtle scale pulse on new event added
- **Skeleton → content**: Fade transition (300ms)
- **Filter application**: List updates with a brief fade (200ms) rather than a full reload flash
- **Likelihood badge**: No animation — should feel calm and clinical, not alarming

---

## Prototype Interaction Requirements for Google Stitch

Each of the following must be **functioning interactive components** in the prototype:

1. **Filter Panel** — accordion opens/closes; all filter controls are interactive
2. **Dual-Handle Range Sliders** — draggable thumbs that update displayed values
3. **Date Range Picker** — calendar opens, dates selectable, presets functional
4. **Dropdown Selects** — open popover list, option selection updates trigger label
5. **Likelihood Checkboxes** — toggle and visually update
6. **Event Cards** — clickable, trigger navigation to Event Detail Page
7. **Map Markers** — clickable, open popup card (prototype: simulate with click overlay)
8. **Table Sort** — clicking column headers reorders rows and toggles ▲/▼ icon
9. **Pagination** — page buttons functional, next/prev arrows active
10. **Navigation Bar Links** — route between all 7 pages
11. **CTA Buttons** — navigate to the correct target page
12. **Removable Filter Tags** — `✕` removes the tag and updates filter state
13. **Export CSV Button** — shows a success toast/notification (`"Export started..."`)
14. **"Load More" Button** — appends additional event cards to the list

---

## Usability Review Checklist

Use this checklist before presentation or release:

- **Forecast comprehension**: A non-technical user can identify the probability, Low/Medium/High category, 24-hour window, distance range, possible max magnitude, and uncertainty note without reading methodology first.
- **Earthquake discovery**: Users can find an event by location, date, time, magnitude, depth, or likelihood category from the dashboard or event list.
- **Likelihood recognition**: Low, Medium, and High use consistent text labels plus color across markers, cards, tables, badges, and legends.
- **Probability language**: Forecast text uses probability, likelihood, estimate, and may/may not language; it does not say that an aftershock will definitely happen.
- **Map/list synchronization**: Selecting a marker or event card highlights the same event and opens the selected-event detail panel.
- **Filters**: Date, time, magnitude, depth, location, likelihood, apply, reset, removable tags, and pagination/load-more controls are visible and reversible.
- **Mobile usability**: On small screens, filters move into a bottom sheet, event cards remain tappable, and the key fields remain visible before secondary metadata.
- **Accessibility**: Text contrast is checked, controls have labels, tables use column headers, focus styles are visible, and animations respect reduced-motion settings.
- **Source and disclaimer**: PHIVOLCS source links and academic-prototype disclaimers appear on the home, event detail, forecast, and methodology screens.

### Browser QA Notes

- Desktop target: 1366px wide or larger, dashboard sidebar plus map visible.
- Android-style target: 390px by 844px viewport, mobile navigation and dashboard filter bottom sheet usable.
- Verify `/`, `/dashboard`, `/events`, `/events/eq-001`, `/events/eq-001/forecast`, `/forecast-history`, `/about`, 404, and error fallback styling.

---

*End of QuakeStrike PH Design Specification*
*Prepared for Google Stitch wireframe and prototype input.*
*Bicol University College of Science — BSIT Capstone Project 2025*
*Technology: Next.js 16.2.4 · React 19.2.4 · TypeScript · Tailwind CSS v4*


