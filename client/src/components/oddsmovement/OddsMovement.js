import React from 'react'
import dayjs from 'dayjs'
import { Row, Col, Divider, Table, Spin } from 'antd'
import Weeks from '../weeks/Weeks'
import StakeIcon from '../../images/stake-image-blue-dual-ring.svg'

import { connect } from 'react-redux'
import {getWeeklyOddsMovement} from '../../redux/actions/gamesActions'


const OddsMovement = (props) => {

    return (
        <div className="oddsMovementContainer">
            <Weeks sport={props.sport.sport} onGameWeekClick={props.getWeeklyOddsMovement} page="oddsmovement" />
            <div>
                {props.games.loadingOdds ? (
                        <div className="oddsRow" style={{backgroundColor: '#fff', padding: 20}}>
                            <img src={StakeIcon} className="loadingIcon" alt="Odds Loading" />
                        </div>
                ) : props.games && props.games.games && Object.keys(props.games.games).length > 0 ? Object.keys(props.games.games).sort((a,b) => {
                    return (props.games.games[b].status === props.games.games[a].status) ? new Date(props.games.games[a].startDateTime) - new Date(props.games.games[b].startDateTime) : new Date(props.games.games[b].startDateTime) - new Date(props.games.games[a].startDateTime)
                  }).map(gameKey => {
                    const game = props.games.games[gameKey]
                    const columns = [{
                        title: `${game.awayTeam.code} vs. ${game.homeTeam.code}`,
                        dataIndex: 'matchup',
                        key: 'matchup'
                    }]
                    let dataSourceSpreadObj = {
                        matchup: 'Spread',
                        key: `${game.awayTeam.code}${game.homeTeam.code}spread`
                    }
                    let dataSourceSpreadPriceObj = {
                        matchup: (<span>Spread Price<br/>(Away/Home)</span>),
                        key: `${game.awayTeam.code}${game.homeTeam.code}spreadprices`
                    }
                    let dataSourceTotalObj = {
                        matchup: 'Total',
                        key: `${game.awayTeam.code}${game.homeTeam.code}total`
                    }
                    let dataSourceTotalPriceObj = {
                        matchup: (<span>Total Price<br/>(Under/Over)</span>),
                        key: `${game.awayTeam.code}${game.homeTeam.code}totalprices`
                    }
                    let lastSpread, lastSpreadOdds, lastTotal, lastTotalOdds, lastDate;
                    game.odds && game.odds.history && game.odds.history.length > 0 && game.odds.history.forEach((odds,index) => {
                        const { date, spread, total, spreadOdds, totalOdds } = odds
                        // set lastDate to first Odds Date if it hasn't already been set
                        if (lastDate === null) {
                            lastDate = date;
                        }
                        const timeDifference = new Date(game.startDateTime).getTime() - new Date(date).getTime()
                        const daysDifference = timeDifference/(1000*60*60*24)
                        const oddsTimeDifference = new Date(date).getTime() - new Date(lastDate).getTime()
                        const oddsDaysDifference = oddsTimeDifference/(1000*60*60*24)
                        if (daysDifference <= 8 && (((spread || total)
                            && (spread !== lastSpread || spreadOdds !== lastSpreadOdds || total !== lastTotal || totalOdds !== lastTotalOdds)) || oddsDaysDifference > 1)) {
                                lastSpread = spread;
                                lastSpreadOdds = spreadOdds;
                                lastTotal = total;
                                lastTotalOdds = totalOdds;
                                lastDate = date;
                            columns.push({
                                title: dayjs(odds.date).format('MM/DD'),
                                dataIndex: index,
                                key: `${game.awayTeam.code}${game.homeTeam.code}${dayjs(odds.date).format('MM/DD')}`
                            })
                            dataSourceSpreadObj[index] = odds.spread
                            dataSourceTotalObj[index] = odds.total
                            dataSourceTotalPriceObj[index] = `${odds.totalOdds}`
                            dataSourceSpreadPriceObj[index] = `${odds.spreadOdds}`
                        }
                    })

                    const dataSource = [
                        dataSourceSpreadObj,
                        dataSourceSpreadPriceObj,
                        dataSourceTotalObj,
                        dataSourceTotalPriceObj]
                    return (

                    <div className="oddsRow" style={{flexDirection: 'column'}} key={gameKey}>
                        <Row>
                            <Col span={12}>
                                <div>
                                    {game.awayTeam.code} vs. {game.homeTeam.code}
                                </div>
                            </Col>
                            <Col span={12}>
                                <div>{dayjs(game.startDateTime).format('MMMM DD')}</div>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Table
                                    pagination={false}
                                    dataSource={dataSource}
                                    columns={columns}
                                    scroll={{x: 150}}
                                    />
                            </Col>
                        </Row>
                    </div>
                    )}
                ) : (
                    <div className="oddsRow">
                        <h1>No Odds Available Yet. Check back soon!</h1>
                    </div>
                )}
            </div>
        </div>
    )
}

const mapActionsToProps = {
    getWeeklyOddsMovement
}

const mapStateToProps = (state) => ({
    sport: state.sport,
    games: state.games
})

export default connect(mapStateToProps, mapActionsToProps)(OddsMovement)
