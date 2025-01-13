'use strict';

const endpoint = './xarici-dil.json';
const cardContainer = document.querySelector('.card-body');
let selectedAnswers = {}; // To store selected answers

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
    addAnswerSelectionListeners(); // Add listeners after displaying questions
    addCheckAnswersListener(randomQuestions); // Add listener for checking answers
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
      <div class="question-block">
        <h5 class="card-title">${index + 1}. ${question.questionUp}</h5>
        <p class="card-text">${question.questionDown}</p>
        <div class="list-group">
          ${question.answers
            .map(answer => {
              const key = Object.keys(answer)[0];
              return `
              <button type="button" class="list-group-item list-group-item-action" data-question="${index}" data-answer="${key}">
                ${key}. ${answer[key]}
              </button>`;
            })
            .join('')}
        </div>
        <div class="card-text text-end fs-6 display-6 text-white-50">
          ${question.questionNumber}
        </div>
        <hr />
      </div>
    `;
    cardContainer.innerHTML += questionHtml;
  });
}

// Function to add listeners for selecting answers
function addAnswerSelectionListeners() {
  const answerButtons = document.querySelectorAll('.list-group-item');
  answerButtons.forEach(button => {
    button.addEventListener('click', () => {
      const questionIndex = button.getAttribute('data-question');
      const answerKey = button.getAttribute('data-answer');

      // Deselect previously selected answer
      document
        .querySelectorAll(`.list-group-item[data-question="${questionIndex}"]`)
        .forEach(btn => {
          btn.classList.remove('active');
        });

      // Mark the clicked button as selected
      button.classList.add('active');

      // Store selected answer
      selectedAnswers[questionIndex] = answerKey;
    });
  });
}
document.getElementById('restartBtn').addEventListener('click', () => {
  window.location.reload(); // Simple page reload to restart
});

// Function to add listener for "Check Answers" button
function addCheckAnswersListener(questions) {
  document.getElementById('checkAnswersBtn').addEventListener('click', () => {
    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;
    let totalPoint;
    let pointMessage;
    let modalContent = '';

    questions.forEach((question, index) => {
      const correctAnswer = question.correctAnwser;
      const selectedAnswer = selectedAnswers[index];
      const answerButtons = document.querySelectorAll(
        `.list-group-item[data-question="${index}"]`
      );

      if (!selectedAnswer) {
        unansweredCount++;
      } else if (selectedAnswer === correctAnswer) {
        correctCount++;

        // Mark correct answer button as green
        answerButtons.forEach(button => {
          if (button.getAttribute('data-answer') === correctAnswer) {
            button.classList.remove('active');
            button.classList.add('selected-correct');
          }
        });
      } else {
        incorrectCount++;

        // Mark selected wrong answer as red
        answerButtons.forEach(button => {
          if (button.getAttribute('data-answer') === selectedAnswer) {
            button.classList.remove('active');
            button.classList.add('selected-wrong');
          }
          // Mark correct answer as green for reference
          if (button.getAttribute('data-answer') === correctAnswer) {
            button.classList.remove('active');
            button.classList.add('should-select');
          }
        });
      }
    });

    function calcPoint() {
      totalPoint = correctCount * 2 + incorrectCount * -1;

      if (0 < totalPoint && totalPoint < 17) {
        pointMessage = 'Kəsildin, moyka';
      } else if (totalPoint <= 0) {
        pointMessage = 'Başı';
      } else {
        pointMessage = 'Ə yaxşı';
      }
    }

    calcPoint();

    modalContent += `
      <hr>
      <p class="text-success">Düzlər: <span class="text-secondary">${correctCount}</span></p>
      <p class="text-danger">Səhvlər: <span class="text-secondary">${incorrectCount}</span></p>
      <p class="text-warning">Cavabsız: <span class="text-secondary">${unansweredCount}</span></p>
      <p class="text-info">Topladığı bal: <span class="text-secondary">${totalPoint} (${pointMessage})</span></p>
    `;

    // Insert content into the modal
    document.getElementById('modalBody').innerHTML = modalContent;

    // Trigger the modal display
    const modal = new bootstrap.Modal(
      document.getElementById('exampleModalCenter')
    );
    modal.show();
  });
}
