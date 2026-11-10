"use strict";
// All places, floor plans, distances and route instructions are illustrative.
const paths = {
  home: "m3 10 9-7 9 7v10H3Z M9 20v-7h6v7",
  search: "M21 21l-5-5 M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
  pin: "M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z M15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0",
  arrow: "M5 12h14 m-6-6 6 6-6 6",
  back: "M19 12H5 m6-6-6 6 6 6",
  chevron: "m9 5 7 7-7 7",
  building: "M4 21V4h12v17 M16 10h5v11H2 M8 8h4 M8 12h4 M8 16h4 M8 21v-2h4v2",
  book: "M3 4h7l2 2 2-2h7v16h-7l-2 2-2-2H3Z M12 6v16",
  bike: "M9 16a4 4 0 1 1-8 0 4 4 0 0 1 8 0 M23 16a4 4 0 1 1-8 0 4 4 0 0 1 8 0 M5 16l5-9 9 9-6-13h4 M8 7h5",
  access:
    "M14 3a2 2 0 1 1-4 0 2 2 0 0 1 4 0 M12 7v6h6l3 7 M12 9H7 M8 11a6 6 0 1 0 8 8",
  walk: "M15 3a2 2 0 1 1-4 0 2 2 0 0 1 4 0 M10 7l4 1 2 5h4 M10 7l-3 6H4 M12 9l-2 7-5 5 M10 16l5 1 1 5",
  saved: "M6 3h12v19l-6-4-6 4Z",
  user: "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0 M4 22v-3a8 8 0 0 1 16 0v3",
  compass: "m21 3-6 12-12 6L9 9Z M9 9l6 6",
  clock: "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0 M12 7v5l3 2",
  close: "m6 6 12 12 M6 18 18 6",
  check: "m5 12 4 4L19 6",
  lift: "M5 2h14v20H5Z M9 8l3-3 3 3 M9 16l3 3 3-3",
  stairs: "M3 20h5v-5h5v-5h5V5h4",
  turn: "M6 21V10a3 3 0 0 1 3-3h11 M15 2l5 5-5 5",
  trash: "M3 6h18 M9 6V3h6v3 M6 6l1 15h10l1-15 M10 10v7 M14 10v7",
  flag: "M5 22V3l7-1 7 3v10l-7-3-7 1",
};
const icon = (n) =>
  `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[n] || paths.pin}"/></svg>`;
const places = [
  {
    id: "library",
    name: "James Joyce Library",
    building: "James Joyce Library",
    floor: "Ground floor",
    category: "Library",
    icon: "book",
    note: "Study spaces & library facilities",
    keys: "library books study",
  },
  {
    id: "newman",
    name: "Newman Building",
    building: "Newman Building",
    floor: "Ground floor",
    category: "Building",
    icon: "building",
    note: "Arts & humanities",
    keys: "newman arts humanities",
  },
  {
    id: "science",
    name: "O’Brien Centre for Science",
    building: "O’Brien Centre for Science",
    floor: "Ground floor",
    category: "Building",
    icon: "building",
    note: "Science & learning spaces",
    keys: "science obrien o brien",
  },
  {
    id: "student",
    name: "Student Centre",
    building: "Student Centre",
    floor: "Ground floor",
    category: "Facility",
    icon: "building",
    note: "A place to meet & unwind",
    keys: "student centre gym facilities",
  },
  {
    id: "a105",
    name: "Room A105",
    building: "Newman Building",
    floor: "First floor",
    category: "Classroom",
    icon: "book",
    note: "Demonstration classroom",
    keys: "a105 classroom lecture ux design module",
  },
  {
    id: "b201",
    name: "Room B201",
    building: "O’Brien Centre for Science",
    floor: "Second floor",
    category: "Classroom",
    icon: "book",
    note: "Demonstration classroom",
    keys: "b201 classroom science biology module",
  },
  {
    id: "parking",
    name: "Science bicycle parking",
    building: "O’Brien Centre for Science",
    floor: "Outside",
    category: "Bicycle parking",
    icon: "bike",
    note: "Demonstration parking location",
    keys: "bicycle bike cycle parking",
  },
  {
    id: "access",
    name: "Step-free entrance",
    building: "Newman Building",
    floor: "Ground floor",
    category: "Accessible facility",
    icon: "access",
    note: "Demonstration entrance & lift",
    keys: "accessible facilities ramp lift entrance wheelchair",
  },
];
const modes = {
  walking: {
    name: "Walking",
    icon: "walk",
    desc: "Standard pedestrian directions around campus.",
    time: "7 min",
    distance: "450 m",
  },
  stepfree: {
    name: "Step-free",
    icon: "access",
    desc: "Routes avoiding stairs, using suitable entrances, lifts and ramps.",
    time: "9 min",
    distance: "520 m",
  },
  cycling: {
    name: "Cycling",
    icon: "bike",
    desc: "Find bicycle parking and continue walking to your destination.",
    time: "5 min",
    distance: "600 m",
  },
};
const read = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};
const storedSettings = read("navigate-settings", {});
const state = {
  screen: "login",
  demoUser: null,
  history: [],
  destination: "a105",
  mode: "walking",
  floor: 1,
  step: 0,
  outdoor: 0,
  query: "",
  filter: "All",
  saved: read("navigate-saved", ["a105", "library", "parking"]),
  recent: read("navigate-recent", []),
  settings: {
    preferred: "walking",
    avoid: false,
    stepfree: false,
    minimise: false,
    contrast: false,
    large: false,
    labels: false,
    written: true,
    audio: false,
    ...storedSettings,
  },
};
state.mode = state.settings.preferred;
const main = document.querySelector("#main");
const escape = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const dest = () => places.find((p) => p.id === state.destination) || places[4];
const persist = () => {
  try {
    localStorage.setItem("navigate-saved", JSON.stringify(state.saved));
    localStorage.setItem("navigate-settings", JSON.stringify(state.settings));
    localStorage.setItem("navigate-recent", JSON.stringify(state.recent));
  } catch {
    toast("Storage is unavailable. Changes last for this session.");
  }
};
function toast(message) {
  const el = document.querySelector("#toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove("show"), 2600);
}
function go(screen) {
  state.history.push(state.screen);
  state.screen = screen;
  render();
  main.scrollTop = 0;
  main.focus();
}
function back() {
  state.screen = state.history.pop() || "home";
  render();
  main.scrollTop = 0;
  main.focus();
}
function openPlace(id) {
  state.destination = id;
  state.recent = [id, ...state.recent.filter((x) => x !== id)].slice(0, 4);
  persist();
  go("details");
}
const button = (label, action, kind = "primary", ico = "") =>
  `<button class="${kind}" data-action="${action}">${ico ? icon(ico) : ""}${label}</button>`;
const disclaimer =
  '<p class="prototype">Interactive prototype · Illustrative locations and routes.<br>Not for real-world navigation.</p>';
function row(p) {
  return `<button class="place" data-place="${p.id}"><span class="place-icon">${icon(p.icon)}</span><span class="place-copy"><strong>${escape(p.name)}</strong><small>${escape(p.category === "Classroom" ? p.building + " · " + p.floor : p.note)}</small></span>${icon("chevron")}</button>`;
}
function campusMap(route = false) {
  const endpoints = {
    library: [211, 180],
    newman: [136, 244],
    science: [210, 55],
    student: [43, 119],
    a105: [136, 244],
    b201: [210, 55],
    parking: [244, 81],
    access: [136, 224],
  };
  const [tx, ty] = endpoints[dest().id];
  const waypoint =
    state.mode === "cycling"
      ? `${244} ${81} 245 ${ty}`
      : state.mode === "stepfree"
        ? `163 ${ty} ${tx - 15} ${ty}`
        : `163 ${ty}`;
  const routePath = `M88 190 89 143 163 140 ${waypoint} ${tx} ${ty}`;
  const points = routePath.match(/-?\d+(?:\.\d+)?/g).map(Number);
  const vertices = [];
  for (let i = 0; i < points.length; i += 2) vertices.push([points[i], points[i + 1]]);
  const progress = state.screen === "outdoor" ? state.outdoor / (routeInstructions().length - 1) : 0;
  const position = pointAlong(vertices, progress);
  return `<svg class="map" viewBox="0 0 350 285" role="img" aria-label="Illustrative campus map${route ? ", with " + modes[state.mode].name + " route" : ""}"><rect width="350" height="285" fill="#e9efdf"/><path d="M-10 65Q100 25 155 72T370 60 M-10 230Q80 175 170 220T370 190 M78-10 90 300 M264-10 248 300" fill="none" stroke="#fff" stroke-width="15"/><path d="M0 145 350 133 M160 0 164 285" stroke="#f9faf5" stroke-width="7"/><path d="M-10 65Q100 25 155 72T370 60 M78-10 90 300 M264-10 248 300" fill="none" stroke="#d5dfcb" stroke-width="1"/><ellipse cx="206" cy="116" rx="29" ry="23" fill="#c1dce0"/><path d="m15 100 45-3 3 32-45 4Z M108 95h39v31h-39Z M184 24h52v30h-52Z M277 95h49v47h-49Z M110 167h40v27h-40Z M185 160h53v40h-53Z M276 224h52v30h-52Z M20 251h40v28H20Z" fill="#d0dbc7" stroke="#b5c4ab"/><path d="M112 224h48v41h-48Z" fill="#c1d1bc" stroke="#9daf98"/><g fill="#52654f" font-family="Arial,sans-serif" font-size="9"><text x="177" y="17">Science Centre</text><text x="17" y="91">Student Centre</text><text x="182" y="214">James Joyce Library</text><text x="103" y="278">Newman Building</text><text x="192" y="119" font-size="8">The lake</text><text x="277" y="159">Belfield</text></g><g fill="#abc49e"><circle cx="29" cy="179" r="15"/><circle cx="48" cy="188" r="12"/><circle cx="301" cy="30" r="17"/><circle cx="325" cy="43" r="11"/><circle cx="215" cy="253" r="13"/></g>${route ? `<path d="${routePath}" stroke="white" stroke-width="10" fill="none"/><path d="${routePath}" stroke="${state.mode === "cycling" ? "#314f87" : "#246B55"}" stroke-width="5" fill="none" ${state.mode === "stepfree" ? 'stroke-dasharray="7 5"' : ""}/><circle cx="${tx}" cy="${ty}" r="10" fill="#123D35"/><text x="${tx}" y="${ty + 4}" text-anchor="middle" fill="white" font-size="12">✓</text><rect x="231" y="72" width="22" height="19" rx="5" fill="white"/><text x="235" y="85" font-size="12" fill="#123D35">P</text>${state.mode === "stepfree" ? `<rect x="${tx - 30}" y="${ty - 10}" width="19" height="19" rx="4" fill="#fff"/><text x="${tx - 27}" y="${ty + 4}" font-size="13">♿</text>` : ""}` : ""}<g data-position="${position.join(',')}" transform="translate(${position[0]-88} ${position[1]-190})"><circle cx="88" cy="190" r="17" fill="#246B55" opacity=".12"/><circle cx="88" cy="190" r="7" fill="#246B55" stroke="white" stroke-width="3"/></g><rect x="10" y="260" width="140" height="20" rx="7" fill="white"/><text x="17" y="273" font-size="9" fill="#123D35">You · ${state.screen === "outdoor" ? "simulated step " + (state.outdoor+1) : "demo location"}</text></svg>`;
}
function home() {
  return `<div class="page"><div class="eyeline"><i></i> BELFIELD CAMPUS</div><h1>Where would you<br>like to go?</h1><p class="intro">Find classrooms, buildings and facilities across UCD.</p><button class="searchbox" data-action="search">${icon("search")}<span>Search classroom, building or location...</span></button><div class="section-heading"><h2>Recent destinations</h2><button class="text-button" data-action="search">View all</button></div>${places.slice(0, 4).map(row).join("")}<div class="section-heading"><h2>Your campus, at a glance</h2><span class="muted">Belfield</span></div><div class="map-card">${campusMap()}<span class="map-tag">CAMPUS PREVIEW</span><button class="map-link" data-action="explore">Explore campus map ${icon("arrow")}</button></div><div class="section-heading"><h2>A quicker way to find</h2></div><div class="shortcuts">${[
    ["book", "Classrooms", "Classroom"],
    ["building", "Buildings", "Building"],
    ["bike", "Bicycle parking", "Bicycle parking"],
    ["access", "Accessible facilities", "Accessible facility"],
  ]
    .map(
      ([i, n, f]) =>
        `<button class="shortcut" data-filter="${f}"><span class="place-icon">${icon(i)}</span>${n}</button>`,
    )
    .join("")}</div>${disclaimer}</div>`;
}
function searchResults() {
  const q = state.query.toLowerCase().replace(/['’]/g, "");
  return places.filter(
    (p) =>
      (state.filter === "All" || p.category === state.filter) &&
      `${p.name} ${p.building} ${p.category} ${p.keys}`
        .toLowerCase()
        .replace(/['’]/g, "")
        .includes(q),
  );
}
function resultList() {
  const results = searchResults();
  return `<div class="section-heading"><h2>${state.query ? "Matching destinations" : "Suggested destinations"}</h2><span class="muted">${results.length} found</span></div>${results.length ? results.map(row).join("") : '<div class="empty"><h3>No destinations found</h3><p class="muted">Try “A105”, “science”, “UX design” or “library”.</p></div>'}`;
}
function search() {
  return `<div class="page"><label class="searchbox">${icon("search")}<input id="search" aria-label="Search classroom, building, module or facility" placeholder="Search classroom, building or location..." value="${escape(state.query)}" autocomplete="off"></label><div class="chips">${["All", "Classroom", "Building", "Bicycle parking", "Accessible facility"].map((f) => `<button class="chip ${state.filter === f ? "active" : ""}" data-search-filter="${f}" aria-pressed="${state.filter === f}">${f === "All" ? "All places" : f}</button>`).join("")}</div>${
    state.recent.length
      ? `<h2>Recent searches</h2><div class="chips">${state.recent
          .map((id) => {
            const p = places.find((x) => x.id === id);
            return p
              ? `<button class="chip" data-place="${id}">${p.name}</button>`
              : "";
          })
          .join("")}</div>`
      : ""
  }<div id="results" aria-live="polite">${resultList()}</div>${disclaimer}</div>`;
}
function details() {
  const p = dest();
  return `<div class="page"><div class="details-hero">${icon(p.icon)}<div class="eyeline">${p.category} · DEMONSTRATION</div><h1>${p.name}</h1><p class="muted">${p.building}</p><span class="badge">${icon("building")}${p.floor}</span></div><div class="map-card">${campusMap()}</div><div class="section-heading"><h2>Access at a glance</h2>${icon("access")}</div><p class="muted">Example features: step-free entrance, lift access and ramp. Review the route for your individual requirements.</p><div class="notice">Room locations, floor plans and accessibility facilities are demonstration data and have not been verified by UCD.</div>${button("Get Directions", "preferences", "primary", "arrow")}${button(state.saved.includes(p.id) ? "Remove from saved" : "Save destination", "save", "secondary", "saved")}${disclaimer}</div>`;
}
function preferences() {
  return `<div class="page"><div class="eyeline">YOUR JOURNEY, YOUR CHOICE</div><h1>How would you<br>like to travel?</h1><p class="intro">To ${dest().name}</p><div role="radiogroup" aria-label="Travel mode">${Object.entries(
    modes,
  )
    .map(
      ([key, m]) =>
        `<button role="radio" aria-checked="${state.mode === key}" class="mode ${state.mode === key ? "selected" : ""}" data-mode="${key}"><span class="place-icon">${icon(m.icon)}</span><span class="mode-copy"><h3>${m.name}</h3><p>${m.desc}</p></span><span class="radio"></span></button>`,
    )
    .join(
      "",
    )}</div>${state.mode === "stepfree" ? '<div class="notice">Example route uses a ramp and lift, avoiding stairs. Gradients, door widths and lift availability are unverified. Review suitability before travelling.</div>' : state.mode === "cycling" ? '<div class="notice">Cycle to the demonstration bicycle parking, park your bike, then continue on foot. Indoor guidance is walking only.</div>' : '<p class="muted">A straightforward route, with indoor guidance when you arrive.</p>'}${button("View Route", "route", "primary", "arrow")}${disclaimer}</div>`;
}
function routeInstructions() {
  const p = dest();
  return state.mode === "cycling"
    ? [
        "Cycle along the illustrated campus path.",
        "Park at Science bicycle parking.",
        "Continue on foot to " + p.building + ".",
        "Enter the building for indoor guidance.",
      ]
    : state.mode === "stepfree"
      ? [
          "Follow the dashed step-free path.",
          "Use the illustrated ramp at the accessible entrance.",
          "Enter " + p.building + " and locate the lift.",
          "Take the lift to " + p.floor.toLowerCase() + ".",
        ]
      : [
          "Follow the campus path towards " + p.building + ".",
          "Continue towards the building entrance.",
          "Enter the building and follow the indoor signs.",
        ];
}
function route() {
  const m = { ...modes[state.mode] };
  if (state.settings.minimise) {
    m.time =
      state.mode === "stepfree"
        ? "8 min"
        : state.mode === "cycling"
          ? "4 min"
          : "6 min";
    m.distance =
      state.mode === "stepfree"
        ? "480 m"
        : state.mode === "cycling"
          ? "550 m"
          : "400 m";
  }
  return `<div class="route-map">${campusMap(true)}<span class="map-tag">ILLUSTRATIVE ROUTE</span></div><div class="route-panel"><span class="badge">${icon(m.icon)}${m.name}${state.settings.minimise ? " · Shorter route preference" : ""}</span><h1>${m.time} <span class="muted">· ${m.distance}</span></h1><h3>${dest().name}</h3><p class="muted">${state.mode === "cycling" ? "Includes bicycle parking + final walk" : "From your demonstration location"}</p><div class="instruction">${icon(state.mode === "cycling" ? "bike" : "arrow")}<div><h3>${state.mode === "cycling" ? "Ride, park, then walk" : "Your next step"}</h3><p>${routeInstructions()[0]}</p></div></div>${button("Start Navigation", "outdoor", "primary", "compass")}<div class="button-row">${button("Change Route", "preferences", "secondary")}${button("Route Details", "route-details", "secondary")}</div><div class="legend"><span>${icon(m.icon)} ${state.mode === "stepfree" ? "Dashed line · step-free" : state.mode === "cycling" ? "Blue line · cycle + walk" : "Solid line · walking"}</span><span>P · Bicycle parking</span></div>${disclaimer}</div>`;
}
function outdoor() {
  const instructions = routeInstructions();
  return `<div class="route-map">${campusMap(true)}<span class="map-tag">SIMULATED OUTDOOR NAVIGATION</span></div><div class="route-panel"><span class="badge">${icon(modes[state.mode].icon)}${modes[state.mode].name} · Step ${state.outdoor + 1} of ${instructions.length}</span><h2>${dest().name}</h2><div class="instruction">${icon(state.mode === "cycling" && state.outdoor === 1 ? "bike" : "turn")}<div><h3>${state.mode === "cycling" && state.outdoor === 1 ? "Park your bicycle" : "Follow the campus path"}</h3><p>${instructions[state.outdoor]}</p></div></div><div class="button-row">${state.outdoor ? button("Previous", "outdoor-prev", "secondary") : ""}${button(state.outdoor === instructions.length - 1 ? (dest().category === "Classroom" || dest().category === "Building" ? "Enter building" : "Finish journey") : "Next instruction", "outdoor-next")}</div>${button("Exit navigation", "exit", "secondary")}${disclaimer}</div>`;
}
function indoorSteps() {
  return state.mode === "stepfree"
    ? [
        "Enter through the illustrated accessible entrance.",
        "Follow the corridor to the lift.",
        "Take the lift to " + dest().floor.toLowerCase() + ".",
        "Turn right at the corridor junction.",
        "Your destination is " + dest().name + ".",
      ]
    : [
        "Continue straight. Follow the corridor towards the lecture rooms.",
        "Use the stairs to " + dest().floor.toLowerCase() + ".",
        "Turn right at the corridor junction.",
        "Your destination is " + dest().name + ".",
      ];
}
function pointAlong(vertices, progress) {
  const lengths = vertices.slice(1).map((point, i) => Math.hypot(point[0]-vertices[i][0], point[1]-vertices[i][1]));
  let remaining = lengths.reduce((sum, length) => sum + length, 0) * progress;
  for (let i=0;i<lengths.length;i++) {
    if (remaining <= lengths[i]) {
      const t = lengths[i] ? remaining / lengths[i] : 0;
      return vertices[i].map((value, axis) => +(value + (vertices[i+1][axis]-value)*t).toFixed(1));
    }
    remaining -= lengths[i];
  }
  return vertices[vertices.length-1];
}
function floorPlan() {
  const positions = state.mode === "stepfree" ? [[167,200],[70,135],[45,135],[205,135],[247,92]] : [[167,200],[278,135],[205,135],[247,92]];
  const position = positions[state.step];
  const prefix = ["G", "A", "B"][state.floor],
    isTarget =
      state.floor ===
      (dest().floor === "Second floor"
        ? 2
        : dest().floor === "Ground floor"
          ? 0
          : 1);
  return `<svg class="floorplan" viewBox="0 0 330 250" role="img" aria-label="Demonstration ${["ground", "first", "second"][state.floor]} floor plan showing classrooms, lift, stairs, entrance and ${isTarget ? "destination" : "route continuation"}"><rect x="16" y="20" width="298" height="207" rx="5" fill="white" stroke="#a7b6a8" stroke-width="2"/><path d="M30 113h270v43H30Z M147 35h40v177h-40Z" fill="#edf2e9"/><g fill="#e4eade" stroke="#bcc9b8"><path d="M30 35h105v68H30Z M199 35h101v68H199Z M30 168h105v45H30Z M199 168h101v45H199Z"/></g><g font-family="Arial" font-size="12" fill="#52624e" text-anchor="middle"><text x="80" y="73">${prefix}101</text><text x="248" y="73">${prefix}105</text><text x="80" y="194">${prefix}102</text><text x="248" y="194">${prefix}106</text></g><g stroke="#fff" stroke-width="7"><path d="M80 103h17 M240 103h17 M80 168h17 M240 168h17"/></g><rect x="23" y="119" width="44" height="31" rx="5" fill="#d4e7d8"/><text x="30" y="139" font-size="11" fill="#123d35">Lift ↕</text><rect x="251" y="119" width="54" height="31" rx="5" fill="#e2e5df"/><text x="255" y="139" font-size="10" fill="#39473b">Stairs ${state.mode === "stepfree" ? "×" : "↗"}</text><path d="M167 225 167 135 ${state.mode === "stepfree" && state.step < 3 ? "45 135" : "247 135 247 92"}" fill="none" stroke="white" stroke-width="9"/><path d="M167 225 167 135 ${state.mode === "stepfree" && state.step < 3 ? "45 135" : "247 135 247 92"}" fill="none" stroke="#246B55" stroke-width="5" ${state.mode === "stepfree" ? 'stroke-dasharray="6 4"' : ""}/><circle data-position="${position.join(',')}" cx="${position[0]}" cy="${position[1]}" r="7" fill="#246B55" stroke="white" stroke-width="3"/>${isTarget ? '<circle cx="247" cy="90" r="10" fill="#123D35"/><text x="243" y="94" font-size="12" fill="white">✓</text>' : '<text x="201" y="239" font-size="9" fill="#39473b">Destination on another floor</text>'}<text x="20" y="239" font-size="9" fill="#123d35">${state.floor === 0 ? "Accessible entrance · ramp" : "Lift arrival / stairwell"}</text></svg>`;
}
function indoor() {
  const steps = indoorSteps();
  return `<div class="page"><span class="badge">${icon(state.mode === "stepfree" ? "access" : "walk")}${state.mode === "stepfree" ? "Step-free route" : "Indoor walking route"}</span><h1 style="margin-top:14px">A little closer.</h1><p class="muted">${dest().building} · ${dest().name}</p><div class="chips" role="group" aria-label="View floor">${["Ground Floor", "First Floor", "Second Floor"].map((f, i) => `<button class="chip ${state.floor === i ? "active" : ""}" data-floor="${i}" aria-pressed="${state.floor === i}">${f}</button>`).join("")}</div>${floorPlan()}<p class="simulation-caption">Simulated movement · Map updates with each instruction</p><div class="legend"><span>${icon("lift")} Lift</span><span>${icon("stairs")} ${state.mode === "stepfree" ? "Stairs · excluded" : "Stairs"}</span><span>${icon("pin")} ${["Ground", "First", "Second"][state.floor]} floor</span></div><div class="instruction" aria-live="polite">${icon(state.step === steps.length - 1 ? "flag" : state.mode === "stepfree" && state.step === 2 ? "lift" : "turn")}<div><span class="muted">Step ${state.step + 1} of ${steps.length}</span><h3 style="margin-top:5px">${state.step === steps.length - 1 ? "You have arrived" : steps[state.step].startsWith("Take the lift") || steps[state.step].startsWith("Use the stairs") ? "Change floors" : "Your next direction"}</h3><p>${steps[state.step]}</p></div></div><div class="button-row">${state.step ? button("Previous", "prev", "secondary") : ""}${button(state.step === steps.length - 1 ? "Finish journey" : "Next instruction", state.step === steps.length - 1 ? "finish" : "next")}</div>${button("Exit navigation", "exit", "secondary")}${disclaimer}</div>`;
}
function saved() {
  return `<div class="page"><div class="eyeline">FAMILIAR PLACES, ONE TAP AWAY</div><h1>Your saved places</h1><p class="intro">Less searching. More getting there.</p>${
    state.saved.length
      ? state.saved
          .map((id) => {
            const p = places.find((x) => x.id === id);
            return p
              ? `<div class="save-row">${row(p)}<button class="remove" data-remove="${p.id}" aria-label="Remove ${escape(p.name)} from saved">${icon("trash")}</button></div>`
              : "";
          })
          .join("")
      : '<div class="empty">' +
        icon("saved") +
        '<h3>No saved places yet</h3><p class="muted">Find a destination and tap “Save destination”.</p></div>'
  }${button("Find a place to save", "search", "secondary", "search")}${disclaimer}</div>`;
}
function explore() {
  return `<div class="page"><div class="eyeline">A CAMPUS FULL OF POSSIBILITIES</div><h1>Explore Belfield</h1><p class="intro">Find your next stop around campus.</p><div class="map-card wide-map">${campusMap()}<span class="map-tag">ILLUSTRATIVE CAMPUS MAP</span></div><div class="chips">${["All", "Building", "Bicycle parking", "Accessible facility"].map((f) => `<button class="chip ${state.filter === f ? "active" : ""}" data-explore-filter="${f}" aria-pressed="${state.filter === f}">${f === "All" ? "All places" : f}</button>`).join("")}</div>${places
    .filter((p) => state.filter === "All" || p.category === state.filter)
    .map(row)
    .join("")}${disclaimer}</div>`;
}
const toggle = (key, label) =>
  `<label class="setting"><span>${label}</span><input type="checkbox" data-setting="${key}" ${state.settings[key] ? "checked" : ""}></label>`;
function accountScreen(signup = false) {
  return `<div class="page account-page"><span class="place-icon account-logo">${icon("compass")}</span><div class="eyeline">FIND YOUR WAY. YOUR WAY.</div><h1>${signup ? "Your campus journey starts here." : "Welcome back."}</h1><p class="intro">${signup ? "Create your demonstration profile and make campus feel familiar." : "A familiar route. A new possibility. Let’s get you there."}</p><div class="account-tabs"><button data-action="login" aria-pressed="${!signup}">Log in</button><button data-action="signup" aria-pressed="${signup}">Sign up</button></div><form id="account-form" data-signup="${signup}">${signup ? '<label class="form-field">Your name<input name="name" autocomplete="nickname" required maxlength="60" placeholder="Alex Murphy"></label>' : ''}<label class="form-field">Email address<input name="email" type="email" autocomplete="off" required placeholder="you@example.com"></label><label class="form-field">Demo password<span class="password-field"><input aria-label="Demo password" name="password" type="password" autocomplete="off" required minlength="8" placeholder="At least 8 characters"><button type="button" data-action="show-password" aria-label="Show password">Show</button></span></label>${signup ? '<label class="form-field">Confirm demo password<input name="confirm" type="password" autocomplete="off" required minlength="8" placeholder="Repeat your demo password"></label>' : ''}<p id="form-error" role="alert" class="form-error"></p><button class="primary" type="submit">${signup ? "Create demo profile" : "Log in to demo"}${icon("arrow")}</button></form><div class="notice">Prototype only. Use made-up details. No account is created, no credentials are verified, and passwords are never saved or sent.</div>${button("Continue as guest", "guest", "secondary")}</div>`;
}
function profile() {
  return `<div class="page"><div class="profile-card"><span class="avatar" style="display:grid;place-content:center">${icon("user")}</span><div><h2>${state.demoUser ? "Hello, " + escape(state.demoUser) : "Make it your way"}</h2><p class="muted">Your preferences, on this device.</p></div></div>${button(state.demoUser ? "Log out of demo" : "Log in / Sign up", state.demoUser ? "logout" : "login", "secondary", "user")}<h2 style="margin-top:24px">Navigation preferences</h2><div class="setting-group"><label class="setting">Preferred travel mode<select data-setting="preferred" aria-label="Preferred travel mode">${Object.entries(
    modes,
  )
    .map(
      ([k, m]) =>
        `<option value="${k}" ${state.settings.preferred === k ? "selected" : ""}>${m.name}</option>`,
    )
    .join(
      "",
    )}</select></label>${toggle("avoid", "Avoid stairs")}${toggle("stepfree", "Prefer step-free routes")}${toggle("minimise", "Minimise walking distance")}</div><h2>Display preferences</h2><div class="setting-group">${toggle("contrast", "High contrast")}${toggle("large", "Larger text")}${toggle("labels", "Clear map labels")}</div><h2>Navigation assistance</h2><div class="setting-group">${toggle("written", "Expanded written directions")}${toggle("audio", "Audio direction preference")}</div><p class="muted">Essential written instructions always remain visible. Expanded directions add a full route summary. Audio is a visual preference only; this prototype does not play speech.</p><div class="notice">No account needed. Preferences and saved places stay in this browser. No medical or disability information is collected.</div>${disclaimer}</div>`;
}
function render() {
  document.title = "NavigateUCD · " + state.screen.replace("-", " ");
  main.setAttribute("aria-label", state.screen.replace("-", " ") + " screen");
  document.body.classList.toggle("large", state.settings.large);
  document.body.classList.toggle("contrast", state.settings.contrast);
  document.body.classList.toggle("clear-labels", state.settings.labels);
  const root = ["home", "explore", "saved", "profile"].includes(state.screen);
  const titles = {
    login: "NavigateUCD",
    signup: "NavigateUCD",
    search: "Find a destination",
    details: "Destination",
    preferences: "Route preferences",
    route: "Your route",
    outdoor: "Outdoor navigation",
    indoor: "Indoor navigation",
    "route-details": "Route details",
    arrived: "Journey complete",
  };
  document.querySelector("#header").innerHTML = root
    ? `<div class="logo">${icon("compass")}<span>Navigate<span>UCD</span></span></div><button class="avatar" data-action="profile" aria-label="Open profile">${icon("user")}</button>`
    : `<button class="icon-button" data-action="back" aria-label="Go back">${icon("back")}</button><span class="header-title">${titles[state.screen]}</span><span style="width:44px"></span>`;
  const views = {
    login: () => accountScreen(false),
    signup: () => accountScreen(true),
    home,
    search,
    details,
    preferences,
    route,
    outdoor,
    indoor,
    saved,
    explore,
    profile,
    "route-details": () =>
      `<div class="page"><h1>Your route, explained</h1><span class="badge">${icon(modes[state.mode].icon)}${modes[state.mode].name} · ${modes[state.mode].time} · ${modes[state.mode].distance}</span><ol class="steps">${routeInstructions()
        .map((s) => `<li>${s}</li>`)
        .join("")}</ol>${
        state.settings.written
          ? `<h2>Inside the building</h2><ol class="steps">${indoorSteps()
              .map((s) => `<li>${s}</li>`)
              .join("")}</ol>`
          : ""
      }<div class="notice">All distances, times, parking and access facilities are illustrative. ${state.mode === "stepfree" ? "Lift availability, gradients and widths are unverified. This route may not suit every mobility requirement." : ""}</div>${button("Start Navigation", "outdoor")}${disclaimer}</div>`,
    arrived: () =>
      `<div class="page"><div class="details-hero">${icon("flag")}<div class="eyeline">JOURNEY COMPLETE</div><h1>You found your way.</h1><p>${dest().name}</p><span class="badge">Simulated arrival</span></div><p class="intro">A familiar place for next time. Save this destination to find it quickly.</p>${button(state.saved.includes(dest().id) ? "Remove from saved" : "Save destination", "save", "secondary", "saved")}${button("Back to Home", "home")}${disclaimer}</div>`,
  };
  main.innerHTML = (views[state.screen] || home)();
  let active = root ? state.screen : "explore";
  document.querySelector("#nav").className = "bottom-nav";
  document.querySelector("#nav").innerHTML = [
    ["home", "home", "Home"],
    ["explore", "compass", "Explore"],
    ["saved", "saved", "Saved"],
    ["profile", "user", "Profile"],
  ]
    .map(
      ([id, i, label]) =>
        `<button class="nav-item ${active === id ? "active" : ""}" data-tab="${id}" ${active === id ? 'aria-current="page"' : ""}>${icon(i)}${label}</button>`,
    )
    .join("");
}
// Event delegation keeps every rendered screen interactive without page reloads.
document.addEventListener("click", (event) => {
  const el = event.target.closest("button");
  if (!el) return;
  const d = el.dataset;
  if (d.place) {
    openPlace(d.place);
    return;
  }
  if (d.tab) {
    state.history = [];
    state.query = "";
    state.filter = "All";
    state.screen = d.tab;
    render();
    main.scrollTop = 0;
    main.focus();
    return;
  }
  if (d.mode) {
    state.mode = d.mode;
    render();
    document.querySelector(`[data-mode="${d.mode}"]`)?.focus();
    return;
  }
  if (d.floor !== undefined) {
    state.floor = Number(d.floor);
    render();
    document.querySelector(`[data-floor="${d.floor}"]`)?.focus();
    return;
  }
  if (d.filter) {
    state.filter = d.filter;
    state.query = "";
    go("search");
    return;
  }
  if (d.searchFilter) {
    state.filter = d.searchFilter;
    render();
    return;
  }
  if (d.exploreFilter) {
    state.filter = d.exploreFilter;
    render();
    return;
  }
  if (d.remove) {
    state.saved = state.saved.filter((id) => id !== d.remove);
    persist();
    render();
    toast("Destination removed");
    return;
  }
  const a = d.action;
  if (!a) return;
  if (a === "show-password") {
    const input = document.querySelector('[name="password"]');
    const show = input.type === "password";
    input.type = show ? "text" : "password";
    el.textContent = show ? "Hide" : "Show";
    el.setAttribute("aria-label", show ? "Hide password" : "Show password");
    return;
  }
  if (a === "guest" || a === "logout") {
    state.demoUser = null;
    state.history = [];
    state.screen = a === "logout" ? "login" : "home";
    render(); main.focus(); return;
  }
  if (a === "back") {
    back();
    return;
  }
  if (a === "save") {
    const id = dest().id,
      exists = state.saved.includes(id);
    state.saved = exists
      ? state.saved.filter((x) => x !== id)
      : [...state.saved, id];
    persist();
    render();
    toast(exists ? "Destination removed" : "Destination saved");
    return;
  }
  if (a === "next" || a === "prev") {
    state.step += a === "next" ? 1 : -1;
    if (state.step < (state.mode === "stepfree" ? 2 : 1)) state.floor = 0;
    else
      state.floor =
        dest().floor === "Second floor"
          ? 2
          : dest().floor === "First floor"
            ? 1
            : 0;
    render();
    return;
  }
  if (a === "outdoor-next") {
    if (state.outdoor < routeInstructions().length - 1) {
      state.outdoor++;
      render();
    } else if (["Classroom", "Building"].includes(dest().category)) {
      state.step = 0;
      state.floor = 0;
      go("indoor");
    } else go("arrived");
    return;
  }
  if (a === "outdoor-prev") {
    state.outdoor--;
    render();
    return;
  }
  if (a === "outdoor") {
    state.outdoor = 0;
    go(a);
    return;
  }
  if (a === "exit") {
    go("route");
    return;
  }
  if (a === "finish") {
    go("arrived");
    return;
  }
  if (a === "search") {
    state.query = "";
    state.filter = "All";
  }
  if (a === "explore") state.filter = "All";
  go(a);
});
document.addEventListener("input", (event) => {
  if (event.target.id === "search") {
    state.query = event.target.value;
    document.querySelector("#results").innerHTML = resultList();
  }
});
document.addEventListener("change", (event) => {
  const key = event.target.dataset.setting;
  if (!key) return;
  state.settings[key] =
    event.target.type === "checkbox"
      ? event.target.checked
      : event.target.value;
  if ((key === "avoid" || key === "stepfree") && event.target.checked) {
    state.settings.preferred = "stepfree";
    state.mode = "stepfree";
  }
  if (key === "preferred") {
    state.mode = event.target.value;
    if (state.mode !== "stepfree") {
      state.settings.avoid = false;
      state.settings.stepfree = false;
    }
  }
  persist();
  render();
  const input = document.querySelector(`[data-setting="${key}"]`);
  input?.focus();
  toast("Preference updated");
});
render();

// Arrow keys provide the expected keyboard behaviour for the travel-mode radios.
document.addEventListener("keydown", (event) => {
  const el = event.target.closest("[data-mode]");
  if (
    !el ||
    !["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"].includes(event.key)
  )
    return;
  event.preventDefault();
  const keys = Object.keys(modes);
  const offset = ["ArrowDown", "ArrowRight"].includes(event.key) ? 1 : -1;
  state.mode =
    keys[(keys.indexOf(state.mode) + offset + keys.length) % keys.length];
  render();
  document.querySelector(`[data-mode="${state.mode}"]`).focus();
});

// UI-only account flow: credentials never enter persistent state or a network request.
document.addEventListener("submit", event => {
  if (event.target.id !== "account-form") return;
  event.preventDefault();
  const form = event.target;
  const signup = form.dataset.signup === "true";
  if (signup && form.elements.password.value !== form.elements.confirm.value) {
    document.querySelector("#form-error").textContent = "Your demo passwords do not match.";
    form.elements.confirm.setAttribute("aria-invalid", "true");
    form.elements.confirm.focus(); return;
  }
  const name = signup ? form.elements.name.value.trim() : "Explorer";
  if (!name) { document.querySelector("#form-error").textContent = "Please enter a name."; return; }
  state.demoUser = name;
  form.reset(); state.history = []; state.screen = "home";
  render(); main.focus(); toast(signup ? "Demo profile created for this session" : "Welcome to the demo");
});
