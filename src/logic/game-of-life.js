const state = {};

const updateConfig = ({ height, width, isWrapAround, aliveOdds }) => {
  state.height = height;
  state.width = width;
  state.isWrapAround = isWrapAround;
  state.aliveOdds = aliveOdds;
  state.board = [];
  for (let yIndex = 0; yIndex < height; yIndex++) {
    state.board[yIndex] = [];
    for (let xIndex = 0; xIndex < width; xIndex++) {
      state.board[yIndex][xIndex] = false;
    }
  }
};

const initRandom = ({ height, width, aliveOdds }) => {
  const board = [];
  for (let yIndex = 0; yIndex < height; yIndex++) {
    board[yIndex] = [];
    for (let xIndex = 0; xIndex < width; xIndex++) {
      board[yIndex][xIndex] = Math.random() < aliveOdds;
    }
  }
  return board;
};

const toggleCell = (board, x, y) => {
  board[y][x] = !board[y][x];
};

const isAlive = (height, width, isWrapAround, board, x, y) => {
  let cellX = x;
  let cellY = y;
  if (x < 0 || x >= width) {
    if (!isWrapAround) {
      return false;
    }
    cellX = x < 0 ? width - 1 : 0;
  }
  if (y < 0 || y >= height) {
    if (!isWrapAround) {
      return false;
    }
    cellY = y < 0 ? height - 1 : 0;
  }
  return board[cellY][cellX];
};

const getNeighbourCount = (height, width, isWrapAround, board, x, y) => {
  let count = 0;
  const neighbourDs = [
    { dx: -1, dy: -1 }, { dx: 0, dy: -1 }, { dx: 1, dy: -1 },
    { dx: -1, dy: 0 }, { dx: 1, dy: 0 },
    { dx: -1, dy: 1 }, { dx: 0, dy: 1 }, { dx: 1, dy: 1 },
  ];
  for (const ds of neighbourDs) {
    if (isAlive(height, width, isWrapAround, board, x + ds.dx, y + ds.dy)) {
      count++;
    }
  }
  return count;
};

const isAliveNextTurn = (height, width, isWrapAround, board, x, y) => {
  const neighbourCount = getNeighbourCount(height, width, isWrapAround, board, x, y);
  const isCurrentlyAlive = board[y][x];

  if (isCurrentlyAlive === true) {
    if (neighbourCount < 2 || neighbourCount > 3) {
      return false;
    }
    return true;
  }
  return neighbourCount === 3;
};

const getNextTurn = ({ height, width, isWrapAround, board }) => {
  const nextBoard = [];
  for (let yIndex = 0; yIndex < height; yIndex++) {
    nextBoard[yIndex] = [];
    for (let xIndex = 0; xIndex < width; xIndex++) {
      nextBoard[yIndex][xIndex] = isAliveNextTurn(height, width, isWrapAround, board, xIndex, yIndex);
    }
  }
  return nextBoard;
};

const getColouredBoard = ({ height, width, board }) => {
  const colouredBoard = [];
  for (let yIndex = 0; yIndex < height; yIndex++) {
    for (let xIndex = 0; xIndex < width; xIndex++) {
      if (board[yIndex][xIndex] === true) {
        colouredBoard.push({ x: xIndex, y: yIndex, colour: 'black' });
      }
    }
  }
  return colouredBoard;
};

const initBoard = () => { state.board = initRandom(state); };

updateConfig({
  height: 50,
  width: 100,
  isWrapAround: true,
  aliveOdds: 0.05,
  board: null,
});
initBoard();

export default {
  getCode: () => 'GAME_OF_LIFE',
  getName: () => 'Game Of Life',
  getConfig: () => ({
    height: state.height,
    width: state.width,
    isWrapAround: state.isWrapAround,
    aliveOdds: state.aliveOdds,
  }),

  updateConfig,
  initBoard,
  clickOnCell: (x, y) => toggleCell(state.board, x, y),
  goToNextTurn: () => { state.board = getNextTurn(state); },
  getColouredBoard: () => getColouredBoard(state),
};
