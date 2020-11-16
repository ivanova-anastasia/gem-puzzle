import Puzzle from '@/puzzle';

import './babel';

import './styles/styles.css';
import './styles/scss.scss';

const init = () => {
  let bodyPart = document.createElement('div');
  bodyPart.classList.add('main');
  document.body.appendChild(bodyPart);
  let game = new Puzzle(4);

  const newGameBtn = document.createElement('button');
  newGameBtn.classList.add('new-game');
  //newGameBtn.innerHTML = `<i class="material-icons">'keyboard_hide'</i>`;
  newGameBtn.textContent = 'New Game';
  bodyPart.appendChild(newGameBtn);
};

const Game = {
  properties: {
    size: 4,
    sound: false,
  },
  history: {},
  current: null,

  init() {
    let bodyPart = document.createElement('div');
    bodyPart.classList.add('main');
    document.body.appendChild(bodyPart);

    const previousGame = localStorage.getItem('puzzle');
    this.current =
      previousGame === null
        ? this.createNewGame()
        : this.continueGame(previousGame);

    const newGameBtn = document.createElement('button');
    newGameBtn.classList.add('control-area__new-game');
    newGameBtn.textContent = 'New Game';
    newGameBtn.addEventListener('click', () => {
      this.createNewGame();
    });

    let audioClick = document.createElement('AUDIO');
    audioClick.dataset.key = 'sound-click';
    audioClick.src = 'close-up-white-curtains.wav';
    bodyPart.appendChild(audioClick);

    let audioDragStart = document.createElement('AUDIO');
    audioDragStart.dataset.key = 'sound-dragstart';
    audioDragStart.src = 'ES_VoiceClip.wav';
    bodyPart.appendChild(audioDragStart);

    let audioDrop = document.createElement('AUDIO');
    audioDrop.dataset.key = 'sound-drop';
    audioDrop.src = 'ES_LaseGunshot.wav';
    bodyPart.appendChild(audioDrop);

    const soundBtn = document.createElement('button');
    soundBtn.classList.add('control-area__sound');
    soundBtn.innerHTML = `<i class="material-icons">volume_off</i>`;
    soundBtn.addEventListener('click', (event) => {
      this.properties.sound = !this.properties.sound;
      soundBtn.classList.toggle('sound--on', this.properties.sound);
      if (this.properties.sound)
        soundBtn.innerHTML = `<i class="material-icons">volume_up</i>`;
      else soundBtn.innerHTML = `<i class="material-icons">volume_off</i>`;
    });

    //modal elements

    const span = document.createElement('span');
    span.classList.add('close');
    span.innerHTML = '&times;';

    const cheatMode = document.createElement('button');
    cheatMode.classList.add('modal-content__settings_cheat-mode');
    cheatMode.textContent = 'Cheat mode';

    const additionalSettings = document.createElement('div');
    additionalSettings.classList.add('modal-content__settings');
    additionalSettings.appendChild(cheatMode);

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');
    modalContent.appendChild(span);
    modalContent.appendChild(additionalSettings);

    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.appendChild(modalContent);
    bodyPart.appendChild(modal);

    span.addEventListener('click', () => {
      modal.style.display = 'none';
    });

    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = 'none';
      }
    };

    cheatMode.addEventListener('click', (event) => {
      modal.style.display = 'none';
      this.createNewGame(true);
    });

    const settingsBtn = document.createElement('button');
    settingsBtn.classList.add('control-area__settings');
    settingsBtn.innerHTML = `<i class="material-icons">settings</i>`;
    settingsBtn.addEventListener('click', (event) => {
      modal.style.display = 'block';
    });

    const controlArea = document.createElement('div');
    controlArea.classList.add('control-area');
    controlArea.appendChild(newGameBtn);
    controlArea.appendChild(soundBtn);
    controlArea.appendChild(settingsBtn);

    bodyPart.appendChild(controlArea);

    document.addEventListener('userWon', (event) => {
      this.createNewGame();
    });
  },

  createNewGame(cheatMode = false) {
    localStorage.removeItem('puzzle');
    document.querySelectorAll('.info, .board').forEach((e) => e.remove());
    this.current = new Puzzle(this.properties.size, null, cheatMode);
  },

  continueGame(puzzleInfo) {
    this.current = new Puzzle(this.properties.size, puzzleInfo);
  },
  _changeSound(event) {},
};

Game.init();
