import './style.css';

(() => {
  const CELL_SIZE = 10;

  const state = {
    ww: null,
    config: null,
    isRunning: false,
  };

  const elements = {
    'ww-not-supported': document.getElementById('ww-not-supported'),
    'game': document.getElementById('game'),
    'start-resume-pause': document.getElementById('start-resume-pause'),
    'next-turn': document.getElementById('next-turn'),
    'reset': document.getElementById('reset'),
    'height': document.getElementById('height'),
    'width': document.getElementById('width'),
    'alive-odds': document.getElementById('alive-odds'),
    'is-wrap-around': document.getElementById('is-wrap-around'),
    'timeout': document.getElementById('timeout'),
    'board': document.getElementById('board'),
    'game-name': document.getElementById('game-name'),
  };

  if (!window.Worker) {
    return;
  }
  elements['ww-not-supported'].classList.add('hidden');
  elements['game'].classList.remove('hidden');

  const updateStartResumePauseButton = state => {
    let label = 'Resume';
    if (state.isRunning) {
      label = 'Pause';
    }
    elements['start-resume-pause'].innerText = label;
  };

  const updateConfig = (state, needsReset) => {
    state.isRunning = false;
    updateStartResumePauseButton(state);
    if (needsReset) {
      resetBoardSize(state.config.height, state.config.width);
      clearBoard(state.config.height, state.config.width);
    }
    state.ww.postMessage({ type: 'UPDATE_CONFIG', config: state.config });
  };

  elements['start-resume-pause'].addEventListener('click', e => {
    state.isRunning = !state.isRunning;
    if (state.isRunning) {
      state.ww.postMessage({ type: 'RUN' });
    } else {
      state.ww.postMessage({ type: 'PAUSE' });
    }
    updateStartResumePauseButton(state);
  });

  elements['next-turn'].addEventListener('click', () => {
    state.isRunning = false;
    updateStartResumePauseButton(state);
    state.ww.postMessage({ type: 'NEXT_TURN' });
  });
  elements['reset'].addEventListener('click', () => state.ww.postMessage({ type: 'RESET' }));

  elements['height'].addEventListener('change', e => {
    state.config.height = parseInt(e.target.value);
    updateConfig(state, true);
  });
  elements['width'].addEventListener('change', e => {
    state.config.width = parseInt(e.target.value);
    updateConfig(state, true);
  });
  elements['alive-odds'].addEventListener('change', e => {
    state.config.aliveOdds = parseFloat(e.target.value);
    updateConfig(state, false);
  });
  elements['is-wrap-around'].addEventListener('change', e => {
    state.config.isWrapAround = e.target.checked;
    updateConfig(state, false);
  });
  elements['timeout'].addEventListener('change', e => {
    state.ww.postMessage({ type: 'TIMEOUT_UPDATE', timeout: parseInt(e.target.value) });
  });
  elements['board'].addEventListener('click', e => {
    console.log(e);
    state.ww.postMessage({ type: 'CELL_CLICK', x: Math.floor(e.layerX / CELL_SIZE), y: Math.floor(e.layerY / CELL_SIZE) });
  });

  state.ww = new Worker('ww.js');

  const resetBoardSize = (height, width) => {
    const canvas = elements['board'];
    canvas.height = height * CELL_SIZE;
    canvas.width = width * CELL_SIZE;
  };

  const clearBoard = (height, width) => {
    const ctx = elements['board'].getContext('2d');
    ctx.fillStyle = 'white';
    ctx.clearRect(0, 0, width * CELL_SIZE, height * CELL_SIZE);
  };

  const drawBoard = board => {
    const ctx = elements['board'].getContext('2d');
    board.forEach(cell => {
      ctx.fillStyle = cell.colour;
      ctx.fillRect(cell.x * CELL_SIZE, cell.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    });
  };

  state.ww.onmessage = message => {
    if (message.data.type === 'SET_ALL') {
      console.time('SET_ALL');

      elements['game-name'].innerHTML = message.data.all.gameName;

      state.config = message.data.all.config;
      elements['height'].value = state.config.height;
      elements['width'].value = state.config.width;
      elements['alive-odds'].value = state.config.aliveOdds;
      elements['is-wrap-around'].checked = state.config.isWrapAround;
      elements['timeout'].value = message.data.all.timeout;

      resetBoardSize(state.config.height, state.config.width);
      clearBoard(state.config.height, state.config.width);
      drawBoard(message.data.all.board);

      console.timeEnd('SET_ALL');
    } else if (message.data.type === 'BOARD_UPDATE') {
      console.time('BOARD_UPDATE');

      clearBoard(state.config.height, state.config.width);
      drawBoard(message.data.board);

      console.timeEnd('BOARD_UPDATE');
    }
  };
  state.ww.postMessage({ type: 'GET_ALL' });
})();
