export const onChangeGameScore = (gameId, event) => {
    return true;   
}

export const predictionResultWinnerEval = (game, prediction) => {
    let awayTeamWin = (game.awayTeam.score > game.homeTeam.score)
    let homeTeamWin = (game.awayTeam.score < game.homeTeam.score)
    let awayTeamPredictionWin = (prediction.awayTeam.score > prediction.homeTeam.score)
    let homeTeamPredictionWin = (prediction.awayTeam.score < prediction.homeTeam.score)
    if (awayTeamWin && awayTeamPredictionWin) return true;
    if (homeTeamWin && homeTeamPredictionWin) return true;
    return false;
}
export const predictionResultSpreadEval = (game, prediction) => {
    let awayTeamWin = (game.awayTeam.score > game.homeTeam.score)
    let homeTeamWin = (game.awayTeam.score < game.homeTeam.score)
    let awayTeamPredictionWin = (prediction.awayTeam.score > prediction.homeTeam.score)
    let homeTeamPredictionWin = (prediction.awayTeam.score < prediction.homeTeam.score)
    if (awayTeamWin && awayTeamPredictionWin) return true;
    if (homeTeamWin && homeTeamPredictionWin) return true;
    return false;
}

export const formatDate = (startDateTime) => {
    var gameDate = new Date(startDateTime);
    var options = { weekday: 'short', month: 'short', day: 'numeric', year: '2-digit', hour: 'numeric', minute: 'numeric', timeZoneName: 'short' };
    var newstartDateTime = gameDate.toLocaleString('en-US', options);
    return newstartDateTime;
  }