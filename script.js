document.addEventListener("DOMContentLoaded", function() {
  const canvas = document.getElementById("canvas-game");
  const context = canvas.getContext("2d");
  const energyCountElement = document.getElementById("energy");
  const bountyCountElement = document.getElementById("bountyCount");
  const nextLevelBtn = document.getElementById("nextLevelBtn");

  let energyCount = 0;
  let bountyCount = 1;
  let tries = 10;
  let level = 1;
  let squares = [];

  const squareSize = 40;
  const gridWidth = 12;
  const gridHeight = 12;

  // Create the grid of squares
  function createGrid() {
    canvas.width = squareSize * gridWidth;
    canvas.height = squareSize * gridHeight;
    canvas.style.border = "1px solid cyan";
    canvas.addEventListener("mousemove", handleSquareMouseOver);
    canvas.addEventListener("click", handleSquareClick);

    // Initialize the squares
    for (let x = 0; x < gridWidth; x++) {
      for (let y = 0; y < gridHeight; y++) {
        squares.push({ x, y, bounty: false, energy: false, revealed: false, found: false });
      }
    }
  }

  // Generate random positions for bounty and energy squares
  function generatePositions() {
    const positions = [];
    for (let i = 0; i < bountyCount + energyCount; i++) {
      let position;
      do {
        position = {
          x: Math.floor(Math.random() * gridWidth),
          y: Math.floor(Math.random() * gridHeight)
        };
      } while (positions.find(p => p.x === position.x && p.y === position.y));
      positions.push(position);
    }
    return positions;
  }

  // Update the grid with bounty and energy squares
  function updateGrid() {
    const positions = generatePositions();
    context.clearRect(0, 0, canvas.width, canvas.height);
    positions.forEach(position => {
      const square = squares.find(s => s.x === position.x && s.y === position.y);
      square.bounty = positions.indexOf(position) < bountyCount;
      square.energy = positions.indexOf(position) >= bountyCount;
      drawSquare(square);
    });
  }

  // Draw a square on the canvas
  function drawSquare(square) {
    const x = square.x * squareSize;
    const y = square.y * squareSize;
    context.beginPath();
    context.rect(x, y, squareSize, squareSize);
    if (square.bounty) {
      context.fillStyle = "#ffd700";
      context.fillRect(x, y, squareSize, squareSize);
      context.fillStyle = "#000";
      context.font = "20px Arial";
      context.fillText("B", x + squareSize / 2 - 6, y + squareSize / 2 + 6);
      context.fillStyle = "#ffd700";
    } else if (square.energy) {
      context.fillStyle = "#00ff00";
      context.fillRect(x, y, squareSize, squareSize);
    } else {
      context.fillStyle = "#000";
      context.fillRect(x, y, squareSize, squareSize);
    }
    if (square.revealed) {
      context.fillStyle = "slate";
      context.fillRect(x, y, squareSize, squareSize);
    }
    if (square.found) {
      context.fillStyle = "#000";
      context.fillRect(x, y, squareSize, squareSize);
    }
    context.strokeStyle = "black";
    context.stroke();
  }

  // Update the HUD with energy count and bounty count
  function updateHUD() {
    energyCountElement.textContent = energyCount;
    bountyCountElement.textContent = bountyCount;
  }

  // Handle square mouseover event
  function handleSquareMouseOver(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const squareX = Math.floor(mouseX / squareSize);
    const squareY = Math.floor(mouseY / squareSize);
    const square = squares.find(s => s.x === squareX && s.y === squareY);
    if (square && !square.found) {
      square.revealed = true;
      drawSquare(square);
    }
  }

  // Handle square click event
  function handleSquareClick(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const squareX = Math.floor(mouseX / squareSize);
    const squareY = Math.floor(mouseY / squareSize);
    const square = squares.find(s => s.x === squareX && s.y === squareY);
    if (square) {
      if (square.bounty) {
        square.found = true;
        tries--;
        if (tries === 0 || squares.filter(s => s.bounty && !s.found).length === 0) {
          gameOver();
        } else {
          energyCount++;
          updateHUD();
        }
      }
      if (square.energy) {
        square.found = true;
        tries++;
        energyCount--;
        updateHUD();
      }
      drawSquare(square);
    }
  }

  // Handle next level button click event
  function nextLevel() {
    level++;
    bountyCount++;
    tries = 10;
    energyCount = Math.floor(Math.random() * 16) + 15;
    updateGrid();
    updateHUD();
    nextLevelBtn.classList.add("d-none");
    squares.forEach(square => {
      square.found = false;
      square.revealed = false;
    });
  }

  // Handle game over event
  function gameOver() {
    canvas.removeEventListener("mousemove", handleSquareMouseOver);
    canvas.removeEventListener("click", handleSquareClick);
    nextLevelBtn.disabled = true;
    nextLevelBtn.textContent = "Game Over";
  }

  // Initialize the game
  function initGame() {
    createGrid();
    updateGrid();
    updateHUD();
  }

  initGame();
});
