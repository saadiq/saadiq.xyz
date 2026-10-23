// Conference landing pages under /events/. While an event's window is open,
// every other page shows a dismissible toast pointing at its page (EventToast).
// The window is checked in the browser, so a toast turns itself off when the
// window closes, with no redeploy. Times carry their UTC offset: Eastern
// switches from -04:00 to -05:00 at 2am on Nov 1, 2026.
//
// Retire an event by deleting its page. nginx then 302s /events/<slug> to
// /?from=events (server/ghost-redirects.conf), and the toast explains.

export interface SiteEvent {
  slug: string;
  name: string;
  // Lead-in shown bold in the toast; the link text follows it.
  toast: string;
  showFrom: string;
  showUntil: string;
}

export const eventHref = (e: SiteEvent) => `/events/${e.slug}`;

export const events: SiteEvent[] = [
  {
    slug: "outliers",
    name: "Outliers Summit",
    toast: "At Outliers Summit this week?",
    showFrom: "2026-11-01T00:00:00-04:00",
    showUntil: "2026-11-10T00:00:00-05:00",
  },
];
