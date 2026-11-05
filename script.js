const menuToggle = document.querySelector("#menuToggle");
const mainNav = document.querySelector("#mainNav");

menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
});

mainNav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// Filtra os projetos por categoria.
const filterButtons = document.querySelectorAll(".filter-btn");
const galleryItems = [...document.querySelectorAll(".gallery-item")];

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(item => item.classList.remove("active"));
    button.classList.add("active");

    const category = button.dataset.filter;
    galleryItems.forEach(item => {
      const shouldShow = category === "todos" || item.dataset.category === category;
      item.classList.toggle("is-hidden", !shouldShow);
    });
  });
});

// Lightbox: clique em uma foto para ampliar e navegar pela galeria.
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightboxImage");
const lightboxCount = document.querySelector("#lightboxCount");
const closeButton = document.querySelector("#lightboxClose");
const previousButton = document.querySelector("#lightboxPrev");
const nextButton = document.querySelector("#lightboxNext");
let currentImageIndex = 0;

function visibleItems() {
  return galleryItems.filter(item => !item.classList.contains("is-hidden"));
}

function showImage(index) {
  const items = visibleItems();
  if (!items.length) return;

  currentImageIndex = (index + items.length) % items.length;
  const item = items[currentImageIndex];
  const image = item.querySelector("img");

  lightboxImage.src = item.dataset.full;
  lightboxImage.alt = image.alt;
  lightboxCount.textContent = `${String(currentImageIndex + 1).padStart(2, "0")} / ${String(items.length).padStart(2, "0")}`;
}

function openLightbox(item) {
  const items = visibleItems();
  showImage(items.indexOf(item));
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  closeButton.focus();
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

galleryItems.forEach(item => item.addEventListener("click", () => openLightbox(item)));
closeButton.addEventListener("click", closeLightbox);
previousButton.addEventListener("click", () => showImage(currentImageIndex - 1));
nextButton.addEventListener("click", () => showImage(currentImageIndex + 1));

lightbox.addEventListener("click", event => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", event => {
  if (!lightbox.classList.contains("open")) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") showImage(currentImageIndex - 1);
  if (event.key === "ArrowRight") showImage(currentImageIndex + 1);
});
