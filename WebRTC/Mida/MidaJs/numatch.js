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

/* ---------- Option generation helpers ---------- */
function addUnique(outSet, val) {
  // ensure val is two-digit string
  const v = String(val).padStart(2, '0');
  if (!outSet.has(v)) {
    outSet.add(v);
    return true;
  }
  return false;
}
function countMatches(setLike, pred) {
  let count = 0;
  for (const v of setLike) {
    if (pred(String(v))) count++;
  }
  return count;
}

/* ---------- Generators implementing the exact order + uniqueness retry ---------- */

/* CATEGORY A: two-digit with different digits (e.g. 12)
   Order:
   1) add correct "AB"
   2) add reverse "BA"
   3) add "0A" and "0B"
   4) generate:
        - 2 starting with A and not ending with B
        - 2 ending with B and not starting with A
        - 1 starting with B and not ending with A
        - 1 ending with A and not starting with B
*/
function generateOptionsCategoryA(correct) {
  const s = String(correct).padStart(2, '0'); // "12"
  const A = s[0],
    B = s[1];
  const out = new Set();

  // 1) correct
  addUnique(out, s);

  // 2) reverse BA (reserve)
  addUnique(out, B + A);

  // 3) one-digit displays for digits (always leading-zero)
  addUnique(out, '0' + A);
  addUnique(out, '0' + B);

  // 4) structured groups, each will loop until the required count is reached
  // Group 1: 2 starting with A but not ending with B
  while (
    countMatches(
      out,
      v => v.length === 2 && v[0] === A && v[1] !== B && v !== s
    ) < 2
  ) {
    const y = String(randInt(0, 9));
    const cand = A + y;
    if (cand === s || cand[1] === B) continue;
    addUnique(out, cand);
  }

  // Group 2: 2 ending with B but not starting with A
  while (
    countMatches(
      out,
      v => v.length === 2 && v[1] === B && v[0] !== A && v !== s
    ) < 2
  ) {
    const x = String(randInt(0, 9));
    const cand = x + B;
    if (cand === s || cand[0] === A) continue;
    addUnique(out, cand);
  }

  // Group 3: 1 starting with B but not ending with A
  while (
    countMatches(
      out,
      v => v.length === 2 && v[0] === B && v[1] !== A && v !== s
    ) < 1
  ) {
    const y = String(randInt(0, 9));
    const cand = B + y;
    if (cand === s || cand[1] === A) continue;
    addUnique(out, cand);
  }

  // Group 4: 1 ending with A but not starting with B
  while (
    countMatches(
      out,
      v => v.length === 2 && v[1] === A && v[0] !== B && v !== s
    ) < 1
  ) {
    const x = String(randInt(0, 9));
    const cand = x + A;
    if (cand === s || cand[0] === B) continue;
    addUnique(out, cand);
  }

  // Safety fallback (kept per your request) — should rarely if ever happen
  while (out.size < 10) {
    const cand = twoDigitStr(randInt(0, 99));
    if (cand !== s) addUnique(out, cand);
  }

  return shuffleArr(Array.from(out));
}

/* CATEGORY B: one-digit correct (e.g. 4)
   Order/reserve:
   1) add correct "0D" (displayed)
   2) add "DD" (double-digit) as reserved
   3) generate 4 starting with D (not ending D) and 4 ending with D (not starting D)
*/
function generateOptionsCategoryB(correct) {
  const D = String(correct);
  const correctStr = twoDigitStr(correct); // "04"
  const out = new Set();

  // Reserve correct displayed form
  addUnique(out, correctStr);

  // Reserve "DD" (two-digit double)
  addUnique(out, D + D);

  // 4 starting with D and not ending with D
  while (
    countMatches(
      out,
      v => v.length === 2 && v[0] === D && v[1] !== D && v !== correctStr
    ) < 4
  ) {
    const y = String(randInt(0, 9));
    const cand = D + y;
    if (cand === correctStr || cand === D + D) continue;
    addUnique(out, cand);
  }

  // 4 ending with D and not starting with D
  while (
    countMatches(
      out,
      v => v.length === 2 && v[1] === D && v[0] !== D && v !== correctStr
    ) < 4
  ) {
    const x = String(randInt(0, 9));
    const cand = x + D;
    if (cand === correctStr || cand === D + D) continue;
    addUnique(out, cand);
  }

  // Safety fallback (kept)
  while (out.size < 10) {
    const cand = twoDigitStr(randInt(0, 99));
    if (cand !== correctStr) addUnique(out, cand);
  }

  return shuffleArr(Array.from(out));
}

/* CATEGORY C: two identical digits (e.g. 77)
   Order/reserve:
   1) add correct "AA"
   2) add "0A" (leading zero)
   3) generate 4 starting with A (not ending A) and 4 ending with A (not starting A)
*/
function generateOptionsCategoryC(correct) {
  const s = String(correct).padStart(2, '0'); // "77"
  const D = s[0];
  const out = new Set();

  // Reserve correct "77"
  addUnique(out, s);

  // Reserve leading-zero "07"
  addUnique(out, '0' + D);

  // 4 starting with D and not ending with D
  while (
    countMatches(
      out,
      v => v.length === 2 && v[0] === D && v[1] !== D && v !== s
    ) < 4
  ) {
    const y = String(randInt(0, 9));
    const cand = D + y;
    if (cand === s) continue;
    addUnique(out, cand);
  }

  // 4 ending with D and not starting with D
  while (
    countMatches(
      out,
      v => v.length === 2 && v[1] === D && v[0] !== D && v !== s
    ) < 4
  ) {
    const x = String(randInt(0, 9));
    const cand = x + D;
    if (cand === s) continue;
    addUnique(out, cand);
  }

  // Safety fallback (kept)
  while (out.size < 10) {
    const cand = twoDigitStr(randInt(10, 99));
    if (cand !== s) addUnique(out, cand);
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
    // Top boxes are single-digit display when applicable (no leading zero)
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
      const s = String(n).padStart(2, '0');
      if (s[0] === s[1]) {
        optionList = generateOptionsCategoryC(n);
      } else {
        optionList = generateOptionsCategoryA(n);
      }
    } else {
      // fallback: should not happen
      optionList = [];
      optionList.push(twoDigitStr(n));
      while (optionList.length < 10)
        optionList.push(twoDigitStr(randInt(0, 99)));
      shuffleArr(optionList);
    }

    // safety trim/pad
    if (optionList.length > 10) optionList = optionList.slice(0, 10);
    while (optionList.length < 10) optionList.push(twoDigitStr(randInt(0, 99)));

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
      return; // do nothing, keep page clean
    }
    if (Number(val) !== generatedNumbers[i]) {
      return; // stop silently, don't show success text
    }
  }
  console.log('Success! All matched.');
}

/* init */
createUI();
