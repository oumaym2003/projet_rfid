# ENET AERO CUP 5.0 Website

🚀 Official website for the **ENET AERO CUP 5.0** — a national aeromodeling competition organized by Club Aéromodélisme ENETCOM.

## 🛠️ Tech Stack

- **React 18** + **TypeScript** — Modern UI development
- **Vite** — Lightning-fast build tool
- **Tailwind CSS** — Utility-first styling
- **React Router** — Client-side routing
- **Netlify** — Free hosting with form handling

## 📁 Project Structure

```
aerowebsite/
├── public/              # Static assets (logo, images)
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── Header.tsx   # Navigation bar
│   │   └── Footer.tsx   # Site footer
│   ├── pages/           # Page components
│   │   ├── Home.tsx     # Landing page
│   │   ├── About.tsx    # About us page
│   │   ├── News.tsx     # News & events
│   │   └── Contact.tsx  # Contact form
│   ├── App.tsx          # Main app with routing
│   ├── main.tsx         # React entry point
│   └── index.css        # Global styles + Tailwind
├── index.html           # HTML template
├── tailwind.config.js   # Tailwind configuration
├── vite.config.ts       # Vite configuration
├── netlify.toml         # Netlify deployment config
└── package.json         # Dependencies & scripts
```

## 🚀 Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for production

```bash
npm run build
```

### 4. Preview production build

```bash
npm run preview
```

## 🌐 Deploy to Netlify (Free)

### Option A: Netlify Dashboard (easiest)

1. Push this code to a GitHub repository
2. Go to [netlify.com](https://netlify.com) and sign up/login
3. Click "Add new site" → "Import an existing project"
4. Connect your GitHub repo
5. Netlify auto-detects settings from `netlify.toml`
6. Click "Deploy site"

### Option B: Netlify CLI

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize and link your site
netlify init

# Deploy to production
netlify deploy --prod
```

## 📝 Customization

### Update content

- **Logo**: Replace `public/logo.svg` with your logo
- **Images**: Add images to `public/images/`
- **Team members**: Edit `src/pages/About.tsx`
- **News items**: Edit `src/pages/News.tsx`
- **Contact info**: Edit `src/pages/Contact.tsx` and `src/components/Footer.tsx`

### Brand colors

Edit `tailwind.config.js` to customize colors:

```js
colors: {
  dark: '#1E1B1C',      // Background
  orange: {
    400: '#FFB020',     // Light orange
    500: '#FF8C00',     // Primary orange
    600: '#FF5A00',     // Dark orange
    700: '#D93E2A',     // Deep red-orange
  }
}
```

## 📬 Forms

The contact form is configured for **Netlify Forms** (free, no backend needed).

When deployed to Netlify:
1. Form submissions appear in Netlify dashboard → Forms
2. Set up email notifications in Netlify settings
3. Optionally integrate with Zapier/Slack for notifications

## 📱 Features

- ✅ Fully responsive design (mobile, tablet, desktop)
- ✅ Dark theme with orange gradient accents
- ✅ Animated hero section with flight-path graphics
- ✅ Interactive news filtering
- ✅ FAQ accordion section
- ✅ Social media links
- ✅ SEO-ready meta tags
- ✅ Netlify Forms integration
- ✅ Fast page loads (Vite optimization)

## 📄 License

© 2026 Club Aéromodélisme ENETCOM. All rights reserved.

---

Built with ❤️ for the aeromodeling community 🛩️
