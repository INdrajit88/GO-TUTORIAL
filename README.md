# GO-TUTORIAL — Keploy Go API Testing Guide & Interactive Tutorial

A single-page documentation site walking a Go developer through recording real API
interactions against Keploy's `echo-sql` sample (Echo + PostgreSQL on Docker Compose) and
replaying them as automated tests.

The tutorial is a rewritten, first-hand account of that workflow. Every command,
response, file tree, and test result published here comes from the actual run. Nothing is
invented, and the slots that are still placeholders are visibly marked as such.

## Overview

| | |
| --- | --- |
| Route | `/` — one page, `app/page.mdx` |
| Structure | Intro → What you'll build → What you'll need → 12 numbered steps |
| Rendering | Static. Prerendered at build time, no client data fetching |
| Theming | Light + dark, user-selectable, persisted, respects system preference |
| UI kit | shadcn/ui on Radix primitives |
| Code blocks | Highlighted at build time with shiki; no highlighter ships to the browser |

The page is a server component tree. Client components are limited to the theme toggle,
the copy buttons, the table-of-contents scroll spy, and the Radix primitives (Tabs,
Accordion, Tooltip, Separator).

## Tech Stack

- **Next.js 16** — App Router, Turbopack
- **React 19**
- **TypeScript 5** (strict)
- **MDX 3** via `@next/mdx`, with `remark-gfm`
- **Tailwind CSS 4** via `@tailwindcss/postcss`
- **shadcn/ui** — button, card, badge, alert, accordion, tabs, separator, tooltip
- **Radix UI** primitives underneath those components
- **class-variance-authority** + **clsx** + **tailwind-merge** for variants and `cn()`
- **next-themes** for class-based light/dark with persistence
- **lucide-react** for icons
- **shiki** for syntax highlighting
- **tw-animate-css** for Radix enter/exit animations
- **ESLint 9** with `eslint-config-next` (flat config)

No analytics, no CMS, no icon font.

## Running locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

```bash
npm run lint        # eslint
npm run typecheck   # tsc --noEmit
npm run build       # production build
npm run start       # serve the production build
```

## Project structure

```
app/
  layout.tsx          metadata, fonts, ThemeProvider, header/hero/footer, 2-col grid
  page.mdx            the tutorial itself
  globals.css         design tokens, prose rules, code panels, callout + diagram chrome
components/
  ui/                 shadcn/ui primitives (button, card, badge, alert, accordion,
                      tabs, separator, tooltip)
  Callout.tsx         info / tip / warning / success notes, built on ui/alert
  Step.tsx            a numbered tutorial section (owns its own <h2> and id)
  CommandBlock.tsx    a command the reader types — $ badge and prompt gutter
  TerminalBlock.tsx   the code panel underneath it: highlighting, label, copy button
  CopyButton.tsx      client copy control with a secure-context fallback
  Screenshot.tsx      image slot with a graceful placeholder when the file is absent
  TableOfContents.tsx sticky desktop rail + collapsible mobile variant, scroll spy
  WorkflowDiagram.tsx the conceptual record → replay diagram
  Heading.tsx         shared heading renderer, generates ids and anchor links
  RichText.tsx        renders `**bold**` and `code` from plain data strings
  Hero.tsx            eyebrow, h1, subtitle, technology badges
  SiteHeader.tsx      sticky header, nav, theme toggle
  SiteFooter.tsx      footer
  theme-provider.tsx  next-themes wrapper
  mode-toggle.tsx     accessible light/dark toggle
content/
  tutorialData.ts     every command, response, screenshot path, note, and result
lib/
  slug.ts             slugify / stepId / childrenToText — the single source of anchor ids
  utils.ts            cn()
public/
  screenshots/        drop the five PNGs here
components.json       shadcn config, so `npx shadcn add <component>` works
mdx-components.tsx    maps markdown elements onto the components above
```

## Theming

Class-based, driven by `next-themes` with `attribute="class"` and
`defaultTheme="system"`. A first-time visitor gets their OS preference; once they use the
header toggle the choice is persisted to `localStorage` and wins on later visits.
next-themes injects a blocking script that applies the class before first paint, so there
is no flash of the wrong theme.

The toggle renders both icons and swaps them with the `dark:` variant rather than with JS
state, so the correct one paints immediately. Its accessible label comes from
`resolvedTheme`, which is `undefined` on the server and on the first client render alike —
so hydration matches and React has nothing to warn about.

### Tokens

`app/globals.css` defines two blocks: `:root` and `.dark`. The names are shadcn's
canonical ones (`--background`, `--foreground`, `--card`, `--primary`, `--muted`,
`--accent`, `--border`, `--ring`, …) so anything added with `npx shadcn add` works
unmodified.

Domain tokens sit alongside them:

| Token | Purpose |
| --- | --- |
| `--brand`, `--brand-hover`, `--brand-soft`, `--brand-fg` | Keploy orange |
| `--faint` | third text tier: eyebrows, markers, diagram chrome |
| `--line-strong` | heavier rules, scrollbar thumbs, diagram arrows |
| `--info` / `--tip` / `--warning` / `--success` (+ `-soft`, `-fg`) | callout colors |
| `--header-h` | sticky header height, used for scroll margins |

**`--brand` is deliberately not called `--accent`.** shadcn reserves `accent` for the
subtle hover surface; colliding with it silently breaks every shadcn component. Use
`text-brand` / `bg-brand-soft` for brand color and `bg-accent` for hover surfaces.

### Contrast

Every foreground/background pair is measured against WCAG by parsing the token blocks in
`globals.css` directly, so the audit can't drift from the source. All **45 pairs pass**:
the lowest text pairing is 4.63:1 and the light-mode focus ring is 3.41:1 against its 3:1
requirement.

`--faint` was specifically raised to get there. It was `#878f99` in light mode, which
measured **3.27:1 and failed AA** at the small sizes it is used at; it is now `#6b7280`
(4.63:1). In dark mode it was `#757e8a` (4.29:1 on raised surfaces) and is now `#8b8b93`
(5.24:1). If you change a token, re-measure it.

### Keploy brand palette

Reconstructed from Keploy's shipped artifacts — their docs `custom.css`, the deployed
Docusaurus bundle, `keploy-logo-dark.svg`, and the marketing site's Next.js CSS. Not
guessed.

| Token | Value | Source |
| --- | --- | --- |
| Brand primary | `#ff914d` | logo wordmark fill, docs `--ifm-color-primary`, marketing `--theme-primary: 23 100% 65.1%` — all three agree |
| Logo mark gradient | `#FAD961 → #F76B1C` | `keploy-logo-dark.svg`, used for the header mark |
| Light page / card / text | `#f9fafb` / `#ffffff` / `#00163d` | docs `--ifm-background-color`, content area, `--ifm-color` |
| Light inline code | bg `#fff7ed`, text `#c2410c` | docs `--ifm-code-background` / `--ifm-code-color` |
| Dark page / card / text | `#141414` / `#18181b` / `#f5f6f7` | docs `html[data-theme="dark"]` |
| Dark inline code | bg `rgba(251,146,60,.2)`, text `#fb923c` | docs dark `--ifm-code-*` |
| Borders | `#e5e7eb` / `#d1d5db` | recurring in their bundles |

**Three deliberate deviations**, all because Keploy's own values fail WCAG AA for
body-size text:

| Their value | Measures | Used here instead |
| --- | --- | --- |
| prose link `#e67643` | 2.98:1 on white | `--brand-fg: #c2410c` (5.18:1) |
| `--ifm-color-primary-darker: #c95919` | 4.26:1 on white | `#c2410c` (5.18:1) |
| `#ff914d` as light-mode text | 2.1:1 on white | fills/rules only; text uses `#c2410c` |

`#ff914d` *is* used directly in dark mode, where it measures 8.25:1. Keploy's docs force
links white in dark mode; that's an aesthetic hotfix rather than a contrast requirement,
so the brand orange is kept there to preserve the identity.

Also note: `keploy/docs/tailwind.config.js` still declares a legacy teal/blue/purple set
(`keployblue #B2E7EA`, `keploybrightblue #127AE5`, `keploypurple #B8B4DC`). It is **dead
config** — zero of those classes or hex values appear in the deployed CSS. Don't use them.

`--warning` is pushed toward yellow rather than amber so it stays distinguishable from the
orange brand at a glance.

## Updating tutorial content

**Prose** lives in `app/page.mdx`. **Facts** live in `content/tutorialData.ts` — commands,
responses, file trees, diagram text, the flag reference, the test result, screenshot
paths, and the author's notes. The MDX references them:

```mdx
<CommandBlock title="record mode">{commands.record}</CommandBlock>
```

Keep the JSX tight against the braces. MDX preserves whitespace inside JSX children, so
putting `{commands.record}` on its own line indents the first line of the command.

### MDX gotchas that have already bitten this file

1. **Never put markdown text inside a `<p>` tag.** MDX parses content inside block-level
   JSX tags as markdown, so `<p className="lead">text</p>` emits `<p><p>text</p></p>`.
   Invalid nesting makes the browser restructure the DOM and **breaks hydration** with
   React error #418. Use a `<div>` wrapper, or keep the whole element on one line.
2. **Never wrap an expression in backticks.** `` `{result.phase}` `` renders the literal
   text `{result.phase}` — code spans are not evaluated. Use `<code>{result.phase}</code>`.
3. **Never write a bare `<` in prose.** MDX parses it as JSX. Write `` `GET /<short-url>` ``
   inside backticks, or use `&lt;`.
4. **Leave a blank line** after an opening JSX tag and before its closing tag, or the body
   is parsed as JSX text instead of markdown.

Two build constraints are already handled — don't undo them:

- `remarkPlugins: ["remark-gfm"]` is a **string**, not an imported function. Turbopack
  requires serializable loader options and rejects the function form.
- `turbopack.root` is pinned to `process.cwd()`. Without it, Next walks up from this
  directory (whose name contains spaces) and picks the wrong project root.

### Author notes

`content/tutorialData.ts` holds the first-person material for step 10, in three arrays:

- `observations` — three notes carried over from the original hands-on write-up
- `ahaMoments` — two "it clicked here" moments
- `confusingSteps` — two things that went wrong, each with a `fix` field

**Read `ahaMoments` and `confusingSteps` before publishing.** They were drafted from the
source material and from what the screenshots show — the `line 48 fix.png` capture is
evidence the Postgres hostname step genuinely went wrong — but they are not transcribed
from a recorded session. The comment above each array in the data file says the same thing.
Adjust any wording that isn't how it actually went.

Bodies support `**bold**` and `` `code` `` via `RichText`.

`result.fullOutput` is deliberately empty. Paste your complete `keploy test` output there
and step 12 renders it; left empty, nothing renders rather than something fabricated. The
real summary and `verified_green` phase from the run are already shown.

## Figures

Five figures ship in `public/screenshots/`, each keyed to the section it belongs to in
`tutorialData.screenshots`:

| Key | File | Size | Used in |
| --- | --- | --- | --- |
| `postgresFix` | `02-postgres-host-fix.png` | 1988×1078, 373KB | step 2 |
| `curl` | `04-curl-requests.png` | 1466×398, 80KB | step 4 |
| `recordedTests` | `06-recorded-tests.png` | 1654×542, 126KB | step 6 |
| `flow` | `08-keploy-flow.webp` | 1184×1328, 255KB | step 8 |
| `comparison` | `09-keploy-vs-manual.webp` | 1536×1024, 107KB | step 9 |

Total 940KB. The last two were 1.62MB and 1.56MB as PNG; converting them to WebP at
quality 84 cut them 6.2× and 14.3× at identical dimensions. To re-run that conversion:

```bash
npx sharp-cli -i "input.png" -o outdir --format webp --quality 84
```

`sharp-cli` is used through `npx` on purpose — it isn't a project dependency, because
image optimization is a one-off authoring step, not part of the build. macOS `sips` reads
WebP but cannot write it, which is why it isn't used here.

Each entry carries its real `width` and `height`, which `Screenshot` passes to `<img>` so
the browser reserves the correct aspect ratio before the bytes arrive. **If you replace a
figure, update those two numbers** or you reintroduce layout shift.

`Screenshot` checks the filesystem with `node:fs` at render time and uses a plain `<img>` —
`next/image` was rejected on purpose, because it fails the build on a path that isn't on
disk yet. A missing figure degrades to a labelled placeholder naming the file, so the page
still builds and reads correctly while you're adding images.

Alt text and captions live in `app/page.mdx`; paths and dimensions in `tutorialData`.

## MDX components

Registered globally in `mdx-components.tsx`, though `page.mdx` imports them explicitly so
prop types stay checked.

```mdx
<Callout type="info" title="Why Docker Compose for this run">

Body as markdown. `info` | `tip` | `warning` | `success`.

</Callout>

<Step number={3} title="Start Keploy in record mode">

Body as markdown. Renders the numbered `<h2>` and its anchor id.

</Step>

<CommandBlock title="record mode">{commands.record}</CommandBlock>

<TerminalBlock language="json" title="expected response" caption="Optional caption">
{ "url": "http://localhost:8082/GuwHCgoQ" }
</TerminalBlock>

<Screenshot src={screenshots.record} alt="Descriptive alt text" caption="Caption." />

<WorkflowDiagram />
```

Markdown elements are mapped too: `h1`–`h4` become `Heading` (auto id + hover anchor),
fenced code blocks become `TerminalBlock`, links opening `http(s)` get
`rel="noopener noreferrer"`, and `img` becomes `Screenshot`.

### Commands versus output

Use **`CommandBlock`** for anything the reader types. It adds a `$` badge in the header and
a prompt gutter on the lines that actually begin a command. Use **`TerminalBlock`** for
responses, file trees, and diagrams — no prompt, so the two never look alike.

The prompt is injected by CSS from a set of line numbers computed in `commandLines()`,
which skips indented lines, `\` continuations, and lines inside an open quote. That last
rule matters for the multi-line `curl` in step 4: its closing `}'` is unindented and would
otherwise be mistaken for a new command. Because the glyph is CSS, it never reaches the
clipboard — copied commands stay runnable.

Plain fenced blocks work too: ` ```bash ` fences are auto-detected as commands, everything
else as output.

### Code block theming

shiki is called with `themes: { light: "github-light", dark: "github-dark" }` and
`defaultColor: false`, so it emits `--shiki-light` / `--shiki-dark` custom properties on
every token. CSS picks one per active theme. Both themes are baked in at build time, so
toggling is instant and no highlighter or theme JSON ships to the browser.

### Table of contents

Ids are derived, never hand-written. `Step` builds its id with `stepId(number, title)` and
markdown headings use `slugify(text)` — both from `lib/slug.ts`. `contents` in
`tutorialData.ts` runs the same functions over the same titles, so a TOC entry can only
point at a heading that exists.

If you rename a step title or add a section, update `steps` or `frontMatterSections` to
match. A mismatch shows up as a TOC link that scrolls nowhere.

## Building for production

```bash
npm run build
npm run typecheck && npm run lint
```

The page prerenders to static HTML.

One thing is invisible in the prerendered output by design: content inside a **closed
Accordion panel** is mounted on demand, so the second troubleshooting entry's command
block is not in the initial HTML. Tabs uses `forceMount` so both flag-reference panels
*are* in the HTML, for search, print, and no-JS readers; the Accordion does not, because
`forceMount` would break its height animation.

## Deploying to Vercel

1. Push the repository to GitHub.
2. In the Vercel dashboard, **Add New… → Project** and import it.
3. Framework preset: **Next.js**. Leave the build command as `next build`.
4. Under **Settings → Environment Variables**, add:

   | Name | Value |
   | --- | --- |
   | `NEXT_PUBLIC_SITE_URL` | `https://your-production-domain` |

   This sets `metadataBase` so Open Graph URLs resolve against the deployed host instead
   of `localhost`. Without it the build still succeeds and the warning is cosmetic.
5. Deploy.

The folder name on this machine contains spaces. That is fine for Vercel — it uses the
repository name — but it is why `turbopack.root` is pinned in `next.config.ts`.

Nothing here needs a runtime, a database, or an API route. It is a static site.
