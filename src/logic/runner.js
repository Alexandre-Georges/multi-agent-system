let isRunning = false;
let timeout = 100;

const startTurn = cb => {
  cb();
  if (isRunning === true) {
    setTimeout(() => startTurn(cb), timeout);
  }
};

export default {
  getTimeout: () => timeout,
  setTimeout: newTimeout => { timeout = newTimeout; },
  isRunning: () => isRunning,
  goToNextTurn: cb => {
    isRunning = false;
    startTurn(cb);
  },
  run: cb => {
    isRunning = true;
    startTurn(cb);
  },
  pause: () => {
    isRunning = false;
  },
}