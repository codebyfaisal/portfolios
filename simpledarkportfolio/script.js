// const navMenu = document.querySelector(".menu");
// const navBars = document.querySelector(".bars");
// const navCross = document.querySelector(".cross");
// const navbar = document.querySelector(".navbar ul");
// const logo = document.querySelector(".logo");
// const body = document.querySelector("body");

// let HamburgerMenu = () => {
//   navMenu.addEventListener("click", (event) => {
//     navCross.style.display =
//       navCross.style.display === "none" ? "block" : "none";
//     navBars.style.display = navBars.style.display === "none" ? "block" : "none";

//     navbar.style.right = navbar.style.right === "0%" ? "-100%" : "0%";
//     body.style.overflow =
//       body.style.overflow === "hidden" ? "visible" : "hidden";
//   });

//   // Initial state
//   navCross.style.display = "none";
//   navBars.style.display = "block";
//   navbar.style.right = "-100%";
// };

// HamburgerMenu();

const navMenu = document.querySelector(".menu");
const navBars = document.querySelector(".bars");
const navCross = document.querySelector(".cross");
const navbar = document.querySelector(".navbar ul");
const logo = document.querySelector(".logo");
const body = document.querySelector("body");

let HamburgerMenu = () => {
  navMenu.addEventListener("click", (event) => {
    navCross.style.display =
      navCross.style.display === "none" ? "block" : "none";
    navBars.style.display = navBars.style.display === "none" ? "block" : "none";

    navbar.style.right = navbar.style.right === "0%" ? "-100%" : "0%";
    body.style.overflow =
      body.style.overflow === "hidden" ? "visible" : "hidden";
  });

  // Close menu when a link is clicked
  navbar.addEventListener("click", (event) => {
    if (event.target.tagName === "A") {
      // Check if the clicked element is a link
      navCross.style.display = "none";
      navBars.style.display = "block";
      navbar.style.right = "-100%";
      body.style.overflow = "visible";
    }
  });

  // Initial state
  navCross.style.display = "none";
  navBars.style.display = "block";
  navbar.style.right = "-100%";
};

HamburgerMenu();
