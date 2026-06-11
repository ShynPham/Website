const data = window.profileData || {};

document.getElementById("year").textContent = new Date().getFullYear();

document.querySelectorAll("[data-profile]").forEach((node) => {
  const key = node.dataset.profile;
  if (data[key]) {
    node.textContent = data[key];
  }
});

if (data.name && data.title) {
  document.title = `${data.name} | ${data.title}`;
}

document.querySelectorAll("[data-profile-link]").forEach((link) => {
  const key = link.dataset.profileLink;
  if (key === "email" && data.email) {
    link.href = `mailto:${data.email}`;
    link.textContent = data.email;
  }
  if (key !== "email" && data[key]) {
    link.href = data[key];
  }
});

document.querySelectorAll("[data-project-index]").forEach((projectNode) => {
  const project = data.projects?.[Number(projectNode.dataset.projectIndex)];
  if (!project) return;

  projectNode.querySelector('[data-project-field="name"]').textContent = project.name;
  projectNode.querySelector('[data-project-field="description"]').textContent =
    project.description;
  projectNode.querySelector('[data-project-field="tech"]').textContent = project.tech;

  const image = projectNode.querySelector('[data-project-field="image"]');
  if (image && project.image) {
    image.src = project.image;
    image.alt = `${project.name} screenshot`;
    image.hidden = false;
  }
});

document.querySelectorAll(".filter").forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    document.querySelectorAll(".filter").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    document.querySelectorAll(".project").forEach((project) => {
      const tags = project.dataset.tags || "";
      const visible = filter === "all" || tags.includes(filter);
      project.classList.toggle("is-hidden", !visible);
    });
  });
});

const preview = document.getElementById("gallery-preview");
const caption = document.getElementById("gallery-caption");

document.querySelectorAll(".shot").forEach((shot) => {
  shot.addEventListener("click", () => {
    document.querySelectorAll(".shot").forEach((item) => item.classList.remove("active"));
    shot.classList.add("active");
    preview.src = shot.dataset.shot;
    preview.alt = shot.querySelector("img").alt;
    caption.textContent = shot.dataset.caption;
  });
});

document.querySelectorAll(".open-gallery").forEach((button) => {
  button.addEventListener("click", () => {
    document.getElementById("gallery").scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

document.querySelectorAll("[data-resume-download]").forEach((link) => {
  link.addEventListener("click", (event) => {
    const resumePath = link.getAttribute("href");
    const isMobileBrowser = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (resumePath && isMobileBrowser) {
      event.preventDefault();
      window.open(resumePath, "_blank", "noopener");
    }
  });
});

document.querySelectorAll(".magnetic").forEach((button) => {
  button.addEventListener("pointermove", (event) => {
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    button.style.transform = `translate(${x * 0.08}px, ${y * 0.12}px)`;
  });
  button.addEventListener("pointerleave", () => {
    button.style.transform = "";
  });
});

const revealItems = document.querySelectorAll(".section, .project, .hero-showcase");
revealItems.forEach((item) => item.classList.add("reveal"));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);

revealItems.forEach((item) => observer.observe(item));
