'use strict';

const cardContainer = document.querySelector('.card-body');
let selectedAnswers = {}; // To store selected answers
let isChecked = false; // Flag to track if "Check" has been clicked

// Get the current location
const currentLocation = window.location;

console.log('Pathname:', currentLocation.pathname); // Pathname (relative path)

// Function to determine the endpoint
function getEndpoint(locationPath) {
  let endpoint; // Define the variable within the function
  if (
    locationPath === '/xarici-dil.html' ||
    '/SeidExam/information-technologies.html'
  ) {
    endpoint = './xarici-dil.json';
  } else if (
    locationPath === '/information-technologies.html' ||
    '/SeidExam/information-technologies.html'
  ) {
    endpoint = './information-technologies.json';
  }
  return endpoint; // Return the endpoint
}

// Pass the pathname to the function and store the result
const endpoint = getEndpoint(currentLocation.pathname);

// Log the endpoint to verify the result
console.log('Endpoint:', endpoint);

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

// Function to shuffle an array (Fisher-Yates shuffle algorithm)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Function to display questions in the card-body
function displayQuestions(questions) {
  cardContainer.innerHTML = ''; // Clear any existing content
  questions.forEach((question, index) => {
    // Create a copy of the answers array and shuffle it
    const shuffledAnswers = shuffleArray([...question.answers]);

    // Define fixed labels A, B, C, D, E
    const labels = ['A', 'B', 'C', 'D', 'E'];

    const questionHtml = `
      <div class="question-block">
        <h5 class="card-title">${index + 1}. ${question.questionUp}</h5>
        <p class="card-text">${question.questionDown}</p>
        <div class="list-group">
          ${shuffledAnswers
            .map((answer, answerIndex) => {
              const key = labels[answerIndex]; // Use fixed label for the current answer
              const value = Object.values(answer)[0]; // Get the answer text
              const isCorrect =
                Object.keys(answer)[0] === question.correctAnwser; // Check if it's the correct answer
              return `
              <button type="button" class="list-group-item list-group-item-action" 
                      data-question="${index}" 
                      data-answer="${key}" 
                      data-correct="${isCorrect}">
                ${key}. ${value}
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

// Function to add listeners for selecting answers with toggle functionality
function addAnswerSelectionListeners() {
  const answerButtons = document.querySelectorAll('.list-group-item');
  answerButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (isChecked) return; // Prevent selection if check has been performed

      const questionIndex = button.getAttribute('data-question');
      const answerKey = button.getAttribute('data-answer');

      // Check if the clicked button is already active
      if (button.classList.contains('active')) {
        // If already active, remove the active class and clear the selected answer
        button.classList.remove('active');
        delete selectedAnswers[questionIndex];
      } else {
        // Deselect previously selected answer for the same question
        document
          .querySelectorAll(
            `.list-group-item[data-question="${questionIndex}"]`
          )
          .forEach(btn => {
            btn.classList.remove('active');
          });

        // Mark the clicked button as selected
        button.classList.add('active');

        // Store selected answer
        selectedAnswers[questionIndex] = answerKey;
      }
    });
  });
}

document.getElementById('restartBtn').addEventListener('click', () => {
  window.location.reload(); // Simple page reload to restart
});

// Ensure the modal backdrop and modal-open class are properly removed when the modal is closed
document
  .getElementById('exampleModalCenter')
  .addEventListener('hidden.bs.modal', () => {
    document.body.classList.remove('modal-open'); // Remove the modal-open class
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.remove(); // Remove any remaining backdrop
    }
    document.body.style.overflow = ''; // Restore scrolling
  });

// Function to add listener for "Check Answers" button
function addCheckAnswersListener(questions) {
  document.getElementById('checkAnswersBtn').addEventListener('click', () => {
    if (isChecked) return; // Prevent re-checking if already checked

    isChecked = true; // Set flag to true to prevent further checks

    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;
    let totalPoint;
    let pointMessage;
    let modalContent = '';

    document.getElementById('checkAnswersBtn').classList.remove('btn-warning');
    document.getElementById('checkAnswersBtn').classList.add('btn-info');
    document.getElementById('checkAnswersBtn').textContent = 'Answers';

    questions.forEach((question, index) => {
      const answerButtons = document.querySelectorAll(
        `.list-group-item[data-question="${index}"]`
      );
      const selectedButton = document.querySelector(
        `.list-group-item[data-question="${index}"].active`
      );

      if (!selectedButton) {
        unansweredCount++;
      } else if (selectedButton.getAttribute('data-correct') === 'true') {
        correctCount++;
        selectedButton.classList.remove('active');
        selectedButton.classList.add('selected-correct');
      } else {
        incorrectCount++;
        selectedButton.classList.remove('active');
        selectedButton.classList.add('selected-wrong');

        // Highlight the correct answer
        answerButtons.forEach(button => {
          if (button.getAttribute('data-correct') === 'true') {
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
