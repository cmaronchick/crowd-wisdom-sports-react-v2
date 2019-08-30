
export const submitPrediction = (game, awayScore, homeScore, starsSpread, starsTotal) => {
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
          score: awayScore
        },
        homeTeam: {
          fullName: game.homeTeam.fullName,
          shortName: game.homeTeam.shortName,
          code: game.homeTeam.code,
          score: homeScore
        },
        stars: {
          spread: starsSpread,
          total: starsTotal
        }
      };
      return prediction;
    
}