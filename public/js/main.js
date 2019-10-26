var game;
var questionNumber;
var data;
var score;

var Config = {}

Config.getUrl = function() {
  return 'https://feelittrivia.herokuapp.com';
}

var XHR = {}

XHR.setCallback = function(callback) {
    this.xhttp = new XMLHttpRequest();
    var _self = this;
    this.xhttp.onreadystatechange = function() {
      if (_self.xhttp.readyState == 4 && _self.xhttp.status >= 200 && _self.xhttp.status <= 299) {
          console.log(_self);
        callback(_self.xhttp.responseText);
      }
    };
  }

XHR.POST = function(path, data, callback) {
    this.xhttp.open("POST", "https://cors-anywhere.herokuapp.com/" + Config.getUrl() + path, true);
    this.xhttp.setRequestHeader("X-Parse-Application-Id", "feelittrivia");
    this.xhttp.setRequestHeader("Content-type", "application/json");
    this.xhttp.send(JSON.stringify(data));
}

XHR.GET = function(path, callback) {
    this.xhttp.open("GET", "https://cors-anywhere.herokuapp.com/" + Config.getUrl() + path, true);
    this.xhttp.setRequestHeader("X-Parse-Application-Id", "feelittrivia");
    this.xhttp.setRequestHeader("Content-type", "application/json");
    this.xhttp.send();
}

var ParseRequest = {};

ParseRequest.getData = function() {
    XHR.setCallback(function(response){
        data = JSON.parse(response);
    });
    XHR.GET('/upload');
}


ParseRequest.postData = function(createUser) {
    XHR.setCallback(function(response){
        buildGame();
    });
    XHR.POST('/parse/classes/UsersData', createUser);
}

ParseRequest.postDataResult = function(createUser) {
    XHR.setCallback(function(response){
    });
    XHR.POST('/parse/classes/UsersDataResult', createUser);
}

function init() {
    data = [];
    game = 1;
    score = 0;
    questionNumber = 0;
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('phone').value = '';
    for(let i = 1; i < 4; i++) {
        document.getElementById('game' + i).classList.remove('show');
    }
    document.getElementById('game' + game).classList.add('show');
    ParseRequest.getData();
}
init();
document.getElementById('reset').addEventListener('click', function() {
    init();
});


document.getElementById('button-submit').addEventListener('click', function() {
    const createUser = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value
    };
    document.getElementById('name-info').innerHTML = createUser.name;
    document.getElementById('email-info').innerHTML = createUser.name;
    document.getElementById('phone-info').innerHTML = createUser.name;
    ParseRequest.postData(createUser);
});

function buildGame() {
    if(game === 1) {
        document.getElementById('game' + game).classList.remove('show');
        document.getElementById('game' + ++game).classList.add('show');
        loadQuestion();
        initEvents();
    }
}

function initEvents() {
    const cardAnswer = document.getElementsByClassName('card-answer');
    for(let i = 0; i < cardAnswer.length; i++) {
        cardAnswer[i].addEventListener('click', function() {
            const cardAnswer = document.getElementsByClassName('card-answer');
            for(let i = 0; i < cardAnswer.length; i++) {
                cardAnswer[i].classList.remove('active');
            }
            this.classList.add('active');
        });
    }
    const next = document.getElementById('button-next');
    next.addEventListener('click', function() {
        if(questionNumber < 10) {
            const answer = document.querySelectorAll('.card-answer.active label')[0].innerHTML;
            const answerActive = document.querySelectorAll('.card-answer.active')[0];
            if(answer === data[questionNumber].correctAnswer) {
                score++;
                answerActive.classList.add('true');
            } else {
                debugger;
                answerActive.classList.add('false');
                const cards = document.querySelectorAll('.card-answer');
                for(let i = 0; i < cards.length; i++) {
                    if(cards[i].querySelectorAll('label')[0].innerHTML === data[questionNumber].correctAnswer) {
                        cards[i].classList.add('correct');
                    }
                }
            }
            questionNumber++;
            setTimeout(() => {
                if(document.getElementsByClassName('correct').length > 0) {
                    document.getElementsByClassName('correct')[0].classList.remove('correct');
                }
                answerActive.classList.remove('true');
                answerActive.classList.remove('false');
                answerActive.classList.remove('active');
                if(questionNumber < 10) {
                    loadQuestion();
                } else {
                    finishGame();
                }
            }, 1000);
        }        
    });
}
function loadQuestion() {
    document.getElementById('progress').innerHTML = score + '/' + questionNumber;
    const label = document.querySelectorAll('.card-answer label');
    for( let i = 0; i < 4 ; i++) {
        label[i].innerHTML = data[questionNumber].answers[i];
    }
    document.getElementById('question').innerHTML = data[questionNumber].question + ' ?';
}

function finishGame() {
    const createUser = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        score: score
    };
    document.getElementById('score-info').innerHTML = score + ' / 10' ;
    document.getElementById('email-info').innerHTML = createUser.name;
    document.getElementById('phone-info').innerHTML = createUser.name;
    ParseRequest.postDataResult(createUser);
    document.getElementById('game2').classList.remove('show');
    document.getElementById('game3').classList.add('show');
    
}

