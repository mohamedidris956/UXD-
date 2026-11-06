# NavigateUCD

A mobile-first, front-end campus navigation prototype. Built with HTML, CSS and vanilla JavaScript; no build step, account, GPS, map API or backend. All icons and maps are local SVG, so the core experience works offline.

## Run

Open `index.html` in a browser, or serve the directory:

```sh
cd /workspace/UXD-
python3 -m http.server 8000
```

Open the server in your browser. Local storage keeps saved destinations and preferences in that browser; if storage is unavailable, the app works for the current session.

## Demonstration

- **Walking:** Home → search “A105” or “UX design” → Room A105 → Get Directions → Walking → View Route → Start Navigation → advance outdoor instructions → Enter building → advance indoor instructions → Finish journey.
- **Step-free:** choose Step-free in route preferences, or enable Avoid stairs in Profile. The route uses a dashed line and provides accessible entrance, ramp and lift guidance. Indoor stairs are marked as excluded. Review route details for suitability notes.
- **Cycling:** choose Cycling → View Route → Start Navigation → advance to bicycle parking → park → walk to the building → enter the indoor walking flow. Bicycle parking is also searchable through Explore and quick access.
- **Saved:** save or remove a destination in its details, or remove it directly from Saved.
- **Profile:** change travel mode, avoidance and distance preferences, high contrast, text size, map labels, expanded direction summaries and the visual-only audio preference.
- **Floors:** switch between ground, first and second floors. Room labels, target visibility, route continuation and entrance labels update. Navigation steps automatically select the appropriate floor.

All eight main screens are connected by persistent bottom navigation and contextual back controls. Outdoor simulation, route details and arrival are additional screens. The main content scrolls independently of the persistent header and navigation.

## Files

- `index.html`: document and app shell, desktop presentation.
- `style.css`: responsive mobile design, touch controls, focus states and accessibility themes.
- `app.js`: mock destination dataset, local SVG maps, screen rendering, route simulation, search and local preferences.
- `tests/journeys.cjs`: Playwright browser checks for the three journey modes, parking, floors, saved persistence, settings and layout. Uses a temporary local HTTP server. Requires Playwright and Chromium; run `node tests/journeys.cjs`. Set `CHROMIUM_PATH` if Chromium is installed at a different location.

## Design and data boundaries

The priority on classroom search, indoor wayfinding and accessible route review follows the supplied 50-response survey. No additional research statistics have been introduced. The prototype uses a neutral and green palette, labelled line icons, large controls, visible keyboard focus, text alongside route indicators, an optional high-contrast theme and larger text. Travel mode radio controls support arrow keys. This is not a claim of audited WCAG conformance.

**Every room placement, floor plan, route, distance, journey time, parking location and access feature is illustrative and unverified.** The map is schematic and is not a geographic representation of UCD. No live positioning, real-time availability or suitability guarantee is provided. Audio is a saved visual preference only. Essential written directions remain visible regardless of the expanded-summary preference.
