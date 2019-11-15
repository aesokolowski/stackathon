const card = require('./card');

// enums
const { CLUBS, DIAMONDS, HEARTS, SPADES } = require('./enums/suitEnums');
const { BLACK, RED } = require('./enums/colorEnums');
const { ACE, TWO, THREE, FOUR, FIVE, SIX, SEVEN, EIGHT, NINE, TEN, JACK, QUEEN,
        KING, JOKER } = require('./enums/nameEnums');

// defaults
const DEF_AH = true,
      DEF_WD = [],
      DEF_LB = false,
      DEF_JK = false;

class deck {
  constructor(options = {}) {
    this.aceHigh = typeof options.aceHigh === 'undefined' ?
      DEF_AH : options.aceHigh;
    this.wild = options.wild || DEF_WD;
    this.lowball = typeof options.lowball === 'undefined' ?
      DEF_LB : options.lowball;
    this.joker = typeof options.jokers === 'undefined' ?
      DEF_JK : options.jokers;
    this.trumps = options.trumps || null;
    this.draw = deck.generateDeck({
      aceHigh: this.aceHigh,
      wild: this.wild,
      lowball: this.lowball,
      joker: this.joker,
      trumps: this.trumps
    });
    this.inPlay = [];
    this.discarded = [];
  }

  // class function
  static generateDeck(options) {
    const deck = [];

    // loop through enumerated
    if (!this.jokers) {
      for (let i = KING; i >= ACE; i--) {
        for (let j = SPADES; j >= CLUBS; j--) {
          deck.push(new card(
            i, j, i === ACE ?
              options.aceHigh ? 14 : 1
            : i
          ));
        }
      }
    // don't need jokers for any games at this point
    } else {
      throw 'Jokers not implemented yet';
    }

    return deck;
  }

  // Fisher-Yates algorithm, from pseudocode on Wikipedia
  shuffle() {
    for (let i = this.draw.length - 1; i >= 1; i--) {
      let j = Math.floor(Math.random() * i);

      [this.draw[j], this.draw[i]] = [this.draw[i], this.draw[j]];
    }
  }

  compare(card1, card2) {
    if (this.trumps !== null) {
      if (card1.suit === this.trumps && card2.suit !== this.trumps) {
        return 1;
      }

      if (card1.suit !== this.trumps && card2.suit === this.trumps) {
        return -1;
      }
    }

    return this.lowball ? card2.rank - card1.rank : card1.rank - card2.rank;
  }

  dealOne() {
    const card = this.draw.pop();

    this.inPlay.push(card);
    return card;
  }

  discard(name, suit) {
    for (let i = 0; i < this.inPlay.length; i++) {
      const card = this.inPlay[i];

      if (card.name === name && card.suit === suit) {
        this.discarded.push(this.inPlay.splice(i, 1));
        return;
      }
    }

    throw new Error('that card is not in play');
  }
}

module.exports = deck;
