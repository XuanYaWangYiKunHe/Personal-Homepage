const data = window.SITE_DATA;
let locale = "zh";

try {
  locale = localStorage.getItem("site-language") || "zh";
} catch (_) {
  locale = "zh";
}

const localized = (value) => {
  if (value && typeof value === "object" && !Array.isArray(value)) return value[locale] || value.zh || value.en;
  return value;
};

const setText = (id, value) => {
  const element = document.getElementById(id);
  if (element && value !== undefined) element.textContent = value;
};

function renderProfile() {
  const { profile } = data;
  const primaryName = locale === "zh" ? profile.nameZh : profile.nameEn;
  const secondaryName = locale === "zh" ? profile.nameEn : profile.nameZh;
  setText("nav-name", profile.nameEn.toUpperCase());
  setText("hero-name-zh", primaryName);
  setText("hero-name-en", secondaryName);
  setText("hero-intro", localized(profile.intro));
  setText("identity-initials", profile.initials || profile.nameEn.slice(0, 2).toUpperCase());
  setText("location", localized(profile.location));
  setText("about-lead", localized(profile.aboutLead));
  setText("about-detail", localized(profile.aboutDetail));
  setText("footer-name", primaryName);

  const affiliation = document.getElementById("affiliation-short");
  if (affiliation) {
    affiliation.replaceChildren(
      document.createTextNode(localized(profile.university)),
      document.createElement("br"),
      document.createTextNode(localized(profile.school))
    );
  }

  ["email-button", "contact-email"].forEach((id) => {
    const element = document.getElementById(id);
    if (element) element.href = `mailto:${profile.email}`;
  });
  setText("contact-email", profile.email);
  const profileEmail = document.getElementById("profile-email");
  if (profileEmail) {
    profileEmail.href = `mailto:${profile.email}`;
    profileEmail.textContent = profile.email;
  }

  const avatar = document.getElementById("identity-avatar");
  avatar.style.removeProperty("background-image");
  avatar.classList.remove("has-image");
  if (profile.avatar) {
    const avatarImage = new Image();
    avatarImage.onload = () => {
      avatar.style.backgroundImage = `url("${profile.avatar}")`;
      avatar.classList.add("has-image");
    };
    avatarImage.onerror = () => {
      console.error(`Unable to load avatar: ${profile.avatar}`);
    };
    avatarImage.src = profile.avatar;
  }
  document.title = `${primaryName} | Fudan University`;
}

function renderFocusKeywords() {
  const container = document.getElementById("hero-focus");
  if (!container) return;
  container.replaceChildren();
  data.profile.focusKeywords.forEach((keyword) => {
    const item = document.createElement("li");
    item.textContent = keyword;
    container.append(item);
  });
}

function renderHobbies() {
  const container = document.getElementById("hobby-list");
  if (!container) return;
  container.replaceChildren();
  data.profile.hobbies.forEach((hobby) => {
    const item = document.createElement("li");
    item.textContent = localized(hobby);
    container.append(item);
  });
}

function renderHeroLinks() {
  const container = document.getElementById("hero-links");
  container.replaceChildren();
  const linkByLabel = (label) => data.links.find((link) => link.label === label) || { label, url: "" };
  const github = linkByLabel("GitHub");
  const scholar = linkByLabel("Google Scholar");
  const orcid = linkByLabel("ORCID");
  const emptyValue = locale === "zh" ? "待补充" : "To be added";
  const entries = [
    { key: "email", label: "Email", value: data.profile.email, icon: "bi-envelope" },
    { key: "github", label: github.label, value: github.url, icon: "bi-github" },
    { key: "wechat", label: locale === "zh" ? "微信" : "WeChat", value: data.profile.wechat, icon: "bi-wechat" },
    { key: "phone", label: locale === "zh" ? "电话" : "Phone", value: data.profile.phone, icon: "bi-telephone" },
    { key: "scholar", label: scholar.label, value: scholar.url, icon: "bi-mortarboard" },
    { key: "orcid", label: orcid.label, value: orcid.url, icon: "bi-person-vcard" },
  ];

  entries.forEach((entry, index) => {
    const element = document.createElement("span");
    const displayValue = entry.value || emptyValue;
    const tooltipId = `hero-link-tooltip-${index}`;
    element.className = `hero-link hero-link--${entry.key} hover-contact${entry.value ? "" : " is-empty"}`;
    element.tabIndex = 0;
    element.setAttribute("aria-describedby", tooltipId);
    element.setAttribute("aria-label", `${entry.label}: ${displayValue}`);
    const code = document.createElement("b");
    const icon = document.createElement("i");
    const label = document.createElement("span");
    const tooltip = document.createElement("span");
    icon.className = `bi ${entry.icon}`;
    icon.setAttribute("aria-hidden", "true");
    code.append(icon);
    label.textContent = entry.label;
    tooltip.className = "hero-link-popover";
    tooltip.id = tooltipId;
    tooltip.setAttribute("role", "tooltip");
    tooltip.textContent = displayValue;
    element.append(code, label, tooltip);
    container.append(element);
  });
}

function renderFacts() {
  const container = document.getElementById("facts-list");
  if (!container) return;
  container.replaceChildren();
  data.facts.forEach((fact) => {
    const row = document.createElement("div");
    const term = document.createElement("dt");
    const detail = document.createElement("dd");
    term.textContent = localized(fact.label);
    detail.textContent = localized(fact.value);
    row.append(term, detail);
    container.append(row);
  });
}

function renderEducation() {
  const container = document.getElementById("education-list");
  container.replaceChildren();
  data.education.forEach((item) => {
    const article = document.createElement("article");
    article.className = "education-item";
    const logo = item.logo
      ? `<span class="education-logo education-logo--${item.logo.className}"><img src="${item.logo.src}" alt="${localized(item.logo.alt)}" /></span>`
      : "";
    article.innerHTML = `
      <div class="education-aside">
        <time>${item.period}</time>
        ${logo}
      </div>
      <div>
        <h3 class="education-title">
          <span class="education-major">${localized(item.major)}</span>
          <span class="education-degree">${localized(item.degree)}</span>
        </h3>
        <p class="education-school">${localized(item.institution)}</p>
        <p class="education-detail">${localized(item.detail)}</p>
      </div>
    `;
    container.append(article);
  });
}

function renderProjects() {
  const container = document.getElementById("project-list");
  const empty = document.getElementById("project-empty");
  const projects = data.projects || [];
  if (!container || !empty) return;
  container.replaceChildren();
  empty.hidden = projects.length > 0;
  projects.forEach((project, index) => {
    const article = document.createElement("article");
    article.className = "project-item";
    const labels = data.ui[locale];
    const pending = labels.valuePending;
    const organization = project.organization
      ? `<p class="project-organization">${localized(project.organization)}</p>`
      : "";
    const role = project.role
      ? `<p class="project-role">${localized(project.role)}</p>`
      : "";
    const detail = project.detail
      ? `<p class="project-detail">${localized(project.detail)}</p>`
      : "";
    const keywords = project.keywords?.length
      ? `<ul class="project-keywords">${project.keywords.map((keyword) => `<li>${keyword}</li>`).join("")}</ul>`
      : "";
    article.innerHTML = `
      <div class="project-aside" aria-hidden="true">
        <span>${String(index + 1).padStart(2, "0")}</span>
      </div>
      <div class="project-body">
        <h3>${localized(project.title)}</h3>
        <dl class="project-meta">
          <div><dt>${labels.projectTime}</dt><dd>${project.period || pending}</dd></div>
          <div><dt>${labels.projectNumber}</dt><dd>${localized(project.number) || pending}</dd></div>
          <div><dt>${labels.projectLevel}</dt><dd>${localized(project.level) || pending}</dd></div>
        </dl>
        ${role}
        ${organization}
        ${detail}
        ${keywords}
      </div>
    `;
    container.append(article);
  });
}

function renderResearch() {
  const container = document.getElementById("research-list");
  container.replaceChildren();
  container.classList.remove("has-expanded");
  data.research.forEach((item, index) => {
    const article = document.createElement("article");
    article.className = "research-item reveal visible";
    article.tabIndex = 0;
    article.setAttribute("role", "button");
    article.setAttribute("aria-expanded", "false");
    article.setAttribute("aria-label", `${localized(item.title)} · ${locale === "zh" ? "点击展开" : "Open details"}`);
    article.innerHTML = `
      <button class="research-close" type="button" aria-label="${locale === "zh" ? "关闭详细介绍" : "Close details"}">
        <span aria-hidden="true">×</span>
      </button>
      <div class="research-code">${item.code}</div>
      <div class="research-title">
        <h3>${localized(item.title)}</h3>
        <p>${item.subtitle}</p>
      </div>
      <p class="research-description">${localized(item.description)}</p>
      <ul class="keywords" aria-label="${locale === "zh" ? "关键词" : "Keywords"}">
        ${item.keywords.map((keyword) => `<li>${keyword}</li>`).join("")}
      </ul>
      <span class="research-arrow" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>
      <div class="research-expanded-content">
        <span>${locale === "zh" ? "DETAIL / 详细介绍" : "DETAIL / OVERVIEW"}</span>
        <p>${localized(item.detail)}</p>
      </div>
    `;
    const closeButton = article.querySelector(".research-close");
    const expand = () => {
      if (article.classList.contains("expanded")) return;
      const previous = container.querySelector(".research-item.expanded");
      if (previous) {
        previous.classList.remove("expanded");
        previous.setAttribute("aria-expanded", "false");
      }
      container.classList.add("has-expanded");
      article.classList.add("expanded");
      article.setAttribute("aria-expanded", "true");
      closeButton.focus({ preventScroll: true });
    };
    const collapse = () => {
      article.classList.remove("expanded");
      article.setAttribute("aria-expanded", "false");
      container.classList.remove("has-expanded");
      article.focus({ preventScroll: true });
    };
    article.addEventListener("click", (event) => {
      if (event.target.closest(".research-close")) return;
      expand();
    });
    article.addEventListener("keydown", (event) => {
      if (article.classList.contains("expanded") || (event.key !== "Enter" && event.key !== " ")) return;
      event.preventDefault();
      expand();
    });
    closeButton.addEventListener("click", (event) => {
      event.stopPropagation();
      collapse();
    });
    container.append(article);
  });
}

function setupResearchKeyboard() {
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const expanded = document.querySelector(".research-item.expanded");
    if (!expanded) return;
    expanded.querySelector(".research-close").click();
  });
}

function renderPublications() {
  const container = document.getElementById("publication-list");
  const empty = document.getElementById("publication-empty");
  container.replaceChildren();
  empty.hidden = data.publications.length > 0;
  data.publications.forEach((publication, index) => {
    const article = document.createElement("article");
    article.className = "publication reveal visible";
    const titleText = localized(publication.title);
    const title = publication.url
      ? `<a href="${publication.url}" target="_blank" rel="noreferrer">${titleText}</a>`
      : titleText;
    const authors = publication.authors
      ? `<p class="publication-authors">${publication.authors}</p>`
      : "";
    const venueText = [publication.venue, publication.year].filter(Boolean).join(" · ");
    const venue = venueText
      ? `<p class="publication-venue">${venueText}</p>`
      : "";
    article.innerHTML = `
      <span class="publication-index">[${index + 1}]</span>
      <div>
        <h3>${title}</h3>
        ${authors}
        ${venue}
      </div>
      <span class="publication-type">${publication.type || "PAPER"}</span>
    `;
    container.append(article);
  });
}

function renderAwards() {
  const container = document.getElementById("award-list");
  const empty = document.getElementById("award-empty");
  const awards = data.awards || [];
  container.replaceChildren();
  empty.hidden = awards.length > 0;
  awards.forEach((award, index) => {
    const article = document.createElement("article");
    article.className = "award reveal visible";
    article.innerHTML = `
      <span class="award-index">[${index + 1}]</span>
      <div>
        <h3>${localized(award.title)}</h3>
        ${award.issuer ? `<p class="award-issuer">${localized(award.issuer)}</p>` : ""}
        ${award.detail ? `<p class="award-detail">${localized(award.detail)}</p>` : ""}
      </div>
      <time>${award.year || award.period || ""}</time>
    `;
    container.append(article);
  });
}

function renderLinks() {
  const container = document.getElementById("social-links");
  container.replaceChildren();
  data.links.forEach((link) => {
    const element = document.createElement(link.url ? "a" : "span");
    element.className = link.url ? "" : "is-empty";
    if (link.url) {
      element.href = link.url;
      element.target = "_blank";
      element.rel = "noreferrer";
      element.textContent = `${link.label} ↗`;
    } else {
      element.textContent = `${link.label} · ${locale === "zh" ? "待补充" : "TO ADD"}`;
      element.title = locale === "zh" ? "在 site-data.js 中补充链接" : "Add this URL in site-data.js";
    }
    container.append(element);
  });
  container.hidden = false;
}

function renderLanguage() {
  document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
  const dictionary = data.ui[locale];
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (dictionary[key]) element.textContent = dictionary[key];
  });

  const toggle = document.getElementById("language-toggle");
  toggle.innerHTML = locale === "zh"
    ? '<span class="language-active">中</span><span class="language-divider">/</span><span>EN</span>'
    : '<span>ZH</span><span class="language-divider">/</span><span class="language-active">EN</span>';
  toggle.setAttribute("aria-label", locale === "zh" ? "Switch to English" : "切换至中文");

  renderProfile();
  renderFocusKeywords();
  renderHobbies();
  renderHeroLinks();
  renderFacts();
  renderEducation();
  renderProjects();
  renderResearch();
  renderPublications();
  renderAwards();
  renderLinks();
  if (window.FUDAN_PARTICLES) window.FUDAN_PARTICLES.setLocale(locale);
}

function setupLanguageToggle() {
  document.getElementById("language-toggle").addEventListener("click", () => {
    locale = locale === "zh" ? "en" : "zh";
    try { localStorage.setItem("site-language", locale); } catch (_) {}
    renderLanguage();
  });
}

function setupNavigation() {
  const button = document.querySelector(".menu-button");
  const menu = document.getElementById("mobile-nav");
  button.addEventListener("click", () => {
    const open = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!open));
    menu.hidden = open;
    document.body.classList.toggle("menu-open", !open);
  });
  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.hidden = true;
      button.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    });
  });
}

function setupFloatingHeader() {
  const header = document.querySelector(".site-header");
  let scheduled = false;
  const update = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 32);
    scheduled = false;
  };
  window.addEventListener("scroll", () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(update);
  }, { passive: true });
  update();
}

function setupReveals() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll(".reveal").forEach((element) => element.classList.add("visible"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
}

setupNavigation();
setupFloatingHeader();
setupLanguageToggle();
setupResearchKeyboard();
renderLanguage();
setupReveals();
setText("current-year", new Date().getFullYear());
