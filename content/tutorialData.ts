import { slugify, stepId } from "@/lib/slug";

/**
 * Single source of truth for the tutorial's facts: commands, screenshots,
 * recorded output, and the author's own notes.
 *
 * Everything in `commands`, `responses`, `artifacts` and `result` is taken from
 * the hands-on run. Edit prose freely, but do not change a command here without
 * having actually run the new one.
 */

export type NavLink = {
  label: string;
  href: string;
  /** Opens in a new tab with `rel="noopener noreferrer"`. */
  external?: boolean;
  /**
   * Dropped below `sm`. The header has to fit brand + nav + theme toggle inside
   * 358px at a 390px viewport, and this link only scrolls to the top — which the
   * brand link already does.
   */
  hideOnMobile?: boolean;
};

/**
 * Typed separately so every entry has the same shape. Under a bare `as const`
 * the two literals below become a union, and `item.external` stops type-checking.
 */
const nav: readonly NavLink[] = [
  { label: "Tutorial", href: "#top", hideOnMobile: true },
  { label: "GitHub", href: "https://github.com/keploy/samples-go", external: true },
];

export const site = {
  brand: "Keploy × Go",
  title: "Test a Go API with Keploy",
  description:
    "Learn how to record real API interactions and replay them as automated tests for a Go application using Keploy.",
  nav,
} as const;

export const hero = {
  label: "Go developer tutorial",
  title: site.title,
  subtitle: "Record real API interactions and replay them as automated tests.",
  tags: ["Go", "Echo", "PostgreSQL", "Keploy", "Docker Compose"],
} as const;

export const sample = {
  repo: "https://github.com/keploy/samples-go.git",
  directory: "samples-go/echo-sql",
  description:
    "A URL shortener: an Echo HTTP API in front of a PostgreSQL database. Two moving parts, one real dependency — exactly the shape of API that Keploy is interesting for.",
  port: 8082,
} as const;

export const prerequisites = [
  {
    name: "Docker Desktop",
    note: "The whole stack runs through Docker Compose.",
  },
  {
    name: "Git",
    note: "To clone the Keploy samples repository.",
  },
  {
    name: "Keploy",
    note: "The CLI provides both the record and test commands.",
  },
  {
    name: "A terminal",
    note: "For the curl requests and for stopping the recorder.",
  },
] as const;

/**
 * Verbatim commands from the recorded run. Do not reformat the line
 * continuations — they are what was actually typed.
 */
export const commands = {
  clone: `git clone https://github.com/keploy/samples-go.git
cd samples-go/echo-sql
go mod download`,

  record: `keploy record -c "docker compose up" \\
  --container-name "echoApp" \\
  --build-delay 50`,

  postUrl: `curl --request POST \\
  --url http://localhost:8082/url \\
  --header 'content-type: application/json' \\
  --data '{
  "url": "https://github.com"
}'`,

  getShortUrl: `curl http://localhost:8082/GuwHCgoQ`,

  test: `keploy test \\
  -c "docker compose up" \\
  --container-name "echoApp" \\
  --build-delay 50 \\
  --delay 10`,

  testLongerDelay: `keploy test \\
  -c "docker compose up" \\
  --container-name "echoApp" \\
  --build-delay 50 \\
  --delay 20`,
} as const;

/** The URL the application runs on inside the Compose workflow. */
export const endpoints = {
  baseUrl: "http://localhost:8082",
  create: "http://localhost:8082/url",
  follow: "http://localhost:8082/GuwHCgoQ",
} as const;

export const responses = {
  postUrl: `{
  "ts": 1647802058801841100,
  "url": "http://localhost:8082/GuwHCgoQ"
}`,
} as const;

export const artifacts = {
  /** The two layers the sample gives Keploy something to observe. */
  stack: `Go + Echo API
      │
      ▼
 PostgreSQL`,

  /** What lands on disk after Ctrl+C ends the recording. */
  tree: `keploy/
└── test-set-0/
    ├── mocks.yaml
    └── tests/
        ├── post-url-1.yaml
        └── get-<id>-1.yaml`,

  /** The Compose stack as Keploy sees it while recording. */
  compose: `Docker Compose
│
├── echoApp
│     └── Go + Echo
│
├── postgresDb
│     └── PostgreSQL
│
└── Keploy
      └── records interactions`,

  /** The two behaviors the recording ended up describing. */
  scenarios: `1. POST /url
   Create a shortened URL

2. GET /<short-url>
   Redirect to the original URL`,

  /** What replay does with a recorded test. */
  replay: `Recorded test
      │
      ▼
   Keploy
      │
      ▼
Go application
      │
      ├── API request replayed
      │
      └── dependency interactions replayed
      │
      ▼
Actual application response
      │
      ▼
Compare with recorded behavior
      │
      ▼
PASS ✅`,

  /** The whole workflow, start to finish. */
  summary: `Clone the Go sample
        ↓
Run it with Docker Compose
        ↓
Start Keploy in record mode
        ↓
Make real API calls
        ↓
Keploy captures the interactions
        ↓
Stop recording
        ↓
Run keploy test
        ↓
Replay the recorded scenarios
        ↓
2/2 tests pass ✅`,

  /** Docker networking, expressed as the difference it makes. */
  hostname: `echoApp → postgres`,
  hostnameWrong: `Mac → localhost:5432`,
} as const;

/** Nodes for the conceptual workflow diagram in step 8. */
export const workflow = [
  { label: "API request", detail: "POST /url, then GET /<short-url>" },
  { label: "Go application", detail: "Echo handlers" },
  { label: "Keploy observes interaction", detail: "HTTP traffic and the PostgreSQL calls behind it" },
  { label: "Test case + mocks", detail: "keploy/test-set-0/" },
  { label: "Replay", detail: "keploy test" },
  { label: "Verification", detail: "Compare against the recorded behavior" },
] as const;

/**
 * Side-by-side reference for the two Keploy commands, rendered as Tabs in
 * step 8. Flag descriptions state what each one is for without asserting a
 * unit — the source material never gives one for `--build-delay` or `--delay`.
 */
export const flagReference = [
  {
    id: "record",
    label: "keploy record",
    purpose: "Capture. Starts the application and writes down what happens.",
    command: commands.record,
    flags: [
      {
        flag: '-c "docker compose up"',
        detail: "The command Keploy runs to bring the stack up.",
      },
      {
        flag: '--container-name "echoApp"',
        detail: "Which container in that stack holds the application to observe.",
      },
      {
        flag: "--build-delay 50",
        detail: "Warm-up allowance, so images can build and services can come up before Keploy starts watching.",
      },
    ],
  },
  {
    id: "test",
    label: "keploy test",
    purpose: "Replay and verify. Re-runs the captured interactions and compares.",
    command: commands.test,
    flags: [
      {
        flag: '-c "docker compose up"',
        detail: "Same stack, started the same way.",
      },
      {
        flag: '--container-name "echoApp"',
        detail: "Same target container.",
      },
      {
        flag: "--build-delay 50",
        detail: "Same warm-up allowance before Keploy starts.",
      },
      {
        flag: "--delay 10",
        detail: "Extra wait for the application to be ready before recorded requests are fired. Raise it if a run starts too early.",
      },
    ],
  },
] as const;

/**
 * Figures for the article, keyed by the section they belong to.
 *
 * `width`/`height` are the real intrinsic pixel sizes, read off the files. The
 * Screenshot component passes them to <img> so the browser can reserve the
 * correct aspect ratio before the bytes arrive — without them every image
 * causes a layout shift as it loads.
 *
 * The two illustration-style figures ship as WebP: they were 1.62MB and 1.56MB
 * as PNG and are 255KB and 107KB converted, at identical dimensions.
 */
export const screenshots = {
  postgresFix: {
    src: "/screenshots/02-postgres-host-fix.png",
    width: 1988,
    height: 1078,
  },
  curl: {
    src: "/screenshots/04-curl-requests.png",
    width: 1466,
    height: 398,
  },
  recordedTests: {
    src: "/screenshots/06-recorded-tests.png",
    width: 1654,
    height: 542,
  },
  flow: {
    src: "/screenshots/08-keploy-flow.webp",
    width: 1184,
    height: 1328,
  },
  comparison: {
    src: "/screenshots/09-keploy-vs-manual.webp",
    width: 1536,
    height: 1024,
  },
} as const;

/**
 * First-hand notes from the run that produced this tutorial.
 *
 * `observations` are real and were written during the actual hands-on run.
 * The three placeholder arrays below are slots for you to fill in with your
 * own wording — they render visibly on the page until you replace them.
 */
export const observations = [
  {
    title: "Docker Compose made the environment much easier to reason about",
    body: `Running the Go application, PostgreSQL and Keploy inside one Compose workflow meant nothing had to be wired by hand to a database running separately on the host. The service-to-service connection happens inside the Compose network — \`echoApp → postgres\` rather than \`Mac → localhost:5432\`. That distinction mattered most when working outside the Linux/WSL instructions.`,
  },
  {
    title: "Recording is not the same as testing",
    body: `\`keploy record\` doesn't verify anything. It produces the material that gets replayed later. Verification only happens with \`keploy test\`. Once that split is clear the whole workflow reads as two halves: **record = capture**, **test = replay + verify**.`,
  },
  {
    title: "The API calls are what turn into useful tests",
    body: `The most useful part of the recording wasn't the Keploy command at all — it was simply using the application. \`POST /url\` and \`GET /<short-url>\` were ordinary requests, and those two ordinary requests became the two scenarios that later replayed green.`,
  },
] as const;

/**
 * The "it clicked here" moments.
 *
 * DRAFTED, NOT DICTATED. These are written from what the source material and
 * your own screenshots actually show — not from memory of your session. Read
 * them and change any wording that isn't how it went for you.
 */
export const ahaMoments = [
  {
    title: "The test suite is a side effect of using the app",
    body: `Two \`curl\` requests became two test cases. I never opened a \`_test.go\` file, never wrote an assertion, and never stubbed a database. The tests exist because I used the thing.`,
  },
  {
    title: "mocks.yaml is the part I'd have hated writing",
    body: `Hand-rolling a fake PostgreSQL for an API test is the worst half hour of the job — and then it drifts out of date. Keploy captured the real database conversation instead, which is the piece I'd have skipped or faked badly.`,
  },
] as const;

/**
 * What actually went wrong, and the fix.
 *
 * The first entry is backed by your own `line 48 fix.png` screenshot and the
 * hostname guidance in the source material. The second is documented as a sharp
 * edge rather than something that definitely bit you — adjust if it didn't.
 */
export const confusingSteps = [
  {
    title: "localhost works on my laptop, so why not in the container?",
    body: `Line 48 of \`main.go\` had the PostgreSQL host, and \`localhost\` is correct right up until it isn't. Inside the Compose network \`localhost\` means "this container", where nothing is listening on 5432. Changing it to the service name — \`postgres\` — is one word, and until you know the rule it looks like a config file that's simply wrong for no reason.`,
    fix: `Set the host to the Compose service name. \`postgres\`, not \`localhost\`, not \`127.0.0.1\`, not your machine's LAN IP.`,
  },
  {
    title: "The delays are not decoration",
    body: `\`--build-delay 50\` and \`--delay 10\` look like cargo-culted numbers you copy without reading. They aren't. One is "let the images build and Postgres start accepting connections before you watch", the other is "let the app be ready before you fire requests at it". On a cold Docker cache both matter, and the symptom of getting them wrong is a confusing failure rather than a clear one.`,
    fix: `Start from the values in the tutorial. If a replay starts before the app is ready, raise \`--delay\` before you suspect anything else.`,
  },
] as const;

export type TroubleshootingEntry = {
  symptom: string;
  cause: string;
  fix: string;
  /** Optional command showing the corrected invocation. */
  command?: string;
};

/**
 * Only issues that were actually seen during the run, or that the source
 * material states explicitly. Nothing speculative.
 */
export const troubleshooting: readonly TroubleshootingEntry[] = [
  {
    symptom: "The application cannot connect to PostgreSQL",
    cause:
      "The Go application is still dialing a host that doesn't exist inside the Compose network.",
    fix: "Check the PostgreSQL hostname used by the Go application. With the Docker Compose workflow the application should use the Compose service hostname rather than assuming PostgreSQL is running directly on the host machine. For this sample, `postgres` is the expected Compose-side hostname.",
  },
  {
    symptom: "The test takes longer to start",
    cause: "The services aren't ready by the time Keploy begins replaying.",
    fix: "Increase the startup delay. The exact value depends on how long your services need to become ready — the run below moves `--delay` from 10 to 20.",
    command: commands.testLongerDelay,
  },
];

export const result = {
  summary: `TESTRUN SUMMARY

Total tests:        2
Total test passed:  2
Total test failed:  0`,
  phase: "verified_green",
  passed: [
    { name: "POST /url", detail: "Create a shortened URL" },
    { name: "GET /<short>", detail: "Follow it back to the original URL" },
  ],
  /**
   * Optional. Paste your full `keploy test` terminal output here and the Final
   * result section will render it in a terminal block. Left empty on purpose —
   * nothing is fabricated when there is nothing to show.
   */
  fullOutput: "",
} as const;

/* ------------------------------------------------------------------ *
 * Table of contents
 *
 * Ids are derived, never hand-written, so a link can only point at a
 * heading that actually exists. Step sections build their id with
 * `stepId(number, title)`; markdown sections use `slugify(title)`.
 * ------------------------------------------------------------------ */

export const frontMatterSections = ["What you'll build", "What you'll need"] as const;

export const steps = [
  { number: 1, title: "Get the Go application" },
  { number: 2, title: "Point the app at Postgres" },
  { number: 3, title: "Start Keploy in record mode" },
  { number: 4, title: "Make a real API request" },
  { number: 5, title: "Test the shortened URL" },
  { number: 6, title: "Stop recording" },
  { number: 7, title: "Replay the recorded tests" },
  { number: 8, title: "Understand the workflow" },
  { number: 9, title: "Why this is useful for Go developers" },
  { number: 10, title: "What I learned" },
  { number: 11, title: "Troubleshooting" },
  { number: 12, title: "Final result" },
] as const;

export type ContentsEntry = { id: string; label: string };

export const contents: ContentsEntry[] = [
  ...frontMatterSections.map((title) => ({ id: slugify(title), label: title })),
  ...steps.map((step) => ({
    id: stepId(step.number, step.title),
    label: `${step.number}. ${step.title}`,
  })),
];

export const tutorialData = {
  site,
  hero,
  sample,
  prerequisites,
  commands,
  endpoints,
  responses,
  artifacts,
  workflow,
  flagReference,
  screenshots,
  observations,
  ahaMoments,
  confusingSteps,
  troubleshooting,
  result,
  contents,
} as const;
