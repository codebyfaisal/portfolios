const projectsSection = document.getElementById("projects");
const projectElements = projectsSection.querySelectorAll(".col-lg-6");
const itemsLoader = document.getElementById("items-loader");
const message = document.getElementById("message");
const textarea = document.querySelector("#form textarea");
const themeLink = document.querySelector("link.theme");
const themeSwitchers = document.querySelectorAll(".theme-switcher a");

// Navbar-toggler
$(document).ready(function () {
  $(document).click(function (event) {
    let clickover = $(event.target);
    let $navbar = $(".navbar-collapse");
    let _opened = $navbar.hasClass("show");
    if (_opened === true && !clickover.hasClass("navbar-toggler")) {
      $navbar.collapse('hide');
    }
  });
});

// theme switcher
themeSwitchers.forEach((element) => {
  element.addEventListener("click", () => {
    let theme = element.getAttribute("title");
    themeLink.setAttribute("href", `./css/themes/${theme}-theme.css`);

    console.log("111");
  });
});
console.log("222");

// jump to top
document.addEventListener("DOMContentLoaded", function () {
  let jumperArea = document.querySelector("#services .icon-box");
  let jumpToTopButton = document.querySelector(".jump-to-top");

  if (!jumperArea || !jumpToTopButton) {
    console.error("Error: Element not found");
    return;
  }

  console.error("NoError: Element not found");
  window.addEventListener("scroll", function () {
    let servicesPosition = jumperArea.getBoundingClientRect().top;

    let windowHeight = window.innerHeight;

    if (servicesPosition < windowHeight) {
      jumpToTopButton.style.display = "block";
    } else {
      jumpToTopButton.style.display = "none";
    }
  });

  const scrollToTop = function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  jumpToTopButton.addEventListener("click", scrollToTop);
});

// value changer of textarea to inputElement
messageInput.value = textarea.value;