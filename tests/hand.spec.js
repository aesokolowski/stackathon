const { expect } = require('chai');
const Deck = require('../deck');
const Hand = require('../hand');

// enums
const { CLUBS, DIAMONDS, HEARTS, SPADES } = require('../enums/suitEnums');
const { BLACK, RED } = require('../enums/colorEnums');
const { ACE, TWO, THREE, FOUR, FIVE, SIX, SEVEN, EIGHT, NINE, TEN, JACK, QUEEN,
        KING, JOKER } = require('../enums/nameEnums');

describe('hand class', () => {
  describe('constructor', () => {
    const hand = new Hand();

    it('initializes an empty array', () => {
      expect(hand.cards).to.deep.equal([]);
    });
  });

  describe('takeCard and playCard', () => {
    const deck = new Deck();
    const hand = new Hand();

    it('takeCard can take hands that are dealt to it', () => {
      for (let i = 0; i < 5; i++) {
        hand.takeCard(deck.dealOne());
      }

      expect(hand.cards.length).to.deep.equal(5);
    });

    it('playCard returns the wanted card', () => {
      const card = hand.playCard(ACE, SPADES);

      deck.discard(card.name, card.suit);
      expect(hand.cards.length).to.deep.equal(4);
      expect(card.toString()).to.deep.equal('Ace of Spades');
    });
  });
});
