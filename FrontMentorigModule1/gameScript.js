var suits = ['Hearts', 'Clubs', 'Diamonds', 'Spades'],
    values = ['Ace', 'King', 'Queen', 'Jack', 'Ten',
    'Nine', 'Eight', 'Seven', 'Six', 'Five', 'Four', 'Three', 'Two'];

var textArea = document.getElementById('text-area'),
    newGameButton = document.getElementById('new-game-button'),
    hitButton = document.getElementById('hit-button'),
    stayButton = document.getElementById('stay-button');

var gameStarted = false,
    gameOver = false,
    playerWon = false,
    dealerCards = [],
    playerCards = [],
    dealerScore = 0,
    playerScore = 0,
    cardsDeck = [];

hitButton.style.display = 'none';
stayButton.style.display = 'none';
showStatus();

newGameButton.addEventListener('click', function () {
    gameStarted = true;
    gameOver = false;
    playerWon = false;

    newGameButton.style.display = 'none';
    hitButton.style.display = 'inline';
    stayButton.style.display = 'inline';

    cardsDeck = createCardsDeck();
    ShuffleCards();
    dealerCards = [getNextCard(), getNextCard()];
    playerCards = [getNextCard(), getNextCard()];
    showStatus();
});

hitButton.addEventListener('click', function () {
    playerCards.push(getNextCard());
    checkForEndOfGame();
    showStatus();
});

stayButton.addEventListener('click', function () {
    gameOver = true;
    checkForEndOfGame();
    showStatus();
});

function createCardsDeck()
{
    var deck = [];

    for (var i = 0; i < suits.length; i++) {
        for (var j = 0; j < values.length; j++) {
            var card = {
                suit: suits[i],
                value: values[j]
            };
            deck.push(card);
        }
    }
    return deck;
}

function getNextCard() {
    return cardsDeck.shift();
}

function showStatus() {
    if (!gameStarted)
    {
        textArea.innerText = 'Welcome to BlackJack!!!'
        return;
    }

    updateScores();
    
    if (playerScore == 21) {
        playerWon = true;
        gameOver = true;
    }


    var dealerCardString = '';
    for (var i = 0; i < dealerCards.length; i++) {
        dealerCardString += getCardName(dealerCards[i]) + '\n';
    }

    var playerCardString = '';
    for (var i = 0; i < playerCards.length; i++) {
        playerCardString += getCardName(playerCards[i]) + '\n';
    }

    textArea.innerText = 'Dealer has:\n' +
        dealerCardString +
        'score: ' + dealerScore + ')\n\n' +

        'Player has:\n' +
        playerCardString +
        'score: ' + playerScore + ')\n\n';

    if (gameOver)
    {
        if (playerWon) {
            textArea.innerText += '\n' + "YOU WIN!";
        }
        else {
            textArea.innerText += '\n' + "DEALER WINS!";
        }

        newGameButton.style.display = 'inline';
        hitButton.style.display = 'none';
        stayButton.style.display = 'none';
    }
}

function updateScores() {
    dealerScore = getScore(dealerCards);
    playerScore = getScore(playerCards);
}

function getScore(cards) {
    var result = 0;
    var hasAce = false;

    for (var i = 0; i < cards.length; i++) {
        var card = cards[i];
        result += getCardNumericValue(card);

        if (card.value === 'Ace') {
            hasAce = true;
        }
    }

    if (hasAce && result + 10 <= 21) {
        return result + 10;
    }

    return result;
}

function getCardNumericValue(card) {
    switch (card.value) {
        case 'Ace':
            return 1;
        case 'Two':
            return 2;
        case 'Three':
            return 3;
        case 'Four':
            return 4;
        case 'Five':
            return 5;
        case 'Six':
            return 6;
        case 'Seven':
            return 7;
        case 'Eight':
            return 8;
        case 'Nine':
            return 9;
        default:
            return 10;
    }
}

function checkForEndOfGame() {
    updateScores();

    if (gameOver)
    {
        while (dealerScore < playerScore &&
            playerScore <= 21 &&
            dealerScore <= 21) {
            dealerCards.push(getNextCard());
            updateScores();
        }
    }

    if (playerScore > 21) {
        gameOver = true;
        playerWon = false;
    }
    else if (dealerScore > 21) {
        gameOver = true;
        playerWon = true;
    }
    else if (gameOver) {
        if (playerScore > dealerScore) {
            playerWon = true;
        }
        else {
            playerWon = false;
        }
    }
}


function getCardName(card) {
    return card.value + ' of ' + card.suit;
}

function ShuffleCards() {
    for (var i = 0; i < cardsDeck.length; i++) {
        var randomIndex = Math.floor((Math.random() * cardsDeck.length));
        var temp = cardsDeck[randomIndex];
        cardsDeck[randomIndex] = cardsDeck[i];
        cardsDeck[i] = temp;
    }
}