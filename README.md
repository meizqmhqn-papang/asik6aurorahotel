# Aurora Hotel

Aurora Hotel is a responsive seven-page hospitality website built with HTML, CSS, JavaScript, jQuery and Bootstrap CSS.

## Pages

- `index.html` — home, personalized welcome and theme switch
- `rooms.html` — six room categories, live search, category filters and wishlist
- `about.html` — hotel information and facilities
- `booking.html` — stay preferences, validation and FAQ
- `stay-review.html` — guest stay summary
- `contact.html` — validated contact form
- `register.html` — validated guest registration form

## Open the website

Extract the project and open `index.html` in a modern browser. For local development or a static hosting service, serve the `AuroraHotel` directory as the site root. The project does not require npm or a server-side application. jQuery and Bootstrap CSS are included locally.

## jQuery features

| Requirement | Page | Implementation |
|---|---|---|
| Selectors, events and DOM updates | Home and shared header | `.on()`, `.val()`, `.text()`, `.toggleClass()` |
| Slide and fade effects | Booking, home and rooms | `.slideDown()`, `.slideUp()`, `.fadeIn()`, `.fadeOut()`, `.stop()` |
| Live search and category filtering | Rooms | `.on('input')`, `.on('click')`, `.each()`, `.prop()` |
| Dynamic content and delegated events | Rooms | `.append()`, `.text()`, `.on('click', '.remove-btn', ...)` |
| Form validation | Contact, registration and booking | `.on('submit')`, `.val()`, `.toggleClass()`, `.attr()` |

The wishlist and selected theme are stored in browser local storage. Stay preferences are stored in browser session storage and displayed on the review page.

## File structure

```text
AuroraHotel/
├── index.html
├── rooms.html
├── about.html
├── booking.html
├── stay-review.html
├── contact.html
├── register.html
├── css/
│   ├── style.css
│   ├── responsive.css
│   ├── interactions.css
│   └── forms.css
├── js/
│   ├── script.js
│   └── forms.js
├── images/
└── vendor/
    ├── bootstrap/
    └── jquery/
```

## Team information

The previous project report lists Meizamkhan Zhanbyrbayev (MT-2502), Dilnaz Toktanova (MT-2502), and Ayazhan Nurtaza (MT-2502). The original fourth roster entry duplicates Meizamkhan's name.

The Assignment 5 contribution mapping is: Meizamkhan — welcome, theme and wishlist; Dilnaz — FAQ; Ayazhan — room search. The completed version integrates all five jQuery requirements and final-site work across those pages.

## Repository and publishing



These are previous-version references; publishing the final archive to the repository is a separate action. The archive contains the final local website, but cannot publish itself.

## Frontend functionality

All form validation takes place in the browser. Contact forms do not send email, registration does not create a server account, and the stay summary does not confirm a real reservation. The website states these limitations at the relevant result screens.

## Test coverage

The accompanying assignment report records eleven successful local DOM-rendered Chromium checks, the responsive viewports used, and restrictions on external navigation and second-browser testing. The published final URL should also be checked after deployment.
