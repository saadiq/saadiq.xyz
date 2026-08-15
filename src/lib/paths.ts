// Route-path normalization shared by canonical URLs (BaseLayout) and nav
// active state (NavLinks). Static builds with `build.format: 'file'` see
// "/speaking.html" and "/index.html"; dev serves "/speaking" and "/".
export function normalizePath(pathname: string): string {
  return (
    pathname
      .replace(/\.html$/, "")
      .replace(/\/index$/, "")
      .replace(/\/$/, "") || "/"
  );
}
