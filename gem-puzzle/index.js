import Puzzle from '@/puzzle';
import './styles/scss.scss';
import { generateElement } from '@/generationElements';

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

    let bodyPart = generateElement('div', 'main');
    document.body.appendChild(bodyPart);

    let previousGame = localStorage.getItem('puzzle');
    this.current =
      previousGame === null
        ? this.createNewGame()
        : this.continueGame(previousGame);

    let newGameBtn = generateElement(
      'button',
      'control-area__new-game',
      'New Game'
    );
    newGameBtn.addEventListener('click', () => {
      this.createNewGame();
    });

    let audioClick = generateElement(
      'AUDIO',
      null,
      null,
      null,
      'close-up-white-curtains.wav',
      { key: 'key', data: 'sound-click' }
    );
    bodyPart.appendChild(audioClick);

    let audioDragStart = generateElement(
      'AUDIO',
      null,
      null,
      null,
      'ES_VoiceClip.wav',
      { key: 'key', data: 'sound-dragstart' }
    );
    bodyPart.appendChild(audioDragStart);

    let audioDrop = generateElement(
      'AUDIO',
      null,
      null,
      null,
      'ES_LaseGunshot.wav',
      { key: 'key', data: 'sound-drop' }
    );
    bodyPart.appendChild(audioDrop);

    const soundBtn = generateElement(
      'button',
      'control-area__sound',
      null,
      createIconOfTemplate('volume_off')
    );
    soundBtn.addEventListener('click', (event) => {
      this.properties.sound = !this.properties.sound;
      soundBtn.classList.toggle('sound--on', this.properties.sound);
      if (this.properties.sound)
        soundBtn.innerHTML = createIconOfTemplate('volume_up');
      else soundBtn.innerHTML = createIconOfTemplate('volume_off');
    });

    const span = generateElement('span', null, null, '&times;');

    const cheatMode = generateElement(
      'button',
      'modal-content__settings_cheat-mode',
      'Cheat mode'
    );

    const additionalSettings = generateElement(
      'div',
      'modal-content__settings'
    );
    additionalSettings.appendChild(cheatMode);

    const modalContent = generateElement('div', 'modal-content');
    modalContent.appendChild(span);
    modalContent.appendChild(additionalSettings);

    const modal = generateElement('div', 'modal');
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

    const settingsBtn = generateElement(
      'button',
      'control-area__settings',
      null,
      createIconOfTemplate('settings')
    );
    settingsBtn.addEventListener('click', (event) => {
      modal.style.display = 'block';
    });

    const controlArea = generateElement('div', 'control-area');
    controlArea.appendChild(newGameBtn);
    controlArea.appendChild(soundBtn);
    controlArea.appendChild(settingsBtn);
    bodyPart.appendChild(controlArea);

    document.addEventListener('userWon', () => {
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
};

Game.init();
