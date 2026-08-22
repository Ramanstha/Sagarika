/* ================================================
   Portfolio — Main JavaScript
   ================================================ */

document.addEventListener("DOMContentLoaded", () => {

  // ---- Floating particles in hero ----
  const hero = document.getElementById("hero");
  if (hero) {
    const colors = ["rgba(124,92,252,.4)", "rgba(0,212,170,.35)", "rgba(155,128,255,.3)"];
    for (let i = 0; i < 18; i++) {
      const p = document.createElement("span");
      p.classList.add("hero-particle");
      const size = Math.random() * 6 + 3;
      p.style.width = size + "px";
      p.style.height = size + "px";
      p.style.left = Math.random() * 100 + "%";
      p.style.bottom = -(Math.random() * 40) + "px";
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      p.style.animationDuration = (Math.random() * 10 + 8) + "s";
      p.style.animationDelay = (Math.random() * 8) + "s";
      hero.appendChild(p);
    }
  }

  // ---- Navbar scroll effect ----
  const navbar = document.getElementById("navbar");
  const handleNavScroll = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 40);
  };
  window.addEventListener("scroll", handleNavScroll, { passive: true });

  // ---- Mobile hamburger menu ----
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    navLinks.classList.toggle("open");
  });

  // Close menu on link click
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("open");
      navLinks.classList.remove("open");
    });
  });

  // ---- Active nav link on scroll ----
  const sections = document.querySelectorAll("section[id]");
  const navAnchors = navLinks.querySelectorAll("a:not(.btn)");

  const highlightNav = () => {
    const scrollY = window.scrollY + 120;
    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute("id");
      if (scrollY >= top && scrollY < top + height) {
        navAnchors.forEach((a) => a.classList.remove("active"));
        const active = navLinks.querySelector(`a[href="#${id}"]`);
        if (active) active.classList.add("active");
      }
    });
  };
  window.addEventListener("scroll", highlightNav, { passive: true });

  // ---- Scroll-triggered animation engine ----
  const triggerPoint = () => window.innerHeight * 0.87;

  // Generic reveal (about-grid, contact-grid, skill-categories)
  document.querySelectorAll(".about-grid").forEach(el => {
    el.classList.add("reveal", "reveal-up");
  });
  document.querySelectorAll(".contact-grid").forEach(el => {
    el.classList.add("reveal", "reveal-scale");
  });

  // Skill categories — stagger children tags
  document.querySelectorAll(".skills-categories").forEach(el => {
    el.classList.add("reveal", "reveal-up");
  });

  // Section title underline animation
  const sectionTitles = document.querySelectorAll(".section-title");

  // Skill tag pop-in
  const allSkillTags = document.querySelectorAll(".skill-tag");

  // Timeline items
  const timelineItems = document.querySelectorAll(".timeline-item");

  // Education cards
  const eduCards = document.querySelectorAll(".edu-card");

  // Footer socials
  const footerSocials = document.querySelector(".footer-socials");

  // Footer CTA
  const footerCTA = document.querySelector(".footer-cta-inner");
  if (footerCTA) {
    footerCTA.classList.add("reveal", "reveal-up");
  }

  // Master scroll handler
  const animateOnScroll = () => {
    const trigger = triggerPoint();

    // Reveal elements
    document.querySelectorAll(".reveal").forEach((el) => {
      if (el.getBoundingClientRect().top < trigger) {
        el.classList.add("visible");
      }
    });

    // Section title underlines
    sectionTitles.forEach((title) => {
      if (title.getBoundingClientRect().top < trigger) {
        title.classList.add("line-visible");
      }
    });

    // Skill tags pop-in with stagger
    allSkillTags.forEach((tag, i) => {
      if (tag.getBoundingClientRect().top < trigger && !tag.classList.contains("pop-in")) {
        setTimeout(() => tag.classList.add("pop-in"), i * 40);
      }
    });

    // Timeline slide-in with stagger
    timelineItems.forEach((item, i) => {
      if (item.getBoundingClientRect().top < trigger && !item.classList.contains("slide-in")) {
        setTimeout(() => item.classList.add("slide-in"), i * 150);
      }
    });

    // Education cards zoom with stagger
    eduCards.forEach((card, i) => {
      if (card.getBoundingClientRect().top < trigger && !card.classList.contains("zoom-in")) {
        setTimeout(() => card.classList.add("zoom-in"), i * 120);
      }
    });

    // Footer socials
    if (footerSocials && footerSocials.getBoundingClientRect().top < trigger) {
      footerSocials.classList.add("animate");
    }
  };

  window.addEventListener("scroll", animateOnScroll, { passive: true });
  animateOnScroll(); // run once on load

  // ---- Counter animation for stats ----
  const counters = document.querySelectorAll(".stat-number[data-count]");
  let countersDone = false;

  const animateCounters = () => {
    if (countersDone) return;
    const aboutSection = document.getElementById("about");
    if (!aboutSection) return;
    const rect = aboutSection.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      countersDone = true;
      counters.forEach((counter) => {
        const target = +counter.dataset.count;
        let current = 0;
        const step = Math.ceil(target / 40);
        const interval = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(interval);
          }
          counter.textContent = current;
        }, 30);
      });
    }
  };
  window.addEventListener("scroll", animateCounters, { passive: true });

  // ---- Smooth tilt on card hover ----
  const tiltCards = document.querySelectorAll(".skill-category, .edu-card.zoom-in");
  document.addEventListener("mousemove", (e) => {
    document.querySelectorAll(".skill-category").forEach(card => {
      const rect = card.getBoundingClientRect();
      const inCard =
        e.clientX >= rect.left && e.clientX <= rect.right &&
        e.clientY >= rect.top && e.clientY <= rect.bottom;
      if (inCard) {
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * -6;
        card.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${y}deg) translateY(-4px)`;
      } else {
        card.style.transform = "";
      }
    });
  });

  // ---- Contact form (demo handler) ----
  const form = document.getElementById("contactForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = form.querySelector("button[type=submit]");
    const originalText = btn.textContent;
    btn.textContent = "Message Sent! ✓";
    btn.disabled = true;
    btn.style.background = "#00d4aa";
    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;
      btn.style.background = "";
      form.reset();
    }, 3000);
  });

  // ---- Newsletter form (demo handler) ----
  const newsletter = document.getElementById("newsletterForm");
  if (newsletter) {
    newsletter.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = newsletter.querySelector("input");
      const btn = newsletter.querySelector("button");
      input.value = "Subscribed! ✓";
      input.disabled = true;
      btn.style.background = "#00d4aa";
      setTimeout(() => {
        input.value = "";
        input.disabled = false;
        btn.style.background = "";
      }, 3000);
    });
  }
});
