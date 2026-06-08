// ==========================================
// 1. MINESWEEPER GAME LOGIC
// ==========================================

const numRows = 8;
const numCols = 8;
const numMines = 10;

const gameBoard = document.getElementById("gameBoard");
let board = [];

function initializeBoard() {
    // 1. Create empty board array structures
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

    // 2. Places mines randomly (Moved inside so board structure exists first!)
    let minePlaced = 0;
    while (minePlaced < numMines) {
        const row = Math.floor(Math.random() * numRows);
        const col = Math.floor(Math.random() * numCols);
        if (!board[row][col].isMine) {
            board[row][col].isMine = true;
            minePlaced++;
        }
    }

    // 3. Calculate adjacent mine counts (Moved inside for safety)
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            if (!board[i][j].isMine) {
                let count = 0;
                for (let dx = -1; dx <= 1; dx++) {
                    for (let dy = -1; dy <= 1; dy++) {
                        const ni = i + dx;
                        const nj = j + dy;
                        if (
                            ni >= 0 &&
                            ni < numRows &&
                            nj >= 0 &&
                            nj < numCols &&
                            board[ni][nj].isMine
                        ) {
                            count++;
                        }
                    }
                }
                board[i][j].count = count;
            }
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
        alert("Game over! you step on the mine.");
    } else if (board[row][col].count == 0) {
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                revealCell(row + dx, col + dy);
            }
        }
    }
    renderBoard();
}

function renderBoard() {
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
                    cell.textContent = "💣"; 
                } else if (board[i][j].count > 0) {
                    cell.textContent = board[i][j].count;
                }
            }
            cell.addEventListener("click", () => revealCell(i, j));
            gameBoard.appendChild(cell);
        }
        // Removed the <br> creation line so it works perfectly with the CSS Grid!
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

if (typeof self !== 'undefined' && 'ServiceWorkerGlobalScope' in self) {
    self.addEventListener('install', (e) => {
        self.skipWaiting();
    });

    self.addEventListener('fetch', (e) => {
        // Leave blank for now
    });
}