const { CLUBS, DIAMONDS, HEARTS, SPADES } = require('./enums/suitEnums');
const { BLACK, RED } = require('./enums/colorEnums');
const { ACE, TWO, THREE, FOUR, FIVE, SIX, SEVEN, EIGHT, NINE, TEN, JACK, QUEEN,
        KING, JOKER } = require('./enums/nameEnums');
const Card = require('./card');

class Hand {
  constructor() {
    this.cards = [];
  }

  takeCard(card) {
    this.cards.push(card);
  }

  playCard(name, suit) {
    let len = this.cards.length;

    for (let i = 0; i < len; i++) {
      if (this.cards[i].name === name && this.cards[i].suit === suit) {
        if (i !== len - 1) {
          // destructure swap
          [
            this.cards[len - 1], this.cards[i]
          ] = [
            this.cards[i], this.cards[len - 1]
          ];
        }
        return this.cards.pop();
      }
    }

    throw new Error('404 card not found');
  }

  toString() {
    return this.cards.reduce((str, card) => {
      str += '\n' + card.toString();
      return str;
    }, '');
  }

  // ideally this class would have some sorting functions like poker sort,
  // trick-taking sort, etc but I consider that a low priority at this point
  // on Friday
}

module.exports = Hand;
