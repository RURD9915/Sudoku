let difficultylevel = false;
let difficulty;

function sudoku() {
  if (difficultylevel === false) {
      document.getElementById("play_modal").style.display = "block"; 
  } else {
      window.location.href = "sudoku.html";
  }
}

// Choosing diffculty
function set(selectedDifficulty) {
  difficulty = selectedDifficulty; // Set the difficulty based on the clicked button
  document.getElementById("difficult_choice").style.display = "block"; // Show the difficulty choice
  document.getElementById("difficult_choice").innerText = `${difficulty}`; // Update the text
  localStorage.setItem('difficulty', difficulty); // Save difficulty to local storage
  difficultylevel = true;
  disable_dropdown();
}

// Exit function
function Exit() {
  document.getElementById("logoutModal").style.display = "block";
}

// Dropdown functions
function show_dropdown(){
  document.getElementById("dropdown").style.display = "block";
}

function disable_dropdown(){
  document.getElementById("dropdown").style.display = "none";
}

function Get_support(){
  window.location.href = 'mailto:rurd9915@gmail.com';
}

function closeModal(action) {
  document.getElementById("logoutModal").style.display = "none";
  
  if (action === 'confirm') {
      // Handle exit logic
      document.getElementById("difficult_choice").style.display = "none"; 
      difficultylevel = false;
      window.close();
  }
}

function closeModalplay() {
  document.getElementById("play_modal").style.display = "none";
}