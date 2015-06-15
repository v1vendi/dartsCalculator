function Darts(players, container, scoreToWin, straightOut) {
    
    var game = this;
    
    scoreToWin = scoreToWin || 301;
    
    game.straightOut = straightOut === false ? false : true;
    
    game.players = players.map(function (p) {
        return new Darts.Player(game, p, scoreToWin);
    });
    
    game.currentPlayer = this.players[0];
    
    game.turnsCount = 1;
    game.container = container;
}

Darts.Player = function (game, player, score) {
    
    this.game = game;
    this.name = player.name;
    this.score = score;
    this.scoreHistory = [score];
    
    this.checkedOut = false;
    this.turn = [];
    this.turnsCount = 0;
}

Darts.Player.prototype.shoot = function (score, sector) {
    
    var player = this;
    
    var shotScore = score * sector;
    
    if (score !== parseInt(score)) {
        alert('Вводи только цифры, блеать');
        return Darts.shotResults.mistake;
    }
    
    if (score > 20 && score !== 25) {
        alert('Не пизди, блеать');
        return Darts.shotResults.mistake;
    }
    
    var turnScore = shotScore;
    
    player.turn.forEach(function (shot) {
        turnScore += shot;
    });
    
    if (player.score < turnScore) {
        
        player.scoreHistory.push('-');
        player.turn.length = 0;
        return Darts.shotResults.bust;
    }
    
    if (!player.game.straightOut && player.score - turnScore === 1) {
        
        player.scoreHistory.push('-');
        player.turn.length = 0;
        return Darts.shotResults.bust;
    }
    
    player.turn.push(shotScore);
    
    if (player.score === turnScore) {
        player.score = 0;
        player.checkedOut = true;
        player.scoreHistory.push(0);
        player.turn.length = 0;
        player.turnsCount++;
        
        return Darts.shotResults.checkOut;
    }
    
    if (player.turn.length === 3) {
        player.score -= turnScore;
        player.scoreHistory.push(player.score);
        player.turn.length = 0;
        player.turnsCount++;
        return Darts.shotResults.endTurn;
    }
    
    return Darts.shotResults.ok;
}

Darts.sector = {
    'single': 1,
    'double': 2, 
    'triple': 3
}

Darts.shotResults = {
    mistake: 2,
    bust: -1,
    ok: 0,
    checkOut: 1,
    endTurn: 3
}

Darts.prototype.throw = function (score, sector) {
    
    var game = this;

    sector = sector || Darts.sector.single;
    
    var shotResult = game.currentPlayer.shoot(score, sector);
    
    var remainingPlayers = game.players.filter(function (player) {
        return !player.checkedOut;
    });
    
    if (shotResult === Darts.shotResults.checkOut || shotResult === Darts.shotResults.endTurn || shotResult === Darts.shotResults.bust) {

        if (remainingPlayers.length <= 1 && game.currentPlayer === remainingPlayers[remainingPlayers.length -1]) {
            
            game.render();
            game.endGame();
            return;
        }        
        
        if (game.currentPlayer === remainingPlayers[0]) {
            game.turnsCount++;
        }

        game.setNextPlayer();
    }
    
    game.render();
}

Darts.prototype.endGame = function () {
    var game = this;
    
    if (window.confirm('Закончили?')) {
        
        var endGameEvent = new CustomEvent('gameEnd', {
            detail: {
                results: game.players
            }
        });
        document.dispatchEvent(endGameEvent);
    }
};

Darts.prototype.setNextPlayer = function () {
    
    var game = this;

    var currentPlayerIndex = game.players.indexOf(game.currentPlayer);
    
    if (currentPlayerIndex === game.players.length - 1) {
        game.currentPlayer = game.players[0];

    } else {
        game.currentPlayer = game.players[currentPlayerIndex + 1];
    }
    
    if (game.currentPlayer.checkedOut) {
        game.setNextPlayer();
    }
}

Darts.prototype.render = function (renderBody) {
    var game = this;
    
    var tableHeader = this.container.querySelector('thead tr');
    var tbody = this.container.querySelector('tbody');
    tableHeader.innerHTML = '';
    tbody.innerHTML = '';
    
    this.players.forEach(function (player) {
        
        var th = document.createElement('th');
        th.textContent = player.name;
        
        if (player === game.currentPlayer) {
            th.classList.add('info');
        }
        
        tableHeader.appendChild(th);
    });

    if (renderBody) {
        var rounds = this.turnsCount;


        for (var i = 0; i < rounds; i++) {
            var tr = document.createElement('tr');

            game.players.forEach(function(player) {
                var td = document.createElement('td');
                td.textContent = player.scoreHistory[i];

                tr.appendChild(td);
            });

            tbody.appendChild(tr);
        }
    }

    var tableFooter = this.container.querySelector('tfoot tr');
    tableFooter.classList.add('active');

    tableFooter.innerHTML = "";
    
    game.players.forEach(function (player) {
        
        var turnScore = 0;
        player.turn.forEach(function(t) {
            turnScore += t;
        });
        
        var currentScore = player.score - turnScore;
        
        var th = document.createElement('th');
        th.textContent = currentScore;
        
        tableFooter.appendChild(th);
    });
    
}