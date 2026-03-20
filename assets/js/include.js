async function loadPartial(selector, url) {
  const el = document.querySelector(selector);
  if (!el) return;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load ${url}`);
  el.innerHTML = await res.text();
}

function setActiveNav() {
  const current = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("#site-menu a").forEach(a => {
    const href = a.getAttribute("href") || "";
    if (href === current) a.classList.add("active");
  });
}

function wireHamburger() {
  const header = document.querySelector(".nav");
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.getElementById("site-menu");
  if (!header || !toggle || !menu) return;

  toggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  // Close menu after clicking a link (mobile)
  menu.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        header.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  });

  // Close menu if resizing to desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      header.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  // Optional: close menu when tapping outside (mobile)
  document.addEventListener("click", (e) => {
    if (window.innerWidth > 768) return;
    const clickedInside = header.contains(e.target);
    if (!clickedInside) {
      header.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}

function setFooterYear() {
  const y = document.getElementById("y");
  if (y) y.textContent = new Date().getFullYear();
}

(async function init() {
  try {
    await loadPartial("#site-header", "partials/header.html");
    await loadPartial("#site-footer", "partials/footer.html");

    setActiveNav();
    wireHamburger();
    setFooterYear();
  } catch (err) {
    console.error(err);
  }
})();