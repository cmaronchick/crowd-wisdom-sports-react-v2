import React from 'react'
import * as ResultsCheck from './GamePreview.ResultsCheck'
// import * as apis from '../apis'

const GamePreviewCrowd = ({game}) => {
    const {crowd, results} = game
    
    const crowdAwayTeamScore = game.crowd ? parseFloat(game.crowd.awayTeam.score).toFixed(2) : null,
    crowdHomeTeamScore = game.crowd ? parseFloat(game.crowd.homeTeam.score).toFixed(2) : null

    return (
        <div>
            <div className="crowd">
                <div>Crowd</div>
                <div style={{position: 'relative'}}>
                <span className={(results && (results.awayTeam.score > results.homeTeam.score) && (crowd.awayTeam.score > crowd.homeTeam.score)) ? 'correctPick' : ''}>
                    {results ? ResultsCheck.checkBullseye(crowd.awayTeam.score, results.awayTeam.score) : null}
                    {results && (crowd.awayTeam.score > crowd.homeTeam.score) ? ResultsCheck.straightUpResults(results, crowd) : ''}
                    {crowdAwayTeamScore}
                </span>
                </div>
                <div style={{position: 'relative'}}>
                <span className={(results && (results.awayTeam.score < results.homeTeam.score) && (crowd.awayTeam.score < crowd.homeTeam.score)) ? 'correctPick' : ''}>
                    
                    {results ? ResultsCheck.checkBullseye(crowd.homeTeam.score, results.homeTeam.score) : null}
                    {results && (crowd.awayTeam.score < crowd.homeTeam.score) ? ResultsCheck.straightUpResults(results, crowd) : ''}
                    {crowdHomeTeamScore}
                </span>
                </div>
                <div style={{position: 'relative'}}>
                {results && crowd.results ? ResultsCheck.checkBullseye(crowd.spread, results.spread) : null}
                {results && crowd.results ? ResultsCheck.spreadResults(game.odds,results, crowd) : null}
                {/* {((game.prediction || results) && crowd && game.odds) ? apis.spreadPrediction(game, crowdAwayTeamScore, crowdHomeTeamScore) : ''}<br/> */}

                <span className="predictionSpread">(
                {(crowdHomeTeamScore + game.odds.spread) > crowdAwayTeamScore // home team covers
                ? crowdAwayTeamScore > crowdHomeTeamScore 
                    ? `${game.awayTeam.code} by ${(crowdAwayTeamScore - crowdHomeTeamScore).toFixed(2)}`
                    : `${game.homeTeam.code} by ${(crowdHomeTeamScore - crowdAwayTeamScore).toFixed(2)}`
                : (crowdHomeTeamScore + game.odds.spread) < crowdAwayTeamScore 
                    ? crowdAwayTeamScore > crowdHomeTeamScore 
                    ? `${game.awayTeam.code} by ${(crowdAwayTeamScore - crowdHomeTeamScore).toFixed(2)}`
                    : `${game.homeTeam.code} by ${(crowdHomeTeamScore - crowdAwayTeamScore).toFixed(2)}`
                    : (crowdHomeTeamScore + game.odds.spread) === crowdAwayTeamScore
                    ? crowdAwayTeamScore > crowdHomeTeamScore 
                        ? `${game.awayTeam.code} by ${(crowdAwayTeamScore - crowdHomeTeamScore).toFixed(2)}`
                        : `${game.homeTeam.code} by ${(crowdHomeTeamScore - crowdAwayTeamScore).toFixed(2)}`
                    : ''}
                )</span>
                </div>
                <div>{(game.prediction && crowd && game.odds) ? (
                <div style={{position: 'relative'}}>
                {results ? ResultsCheck.checkBullseye(crowd.total, results.total) : null}
                {results ? ResultsCheck.totalResults(game.odds,results, crowd) : null}
                {/* {apis.totalPrediction(game, crowdAwayTeamScore, crowdHomeTeamScore)} */}
                <br/><span className="predictionSpread">({crowd.total})</span>
                </div>
                ) : ''}</div>
            </div>
            
            {crowd && crowd.results ? (
                <div className='predictionScoreBox crowd'>
                Crowd Score: {crowd.results.predictionScore}
                </div>
            ) : null}
        </div>
    )
}

export default GamePreviewCrowd
