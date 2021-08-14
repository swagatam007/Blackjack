let BlackJackGame={
    'you': {'scorespan': '#your_result', 'div':'#your_box', 'score':0},
    'dealer': {'scorespan': '#dealer_result', 'div':'#dealer_box', 'score':0},
    'cards':['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'],
    'cardsmap': {'2':2, '3':3, '4':4, '5':5, '6':6, '7':7, '8':8, '9':9, '10':10, 'J':10, 'Q':10, 'K':10, 'A':[1, 11]},
    'wins':0,
    'losses':0,
    'draws':0,
    'isstand':false,
    'turnover':false,
};

const YOU=BlackJackGame['you'];
const DEALER=BlackJackGame['dealer'];

const Hitsound= new Audio('sounds/swish.m4a');
const winsound= new Audio('sounds/cash.mp3');
const losssound= new Audio('sounds/aww.mp3');
const drawsound= new Audio('sounds/draw.wav');
const resetsound= new Audio('sounds/reset.mp3');


document.querySelector('#hit_button').addEventListener('click', Blackjackhit);
document.querySelector('#stand_button').addEventListener('click', Blackjackstand);
document.querySelector('#reset_button').addEventListener('click', Blackjackreset);

function Blackjackhit(){
    if(BlackJackGame['isstand']===false){
        let card= randomCard()
        showCard(card,YOU);
        updateScore(card,YOU);
        showScore(YOU);
    }
}

function randomCard(){
    cardIndex=Math.floor(Math.random()*13);
    return BlackJackGame['cards'][cardIndex];
}

function showCard(card,player){
    if(player['score']<=21){
        let cardImage=document.createElement('img');
        cardImage.src=`images/${card}.png`;
        document.querySelector(player['div']).appendChild(cardImage);
        Hitsound.play();
    }
}

function Blackjackreset(){
    if(BlackJackGame['turnover']===true){
        BlackJackGame['isstand']=false;
        let yourImage= document.querySelector('#your_box').querySelectorAll('img');
        let dealerImage= document.querySelector('#dealer_box').querySelectorAll('img');

        for(i=0;i<yourImage.length;i++){
            yourImage[i].remove();
        }
        for(i=0;i<dealerImage.length;i++){
            dealerImage[i].remove();
        }
        YOU['score']=0;
        DEALER['score']=0;
        document.querySelector('#your_result').textContent=0;
        document.querySelector('#dealer_result').textContent=0;
        document.querySelector('#your_result').style.color='white';
        document.querySelector('#dealer_result').style.color='white';

        document.querySelector('#result').textContent=`Hey!! Come on Let's Play`;
        document.querySelector('#result').style.color='black';
        BlackJackGame['turnover']=false;
        resetsound.play();
    }
}

function updateScore(card,player){
    if(card==='A'){
        if(player['score']+ BlackJackGame['cardsmap'][card][1]<=21){
            player['score'] += BlackJackGame['cardsmap'][card][1];
        }
        else{
            player['score'] += BlackJackGame['cardsmap'][card][0];
        }
    }
    else{
        player['score'] += BlackJackGame['cardsmap'][card];
    }
}

function showScore(player){
    if(player['score']>21){
        document.querySelector(player['scorespan']).textContent='BUST';
        document.querySelector(player['scorespan']).style.color='red';
    }
    else{
        document.querySelector(player['scorespan']).textContent=player['score'];
    }
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve,ms));
}

async function Blackjackstand(){
    BlackJackGame['isstand']=true;
    while(DEALER['score']<16 && BlackJackGame['isstand']===true){
        let card=randomCard();
        showCard(card, DEALER);
        updateScore(card, DEALER);
        showScore(DEALER);
        await sleep(1000);
    }
    BlackJackGame['turnover']=true;
    let winner=computeWinner();
    showResult(winner);
    
}

function computeWinner(){
    let winner;
    if(YOU['score']<=21){
        if(YOU['score']>DEALER['score'] || DEALER['score']>21){
            winner=YOU;
            BlackJackGame['wins']++;
        }
        else if(YOU['score']<DEALER['score']){
            winner=DEALER;
            BlackJackGame['losses']++;
        }
        else if(YOU['score']===DEALER['score']){
            BlackJackGame['draws']++;
        }
    }
    else if(DEALER['score']<=21){
        winner=DEALER;
        BlackJackGame['losses']++;
    }
    else if(DEALER['score']>21)
    {
        BlackJackGame['draws']++;
    }
    return winner;
}

function showResult(winner){
    let message, messagecolor;
    if(BlackJackGame['turnover']===true){
        if(winner===YOU){
            document.querySelector('#wins').textContent=BlackJackGame['wins'];
            message='Congratulations!!! YOU WON!!';
            messagecolor= 'yellow';
            winsound.play();
        }
        else if(winner===DEALER){
            document.querySelector('#losses').textContent=BlackJackGame['losses'];
            message='OOOPSSS!!! YOU LOST!!';
            messagecolor= 'red';
            losssound.play();
        }
        else{
            document.querySelector('#draws').textContent=BlackJackGame['draws'];
            message='OOOOOOOHHHHHHHHH!!! YOU DREW!!';
            messagecolor= 'white';
            drawsound.play();
        }

        document.querySelector('#result').textContent=message;
        document.querySelector('#result').style.color=messagecolor;
    }
}