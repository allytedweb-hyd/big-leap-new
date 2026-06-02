/**
 * Smoothly scrolls to the #contact section on the current page.
 * If called from a different page, navigate to /#contact instead.
 */
export function scrollToContact() {
  const el = document.getElementById("contact");
  if (el) {
    const offset = window.innerWidth <= 768 ? 60 : 80;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  }
}

/**
 * Smoothly scrolls to any element by id.
 */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) {
    const offset = window.innerWidth <= 768 ? 60 : 80;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  }
}