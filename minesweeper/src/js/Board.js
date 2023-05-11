import Cell from './Cell';
import { addElement, getRandom } from './utilits';
import { checkForPlaint, getNearbyCells } from './boardUtilits';

export default class Board {
  matrix = [];

  isFirstClick = true;

  constructor(container, length) {
    this.container = container;
    this.length = length;

    this.addMatrix(length);
    this.addCells();
  }

  addMatrix(length) {
    for (let y = 0; y < length; y += 1) {
      const row = [];
      for (let x = 0; x < length; x += 1) {
        row.push(new Cell(this, x, y));
      }
      this.matrix.push(row);
    }
  }

  addCells() {
    const boardElement = addElement('div', 'board');
    this.container.append(boardElement);

    this.matrix.forEach((arr) => {
      arr.forEach((elem) => {
        const cellElement = addElement('div', 'cell');
        cellElement.textContent = '';
        cellElement.addEventListener('click', () => {
          this.clickHandler(elem.x, elem.y);
        });
        cellElement.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          this.addFlag(elem.x, elem.y);
        });
        boardElement.append(cellElement);
      });
    });
  }

  updateCells() {
    this.container.innerHTML = '';
    const boardElement = addElement('div', 'board');
    this.container.append(boardElement);

    this.matrix.forEach((arr) => {
      arr.forEach((elem) => {
        const cellElement = addElement('div', 'cell');
        if (elem.isFlag) {
          cellElement.textContent = '🚩';
        }
        if (elem.isOpen) {
          if (!elem.value) {
            cellElement.textContent = '';
          } else if (elem.isFlag) {
            cellElement.textContent = '🚩';
          } else if (elem.value === true) {
            cellElement.textContent = '💥';
          } else if (elem.value > 0) {
            cellElement.textContent = elem.value;
          }
          cellElement.classList.add(`cell${elem.value}`);
        }
        cellElement.addEventListener('click', () => {
          this.clickHandler(elem.x, elem.y);
        });
        cellElement.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          this.addFlag(elem.x, elem.y);
        });
        boardElement.append(cellElement);
      });
    });
  }

  addBombs(x, y) {
    let totalBombs = this.length * 1.6;

    while (totalBombs) {
      const randomX = getRandom(this.length - 1);
      const randomY = getRandom(this.length - 1);

      if (checkForPlaint(this.matrix, x, y, randomX, randomY)) {
        this.matrix[randomY][randomX].value = true;
        totalBombs -= 1;
      }
    }
    this.addCellsValue();
  }

  clickEmptyCell(x, y) {
    getNearbyCells(this.matrix, x, y).forEach((cell) => {
      if (cell && !cell.isOpen) {
        if (cell.value !== true) {
          if (cell.value === 0) {
            cell.open();
            this.clickEmptyCell(cell.x, cell.y);
          }
          if (cell.value > 0) {
            cell.open();
          }
        }
      }
    });
  }

  clickNumberCells(x, y) {
    const arrCells = getNearbyCells(this.matrix, x, y);
    const arrFlag = arrCells.filter((cell) => cell?.isFlag);
    if (this.matrix[y][x].value === arrFlag.length) {
      arrCells.forEach((cell) => {
        if (cell && cell.value !== true) {
          cell.open();
          if (cell.value === 0) {
            cell.open();
            this.clickEmptyCell(cell.x, cell.y);
          }
        }
      });
    }
  }

  addFlag(x, y) {
    const elem = this.matrix[y][x];
    if (!elem.isOpen) {
      elem.isFlag = elem.isFlag ? false : true;
    }
    this.updateCells();
  }

  openBombs() {
    this.matrix.forEach((arr, y) => {
      arr.forEach((cell, x) => {
        if (this.matrix[y][x].value === true) {
          this.matrix[y][x].open();
        }
      });
    });
  }

  addCellsValue() {
    this.matrix.forEach((arr, y) => {
      arr.forEach((cell, x) => {
        const val1 = this.matrix[y - 1]?.[x - 1]?.value;
        const val2 = this.matrix[y - 1]?.[x]?.value;
        const val3 = this.matrix[y - 1]?.[x + 1]?.value;
        const val4 = this.matrix[y]?.[x - 1]?.value;
        const val5 = this.matrix[y]?.[x + 1]?.value;
        const val6 = this.matrix[y + 1]?.[x - 1]?.value;
        const val7 = this.matrix[y + 1]?.[x]?.value;
        const val8 = this.matrix[y + 1]?.[x + 1]?.value;

        const countBombs = [
          val1,
          val2,
          val3,
          val4,
          val5,
          val6,
          val7,
          val8,
        ].filter((el) => el === true).length;
        if (this.matrix[y][x].value !== true) {
          this.matrix[y][x].value = countBombs;
        }
      });
    });
  }

  clickHandler(x, y) {
    const elem = this.matrix[y][x];

    if (this.isFirstClick) {
      this.addBombs(x, y);
      this.isFirstClick = false;
    }

    if (!elem.isOpen && !elem.isFlag) {
      elem.open();
      if (elem.value === 0) {
        this.clickEmptyCell(x, y);
      }

      if (elem.value === true) {
        this.openBombs(x, y);
      }

      this.updateCells();
    }

    if (elem.isOpen && elem.value > 0) {
      this.clickNumberCells(x, y);
      this.updateCells();
    }
  }
}
