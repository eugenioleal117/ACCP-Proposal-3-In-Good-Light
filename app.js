const root = document.documentElement;
const theme = document.querySelector("#theme");

function setTheme(value) {
  const night = value === "night";
  root.dataset.theme = value;
  theme.setAttribute("aria-label", night ? "Switch to light mode" : "Switch to dark mode");
  theme.querySelector("use").setAttribute("href", night ? "#sun" : "#moon");
}
try {
  setTheme(localStorage.getItem("accp-proposal-03-theme") === "night" ? "night" : "day");
} catch {
  setTheme("day");
}
theme.addEventListener("click", () => {
  const value = root.dataset.theme === "night" ? "day" : "night";
  setTheme(value);
  try { localStorage.setItem("accp-proposal-03-theme", value); } catch {}
});

const studies = [
  {
    title: "The courtyard house", type: "Custom home", image: "courtyard-study.jpg",
    alt: "Sunlit courtyard with limestone arches and an olive tree",
    description: "An arcade frames an open courtyard. Deep shade and an olive tree give the rooms a sheltered outdoor space to open onto.",
  },
  {
    title: "The walnut room", type: "Renovation", image: "walnut-room.jpg",
    alt: "Renovated room with sage cabinetry, walnut joinery and terracotta floors",
    description: "Walnut joinery, muted sage cabinetry and a terracotta floor tie the kitchen to the adjoining room.",
  },
  {
    title: "The Gulf pavilion", type: "Outdoor living", image: "gulf-pavilion.jpg",
    alt: "Coastal pavilion with blue tile and pale limestone",
    description: "A timber roof shelters a coastal gathering space. Blue glazed tile brings the color of the water into the shade.",
  },
  {
    title: "The limestone stair", type: "Interior detail", image: "limestone-stair.jpg",
    alt: "Limestone stair and walnut details in late afternoon sunlight",
    description: "Solid limestone treads meet a walnut balustrade. Afternoon light shows the grain, joints and finish at each turn.",
  },
];

const heroImage = document.querySelector("#hero-image");
const heroCaption = document.querySelector("#cover-caption");
const coverButtons = [...document.querySelectorAll("[data-view]")];
const coverViews = [
  { title: "Limestone courtyard", image: "courtyard-cover.jpg", alt: heroImage.alt },
  ...studies.slice(1),
];
coverButtons.forEach((button, index) => button.addEventListener("click", () => {
  if (button.getAttribute("aria-pressed") === "true") return;
  coverButtons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
  const view = coverViews[index];
  heroImage.src = view.image;
  heroImage.alt = view.alt;
  heroCaption.textContent = `0${index + 1} / ${view.title}`;
  heroImage.classList.remove("changed");
  requestAnimationFrame(() => requestAnimationFrame(() => heroImage.classList.add("changed")));
}));

const studyDialog = document.querySelector("#study-dialog");
let activeStudy = 0;
function setStudy(index, announce = true) {
  activeStudy = (index + studies.length) % studies.length;
  const study = studies[activeStudy];
  const image = document.querySelector("#study-image");
  image.src = study.image;
  image.alt = study.alt;
  document.querySelector("#study-type").textContent = `0${activeStudy + 1} / ${study.type}`;
  document.querySelector("#study-title").textContent = study.title;
  document.querySelector("#study-description").textContent = study.description;
  document.querySelector("#study-status").textContent = announce ? `Study ${activeStudy + 1} of ${studies.length}: ${study.title}` : "";
}
document.querySelectorAll("[data-study]").forEach((button) => button.addEventListener("click", () => {
  setStudy(Number(button.dataset.study), false);
  studyDialog.showModal();
}));
document.querySelector("#previous-study").addEventListener("click", () => setStudy(activeStudy - 1));
document.querySelector("#next-study").addEventListener("click", () => setStudy(activeStudy + 1));
studyDialog.addEventListener("keydown", (event) => {
  if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
  event.preventDefault();
  setStudy(activeStudy + (event.key === "ArrowRight" ? 1 : -1));
});

const quoteDialog = document.querySelector("#quote-dialog");
const inquiry = document.querySelector("#inquiry");
const project = document.querySelector("#project-fields");
const contact = document.querySelector("#contact-fields");
const step = document.querySelector("#quote-step");
const back = document.querySelector("#quote-back");
const next = document.querySelector("#quote-next");
const status = document.querySelector("#quote-status");
let contactStep = false;

function showStep(isContact, focus = true) {
  contactStep = isContact;
  project.hidden = project.disabled = isContact;
  contact.hidden = contact.disabled = !isContact;
  back.hidden = !isContact;
  step.textContent = isContact ? "Step 2 of 2 / Contact" : "Step 1 of 2 / Project";
  next.textContent = isContact ? "Finish demo" : "Continue";
  status.textContent = "";
  if (focus) (isContact ? contact : project).querySelector("input, select").focus();
}
function advance(event) {
  event.preventDefault();
  if (!contactStep) {
    showStep(true);
    return;
  }
  status.textContent = "Demo complete. No information was sent.";
}
document.querySelectorAll(".quote-open").forEach((button) => button.addEventListener("click", () => {
  inquiry.reset();
  showStep(false, false);
  quoteDialog.showModal();
}));
document.querySelectorAll("[data-close]").forEach((button) => button.addEventListener("click", () => button.closest("dialog").close()));
back.addEventListener("click", () => showStep(false));
quoteDialog.addEventListener("close", () => {
  if (quoteDialog.open) return;
  inquiry.reset();
  showStep(false, false);
});
inquiry.addEventListener("submit", advance);
inquiry.addEventListener("input", () => { status.textContent = ""; });
