  // Solution
  //Question
  let QuestionArray = "";
  let AnswerArray = "";
  let sudokuSolution = [];
  let sudokuArray = [];
  let boolTable = [];


  // Variables
  let elapsedTime = 0;
  let isTimerRunning = false;
  let timerInterval;
  let userName;
  let moves = 0;
  let correctMoves = 0;
  let totalBlankCells = 0;
  let correctCells = 0;
  let savedDifficulty = localStorage.getItem('difficulty');
  let randomID = Math.floor(Math.random() * 4) + 1;


  // Fetching data for Table
  async function loadJsonData() {
    try {
        const response = await fetch('sudoku.json'); // Ensure correct path to sudoku.json
        if (!response.ok) {
            throw new Error('Failed to load JSON data');
        }
        const jsonData = await response.json();
        console.log('Data loaded into jsonData:', jsonData); // Log to verify it's loaded

        // Use jsonData directly
        const { question, answer } = getQuestionAndAnswerByIdAndDifficulty(jsonData, randomID, savedDifficulty);
        
        console.log('Retrieved Question:', randomID);
        console.log('Retrieved Difficulty:', savedDifficulty);
        console.log('Retrieved Question:', question);
        console.log('Retrieved Answer:', answer);

        // Save Question and Answer in different variables
        if (question && answer) {
            QuestionArray = question;
            AnswerArray = answer;

            console.log('Saved Question:', QuestionArray[0]);
            console.log('Saved Answer:', AnswerArray[0]);

            processSudokuData(QuestionArray, AnswerArray);
        } else {
            console.log('No matching Question and Answer found.');
        }

    } catch (error) {
        console.error('Error:', error);
    }
  }


  // Setting the data to each value
  function getQuestionAndAnswerByIdAndDifficulty(data, id, difficulty) {
    // Inspect the data structure
    for (const item of data) {
        if (item.ID === Number(id) && item.Difficulty.toLowerCase() === difficulty.toLowerCase()) {
            return {
                question: item.Question,
                answer: item.Answer
            };
        }
    }
    return { question: null, answer: null }; // Return nulls if no match is found
  }


  // Function to convert a comma-separated string into a 2D array
  function processSudokuData(QuestionArray, AnswerArray) {
    // Function to convert a comma-separated string into a 2D array
    function convertTo2DArray(sudokuArray) {
        const sudokuray = [];
        for (let i = 0; i < sudokuArray.length; i++) {
            const row = [];
            for (let j = 0; j < sudokuArray[i].length; j++) {
                const currentValue = sudokuArray[i][j];
                // Handle undefined or empty values
                row.push(currentValue === undefined ? "" : currentValue);
            }
            sudokuray.push(row);  // Add the row to the 2D array
        }
        return sudokuray;
    }

    // Process the sudoku arrays only after they are ready
    console.log('QuestionArray:', QuestionArray[0]);  // Check if the array is valid
    console.log('AnswerArray:', AnswerArray[0]); 

    sudokuArray = convertTo2DArray(QuestionArray);
    sudokuSolution = convertTo2DArray(AnswerArray);

    boolTable = createBoolTable(sudokuArray);

    console.log('sudokusolution:', sudokuSolution[0]);
    console.log('sudokuarray:', sudokuArray[0]);
    console.log('boolTable:', boolTable[0]);
    generateSudokuTable();
  }


 // Clock start
  window.onload = function () {
    loadJsonData();
    startClock();
  };


  //Game resets and initialization
  function initializeGame() {
    moves = 0;
    correctMoves = 0;
    totalBlankCells = 0;
    for (let row of sudokuArray) {
      for (let cell of row) {
        if (cell === 0) {
          totalBlankCells++; 
        }
      }
    }
  }


  //Clock time function
  function startClock() {
    clockInterval = setInterval(function () {
      const currentTime = new Date();
      const hours = currentTime.getHours().toString().padStart(2, "0");
      const minutes = currentTime.getMinutes().toString().padStart(2, "0");
      const seconds = currentTime.getSeconds().toString().padStart(2, "0");
      document.getElementById("currentTime").innerText = `Current Time: ${hours}:${minutes}:${seconds}`;
    }, 1000);
  }


  //Bool Table
  function createBoolTable(sudokuArray) {
    return sudokuArray.map(row => 
        row.map(cell => cell === 0 ? true : false)
    );
  }

  
  //Blank cell calculation
  for (let i = 0; i < sudokuArray.length; i++) {
    for (let j = 0; j < sudokuArray[i].length; j++) {
      if (boolTable[i][j] === true) {
        totalBlankCells++;
      }
    }
  }


  //Sudoku generation
  function generateSudokuTable() {
    const sudokuBody = document.getElementById('sudoku-body');
    
    for (let i = 0; i < sudokuArray.length; i++) {
      const row = document.createElement('tr');
      for (let j = 0; j < sudokuArray[i].length; j++) {
        if (sudokuArray[i][j] === "" || sudokuArray[i][j] === 0) {
          const cell = document.createElement('td');
          cell.innerHTML = `<input 
                              type="text" 
                              maxlength="1" 
                              class="custom-input" 
                              oninput="validateInput(this)"
                              onfocus="highlightCell(this, true)" 
                              onblur="highlightCell(this, false)"  
                              disabled
                            />`;
          row.appendChild(cell);
        } else {
          const cell = document.createElement('td');
          cell.className = "filled-cell";
          cell.textContent = sudokuArray[i][j];
          cell.onclick = () => highlightCell(cell, true);
          row.appendChild(cell);
        }
      }
      sudokuBody.appendChild(row);
    }
  }
  

  //Name modal OK
  document.getElementById("okButton").addEventListener("click", function() {
    userName = document.getElementById("nameInput").value;

    if (userName === null || userName.trim() === "") {
        document.getElementById("NameCancelModal").style.display = "block";
    } else {
        document.getElementById("NameModal").style.display = "none"; // Close the modal
        startTimer(); // Start the timer
    }
  });


  //Name modal Cancel
  document.getElementById("cancelButton").addEventListener("click", function() {
      document.getElementById("NameModal").style.display = "none"; // Close the modal
      document.getElementById("NameCancelModal").style.display = "block";
      userName = ""; // Clear the userName
  });


  //Start Timer function
  function startTimer() {
    if (elapsedTime === 0) {
      initializeGame();
    }

    if (!isTimerRunning) {
      if (!userName) {
        document.getElementById("NameModal").style.display = "block";
        return;
        }

      document.getElementById("userNameDisplay").innerText = `Player: ${userName}`;

      isTimerRunning = true;
      const inputs = document.querySelectorAll(".custom-input");
      inputs.forEach((input) => {input.disabled = false;});

      timerInterval = setInterval(function () {
        elapsedTime++;
        const hours = String(Math.floor(elapsedTime / 3600)).padStart(2,"0");
        const minutes = String(Math.floor((elapsedTime % 3600) / 60)).padStart(2, "0");
        const seconds = String(elapsedTime % 60).padStart(2, "0");

        document.getElementById("timer").innerText = `Time: ${hours}:${minutes}:${seconds}`;
      }, 1000);
    }
  }


  //Stop Timer function
  function stopTimer() {
    if (isTimerRunning) {
      clearInterval(timerInterval);
      isTimerRunning = false;
      document.getElementById("TimerstopModal").style.display="block";
      const inputs = document.querySelectorAll(".custom-input");
      inputs.forEach((input) => {input.disabled = true;});
    }
  }


  // Calculations for analysis For logout details
  function updateMoveCounter(isCorrect) {
    let accuracy = 0;
    let completionPercentage = 0;
    let correctCells = 0;
    for (let i = 0; i < sudokuArray.length; i++) {
      for (let j = 0; j < sudokuArray[i].length; j++) {
        if(sudokuArray[i][j] !== "" && boolTable[i][j] === true){
          if(sudokuArray[i][j] == sudokuSolution[i][j]){
            correctCells++;
          }
        } 
      }
    }

    moves++;
    if (isCorrect) {
      correctMoves++;
    }
    document.getElementById("moves").innerText = `Number of moves: ${moves}`;
    document.getElementById("correctMoves").innerText = `Correct moves: ${correctMoves}`;
    document.getElementById("correctCells").innerText = `Number of cells correct: ${correctCells}`;

    accuracy = moves === 0 ? 0 : (correctMoves / moves) * 100;
    document.getElementById("accuracy").innerText = `Accuracy: ${accuracy.toFixed(2)}%`;

    completionPercentage = (correctCells / totalBlankCells) * 100;
    document.getElementById("completionPercentage").innerText = `Completion: ${completionPercentage.toFixed(2)}%`;
  }


  // Function to handle keydown event
  function setupInputListener(input) {
    input.addEventListener('keydown', function(event) {
        if (/^[1-9]$/.test(event.key)) {
            // Replace the current input value with the new valid key
            input.value = event.key;
            // Trigger the input event to validate
            validateInput(input);
            // Prevent further processing in this event listener
            return; 
        }
        
        // Handle clearing the input for non-numeric entries
        if (event.key === "Backspace" || event.key === "Delete") {
            input.value = ""; // Clear the input
            validateInput(input); // Call validateInput for empty input
            return; // Exit after handling clear
        }
    });
  }


  // Validation for numbers
  function validateInput(input) {
    const value = input.value;
    const cellRow = input.parentElement.parentElement.rowIndex;
    const cellCol = input.parentElement.cellIndex;

    // Check if the input is a valid single digit (1-9)
    if (/^[1-9]$/.test(value)) {
        // Check if the cell is editable
        if (boolTable[cellRow][cellCol]) { // Assuming boolTable indicates editable cells
            // Update sudokuArray with the new input
            sudokuArray[cellRow][cellCol] = value; // Replace with the new input

            // Check if the input is correct
            const isCorrect = sudokuSolution[cellRow][cellCol] == value;
            updateMoveCounter(isCorrect);
        } else {
            alert("This cell is not editable.");
            input.value = ""; // Clear the input if it's not editable
        }
    } else {
        // Allow any input; if valid (1-9), it will replace the entire input
        if (value.length === 0 || !/^[1-9]*$/.test(value)) {
            // Clear invalid input
            input.value = "";
        }
    }
  }


  // A way to loop through all your inputs and set them up
  const inputs = document.querySelectorAll('custom-input'); // Selecting your input elements
  inputs.forEach(input => {
    setupInputListener(input); // Setup the listener for each input element
  });


  //Cell hightlight
  let previouslyHighlightedCell = null;

  function highlightCell(input, highlight) {
    const currentCell = input.closest('td');

    // Remove highlight from the previously highlighted cell
    if (previouslyHighlightedCell && previouslyHighlightedCell !== currentCell) {
        previouslyHighlightedCell.style.backgroundColor = ''; // Clear highlight
        const previousInput = previouslyHighlightedCell.querySelector('input');
        if (previousInput) previousInput.blur();
    }

    // Highlight the currently selected cell
    if (highlight) {
        currentCell.style.backgroundColor = '#d0e0ff'; // Highlight color
        previouslyHighlightedCell = currentCell;

        const inputField = currentCell.querySelector('input');
        if (inputField) {
            inputField.removeAttribute('disabled'); // Ensure it's enabled
            inputField.focus(); // Focus the input field
        }
    } else {
        currentCell.style.backgroundColor = ''; // Clear highlight when focus is lost
    }
  }


  // Helper function to format elapsed time
  function formatElapsedTime(seconds) {
    const hours = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2,"0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${secs}`;
  }


  //At logout reset the whole sudoku
  function resetSudokuGrid() {
    // Reset moves and correct moves counters
    moves = 0;
    correctCells=0;
    correctMoves = 0;

    // Reset the timer
    elapsedTime = 0; // Reset elapsed time
    clearInterval(timerInterval); // Stop the timer if it's running
    isTimerRunning = false; // Ensure the timer is not running

    // Update timer display back to 00:00:00
    const hours = String(Math.floor(elapsedTime / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((elapsedTime % 3600) / 60)).padStart(2,"0");
    const seconds = String(elapsedTime % 60).padStart(2, "0");
    document.getElementById("timer").innerText = `Time: ${hours}:${minutes}:${seconds}`;

    // Reset player name
    userName = ""; // Clear the player name
    document.getElementById("userNameDisplay").innerText = "Player :"; // Update the display

    // Reset all text boxes in the Sudoku grid
    const inputs = document.querySelectorAll(".custom-input");
    inputs.forEach((input) => {
      input.value = ""; // Set each input value to an empty string
    });
  }

  
  //Check Progress functionality
  function displaysubmit() {
    let correctCells = 0;
    for (let i = 0; i < sudokuArray.length; i++) {
      for (let j = 0; j < sudokuArray[i].length; j++) {
        if(sudokuArray[i][j] !== "" && boolTable[i][j] === true){
          if(sudokuArray[i][j] == sudokuSolution[i][j]){
            correctCells++;
          }
        } 
      }
    }
    
    // Gather the necessary details
    const elapsedTimeDisplay = document.getElementById("elapsedTimesubmit");
    elapsedTimeDisplay.innerText = `Elapsed time: ${formatElapsedTime(elapsedTime)}`;

    // Update modal fields with current game statistics
    document.getElementById("movessubmit").innerText = `Number of moves: ${moves}`;
    document.getElementById("correctMovessubmit").innerText = `Correct moves: ${correctMoves}`;
    document.getElementById("correctCellssubmit").innerText = `Number of cells correct: ${correctCells}`;
    document.getElementById("accuracysubmit").innerText = `Accuracy: ${(moves === 0 ? 0 : (correctMoves / moves) * 100).toFixed(2)}%`;
    document.getElementById("completionPercentagesubmit").innerText = `Completion: ${(totalBlankCells === 0 ? 0 : (correctCells / totalBlankCells) * 100).toFixed(2)}%`;

    stopTimer();
    // Display the modal
    document.getElementById("submitModal").style.display = "block";
  }


  //Close logout modal function
  function closeModal() {
    document.getElementById("logoutModal").style.display = "none";
    window.location.href = "Index.html";
  }


  //Close check modal function
  function closeModalsubmit() {
    document.getElementById("submitModal").style.display = "none";
  }


  //Close cancel modal function
  function closeModalcancel() {
    document.getElementById("NameCancelModal").style.display = "none";
  }


  //Close Timer stop modal
  function closeModalStop() {
    document.getElementById("TimerstopModal").style.display = "none";
  }


  //Sudoku grids logout display
  function displaySudokuGrid(gridId, gridData, referenceGrid = null) {
    const gridElement = document.getElementById(gridId);
    gridElement.innerHTML = ""; // Clear previous content

    for (let i = 0; i < gridData.length; i++) {
        for (let j = 0; j < gridData[i].length; j++) {
            const cellDiv = document.createElement("div");
            const currentCell = gridData[i][j];
            const isEditable = boolTable[i][j]; // Check if the cell is editable
            const correctValue = referenceGrid[i][j]; // Value from the solution

            // If the cell is not editable
            if (isEditable === false) {
                cellDiv.classList.add("filled-cell"); // Light grey for filled cells
                cellDiv.innerText = currentCell;
            } else {
                // The cell is editable, so check its value
                if (currentCell === "" || currentCell === 0) {
                    cellDiv.classList.add("red-cell"); // Red for empty cells
                } else {
                    // Cell has a value, check against the solution
                    if (String(currentCell) === String(correctValue)) {
                        cellDiv.classList.add("green-cell"); // Green for correct answers
                    } else {
                        cellDiv.classList.add("red-cell"); // Red for incorrect answers
                    }
                }
                cellDiv.innerText = currentCell; // Show user input
            }

            // For the solution grid, set the default numbers in light grey
            if (gridId !== "currentGrid") {
                cellDiv.classList.add("default"); // Light grey for solution cells
                cellDiv.innerText = currentCell; // Show the number
            }

            // Append cell to grid
            gridElement.appendChild(cellDiv);
        }
    }
  }

  
  // For logout and rerouting
  function logout() {
    let correctCells = 0;
    for (let i = 0; i < sudokuArray.length; i++) {
      for (let j = 0; j < sudokuArray[i].length; j++) {
        if(sudokuArray[i][j] !== "" && boolTable[i][j] === true){
          if(sudokuArray[i][j] == sudokuSolution[i][j]){
            correctCells++;
          }
        } 
      }
    }
    // Gather the necessary details
    const elapsedTimeDisplay = document.getElementById("elapsedTime");
    elapsedTimeDisplay.innerText = `Elapsed time: ${formatElapsedTime(elapsedTime)}`;

    // Update modal fields with current game statistics
    document.getElementById("moves").innerText = `Number of moves: ${moves}`;
    document.getElementById("correctMoves").innerText = `Correct moves: ${correctMoves}`;
    document.getElementById("correctCells").innerText = `Number of cells correct: ${correctCells}`;
    document.getElementById("accuracy").innerText = `Accuracy: ${(moves === 0 ? 0 : (correctMoves / moves) * 100).toFixed(2)}%`;
    document.getElementById("completionPercentage").innerText = `Completion: ${(totalBlankCells === 0 ? 0 : (correctCells / totalBlankCells) * 100).toFixed(2)}%`;

    // Populate the Sudoku grids
    displaySudokuGrid("solutionGrid", sudokuSolution, sudokuSolution);
    displaySudokuGrid("currentGrid", sudokuArray, sudokuSolution);

    resetSudokuGrid();
    // Display the modal
    document.getElementById("logoutModal").style.display = "block";
  }
