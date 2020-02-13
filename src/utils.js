export const onChangeGameScore = (gameId, event) => {
    return true;   
}

export const submitPrediction = async (gameId) => {
  const game = this.state.games[gameId]

  try {
    let userSession = await Auth.currentSession();
    if (!userSession) {
      console.log('no user session')
      return { errorMessage: 'Please log in again and resubmit.' }
    }
    const { sport, year, season, gameWeek } = game;
    const gamePredictions = this.state.gamePredictions
    const gamePrediction = gamePredictions[gameId]
    gamePredictions[gameId].submittingPrediction = true;

    
    this.setState({
      gamePredictions: {
        ...gamePredictions
      }
    })
    if (gamePrediction || game.prediction) {

      const awayTeamScore = (gamePrediction && parseInt(gamePrediction.predictionAwayTeamScore)) ? parseInt(gamePrediction.predictionAwayTeamScore) : parseInt(game.prediction.awayTeam.score)
      const homeTeamScore = (gamePrediction && parseInt(gamePrediction.predictionHomeTeamScore)) ? parseInt(gamePrediction.predictionHomeTeamScore) : parseInt(game.prediction.homeTeam.score)
      const stars = {
        spread: (gamePrediction && gamePrediction.stars && gamePrediction.stars.spread) 
        ? gamePrediction.stars.spread 
          : (game.prediction && game.prediction.stars && game.prediction.stars.spread) 
          ? game.prediction.stars.spread 
        : 0,
        total: (gamePrediction && gamePrediction.stars && gamePrediction.stars.total) 
          ? gamePrediction.stars.total 
            : (game.prediction && game.prediction.stars && game.prediction.stars.total) 
          ? game.prediction.stars.total 
        : 0
      }
      var prediction = {
        gameId: game.gameId,
        gameWeek: game.gameWeek,
        year: game.year,
        sport: game.sport,
        season: game.season,
        awayTeam: {
          fullName: game.awayTeam.fullName,
          shortName: game.awayTeam.shortName,
          code: game.awayTeam.code,
          score: awayTeamScore ? awayTeamScore : game.prediction.awayTeam.score,
        },
        homeTeam: {
          fullName: game.homeTeam.fullName,
          shortName: game.homeTeam.shortName,
          code: game.homeTeam.code,
          score: homeTeamScore ? homeTeamScore : game.prediction.homeTeam.score,
        },
        stars: stars
      };
      let predictionResponse = await api.fetchSubmitPrediction(userSession, prediction);
      let gameUpdate = predictionResponse.prediction.game;
      gameUpdate.prediction = predictionResponse.prediction.prediction;

      let games = this.state.games;
      let data = this.state.data;
      let gamePredictions = this.state.gamePredictions;
      games[game.gameId] = gameUpdate;
      data[game.gameId] = gameUpdate;

      if (gamePredictions[gameId]) {
        gamePredictions[gameId].predictionAwayTeamScore = prediction.awayTeam.score;
        gamePredictions[gameId].predictionHomeTeamScore = prediction.homeTeam.score;
      } else {
        gamePredictions[gameId] = {
          predictionAwayTeamScore: prediction.awayTeam.score,
          predictionHomeTeamScore: prediction.homeTeam.score,
        }
      }
      console.log('here')
      gamePredictions[gameId].submittingPrediction = false;
      this.setState({
        games: games,
        data: data,
        gamePredictions: {
          ...gamePredictions
        }
      })
      return predictionResponse;
    } else {
      return { predictionError: 'Please update your prediction.'}
    }      
  } catch(submitPredictionError) {
    console.log({submitPredictionError});
  }
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

export const AmplifyAuth = (req, res, next) => {
    let idToken;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        idToken = req.headers.authorization
    } else {
        console.error('No Token found')
        return res.status(403).json({ error: 'Unauthorized'})
    }
    
}