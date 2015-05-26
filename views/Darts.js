if (!Array.prototype.last) {
    Array.prototype.last = function () {
        return this[this.length - 1];
    }
}
Array.prototype.shuffle = function () {
    var i = this.length, j, temp;
    if (i == 0) return this;
    while (--i) {
        j = Math.floor(Math.random() * (i + 1));
        temp = this[i];
        this[i] = this[j];
        this[j] = temp;
    }
    return this;
}

function Game(players, container) {

    var game = this;

    this.players = players.slice().shuffle();
    this.currentPlayer = this.players[0];
    this.score = [];
    
    this.results = [];

    players.forEach(function (player, index) {
        game.score[player.name] = [301];
    });

    this.container = container;
}

Game.prototype.throw = function (score) {

    if (score != parseInt(score)) {
        alert('¬води только цифры, блеать');
        this.render();
        return;
    }

    var currentPlayerScores = this.score[this.currentPlayer.name];

    var lastScore = this.score[this.currentPlayer.name].last();

    if (lastScore < score) {
        currentPlayerScores.push(lastScore);
    } else {
        currentPlayerScores.push(lastScore - score);
    }

    if (this.currentPlayer === this.players.last()) {
        this.validateWinner();
    }

    var finishedPlayers = this.players.filter(function (player) {
        return !player.finished;
    });
    if (finishedPlayers.length <= 1) {
        this.endGame();
        return;
    }

    this.setNextPlayer();

    this.render();
}

Game.prototype.endGame = function () {
    var game = this;

    players.forEach(function (player) {
        game.updateRating(player);
    });

    game.score = [];
    game.render();
    renderPlayers();
};

Game.prototype.validateWinner = function () {
    var game = this;

    this.winners = this.players.filter(function (player) {
        return !player.finished && game.score[player.name].last() === 0;
    });

    this.winners.forEach(function (player) {

        player.finished = true;
        player.shots = game.score[player.name].length - 1;
    });

};

Game.prototype.updateRating = function (winner) {

    if (!winner.finished) {
        return;
    }

    var game = this;

    var losers = this.players.filter(function (player) {
        return (!player.finished || player.shots > winner.shots);
    });

    winnerRatingAddon = 0;

    losers.forEach(function (loser) {

        winnerRatingAddon += elo.winnerRatingAddon(winner.rating, loser.rating);

        loser.rating += elo.loserRatingAddon(winner.rating, loser.rating);
    });

    winner.rating += winnerRatingAddon;

};

Game.prototype.setNextPlayer = function () {

    var currentPlayerIndex = this.players.indexOf(this.currentPlayer);

    if (currentPlayerIndex === this.players.length - 1) {
        this.currentPlayer = this.players[0];
    } else {
        this.currentPlayer = this.players[currentPlayerIndex + 1];
    }

    if (this.currentPlayer.finished) {
        this.setNextPlayer();
    }
}

Game.prototype.render = function () {
    var game = this;

    var tableHeader = this.container.querySelector('thead tr');
    var tbody = this.container.querySelector('tbody');
    tableHeader.innerHTML = '';
    tbody.innerHTML = '';

    this.players.forEach(function (player) {

        var th = document.createElement('th');
        th.textContent = player.name;

        if (player === game.currentPlayer) {
            th.classList.add('active');
        }

        tableHeader.appendChild(th);
    });

    var firstPlayer = this.players[0];
    var rounds = this.score && this.score[firstPlayer.name] && this.score[firstPlayer.name].length;

    if (!rounds) {
        return;
    }

    for (var i = 0; i < rounds; i++) {
        var tr = document.createElement('tr');

        game.players.forEach(function (player) {
            var td = document.createElement('td');
            td.textContent = game.score[player.name][i];

            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    }
}