import runner from '../logic/runner';
import store from '../logic/store';

const goToNextTurn = store => {
  store.goToNextTurn();
  postMessage({ type: 'BOARD_UPDATE', board: store.getColouredBoard() });
}

onmessage = (message) => {
  if (message.data.type === 'GET_ALL') {
    const config = store.getAll();
    config.timeout = runner.getTimeout();
    postMessage({ type: 'SET_ALL', all: config });
  } else if (message.data.type === 'NEXT_TURN') {
    runner.goToNextTurn(() => goToNextTurn(store));
  } else if (message.data.type === 'RUN') {
    runner.run(() => goToNextTurn(store));
  } else if (message.data.type === 'PAUSE') {
    runner.pause();
  } else if (message.data.type === 'UPDATE_CONFIG') {
    runner.pause();
    store.updateConfig(message.data.config);
    store.initBoard();
    const config = store.getAll();
    config.timeout = runner.getTimeout();
    postMessage({ type: 'SET_ALL', all: config });
  } else if (message.data.type === 'TIMEOUT_UPDATE') {
    runner.setTimeout(message.data.timeout);
  } else if (message.data.type === 'RESET') {
    store.initBoard();
    postMessage({ type: 'BOARD_UPDATE', board: store.getColouredBoard() });
  } else if (message.data.type === 'CELL_CLICK') {
    store.clickOnCell(message.data.x, message.data.y);
    postMessage({ type: 'BOARD_UPDATE', board: store.getColouredBoard() });
  }
};
