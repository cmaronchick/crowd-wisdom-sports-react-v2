import React, { useEffect, useMemo, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { setGameWeek } from '../../redux/actions/sportActions'
import { getUserPredictions, submitTeaser } from '../../redux/actions/predictionsActions'
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min'
import StakeIcon from '../../images/stake-image-blue-dual-ring.svg'

import { Button, Select, Table, Tabs, Typography } from 'antd'
import Weeks from '../weeks/Weeks'
import { getTeaserOptions } from '../../functions/utils'
import { checkGameStart } from '../../functions/utils'

const { Title, Text } = Typography
const { TabPane } = Tabs

export const Predictions = ({ predictions, user, games, sport, match, setGameWeek, getUserPredictions, submitTeaser }) => {
    const { userId, selectedWeek } = match.params
    const loggedInUserId = user?.username || user?.attributes?.preferred_username
    const resolvedUserId = userId
    const targetUserId = userId || loggedInUserId
    const isCurrentUserView = !userId || userId === loggedInUserId
    const shouldRedirectToLeaderboards = !loggedInUserId && !userId
    const [submittingTeaser, setSubmittingTeaser] = useState(false)
    const [teaserSelections, setTeaserSelections] = useState([])
    const [selectedStake, setSelectedStake] = useState(100)
    const comparedPredictions = predictions.comparedUser?.predictions || []
    const lastFetchedWeekRef = useRef(null)

    const { gameWeekData } = sport
    const { week, year, season } = gameWeekData
    const effectiveWeek = Number(selectedWeek ?? week ?? 1)
    const pageKey = isCurrentUserView ? 'predictions' : `predictions/${resolvedUserId}`

    useEffect(() => {
        if (!targetUserId || !sport || !year || !season || !effectiveWeek) {
            return
        }

        const fetchKey = `${sport}|${year}|${season}|${effectiveWeek}|${targetUserId}`
        if (lastFetchedWeekRef.current === fetchKey) {
            return
        }

        lastFetchedWeekRef.current = fetchKey

        const shouldSyncGameWeek = !selectedWeek || Number(selectedWeek) !== Number(week)
        if (shouldSyncGameWeek) {
            setGameWeek(sport, year, season, effectiveWeek)
        }

        getUserPredictions(sport, year, season, effectiveWeek, targetUserId)
    }, [sport, year, season, week, selectedWeek, targetUserId, setGameWeek, getUserPredictions, effectiveWeek])

    const toggleTeaserSelection = (record, game, option) => {
        if (!record || !game || !option) {
            setTeaserSelections((currentSelections) => currentSelections.filter((selection) => selection.id !== (record?._id || `${game?.gameId || record?.gameId || 'game'}-spread`)))
            return
        }

        const selectionId = record?._id || `${game?.gameId || record?.gameId || 'game'}-spread`
        const teaserLine = Number(option.teasedLine ?? option.spread ?? 0)
        const nextSelection = {
            id: selectionId,
            optionId: option.id,
            team: option.teamCode,
            spread: teaserLine,
            originalLine: Number(option.originalLine ?? 0),
            teaserLine,
            betText: option.label,
            prediction: {
                ...record,
                odds: {
                    ...(record?.odds ?? game?.odds ?? {}),
                    spread: Number(option.originalLine ?? record?.odds?.spread ?? game?.odds?.spread ?? 0)
                }
            },
            game,
            label: option.label,
        }

        setTeaserSelections((currentSelections) => {
            const filtered = currentSelections.filter((selection) => selection.id !== selectionId)
            return [...filtered, nextSelection]
        })
    }

    const handleSubmitTeaser = async () => {
        if (teaserSelections.length < 2) {
            return
        }

        const selectionList = teaserSelections.map((selection) => ({
            ...selection,
            prediction: selection.prediction || selection.game?.prediction || {},
            game: selection.game
        }))

        const teaserObject = {
            isTeaser: true,
            sport: sport.sport,
            year,
            season,
            gameWeek: selectedWeek ? selectedWeek : week,
            gameIdsArray: selectionList.map((selection) => selection.game.gameId),
            predictionsArray: selectionList.map((selection) => ({
                prediction: {
                    gameId: selection.game.gameId,
                    awayTeam: selection.prediction?.awayTeam,
                    homeTeam: selection.prediction?.homeTeam,
                    odds: selection.prediction?.odds || selection.game?.odds,
                }
            })),
            wager: {
                wagerType: 'teaser',
                currency: selectedStake,
                pickCount: selectionList.length,
                odds: '-110',
                legs: selectionList.map((selection) => ({
                    gameId: selection.game.gameId,
                    originalLine: selection.originalLine,
                    spreadTotal: selection.teaserLine,
                    participantId: selection.team === selection.game.homeTeam.code ? selection.game.homeTeam.participantId : selection.game.awayTeam.participantId,
                    betText: `${selection.team} ${selection.teaserLine > 0 ? '+' : ''}${selection.teaserLine}`,
                    result: null,
                    settled: false,
                }))
            }
        }

        setSubmittingTeaser(true)
        try {
            await submitTeaser(selectionList, teaserObject)
            setTeaserSelections([])
        } catch (error) {
            console.error('handleSubmitTeaserError:', error)
        } finally {
            setSubmittingTeaser(false)
        }
    }
    const getPredictionStatus = (record, game) => {
        if (!record) {
            return 'pending'
        }

        const hasFinalResults = record?.results || record?.predictionScore !== undefined || game?.status === 'final'
        return hasFinalResults ? 'final' : 'pending'
    }

    const splitPredictions = (records = []) => records.reduce((grouped, record) => {
        const game = games?.games?.[record.gameId]
        if (process.env.NODE_ENV === 'development') {
            console.log('Processing record:', record, game)
        }
        const status = getPredictionStatus(record, game)
        game && grouped[status].push(record)
        return grouped
    }, { final: [], pending: [] })

    const userPredictionData = Object.keys(predictions.user || {}).map((gameId) => ({
        gameId,
        ...predictions.user[gameId]
    }))

    const { final: finalUserPredictions, pending: pendingUserPredictions } = splitPredictions(userPredictionData)
    const { final: finalComparedPredictions, pending: pendingComparedPredictions } = splitPredictions(comparedPredictions)
    const pendingPredictionCount = (resolvedUserId && comparedPredictions.length > 0) ? pendingComparedPredictions.length : pendingUserPredictions.length
    const finalPredictionCount = (resolvedUserId && comparedPredictions.length > 0) ? finalComparedPredictions.length : finalUserPredictions.length
    const [activePredictionTab, setActivePredictionTab] = useState(() => (pendingPredictionCount > 0 ? 'pending' : 'final'))

    const buildColumns = (tabKey) => {
        const scoreTitle = tabKey === 'final' ? 'Prediction Score' : 'Teaser'

        return [
            {
                title: 'Away',
                dataIndex: 'awayTeam',
                key: 'gameId',
                render: (awayTeam) => awayTeam?.code && (
                    <div>{awayTeam?.code ? (<span>{awayTeam.code}<br /></span>) : 'away'}{awayTeam?.score ? awayTeam.score : ''}</div>
                ),
                fixed: 'left',
                width: 120,
            },
            {
                title: 'Home',
                dataIndex: 'homeTeam',
                render: (homeTeam) => homeTeam?.code && (
                    <div>{homeTeam?.code ? (<span>{homeTeam.code}<br /></span>) : 'home'}{homeTeam?.score ? homeTeam.score : ''}</div>
                ),
                fixed: 'left',
                width: 120,
            },
            {
                title: 'Spread',
                dataIndex: 'odds',
                render: (odds) => (<div>{odds?.spread}</div>),
                fixed: 'left',
                width: 120,
            },
            {
                title: 'Total',
                dataIndex: 'odds',
                render: (odds) => (<div>{odds?.total}</div>),
                fixed: 'left',
                width: 120,
            },
            {
                title: scoreTitle,
                dataIndex: 'predictionScore',
                render: (predictionScore) => (<div>{predictionScore ? predictionScore : tabKey === 'pending' ? 'Pending' : ''}</div>),
                width: 120,
            },
            ...(resolvedUserId !== loggedInUserId ? [{
                title: 'Teaser',
                key: 'teaser',
                width: 220,
                render: (_, record) => {
                    const game = games?.games?.[record.gameId]
                    const spreadOptions = game && record?.odds?.spread !== undefined ? getTeaserOptions(game, record) : []
                    const selectedValue = teaserSelections.find((selection) => selection.id === (record?._id || `${record.gameId}-spread`))?.optionId || undefined
                    return checkGameStart(game?.startDateTime) ? null : (
                        <Select
                            style={{ minWidth: 160 }}
                            value={selectedValue}
                            placeholder="Select teaser"
                            allowClear
                            onChange={(value) => {
                                if (value === '__clear__') {
                                    toggleTeaserSelection(record, game, null)
                                    return
                                }

                                const option = spreadOptions.find((item) => item.id === value)
                                toggleTeaserSelection(record, game, option)
                            }}
                            options={[
                                { value: '__clear__', label: 'Remove teaser selection' },
                                ...spreadOptions.map((option) => ({ value: option.id, label: option.label }))
                            ]}
                            disabled={!game || spreadOptions.length === 0}
                        />
                    )
                }
            }] : []),
        ]
    }

    const renderPredictionTable = (records, tabKey) => {
        if (!records || records.length === 0) {
            return <div>No Predictions available yet.</div>
        }

        return (
            <Table
                className="comparisonTable"
                rowKey="gameId"
                dataSource={records}
                columns={buildColumns(tabKey)}
                pagination={false}
                expandable={games?.games ? {
                    expandedRowRender: record => {
                        const game = games.games[record.gameId]
                        console.log('game', game)
                        const gameResult = game && game.results ? { odds: game.odds, awayTeam: { score: game.results.awayTeam.score }, homeTeam: { score: game.results.homeTeam.score } } : null
                        const myPrediction = predictions.user[record.gameId]
                        const myColumns = [
                            { title: 'Me', dataIndex: 'odds', key: 'me', className: 'embeddedTableNameColumn', render: () => (<div>Me</div>), fixed: 'left' },
                            ...buildColumns(tabKey)
                        ]
                        const gameColumns = [
                            { title: tabKey === 'final' ? 'FINAL' : 'PENDING', dataIndex: 'odds', key: 'game', className: 'embeddedTableNameColumn', render: () => (<div>{tabKey === 'final' ? 'FINAL' : 'PENDING'}</div>), fixed: 'left' },
                            ...buildColumns(tabKey)
                        ]

                        return game && (
                            <div>
                                {myPrediction && (<Table showHeader={false} dataSource={[myPrediction]} columns={myColumns} pagination={false} />)}
                                {gameResult && (<Table showHeader={false} dataSource={[gameResult]} columns={gameColumns} pagination={false} />)}
                            </div>
                        )
                    },
                    columnWidth: 110,
                } : false}
            />
        )
    }

    const teaserSummary = useMemo(() => {
        if (teaserSelections.length === 0) {
            return 'No teaser picks selected'
        }

        const selectedTeaserText = teaserSelections
            .map((selection) => selection.betText || `${selection.team} ${selection.teaserLine > 0 ? '+' : ''}${selection.teaserLine}`)
            .join(', ')

        return `Teaser Picks: ${selectedTeaserText}`
    }, [teaserSelections])

    return user?.loading ? (
        <div>Loading...</div>
    ) : (
        <div>
            <Title>{isCurrentUserView ? 'My' : resolvedUserId} Week {selectedWeek ? selectedWeek : week} Predictions</Title>
            <div
                style={{
                    position: 'sticky',
                    top: 12,
                    zIndex: 10,
                    marginBottom: 16,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 12,
                    flexWrap: 'wrap',
                    marginLeft: 16,
                    padding: '12px 16px',
                    background: '#fff',
                    borderRadius: 8,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                    border: '1px solid #f0f0f0',
                }}
            >
                <Text strong>{teaserSummary}</Text>
                {teaserSelections.length >= 2 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Select
                            value={selectedStake}
                            onChange={setSelectedStake}
                            options={[25, 50, 100, 200, 500].map((value) => ({ value, label: `${value}` }))}
                            style={{ width: 120 }}
                        />
                        <Button
                            type="primary"
                            onClick={handleSubmitTeaser}
                            loading={submittingTeaser}
                            disabled={submittingTeaser}
                        >
                            {submittingTeaser ? 'Submitting...' : 'Submit Teaser'}
                        </Button>
                    </div>
                )}
            </div>

            <Weeks
                sport={sport}
                onGameWeekClick={() => getUserPredictions(sport, year, season, selectedWeek ? selectedWeek : week, targetUserId)}
                page={targetUserId ? `predictions/${targetUserId}` : 'predictions'} />
            {predictions.comparedUser?.gettingPredictions ? (
                <div className="oddsRow" style={{ backgroundColor: '#fff', padding: 20 }}>
                    <img role="loading" alt="Predictions loading..." src={StakeIcon} className="loadingIcon" />
                </div>
            ) : (<div style={{ marginLeft: 16 }}>
                <Tabs activeKey={activePredictionTab} onChange={setActivePredictionTab}>
                    <TabPane tab={`Pending${pendingPredictionCount > 0 ? ` (${pendingPredictionCount})` : ''}`} key="pending">
                        {resolvedUserId && comparedPredictions.length > 0
                            ? renderPredictionTable(pendingComparedPredictions, 'pending')
                            : renderPredictionTable(pendingUserPredictions, 'pending')}
                    </TabPane>
                    <TabPane tab={`Final${finalPredictionCount > 0 ? ` (${finalPredictionCount})` : ''}`} key="final">
                        {resolvedUserId && comparedPredictions.length > 0
                            ? renderPredictionTable(finalComparedPredictions, 'final')
                            : renderPredictionTable(finalUserPredictions, 'final')}
                    </TabPane>
                </Tabs>
            </div>
            )}
        </div>
    )
}

const mapStateToProps = (state) => ({
    sport: state.sport,
    predictions: state.predictions,
    games: state.games,
    user: state.user
})

const mapDispatchToProps = {
    getUserPredictions,
    setGameWeek,
    submitTeaser,
}

export default connect(mapStateToProps, mapDispatchToProps)(Predictions)
