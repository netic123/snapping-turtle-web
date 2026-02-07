# Snapping Turtle Web

A bilingual (Swedish/English) corporate website for Snapping Turtle, an IT consulting company specializing in Microsoft cloud solutions and AI implementations. Built with Next.js 15, React 19, and TypeScript.

## Tech Stack

- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript 5.7
- **Styling:** Tailwind CSS 3.4
- **Animations:** Framer Motion
- **Internationalization:** next-intl (Swedish & English)
- **Email:** Nodemailer

## Features

- **Bilingual support** — Full Swedish/English translations with seamless language switching
- **Service showcase** — AI Solutions, Dynamics 365 CRM, Power Platform, Azure, and Custom CRM
- **Contact form** — Email submission via Nodemailer with validation and feedback
- **Visitor tracking** — IP geolocation and session-based tracking with email notifications
- **Animations** — Scroll reveal effects, gradient orbs, hover interactions
- **Responsive design** — Mobile-first layout with glassmorphism UI elements

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@example.com
SMTP_PASS=your-password
CONTACT_EMAIL=your-contact-email@example.com
```

### Development

```bash
npm run dev
```

Opens at [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Project Structure

```
src/
├── app/
│   ├── [locale]/          # Locale-based routing (pages & layout)
│   └── api/
│       ├── contact/       # Contact form endpoint
│       └── track/         # Visitor tracking endpoint
├── components/
│   ├── sections/          # Hero, Services, About, Contact
│   ├── layout/            # Header, Footer
│   └── ui/                # Button, ServiceCard, ScrollReveal, etc.
├── i18n/                  # Routing, navigation, and request config
└── lib/
    └── constants.ts       # Company info and service definitions
messages/
├── sv.json                # Swedish translations
└── en.json                # English translations
```

## API Endpoints

| Method | Path            | Description                              |
|--------|-----------------|------------------------------------------|
| POST   | `/api/contact`  | Sends contact form submissions via email |
| POST   | `/api/track`    | Records visitor info with geolocation    |
