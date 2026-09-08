import { slugify } from "@/lib/slug";

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
  title: "Echo SQL Sample Application",
  description:
    "Run an Echo-based URL shortener with PostgreSQL and use Keploy to capture and replay API testcases.",
  nav,
} as const;

export const hero = {
  label: "Hands-on Keploy Guide",
  title: "Echo SQL Sample Application",
  subtitle:
    "Run an Echo-based URL shortener with PostgreSQL and use Keploy to capture and replay API testcases.",
  tags: ["Go", "Echo", "PostgreSQL", "Keploy", "Docker Compose", "Linux/WSL"],
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
    src: "/screenshots/02-postgres-host-fix.webp",
    width: 1988,
    height: 1078,
  },
  dockerRecord: {
    src: "/screenshots/03-docker-record.webp",
    width: 1996,
    height: 874,
  },
  curl: {
    src: "/screenshots/04-curl-requests.webp",
    width: 798,
    height: 237,
  },
  dockerTestPass: {
    src: "/screenshots/07-docker-test-pass.webp",
    width: 1737,
    height: 1190,
  },
  recordedTests: {
    src: "/screenshots/06-recorded-tests.webp",
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

export const tutorialSections = [
  "Prerequisites",
  "Get the Sample Application",
  "Process 1: Docker Compose Workflow",
  "Process 2: Local Linux/WSL Workflow",
  "Keploy Test Replay Execution Workflow",
  "Conclusion",
] as const;

export type ContentsEntry = {
  id: string;
  label: string;
  level?: 2 | 3;
};

export const contents: ContentsEntry[] = [
  { id: "prerequisites", label: "Prerequisites", level: 2 },
  { id: "get-the-sample-application", label: "Get the Sample Application", level: 2 },
  { id: "process-1-docker-compose-workflow", label: "Process 1: Docker Compose", level: 2 },
  { id: "update-the-postgresql-host", label: "Update PostgreSQL Host", level: 3 },
  { id: "build-the-application-docker", label: "Build Application", level: 3 },
  { id: "start-recording-with-keploy", label: "Start Recording with Keploy", level: 3 },
  { id: "generate-a-testcase", label: "Generate Testcases", level: 3 },
  { id: "stop-recording", label: "Stop Recording", level: 3 },
  { id: "check-the-generated-testcases", label: "Check Generated Testcases", level: 3 },
  { id: "replay-the-testcases", label: "Replay Testcases", level: 3 },
  { id: "process-2-local-linuxwsl-workflow", label: "Process 2: Local Linux/WSL", level: 2 },
  { id: "start-postgresql", label: "Start PostgreSQL in Docker", level: 3 },
  { id: "change-the-postgresql-host", label: "Change PostgreSQL Host", level: 3 },
  { id: "build-the-application", label: "Build Application", level: 3 },
  { id: "start-keploy-recording", label: "Start Keploy Recording", level: 3 },
  { id: "generate-api-traffic", label: "Generate Testcases", level: 3 },
  { id: "stop-the-local-recording-session", label: "Stop Recording", level: 3 },
  { id: "check-the-local-generated-testcases", label: "Check Generated Testcases", level: 3 },
  { id: "replay-the-local-testcases", label: "Replay Local Testcases", level: 3 },
  { id: "keploy-test-replay-execution-workflow", label: "Replay Execution Workflow", level: 2 },
  { id: "conclusion", label: "Conclusion", level: 2 },
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
  troubleshooting,
  result,
  contents,
} as const;
