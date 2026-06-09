// ==========================================
// 1. MINESWEEPER GAME LOGIC
// ==========================================

const numRows = 14;
const numCols = 14;
const numMines = 40;

const gameBoard = document.getElementById("gameBoard");
const overlayEl = document.getElementById("overlay");
const overlayTitleEl = document.getElementById("overlayTitle");
const overlayMessageEl = document.getElementById("overlayMessage");
const restartBtn = document.getElementById("restartBtn");
const flagModeBtn = document.getElementById("flagModeBtn");

let board = [];
let gameStatus = "playing"; // playing | won | lost
let revealedCount = 0;
const totalSafeCells = numRows * numCols - numMines;

let flagMode = false;

function setFlagMode(next) {
    flagMode = !!next;
    if (flagModeBtn) {
        flagModeBtn.classList.toggle("on", flagMode);
        flagModeBtn.setAttribute("aria-pressed", String(flagMode));
        flagModeBtn.textContent = flagMode ? "🚩: On" : "🚩: Off";
    }
}

function initializeBoard() {
    // 1. Create empty board array structures
    for (let i = 0; i < numRows; i++) {
        board[i] = [];
        for (let j = 0; j < numCols; j++) {
            board[i][j] = {
                isMine: false,
                revealed: false,
                count: 0,
                flagged: false,
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

function showOverlay({ title, message }) {
    if (!overlayEl) return;
    if (overlayTitleEl) overlayTitleEl.textContent = title;
    if (overlayMessageEl) overlayMessageEl.textContent = message;
    overlayEl.classList.add("show");
}

function hideOverlay() {
    if (!overlayEl) return;
    overlayEl.classList.remove("show");
}

function revealAllMines() {
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            if (board[i][j].isMine) {
                board[i][j].revealed = true;
            }
        }
    }
}

function toggleFlag(row, col) {
    if (gameStatus !== "playing") return;
    if (
        row < 0 ||
        row >= numRows ||
        col < 0 ||
        col >= numCols ||
        board[row][col].revealed
    ) {
        return;
    }

    board[row][col].flagged = !board[row][col].flagged;
    renderBoard();
}

function revealCell(row, col) {
    if (gameStatus !== "playing") return;

    if (
        row < 0 ||
        row >= numRows ||
        col < 0 ||
        col >= numCols ||
        board[row][col].revealed ||
        board[row][col].flagged
    ) {
        return;
    }

    board[row][col].revealed = true;
    revealedCount++;

    if (board[row][col].isMine) {
        gameStatus = "lost";
        revealAllMines();
        renderBoard();
        showOverlay({ title: "You lost!", message: "Restart to play again." });
        return;
    }

    if (board[row][col].count === 0) {
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                revealCell(row + dx, col + dy);
            }
        }
    }

    // Win condition: all safe cells revealed
    if (revealedCount >= totalSafeCells) {
        gameStatus = "won";
        renderBoard();
        showOverlay({ title: "You win!", message: "Nice work. Restart to play again." });
        return;
    }

    renderBoard();
}

function restartGame() {
    gameStatus = "playing";
    revealedCount = 0;
    hideOverlay();
    setFlagMode(false);

    initializeBoard();

    // ensure board sizing vars are applied (fixed 16x16)
    if (gameBoard) {
        gameBoard.style.setProperty("--rows", String(numRows));
        gameBoard.style.setProperty("--cols", String(numCols));
        gameBoard.style.setProperty("--cell-size", "24px");
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
            } else if (board[i][j].flagged) {
                cell.textContent = "🚩";
            }

            cell.addEventListener("click", () => {
                if (flagMode) {
                    toggleFlag(i, j);
                } else {
                    revealCell(i, j);
                }
            });

            gameBoard.appendChild(cell);
        }
    }
}

// Only run game setup if window/DOM context exists
if (typeof window !== "undefined" && gameBoard) {
    // set fixed 16x16 board sizing + cell size
    gameBoard.style.setProperty("--rows", String(numRows));
    gameBoard.style.setProperty("--cols", String(numCols));
    gameBoard.style.setProperty("--cell-size", "24px");

    // Flag toggle wiring
    if (flagModeBtn) {
        flagModeBtn.addEventListener("click", () => {
            setFlagMode(!flagMode);
        });
    }

    // Restart wiring
    if (restartBtn) {
        restartBtn.addEventListener("click", () => {
            restartGame();
        });
    }

    initializeBoard();
    setFlagMode(false);
    renderBoard();
}

// ==========================================
// 2. SERVICE WORKER LOGIC
// (kept in sw.js; not used here)
// ==========================================

