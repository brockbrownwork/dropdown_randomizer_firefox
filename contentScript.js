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

     function randomizeDropdowns() {
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
     if (currentURL.includes("medieval/grumpyking")) {
        const otherButton = document.createElement("img");
        otherButton.src = browser.runtime.getURL("assets/skull_dice.png");
        otherButton.onclick = handleOtherButton;
        centerContainer.appendChild(otherButton);
     }
     // Insert the centered container (with the button inside) right before the third form
     targetForm.parentNode.insertBefore(centerContainer, targetForm);
  }


  // Haggling

  function hover(element) {
     element.setAttribute('src', browser.runtime.getURL("assets/haggle_small.gif"));
  }

  function unhover(element) {
     element.setAttribute('src', browser.runtime.getURL("assets/haggle_small.png"));
  }

  function insertHaggleButton() {
     // Find all image elements on the page
     const images = document.querySelectorAll('img');

     // Iterate through the image elements
     for (const img of images) {
        // Check if the src attribute contains the word "shopkeeper"
        if (img.src.includes('shopkeeper')) {
           // Clone the image node
           const clonedImg = img.cloneNode(true);

           // Optional: Add some styling to place the clone to the right
           clonedImg.style.marginLeft = '10px'; // Add 10px margin to the left of the cloned image
           clonedImg.src = "https://upload.wikimedia.org/wikipedia/commons/a/a0/Haggle_small_2.png";
           clonedImg.addEventListener('mouseover', function () {
              hover(this);
           });
           clonedImg.addEventListener('mouseout', function () {
              unhover(this);
           });
           clonedImg.addEventListener('click', function () {
              haggle();
           });
           // clonedImg.src = browser.runtime.getURL("assets/haggle.png");
           // Insert the cloned image to the right of the original image
           img.parentNode.insertBefore(clonedImg, img.nextSibling);

           // Stop the function once the image is found and duplicated
           break;
        }
     }
  }

  function findBoldElement() {
     // Get all <b> elements in the document
     const boldElements = document.querySelectorAll('b');

     // Search through the <b> elements
     for (const element of boldElements) {
        if (element.innerText.includes("The Shopkeeper says 'I won't take less than")) {
           return element;
        }
     }

     // Return null if no matching element is found
     return null;
  }

  function extractNumbersFromString(str) {
     // Remove commas from the string
     const cleanedStr = str.replace(/,/g, '');

     // Extract numbers from the cleaned string
     const matches = cleanedStr.match(/-?\d+(\.\d+)?/g);

     return matches ? matches.map(Number) : [];
  }

  function haggle() {
     console.log("buying screen detected");
     let allDivTags = document.querySelectorAll("div[id='center']");
     for (i = 0; i < allDivTags.length; i++) {
        if (allDivTags[i].innerText.includes("I accept")) {
           let acceptedPrice = extractNumbersFromString(allDivTags[i].innerText);
           console.log("Accepted price:", acceptedPrice);
           let startingPrice = localStorage.getItem("startingPrice");
           console.log("Neopoints saved:", startingPrice - acceptedPrice);
           return;
        }
     }
     if (document.body.innerText.includes("I accept")) {
        return;
     };
     let shopkeeperSays = findBoldElement();
     console.log("shopkeeper says " + shopkeeperSays.innerText);
     let price = parseInt(extractNumbersFromString(shopkeeperSays.innerText)[0]);
     console.log("Price:", price);
     let formLines = document.querySelectorAll("form")[2].innerText.split("\n");
     // iterate over each line of the form
     for (i = 0; i < formLines.length; i++) {
        let line = formLines[i];
        if (line.includes("Your Current Offer")) {
           console.log(line);
           let currentOffer = parseInt(extractNumbersFromString(line));
           if (currentOffer == 0) {
              localStorage.setItem("startingPrice", price);
              console.log("Starting price set to", price);
           }
        } else if (line.includes("Your Previous Offer")) {
           console.log(line);
           let previousOffer = parseInt(extractNumbersFromString(line));
           if (previousOffer == 0) {
              // insertHaggleButton(); // TODO: yeah
              var hagglePrice = Math.round(price * 0.5);
           } else {
              // put the price between the offered price and the previous offer
              var hagglePrice = Math.round((previousOffer + price) / 2);
           }
        }
     }


     console.log("Haggle price:", hagglePrice);
     haggleInput = document.querySelector("input[name='np_amt']");
     haggleInput.value = hagglePrice.toString();
     submitButton = document.querySelector('input[value="Submit Offer!"]');
     submitButton.click();
  }

  if (currentURL.includes("/buyitem")) {
     let shopkeeperSays = findBoldElement();
     console.log("shopkeeper says " + shopkeeperSays.innerText);
     let price = parseInt(extractNumbersFromString(shopkeeperSays.innerText)[0]);
     let formLines = document.querySelectorAll("form")[2].innerText.split("\n");
     for (i = 0; i < formLines.length; i++) {
        let line = formLines[i];
        if (line.includes("Your Current Offer")) {
           console.log(line);
           var currentOffer = parseInt(extractNumbersFromString(line));
           if (currentOffer == 0) {
              localStorage.setItem("startingPrice", price);
              console.log("Starting price set to", price);
           }
        } else if (line.includes("Your Previous Offer")) {
           console.log(line);
           let previousOffer = parseInt(extractNumbersFromString(line));
           if (previousOffer == 0) {
              // insertHaggleButton(); // TODO: yeah
              var hagglePrice = Math.round(price * 0.5);
           } else {
              // put the price between the offered price and the previous offer
              var hagglePrice = Math.round((previousOffer + price) / 2);
           }
        }
     }
     if (currentOffer == 0) {
        insertHaggleButton();
     } else if (currentOffer > 0) {
        haggle()
     }
  }

  // end
})();