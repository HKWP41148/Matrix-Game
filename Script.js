const matrixElement = document.getElementById('matrix');
const resultElement = document.getElementById('result');
const stage1ResultElement = document.getElementById('stage1-result');
const stage2ResultElement = document.getElementById('stage2-result');
const stage3ResultElement = document.getElementById('stage3-result');
const nextStageButton = document.getElementById('nextStageButton'); 
let a = 4;
let currentStage = 1; 
const maxStages = 3; 
const matrix = [];
const selectedNumbers = [];
const selectedCells = [];
let selectionMode = null; 
let directions = [
    { row: 0, col: 1 }, { row: 0, col: -1 },
    { row: 1, col: 0 }, { row: -1, col: 0 },
    { row: 1, col: 1 }, { row: 1, col: -1 },
    { row: -1, col: 1 }, { row: -1, col: -1 }
];
const chanceCountElement = document.getElementById('chance-count');
let mistakeCount = 0; 
const maxMistakes = 3; 
const resetMessageElement = document.getElementById('reset-message'); 

function creatmatrixx() {

    matrixElement.innerHTML = ''; 
    matrixElement.style.gridTemplateColumns = `repeat(${a}, 60px)`;
    matrixElement.style.gridTemplateRows = `repeat(${a}, 60px)`;

    for (let i = 0; i < a; i++) {
        const row = [];
        
        for (let j = 0; j < a; j++) {
            const randomNumber = Math.floor(Math.random() * 100) + 1;
            row.push(randomNumber);
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.textContent = randomNumber;
            cell.dataset.row = i;
            cell.dataset.col = j;
    
            cell.addEventListener('click', () => selectNumber(cell, randomNumber));
            matrixElement.appendChild(cell);
        }
        matrix.push(row);
    }
}

function selectNumber(cell, number) {
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    if (selectedNumbers.length < 4) {
        if (selectedCells.length === 0 || isValidSelection(row, col)) {
            cell.classList.add('selected');
            selectedNumbers.push(number);
            selectedCells.push({ row, col });

            if (selectedNumbers.length === 2) {
                const firstCell = selectedCells[0];
                const secondCell = selectedCells[1];
                selectionMode = determineMode(firstCell.row, firstCell.col, secondCell.row, secondCell.col);
            }
            updateValidCells();
        }
    }

    if (selectedNumbers.length === 4) {
        const product = selectedNumbers.reduce((acc, num) => acc * num, 1);
        resultElement.textContent = product;
        storeStageResult(product); 
        nextStageButton.disabled = false; 
        compareProducts(selectedNumbers, matrix); 
    }
}

function storeStageResult(product) {
    if (currentStage === 1) {
        stage1ResultElement.textContent = product;
    } else if (currentStage === 2) {
        stage2ResultElement.textContent = product;
    } else if (currentStage === 3) {
        stage3ResultElement.textContent = product;
    }
}

function updateValidCells() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.classList.remove('valid');
    });

    if (selectedCells.length === 0) {
        return;
    }

    const lastCell = selectedCells[selectedCells.length - 1];
    const firstCell = selectedCells[0];

    if (selectedCells.length === 1) {
        directions.forEach(direction => {
            const newRow = firstCell.row + direction.row;
            const newCol = firstCell.col + direction.col;
            if (isValidSelection(newRow, newCol)) {
                const cell = document.querySelector(`.cell[data-row="${newRow}"][data-col="${newCol}"]`);
                if (cell && !cell.classList.contains('selected')) {
                    cell.classList.add('valid');
                }
            }
        });

    } else if (selectionMode) {
        let dir;
        if (selectionMode === 'horizontal') {
            dir = { row: 0, col: 1 };
        } else if (selectionMode === 'vertical') {
            dir = { row: 1, col: 0 };
        } else if (selectionMode === 'diagonal') {
            const dRow = lastCell.row - firstCell.row;
            const dCol = lastCell.col - firstCell.col;
            dir = { row: dRow / Math.abs(dRow), col: dCol / Math.abs(dCol) };
        }

        let newRow = lastCell.row + dir.row;
        let newCol = lastCell.col + dir.col;

        for (let k = 0; k < 3; k++) { 
            if (isValidSelection(newRow, newCol)) {
                const cell = document.querySelector(`.cell[data-row="${newRow}"][data-col="${newCol}"]`);
                if (cell && !cell.classList.contains('selected')) {
                    cell.classList.add('valid');
                }
            }
            newRow += dir.row;
            newCol += dir.col;
        }
    }
}

function isValidSelection(row, col) {
    if (row < 0 || row >= a || col < 0 || col >= a) {
        return false;
    }

    if (selectedCells.length === 0) {
        return true;
    }

    const firstCell = selectedCells[0];

    if (selectionMode === 'horizontal') {
        return row === firstCell.row && Math.abs(col - firstCell.col) <= 3 && !selectedCells.some(cell => cell.row === row && cell.col === col);
    } else if (selectionMode === 'vertical') {
        return col === firstCell.col && Math.abs(row - firstCell.row) <= 3 && !selectedCells.some(cell => cell.row === row && cell.col === col);
    } else if (selectionMode === 'diagonal') {
        return Math.abs(row - firstCell.row) === Math.abs(col - firstCell.col) && Math.abs(row - firstCell.row) <= 3 && !selectedCells.some(cell => cell.row === row && cell.col === col);
    } else {
        const lastCell = selectedCells[selectedCells.length - 1];
        return directions.some(direction =>
            row === lastCell.row + direction.row && col === lastCell.col + direction.col
        );
    }
}

function determineMode(startRow, startCol, currentRow, currentCol) {
    if (startRow === currentRow) {
        return 'horizontal';
    } else if (startCol === currentCol) {
        return 'vertical';
    } else if (Math.abs(startRow - currentRow) === Math.abs(startCol - currentCol)) {
        return 'diagonal';
    }
    return null;
}

function nextLevel() {
    if (currentStage < maxStages) {
        a++; 
        storeStageResult(resultElement.textContent); 
        currentStage++; 
        creatmatrixx(); 
        selectedNumbers.length = 0;
        selectedCells.length = 0;
        selectionMode = null;
        resultElement.textContent = 0;
        nextStageButton.disabled = true; 
        mistakeCount = 0; 
        chanceCountElement.textContent = maxMistakes; 
    } 
    else {
        resultElement.textContent = " تبریک!! شما برنده شدید";
        matrixElement.innerHTML = ''; 
    }
} 

function getAllPossibleCombinations(matrix) {
    const combinations = [];
    const directions = [
        { row: 0, col: 1 }, { row: 1, col: 0 },
        { row: 1, col: 1 }, { row: 1, col: -1 }
    ];

    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            directions.forEach(direction => {
                const combination = [];
                for (let k = 0; k < 4; k++) {
                    const newRow = i + k * direction.row;
                    const newCol = j + k * direction.col;
                    if (newRow >= 0 && newRow < matrix.length && newCol >= 0 && newCol < matrix[i].length) {
                        combination.push(matrix[newRow][newCol]);
                    } else {
                        break;
                    }
                }
                if (combination.length === 4) {
                    combinations.push(combination);
                }
            });
        }
    }
    return combinations;
}

function checkMistakes() {
    if (mistakeCount >= maxMistakes) {
        resultElement.textContent = "شما بازنده شدید!";
        resetMessageElement.textContent = "شما باید از اول شروع کنید."; 
        chanceCountElement.textContent = 0; 
    } else {
        chanceCountElement.textContent = maxMistakes - mistakeCount; 
        resetSelection(); 
    }
}

function resetGame() {
    mistakeCount = 0;
    currentStage = 1;
    a = 4;
    creatmatrixx(); 
    resultElement.textContent = '';
    stage1ResultElement.textContent = '';
    stage2ResultElement.textContent = '';
    stage3ResultElement.textContent = '';
    resetMessageElement.textContent = ''; 
    selectedNumbers.length = 0;
    selectedCells.length = 0;
    selectionMode = null;
    nextStageButton.disabled = true; 
    chanceCountElement.textContent = maxMistakes; 
}

function resetSelection() {
    selectedNumbers.length = 0;
    selectedCells.length = 0;
    selectionMode = null;
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.classList.remove('selected', 'valid');
    });
}

function compareProducts(selectedNumbers, matrix) {
    const allCombinations = getAllPossibleCombinations(matrix);
    const selectedProduct = selectedNumbers.reduce((acc, num) => acc * num, 1);

    let isWinner = true;
    for (const combination of allCombinations) {
        const product = combination.reduce((acc, num) => acc * num, 1);
        if (product > selectedProduct) {
            isWinner = false;
            break;
        }
    }

    if (isWinner) {
        resultElement.textContent += " - !شما موفق شدید";
        nextStageButton.disabled = false; 
    } else {
        resultElement.textContent += " - !شما بازنده شدید";
        nextStageButton.disabled = true; 
        mistakeCount++; 
        checkMistakes();
    }
}
creatmatrixx();