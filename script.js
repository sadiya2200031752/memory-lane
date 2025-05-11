const form = document.getElementById("eventForm");
const timeline = document.getElementById("timeline");
let events = JSON.parse(localStorage.getItem("timelineEvents")) || [];

function createEventElement(event, index) {
  const side = index % 2 === 0 ? "left" : "right";
  const container = document.createElement("div");
  container.className = `event ${side}`;
  
  const content = document.createElement("div");
  content.className = "event-content";

  content.innerHTML = `
    <h3>${event.title}</h3>
    <small>${event.date}</small>
    <p>${event.description}</p>
    ${event.image ? `<img src="${event.image}" alt="Event image">` : ''}
  `;

  container.appendChild(content);
  timeline.appendChild(container);
}

function renderTimeline() {
  timeline.innerHTML = "";
  events.forEach((event, index) => {
    createEventElement(event, index);
  });
  observeAnimations();
}

function observeAnimations() {
  const eventElements = document.querySelectorAll(".event");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  eventElements.forEach(el => observer.observe(el));
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const date = document.getElementById("date").value;
  const description = document.getElementById("description").value;
  const imageInput = document.getElementById("image");

  let imageBase64 = "";
  if (imageInput.files[0]) {
    const file = imageInput.files[0];
    imageBase64 = await toBase64(file);
  }

  const newEvent = { title, date, description, image: imageBase64 };
  events.push(newEvent);
  localStorage.setItem("timelineEvents", JSON.stringify(events));

  form.reset();
  renderTimeline();
});

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

renderTimeline();
