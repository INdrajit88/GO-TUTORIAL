/**
 * Configuration and structured content for the Keploy Go tutorial.
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

export const workflow = [
  { label: "API request", detail: "POST /url, then GET /<short-url>" },
  { label: "Go application", detail: "Echo handlers" },
  { label: "Keploy observes interaction", detail: "HTTP traffic and the PostgreSQL calls behind it" },
  { label: "Test case + mocks", detail: "keploy/test-set-0/" },
  { label: "Replay", detail: "keploy test" },
  { label: "Verification", detail: "Compare against the recorded behavior" },
] as const;

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
  workflow,
  screenshots,
  contents,
} as const;
