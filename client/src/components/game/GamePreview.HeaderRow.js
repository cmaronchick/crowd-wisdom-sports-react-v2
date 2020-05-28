import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import dayjs from 'dayjs'

import { Row, Col, Typography } from 'antd'

const { Title, Text } = Typography

export const GamePreviewHeaderRow = (props) => {
    const { game, showPrediction } = props
    const gameDate = dayjs(game.startDateTime).format('MMMM D, YYYY H:mm')
    
    return (
        <Fragment>
            <Row className="headerRow">
            <Col span={8} className="gameDate">
            <Text>
            {!game.results ? gameDate : `FINAL`}
            </Text>
            </Col>
            <Col span={8}>
            <Text className="gameLocation">
            {game.location}
            </Text>
            </Col>
            {game.weather ? (
            <Col span={8} className="gameWeather">
            <Text>
                <img src={`http://openweathermap.org/img/wn/${game.weather.icon}.png`} className="weatherIcon" />
            
            </Text>
            <Text>{game.weather.temp}&deg;F</Text>
            </Col>
            ) : null}
        </Row>
        <Row className="headerRow">
            <Col span={4}></Col>
            <Col span={showPrediction ? 5 : 10} className={`teamName ${game.awayTeam.code.toLowerCase()} secondary`}>{game.awayTeam.code}</Col>
            <Col span={showPrediction ? 5 : 10} className={`teamName ${game.homeTeam.code.toLowerCase()} primary`}>{game.homeTeam.code}</Col>
            {showPrediction ? (
            <Col span={5} className="odds">Side</Col>
            ) : null}
            {showPrediction ? (
            <Col span={5} className="odds">Total</Col>
            ) : null} 
        </Row>
    </Fragment>
    )
}

GamePreviewHeaderRow.propTypes = {
    game: PropTypes.object.isRequired
}


export default GamePreviewHeaderRow
