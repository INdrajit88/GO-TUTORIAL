"use client";

import { useState } from "react";
import { Server, Database, ShieldCheck, AlertCircle } from "lucide-react";

export function NetworkArchitecture() {
  const [selectedHost, setSelectedHost] = useState<"postgres" | "localhost">("postgres");

  return (
    <div className="my-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-border">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-brand">
            Interactive Network Visualizer
          </span>
          <h4 className="text-base font-bold text-foreground">
            Docker Compose Hostname Resolution
          </h4>
        </div>

        {/* Toggle host configuration */}
        <div className="flex items-center gap-1.5 p-1 bg-muted rounded-xl border border-border">
          <button
            type="button"
            onClick={() => setSelectedHost("postgres")}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
              selectedHost === "postgres"
                ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            host = &quot;postgres&quot; (Valid)
          </button>
          <button
            type="button"
            onClick={() => setSelectedHost("localhost")}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
              selectedHost === "localhost"
                ? "bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/40 shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            host = &quot;localhost&quot; (Broken)
          </button>
        </div>
      </div>

      {/* Network Nodes Diagram */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Host Machine / Client */}
        <div className="rounded-xl border border-border bg-muted/60 p-4 text-center">
          <span className="inline-block p-2 rounded-lg bg-sky-500/10 text-sky-500 dark:text-sky-400 mb-2">
            <Server className="size-5 mx-auto" />
          </span>
          <div className="text-xs font-bold text-foreground">Local Workstation</div>
          <div className="text-[11px] font-mono text-muted-foreground mt-1">cURL / Browser</div>
          <div className="mt-2 text-[10px] font-mono px-2 py-0.5 rounded bg-background text-sky-600 dark:text-sky-300 border border-border">
            http://localhost:8082
          </div>
        </div>

        {/* Go Echo App Container */}
        <div className="rounded-xl border border-border bg-muted/60 p-4 text-center relative">
          <span className="inline-block p-2 rounded-lg bg-brand/10 text-brand mb-2">
            <Server className="size-5 mx-auto" />
          </span>
          <div className="text-xs font-bold text-foreground">echoApp Container</div>
          <div className="text-[11px] font-mono text-muted-foreground mt-1">Go + Echo Binary</div>
          <div className="mt-2 text-[10px] font-mono px-2 py-0.5 rounded bg-background text-brand border border-border">
            Internal IP: 172.20.0.3
          </div>
        </div>

        {/* PostgreSQL Database Container */}
        <div className={`rounded-xl border p-4 text-center transition-all ${
          selectedHost === "postgres"
            ? "border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-950/20"
            : "border-rose-500/40 bg-rose-500/5 dark:bg-rose-950/20"
        }`}>
          <span className={`inline-block p-2 rounded-lg mb-2 ${
            selectedHost === "postgres" ? "bg-emerald-500/20 text-emerald-500" : "bg-rose-500/20 text-rose-500"
          }`}>
            <Database className="size-5 mx-auto" />
          </span>
          <div className="text-xs font-bold text-foreground">postgresDb Container</div>
          <div className="text-[11px] font-mono text-muted-foreground mt-1">PostgreSQL 14:5432</div>
          <div className="mt-2 text-[10px] font-mono px-2 py-0.5 rounded bg-background text-muted-foreground border border-border">
            DNS Alias: &quot;postgres&quot;
          </div>
        </div>
      </div>

      {/* Dynamic Status Feedback */}
      <div className={`mt-6 p-4 rounded-xl border text-xs leading-relaxed flex items-start gap-3 ${
        selectedHost === "postgres"
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
          : "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300"
      }`}>
        {selectedHost === "postgres" ? (
          <>
            <ShieldCheck className="size-5 shrink-0 text-emerald-500 mt-0.5" />
            <div>
              <strong className="text-emerald-800 dark:text-emerald-200">Connection Successful:</strong> When configured with <code className="font-mono bg-background/80 px-1 py-0.5 rounded border border-border">host = &quot;postgres&quot;</code>, Docker Compose&apos;s embedded DNS server resolves the service name to the database container&apos;s private IP address on the virtual bridge network. Keploy can intercept and record all SQL packets.
            </div>
          </>
        ) : (
          <>
            <AlertCircle className="size-5 shrink-0 text-rose-500 mt-0.5" />
            <div>
              <strong className="text-rose-800 dark:text-rose-200">Connection Refused (Bug):</strong> When set to <code className="font-mono bg-background/80 px-1 py-0.5 rounded border border-border">host = &quot;localhost&quot;</code>, the Go process inside <code className="font-mono">echoApp</code> tries to connect to port 5432 on its own local loopback interface (127.0.0.1), where no PostgreSQL server is listening! The app crashes on startup.
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default NetworkArchitecture;
