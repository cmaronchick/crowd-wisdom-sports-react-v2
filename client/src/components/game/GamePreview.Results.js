import React from 'react'
import {spreadPrediction, totalPrediction} from '../../functions/utils'
import { Row, Col, Typography} from 'antd'

const {Title, Text} = Typography

const GamePreviewResults = ({game}) => {
    const {results, odds} = game;
    return (
        <Row className="predictionRow team results">
            <Col span={4}>FINAL</Col>
            <Col span={5}>{results.awayTeam.score}</Col>
            <Col span={5}>{results.homeTeam.score}</Col>
            <Col span={5}>
                {spreadPrediction(game,results.awayTeam.score, results.homeTeam.score)}<br/>
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
            </Col>
            <Col span={5}>
                {totalPrediction(game,results.awayTeam.score, results.homeTeam.score)}<br/>({results.awayTeam.score + results.homeTeam.score})
            </Col>
        </Row>
    )
}

export default GamePreviewResults
