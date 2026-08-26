# Emganwini Main SDA Church

<div align="center">

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)
![Styled Components](https://img.shields.io/badge/Styled--Components-6-DB7093?style=flat-square&logo=styled-components&logoColor=white)
![Capacitor](https://img.shields.io/badge/Capacitor-8-119EFF?style=flat-square&logo=capacitor&logoColor=white)
![License](https://img.shields.io/badge/license-private-lightgrey?style=flat-square)

**Official website and mobile app for the Emganwini Main Seventh-day Adventist Church**  
Emganwini, Bulawayo, Zimbabwe

[Live Site](#) · [Report a Bug](mailto:Connect@Emganwinisda.org) · [Contact the Church](mailto:Connect@Emganwinisda.org)

</div>

---

## Overview

A full-featured church website built with React and TypeScript, packaged as a native Android and iOS app via Capacitor. It includes an events calendar, ministry pages, a contact form, an online giving page, and 3D animated backgrounds powered by Three.js.

---

## Features

- **Responsive layout** — mobile-first with an animated hamburger nav on small screens
- **3D animated backgrounds** — Three.js canvas scenes on the home hero and About page (floating particles, cross, orbit rings, icosahedron)
- **Mission/Vision/Story carousel** — auto-advancing slider with manual dot and arrow controls
- **Events calendar** — toggle between a list view and a full monthly calendar; click any event to open a detail modal
- **Contact form** — client-side validation with a success confirmation state
- **Giving page** — categorised donation form (Tithe, Local Offerings, Conference/Union, World) with a live summary sidebar and a confirmation modal
- **Ministry pages** — seven ministry pages sharing a common layout: scripture, programs list, and a ministry navigation sidebar
- **Scroll to top** — automatically scrolls to the top on every route change

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 19 + TypeScript |
| Routing | React Router v7 |
| Styling | Styled Components v6 |
| 3D / Animation | Three.js |
| Icons | Iconify |
| Build Tool | Vite 8 |
| Mobile | Capacitor 8 (Android + iOS) |
| Linting | ESLint + typescript-eslint |

---

## Project Structure

```
SDAM/
├── android/                   Capacitor Android project
├── ios/                       Capacitor iOS project
├── public/                    Static public assets (favicon, icons)
├── src/
│   ├── assets/                Bundled image assets
│   ├── images/                Local photo assets
│   ├── components/
│   │   ├── Navbar.tsx         Fixed nav, scroll-aware, ministries dropdown
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx           Full-viewport home hero section
│   │   ├── HeroCanvas.tsx     Three.js animated hero background
│   │   ├── AboutCanvas.tsx    Three.js animated about background
│   │   ├── Mission.tsx        Mission / Vision / Story carousel
│   │   ├── FindUs.tsx         Address, phone, email + embedded map
│   │   ├── JoinUs.tsx         Service times and connect CTA
│   │   ├── QuickLinks.tsx     Photo card grid (Events, About, Ministries)
│   │   ├── WorldwideChurch.tsx SDA worldwide facts section
│   │   ├── MinistryLayout.tsx  Shared layout for all ministry pages
│   │   └── ScrollToTop.tsx
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── AboutPage.tsx
│   │   ├── EventsPage.tsx
│   │   ├── ContactPage.tsx
│   │   ├── GivingPage.tsx
│   │   ├── YouthMinistryPage.tsx
│   │   ├── HealthMinistryPage.tsx
│   │   ├── PrayerMinistryPage.tsx
│   │   ├── WomensMinistryPage.tsx
│   │   ├── MensMinistryPage.tsx
│   │   ├── ChildrensMinistryPage.tsx
│   │   └── CommunityOutreachPage.tsx
│   ├── theme.ts               Design tokens (colors, spacing, breakpoints)
│   ├── styled.d.ts            Styled Components theme type augmentation
│   ├── App.tsx                Root component — router + theme provider
│   └── main.tsx               Entry point
├── capacitor.config.ts
├── vite.config.ts
└── package.json
```

---

## Routes

| Path | Page |
|---|---|
| `/` | Home |
| `/about` | About Us |
| `/calendar` | Events |
| `/contact` | Contact Us |
| `/giving` | Giving |
| `/ministries/youth` | Youth Ministry |
| `/ministries/health` | Health Ministry |
| `/ministries/prayer` | Prayer Ministry |
| `/ministries/women` | Women's Ministry |
| `/ministries/men` | AMO – Adventist Men's Organisation |
| `/ministries/children` | Children's Ministry |
| `/ministries/community` | Community Outreach |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or higher
- npm (bundled with Node.js)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/sdam.git
cd sdam
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### 4. Build for production

```bash
npm run build
```

### 5. Preview the production build locally

```bash
npm run preview
```

---

## Mobile (Capacitor)

After running a production build, sync the web assets to the native projects:

```bash
npm run cap:sync
```

Open in Android Studio:

```bash
npm run cap:open:android
```

Open in Xcode (macOS required):

```bash
npm run cap:open:ios
```

> **App ID:** `org.emganwinisda.app`  
> **Web dir:** `dist`

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint across the project |
| `npm run cap:sync` | Sync web build to native Capacitor projects |
| `npm run cap:open:android` | Open the Android project in Android Studio |
| `npm run cap:open:ios` | Open the iOS project in Xcode |

---

## Church Information

**Emganwini Main Seventh-day Adventist Church**  
Emganwini, Bulawayo, Zimbabwe  
[Connect@Emganwinisda.org](mailto:Connect@Emganwinisda.org)

**Service Times — every Saturday**

| Service | Time |
|---|---|
| Sabbath School | 09:00 am |
| Worship Service | 11:30 am |

---

<div align="center">

*"Connecting our community to Christ — through teaching, preaching, and healing."*

</div>
