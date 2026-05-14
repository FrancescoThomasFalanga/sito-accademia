// Animazione sezioni quando entrano in viewport

const sections = document.querySelectorAll(".section");

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = 1;
      entry.target.style.transform = "translateY(0)";
    }
  });
}, { threshold: 0.2 });

sections.forEach(section => {
  section.style.opacity = 0;
  section.style.transform = "translateY(40px)";
  section.style.transition = "1s ease";
  observer.observe(section);
});

const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-menu a");

menuToggle.addEventListener("click", () => {
  menuToggle.classList.toggle("active");
  navMenu.classList.toggle("active");
});

navLinks.forEach(link => {
  link.addEventListener("click", () => {
    menuToggle.classList.remove("active");
    navMenu.classList.remove("active");
  });
});

const newsletterForm = document.getElementById("newsletter-form");
const newsletterMessage = document.getElementById("newsletter-message");

if (newsletterForm) {
  newsletterForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("newsletter-email").value.trim();

    newsletterMessage.textContent = "Invio in corso...";
    newsletterMessage.className = "newsletter-message";

    try {
      const response = await fetch("/.netlify/functions/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        newsletterMessage.textContent = "Iscrizione completata. Controlla la tua email.";
        newsletterMessage.classList.add("success");
        newsletterForm.reset();
      } else {
        newsletterMessage.textContent = data.message || "Errore durante l'iscrizione.";
        newsletterMessage.classList.add("error");
      }
    } catch (error) {
      newsletterMessage.textContent = "Errore di connessione al server.";
      newsletterMessage.classList.add("error");
    }
  });
}