document.addEventListener('DOMContentLoaded', () => {
  // =============================
  //  SYSTEM 1: Bina tipi (9 mərtəbəli)
  // =============================

  let buildingType;

  document.querySelectorAll('li.list-group-item.success').forEach(li => {
    if (li.textContent.trim().includes('9 mərtəbəli')) {
      buildingType = li;
    }
  });

  // Get both floor <select> elements
  const floorSelects = document.querySelectorAll('.d-flex select');

  // If 9 mərtəbəli exists, add listener
  if (buildingType) {
    buildingType.addEventListener('click', () => {
      buildingType.classList.toggle('active');

      floorSelects.forEach(select => {
        if (buildingType.classList.contains('active')) {
          // Add 1–9 floors
          select.innerHTML = Array.from(
            { length: 9 },
            (_, i) => `<option value="${i + 1}">${i + 1}</option>`
          ).join('');
        } else {
          // Clear
          select.innerHTML = '';
        }
      });
    });
  }

  // =============================
  //  SYSTEM 2: Otaq sayı (1–4 otaqlı)
  // =============================

  const roomItems = document.querySelectorAll(
    '.card-row ul.list-group li.list-group-item.success'
  );

  roomItems.forEach(item => {
    // Skip the "9 mərtəbəli" element
    if (item.textContent.includes('mərtəbəli')) return;

    item.addEventListener('click', () => {
      item.classList.toggle('active');
    });
  });
});
