export default class Grid {
    constructor(rows, columns, numMines) {
        this.dialogOpen = false;
        this.gameOver = false;
        this.reveiledNum = 0;
        this.mines = [];
        this.flags = [];
        this.map = this.createMap(rows, columns, numMines);
    }

    // Function compares mines and flagged cells.
    checkMineFlags = () => {
        if (this.mines.length !== this.flags.length) {
            return false;
        }

        const comp = {};

        for (let i = 0; i < this.mines.length; i++) {
            comp[this.mines[i].join('')] = comp[this.mines[i].join('')] ? comp[this.mines[i].join('')] + 1 : 1;
            comp[this.flags[i].join('')] = comp[this.flags[i].join('')] ? comp[this.flags[i].join('')] + 1 : 1;
        }

        for (let k in comp) {
            if (comp[k] !== 2) {
                return false;
            }
        }

        return true;
    };

    // Function verifies if all of the cell are reviewed.
    checkIfAllReviewed() {
        return (this.flags.length + this.reveiledNum) === this.map.length * this.map[0].length;
    }

    // Function counts mines around map element
    // @pos - coordinates, [y: number, x: number]
    countMines = (pos) => {
        let res = 0;

        for (let i = -1; i <= 1; i++) {
            if (this.map[pos[0] + i]) {
                for (let j = -1; j <= 1; j++) {
                    if (this.map[pos[0] + i][pos[1] + j]) {
                        res = this.map[pos[0] + i][pos[1] + j].mine ? res + 1 : res;
                    }
                }
            }
        }

        return res;
    };

    // Function adds / removes flagged value from the cell
    // @id - coordinates of element, [y:number, x:number]
    // @remove - boolean value to add / remove flag
    addRemoveFlag = (id, remove = false) => {
        if (remove) {
            this.map[id[0]][id[1]].flagged = false;

            // Remove flagged cell from array
            this.flags = this.flags.filter((c) => c.join('') !== id.join(''));
        } else {
            this.map[id[0]][id[1]].flagged = true;
            this.flags.push(id);
        }
    };

    // Function builds map (grid) with mines that are populated in random way.
    // @rows - integer number of rows
    // @columns - integer number of columns
    // @numMines - integer number of mines
    createMap = (rows, columns, numMines) => {
        const map = new Array(rows);
        const cell = {
            flagged: false,
            mine: false,
            revealed: false,
            count: (pos) => this.countMines(pos)
        };

        for (let i = 0; i < rows; i++) {
            map[i] = [];
            for (let j = 0; j < columns; j++) {
                map[i].push({...cell});
            }
        }

        let k = numMines;

        while(k > 0) {
            const y = Math.floor(Math.random() * rows);
            const x = Math.floor(Math.random() * columns);

            if (!map[y][x].mine) {
                map[y][x].mine = true;
                this.mines.push([y, x]);
                k--;
            }
        }

        return map;
    }
}