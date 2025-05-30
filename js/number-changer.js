// number-changer.js
export function updateQuestionDisplay() {
  const questionMap = window.questionMap;
  if (!Array.isArray(questionMap)) {
    console.warn('window.questionMap is not defined or invalid.');
    return;
  }

  const elements = document.querySelectorAll('.question-number');
  elements.forEach(el => {
    const currentNumber = parseInt(el.textContent.trim(), 10);
    if (isNaN(currentNumber)) return;

    const map = questionMap.find(
      m => currentNumber >= m.start && currentNumber <= m.end
    );
    if (map) {
      const pdfQuestion = currentNumber + map.offset;
      el.textContent = `${currentNumber} | PDF ${map.pdf} - Question ${pdfQuestion}`;
    } else {
      el.textContent = `${currentNumber} | Unknown PDF`;
    }
  });
}
