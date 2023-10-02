(() => {

let currentURL = window.location.href;
if (currentURL.includes("medieval/grumpyking") || 
      currentURL.includes("brightvale/wiseking")) {
  
// Function to select a random option from a dropdown menu, excluding the first option
function selectRandomOption(selectElement) {
  // Get the total number of options
  let numOptions = selectElement.options.length;

  // If there are two or more options, proceed to select a random one excluding the first option
  if (numOptions >= 2) {
    // Generate a random index from 1 to numOptions - 1 (inclusive)
    let randomIndex = Math.floor(Math.random() * (numOptions - 1)) + 1;
    // Select the random option
    selectElement.selectedIndex = randomIndex;
  }
}

function randomizeDropdowns(){
    // Get all the dropdown menus on the page
    let selects = document.querySelectorAll('select');
    
    // Iterate through each dropdown menu and select a random option
    selects.forEach(select => {
      // If the name of the dropdown is not 'lang', proceed to select a random option
      if (select.name !== 'lang') {
        selectRandomOption(select);
      }
    });
}

// Get the third form element
const targetForm = document.getElementsByTagName("form")[2];

// Create the button
const randomizeButton = document.createElement("img");
randomizeButton.src = browser.runtime.getURL("assets/randomize.png");
randomizeButton.onclick = randomizeDropdowns;

// Style or add any attributes if needed
randomizeButton.style.marginBottom = "10px";

// Create a center container and append the button to it
const centerContainer = document.createElement("center");
centerContainer.appendChild(randomizeButton);

// Insert the centered container (with the button inside) right before the third form
targetForm.parentNode.insertBefore(centerContainer, targetForm);



}})();
