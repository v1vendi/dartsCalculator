function OnlinerRank() {    
    return this;
}

OnlinerRank.prototype.winnerRatingAddon = function (winnerRating, loserRating) {
    if(winnerRating - loserRating >= 100 ){
        return 0;
    }
    return Math.round((100 - winnerRating + loserRating) / 10);
}


OnlinerRank.prototype.loserRatingAddon = function (winnerRating, loserRating) {
    if (winnerRating - loserRating >= 100) {
        return 0;
    }
    return -Math.round((100 - winnerRating + loserRating) / 10);
}
