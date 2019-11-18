const Hand = require('./hand');

class Player {
  constructor(pos, isDealer) {
    this.hand = new Hand();
    this.pos = pos;
    this.isDealer = isDealer;
    this.bid = 0;
    this.tricksTaken = 0;
  }
}

module.exports = Player;
