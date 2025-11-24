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
          select.innerHTML = Array.from(
            { length: 9 },
            (_, i) => `<option value="${i + 1}">${i + 1}</option>`
          ).join('');

          // deselect everything
          select.selectedIndex = -1;
        } else {
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

  // =============================
  //  SYSTEM 3: "Axtar" button replaces table-wrapper content
  // =============================

  const searchButton = document.querySelector('.btn.btn-success.w-100');
  const tableWrapper = document.querySelector('#table-wrapper');

  // Put your long HTML here
  const newTableContent = `
      <div>
      <div class="row m-0 py-3 bg-white position-sticky top-0">
        <div
          class="fs-14 fw-600 text-center p-0"
          style="width: 12.5%; flex: 0 0 auto"
        >
          Bina
        </div>
        <div
          class="fs-14 fw-600 text-center p-0"
          style="width: 12.5%; flex: 0 0 auto"
        >
          Giriş
        </div>
        <div
          class="fs-14 fw-600 text-center p-0"
          style="width: 12.5%; flex: 0 0 auto"
        >
          Mərtəbə
        </div>
        <div
          class="fs-14 fw-600 text-center p-0"
          style="width: 12.5%; flex: 0 0 auto"
        >
          Mənzil
        </div>
        <div class="col-2 fs-14 fw-600 text-center p-0">Otaq sayı</div>
        <div class="col-2 fs-14 fw-600 text-center p-0">Sahə, m<sup>2</sup></div>
        <div class="col-2 fs-14 fw-600 text-center p-0">Qiymət, AZN</div>
      </div>
      <div class="row apartment-row success">
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">3</div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">
          11
        </div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">
          1 / 9
        </div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">1</div>
        <div class="col-2 apartment-row-item">3</div>
        <div class="col-2 apartment-row-item">72.90 - 85.20</div>
        <div class="col-2 apartment-row-item">87480</div>
      </div>
      <div class="row apartment-row success">
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">3</div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">
          11
        </div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">
          6 / 9
        </div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">1</div>
        <div class="col-2 apartment-row-item">3</div>
        <div class="col-2 apartment-row-item">72.90 - 85.20</div>
        <div class="col-2 apartment-row-item">87480</div>
      </div>
      <div class="row apartment-row success">
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">3</div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">
          11
        </div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">
          7 / 9
        </div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">1</div>
        <div class="col-2 apartment-row-item">3</div>
        <div class="col-2 apartment-row-item">72.90 - 85.20</div>
        <div class="col-2 apartment-row-item">87480</div>
      </div>
      <div class="row apartment-row success">
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">3</div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">
          11
        </div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">
          9 / 9
        </div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">1</div>
        <div class="col-2 apartment-row-item">3</div>
        <div class="col-2 apartment-row-item">72.90 - 85.20</div>
        <div class="col-2 apartment-row-item">87480</div>
      </div>
      <div class="row apartment-row success">
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">4</div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">
          13
        </div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">
          6 / 9
        </div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">3</div>
        <div class="col-2 apartment-row-item">3</div>
        <div class="col-2 apartment-row-item">72.90 - 85.20</div>
        <div class="col-2 apartment-row-item">87480</div>
      </div>
      <div class="row apartment-row success">
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">4</div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">
          13
        </div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">
          7 / 9
        </div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">3</div>
        <div class="col-2 apartment-row-item">3</div>
        <div class="col-2 apartment-row-item">72.90 - 85.20</div>
        <div class="col-2 apartment-row-item">87480</div>
      </div>
      <div class="row apartment-row success">
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">4</div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">
          15
        </div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">
          2 / 9
        </div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">1</div>
        <div class="col-2 apartment-row-item">3</div>
        <div class="col-2 apartment-row-item">72.90 - 85.20</div>
        <div class="col-2 apartment-row-item">87480</div>
      </div>
      <div class="row apartment-row success">
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">4</div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">
          15
        </div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">
          5 / 9
        </div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">1</div>
        <div class="col-2 apartment-row-item">3</div>
        <div class="col-2 apartment-row-item">72.90 - 85.20</div>
        <div class="col-2 apartment-row-item">87480</div>
      </div>
      <div class="row apartment-row success">
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">4</div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">
          15
        </div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">
          9 / 9
        </div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">1</div>
        <div class="col-2 apartment-row-item">3</div>
        <div class="col-2 apartment-row-item">72.90 - 85.20</div>
        <div class="col-2 apartment-row-item">87480</div>
      </div>
      <div class="row apartment-row success">
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">6</div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">
          604
        </div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">
          4 / 9
        </div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">3</div>
        <div class="col-2 apartment-row-item">3</div>
        <div class="col-2 apartment-row-item">72.90 - 88.50</div>
        <div class="col-2 apartment-row-item">87480</div>
      </div>
      <div class="row apartment-row success">
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">6</div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">
          604
        </div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">
          5 / 9
        </div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">3</div>
        <div class="col-2 apartment-row-item">3</div>
        <div class="col-2 apartment-row-item">72.90 - 88.50</div>
        <div class="col-2 apartment-row-item">87480</div>
      </div>
      <div class="row apartment-row success">
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">6</div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">
          604
        </div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">
          7 / 9
        </div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">3</div>
        <div class="col-2 apartment-row-item">3</div>
        <div class="col-2 apartment-row-item">72.90 - 88.50</div>
        <div class="col-2 apartment-row-item">87480</div>
      </div>
      <div class="row apartment-row success">
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">6</div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">
          604
        </div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">
          9 / 9
        </div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">3</div>
        <div class="col-2 apartment-row-item">3</div>
        <div class="col-2 apartment-row-item">72.90 - 88.50</div>
        <div class="col-2 apartment-row-item">87480</div>
      </div>
      <div class="row apartment-row success">
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">6</div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">
          606
        </div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">
          2 / 9
        </div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">1</div>
        <div class="col-2 apartment-row-item">3</div>
        <div class="col-2 apartment-row-item">72.90 - 88.50</div>
        <div class="col-2 apartment-row-item">87480</div>
      </div>
      <div class="row apartment-row success">
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">6</div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">
          606
        </div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">
          4 / 9
        </div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">1</div>
        <div class="col-2 apartment-row-item">3</div>
        <div class="col-2 apartment-row-item">72.90 - 88.50</div>
        <div class="col-2 apartment-row-item">87480</div>
      </div>
      <div class="row apartment-row success">
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">6</div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">
          606
        </div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">
          6 / 9
        </div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">1</div>
        <div class="col-2 apartment-row-item">3</div>
        <div class="col-2 apartment-row-item">72.90 - 88.50</div>
        <div class="col-2 apartment-row-item">87480</div>
      </div>
      <div class="row apartment-row success">
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">6</div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">
          606
        </div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">
          7 / 9
        </div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">1</div>
        <div class="col-2 apartment-row-item">3</div>
        <div class="col-2 apartment-row-item">72.90 - 88.50</div>
        <div class="col-2 apartment-row-item">87480</div>
      </div>
      <div class="row apartment-row success">
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">6</div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">
          606
        </div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">
          8 / 9
        </div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">1</div>
        <div class="col-2 apartment-row-item">3</div>
        <div class="col-2 apartment-row-item">72.90 - 88.50</div>
        <div class="col-2 apartment-row-item">87480</div>
      </div>
      <div class="row apartment-row success">
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">6</div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">
          606
        </div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">
          9 / 9
        </div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">1</div>
        <div class="col-2 apartment-row-item">3</div>
        <div class="col-2 apartment-row-item">72.90 - 88.50</div>
        <div class="col-2 apartment-row-item">87480</div>
      </div>
      <div class="row apartment-row success">
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">7</div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">
          608
        </div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">
          2 / 9
        </div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">3</div>
        <div class="col-2 apartment-row-item">3</div>
        <div class="col-2 apartment-row-item">72.90 - 88.50</div>
        <div class="col-2 apartment-row-item">87480</div>
      </div>
      <div class="row apartment-row success">
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">7</div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">
          608
        </div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">
          3 / 9
        </div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">3</div>
        <div class="col-2 apartment-row-item">3</div>
        <div class="col-2 apartment-row-item">72.90 - 88.50</div>
        <div class="col-2 apartment-row-item">87480</div>
      </div>
      <div class="row apartment-row success">
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">7</div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">
          608
        </div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">
          4 / 9
        </div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">3</div>
        <div class="col-2 apartment-row-item">3</div>
        <div class="col-2 apartment-row-item">72.90 - 88.50</div>
        <div class="col-2 apartment-row-item">87480</div>
      </div>
      <div class="row apartment-row success">
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">7</div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">
          608
        </div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">
          5 / 9
        </div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">3</div>
        <div class="col-2 apartment-row-item">3</div>
        <div class="col-2 apartment-row-item">72.90 - 88.50</div>
        <div class="col-2 apartment-row-item">87480</div>
      </div>
      <div class="row apartment-row success">
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">7</div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">
          608
        </div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">
          6 / 9
        </div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">3</div>
        <div class="col-2 apartment-row-item">3</div>
        <div class="col-2 apartment-row-item">72.90 - 88.50</div>
        <div class="col-2 apartment-row-item">87480</div>
      </div>
      <div class="row apartment-row success">
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">7</div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">
          608
        </div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">
          7 / 9
        </div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">3</div>
        <div class="col-2 apartment-row-item">3</div>
        <div class="col-2 apartment-row-item">72.90 - 88.50</div>
        <div class="col-2 apartment-row-item">87480</div>
      </div>
      <div class="row apartment-row success">
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">7</div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">
          610
        </div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">
          2 / 9
        </div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">1</div>
        <div class="col-2 apartment-row-item">3</div>
        <div class="col-2 apartment-row-item">72.90 - 88.50</div>
        <div class="col-2 apartment-row-item">87480</div>
      </div>
      <div class="row apartment-row success">
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">7</div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">
          610
        </div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">
          3 / 9
        </div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">1</div>
        <div class="col-2 apartment-row-item">3</div>
        <div class="col-2 apartment-row-item">72.90 - 88.50</div>
        <div class="col-2 apartment-row-item">87480</div>
      </div>
      <div class="row apartment-row success">
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">7</div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">
          610
        </div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">
          4 / 9
        </div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">1</div>
        <div class="col-2 apartment-row-item">3</div>
        <div class="col-2 apartment-row-item">72.90 - 88.50</div>
        <div class="col-2 apartment-row-item">87480</div>
      </div>
      <div class="row apartment-row success">
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">7</div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">
          610
        </div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">
          6 / 9
        </div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">1</div>
        <div class="col-2 apartment-row-item">3</div>
        <div class="col-2 apartment-row-item">72.90 - 88.50</div>
        <div class="col-2 apartment-row-item">87480</div>
      </div>
      <div class="row apartment-row success">
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">7</div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">
          610
        </div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">
          7 / 9
        </div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">1</div>
        <div class="col-2 apartment-row-item">3</div>
        <div class="col-2 apartment-row-item">72.90 - 88.50</div>
        <div class="col-2 apartment-row-item">87480</div>
      </div>
      <div class="row apartment-row success">
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">3</div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">9</div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">
          1 / 9
        </div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">3</div>
        <div class="col-2 apartment-row-item">3</div>
        <div class="col-2 apartment-row-item">72.90 - 85.20</div>
        <div class="col-2 apartment-row-item">87480</div>
      </div>
      <div class="row apartment-row success">
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">3</div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">9</div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">
          2 / 9
        </div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">3</div>
        <div class="col-2 apartment-row-item">3</div>
        <div class="col-2 apartment-row-item">72.90 - 85.20</div>
        <div class="col-2 apartment-row-item">87480</div>
      </div>
      <div class="row apartment-row success">
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">3</div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">9</div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">
          3 / 9
        </div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">3</div>
        <div class="col-2 apartment-row-item">3</div>
        <div class="col-2 apartment-row-item">72.90 - 85.20</div>
        <div class="col-2 apartment-row-item">87480</div>
      </div>
      <div class="row apartment-row success">
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">3</div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">9</div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">
          7 / 9
        </div>
        <div class="apartment-row-item" style="width: 12.5%; flex: 0 0 auto">3</div>
        <div class="col-2 apartment-row-item">3</div>
        <div class="col-2 apartment-row-item">72.90 - 85.20</div>
        <div class="col-2 apartment-row-item">87480</div>
      </div>
    </div>
  `;

  searchButton.addEventListener('click', () => {
    tableWrapper.innerHTML = newTableContent;
  });
});
