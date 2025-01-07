/*=============== CHANGE BACKGROUND HEADER ===============*/
function scrollHeader() {
  const header = document.getElementById("header");
  if (window.scrollY >= 50) header.classList.add("scroll-header");
  else header.classList.remove("scroll-header");
}
window.addEventListener("scroll", scrollHeader);

/* ACCORDION SKILLS */
const skillsContent = document.getElementsByClassName(
    "skills-container-content"
  ),
  skillsHeader = document.querySelectorAll(".skills-container-header");

function toggleSkills() {
  let itemClass = this.parentNode.className;

  Array.from(skillsContent).forEach((content) => {
    content.className = "skills-container-content skills-close";
  });

  if (itemClass === "skills-container-content skills-close") {
    this.parentNode.className = "skills-container-content skills-open";
  }
}

skillsHeader.forEach((el) => {
  el.addEventListener("click", toggleSkills);
});

/*=============== MIXITUP FILTER PORTFOLIO ===============*/
let mixerPortfolio = mixitup(".work__container", {
  selectors: {
    target: ".work__card",
  },
  animation: {
    duration: 300,
  },
});

/* Link active work */
const linkWork = document.querySelectorAll(".work__item");

function activeWork() {
  linkWork.forEach((link) => {
    link.classList.remove("active-work");
  });
  this.classList.add("active-work");
}

linkWork.forEach((link) => {
  link.addEventListener("click", activeWork);
});

/* BLOG SWIPER  */
var swiper = new Swiper(".portfolio-container", {
  cssMode: true,
  loop: true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
});

/*=============== SWIPER TESTIMONIAL ===============*/
var swiper = new Swiper(".testimonial__container", {
  spaceBetween: 24,
  loop: true,
  grabCursor: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  breakpoints: {
    576: {
      slidesPerView: 2,
    },
    768: {
      slidesPerView: 2,
      spaceBetween: 48,
    },
  },
});

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll("section[id]");

function scrollActive() {
  const scrollY = window.pageYOffset;

  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight,
      sectionTop = current.offsetTop - 58,
      sectionId = current.getAttribute("id");

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      document
        .querySelector(".nav__menu a[href*=" + sectionId + "]")
        .classList.add("active-link");
    } else {
      document
        .querySelector(".nav__menu a[href*=" + sectionId + "]")
        .classList.remove("active-link");
    }
  });
}
window.addEventListener("scroll", scrollActive);

/* SHOW SCROLL UP */
function scrollUp() {
  const scrollUp = document.getElementById("scroll-up");
  if (window.scrollY >= 560) scrollUp.classList.add("show-scroll");
  else scrollUp.classList.remove("show-scroll");
}
window.addEventListener("scroll", scrollUp);

/*=============== SCROLL REVEAL ANIMATION ===============*/
const scrollReveal = ScrollReveal({
  origin: "top",
  distance: "60px",
  duration: 2500,
  delay: 400,
});
scrollReveal.reveal(".home__data");
scrollReveal.reveal(".home__handle", { delay: 700 });
scrollReveal.reveal(".home__social, .home_scroll", {
  delay: 900,
  origin: "bottom",
});

/* SMOOTH SCROLLING */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("a").forEach((anchor) => {
    anchor.addEventListener("click", function (event) {
      if (this.hash !== "") {
        event.preventDefault();
        const hash = this.hash;
        document.querySelector(hash).scrollIntoView({
          behavior: "smooth",
        });
        history.pushState(null, null, hash);
      }
    });
  });
});

/* LANGUAGE SWITCHER */
const langugesTypes = ["en", "hi"];
let selectedLanguageIndex = 0;
let languages = [];

document.addEventListener("DOMContentLoaded", () => {
  function loadJson(url, listener) {
    fetch(url)
      .then((response) => response.json())
      .then((data) => listener(data))
      .catch(() => console.log("An error has occurred."));
  }

  langugesTypes.forEach((element, i) => {
    loadJson(`assets/json/${element}.json`, (json) => {
      languages[i] = json;
      if (i == 0) {
        changeLanguage(languages[0]);
      }
    });
  });

  onResize();
});

document.getElementById("language-button").addEventListener("click", () => {
  selectedLanguageIndex = selectedLanguageIndex === 0 ? 1 : 0;
  changeLanguage(languages[selectedLanguageIndex]);
});

// function changeLanguage(jsonData) {
//   // Home
//   document.querySelector(".home__data .home__greeting").innerHTML =
//     jsonData.greeting_msg;
//   document.querySelector(".home__data .home__name").innerHTML = jsonData.name;
//   document.querySelector(".home__data .home__role").innerHTML = jsonData.role;

//   // About
//   document.querySelector(".about__info .about__title:nth-child(1)").innerHTML =
//     jsonData.experience;
//   document.querySelector(
//     ".about__info .about__subtitle:nth-child(1)"
//   ).innerHTML = jsonData.experience_value;
//   document.querySelector(".about__info .about__title:nth-child(2)").innerHTML =
//     jsonData.completed;
//   document.querySelector(
//     ".about__info .about__subtitle:nth-child(2)"
//   ).innerHTML = jsonData.completed_value;
//   document.querySelector(".about__info .about__title:nth-child(3)").innerHTML =
//     jsonData.worked;
//   document.querySelector(
//     ".about__info .about__subtitle:nth-child(3)"
//   ).innerHTML = jsonData.worked_value;
//   document.querySelector(".about__description").innerHTML =
//     jsonData.about_description;
//   document.querySelector(".about__data .button:nth-child(1)").innerHTML =
//     jsonData.download_cv;
//   document.querySelector(".about__data .button:nth-child(2)").innerHTML =
//     jsonData.contact_me;

//   // Skills
//   document.querySelector(".skills .section__title").innerHTML =
//     jsonData.skills_title;
//   document.querySelector(".skills .section__subtitle").innerHTML =
//     jsonData.skills_subtitle;
//   function setSkills(content) {
//     let skills_content = document.querySelectorAll(".skills-container > div");
//     for (let i = 0; i < content.length; i++) {
//       skills_content[i].querySelector(".skills-title").innerHTML =
//         content[i].title;
//       skills_content[i].querySelector(".skills-subtitle").innerHTML =
//         content[i].subtitle;
//       let skills_list =
//         skills_content[i].querySelectorAll(".skills-list > div");
//       for (let j = 0; j < content[i].data.length; j++) {
//         skills_list[j].querySelector(".skills-name").innerHTML =
//           content[i].data[j].name;
//         skills_list[j].querySelector(".skills-number").innerHTML =
//           content[i].data[j].number;
//       }
//     }
//   }
//   setSkills(jsonData.skills_content);

//   // Qualification
//   document.querySelector(".qualification .section__title").innerHTML =
//     jsonData.qualification_title;
//   document.querySelector(".qualification .section__subtitle").innerHTML =
//     jsonData.qualification_subtitle;
//   function setQualification(tabs) {
//     let qualification_tabs = document.querySelectorAll(
//       ".qualification-tabs > div"
//     );
//     let qualification_content = document.querySelectorAll(
//       ".qualification-sections > div"
//     );
//     for (let i = 0; i < tabs.length; i++) {
//       qualification_tabs[i].querySelector(
//         ".qualification-tabs-button"
//       ).innerHTML = tabs[i].name;
//       let qualification_data = qualification_content[i].querySelectorAll(
//         ".qualification-data > div"
//       );
//       for (let j = 0; j < tabs[i].data.length; j++) {
//         qualification_data[j].querySelector(".qualification-title").innerHTML =
//           tabs[i].data[j].title;
//         qualification_data[j].querySelector(
//           ".qualification-subtitle"
//         ).innerHTML = tabs[i].data[j].subtitle;
//         qualification_data[j].querySelector(
//           ".qualification-calender"
//         ).innerHTML = tabs[i].data[j].calender;
//       }
//     }
//   }
//   setQualification(jsonData.qualification_tabs);

//   // Experience
//   document.querySelector(".experiences .section__title").innerHTML =
//     jsonData.experience_title;
//   document.querySelector(".experiences .section__subtitle").innerHTML =
//     jsonData.experience_subtitle;
//   function setExperiences(content) {
//     let experience_content = document.querySelectorAll(
//       ".experiences__container > div"
//     );
//     for (let i = 0; i < content.length; i++) {
//       experience_content[i].querySelector(".experiences__title").innerHTML =
//         content[i].title;
//       experience_content[i].querySelector(".experiences__subtitle").innerHTML =
//         content[i].subtitle;
//       let experience_box = experience_content[i].querySelectorAll(
//         ".experiences__box > div"
//       );
//       for (let j = 0; j < content[i].data.length; j++) {
//         experience_box[j].querySelector(".experiences__name").innerHTML =
//           content[i].data[j].name;
//         experience_box[j].querySelector(".experiences__level").innerHTML =
//           content[i].data[j].level;
//       }
//     }
//   }
//   setExperiences(jsonData.experience_content);

//   // Works
//   document.querySelector("#work .section__subtitle").innerHTML =
//     jsonData.my_portfolio;
//   document.querySelector("#work .section__title").innerHTML =
//     jsonData.recent_projects;
//   document.querySelector("#work .work__filters > div:nth-child(1)").innerHTML =
//     jsonData.all;
//   document.querySelector("#work .work__filters > div:nth-child(2)").innerHTML =
//     jsonData.web;
//   document.querySelector("#work .work__filters > div:nth-child(3)").innerHTML =
//     jsonData.backend;
//   document.querySelector("#work .work__filters > div:nth-child(4)").innerHTML =
//     jsonData.blockchain;

//   // Contact
//   document.querySelector("#contact .section__title").innerHTML =
//     jsonData.contact_me;
//   document.querySelector("#contact .section__subtitle").innerHTML =
//     jsonData.get_in_touch;
//   document.querySelector(
//     ".contact__container > div:nth-child(1) .contact__title"
//   ).innerHTML = jsonData.popular_links;

//   function setContactBox(index, text) {
//     let root = document.querySelector(
//       `.contact__container > div:nth-child(1) .contact__info > div:nth-child(${
//         index + 1
//       })`
//     );
//     root.querySelector(".contact__card-title").innerHTML = text;
//     let clone = root.querySelector(".contact__button > a").cloneNode(true);
//     root.querySelector(".contact__button").innerHTML = jsonData.write_me;
//     root.querySelector(".contact__button").appendChild(clone);
//   }
//   setContactBox(0, jsonData.email);
//   setContactBox(1, jsonData.linked_in);
//   setContactBox(2, jsonData.x);
//   document.querySelector(
//     ".contact__container > div:nth-child(2) .contact__title"
//   ).innerHTML = jsonData.send_direct_message;
//   document.querySelector(
//     ".contact__form > div:nth-child(1) .contact__form-tag"
//   ).innerHTML = jsonData.form_name;
//   document.querySelector(
//     ".contact__form > div:nth-child(2) .contact__form-tag"
//   ).innerHTML = jsonData.form_email;
//   document.querySelector(
//     ".contact__form > div:nth-child(3) .contact__form-tag"
//   ).innerHTML = jsonData.form_subject;
//   document.querySelector(
//     ".contact__form > div:nth-child(4) .contact__form-tag"
//   ).innerHTML = jsonData.form_message;
//   document.getElementById("send_email").innerHTML = jsonData.send_message;
//   document.getElementById("client_email").placeholder = jsonData.email_hint;
//   document.getElementById("client_subject").placeholder = jsonData.subject_hint;
//   document.getElementById("client_message").placeholder = jsonData.message_hint;

//   document.querySelector(
//     ".footer__list > div:nth-child(1) .footer__link"
//   ).innerHTML = jsonData.about;
//   document.querySelector(
//     ".footer__list > div:nth-child(2) .footer__link"
//   ).innerHTML = jsonData.projects;
//   document.querySelector(
//     ".footer__list > div:nth-child(3) .footer__link"
//   ).innerHTML = jsonData.experience;
//   document.querySelector(".footer__copyright").innerHTML = jsonData.copyright;
// }

// Send Mail
document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault();
  sendMail();
});

function sendMail() {
  const link =
    "mailto:amulyavarshney7@gmail.com" +
    `?cc=${document.getElementById("client_email").value}` +
    "&subject=" +
    encodeURIComponent(document.getElementById("client_subject").value) +
    "&body=" +
    encodeURIComponent(document.getElementById("client_message").value);

  window.location.href = link;
}
