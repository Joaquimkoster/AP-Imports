export function scrollToSection(event, sectionId) {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const target = document.getElementById(sectionId);
  if (!target) return;

  event.preventDefault();
  const hash = `#${sectionId}`;
  if (window.location.hash !== hash) {
    window.history.pushState(null, "", hash);
  }
  target.scrollIntoView({
    block: "start",
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
  });
}
