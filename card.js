const { CLUBS, DIAMONDS, HEARTS, SPADES } = require('./enums/suitEnums');
const { BLACK, RED } = require('./enums/colorEnums');
const { ACE, TWO, THREE, FOUR, FIVE, SIX, SEVEN, EIGHT, NINE, TEN, JACK, QUEEN,
        KING, JOKER } = require('./enums/nameEnums');

class card {
  constructor(name, suit, rank) {
    this.name = name;
    this.suit = suit;
    this.rank = rank;
    this.color = suit === CLUBS || suit === SPADES ? BLACK : RED;
  }

  toString() {
    let name = '';
    let suit = '';

    switch(this.name) {
      case ACE:
        name = 'Ace';
        break;
      case TWO:
        name = '2';
        break;
      case THREE:
        name = '3';
        break;
      case FOUR:
        name = '4';
        break;
      case FIVE:
        name = '5';
        break;
      case SIX:
        name = '6';
        break;
      case SEVEN:
        name = '7';
        break;
      case EIGHT:
        name = '8';
        break;
      case NINE:
        name = '9';
        break;
      case TEN:
        name = '10';
        break;
      case JACK:
        name = 'Jack';
        break;
      case QUEEN:
        name = 'Queen';
        break;
      case KING:
        name = 'King';
        break;
      case JOKER:
        name = 'Joker';
        break;
      default:
        throw 'something went wrong... card.js';
    }

    switch (this.suit) {
      case CLUBS:
        suit = 'Clubs';
        break;
      case DIAMONDS:
        suit = 'Diamonds';
        break;
      case HEARTS:
        suit = 'Hearts';
        break;
      case SPADES:
        suit = 'Spades';
        break;
      default:
        throw 'something\'s wrong: parsing suit ENUM';
    }

    return name + ' of ' + suit;
  }
};

module.exports = card;
