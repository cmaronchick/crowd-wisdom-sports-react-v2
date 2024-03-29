import React, { useEffect, useState} from 'react'
import { connect } from 'react-redux'
import { setGameWeek } from '../../redux/actions/sportActions'
import { getUserPredictions } from '../../redux/actions/predictionsActions'
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min'
import StakeIcon from '../../images/stake-image-blue-dual-ring.svg'

import { Table, Typography, Spinner } from 'antd'
import Weeks from '../weeks/Weeks'

const { Title } = Typography

export const Predictions = (props) => {
    // console.log(`props.match`, props.match)
    const {userId, selectedWeek} = props.match.params
    const [comparedPredictions, setComparedPredictions] = useState(props.predictions.comparedUser?.predictions ? props.predictions.comparedUser?.predictions : [])
    

    // console.log(`userId`, userId)
    const { sport, gameWeekData } = props.sport
    const { week, year, season } = gameWeekData
    useEffect(() => {
        if (userId) {
                
            // console.log(`sport, year, season, week`, sport, year, season, week, comparedPredictions)
            if (!comparedPredictions && sport && year && season && week) {
                //use selected week instead of week if it exists
                props.setGameWeek(sport, year, season, selectedWeek ? selectedWeek : week);
                props.getUserPredictions(sport, year, season, selectedWeek ? selectedWeek : week, userId);
            }
        }
    }, [sport, gameWeekData, comparedPredictions])
    
    const columns = [
        {
            title: 'Away',
            dataIndex: 'awayTeam',
            key: 'gameId',
            render: (awayTeam) => {
                // console.log(`awayTeam`, awayTeam)
                return (<div>{awayTeam.code ? (<span>{awayTeam.code}<br /></span>) : null}{awayTeam.score}</div>)
            },
            fixed: 'left',
            width: 120
        },
        {
            title: 'Home',
            dataIndex: 'homeTeam',
            render: (homeTeam) => {
                return (<div>{homeTeam.code ? (<span>{homeTeam.code}<br /></span>) : null}{homeTeam.score}</div>)
            },
            fixed: 'left',
            width: 120
        },
        {
            title: 'Spread',
            dataIndex: 'odds',
            render: (odds) => {
                return (<div>{odds.spread}</div>)
            },
            fixed: 'left',
            width: 120
        },
        {
            title: 'Total',
            dataIndex: 'odds',
            render: (odds) => {
                return (<div>{odds.total}</div>)
            },
            fixed: 'left',
            width: 120
        },
        {
            title: 'Prediction Score',
            dataIndex: 'predictionScore',
            render: (predictionScore) => {
                return (<div>{predictionScore ? predictionScore : ''}</div>)
            },
            width: 120
        }

    ]
    // console.log(`userId`, userId, comparedPredictions)
    return userId ? (
        <div>
            <Title>{userId} Week {selectedWeek ? selectedWeek : week} Predictions</Title>

                        <Weeks
                        sport={sport}
                        onGameWeekClick={() => props.getUserPredictions(sport, year, season, selectedWeek ? selectedWeek : week, userId)}
                        page={`predictions/${userId}`} />
            {props.predictions.comparedUser?.gettingPredictions ? (
                        <div className="oddsRow" style={{backgroundColor: '#fff', padding: 20}}>
                            <img role="loading" alt="Predictions loading..." src={StakeIcon} className="loadingIcon" />
                        </div>
                ) : comparedPredictions && comparedPredictions.length > 0 ? (
                        
                        <Table
                            className="comparisonTable"
                            rowKey="gameId"
                            dataSource={comparedPredictions}
                            columns={columns}
                            pagination={false}
                        
                        expandable={props.games?.games ? {
                            expandedRowRender: record => {
                                const game = props.games.games[record.gameId]
                                // console.log(`game`, game)
                                const gameResult = game ? { odds: game.odds, awayTeam: { score: game.results.awayTeam.score }, homeTeam: { score: game.results.homeTeam.score }} : null
                                const myPrediction = props.predictions.user[record.gameId]
                                const myColumns = [
                                    {
                                        title: 'Me',
                                        dataIndex: 'odds',
                                        key: 'me',
                                        className: 'embeddedTableNameColumn',
                                        render: (odds) => {
                                            return (<div>Me</div>)
                                        },
                                        fixed: 'left'
                                    },
                                    ...columns]
                                const gameColumns = [
                                    {
                                        title: 'FINAL',
                                        dataIndex: 'odds',
                                        key: 'game',
                                        className: 'embeddedTableNameColumn',
                                        render: (odds) => {
                                            return (<div>FINAL</div>)
                                        },
                                        fixed: 'left'
                                    },
                                    ...columns]
                                return (
                                    <div>
                                        {myPrediction && (
                                            <Table showHeader={false} dataSource={[myPrediction]} columns={myColumns} pagination={false} />
                                        )}
                                        {gameResult && (
                                            <Table showHeader={false} dataSource={[gameResult]} columns={gameColumns} pagination={false} />
                                        )}
                                    {/* <div style={{ margin: 0 }}>FINAL: {game.results.awayTeam.score}-{game.results.homeTeam.score} Spread: {game.odds.spread} Total: {game.odds.total} </div> */}
                                    </div>)
                            },
                            columnWidth: 110
                        } : false} />
            ) : (
                <div>No Predictions available yet. Check back soon!</div>
            )}
        </div>
    ) : (<Redirect to="/leaderboards" />)
}

const mapStateToProps = (state) => ({
    sport: state.sport,
    predictions: state.predictions,
    games: state.games
})

const mapDispatchToProps = {
    getUserPredictions,
    setGameWeek
}

export default connect(mapStateToProps, mapDispatchToProps)(Predictions)
