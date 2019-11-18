const { expect } = require('chai');
const Card = require('../card');
const { CLUBS, DIAMONDS, HEARTS, SPADES } = require('../enums/suitEnums');
const { BLACK, RED } = require('../enums/colorEnums');
const { ACE, TWO, THREE, FOUR, FIVE, SIX, SEVEN, EIGHT, NINE, TEN, JACK, QUEEN,
        KING, JOKER } = require('../enums/nameEnums');

describe('card class', () => {
  describe('constructor', () => {
    const newCard = new Card(KING, CLUBS, 13);

    it('creates a proper card object', () => {
      expect(newCard.name).to.deep.equal(KING);
      expect(newCard.suit).to.deep.equal(CLUBS);
      expect(newCard.rank).to.deep.equal(13);
    });
    it('has a proper toString method', () => {
      expect(newCard.toString()).to.deep.equal('King of Clubs');
    });
    it('knows what color a given suit is', () => {
      expect(newCard.color).to.deep.equal(BLACK);
    });
  });
});
