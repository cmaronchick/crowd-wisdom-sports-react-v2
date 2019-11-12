import React from 'react'
import * as apis from '../apis'

const GamePreviewResults = ({game}) => {
    const {results, odds} = game;
    return (
        <div className="team results">
            <div>FINAL</div>
            <div>{results.awayTeam.score}</div>
            <div>{results.homeTeam.score}</div>
            <div>{apis.spreadPrediction(game,results.awayTeam.score, results.homeTeam.score)}<br/>
            <span className="predictionSpread">(
            {(results.homeTeam.score + odds.spread) > results.awayTeam.score // home team covers
            ? results.awayTeam.score > results.homeTeam.score 
                ? `${game.awayTeam.code} by ${(results.awayTeam.score - results.homeTeam.score)}`
                : `${game.homeTeam.code} by ${(results.homeTeam.score - results.awayTeam.score)}`
            : (results.homeTeam.score + odds.spread) < results.awayTeam.score 
                ? results.awayTeam.score > results.homeTeam.score 
                ? `${game.awayTeam.code} by ${(results.awayTeam.score - results.homeTeam.score)}`
                : `${game.homeTeam.code} by ${(results.homeTeam.score - results.awayTeam.score)}`
                : (results.homeTeam.score + odds.spread) === results.awayTeam.score
                ? results.awayTeam.score > results.homeTeam.score 
                    ? `${game.awayTeam.code} by ${(results.awayTeam.score - results.homeTeam.score)}`
                    : `${game.homeTeam.code} by ${(results.homeTeam.score - results.awayTeam.score)}`
                : ''}
            )</span></div>
            <div>{apis.totalPrediction(game,results.awayTeam.score, results.homeTeam.score)}<br/>({results.awayTeam.score + results.homeTeam.score})</div>
        </div>
    )
}

export default GamePreviewResults
