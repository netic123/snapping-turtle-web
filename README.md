# 🐢 Snapping Turtle

Bilingual (Swedish/English) company landing page for **Snapping Turtle** — an IT consulting firm specializing in AI, CRM, and cloud solutions.

**Live:** [snapping-turtle-web.vercel.app](https://snapping-turtle-web.vercel.app)

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **i18n:** next-intl (Swedish default, English)
- **Email:** Nodemailer (contact form)
- **Hosting:** Vercel

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/[locale]/       # Locale-based routing (sv/en)
├── components/
│   ├── layout/         # Header, Footer
│   ├── sections/       # Hero, Services, About, Contact
│   └── ui/             # Button, ServiceCard, ScrollReveal, etc.
├── i18n/               # next-intl config
└── lib/                # Constants
messages/
├── sv.json             # Swedish translations
└── en.json             # English translations
```

## Environment Variables

Create a `.env.local` file:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
CONTACT_EMAIL=your-email@gmail.com
```

## License

Open source.
