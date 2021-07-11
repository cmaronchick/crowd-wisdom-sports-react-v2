import React from 'react'

import { Row, Col, Typography } from 'antd'

const { Title, Text } = Typography

const Stats = ({selectedWeek, crowdResults}) => {
    const weeklyResults = crowdResults.weeklyRecord
    if (!weeklyResults) {
        return (<div></div>)
    }
    const { winner, spread, total, predictionScore } = weeklyResults
    return (
        <div className="crowdTable">
            <Title level={4}>Crowd Results</Title>
            <Row>
                <Col span={6}>
                    <Text>Winners</Text>
                </Col>
                <Col span={6}>
                    <Text>Spread</Text>
                </Col>
                <Col span={6}>
                    <Text>Total</Text>
                </Col>
                <Col span={6}>
                    <Text>Score</Text>
                </Col>
            </Row>
            <Row className="resultsRow">
                <Col span={6}>
                    <Text>{winner.correct}-{winner.incorrect}</Text>
                </Col>
                <Col span={6}>
                    <Text>{spread.correct}-{spread.incorrect}{(spread.push && spread.push > 0) ? (`-${spread.push}`) : null}</Text>
                </Col>
                <Col span={6}>
                    <Text>{total.correct}-{total.incorrect}{(total.push && total.push > 0) ? (`-${total.push}`) : null}</Text>
                </Col>
                <Col span={6}>
                    <Text>{predictionScore}</Text>
                </Col>
            </Row>
            

        </div>
    )
}

export default Stats
