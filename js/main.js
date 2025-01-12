'use strict';

const endpoint = 'https://animeroman.github.io/SeidExam/xarici-dil.json';
const cardContainer = document.querySelector('.card-body');

// Fetch data and display 25 random questions
fetch(endpoint)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json();
  })
  .then(data => {
    const randomQuestions = getRandomQuestions(data, 25);
    displayQuestions(randomQuestions);
  })
  .catch(error => {
    console.error('Error fetching the data:', error);
  });

// Function to get 25 random questions
function getRandomQuestions(data, count) {
  const shuffled = data.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Function to display questions in the card-body
function displayQuestions(questions) {
  cardContainer.innerHTML = ''; // Clear any existing content
  questions.forEach((question, index) => {
    const questionHtml = `
      <h5 class="card-title">${index + 1}. ${question.questionUp}</h5>
      <p class="card-text">${question.questionDown}</p>
      <div class="list-group">
        ${question.answers
          .map(answer => {
            const key = Object.keys(answer)[0];
            return `
            <button type="button" class="list-group-item list-group-item-action">
              ${key}. ${answer[key]}
            </button>`;
          })
          .join('')}
      </div>
      <div class="card-text text-end fs-6 display-6 text-white-50">
        ${question.questionNumber}
      </div>
      <hr />
    `;
    cardContainer.innerHTML += questionHtml;
  });
}
