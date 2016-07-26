// 1. When the user clicks deal, deal.
var theDeck =[];
var playersHand = [];
var dealersHand = [];
var topOfTheDeck = 4;

$(document).ready(function(){

	$('.deal-button').click(function(){
		createDeck(); //Run a function that creates an array of 1H-13C
		shuffleDeck(); //Shuffle the deck!
		console.log(theDeck);

		//Push onto the playersHand array, the new card. Then place it in the DOM.
		setTimeout(function(){
			playersHand.push(theDeck[0]);
			placeCard('player', 'one', theDeck[0]);
		}, 1000);

		setTimeout(function(){
			dealersHand.push(theDeck[1]);
			placeCard('dealer', 'one', theDeck[1]);
			dealersHand.push(theDeck[3]);
			// don't display the second card yet
		}, 2000);

		setTimeout(function(){
			playersHand.push(theDeck[2]);
			placeCard('player', 'two', theDeck[2]);
			calculateTotal(playersHand,'player');
		}, 3000);
	});

	$('.hit-button').click(function(){
		if (playersHand.length < 3) {
			placeCard('dealer', 'two', theDeck[3]);
			calculateTotal(dealersHand,'dealer');
		}

		var slotForNewCard = '';
		if(playersHand.length == 2){slotForNewCard = "three";}
		else if(playersHand.length == 3){slotForNewCard = "four";}
		else if(playersHand.length == 4){slotForNewCard = "five";}
		else if(playersHand.length == 5){slotForNewCard = "six";}
		placeCard('player', slotForNewCard, theDeck[topOfTheDeck]);
		playersHand.push(theDeck[topOfTheDeck]);
		calculateTotal(playersHand, 'player');
		topOfTheDeck++;
		checkWin();
	});

	$('.stand-button').click(function(){
		//Player clicked on stand. What happens to the player? Nothing.
		if (playersHand.length < 3) {
			placeCard('dealer', 'two', theDeck[3]);
			calculateTotal(dealersHand, 'dealer');
		}

		var slotForNewCard = "";
		var dealerTotal = calculateTotal(dealersHand, 'dealer');
		while(dealerTotal < 17){
			// Dealer has less than 17. Hit away!
			if(dealersHand.length == 2){slotForNewCard = "three";}
			else if(dealersHand.length == 3){slotForNewCard = "four";}
			else if(dealersHand.length == 4){slotForNewCard = "five";}
			else if(dealersHand.length == 5){slotForNewCard = "six";}
			placeCard('dealer',slotForNewCard,theDeck[topOfTheDeck]);
			dealersHand.push(theDeck[topOfTheDeck]);
			dealerTotal = calculateTotal(dealersHand, 'dealer');
			topOfTheDeck++;
		}

		// Dealer has at least 17.
		// Check to see who won.
		checkWin();
	});

});

function checkWin(){
	var playerTotal = Number($('.player-total-number').html());
	var dealerTotal = Number($('.dealer-total-number').html());
	if (playerTotal > 21 && dealerTotal < 21) {
		alert("You busted!");
	} else if (playerTotal < 21 && dealerTotal > 21){
		alert("The dealer busted!");
	} else if (playerTotal === 21 && dealerTotal < 21){
		alert("You beat the dealer to 21!");
	} else if (playerTotal < 21 && dealerTotal === 21){
		alert("The dealer beat you to 21!")
	} else if (playersHand.length > 5){
		alert("It's a push!");
	}
}

function placeCard(who, where, cardToPlace){
	var classSelector = '.'+who+'-cards .card-'+where;
	// Write logic to fix the 11, 12, 13 issue
	var i = 0;
	var cardRank = '';
	var cardSuit = '';
	while (i < cardToPlace.length-1 ){
		cardRank += cardToPlace[i];
		i++;
	} while (i < cardToPlace.length){
		cardSuit += cardToPlace[i];
		i++;
	}

	if (parseInt(cardRank) === 11){
		cardRank = "J";
		cardToPlace = cardRank + cardSuit;
		console.log("placing a " + cardToPlace);
	} else if (parseInt(cardRank) === 12){
		cardRank = "Q";
		cardToPlace = cardRank + cardSuit;
		console.log("placing a " + cardToPlace);
	} else if (parseInt(cardRank) === 13){
		cardRank = "K";
		cardToPlace = cardRank + cardSuit;
		console.log("placing a " + cardToPlace);
	}

	$(classSelector).html(cardToPlace);
}

function createDeck(){
	// - 52 cards
	// - 4 suits
	// 	- h, s, d, c
	var suits = ['h','s','d','c'];
	for(s=0; s<suits.length; s++){
		for(c=1; c<=13; c++){
			theDeck.push(c+suits[s]);
		}
	}
}

function shuffleDeck(){
// [1]
// [2]
// [3]
// ...
// [50]
// [51]
// [52]

	for(var i=1; i<1000; i++){
		card1 = Math.floor(Math.random() * theDeck.length);
		card2 = Math.floor(Math.random() * theDeck.length);
		var temp = theDeck[card1];
		theDeck[card1] = theDeck[card2];
		theDeck[card2] = temp;
	}
	// console.log(theDeck);
}

function calculateTotal(hand, whosTurn){
	console.log(hand);
	console.log(whosTurn);
	var total = 0;
	var cardValue = 0;
	for(var i = 0; i<hand.length; i++){
		cardValue = Number(hand[i].slice(0,-1));
		total += cardValue;
	}

	// Update the HTML with the new total
	var elementToUpdate = '.'+whosTurn+'-total-number';
	$(elementToUpdate).text(total);
	
	return total;
}