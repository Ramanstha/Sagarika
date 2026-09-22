/* ================================================
   Portfolio — Main JavaScript
   ================================================ */

(() => {
  "use strict";

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer  = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ------------------------------------------------
     Footer year
     ------------------------------------------------ */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ------------------------------------------------
     Typewriter on hero title (looping)
     The markup already contains the full text, so the
     headline is readable if JS never runs.
     ------------------------------------------------ */
  const typedTitle = $("#typed-title");
  if (typedTitle && !reduceMotion) {
    const text = typedTitle.textContent.trim() || "Accounting & Financial Management Assistant";
    let i = 0;
    let deleting = false;
    typedTitle.textContent = "";
    typedTitle.classList.add("typing");

    const loop = () => {
      if (!deleting) {
        typedTitle.textContent = text.slice(0, ++i);
        if (i === text.length) {
          deleting = true;
          return setTimeout(loop, 1800);
        }
      } else {
        typedTitle.textContent = text.slice(0, --i);
        if (i === 0) {
          deleting = false;
          return setTimeout(loop, 500);
        }
      }
      setTimeout(loop, deleting ? 25 : 60);
    };
    setTimeout(loop, 1300);
  }

  /* ------------------------------------------------
     Floating particles in hero
     Count scales with screen size; skipped entirely on
     small screens and when reduced motion is requested.
     ------------------------------------------------ */
  const hero = $("#hero");
  if (hero && !reduceMotion && window.innerWidth > 600) {
    const colors = ["rgba(124,92,252,.4)", "rgba(0,212,170,.35)", "rgba(155,128,255,.3)"];
    const count = window.innerWidth > 1024 ? 18 : 10;
    const frag = document.createDocumentFragment();

    for (let n = 0; n < count; n++) {
      const p = document.createElement("span");
      p.className = "hero-particle";
      const size = Math.random() * 6 + 3;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.left = `${Math.random() * 100}%`;
      p.style.bottom = `${-(Math.random() * 40)}px`;
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      p.style.animationDuration = `${Math.random() * 10 + 8}s`;
      p.style.animationDelay = `${Math.random() * 8}s`;
      frag.appendChild(p);
    }
    hero.appendChild(frag);
  }

  /* ------------------------------------------------
     Mobile navigation drawer
     ------------------------------------------------ */
  const navbar    = $("#navbar");
  const hamburger = $("#hamburger");
  const navLinks  = $("#navLinks");
  const backdrop  = $("#navBackdrop");

  const setMenu = (open) => {
    if (!hamburger || !navLinks) return;
    hamburger.classList.toggle("open", open);
    navLinks.classList.toggle("open", open);
    hamburger.setAttribute("aria-expanded", String(open));
    hamburger.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
    document.body.classList.toggle("nav-open", open);

    if (backdrop) {
      if (open) {
        backdrop.hidden = false;
        requestAnimationFrame(() => backdrop.classList.add("show"));
      } else {
        backdrop.classList.remove("show");
        setTimeout(() => { backdrop.hidden = true; }, 300);
      }
    }
  };

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      setMenu(!navLinks.classList.contains("open"));
    });

    // Close on link tap
    $$("a", navLinks).forEach((link) => {
      link.addEventListener("click", () => setMenu(false));
    });

    // Close on backdrop tap
    if (backdrop) backdrop.addEventListener("click", () => setMenu(false));

    // Close on Escape, returning focus to the toggle
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navLinks.classList.contains("open")) {
        setMenu(false);
        hamburger.focus();
      }
    });

    // Close if the viewport grows past the mobile breakpoint while open
    const desktop = window.matchMedia("(min-width: 769px)");
    const onBreakpoint = (e) => { if (e.matches) setMenu(false); };
    desktop.addEventListener
      ? desktop.addEventListener("change", onBreakpoint)
      : desktop.addListener(onBreakpoint);
  }

  /* ------------------------------------------------
     Scroll-driven UI (navbar state + active link)
     One rAF-throttled listener instead of several
     unthrottled ones — much smoother on phones.
     ------------------------------------------------ */
  const sections   = $$("section[id]");
  const navAnchors = navLinks ? $$("a:not(.btn)", navLinks) : [];

  const updateOnScroll = () => {
    const y = window.scrollY;

    if (navbar) navbar.classList.toggle("scrolled", y > 40);

    if (navAnchors.length) {
      let currentId = "";
      const probe = y + (window.innerHeight * 0.3);
      sections.forEach((sec) => {
        if (probe >= sec.offsetTop && probe < sec.offsetTop + sec.offsetHeight) {
          currentId = sec.id;
        }
      });
      // Bottom of the page always highlights the last section
      if (y + window.innerHeight >= document.documentElement.scrollHeight - 2) {
        currentId = sections.length ? sections[sections.length - 1].id : currentId;
      }
      navAnchors.forEach((a) => {
        const isActive = a.getAttribute("href") === `#${currentId}`;
        a.classList.toggle("active", isActive);
        if (isActive) {
          a.setAttribute("aria-current", "true");
        } else {
          a.removeAttribute("aria-current");
        }
      });
    }
  };

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateOnScroll();
      ticking = false;
    });
  }, { passive: true });
  updateOnScroll();

  /* ------------------------------------------------
     Scroll reveal via IntersectionObserver
     (no layout thrash, and it unobserves once done)
     ------------------------------------------------ */
  $$(".about-grid").forEach((el) => el.classList.add("reveal", "reveal-up"));
  $$(".contact-grid").forEach((el) => el.classList.add("reveal", "reveal-scale"));
  $$(".skills-categories").forEach((el) => el.classList.add("reveal", "reveal-up"));
  const footerCTA = $(".footer-cta-inner");
  if (footerCTA) footerCTA.classList.add("reveal", "reveal-up");

  // Elements that animate in, paired with the class to add and a stagger step (ms)
  const groups = [
    { els: $$(".reveal"),        cls: "visible",      step: 0 },
    { els: $$(".section-title"), cls: "line-visible", step: 0 },
    { els: $$(".skill-tag"),     cls: "pop-in",       step: 40 },
    { els: $$(".timeline-item"), cls: "slide-in",     step: 150 },
    { els: $$(".edu-card"),      cls: "zoom-in",      step: 120 },
    { els: $$(".footer-socials"),cls: "animate",      step: 0 }
  ];

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const { cls, delay } = entry.target.dataset;
        const ms = Number(delay) || 0;
        if (ms) {
          setTimeout(() => entry.target.classList.add(cls), ms);
        } else {
          entry.target.classList.add(cls);
        }
        obs.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });

    groups.forEach(({ els, cls, step }) => {
      els.forEach((el, i) => {
        el.dataset.cls = cls;
        el.dataset.delay = String(i % 8 * step);   // stagger resets per visual row
        observer.observe(el);
      });
    });
  } else {
    // No IntersectionObserver — show everything rather than leaving it invisible
    groups.forEach(({ els, cls }) => els.forEach((el) => el.classList.add(cls)));
  }

  /* ------------------------------------------------
     Counter animation for stats (if present)
     ------------------------------------------------ */
  const counters = $$(".stat-number[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    const countObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = Number(el.dataset.count) || 0;
        const step = Math.max(1, Math.ceil(target / 40));
        let current = 0;
        const id = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = String(current);
          if (current >= target) clearInterval(id);
        }, 30);
        obs.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach((c) => countObserver.observe(c));
  }

  /* ------------------------------------------------
     Card tilt — pointer devices only.
     Bound per card and rAF-throttled, so it no longer
     measures every card on every mouse move (and no
     longer fights CSS hover on touch screens).
     ------------------------------------------------ */
  if (finePointer && !reduceMotion) {
    $$(".skill-category").forEach((card) => {
      let frame = null;

      card.addEventListener("mousemove", (e) => {
        if (frame) return;
        frame = requestAnimationFrame(() => {
          const rect = card.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
          const y = ((e.clientY - rect.top) / rect.height - 0.5) * -6;
          card.style.transform =
            `perspective(600px) rotateY(${x}deg) rotateX(${y}deg) translateY(-4px)`;
          frame = null;
        });
      });

      card.addEventListener("mouseleave", () => {
        if (frame) { cancelAnimationFrame(frame); frame = null; }
        card.style.transform = "";
      });
    });
  }

  /* ------------------------------------------------
     Contact form (front-end demo handler)
     Note: this does not send mail anywhere. Wire it to
     a backend or a service like Formspree to go live.
     ------------------------------------------------ */
  const form = $("#contactForm");
  if (form) {
    const status = $("#formStatus");

    const showError = (field, message) => {
      field.setAttribute("aria-invalid", "true");
      let err = field.parentElement.querySelector(".form-error");
      if (!err) {
        err = document.createElement("span");
        err.className = "form-error";
        field.parentElement.appendChild(err);
      }
      err.textContent = message;
    };

    const clearError = (field) => {
      field.removeAttribute("aria-invalid");
      const err = field.parentElement.querySelector(".form-error");
      if (err) err.remove();
    };

    $$("input, textarea", form).forEach((field) => {
      field.addEventListener("input", () => clearError(field));
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name    = $("#name", form);
      const email   = $("#email", form);
      const message = $("#message", form);
      let valid = true;

      [name, email, message].forEach(clearError);

      if (!name.value.trim()) {
        showError(name, "Please enter your name.");
        valid = false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) {
        showError(email, "Please enter a valid email address.");
        valid = false;
      }
      if (message.value.trim().length < 10) {
        showError(message, "Please write at least 10 characters.");
        valid = false;
      }

      if (!valid) {
        if (status) {
          status.textContent = "Please fix the highlighted fields.";
          status.className = "form-status error";
        }
        form.querySelector("[aria-invalid='true']").focus();
        return;
      }

      const btn = form.querySelector("button[type=submit]");
      const originalText = btn.textContent;
      btn.textContent = "Message Sent! ✓";
      btn.disabled = true;
      btn.style.background = "var(--clr-accent)";
      if (status) {
        status.textContent = "Thanks! Your message has been recorded.";
        status.className = "form-status success";
      }

      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
        btn.style.background = "";
        if (status) {
          status.textContent = "";
          status.className = "form-status";
        }
        form.reset();
      }, 3000);
    });
  }

  /* ------------------------------------------------
     Newsletter form (front-end demo handler)
     ------------------------------------------------ */
  const newsletter = $("#newsletterForm");
  if (newsletter) {
    const status = $("#newsletterStatus");

    newsletter.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = newsletter.querySelector("input");
      if (!input) return;

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value.trim())) {
        if (status) {
          status.textContent = "Please enter a valid email address.";
          status.className = "form-status error";
        }
        input.focus();
        return;
      }

      const btn = newsletter.querySelector("button");
      input.value = "";
      input.disabled = true;
      if (btn) btn.style.background = "var(--clr-accent)";
      if (status) {
        status.textContent = "Subscribed! ✓";
        status.className = "form-status success";
      }

      setTimeout(() => {
        input.disabled = false;
        if (btn) btn.style.background = "";
        if (status) {
          status.textContent = "";
          status.className = "form-status";
        }
      }, 3000);
    });
  }
})();
