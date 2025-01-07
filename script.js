import {
  navItems,
  skills,
  qualifications,
  experiences,
  services,
  works,
  blogs,
  testimonials,
} from "./data.js";

// Navigation
const navList = document.getElementById("nav-list");
navItems.forEach((item) => {
  const li = document.createElement("li");
  li.classList.add("nav__item");
  li.innerHTML = `<a href="${item.href}" class="nav__link"><i class='bx ${item.icon}'></i></a>`;
  navList.appendChild(li);
});

/*=============== DARK LIGHT THEME ===============*/
function changeImageSrc(additional) {
  document.getElementById(
    "low_poly_art"
  ).src = `./assets/img/work1-${additional}.png`;
  document.getElementById(
    "universal_dictionary"
  ).src = `./assets/img/work2-${additional}.png`;
  document.getElementById(
    "chromata"
  ).src = `./assets/img/work3-${additional}.png`;
  document.getElementById(
    "music_visualizer"
  ).src = `./assets/img/work4-${additional}.png`;
  document.getElementById(
    "galaxy_simulator"
  ).src = `./assets/img/work5-${additional}.png`;
  document.getElementById(
    "virtual_piano"
  ).src = `./assets/img/work6-${additional}.png`;
  document.getElementById(
    "weather"
  ).src = `./assets/img/work7-${additional}.png`;
}

document.addEventListener("DOMContentLoaded", () => {
  const themeButton = document.getElementById("theme-button");
  const darkThemeClass = "dark-theme";
  const lightThemeClass = "light-theme";

  const moonIconClass = "bxs-moon";
  const sunIconClass = "bxs-sun";

  // Load saved theme from localStorage
  const savedTheme = localStorage.getItem("selected-theme");
  if (savedTheme) {
    document.body.classList.add(savedTheme);
    // Set the appropriate icon
    if (savedTheme === darkThemeClass) {
      themeButton.classList.remove(moonIconClass);
      themeButton.classList.add(sunIconClass);
      // changeImageSrc("d");
    } else {
      themeButton.classList.remove(sunIconClass);
      themeButton.classList.add(moonIconClass);
      // changeImageSrc("l");
    }
  } else {
    document.body.classList.add(lightThemeClass); // Default to light theme
    themeButton.classList.add(moonIconClass); // Default to moon icon
    // changeImageSrc("l");
  }

  themeButton.addEventListener("click", () => {
    if (document.body.classList.contains(darkThemeClass)) {
      document.body.classList.remove(darkThemeClass);
      document.body.classList.add(lightThemeClass);
      themeButton.classList.remove(sunIconClass);
      themeButton.classList.add(moonIconClass);
      // changeImageSrc("l");
      localStorage.setItem("selected-theme", lightThemeClass);
    } else {
      document.body.classList.remove(lightThemeClass);
      document.body.classList.add(darkThemeClass);
      themeButton.classList.remove(moonIconClass);
      themeButton.classList.add(sunIconClass);
      // changeImageSrc("d");
      localStorage.setItem("selected-theme", darkThemeClass);
    }
  });

  if (localStorage.getItem("selected-theme") === lightThemeClass) {
    changeImageSrc("l");
  } else {
    changeImageSrc("d");
  }
});

// Skills

function renderSkills() {
  const container = document.getElementById("skills-container");

  skills.forEach((category) => {
    const categoryDiv = document.createElement("div");
    categoryDiv.classList.add("skills-container-content", "skills-close");

    const header = document.createElement("div");
    header.classList.add("skills-container-header");
    header.innerHTML = `
          <i class="bx ${category.icon} skills-icon"></i>
          <div>
              <h1 class="skills-title">${category.title}</h1>
              <span class="skills-subtitle">${category.subtitle}</span>
          </div>
          <i class="bx bxs-chevron-down skills-arrow"></i>
      `;
    header.onclick = () => {
      categoryDiv.classList.toggle("skills-close");
      categoryDiv.classList.toggle("skills-open");
      const list = categoryDiv.querySelector(".skills-list");
      if (list.style.height) {
        list.style.height = "";
      } else {
        list.style.height = `${list.scrollHeight}px`;
      }
    };

    const skillsList = document.createElement("div");
    skillsList.classList.add("skills-list", "grid");

    category.skills.forEach((skill) => {
      const skillData = document.createElement("div");
      skillData.classList.add("skills-data");
      skillData.innerHTML = `
              <div class="skills-titles">
                  <h3 class="skills-name">${skill.name}</h3>
                  <span class="skills-number">${skill.level}%</span>
              </div>
              <div class="skills-bar">
                  <span class="skills-percentage" style="width: ${skill.level}%;"></span>
              </div>
          `;
      skillsList.appendChild(skillData);
    });

    categoryDiv.appendChild(header);
    categoryDiv.appendChild(skillsList);
    container.appendChild(categoryDiv);
  });
}

// Call the function to render skills
renderSkills();

// Qualifications
function loadQualifications() {
  Object.keys(qualifications).forEach((key) => {
    const container = document.getElementById(key);
    qualifications[key].forEach((item, index) => {
      const div = document.createElement("div");
      div.classList.add("qualification-data");
      div.innerHTML = `
                  ${
                    index % 2 === 0
                      ? `
                  <div class="qualification-data-alt">
                      <h3 class="qualification-title">${item.title}</h3>
                      <span class="qualification-subtitle">${item.subtitle}</span>
                      <div class="qualification-calendar">
                          <i class="bx bxs-calendar"></i>
                          ${item.calendar}
                      </div>
                  </div>
                  `
                      : `
                  <div></div>
                  `
                  }
                  <div>
                      <span class="qualification-rounder"></span>
                      ${
                        index !== qualifications[key].length - 1
                          ? `<span class="qualification-line"></span>`
                          : ``
                      }
                  </div>
                  ${
                    index % 2 !== 0
                      ? `
                  <div class="qualification-data-alt">
                      <h3 class="qualification-title">${item.title}</h3>
                      <span class="qualification-subtitle">${item.subtitle}</span>
                      <div class="qualification-calendar">
                          <i class="bx bxs-calendar"></i>
                          ${item.calendar}
                      </div>
                  </div>
                  `
                      : `
                  <div></div>
                  `
                  }
              `;
      container.appendChild(div);
    });
  });
}

document.addEventListener("DOMContentLoaded", loadQualifications);
const tabs = document.querySelectorAll("[data-target]"),
  tabContents = document.querySelectorAll("[data-content]");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = document.querySelector(tab.dataset.target);

    tabContents.forEach((tabContent) => {
      tabContent.classList.remove("qualification-active");
    });
    target.classList.add("qualification-active");

    tabs.forEach((tab) => {
      tab.classList.remove("qualification-active");
    });
    tab.classList.add("qualification-active");
  });
});

// Experience
const experiencesContainer = document.getElementById("experiences-container");
experiences.forEach((exp) => {
  const expContent = document.createElement("div");
  expContent.classList.add("experiences__content");
  expContent.innerHTML = `
          <h3 class="experiences__title">${exp.title}</h3>
          <h5 class="experiences__subtitle">${exp.subtitle}</h5>
          <div class="experiences__box">
          ${exp.details
            .map(
              (detail) => `
              <div class="experiences__data">
              <i class='bx bxs-badge-check'></i>
              <div>
                  <h3 class="experiences__name">${detail.name}</h3>
                  <span class="experiences__level">${detail.level}</span>
              </div>
              </div>
          `
            )
            .join("")}
          </div>
      `;
  experiencesContainer.appendChild(expContent);
});

// Services
// const servicesContainer = document.getElementById("services-container");

// services.forEach((service) => {
//   const serviceCard = document.createElement("div");
//   serviceCard.classList.add("services__card");
//   serviceCard.innerHTML = `
//         <h3 class="services__title">${service.title}</h3>
//         <span class="services__button">
//           See more <i class="bx bx-right-arrow-alt services__icon"></i>
//         </span>
//         <div class="services__modal">
//           <div class="services__modal-content">
//             <i class="bx bx-x services__modal-close"></i>
//             <h3 class="services__modal-title">${service.title}</h3>
//             <p class="services__modal-description">${service.description}</p>
//             <ul class="services__modal-list">
//               ${service.details
//                 .map(
//                   (detail) => `
//                 <li class="services__modal-item">
//                   <i class="bx bx-check services__modal-icon"></i>
//                   <p class="services__modal-info">${detail}</p>
//                 </li>
//               `
//                 )
//                 .join("")}
//             </ul>
//           </div>
//         </div>
//       `;
//   servicesContainer.appendChild(serviceCard);
// });

// const modalViews = document.querySelectorAll(".services__modal"),
//   modalButtons = document.querySelectorAll(".services__button"),
//   modalClose = document.querySelectorAll(".services__modal-close");

// let modal = function (modalClick) {
//   modalViews[modalClick].classList.add("active-modal");
// };

// modalButtons.forEach((mb, i) => {
//   mb.addEventListener("click", () => {
//     modal(i);
//   });
// });

// modalClose.forEach((mc) => {
//   mc.addEventListener("click", () => {
//     modalViews.forEach((mv) => {
//       mv.classList.remove("active-modal");
//     });
//   });
// });

// Works
function filterWorks(filter) {
  const workContainer = document.getElementById("work-container");
  workContainer.innerHTML = "";

  const filteredWorks = works.filter(
    (work) => filter === "all" || work.category === filter.substring(1)
  );
  filteredWorks.forEach((work) => {
    const workCard = document.createElement("div");
    workCard.classList.add("work__card", "mix", work.category);
    workCard.innerHTML = `
              <img src="${work.imgSrc}" alt="" class="work__img">
              <h3 class="work__title">${work.title}</h3>
              <a href="${work.link}" target="_blank" class="work__button">
                  Visit <i class="bx bx-right-arrow-alt work__icon"></i>
              </a>
          `;
    workContainer.appendChild(workCard);
  });
}

// Initial filter on page load
document.addEventListener("DOMContentLoaded", () => {
  filterWorks("all");
});

// Filter works when filter attribute changes
document.querySelectorAll(".work__item").forEach((item) => {
  item.addEventListener("click", function () {
    const filter = this.getAttribute("data-filter");
    filterWorks(filter);
  });
});

// Blogs
const blogContainer = document.getElementById("blog-container");
blogs.forEach((blog) => {
  const blogContent = document.createElement("div");
  blogContent.classList.add("portfolio-content", "grid", "swiper-slide");
  blogContent.innerHTML = `
              <img src="${blog.imgSrc}" alt="Portfolio" class="portfolio-img">
              <div class="portfolio-data">
                  <h3 class="portfolio-title">${blog.title}</h3>
                  <p class="portfolio-description">${blog.description}</p>
                  <a href="${blog.link}" class="button button-flex button-small portfolio-button">
                      Read <i class="bx bx-right-arrow-alt button-icon"></i>
                  </a>
              </div>
          `;
  blogContainer.appendChild(blogContent);
});

// Testimonials
const testimonialContainer = document.getElementById("testimonial-container");
testimonials.forEach((testimonial) => {
  const testimonialCard = document.createElement("div");
  testimonialCard.classList.add("testimonial__card", "swiper-slide");
  testimonialCard.innerHTML = `
              <img src="${testimonial.imgSrc}" alt="" class="testimonial__img">
              <h3 class="testimonial__name">${testimonial.name}</h3>
              <p class="testimonial__description">${testimonial.description}</p>
          `;
  testimonialContainer.appendChild(testimonialCard);
});
