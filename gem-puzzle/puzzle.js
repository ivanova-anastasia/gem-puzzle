export default class Puzzle {
  elements = {
    playingField: null,
    puzzles: [],
    sound: null,
  };
  puzzleSize = 100;

  info = {
    time: {
      element: null,
      value: {
        startTime: 0,
        savedTime: 0,
        differenceTime: 0,
        timerId: null,
      },
    },
    moves: { element: null, value: 0 },
    isWin: false,
    isNewGame: true,
    cheatMode: false,
  };
  storage = {};

  constructor(size = 4, previousGame = null, cheatMode = false) {
    if (previousGame !== null) this._reStart(previousGame);
    else this.isNewGame = true;
    this.info.cheatMode = cheatMode;
    this.size = size;
    this._init();
  }

  _reStart(previousGame) {
    this.storage = JSON.parse(previousGame);
    this.info.isNewGame = false;
    this.info.moves.value =
      this.storage['moves'] === undefined ? 0 : this.storage['moves'];
    this.info.time.value = undefined
      ? null
      : (() => {
          let data = JSON.parse(this.storage['time']);
          clearInterval(data.timerId);
          return data;
        })();
    this.info.time.value.savedTime = this.info.time.value.differenceTime;
  }

  _generateRandomPuzzleArray() {
    if (!this.info.isNewGame) {
      return JSON.parse(this.storage['puzzleArr']);
    } else if (this.info.cheatMode) {
      return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 0, 15];
    }
    let combinationArr = this._getRandomPuzzle();
    while (!this._isSuccessfulCombination(combinationArr)) {
      combinationArr = this._getRandomPuzzle();
    }
    return combinationArr;
  }

  _getRandomPuzzle() {
    return [...Array(this.size * this.size).keys()].sort(
      () => Math.random() - 0.5
    );
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
    if (isWin) {
      alert(
        `Ура! Вы решили головоломку за ${this.info.time.element.textContent} и ${this.info.moves.element.textContent} ходов`
      );
      let event = new Event('userWon', { bubbles: true });
      this.elements.playingField.dispatchEvent(event);
    }
  }

  _isSuccessfulCombination(combinationArr) {
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
    const mainPart = document.querySelector('.main');

    const timeInfoText = document.createElement('div');
    timeInfoText.classList.add('info__time_text');
    timeInfoText.textContent = 'Time';

    this.info.time.element = document.createElement('div');
    this.info.time.element.classList.add('info__time_value');

    const timeInfo = document.createElement('div');
    timeInfo.classList.add('info__time');
    timeInfo.appendChild(timeInfoText);
    timeInfo.appendChild(this.info.time.element);

    const movesInfoText = document.createElement('div');
    movesInfoText.classList.add('info__moves_text');
    movesInfoText.textContent = 'Moves';

    this.info.moves.element = document.createElement('div');
    this.info.moves.element.classList.add('info__moves_value');
    this.info.moves.element.textContent = this.info.moves.value;

    const movesInfo = document.createElement('div');
    movesInfo.classList.add('info__moves');
    movesInfo.appendChild(movesInfoText);
    movesInfo.appendChild(this.info.moves.element);

    const info = document.createElement('div');
    info.classList.add('info');
    info.appendChild(timeInfo);
    info.appendChild(movesInfo);
    mainPart.appendChild(info);

    this.elements.playingField = document.createElement('div');
    this.elements.playingField.classList.add('board');
    this.elements.playingField.appendChild(this._createPuzzles());
    mainPart.appendChild(this.elements.playingField);

    this.elements.sound = document.querySelector('.control-area__sound');

    this._startTimer();
    this._savePuzzleArray();
    this._saveToLocaleStorage('moves', this.info.moves.element.textContent);
  }

  _createPuzzles() {
    const fragment = document.createDocumentFragment();

    this._generateRandomPuzzleArray().forEach((value, index, array) => {
      const puzzleElement = document.createElement('div');
      if (value === 0) {
        puzzleElement.classList.add('board__puzzle_empty');

        puzzleElement.addEventListener('dragover', (event) => {
          event.preventDefault();
        });

        puzzleElement.addEventListener('drop', (event) => {
          this._dropListener(event);
          this._playMusic('sound-drop');
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
          this._playMusic('sound-dragstart');
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
        this._playMusic('sound-click');
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

      this.info.moves.element.textContent++;
      this._saveToLocaleStorage('moves', this.info.moves.element.textContent);
      this._savePuzzleArray();
      this.isWin();
    }
  }

  _savePuzzleArray() {
    let puzzleNumbers = [];
    for (let i = 0; i < this.elements.puzzles.length; i++) {
      let value = this.elements.puzzles.find((element) => {
        return (
          element.style.top ===
            `${Math.floor(i / this.size) * this.puzzleSize}px` &&
          element.style.left === `${(i % this.size) * this.puzzleSize}px`
        );
      });
      if (value !== undefined) {
        puzzleNumbers.push(value.textContent === '' ? 0 : value.textContent);
      } else
        console.log('savePuzzleArray does not find value. Please, check it.');
    }
    this._saveToLocaleStorage('puzzleArr', JSON.stringify(puzzleNumbers));
  }

  _startTimer() {
    this.info.time.value.startTime = new Date().getTime();
    this.info.time.value.timerId = setInterval(() => this._showTime(), 1);
    this._saveToLocaleStorage('time', JSON.stringify(this.info.time.value));
  }

  _showTime() {
    let updatedTime = new Date().getTime();
    let difference =
      updatedTime -
      this.info.time.value.startTime +
      this.info.time.value.savedTime;
    this.info.time.value.differenceTime = difference;

    var minutes = Math.floor(difference / (1000 * 60));
    var seconds = Math.floor((difference % (1000 * 60)) / 1000);

    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    this.info.time.element.textContent = `${minutes}:${seconds}`;
    this._saveToLocaleStorage('time', JSON.stringify(this.info.time.value));
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

  _saveToLocaleStorage(name, value) {
    this.storage[name] = value;
    localStorage.setItem('puzzle', JSON.stringify(this.storage));
  }

  _playMusic(source) {
    if (
      !document
        .querySelector('.control-area__sound')
        .classList.contains('sound--on')
    )
      return;
    const audio = document.querySelector(`audio[data-key="${source}"]`);
    audio.currentTime = 0;
    audio.play();
  }
}
