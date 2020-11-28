import Puzzle from '@/puzzle';
import './styles/scss.scss';

const Game = {
  properties: {
    size: 4,
    sound: false,
  },
  history: {},
  current: null,

  init() {
    const createIconOfTemplate = (name) =>
      `<i class="material-icons">${name}</i>`;

    let bodyPart = document.createElement('div');
    bodyPart.classList.add('main');
    document.body.appendChild(bodyPart);

    let previousGame = localStorage.getItem('puzzle');
    this.current =
      previousGame === null
        ? this.createNewGame()
        : this.continueGame(previousGame);

    let newGameBtn = document.createElement('button');
    newGameBtn.classList.add('control-area__new-game');
    newGameBtn.textContent = 'New Game';
    newGameBtn.addEventListener('click', () => {
      this.createNewGame();
    });

    let audioClick = this._createAudioElement(
      'sound-click',
      'close-up-white-curtains.wav'
    );
    bodyPart.appendChild(audioClick);

    let audioDragStart = this._createAudioElement(
      'sound-dragstart',
      'ES_VoiceClip.wav'
    );
    bodyPart.appendChild(audioDragStart);

    let audioDrop = this._createAudioElement(
      'sound-drop',
      'ES_LaseGunshot.wav'
    );
    bodyPart.appendChild(audioDrop);

    const soundBtn = document.createElement('button');
    soundBtn.classList.add('control-area__sound');
    soundBtn.innerHTML = createIconOfTemplate('volume_off');
    soundBtn.addEventListener('click', (event) => {
      this.properties.sound = !this.properties.sound;
      soundBtn.classList.toggle('sound--on', this.properties.sound);
      if (this.properties.sound)
        soundBtn.innerHTML = createIconOfTemplate('volume_up');
      else soundBtn.innerHTML = createIconOfTemplate('volume_off');
    });

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
    settingsBtn.innerHTML = createIconOfTemplate('settings');
    settingsBtn.addEventListener('click', (event) => {
      modal.style.display = 'block';
    });

    const controlArea = document.createElement('div');
    controlArea.classList.add('control-area');
    controlArea.appendChild(newGameBtn);
    controlArea.appendChild(soundBtn);
    controlArea.appendChild(settingsBtn);
    bodyPart.appendChild(controlArea);

    document.addEventListener('userWon', () => {
      this.createNewGame();
    });
  },

  _createAudioElement(dataKey, src) {
    let audioElement = document.createElement('AUDIO');
    audioElement.dataset.key = dataKey;
    audioElement.src = src;
    return audioElement;
  },

  createNewGame(cheatMode = false) {
    localStorage.removeItem('puzzle');
    document.querySelectorAll('.info, .board').forEach((e) => e.remove());
    this.current = new Puzzle(this.properties.size, null, cheatMode);
  },

  continueGame(puzzleInfo) {
    this.current = new Puzzle(this.properties.size, puzzleInfo);
  },
};

Game.init();
