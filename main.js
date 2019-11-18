const Player = require('./player');
const Card = require('./card');
const Deck = require('./deck');
const Hand = require('./hand');

// enums
const { NORTH, EAST, SOUTH, WEST } = require('./enums/playerEnums');
const { CLUBS, DIAMONDS, HEARTS, SPADES } = require('./enums/suitEnums');
const { BLACK, RED } = require('./enums/colorEnums');
const { ACE, TWO, THREE, FOUR, FIVE, SIX, SEVEN, EIGHT, NINE, TEN, JACK, QUEEN,
        KING, JOKER } = require('./enums/nameEnums');

// create deck with Spades as trump suit as only non-defaults
const deck = new Deck({ trumps: SPADES });

// create four players
const table = [null];

// a place to store current trick
const trick = [null];

// helper function for printing messages
const enumToString = enumerated => {
  switch (enumerated) {
    case NORTH:
      return 'North';
      break;
    case EAST:
      return 'East';
      break;
    case SOUTH:
      return 'South';
      break;
    case WEST:
      return 'West';
      break;
    default:
      throw new Error('invalid enum');
  }
};

// helper to determine if a given hand is all spades
const isAllSpades = hand =>
  hand.cards.filter(card => card.suit === SPADES).length === hand.length;

// helper to determine if a card is playable
const isPlayable = (card, leading, leadSuit, allSpades, noLeadSuit) => {
  let suit = card.suit;

  if (allSpades) {
    return true;
  }

  // if leading
  if (leading) {
    // can play any suit except Spades unless Spades is broken
    return spadesBroken ? true : suit !== SPADES;
  }

  // otherwise must follow suit
  if (suit === leadSuit) {
    return true;
  }

  // unless hand doesn't contain lead suit
  return noLeadSuit;
};

const calculateScore = (tricksTaken, bid) => {
  // if bid not met, return negative 10 for each trick bid
  if (tricksTaken < bid) {
    return bid * -10;
  }

  // if bid met, return 10 for each trick bid plus one for every overtrick
  return bid * 10 + tricksTaken - bid;
};

// having trouble reading from the console in Node.js so this decisions array
// is a hack until I have a functioning program that can be spliced into an
// event-driven GUI on the client side
const decisions = [6, 7, 2, 0];
let nextDecision = 0;

// set NORTH as initial dealer
let dealer = NORTH;

// set spadesBroken to false
let spadesBroken = false;

// declare team tricks taken:
let nsTT = 0;
let ewTT = 0;

// declare team bid variables:
let nsBid = 0;
let ewBid = 0;

// declare place to store score:
let nsScore = 0;
let ewScore = 0;

table.push(new Player(NORTH, true));
table.push(new Player(EAST, false));
table.push(new Player(SOUTH, false));
table.push(new Player(WEST, false));

// shuffle deck
deck.shuffle();

// deal from deck
let nextPlayer = dealer === WEST ? NORTH : dealer + 1;
while (deck.draw.length > 0) {
  table[nextPlayer].hand.takeCard(deck.dealOne());
  nextPlayer = nextPlayer === WEST ? NORTH : nextPlayer + 1;
}

// bidding phase
for (let i = 0; i < 4; i++) {  // 4 is number of players
  // get next decision
  let nd = decisions[nextDecision++];

  // next player's turn
  console.log(enumToString(nextPlayer) + '\'s turn');

  // cannot blind nil on first turn, so just show cards
  console.log(table[nextPlayer].hand.toString());

  // simulate entering bids at the console
  console.log('\nEnter your bid:', nd + '\n');

  // store bid
  table[nextPlayer].bid = nd;

  // go around the table
  nextPlayer = nextPlayer === WEST ? NORTH : nextPlayer + 1;
}

// trick building phase
for (let i = 0; i < 13; i++) {  // 13 is number of tricks
  // each trick needs a winner
  let winner = null;
  // initialize trick array
  // like elsewhere in this code index 0 is null because my player enums
  // do not contain a zero (to avoid falsiness)
  const trick = [null];
  // which suit led the trick?
  let leadSuit;

  // for each trick all four players need to play a card
  for (let j = 0; j < 4; j++) {
    // realized I can't store decisions since the cards get shuffled so I'm
    // going to need to randomly pick a card and see if it's playable -- the
    // first player to go can play any card except Spades unless Spades is
    // broken -- an edge case is having all Spades, I suppose, but I've
    // never seen that in an actual game

    const hand = table[nextPlayer].hand;
    let card = {};
    // is this player leading the trick?
    let leading = j === 0;
    console.log(leading);
    // determine if hand contains only spades
    let allSpades = isAllSpades(hand);
    // flag for card-picking loop -- even the event-driven version would require
    // this in the case that a user picks an unplayable card or if I want to
    // highlight playable cards
    let playable = false;
    
    let noLeadSuit = (() => {
      let result;

      if (typeof leadSuit === 'undefined') {
        return null;
      }

      result = hand.cards.filter(card => card.suit === leadSuit);
      return result.length === 0;
    })();

    // randomly pick a card until it's playable
    while (!playable) {
      let nps = enumToString(nextPlayer);
      let randIdx = Math.floor(Math.random() * hand.cards.length);

      card = hand.cards[randIdx];
      console.log(nps, 'plays', card.toString() + '.');
      playable = isPlayable(card, leading, leadSuit, allSpades, noLeadSuit);
      if (!playable) {
        console.log(nps + '\'s card is not playable. Try again.\n');
      }
    }

    // if leading the trick establish leadSuit
    if (leading) {
      leadSuit = card.suit;
    }

    if(card.suit === SPADES) {
      spadesBroken = true;
    }

    // insert card into trick and take out of play
    trick[nextPlayer] = hand.playCard(card.name, card.suit);
    deck.discard(card.name, card.suit);

    // assign next player
    nextPlayer = nextPlayer === WEST ? NORTH : nextPlayer + 1;
  }

  // assign default winner
  winner = NORTH;
  // determine the winner
  for (let i = EAST; i <= WEST; i++) {
    const card1 = trick[winner];
    const card2 = trick[i];
      
    winner = deck.spadesCompare(card1, card2) > 0 ? winner : i;
  }

  // incremement winner's tricks taken field
  table[winner].tricksTaken++;
  nextPlayer = winner;

  // print a message indicating the winnder of the trick
  console.log('\n' + enumToString(winner), 'won the trick.');
  for (let i = NORTH; i <= WEST; i++) {
    console.log(enumToString(i) + ':', table[i].tricksTaken);
  }
}

ewTT = table[EAST].tricksTaken + table[WEST].tricksTaken;
nsTT = table[NORTH].tricksTaken + table[SOUTH].tricksTaken;
ewBids = table[EAST].bid + table[WEST].bid;
nsBids = table[NORTH].bid + table[SOUTH].bid;

ewScore = calculateScore(ewTT, ewBids);
nsScore = calculateScore(nsTT, nsBids);

console.log('North-South tricks taken:', nsTT);
console.log('East-West tricks taken:', ewTT);
console.log('North-South bid:', nsBids);
console.log('East-West bid:', ewBids);
console.log('North-South score:', nsScore);
console.log('East-West score:', ewScore);
