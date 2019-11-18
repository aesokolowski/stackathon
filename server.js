const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const socketIo = require('socket.io');
const io = socketIo.listen(server);
const path = require('path');

const Deck = require('./deck');
const Card = require('./card');
const Hand = require('./hand');
const Player = require('./player');

const { NORTH, EAST, SOUTH, WEST } = require('./enums/playerEnums');
const { CLUBS, DIAMONDS, HEARTS, SPADES } = require('./enums/suitEnums');
const { BLACK, RED } = require('./enums/colorEnums');
const { ACE, TWO, THREE, FOUR, FIVE, SIX, SEVEN, EIGHT, NINE, TEN, JACK, QUEEN,
        KING, JOKER } = require('./enums/nameEnums');

const connections = [];

let deck;
const table = [null];
const trick = [null];

let dealer = NORTH;
let spadesBroken = false;

let nsTT = 0;
let ewTT = 0;

let nsBid = 0;
let ewBid = 0;

let nsScore = 0;
let ewScore = 0;

let nextPlayer;

const PORT = process.env.PORT || 8080;

const startGame = () => {
  deck = new Deck({ trumps: SPADES });
  table.push(new Player(NORTH, true));
  table.push(new Player(EAST, false));
  table.push(new Player(SOUTH, false));
  table.push(new Player(WEST, false));

  deck.shuffle();

  nextPlayer = dealer === WEST ? NORTH : dealer + 1;
  while (deck.draw.length > 0) {
    table[nextPlayer].hand.takeCard(deck.dealOne());
    nextPlayer = nextPlayer === WEST ? NORTH : nextPlayer + 1;   
  }

  connections.forEach(socket => {
    socket.emit('start game', { 
      hand: table[socket.userNumber].hand,
      playerNumber: socket.userNumber,
      nextPlayer: nextPlayer
    });
  });
};

server.listen(PORT);
console.log('Server running on port:', PORT);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

io.sockets.on('connection', socket => {
  connections.push(socket);
  socket.userNumber = connections.length;
  if (connections.length === 4) {
    startGame();
  };
  console.log(
    '%s connected: %s in total', socket.userNumber, connections.length
  );

  socket.on('disconnect', data => {
    connections.splice(connections.indexOf(socket), 1);
    console.log(
      '%s Disconnected: %s in total', socket.userNumber, connections.length
    );
  });

  socket.on('submit bid', lastBid => {
    let lastPlayer = nextPlayer;

    table[nextPlayer].bid = lastBid;
    nextPlayer = nextPlayer === WEST ? NORTH : nextPlayer + 1;
    connections.forEach(socket => {
      socket.emit('next bid', {
        playerNumber: socket.userNumber,
        lastPlayer: lastPlayer,
        lastBid: lastBid,
        nextPlayer: nextPlayer
      });
    });
  });

});
