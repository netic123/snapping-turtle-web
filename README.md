# Snapping Turtle

Bilingual (Swedish/English) company website for **Snapping Turtle** — an IT consulting firm specializing in AI solutions, CRM systems, and cloud services in the Microsoft ecosystem.

**Live:** [snapping-turtle-web.vercel.app](https://snapping-turtle-web.vercel.app)

## Features

- Interactive neural network hero animation with chain-reaction signals, ripple effects, and mouse interaction
- 5 service pages: AI Solutions, Dynamics 365 CRM, Power Platform, Azure, Custom CRM
- Industry showcase section
- Contact form with email delivery via Nodemailer
- Bilingual support (Swedish default, English) with next-intl
- Scroll-reveal animations and responsive design

## Tech Stack

- **Next.js 15** (App Router) + **React 19**
- **TypeScript**
- **Tailwind CSS** with custom turtle/bark color palette
- **Framer Motion** for animations
- **next-intl** for i18n (sv/en)
- **Nodemailer** for contact form emails
- **Vercel** for hosting

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── [locale]/          # Locale-based routing (sv/en)
│   └── api/contact/       # Contact form email endpoint
├── components/
│   ├── layout/            # Header, Footer
│   ├── sections/          # Hero, Services, Clients, About, Contact
│   └── ui/                # Button, Container, ServiceCard, ScrollReveal, etc.
├── i18n/                  # next-intl config
└── lib/                   # Constants
messages/
├── sv.json                # Swedish translations
└── en.json                # English translations
```

## Environment Variables

Create a `.env.local` file:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
CONTACT_EMAIL=recipient@example.com
```
