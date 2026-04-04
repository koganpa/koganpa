window.onload = function() {
  const popupButton = document.getElementById("popupButton");
  const popup = document.getElementById("popup");
  const closePopup = document.getElementById("closePopup");

  popupButton.onclick = function() {
    popup.style.display = "block";
  };

  closePopup.onclick = function() {
    popup.style.display = "none";
  };

  window.onclick = function(event) {
    if (event.target === popup) {
      popup.style.display = "none";
    }
  };
};
