import React, { Fragment } from 'react'
import {spreadPrediction, totalPrediction} from '../../functions/utils'
import { Row, Col } from 'antd'


const GamePreviewResults = ({game}) => {
    const {results, odds, status} = game;
    return results.awayTeam && results.homeTeam ? (
        <Row className="predictionRow team results">
            <Col span={4}>{status === 'final' ? 'FINAL' : 'IN PROGRESS'}</Col>
            <Col span={5}>{results.awayTeam.score}</Col>
            <Col span={5}>{results.homeTeam.score}</Col>
            <Col span={5}>
            {game.odds && spreadPrediction(game, game.odds, results.awayTeam.score, results.homeTeam.score)}
            {game.odds && (
                <Fragment>
                <br/>
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
                )</span>
                </Fragment>
            )}
            </Col>
            <Col span={5}>
                {game.odds && totalPrediction(game, game.odds, results.awayTeam.score, results.homeTeam.score)}<br/>({results.awayTeam.score + results.homeTeam.score})
            </Col>
        </Row>
    ) : (
        <Row>No Score Yet</Row>
    )
}

export default GamePreviewResults
