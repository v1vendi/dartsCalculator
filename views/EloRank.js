﻿function EloRank(k) {
    
    if (!(this instanceof EloRank))
        return new EloRank(k);
    
    this.k = k || 32;
    return this;
}

EloRank.prototype.setKFactor = function (n) {
    this.k = n;
}

EloRank.prototype.getKFactor = function () {
    return this.k;
}

EloRank.prototype.getExpected = function (a, b) {
    return 1 / (1 + Math.pow(10, ((b - a) / 400)));
}

EloRank.prototype.updateRating = function (expected, actual, current) {
    return current + this.k * (actual - expected);
}

EloRank.prototype.updateRatings = function (winner, loser) {
    var expW = this.getExpected(winner.rating, loser.rating);
    var expL = this.getExpected(loser.rating, winner.rating);

    winner.rating = this.updateRating(expW, 1, winner.rating);
    loser.rating = this.updateRating(expL, 0, loser.rating);
}