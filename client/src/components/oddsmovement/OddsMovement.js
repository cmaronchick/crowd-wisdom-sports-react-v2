import React from 'react'
import dayjs from 'dayjs'
import { Row, Col, Divider, Table } from 'antd'

import { connect } from 'react-redux'
import {getWeeklyOddsMovement} from '../../redux/actions/gamesActions'


const OddsMovement = (props) => {
    return (
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
                let dataSourceTotalObj = {
                    matchup: 'Total',
                    key: `${game.awayTeam.code}${game.homeTeam.code}total`
                }

                game.odds && game.odds.history && game.odds.history.length > 0 && game.odds.history.forEach((odds,index) => {
                        columns.push({
                            title: dayjs(odds.date).format('MM/DD'),
                            dataIndex: index,
                            key: `${game.awayTeam.code}${game.homeTeam.code}${dayjs(odds.date).format('MM/DD')}`
                        })
                        dataSourceSpreadObj[index] = odds.spread
                        dataSourceTotalObj[index] = odds.total
                })

                const dataSource = [dataSourceSpreadObj, dataSourceTotalObj]
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
                            <Table pagination={false} dataSource={dataSource} columns={columns} />
                        </Col>
                    </Row>
                </div>
                )}
            )}
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
