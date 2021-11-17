import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'

import { Row, Col, Typography } from 'antd'

import WeatherIcon from './WeatherIcons'

const { Text } = Typography

export const GamePreviewHeaderRow = (props) => {
    const { game, showPrediction } = props
    const gameDate = dayjs(game.startDateTime).format('MMM D, YYYY H:mm')
    
    return (
        <Fragment>
            <Row className="headerRow">
            <Col span={8} className="gameDate">
            <Text>
            {!game.results && game.status === "final" ? gameDate : `FINAL`}
            </Text>
            </Col>
            <Col span={8}>
            <Text className="gameLocation">
            {game.location}
            </Text>
            </Col>
            {game.weather && (
                <Col span={8} className="gameWeather">
                <Text><WeatherIcon icon={game.weather.icon} description={game.weather.description} />
                </Text>
                <Text>{game.weather.temp}&deg;F</Text>
                </Col>
            )}
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
