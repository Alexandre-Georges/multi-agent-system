import gameOfLife from './game-of-life';

let game = gameOfLife;

const getAll = () => ({
  gameCode: game.getCode(),
  gameName: game.getName(),
  config: game.getConfig(),
  board: game.getColouredBoard(),
});

export default {
  getAll,
  updateConfig: config => game.updateConfig(config),
  initBoard: () => game.initBoard(),
  clickOnCell: (x, y) => game.clickOnCell(x, y),
  goToNextTurn: () => game.goToNextTurn(),
  getColouredBoard: () => game.getColouredBoard(),
};
