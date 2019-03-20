import Grid from './grid.js';
let grid;

// Config object, it contains all main game parameters
const config = {
    level: {
        beginner: {
            columns: 9,
            rows: 9,
            mines: 10,
        },
        medium: {
            columns: 22,
            rows: 15,
            mines: 40,
        },
        advanced: {
            columns: 30,
            rows: 15,
            mines: 80,
        }
    },
    columns: 9,
    rows: 9,
    mines: 10,

    // Selectors
    fieldId: 'field',
    cellClass: 'cell',
    menuId: 'menuBar',
    buttonId: 'rbtn',
    counterId: 'counter',
    dialogId: 'dialog',
    containerId: 'container',
    flagged: 'flagged',

    // Text
    buttonText: 'Reset Game',
    gameNotOver: 'Please find all the mines!',
    gameOver: 'The Game is over!',
    youWon: 'You found all mines!',

    // Functions
    fieldWidth: () => Math.floor(config.columns * 54.15),
    fieldHeight: () => Math.floor(config.rows * 54.15 + 54.15)
};

// Function update counted on menu bar
const updateCounter = () => {
    const counter = document.getElementById(config.counterId);
    counter.innerText = grid.flags.length + ' / ' + grid.mines.length;

    if (grid.flags.length === grid.mines.length){
        const mineFlags = grid.checkMineFlags();
        const cellReviewed = grid.checkIfAllReviewed();

        if (mineFlags && cellReviewed) {
            openDialog(config.youWon);
        } else if (!mineFlags) {
            openDialog(config.gameNotOver);
        }
    }
};

// Function returns id as array or string
// Example: [4, 5] or for columns and rows > 10 it will be string '0405'
// Used to match web element id to map (grid) id, and map (grid) id to web element id
const resolveId = (id, getString = false) => {
    const rowLength = (config.rows - 1).toString().length;
    const colLength = (config.columns - 1).toString().length;

    if (getString) {
        const rowStrArr = id[0].toString().split('');
        const colStrArr = id[1].toString().split('');

        while (rowStrArr.length < rowLength) {
            rowStrArr.unshift('0');
        }

        while (colStrArr.length < colLength) {
            colStrArr.unshift('0');
        }

        return [...rowStrArr, ...colStrArr].join('');

    } else {
        return [Number(id.slice(0, rowLength)), Number(id.slice(rowLength, id.length))];
    }
};

// Function handles with click on any coordinate of mine field
const click = (event) => {
    const id = event.target.id;

    if (id === config.buttonId) {
        renderMineField();
        return;
    }

    if (id === config.dialogId) {
        closeDialog();
    }

    if (!grid.gameOver && !grid.dialogOpen && id !== config.menuId) {
        const nId = resolveId(id);
        const mappedCell = grid.map[nId[0]][nId[1]];
        const clickedCell = document.getElementById(id);

        if (event.ctrlKey && !mappedCell.flagged && !mappedCell.revealed) {
            clickedCell.classList.add(config.flagged);
            grid.addRemoveFlag(nId);
        } else if (mappedCell.flagged) {
            clickedCell.classList.remove(config.flagged);
            grid.addRemoveFlag(nId, true);
        } else if (!mappedCell.mine) {
            revealCell(clickedCell, mappedCell, nId);
        } else {
            explosion();
        }

        updateCounter();
    }
};

// Function opens dialog with message
// @message - is a string
function openDialog(message) {
    const dialog = document.getElementById(config.dialogId);
    dialog.innerText = message;
    dialog.style.display = 'block';
    grid.dialogOpen = true;
}

// Function closes dialog
function closeDialog() {
    const dialog = document.getElementById(config.dialogId);
    dialog.innerText = '';
    dialog.style.display = 'none';
    grid.dialogOpen = false;
}

// Function opens cell, if cell does not have mine near, revealZeroCells will be called
// @cell - web element which represents one cell that is going to be revealed
// @mapCell - cell object in the grid
// @id - cell coordinates, [y, x]
function revealCell(cell, mapCell, id) {
    const countedMines = mapCell.count(id);
    mapCell.revealed = true;
    cell.innerText = countedMines !== 0 ? countedMines : '';
    cell.classList.add('open');
    grid.reveiledNum++;

    if (countedMines === 0) {
        revealZeroCells(id);
    }
}

// Function reveals all of cells that do not have mines
// @pos - coordinate of central cell, around which the function will check neighbors
function revealZeroCells(pos) {
    for (let i = -1; i <= 1; i++) {
        if (grid.map[pos[0] + i]) {
            for (let j = -1; j <= 1; j++) {
                if (grid.map[pos[0] + i][pos[1] + j]) {
                    const mapCell = grid.map[pos[0] + i][pos[1] + j];

                    if (!mapCell.mine && !mapCell.revealed) {
                        revealCell(document.getElementById(resolveId([(pos[0] + i), (pos[1] + j)], true)),
                            mapCell, [pos[0] + i, pos[1] + j]);
                    }
                }
            }
        }
    }
}

// Function explodes all of mines and set up flag game over as true
function explosion() {
    grid.gameOver = true;
    grid.mines.forEach((id) => {
        document.getElementById(resolveId(id, true)).classList.add('mine');
    });
    openDialog(config.gameOver);
}

// Function creates and return dialog component
function createDialog() {
    const dialog = document.createElement('div');
    dialog.id = config.dialogId;
    dialog.style.width = (config.fieldWidth() - 5).toString() + 'px';
    dialog.style.height = (config.fieldHeight() / 2).toString() + 'px';

    return dialog;
}

// Function creates and return top menu component
// Menu contains reset button, counter and level selections
function createMenu() {
    // Create menu wrapper
    const menuWrapper = document.createElement('div');
    menuWrapper.id = config.menuId;
    menuWrapper.style.width = (config.fieldWidth() - 5).toString() + 'px';

    // Add Reset Button
    const resetButton = document.createElement('button');
    resetButton.id = config.buttonId;
    resetButton.innerText = config.buttonText;
    menuWrapper.appendChild(resetButton);

    // Add counter
    const counter = document.createElement('div');
    counter.id = config.counterId;
    counter.innerText = '0 / ' + config.mines;
    menuWrapper.appendChild(counter);

    return menuWrapper;
}

// Function creates and return mine field component
function createMineField() {
    const field = document.createElement('div');
    field.id = config.fieldId;
    field.style.width = config.fieldWidth().toString() + 'px';
    field.style.height = config.fieldHeight().toString() + 'px';
    field.onclick = click;

    return field;
}

// Function populates mines and creates cells (grid) on the mine field
// @mineField - web element that represents mine field
function populateMines(mineField) {
    grid = new Grid(config.rows, config.columns, config.mines);

    for (let i = 0; i < config.rows; i++) {
        for (let j = 0; j < config.columns; j++) {
            const cell = document.createElement('div');
            cell.id = resolveId([i, j], true);
            cell.className = config.cellClass;
            mineField.appendChild(cell);
        }
    }
}

// Function renders mine fields on the screen
// Mine field should have menu bar and cells
function renderMineField() {
    const container = document.getElementById(config.containerId);
    let mineField = container.querySelector('#' + config.fieldId);

    if (mineField) {
        container.removeChild(mineField);
    }

    mineField = createMineField();
    mineField.appendChild(createDialog());
    mineField.appendChild(createMenu());
    populateMines(mineField);
    container.appendChild(mineField);
}

renderMineField();