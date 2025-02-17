const navbarElement = document.querySelector(".navbar");
const navBar = document.querySelector(".navlinks");
const navbarButton = document.querySelector(".navbar-button");
const navbarButtonIcons = document.querySelectorAll(
  ".navbar-button i.fa-solid"
);
const scrollToTopButton = document.querySelector(".scroll-to-top");
let navBarOpen = false;
let dark = false;

// Toggle mobile navigation
const navBarHandler = () => {
  navbarButtonIcons.forEach((icon) => icon.classList.toggle("hidden"));
  navBar.classList.toggle("mobile");
  navBarOpen = !navBarOpen;
};
navbarButton.addEventListener("click", navBarHandler);

document.addEventListener("click", (e) => {
  if (
    !navbarButton.contains(e.target) &&
    !navBar.contains(e.target) &&
    navbarButton &&
    navBarOpen
  ) {
    navBarHandler();
  }
});

// Throttle function
function throttle(func, limit) {
  let lastFunc;
  let lastRan;
  return function () {
    const context = this;
    const args = arguments;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}

// Handle scroll events
const handleScroll = () => {
  navbarElement.classList.toggle("scrolled", window.scrollY > 100);
  scrollToTopButton.style.transform = window.scrollY > 100 ? "translateX(-3rem)" : "translateX(0)";
  scrollToTopButton.style.zIndex = window.scrollY > 100 ? "999999" : "0";
};

scrollToTopButton.addEventListener("click", () => {
  window.scrollTo(0, 0);
});

// Attach scroll event with throttling
window.onscroll = throttle(handleScroll, 200);

// Smooth scrolling for anchor links
document.querySelectorAll("a[data-scroll-to]").forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault(); // Prevent default anchor behavior
    const targetSection = document.getElementById(
      this.getAttribute("data-scroll-to")
    );
    targetSection.scrollIntoView({ behavior: "smooth" });
    navBarHandler();
  });
});

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("dark") === "true") {
    document.body.classList.add("dark");
    dark = !dark;
  }
});

document.querySelector(".theme-toggler").addEventListener("click", (e) => {
  dark = !dark;
  document.body.classList.toggle("dark");
  localStorage.setItem("dark", dark);
});

// dot Patterns
function createDotPattern(
  rows,
  cols,
  dotSize = 10,
  spacingX = 60,
  spacingY = 60
) {
  const parent = document.querySelectorAll(".dot-pattern");

  parent.forEach((p) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    p.appendChild(canvas);

    canvas.width = p.clientWidth;
    canvas.height = p.clientHeight;

    ctx.fillStyle = "#F0BF6C";

    const startX = 50;
    const startY = 10;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = startX + c * spacingX;
        const y = startY + r * spacingY;
        if (x < canvas.width && y < canvas.height) {
          ctx.beginPath();
          ctx.arc(x, y, dotSize / 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  });
}

createDotPattern(3, 8);
