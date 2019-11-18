const Card = require('./card');

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

class Deck {
  constructor(options = {}) {
    this.aceHigh = typeof options.aceHigh === 'undefined' ?
      DEF_AH : options.aceHigh;
    this.wild = options.wild || DEF_WD;
    this.lowball = typeof options.lowball === 'undefined' ?
      DEF_LB : options.lowball;
    this.joker = typeof options.jokers === 'undefined' ?
      DEF_JK : options.jokers;
    this.trumps = options.trumps || null;
    this.draw = Deck.generateDeck({
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
          deck.push(new Card(
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

  // standard compare function -- a la determining tie-breaking in poker
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

  // compare function specifically for Spades --
  // returns neg only if a beating card is played, otherwise returns pos
  // remember that in Spades if you can't follow suit you lose the hand unless
  // you play a spade
  // in order to work this.trumps needs to be initialized as SPADES and all
  // other options must be default
  spadesCompare(card1, card2) {
    if (card1.suit === this.trumps && card2.suit === this.trumps) {
      return card1.rank - card2.rank;
    }

    if (card1.suit === this.trumps) {
      return 1;
    }

    if (card2.suit === this.trumps) {
      return -1;
    }

    if (card1.suit === card2.suit) {
      return card1.rank - card2.rank;
    }

    return 1;
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

  toString() {
    return this.draw.reduce((str, card) => {
      str += '\n' + card.toString();
      return str;
    }, '');
  }
}

module.exports = Deck;
