const { expect } = require('chai');
const Deck = require('../deck');

// enums
const { CLUBS, DIAMONDS, HEARTS, SPADES } = require('../enums/suitEnums');
const { BLACK, RED } = require('../enums/colorEnums');
const { ACE, TWO, THREE, FOUR, FIVE, SIX, SEVEN, EIGHT, NINE, TEN, JACK, QUEEN,
        KING, JOKER } = require('../enums/nameEnums');

describe('deck class', () => {
  describe('constructor', () => {
    const thisDeck = new Deck();
    const lowDeck = new Deck({ aceHigh: false });

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
    const deck1 = new Deck();
    const deck2 = new Deck();
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
    const plainDeck = new Deck();
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
    const lowDeck = new Deck({ lowball: true });

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
    const trumpsDeck = new Deck({ trumps: SPADES });

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
    const myDeck = new Deck();

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
    const myDeck = new Deck();

    const card1 = myDeck.dealOne();
    const card2 = myDeck.dealOne();

    it('moves a card from "inPlay" to "discard"', () => {
      myDeck.discard(card1.name, card1.suit);
      myDeck.discard(card2.name, card2.suit);

      expect(myDeck.discarded.length).to.deep.equal(2);
      expect(myDeck.inPlay.length).to.deep.equal(0);
    });
  });

  describe('spadesCompare <leading card> / <following card>  : <result>',
      () => {
    const spadesDeck = new Deck({ trumps: SPADES });

    it('Jack of Diamonds/Queen of Clubs: lead wins', () => {
      expect(spadesDeck.spadesCompare(spadesDeck.draw[10], spadesDeck.draw[7]))
        .to.be.above(0);
    });
    it('Queens of Clubs/Jack of Diamonds: lead wins', () => {
      expect(spadesDeck.spadesCompare(spadesDeck.draw[7], spadesDeck.draw[10]))
        .to.be.above(0);
    });
    it('9 of Spades/Ace of Diamonds: lead wins', () => {
      expect(spadesDeck.spadesCompare(spadesDeck.draw[16], spadesDeck.draw[50]))
        .to.be.above(0);
    });
    it('Ace of Diamonds/9 of Spades: lead loses', () => {
      expect(spadesDeck.spadesCompare(spadesDeck.draw[50], spadesDeck.draw[16]))
        .to.be.below(0);
    });
    it('7 of Spades/2 of Spades: lead wins', () => {
      expect(spadesDeck.spadesCompare(spadesDeck.draw[24], spadesDeck.draw[44]))
        .to.be.above(0);
    });
    it('2 of Spades/7 of Spades: lead loses', () => {
      expect(spadesDeck.spadesCompare(spadesDeck.draw[24], spadesDeck.draw[44]))
        .to.be.above(0);
    });
    it('5 of Hearts/3 of Hearts: lead wins', () => {
      expect(spadesDeck.spadesCompare(spadesDeck.draw[33], spadesDeck.draw[41]))
        .to.be.above(0);
    });
    it('3 of Hearts/5 of Hearts: lead loses', () => {
      expect(spadesDeck.spadesCompare(spadesDeck.draw[33], spadesDeck.draw[41]))
        .to.be.above(0);
    });
  });
});
