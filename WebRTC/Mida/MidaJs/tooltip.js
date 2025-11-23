function toggleTooltip(id, isVisible) {
  var element = document.getElementById(id + '-tooltip');

  if (isVisible) {
    element.classList.remove('d-none');
  } else {
    element.classList.add('d-none');
  }
}
