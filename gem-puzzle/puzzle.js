export default class Puzzle {
  elements = {
    playingField: null,
    puzzles: [],
  };
  puzzleSize = 100;

  constructor(size = 4) {
    this.size = size;
    this._init();
  }

  start() {}

  generateRandomPuzzleArray() {
    let combinationArr = this._getRandomPuzzle();
    while (!this.isSuccessfulCombination(combinationArr)) {
      console.log('_getRandomPuzzle');
      combinationArr = this._getRandomPuzzle();
    }

    let tempArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];
    return combinationArr;
  }

  _getRandomPuzzle() {
    return [...Array(16).keys()].sort(() => Math.random() - 0.5);
  }

  isWin() {
    const isWin = this.elements.puzzles.every((element, index, array) => {
      let expectedLocation =
        parseFloat(element.style.top) * this.size +
        parseFloat(element.style.left);
      if (element.textContent === '') {
        return (array.length - 1) * this.puzzleSize === expectedLocation;
      }
      return (
        parseInt(element.textContent - 1) * this.puzzleSize === expectedLocation
      );
    });
    if (isWin) console.log('isWin');
  }

  isSuccessfulCombination(combinationArr) {
    const rowNumber = Math.floor(combinationArr.indexOf(0) / this.size) + 1;
    let sum = 0;

    combinationArr.forEach((value, index, array) => {
      if (value !== 0) {
        for (let j = index + 1; j < array.length; j++) {
          if (value > array[j] && array[j] !== 0) {
            sum++;
          }
        }
      }
    });

    sum += rowNumber;
    return sum % 2 === 0;
  }

  _init() {
    this.elements.playingField = document.createElement('div');
    this.elements.playingField.classList.add('board');
    this.elements.playingField.appendChild(this._createPuzzles());
    document.body.appendChild(this.elements.playingField);
  }

  _createPuzzles() {
    const fragment = document.createDocumentFragment();

    this.generateRandomPuzzleArray().forEach((value, index, array) => {
      const puzzleElement = document.createElement('div');
      if (value === 0) {
        puzzleElement.classList.add('board__puzzle_empty');

        puzzleElement.addEventListener('dragover', (event) => {
          event.preventDefault();
        });

        puzzleElement.addEventListener('drop', (event) => {
          this._dropListener(event);
        });
      } else {
        puzzleElement.classList.add('board__puzzle');
        puzzleElement.innerText = value;
        puzzleElement.draggable = true;

        puzzleElement.addEventListener('dragstart', (event) => {
          event.target.classList.add('selected', 'board__puzzle_drag');
          requestAnimationFrame(function () {
            event.target.style.visibility = 'hidden';
          });
        });

        puzzleElement.addEventListener('dragend', (event) => {
          event.preventDefault();
          this._dragEndRemoveStyles(event.target);
        });
      }
      puzzleElement.style.top = `${
        Math.floor(index / this.size) * this.puzzleSize
      }px`;
      puzzleElement.style.left = `${(index % this.size) * this.puzzleSize}px`;

      puzzleElement.addEventListener('click', (event) => {
        this._move(event.currentTarget.innerText);
      });

      this.elements.puzzles.push(puzzleElement);
      fragment.appendChild(puzzleElement);
    });
    return fragment;
  }

  _dropListener() {
    const activeElement = this.elements.puzzles.find((element) =>
      element.classList.contains('selected')
    );
    if (activeElement !== undefined) {
      this._move(activeElement.textContent);
    }
  }

  _dragEndRemoveStyles(element) {
    element.style.visibility = '';
    element.classList.remove('selected', 'board__puzzle_drag');
  }

  _move(elementInnerTextValue) {
    const emptyPuzzle = this.elements.puzzles.find(
      (element) => element.textContent === ''
    );
    const clickedPuzzle = this.elements.puzzles.find(
      (element) => element.textContent === elementInnerTextValue
    );

    if (this._isAvailableMoving(clickedPuzzle, emptyPuzzle)) {
      const tempPuzzleLeft = emptyPuzzle.style.left;
      const tempPuzzleTop = emptyPuzzle.style.top;

      emptyPuzzle.style.left = clickedPuzzle.style.left;
      emptyPuzzle.style.top = clickedPuzzle.style.top;

      clickedPuzzle.style.left = tempPuzzleLeft;
      clickedPuzzle.style.top = tempPuzzleTop;

      this.isWin();
    }
  }

  _isAvailableMoving(currentPuzzle, emptyPuzzle) {
    return (
      Math.abs(
        parseFloat(currentPuzzle.style.left) -
          parseFloat(emptyPuzzle.style.left)
      ) +
        Math.abs(
          parseFloat(currentPuzzle.style.top) -
            parseFloat(emptyPuzzle.style.top)
        ) ===
      this.puzzleSize
    );
  }
}
