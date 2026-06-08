//the game logic
const numRows = 8;
const numCols = 8;
const numMines = 10;

const gameBoard = document.getElementById("gameBoard");
let board = [];

function initializeBoard() {
    for (let i = 0; i < numRows; i++) {
        board[i] = [];
        for (let j = 0; j < numCols; j++) {
            board[i][j] = {
                isMine: false,
                revealed: false,
                count: 0,
            };
        }
    }
}

//places mine randomly
let minePlaced = 0;
while (minePlaced < numMines) {
    const row = Math.floor(Math.random() * numRows);
    const col = Math.floor(Math.random() * numCols);
    if (!board[row][col].isMine) {
        board[row][col].isMine = true;
        minePlaced++;
    }
}

//calculate counts
for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
        if (!board[i][j].isMine) {
            let count = 0;
            for (let dx = -1; dx <= 1; dx++) {
                for(let dy = -1; dy <= 1; dy++) {
                    const ni = i + dx;
                    const nj = j + dy;
                    if (
                        ni >= 0 &&
                        ni < numRows &&
                        nj >= 0 &&
                        nj < numCols &&
                        board[ni][nj].isMine
                    ) {
                        count++
                    }
                }
            }
            board[i][j].count = count;
        }
    }
}

function revealCell(row, col) {
    if (
        row < 0 ||
        row >= numRows ||
        col < 0 ||
        col >= numCols ||
        board[row][col].revealed
    ) {
        return;
    }

    board[row][col].revealed = true;

    if (board[row][col].isMine) {
        // Handling game over
        alert("Game over! you step on the mine.");
    }else if (board[row][col].count == 0) {
        //if cell ha no mines nearby, reveal adjacent cells
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                revealCell(row + dx, col + dy);
            }
        }
    }
    renderBoard();
}

function renderBoard() {
    // Check if gameBoard exists before rendering to avoid errors in SW context
    if (!gameBoard) return;
    
    gameBoard.innerHTML = "";

    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            if (board[i][j].revealed) {
                cell.classList.add("revealed");
                if (board[i][j].isMine) {
                    cell.classList.add("mine");
                    cell.textContent = "💣"; // Fixed potential layout break from original text
                } else if (board[i][j].count > 0) {
                    cell.textContent = board[i][j].count;
                }
            }
            cell.addEventListener("click", () => revealCell(i, j));
            gameBoard.appendChild(cell);
        }
        gameBoard.appendChild(document.createElement("br"));
    }
}

// Only run game setup if window/DOM context exists
if (typeof window !== 'undefined' && gameBoard) {
    initializeBoard();
    renderBoard();
}

// ==========================================
// 2. SERVICE WORKER LOGIC
// ==========================================

// Basic service worker required for iOS PWA installation
if (typeof self !== 'undefined' && 'ServiceWorkerGlobalScope' in self) {
    self.addEventListener('install', (e) => {
        self.skipWaiting();
    });

    self.addEventListener('fetch', (e) => {
        // Leave blank for now; allows live updates from the web
    });
}