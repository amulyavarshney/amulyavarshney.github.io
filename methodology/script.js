// JSON object with the methodology steps including images, headings, and content
const methodology = [
    {
        number: '01',
        title: 'Explore',
        description: 'I put myself in the place of users in order to understand their needs.',
        imgSrc: 'Explore.svg',
    },
    {
        number: '02',
        title: 'Imagine',
        description: 'I think of several ideas that can be utilized to solve problems faced by users.',
        imgSrc: 'Imagine.svg',
    },
    {
        number: '03',
        title: 'Frame',
        description: 'I pick a framework that suits well with the project and will begin to formalize a plan.',
        imgSrc: 'Frame.svg',
    },
    {
        number: '04',
        title: 'Design',
        description: 'I will then design and create an interactive prototype.',
        imgSrc: 'Design.svg',
    },
    {
        number: '05',
        title: 'Test',
        description: 'I analyze the prototype with real users in order to optimize and validate the solution.',
        imgSrc: 'Test.svg',
    },
    {
        number: '06',
        title: 'Deploy',
        description: 'Once the prototype has been validated, I can start developing it and launch the product.',
        imgSrc: 'Deploy.svg',
    },
];

// Function to render the cards
function renderCards() {
  const cardDeck = document.getElementById("methodology-list");
  methodology.forEach((item) => {
    const card = document.createElement("li");
    card.className = "method";
    card.innerHTML = `
            <img src="${item.imgSrc}" alt="${item.title}" class="method-image">
            <h3 class="method-title"><span class="method-number">${item.number}</span>${item.title}</h3>
            <p class="method-description">${item.description}</p>
        `;
    cardDeck.appendChild(card);
  });
  console.log("card", cardDeck);
}

// Call the function to render the cards on page load
document.addEventListener("DOMContentLoaded", renderCards);