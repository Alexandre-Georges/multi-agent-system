# Multi Agent System

[Demo here](https://alexandre-georges.github.io/multi-agent-system/)

This project makes creating a multi agent system easy:

- the logic is handled by a web worker to parallelise the process as much as we can
- the front-end generate a grid according to what the logic returns (the game just needs to return an array containing the colours of each cell)
- this grid is drawn with canvas to make the rendering faster
- the canvas also support clicking on a cell, this event can then be bound in the game logic

## Setup

```bash
npm install
```

### Dev mode

Webpack will watch the files in case they get modified.

```bash
npm run dev
```

In a separate shell (it requires python to be installed):

```bash
npm run server
```

[Open a browser](http://localhost:8000/)

### Prod mode

```bash
npm run prod
```

In a separate shell (it requires python to be installed):

```bash
npm run server
```

[Open a browser](http://localhost:8000/)
