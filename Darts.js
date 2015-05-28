﻿function Game(players, container) {

    var game = this;

    this.players = players.slice().shuffle();
    this.currentPlayer = this.players[0];
    this.score = [];
    
    this.finished = false;

    players.forEach(function (player, index) {
        game.score[player.name] = [301];
    });

    this.container = container;
}

Game.prototype.throw = function (score) {

    if (score != parseInt(score)) {
        alert('Вводи только цифры, блеать');
        this.render();
        return;
    }

    if (score > 180) {
        alert('Не пизди, блеать');
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

    if (window.confirm('Закончили?')) {
        game.finished = true;

        var endGameEvent = new CustomEvent('gameEnd', {
            detail: {
                results: game.players
            }
        });
        document.dispatchEvent(endGameEvent);
    }
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