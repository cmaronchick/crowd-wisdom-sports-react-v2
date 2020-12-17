import React from 'react'
import dayjs from 'dayjs'
import { Row, Col, Divider, Table } from 'antd'
import Weeks from '../weeks/Weeks'

import { connect } from 'react-redux'
import {getWeeklyOddsMovement} from '../../redux/actions/gamesActions'


const OddsMovement = (props) => {

    
    return (
        <div className="oddsMovementContainer">
            <Weeks sport={props.sport.sport} onGameWeekClick={props.getWeeklyOddsMovement} page="games" />
            <div>
                {props.games && props.games.oddsMovement && props.games.oddsMovement.length > 0 && props.games.oddsMovement.map(game => {
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

                    game.odds && game.odds.history && game.odds.history.length > 0 && game.odds.history.forEach((odds,index) => {
                            columns.push({
                                title: dayjs(odds.date).format('MM/DD'),
                                dataIndex: index,
                                key: `${game.awayTeam.code}${game.homeTeam.code}${dayjs(odds.date).format('MM/DD')}`
                            })
                            dataSourceSpreadObj[index] = odds.spread
                            dataSourceTotalObj[index] = odds.total
                            if (odds.prices) {
                                dataSourceSpreadPriceObj[index] = `${odds.prices.spreadAwayPrice}/${odds.prices.spreadHomePrice}`
                                dataSourceTotalPriceObj[index] = `${odds.prices.totalUnderPrice}/${odds.prices.totalOverPrice}`
                            }
                    })

                    const dataSource = [
                        dataSourceSpreadObj,
                        dataSourceSpreadPriceObj,
                        dataSourceTotalObj,
                        dataSourceTotalPriceObj]
                    return (

                    <div className="oddsRow" style={{flexDirection: 'column'}} key={game.gameUID}>
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
