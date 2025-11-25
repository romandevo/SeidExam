/* ---------- Helpers ---------- */
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function shuffleArr(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/* unique numbers */
function generateUniqueNumbers(count) {
  const set = new Set();
  while (set.size < count) {
    set.add(randInt(0, 99));
  }
  return Array.from(set);
}

/* category checks */
function isSingleDigit(n) {
  return n >= 0 && n <= 9;
}
function isTwoDigit(n) {
  return n >= 10 && n <= 99;
}

/* pad to 2-digit strings for display in dropdowns */
function twoDigitStr(n) {
  return String(n).padStart(2, '0');
}

/* ---------- Option generation rules (updated: all one-digit options use leading zero) ---------- */

/* helper to count predicate matches in a set-like collection */
function countMatches(setLike, pred) {
  let count = 0;
  for (const v of setLike) {
    if (pred(String(v))) count++;
  }
  return count;
}

/* CATEGORY A: two-digit with different digits (e.g. 12)
   one-digit incorrect options will be shown with leading zero ("01","02")
*/
function generateOptionsCategoryA(correct) {
  const s = correct.toString().padStart(2, '0'); // "12"
  const A = s[0],
    B = s[1];
  const out = new Set();
  out.add(s); // correct as two-digit

  // 2 starting with A but not ending with B
  while (
    countMatches(
      out,
      v => v.length === 2 && v[0] === A && v !== s && v[1] !== B
    ) < 2
  ) {
    const y = randInt(0, 9).toString();
    const candidate = A + y;
    if (candidate !== s && candidate[1] !== B) out.add(candidate);
  }

  // 2 ending with B but not starting with A
  while (
    countMatches(
      out,
      v => v.length === 2 && v[1] === B && v !== s && v[0] !== A
    ) < 2
  ) {
    const x = randInt(0, 9).toString();
    const candidate = x + B;
    if (candidate !== s && candidate[0] !== A) out.add(candidate);
  }

  // 1 starting with B but not ending with A
  while (
    countMatches(
      out,
      v => v.length === 2 && v[0] === B && v !== s && v[1] !== A
    ) < 1
  ) {
    const y = randInt(0, 9).toString();
    const candidate = B + y;
    if (candidate !== s && candidate[1] !== A) out.add(candidate);
  }

  // 1 ending with A but not starting with B
  while (
    countMatches(
      out,
      v => v.length === 2 && v[1] === A && v !== s && v[0] !== B
    ) < 1
  ) {
    const x = randInt(0, 9).toString();
    const candidate = x + A;
    if (candidate !== s && candidate[0] !== B) out.add(candidate);
  }

  // reversed number BA
  const rev = B + A;
  if (rev !== s) out.add(rev);

  // two one-digit incorrect options — BUT displayed with leading zero per your rule
  out.add('0' + A); // e.g. "01"
  out.add('0' + B); // e.g. "02"

  // ensure 10 items total
  while (out.size < 10) {
    const cand = randInt(0, 99).toString().padStart(2, '0');
    if (cand !== s) out.add(cand);
  }

  return shuffleArr(Array.from(out));
}

/* CATEGORY B: one-digit correct (e.g. 4)
   correct option shown as "04"
   incorrect options: 4 starting with D (not ending D), 4 ending with D (not starting D), 1 "DD"
   all one-digit displays will still be two-digit formatted where needed
*/
function generateOptionsCategoryB(correct) {
  const D = String(correct); // "4"
  const correctStr = twoDigitStr(correct); // "04"
  const out = new Set();

  out.add(correctStr); // "04"

  // 4 starting with D and not ending with D
  while (
    countMatches(out, v => v.length === 2 && v[0] === D && v[1] !== D) < 4
  ) {
    const y = randInt(0, 9).toString();
    const cand = D + y;
    if (cand !== D + D && cand !== correctStr) out.add(cand);
  }

  // 4 ending with D and not starting with D
  while (
    countMatches(out, v => v.length === 2 && v[1] === D && v[0] !== D) < 4
  ) {
    const x = randInt(0, 9).toString();
    const cand = x + D;
    if (cand !== D + D && cand !== correctStr) out.add(cand);
  }

  // 1 "DD"
  out.add(D + D);

  // ensure 10 items
  while (out.size < 10) {
    const cand = randInt(0, 99).toString().padStart(2, '0');
    if (cand !== correctStr) out.add(cand);
  }

  return shuffleArr(Array.from(out));
}

/* CATEGORY C: two identical digits (e.g. 77)
   incorrects: 4 starting with D not ending D, 4 ending with D not starting D, 1 "0D" (one-digit shown with leading zero)
*/
function generateOptionsCategoryC(correct) {
  const s = correct.toString().padStart(2, '0'); // "77"
  const D = s[0];
  const out = new Set();
  out.add(s);

  while (
    countMatches(out, v => v.length === 2 && v[0] === D && v[1] !== D) < 4
  ) {
    const y = randInt(0, 9).toString();
    const cand = D + y;
    if (cand !== s) out.add(cand);
  }
  while (
    countMatches(out, v => v.length === 2 && v[1] === D && v[0] !== D) < 4
  ) {
    const x = randInt(0, 9).toString();
    const cand = x + D;
    if (cand !== s) out.add(cand);
  }

  // one-digit incorrect displayed as "0D"
  out.add('0' + D);

  while (out.size < 10) {
    const cand = randInt(10, 99).toString();
    if (cand !== s) out.add(cand);
  }

  return shuffleArr(Array.from(out));
}

/* ---------- Build UI ---------- */

const generatedNumbers = generateUniqueNumbers(5); // numeric 0..99

const numbersDiv = document.getElementById('numbers');
const dropdownsDiv = document.getElementById('dropdowns');
const successMsg = document.getElementById('successMsg');

function createUI() {
  generatedNumbers.forEach(n => {
    const box = document.createElement('div');
    box.className = 'number-box';
    // Top boxes should be single-digit display when applicable (no leading zero)
    box.textContent = String(n);
    numbersDiv.appendChild(box);
  });

  generatedNumbers.forEach((n, idx) => {
    const wrap = document.createElement('span');
    wrap.className = 'select-wrap';

    const sel = document.createElement('select');
    sel.className = 'captch-select';
    sel.dataset.index = idx;

    const placeholder = document.createElement('option');
    placeholder.value = '-1';
    placeholder.textContent = '';
    placeholder.selected = true;
    placeholder.disabled = true;
    sel.appendChild(placeholder);

    let optionList;
    if (isSingleDigit(n)) {
      optionList = generateOptionsCategoryB(n); // strings already two-digit where needed
    } else if (isTwoDigit(n)) {
      const s = n.toString().padStart(2, '0');
      if (s[0] === s[1]) {
        optionList = generateOptionsCategoryC(n);
      } else {
        optionList = generateOptionsCategoryA(n);
      }
    } else {
      optionList = [];
      optionList.push(n.toString().padStart(2, '0'));
      while (optionList.length < 10)
        optionList.push(randInt(0, 99).toString().padStart(2, '0'));
      shuffleArr(optionList);
    }

    if (optionList.length > 10) optionList = optionList.slice(0, 10);
    while (optionList.length < 10)
      optionList.push(randInt(0, 99).toString().padStart(2, '0'));

    optionList.forEach(opt => {
      const optEl = document.createElement('option');
      optEl.value = opt;
      optEl.textContent = opt;
      sel.appendChild(optEl);
    });

    sel.addEventListener('change', checkAll);
    wrap.appendChild(sel);
    dropdownsDiv.appendChild(wrap);
  });
}

/* ---------- Validation ---------- */
function checkAll() {
  const selects = document.querySelectorAll('.captch-select');
  for (let i = 0; i < selects.length; i++) {
    const val = selects[i].value;
    if (val === '-1') {
      successMsg.style.display = 'none';
      return;
    }
    // Numeric compare: "01" -> 1 matches top box 1
    if (Number(val) !== generatedNumbers[i]) {
      successMsg.style.display = 'none';
      return;
    }
  }
  console.log('Success! All matched.');
  successMsg.style.display = 'block';
}

/* init */
createUI();
