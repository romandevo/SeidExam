function toggleModal(id, isVisible) {
  var modalElem = document.getElementById(id);
  var backdrop = document.getElementById(id + '-backdrop');

  if (isVisible) {
    modalElem.classList.remove('d-none');
    backdrop.classList.remove('d-none');
  } else {
    modalElem.classList.add('d-none');
    backdrop.classList.add('d-none');
  }
}
