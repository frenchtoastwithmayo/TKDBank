// TKD Bank App
(function () {
  const { resources, categories, getThumbnail, getEmbedUrl } = window.TKD_DATA;

  // State
  let currentView = "home";
  let currentCategory = null;
  let searchQuery = "";
  let activeResource = null;

  // DOM refs
  const app = document.getElementById("app");
  const modal = document.getElementById("modal");
  const modalBody = document.getElementById("modal-body");
  const mobileNav = document.getElementById("mobile-nav");
  const menuBtn = document.getElementById("menu-btn");

  // Helpers
  function countByCategory(name) {
    return resources.filter((r) => r.category === name).length;
  }

  function getRecent(limit = 6) {
    return [...resources]
      .filter((r) => r.videoUrl || (r.content && r.content.trim()))
      .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
      .slice(0, limit);
  }

  function searchResources(query) {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return resources.filter((r) => {
      return (
        r.title.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        (r.description && r.description.toLowerCase().includes(q)) ||
        (r.content && r.content.toLowerCase().includes(q))
      );
    });
  }

  function filterByCategory(name) {
    return resources.filter((r) => r.category === name);
  }

  // Icons (simple SVG)
  const icons = {
    patterns: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>`,
    sparring: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>`,
    block: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    corner: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>`,
    search: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>`,
    play: `<svg width="40" height="40" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
    close: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>`,
    back: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>`,
    menu: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>`,
  };

  // Render helpers
  function renderResourceCard(r) {
    const thumb = r.videoUrl ? getThumbnail(r.videoUrl) : null;
    const hasVideo = !!r.videoUrl;
    const hasText = r.content && r.content.trim();
    const isComingSoon = !hasVideo && !hasText;

    // Video cards get thumbnail; text-only cards are compact
    if (hasVideo) {
      return `
        <div class="resource-card" data-id="${r.id}">
          <div class="resource-thumb">
            <img src="${thumb}" alt="${r.title}" loading="lazy" />
            <div class="play-icon">${icons.play}</div>
          </div>
          <div class="resource-body">
            <div class="cat-label">${r.category}</div>
            <h3>${r.title}</h3>
            <p>${r.description || ""}</p>
          </div>
        </div>
      `;
    }

    // Text-only / Coming Soon cards (no fake video placeholder)
    return `
      <div class="resource-card resource-card-text" data-id="${r.id}">
        <div class="resource-body">
          <div class="cat-label">${r.category}</div>
          <h3>${r.title}</h3>
          <p>${hasText ? r.content : (r.description || "Coming Soon")}</p>
          ${isComingSoon ? '<span class="badge">Coming Soon</span>' : ''}
        </div>
      </div>
    `;
  }

  function renderCategoryCard(cat) {
    const count = countByCategory(cat.name);
    return `
      <div class="category-card" data-category="${cat.name}">
        <div class="count">${count} resource${count !== 1 ? "s" : ""}</div>
        <h3>${cat.name}</h3>
        <p>${cat.description}</p>
      </div>
    `;
  }

  // Views
  function renderHome() {
    const recent = getRecent(6);
    return `
      <section class="hero">
        <h1>Taekwondo Resource Bank</h1>
        <div class="hero-search">
          <input type="text" id="hero-search" placeholder="Search patterns, sparring..." autocomplete="off" />
          <button class="btn btn-primary" id="explore-btn">Explore</button>
        </div>
      </section>

      <section class="section" id="categories">
        <h2 class="section-title">Explore the Library</h2>
        <div class="category-grid">
          ${categories.map(renderCategoryCard).join("")}
        </div>
      </section>

      ${
        recent.length
          ? `<section class="section">
              <h2 class="section-title">Recently Added</h2>
              <div class="resource-grid">
                ${recent.map(renderResourceCard).join("")}
              </div>
            </section>`
          : ""
      }
    `;
  }

  function renderCategory(name) {
    const items = filterByCategory(name);
    return `
      <div class="page-header">
        <a href="#" class="back-link" data-action="home">${icons.back} Back</a>
        <h1>${name}</h1>
        <p>${items.length} resource${items.length !== 1 ? "s" : ""}</p>
      </div>
      <section class="section" style="padding-top:0">
        <div class="resource-grid">
          ${items.length ? items.map(renderResourceCard).join("") : '<div class="empty-state">No resources yet.</div>'}
        </div>
      </section>
    `;
  }

  function renderSearch(query) {
    const results = searchResources(query);
    return `
      <div class="page-header">
        <a href="#" class="back-link" data-action="home">${icons.back} Back</a>
        <h1>Search</h1>
        <div class="search-bar-container" style="margin-top:1rem">
          ${icons.search}
          <input type="text" id="search-input" value="${query}" placeholder="Search patterns, sparring..." autocomplete="off" />
        </div>
      </div>
      <section class="section" style="padding-top:0">
        ${
          results.length
            ? `<div class="resource-grid">${results.map(renderResourceCard).join("")}</div>`
            : `<div class="empty-state">No resources found. Try another search.</div>`
        }
      </section>
    `;
  }

  // Modal
  function openResource(id) {
    const r = resources.find((x) => x.id === id);
    if (!r) return;
    activeResource = r;

    const embed = r.videoUrl ? getEmbedUrl(r.videoUrl) : null;
    const hasText = r.content && r.content.trim();

    modalBody.innerHTML = `
      ${
        embed
          ? `<div class="modal-video">
              <iframe 
                src="${embed}" 
                title="${r.title}"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowfullscreen
                referrerpolicy="strict-origin-when-cross-origin"
                loading="lazy">
              </iframe>
            </div>`
          : ""
      }
      <div class="modal-content">
        <div class="cat">${r.category}</div>
        <h2>${r.title}</h2>
        ${r.description && r.description !== "Coming Soon" ? `<p>${r.description}</p>` : ""}
        ${
          hasText
            ? `<div class="modal-text-content">${r.content}</div>`
            : !embed
            ? `<div class="modal-text-content" style="color:var(--text-muted)">Coming Soon</div>`
            : ""
        }
      </div>
    `;
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("open");
    modalBody.innerHTML = "";
    document.body.style.overflow = "";
    activeResource = null;
  }

  // Navigation
  function navigate(view, param) {
    currentView = view;
    currentCategory = param || null;
    searchQuery = view === "search" ? param || "" : "";
    render();
    window.scrollTo(0, 0);
    // Update nav active
    document.querySelectorAll(".nav-links a, .mobile-nav a").forEach((a) => {
      a.classList.toggle("active", a.dataset.view === view && !param);
    });
    // Close mobile
    mobileNav.classList.remove("open");
  }

  function render() {
    if (currentView === "home") {
      app.innerHTML = renderHome();
    } else if (currentView === "category") {
      app.innerHTML = renderCategory(currentCategory);
    } else if (currentView === "search") {
      app.innerHTML = renderSearch(searchQuery);
    } else if (currentView === "patterns") {
      // Combined patterns view - show all pattern categories
      app.innerHTML = `
        <div class="page-header">
          <a href="#" class="back-link" data-action="home">${icons.back} Back</a>
          <h1>Patterns</h1>
        </div>
        <section class="section" style="padding-top:0">
          <div class="category-grid">
            ${categories
              .filter((c) => c.name.includes("Patterns") || c.name === "Koryo")
              .map(renderCategoryCard)
              .join("")}
          </div>
        </section>
      `;
    } else if (currentView === "sparring") {
      app.innerHTML = `
        <div class="page-header">
          <a href="#" class="back-link" data-action="home">${icons.back} Back</a>
          <h1>Sparring</h1>
        </div>
        <section class="section" style="padding-top:0">
          <div class="category-grid">
            ${categories
              .filter((c) => c.name.includes("Sparring") || c.name.includes("Block") || c.name.includes("Corner"))
              .map(renderCategoryCard)
              .join("")}
          </div>
        </section>
      `;
    } else if (currentView === "resources") {
      // All resources
      app.innerHTML = `
        <div class="page-header">
          <a href="#" class="back-link" data-action="home">${icons.back} Back</a>
          <h1>All Resources</h1>
          <p>${resources.length} total</p>
        </div>
        <section class="section" style="padding-top:0">
          <div class="resource-grid">
            ${resources.map(renderResourceCard).join("")}
          </div>
        </section>
      `;
    }

    bindEvents();
  }

  function bindEvents() {
    // Category cards
    app.querySelectorAll(".category-card").forEach((el) => {
      el.addEventListener("click", () => {
        navigate("category", el.dataset.category);
      });
    });

    // Resource cards
    app.querySelectorAll(".resource-card").forEach((el) => {
      el.addEventListener("click", () => {
        openResource(el.dataset.id);
      });
    });

    // Back links
    app.querySelectorAll("[data-action='home']").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        navigate("home");
      });
    });

    // Hero search — live search as you type
    const heroSearch = document.getElementById("hero-search");
    if (heroSearch) {
      let debounce;
      heroSearch.addEventListener("input", () => {
        clearTimeout(debounce);
        const q = heroSearch.value.trim();
        debounce = setTimeout(() => {
          if (q.length >= 1) {
            navigate("search", q);
          }
        }, 250);
      });
      heroSearch.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          const q = heroSearch.value.trim();
          if (q) navigate("search", q);
        }
      });
    }

    // Explore button
    const exploreBtn = document.getElementById("explore-btn");
    if (exploreBtn) {
      exploreBtn.addEventListener("click", () => {
        document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" });
      });
    }

    // Search page input
    const searchInput = document.getElementById("search-input");
    if (searchInput) {
      let debounce;
      searchInput.addEventListener("input", () => {
        clearTimeout(debounce);
        debounce = setTimeout(() => {
          navigate("search", searchInput.value);
          // Restore focus
          const newInput = document.getElementById("search-input");
          if (newInput) {
            newInput.focus();
            newInput.setSelectionRange(newInput.value.length, newInput.value.length);
          }
        }, 200);
      });
    }
  }

  // Global event listeners
  menuBtn.addEventListener("click", () => {
    mobileNav.classList.toggle("open");
  });

  document.querySelectorAll("[data-nav]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const view = el.dataset.nav;
      navigate(view);
    });
  });

  // Search icon in nav
  document.getElementById("nav-search")?.addEventListener("click", () => {
    navigate("search", "");
  });

  // Modal close
  document.getElementById("modal-close")?.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  // Init
  render();
})();
