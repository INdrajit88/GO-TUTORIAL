"use client";

import { useState } from "react";
import { FileCode2, Database, Check, Copy } from "lucide-react";

export function TestMockComparison() {
  const [activeTab, setActiveTab] = useState<"test" | "mock">("test");
  const [copied, setCopied] = useState(false);

  const testContent = `version: api.keploy.io/v1beta1
kind: Http
name: post-url-1
spec:
  metadata: {}
  req:
    method: POST
    proto_major: 1
    proto_minor: 1
    url: http://localhost:8082/url
    header:
      Content-Type: application/json
    body: '{"url":"https://github.com"}'
  resp:
    status_code: 200
    header:
      Content-Type: application/json; charset=UTF-8
    body: '{"ts":1647802058801841100,"url":"http://localhost:8082/GuwHCgoQ"}'
  objects: []
  assertions:
    noise:
      - body.ts # Timestamps fluctuate; Keploy ignores them during comparison`;

  const mockContent = `version: api.keploy.io/v1beta1
kind: Postgres
name: mocks
spec:
  metadata:
    operation: INSERT INTO urls
  postgresRequests:
    - header:
        type: Query
      message:
        query: "INSERT INTO urls(url, short_url) VALUES($1, $2) RETURNING id"
        args:
          - "https://github.com"
          - "GuwHCgoQ"
  postgresResponses:
    - header:
        type: CommandComplete
      message:
        rows_affected: 1
        last_insert_id: 42`;

  const currentCode = activeTab === "test" ? testContent : mockContent;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-8 rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
      {/* Header with Switcher Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-muted/60 border-b border-border">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("test")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              activeTab === "test"
                ? "bg-brand/15 text-brand border border-brand/40 shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <FileCode2 className="size-3.5" />
            <span>tests/post-url-1.yaml</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-background text-muted-foreground border border-border">
              HTTP Contract
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("mock")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              activeTab === "mock"
                ? "bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/40 shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <Database className="size-3.5" />
            <span>mocks.yaml</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-background text-muted-foreground border border-border">
              PostgreSQL Wire Protocol
            </span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-background hover:bg-accent text-foreground text-xs font-mono border border-border transition-colors cursor-pointer"
          title="Copy file content"
        >
          {copied ? (
            <>
              <Check className="size-3.5 text-emerald-500" />
              <span className="text-emerald-500 font-medium">Copied</span>
            </>
          ) : (
            <>
              <Copy className="size-3.5 text-muted-foreground" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Explanation Banner */}
      <div className="px-5 py-2.5 bg-muted/30 border-b border-border text-xs text-muted-foreground flex items-center justify-between">
        {activeTab === "test" ? (
          <p className="m-0">
            <strong className="text-foreground">The Test Case:</strong> Records the public HTTP interaction (method, payload, status code, response headers). Keploy fires this exact request during test replay.
          </p>
        ) : (
          <p className="m-0">
            <strong className="text-purple-600 dark:text-purple-300">The Mock:</strong> Records the binary protocol exchanges between Go and PostgreSQL. Keploy returns this canned response so you never need a running database during test replay!
          </p>
        )}
      </div>

      {/* Code Display */}
      <div className="p-5 overflow-x-auto text-xs font-mono leading-relaxed bg-muted/10">
        <pre className="!bg-transparent !p-0 !m-0 !border-0 text-foreground">
          <code>{currentCode}</code>
        </pre>
      </div>
    </div>
  );
}

export default TestMockComparison;
