function handleMouseEnter(id) {
  var card = document.getElementById(id);
  if (card) {
    card.classList.remove('unhover');
    card.classList.add('blinds-effect');
  }
}

function handleMouseLeave(id) {
  var card = document.getElementById(id);
  if (card) {
    card.classList.add('unhover');
  }
}
