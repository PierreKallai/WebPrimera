function mostrarMensaje() {
    const gameContainer = document.getElementById('game-container');
    gameContainer.style.display = 'block';
    
    
    if (!game) {
        game = new Minesweeper(10, 10, 15);
    }
}
class Minesweeper {
    constructor(rows, cols, mines) {
        this.rows = rows;
        this.cols = cols;
        this.mines = mines;
        this.board = [];
        this.revealed = [];
        this.gameOver = false;
        this.flagMode = false;
        this.minesLeft = mines;
        this.init();
    }

    init() {
        // Inicializar tableros
        for (let i = 0; i < this.rows; i++) {
            this.board[i] = new Array(this.cols).fill(0);
            this.revealed[i] = new Array(this.cols).fill(false);
        }

        // Colocar minas aleatoriamente
        let minesPlaced = 0;
        while (minesPlaced < this.mines) {
            const row = Math.floor(Math.random() * this.rows);
            const col = Math.floor(Math.random() * this.cols);
            if (this.board[row][col] !== -1) {
                this.board[row][col] = -1;
                minesPlaced++;
                
                // Actualizar números alrededor de la mina
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        if (row + i >= 0 && row + i < this.rows && 
                            col + j >= 0 && col + j < this.cols && 
                            this.board[row + i][col + j] !== -1) {
                            this.board[row + i][col + j]++;
                        }
                    }
                }
            }
        }

        this.createBoard();
        this.updateMinesCounter();
    }

    createBoard() {
        const container = document.getElementById('minesweeper');
        container.innerHTML = '';
        container.style.display = 'grid';
        container.style.gridTemplateColumns = `repeat(${this.cols}, 30px)`;
        container.style.gap = '1px';

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell hidden';
                cell.dataset.row = i;
                cell.dataset.col = j;
                cell.addEventListener('click', () => this.handleClick(i, j));
                cell.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    this.toggleFlag(i, j);
                });
                container.appendChild(cell);
            }
        }
    }

    handleClick(row, col) {
        if (this.gameOver || this.revealed[row][col]) return;
        
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        
        if (this.flagMode) {
            this.toggleFlag(row, col);
            return;
        }

        if (cell.classList.contains('flagged')) return;

        this.revealed[row][col] = true;
        cell.classList.remove('hidden');

        if (this.board[row][col] === -1) {
            this.gameOver = true;
            this.revealAll();
            alert('¡Game Over!');
            return;
        }

        if (this.board[row][col] === 0) {
            this.revealEmpty(row, col);
        } else {
            cell.textContent = this.board[row][col];
            cell.classList.add(`n${this.board[row][col]}`);
        }

        if (this.checkWin()) {
            this.gameOver = true;
            alert('¡Has ganado!');
        }
    }

    revealEmpty(row, col) {
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (row + i >= 0 && row + i < this.rows && 
                    col + j >= 0 && col + j < this.cols && 
                    !this.revealed[row + i][col + j]) {
                    const cell = document.querySelector(`[data-row="${row + i}"][data-col="${col + j}"]`);
                    if (!cell.classList.contains('flagged')) {
                        this.handleClick(row + i, col + j);
                    }
                }
            }
        }
    }

    toggleFlag(row, col) {
        if (this.revealed[row][col]) return;
        
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        if (cell.classList.contains('flagged')) {
            cell.classList.remove('flagged');
            cell.textContent = '';
            this.minesLeft++;
        } else {
            cell.classList.add('flagged');
            cell.textContent = '🚩';
            this.minesLeft--;
        }
        this.updateMinesCounter();
    }

    revealAll() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                const cell = document.querySelector(`[data-row="${i}"][data-col="${j}"]`);
                cell.classList.remove('hidden');
                if (this.board[i][j] === -1) {
                    cell.textContent = '💣';
                    cell.classList.add('mine');
                } else if (this.board[i][j] > 0) {
                    cell.textContent = this.board[i][j];
                    cell.classList.add(`n${this.board[i][j]}`);
                }
            }
        }
    }

    checkWin() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (this.board[i][j] !== -1 && !this.revealed[i][j]) {
                    return false;
                }
            }
        }
        return true;
    }

    updateMinesCounter() {
        const counter = document.getElementById('mines-counter');
        if (counter) {
            counter.textContent = `Minas restantes: ${this.minesLeft}`;
        }
    }

    toggleFlagMode() {
        this.flagMode = !this.flagMode;
        const flagButton = document.getElementById('flag-button');
        if (flagButton) {
            flagButton.classList.toggle('active');
        }
    }
}

// Inicializar el juego
document.addEventListener('DOMContentLoaded', () => {
    const game = new Minesweeper(10, 10, 15); // 10x10 tablero con 15 minas

    const flagButton = document.getElementById('flag-button');
    if (flagButton) {
        flagButton.addEventListener('click', () => game.toggleFlagMode());
    }

    const resetButton = document.getElementById('reset-button');
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            game = new Minesweeper(10, 10, 15);
        });
    }
});
