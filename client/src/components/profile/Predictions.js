import React, { useEffect} from 'react'
import { connect } from 'react-redux'
import { getUserPredictions } from '../../redux/actions/predictionsActions'
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min'

import { Table, Typography } from 'antd'

const { Title } = Typography

export const Predictions = (props) => {
    // console.log(`props.match`, props.match)
    const {userId} = props.match.params
    const comparedPredictions = props.predictions.comparedUser?.predictions
    // console.log(`userId`, userId)
    const { sport, gameWeekData } = props.sport
    const { week, year, season } = gameWeekData
    useEffect(() => {
        if (!userId) {
            return <Redirect to="/leaderboards" />
        }
        console.log(`sport, year, season, week`, sport, year, season, week, comparedPredictions)
        if (!comparedPredictions && sport && year && season && week) {
            props.getUserPredictions(sport, year, season, week, userId)
        }
    }, [sport, gameWeekData, comparedPredictions])
    
    const columns = [
        {
            title: 'Away',
            dataIndex: 'awayTeam',
            key: 'gameId',
            render: (awayTeam) => {
                return (<div>{awayTeam.code}<br />{awayTeam.score}</div>)
            },
            fixed: 'left'
        },
        {
            title: 'Home',
            dataIndex: 'homeTeam',
            render: (homeTeam) => {
                return (<div>{homeTeam.code}<br/>{homeTeam.score}</div>)
            },
            fixed: 'left'
        },
        {
            title: 'Spread',
            dataIndex: 'odds',
            render: (odds) => {
                return (<div>{odds.spread}</div>)
            },
            fixed: 'left'
        },
        {
            title: 'Total',
            dataIndex: 'odds',
            render: (odds) => {
                return (<div>{odds.total}</div>)
            },
            fixed: 'left'
        },
        {
            title: 'Prediction Score',
            dataIndex: 'predictionScore',
            width: 100
        }

    ]
    return (
        <div>
            <Title>{userId} Predictions</Title>
            {comparedPredictions && comparedPredictions.length > 0 ? (
                <Table className="comparisonTable" rowKey="gameId" dataSource={comparedPredictions} columns={columns} />
            ) : (
                <div>No Predictions available yet. Check back soon!</div>
            )}
        </div>
    )
}

const mapStateToProps = (state) => ({
    sport: state.sport,
    predictions: state.predictions
})

const mapDispatchToProps = {
    getUserPredictions
}

export default connect(mapStateToProps, mapDispatchToProps)(Predictions)
