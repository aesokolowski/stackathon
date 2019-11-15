const { expect } = require('chai');
const deck = require('../deck');
const { CLUBS, DIAMONDS, HEARTS, SPADES } = require('../enums/suitEnums');
const { BLACK, RED } = require('../enums/colorEnums');
const { ACE, TWO, THREE, FOUR, FIVE, SIX, SEVEN, EIGHT, NINE, TEN, JACK, QUEEN,
        KING, JOKER } = require('../enums/nameEnums');

describe('deck class', () => {
    describe('constructor', () => {
    const thisDeck = new deck();
    const lowDeck = new deck({ aceHigh: false });

    it('creates proper deck using bridge rankings, for convention', () => {
      expect(thisDeck.draw[41].toString()).to.deep.equal('3 of Hearts');
      expect(thisDeck.draw[31].color).to.deep.equal(BLACK);
      expect(thisDeck.draw[1].color).to.deep.equal(RED);
    });
    it('aces can be high or low', () => {
      expect(thisDeck.draw[48].rank).to.deep.equal(14);
      expect(lowDeck.draw[48].rank).to.deep.equal(1);
    });
  });

  describe('shuffle -- note: this should fail every now and again', () => {
    const deck1 = new deck();
    const deck2 = new deck();
    let randIdx = Math.floor(Math.random() * 52);

    it('properly shuffles a deck', () => {
      deck1.shuffle();
      deck2.shuffle();

      expect(deck1.draw[randIdx].toString())
        .to.not.deep.equal(deck2.draw[randIdx].toString());
    });
    it('doesn\'t pass the above test because they\'re undefined', () => {
      expect(deck1.draw[randIdx].toString()).to.not.deep.equal(undefined);
      expect(deck2.draw[randIdx].toString()).to.not.deep.equal(undefined);
    }i);
  });
});
