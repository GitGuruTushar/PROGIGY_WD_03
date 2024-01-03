const cells = [];
let currentPlayer = 'X';
let gameActive = false;
let aiEnabled = false;

const winningCombos = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6] // Diagonals
];

function createBoard() {
  const board = document.getElementById('board');
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.index = i;
    cell.addEventListener('click', () => makeMove(i));
    board.appendChild(cell);
    cells.push(cell);
  }
}

function resetBoard() {
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('X', 'O', 'winner');
  });
  currentPlayer = 'X';
  gameActive = true;
  document.getElementById('winnerDisplay').classList.remove('show'); // Hide the winner display
  if (aiEnabled && currentPlayer === 'O') {
    makeAIMove();
  }
}

function displayWinner(message) {
  const winnerDisplay = document.getElementById('winnerDisplay');
  winnerDisplay.textContent = message;
  winnerDisplay.classList.add('show');
}

function checkWinner(player) {
  for (const combo of winningCombos) {
    const [a, b, c] = combo;
    if (cells[a].classList.contains(player) && cells[b].classList.contains(player) && cells[c].classList.contains(player)) {
      cells[a].classList.add('winner');
      cells[b].classList.add('winner');
      cells[c].classList.add('winner');
      gameActive = false;
      displayWinner(`${player} wins!`);
      return true;
    }
  }
  return false;
}

function checkDraw() {
  return Array.from(cells).every(cell => cell.classList.contains('X') || cell.classList.contains('O'));
}

function makeMove(cellIndex) {
  if (!gameActive || cells[cellIndex].classList.contains('X') || cells[cellIndex].classList.contains('O')) return;

  cells[cellIndex].textContent = currentPlayer;
  cells[cellIndex].classList.add(currentPlayer);

  if (checkWinner(currentPlayer)) {
    gameActive = false;
  } else if (checkDraw()) {
    displayWinner("It's a draw!");
    gameActive = false;
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    if (aiEnabled && gameActive && currentPlayer === 'O') {
      makeAIMove();
    }
  }
}

function makeAIMove() {
  const availableMoves = [];
  for (let i = 0; i < 9; i++) {
    if (!cells[i].classList.contains('X') && !cells[i].classList.contains('O')) {
      availableMoves.push(i);
    }
  }

  if (availableMoves.length > 0) {
    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    makeMove(availableMoves[randomIndex]);
  }
}

function startAI() {
  aiEnabled = true;
  document.getElementById('aiButton').disabled = true;
  document.getElementById('humanButton').disabled = true;
  resetBoard();
}

function startHuman() {
  aiEnabled = false;
  document.getElementById('aiButton').disabled = true;
  document.getElementById('humanButton').disabled = true;
  resetBoard();
}

document.getElementById('aiButton').addEventListener('click', startAI);
document.getElementById('humanButton').addEventListener('click', startHuman);

createBoard();
