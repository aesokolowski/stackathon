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
    });
  });

  describe('compare with no options', () => {
    const plainDeck = new deck();
    plainDeck.draw.forEach((card, idx) => console.log(idx, card.toString()));

    it('6 of Diamonds should beat 2 of Spades', () => {
      expect(plainDeck.compare(plainDeck.draw[30], plainDeck.draw[44]))
        .to.be.above(0);
     
    });
    it('Jack of Hearts should beat 6 of Diamonds', () => {
      expect(plainDeck.compare(plainDeck.draw[30], plainDeck.draw[9]))
        .to.be.below(0);
    });
    it('9 of Spades should be considered equal to 9 of Diamonds', () => {
      expect(plainDeck.compare(plainDeck.draw[16], plainDeck.draw[18]))
        .to.deep.equal(0);
    }); 
  });

  describe('compare with lowball option', () => {
    const lowDeck = new deck({ lowball: true });

    it('6 of Diamonds should lose to 2 of Spades', () => {
      expect(lowDeck.compare(lowDeck.draw[30], lowDeck.draw[44]))
        .to.be.below(0);
     
    });
    it('Jack of Hearts should lose to 6 of Diamonds', () => {
      expect(lowDeck.compare(lowDeck.draw[30], lowDeck.draw[9]))
        .to.be.above(0);
    });
    it('9 of Spades should be considered equal to 9 of Diamonds', () => {
      expect(lowDeck.compare(lowDeck.draw[16], lowDeck.draw[18]))
        .to.deep.equal(0);
    });    
  });

  describe('compare with trumps option', () => {
    const trumpsDeck = new deck({ trumps: SPADES });

    it('6 of Diamonds should lose to 2 of Spades', () => {
      expect(trumpsDeck.compare(trumpsDeck.draw[30], trumpsDeck.draw[44]))
        .to.be.below(0);
    });
    it('Jack of Hearts should beat 6 of Diamonds', () => {
      expect(trumpsDeck.compare(trumpsDeck.draw[30], trumpsDeck.draw[9]))
        .to.be.below(0);
    });
    it('9 of Spades should beat 9 of Diamonds', () => {
      expect(trumpsDeck.compare(trumpsDeck.draw[16], trumpsDeck.draw[18]))
        .to.be.above(0);
    });
  });

  describe('dealOne', () => {
    const myDeck = new deck();

    it('returns the "top" card (last in the array)', () => {
      expect(myDeck.dealOne().toString()).to.deep.equal('Ace of Clubs');
      expect(myDeck.dealOne().toString()).to.deep.equal('Ace of Diamonds');
    });
    it('moves the cards from "draw" to "inPlay"', () => {
      expect(myDeck.inPlay.length).to.deep.equal(2);
      expect(myDeck.draw.length).to.deep.equal(50);
    });
  });

  describe('discard', () => {
    const myDeck = new deck();

    const card1 = myDeck.dealOne();
    const card2 = myDeck.dealOne();

    console.dir(card1);

    console.log('myDeck.draw.length:', myDeck.draw.length);
    console.log('myDeck.inPlay.length:', myDeck.inPlay.length);

    it('moves a card from "inPlay" to "discard"', () => {
      myDeck.discard(card1.name, card1.suit);
      myDeck.discard(card2.name, card2.suit);

      expect(myDeck.discarded.length).to.deep.equal(2);
      expect(myDeck.inPlay.length).to.deep.equal(0);
    });
  });
});
