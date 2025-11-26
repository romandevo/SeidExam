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

function addUnique(outSet, val) {
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

function isSingleDigit(n) {
  return n >= 0 && n <= 9;
}
function isTwoDigit(n) {
  return n >= 10 && n <= 99;
}
function twoDigitStr(n) {
  return String(n).padStart(2, '0');
}

function generateUniqueNumbers(count) {
  const set = new Set();
  while (set.size < count) {
    set.add(randInt(0, 99));
  }
  return Array.from(set);
}

/* ---------- CATEGORY A: two-digit, different digits ---------- */
function generateOptionsCategoryA(correct) {
  const s = String(correct).padStart(2, '0');
  const A = s[0],
    B = s[1];
  const out = new Set();

  addUnique(out, s);
  addUnique(out, B + A);
  addUnique(out, '0' + A);
  addUnique(out, '0' + B);

  while (countMatches(out, v => v[0] === A && v[1] !== B && v !== s) < 2) {
    const y = String(randInt(0, 9));
    if (y !== B) addUnique(out, A + y);
  }

  while (countMatches(out, v => v[1] === B && v[0] !== A && v !== s) < 2) {
    const x = String(randInt(0, 9));
    if (x !== A) addUnique(out, x + B);
  }

  while (countMatches(out, v => v[0] === B && v[1] !== A && v !== s) < 1) {
    const y = String(randInt(0, 9));
    if (y !== A) addUnique(out, B + y);
  }

  while (countMatches(out, v => v[1] === A && v[0] !== B && v !== s) < 1) {
    const x = String(randInt(0, 9));
    if (x !== B) addUnique(out, x + A);
  }

  while (out.size < 10) {
    const cand = twoDigitStr(randInt(0, 99));
    if (cand !== s) addUnique(out, cand);
  }

  return shuffleArr(Array.from(out));
}

/* ---------- CATEGORY B: 1-digit correct ---------- */
function generateOptionsCategoryB(correct) {
  const D = String(correct);
  const correctStr = twoDigitStr(correct);
  const out = new Set();

  addUnique(out, correctStr);
  addUnique(out, D + D);

  while (countMatches(out, v => v[0] === D && v[1] !== D) < 4) {
    const y = String(randInt(0, 9));
    if (y !== D) addUnique(out, D + y);
  }

  while (countMatches(out, v => v[1] === D && v[0] !== D) < 4) {
    const x = String(randInt(0, 9));
    if (x !== D) addUnique(out, x + D);
  }

  while (out.size < 10) {
    addUnique(out, twoDigitStr(randInt(0, 99)));
  }

  return shuffleArr(Array.from(out));
}

/* ---------- CATEGORY C: double digits like 77 ---------- */
function generateOptionsCategoryC(correct) {
  const s = String(correct).padStart(2, '0');
  const D = s[0];
  const out = new Set();

  addUnique(out, s);
  addUnique(out, '0' + D);

  while (countMatches(out, v => v[0] === D && v[1] !== D) < 4) {
    const y = String(randInt(0, 9));
    if (y !== D) addUnique(out, D + y);
  }

  while (countMatches(out, v => v[1] === D && v[0] !== D) < 4) {
    const x = String(randInt(0, 9));
    if (x !== D) addUnique(out, x + D);
  }

  while (out.size < 10) {
    addUnique(out, twoDigitStr(randInt(10, 99)));
  }

  return shuffleArr(Array.from(out));
}

/* ----------------------------------------------- */
/* ---------- 6-BOX SYSTEM (NEW FEATURE) ---------- */
/* ----------------------------------------------- */

function generateSixBoxNumbers() {
  const digits = [];
  const used = new Set();

  const repeat = randInt(0, 9);

  used.add(repeat);
  digits.push(repeat, repeat);

  while (digits.length < 6) {
    const d = randInt(0, 9);
    if (!used.has(d)) {
      used.add(d);
      digits.push(d);
    }
  }

  return shuffleArr(digits);
}

function create6BoxSystem() {
  const numbersDiv = document.getElementById('numbers');
  const dropdownsDiv = document.getElementById('dropdowns');

  numbersDiv.innerHTML = '';
  dropdownsDiv.innerHTML = '';

  const nums = generateSixBoxNumbers();

  nums.forEach(n => {
    const box = document.createElement('div');
    box.className = 'number-box';
    box.textContent = String(n);
    numbersDiv.appendChild(box);
  });

  nums.forEach((n, idx) => {
    const wrap = document.createElement('span');
    wrap.className = 'select-wrap';

    const sel = document.createElement('select');
    sel.className = 'captch-select';
    sel.dataset.index = idx;

    const order = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
    order.forEach(o => {
      const opt = document.createElement('option');
      opt.value = o;
      opt.textContent = o;
      sel.appendChild(opt);
    });

    sel.selectedIndex = -1;

    sel.addEventListener('change', () => {
      for (let i = 0; i < 6; i++) {
        const dd = document.querySelectorAll('.captch-select')[i];
        if (dd.selectedIndex === -1) return;
        if (Number(dd.value) !== nums[i]) return;
      }
      console.log('Success! All matched.');
    });

    wrap.appendChild(sel);
    dropdownsDiv.appendChild(wrap);
  });
}

/* ----------------------------------------------- */
/* ---------- ORIGINAL 5-BOX SYSTEM CODE ---------- */
/* ----------------------------------------------- */

function create5BoxSystem() {
  const numbersDiv = document.getElementById('numbers');
  const dropdownsDiv = document.getElementById('dropdowns');

  numbersDiv.innerHTML = '';
  dropdownsDiv.innerHTML = '';

  const generatedNumbers = generateUniqueNumbers(5);

  generatedNumbers.forEach(n => {
    const box = document.createElement('div');
    box.className = 'number-box';
    box.textContent = String(n);
    numbersDiv.appendChild(box);
  });

  generatedNumbers.forEach((n, idx) => {
    const wrap = document.createElement('span');
    wrap.className = 'select-wrap';

    const sel = document.createElement('select');
    sel.className = 'captch-select';
    sel.dataset.index = idx;

    // HIDDEN placeholder (not visible in dropdown)
    const hiddenPlaceholder = document.createElement('option');
    hiddenPlaceholder.value = '';
    hiddenPlaceholder.textContent = '';
    hiddenPlaceholder.hidden = true;
    hiddenPlaceholder.selected = true;
    sel.appendChild(hiddenPlaceholder);

    let optionList;

    if (isSingleDigit(n)) {
      optionList = generateOptionsCategoryB(n);
    } else if (isTwoDigit(n)) {
      const s = String(n).padStart(2, '0');
      optionList =
        s[0] === s[1]
          ? generateOptionsCategoryC(n)
          : generateOptionsCategoryA(n);
    } else {
      optionList = [twoDigitStr(n)];
      while (optionList.length < 10) {
        optionList.push(twoDigitStr(randInt(0, 99)));
      }
      shuffleArr(optionList);
    }

    optionList.forEach(opt => {
      const optEl = document.createElement('option');
      optEl.value = opt;
      optEl.textContent = opt;
      sel.appendChild(optEl);
    });

    sel.addEventListener('change', () => {
      const selects = document.querySelectorAll('.captch-select');
      for (let i = 0; i < selects.length; i++) {
        if (selects[i].value === '') return;
        const correct = String(generatedNumbers[i]).padStart(2, '0');
        if (selects[i].value !== correct) return;
      }
      console.log('Success! All matched.');
    });

    wrap.appendChild(sel);
    dropdownsDiv.appendChild(wrap);
  });
}

/* ----------------------------------------------- */
/* ---------- RANDOM SYSTEM SELECTOR -------------- */
/* ----------------------------------------------- */

window.addEventListener('DOMContentLoaded', () => {
  if (Math.random() < 0.5) {
    create5BoxSystem();
  } else {
    create6BoxSystem();
  }
});
