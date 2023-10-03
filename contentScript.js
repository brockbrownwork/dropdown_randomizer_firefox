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

// Create a center container and append the button to it
const centerContainer = document.createElement("center");
centerContainer.appendChild(randomizeButton);

const handleOtherButton = () => {
      console.log("otherbuttonfoo!");
      const possibilities = [
        "What",
        "do",
        "you do if",
        "*Leave blank*",
        "fierce",
        "Peophin",
        "*Leave blank*",
        "has eaten too much",
        "*Leave blank*",
        "tin of olives"
    ];

    possibilities.forEach((possibility, index) => {
        const dropdown = document.getElementById(`qp${index + 1}`);

        // Create a new option
        const option = document.createElement("option");
        option.value = possibility;
        option.text = possibility;

        // Add the option to the dropdown
        dropdown.appendChild(option);

        // Set the option as the selected value
        dropdown.value = possibility;
    });
    for (let i = 1; i <= 8; i++) {
      let dropdown = document.getElementById('ap' + i);
      
      if (dropdown) {
          // Check for an option with the value "Leave blank"
          let leaveBlankOption = Array.from(dropdown.options).find(option => option.text === "Leave blank");
          
          if (leaveBlankOption) {
              // Set the dropdown value to "Leave blank"
              dropdown.value = leaveBlankOption.value;
          } else {
              // Create a new option for "Leave blank" and select it if not found
              let newOption = new Option("Leave blank", "Leave blank");
              dropdown.add(newOption);
              dropdown.value = "Leave blank";
          }
      }
  }
}

// If grumpy king, add another button
if (currentURL.includes("medieval/grumpyking") ) {
  const otherButton = document.createElement("img");
  otherButton.src = browser.runtime.getURL("assets/skull_dice.png");
  otherButton.onclick = handleOtherButton;
  centerContainer.appendChild(otherButton);
}
// Insert the centered container (with the button inside) right before the third form
targetForm.parentNode.insertBefore(centerContainer, targetForm);



}})();
