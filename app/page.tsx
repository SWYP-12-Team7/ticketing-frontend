import { Suspense } from "react";
import Calendar from "./components/Calendar";
import { CALENDAR_COPY } from "./components/calendar/calendar.copy";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-950 dark:bg-black dark:text-zinc-50">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-12">
        <header className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {CALENDAR_COPY.pageTitle}
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {CALENDAR_COPY.pageDescription}
          </p>
        </header>

        <Suspense
          fallback={
            <div className="w-full rounded-2xl border border-black/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-950">
              <div className="text-sm text-zinc-600 dark:text-zinc-300">
                {CALENDAR_COPY.loading}
              </div>
            </div>
          }
        >
          <Calendar />
        </Suspense>

        <footer className="pt-2 text-xs text-zinc-500 dark:text-zinc-500">
          {CALENDAR_COPY.demoFooter}
        </footer>
      </main>
    </div>
  );
}
