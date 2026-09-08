# Keploy Go Tutorial

An interactive documentation guide demonstrating how to record real API interactions against an Echo + PostgreSQL application and replay them as automated zero-code tests using [Keploy](https://keploy.io).

**Live Documentation Site**: [gokeploy.vercel.app](https://gokeploy.vercel.app/)

---

## Features

- **Dual Deployment Workflows**: Complete, step-by-step guides for both **Docker Compose** containerized runs and **Local Linux/WSL** native binary execution.
- **Interactive Terminal Blocks**: Syntax-highlighted code blocks with command prompts, auto-detected gutters, and one-click clipboard copying.
- **Visual Architecture Breakdowns**: Explanatory network diagrams, wire-level database interception flows, and test/mock contract comparisons.
- **Accessible & Responsive**: Sticky navigation rail with real-time scroll-spy tracking, full keyboard navigation, and theme persistence.
- **Fast Static Generation**: Fully prerendered at build time using Next.js 16 App Router and Turbopack.

---

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) with [Radix UI](https://www.radix-ui.com/) primitives
- **Content**: [MDX 3](https://mdxjs.com/) with GitHub-flavored markdown (`remark-gfm`)
- **Syntax Highlighting**: [Shiki](https://shiki.style/) dual-theme token generation
- **Icons**: [Lucide React](https://lucide.dev/)

---

## Getting Started

### Prerequisites

- Node.js 20.0.0 or higher
- npm 10+

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/INdrajit88/GO-TUTORIAL.git
cd GO-TUTORIAL
npm install
```

### Local Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Scripts

| Script | Command | Purpose |
| --- | --- | --- |
| `dev` | `next dev` | Start development server with Turbopack |
| `build` | `next build` | Build static production output |
| `start` | `next start` | Serve production build locally |
| `lint` | `eslint` | Run ESLint static analysis |
| `typecheck` | `tsc --noEmit` | Validate TypeScript types |

---

## Project Structure

```text
├── app/
│   ├── layout.tsx          # Root layout, metadata, and theme provider
│   ├── page.mdx            # Main tutorial content and interactive MDX
│   ├── globals.css         # Theme variables, typography, and code panel styles
│   ├── robots.ts           # Search engine robots configuration
│   └── sitemap.ts          # XML sitemap generator
├── components/
│   ├── ui/                 # Core UI primitives (Button, Card, Alert, Tabs)
│   ├── Callout.tsx         # Contextual callout alerts (tip, info, warning)
│   ├── CommandBlock.tsx    # Command terminal component with prompt gutter
│   ├── TerminalBlock.tsx   # Code highlighting and output panel
│   ├── Screenshot.tsx      # Image figure component with fallback
│   ├── TableOfContents.tsx # Sticky navigation sidebar with scroll-spy
│   ├── NetworkArchitecture.tsx # Visual network communication diagram
│   └── TestMockComparison.tsx  # Interactive test vs mock YAML inspector
├── content/
│   └── tutorialData.ts     # Centralized metadata, commands, and links
├── public/
│   └── screenshots/        # Optimized WebP documentation screenshots
└── next.config.ts          # Next.js and MDX compiler settings
```

---

## Deployment

The project is configured for deployment on [Vercel](https://vercel.com). Production builds are generated statically on every push to `main`.

---

## License

MIT
