# Dhivakaran T — Senior Engineering Operations Portfolio

A polished, responsive, glassmorphism-style portfolio for a Senior Engineering Operations professional. The site is built as a lightweight static website using HTML, Tailwind CSS CDN, custom CSS, and vanilla JavaScript.

## Overview

This portfolio presents the supplied resume details as an impressive static website with modern cloud/SRE visual styling, smooth transitions, interactive sections, and clean deployment structure.

## What This Portfolio Includes

- Professional hero section with reliability-focused positioning
- Professional Summary section using the supplied resume wording exactly
- Technical Skills cards with glassy UI effects and relevant icons
- Interactive Professional Experience timeline with expandable role details
- Project cards for CI/CD Automation and AWS Three-Tier Infrastructure Deployment
- Certification and Education cards
- Contact section with Email, LinkedIn, GitHub, and copy-email buttons
- Dark/light mode with saved browser preference
- Mobile menu for small screens
- Scroll progress indicator
- Active navigation highlighting
- Back-to-top button
- Copy-to-clipboard toast notification
- Smooth transitions and reduced-motion accessibility support
- Mobile-first responsive design

## Files

```text
fixed_portfolio/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Design Decisions

- Resume points, role details, stack lines, project details, skill lines, certification line, and education line were preserved as provided.
- Company logo dependencies were intentionally avoided because missing local images can break the visual polish.
- Relevant remote images are used only where they add value: hero cloud infrastructure, CI/CD automation, AWS infrastructure, and the AWS certification badge.
- Experience cards use icon-based visual markers instead of company images to keep the design clean and reliable.
- The color palette uses slate, indigo, cyan, violet, magenta, and emerald for a premium cloud/SRE portfolio appearance.

## Included Scripts

`script.js` includes:

- Safe dark/light mode toggle with `localStorage` fallback
- Lucide icon initialization
- AOS animation initialization
- Mobile navigation toggle
- Expand/collapse experience details
- Timeline progress animation
- Scroll progress bar
- Active section navigation state
- Back-to-top behavior
- Copy-to-clipboard buttons with toast feedback
- Dynamic footer year
- `ResizeObserver` support for smoother timeline recalculation

## How to Customize

### Contact Links

Edit the contact section in `index.html`:

```html
<a href="mailto:devadhiva704@gmail.com">Email</a>
<a href="https://www.linkedin.com/in/dhivakaran-t/">LinkedIn</a>
<a href="https://github.com/Dhiva704">GitHub</a>
```

### Add a Resume PDF Button

Place your resume at:

```text
assets/resume.pdf
```

Then add a button/link in the navigation or hero section:

```html
<a href="assets/resume.pdf" target="_blank" rel="noopener noreferrer">Resume</a>
```

### Replace Remote Images with Local Images

Create an assets folder:

```text
assets/img/
```

Then update image paths in `index.html`, for example:

```html
<img src="assets/img/cloud-operations.jpg" alt="Cloud infrastructure operations dashboard">
```

## Local Preview

Open `index.html` directly in a browser, or run a simple local server:

```bash
python3 -m http.server 8080
```

Then visit:

```text
http://localhost:8080
```

## GitHub Pages Deployment

1. Create a GitHub repository.
2. Upload `index.html`, `style.css`, `script.js`, and `README.md` to the repository root.
3. Go to **Settings → Pages**.
4. Choose the main branch and root folder.
5. Save and open the generated GitHub Pages URL.

## Validation Checklist

- `script.js` passes syntax validation with `node --check script.js`.
- HTML parses successfully.
- No required local image assets are needed for the page to render.
- The page is responsive across mobile, tablet, and desktop layouts.
- Resume content has been kept intact in the portfolio sections.
