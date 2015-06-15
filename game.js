﻿var game;
var elo = new OnlinerRank();

function Player(playerModel) {
    this.name = playerModel.name;
    this.rating = playerModel.rating || 1000;
}

var players = loadPlayers().orderBy('rating', true);

window.onload = renderPlayers;

function renderPlayers() {
    
    var playersList = document.getElementById('playersList');
    playersList.innerHTML = '';
    
    var t = document.getElementById('playerTemplate');
    
    players.forEach(function (player) {
        var clone = document.importNode(t.content, true);
        var label = clone.querySelector('label');
        label.innerHTML += player.name + ' <span class=badge>' + player.rating + '</span>';
        
        var li = document.createElement('li');
        li.id = player.name;
        
        li.appendChild(clone);
        
        playersList.appendChild(li);
    });
}

function loadPlayers() {
    var playersModel = JSON.parse(window.localStorage.getItem('dartsPlayers')) || [];
    
    return playersModel.map(function (p) {
        return new Player(p);
    });
}

function savePlayers(players) {
    var data = players.map(function (player) {
        return {
            name: player.name,
            rating: player.rating
        };
    });
    window.localStorage.setItem('dartsPlayers', JSON.stringify(data));
}

function startNewGame() {
    var selectedPlayers = players.filter(function (player) {
        
        var node = document.getElementById(player.name);
        
        return node.querySelector('input[type=checkbox]').checked;
    }).shuffle();
    
    var gameTable = document.getElementById('gameTable');
    
    game = new Darts(selectedPlayers, gameTable);
    
    document.getElementById('players').style.display = 'none';
    
    document.getElementById('game').style.display = 'block';
    document.getElementById('shotForm').style.display = 'block';
    
    game.render();
    renderScoreButtons();

    document.addEventListener('scroll', function() {
        document.getElementById('game').style.top = document.body.scrollTop;
    });

    document.addEventListener('gameEnd', function (e) {
        var results = e.detail.results;
        
        var ratingDiffs = {};

        results.forEach(function (playerResult) {
            ratingDiffs[playerResult.name] = getRatingAddon(playerResult, results);
        });
        
        players.forEach(function (player) {
            if (ratingDiffs[player.name]) {
                player.rating += ratingDiffs[player.name];
            }
        });
        
        players.orderBy('rating', true);
        
        savePlayers(players);
        renderPlayers();
        
        document.getElementById('game').style.display = 'none';
        document.getElementById('shotForm').style.display = 'none';
        document.getElementById('players').style.display = 'block';
    });
};

function addPlayer() {
    var name = document.getElementById('newPlayer').value;
    
    var newPlayer = new Player({
        name: name,
        rating: 1000
    });
    
    players.push(newPlayer);
    players.orderBy('rating', true);
    
    savePlayers(players);
    renderPlayers();
    
    document.getElementById('newPlayer').value = "";
}

function endGame() {
    game.endGame();
}

function getRatingAddon(currentPlayerResult, gameResults) {
    
    if (!currentPlayerResult.checkedOut) {
        return;
    }
    
    var currentPlayer = players.find(where({
        name: currentPlayerResult.name
    }));
    
    var winnerResults = gameResults.filter(function (playerResult) {
        return (playerResult.checkedOut && playerResult.turnsCount < currentPlayerResult.turnsCount);
    });
    
    var loserResults = gameResults.filter(function (playerResult) {
        return (!playerResult.checkedOut || playerResult.turnsCount > currentPlayerResult.turnsCount);
    });
    
    var winners = players.filter(function (player) {
        return winnerResults.some(where({
            name: player.name
        }));
    });
    
    var losers = players.filter(function (player) {
        return loserResults.some(where({
            name: player.name
        }));
    });
    
    var userRatingAddon = 0;
    
    losers.forEach(function (loser) {
        
        userRatingAddon += elo.winnerRatingAddon(currentPlayer.rating, loser.rating);
    });
    
    winners.forEach(function (winner) {
        
        userRatingAddon += elo.loserRatingAddon(winner.rating, currentPlayer.rating);
    });
    
    return userRatingAddon;

};

function renderScoreButtons() {
    var prefix = ['S', 'D', 'T'];
    var table = document.querySelector('#shotForm table');
    table.innerHTML = "";
    var tr, td;
    
    for (var i = 1; i <= 20; i++) {
        tr = document.createElement('tr');
        
        for (var j = 1; j <= 3; j++) {
            td = document.createElement('td');
            
            td.appendChild(getShootButton(game, i, j, prefix[j - 1] + i));
            
            tr.appendChild(td);
        }
        
        table.appendChild(tr);
    }
    
    
    tr = document.createElement('tr');
    
    td = document.createElement('td');
    td.appendChild(getShootButton(game, 25, 1, '25'));
    tr.appendChild(td);
    
    td = document.createElement('td');
    td.appendChild(getShootButton(game, 25, 2, '50'));
    tr.appendChild(td);
    
    td = document.createElement('td');
    td.appendChild(getShootButton(game, 0, 1, '0'));
    tr.appendChild(td);
    
    table.appendChild(tr);

}

function getShootButton(game, score, sector, name) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.classList.add('btn', 'btn-default', 'btn-sm');
    btn.style.display = 'block';
    btn.textContent = name;
    
    btn.onclick = function () {
        game.throw(score, sector);
    };
    
    return btn;
}