document.addEventListener("DOMContentLoaded", function() {
  var headerText = document.querySelector("#main-content h1");
  var descriptionText = document.querySelector("#main-content p");
  var button = document.querySelector("#main-content button");

  // texts animation fade
  setTimeout(function() {
      headerText.classList.add("fade-in");
  }, 200); 

  setTimeout(function() {
      descriptionText.classList.add("fade-in");
  }, 450); 

  setTimeout(function() {
      button.classList.add("fade-in");
  }, 700);

});
