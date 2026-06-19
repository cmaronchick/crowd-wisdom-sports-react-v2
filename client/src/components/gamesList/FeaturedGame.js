import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card, Button, Typography, Row, Col, Tag, Form, Input } from 'antd';
import { FireOutlined, RightCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import './FeaturedGame.less';
import { checkGameStart } from '../../functions/utils';
import WagerModal from '../game/WagerModal'
import { straightUpPredictionWager, spreadPredictionWager, totalPredictionWager } from '../../functions/utils'

const PushRow = ({ odds, oddsTitle }) => {
    return (
        <div style={{ textAlign: 'center', padding: '10px 0', color: '#8c8c8c', fontStyle: 'italic' }}>
            {odds
                ? `You have predicted a push for ${oddsTitle}. Please update your prediction to make a wager.`
                : `There are no odds available for ${oddsTitle}. Please check back a little closer to game time!`}
        </div>
    )
}

const { Title, Text } = Typography;

const FeaturedGame = ({ game, onGameClick, user, handleOnChangeGameScore, prediction, handleSubmitPrediction, games }) => {

    const [showWagerModal, setShowWagerModal] = useState(false)
    const [MLWager, onChangeMLWager] = useState(0)
    const [MLStakes, onChangeMLStakes] = useState(0)
    const [MLLine, setMLLine] = useState(null)
    const [MLWinnerId, setMLWinnerId] = useState(() => {
        if (game && prediction) {
            if (prediction.awayTeam?.score > prediction.homeTeam?.score) {
                return game.awayTeam.participantId
            } else if (prediction.awayTeam?.score < prediction.homeTeam?.score) {
                return game.homeTeam.participantId
            }
        }
        return null
    })

    const [ATSWager, onChangeATSWager] = useState(0)
    const [ATSStakes, onChangeATSStakes] = useState(0)
    const [ATSLine, setATSLine] = useState(null)
    const [ATSWinnerId, setATSWinnerId] = useState(() => {
        if (game && prediction) {
            const spread = parseFloat(prediction.odds?.spread ?? game.odds?.spread ?? 0)
            if (prediction.awayTeam?.score > prediction.homeTeam?.score + spread) {
                return game.awayTeam.participantId
            } else if (prediction.awayTeam?.score < prediction.homeTeam?.score + spread) {
                return game.homeTeam.participantId
            }
        }
        return null
    })

    const [OUWager, onChangeOUWager] = useState(0)
    const [OUStakes, onChangeOUStakes] = useState(0)
    const [OULine, setOULine] = useState(null)
    // 15143 = over, 15144 = under
    const [OUWinnerId, setOUWinnerId] = useState(() => {
        if (game && prediction) {
            const total = parseFloat(prediction.odds?.total ?? game.odds?.total ?? 0)
            const predictedTotal = prediction.awayTeam?.score + prediction.homeTeam?.score
            if (predictedTotal > total) {
                return 15143
            } else if (predictedTotal < total) {
                return 15144
            }
        }
        return null
    })
    const [submittingWagers, setSubmittingWagers] = useState(false)
    const [wagerAlerts, setWagerAlerts] = useState({})
    const [wagersAccepted, setWagersAccepted] = useState(false)
    const [refreshingOdds, setRefreshingOdds] = useState(false)
    const onChangeStakes = (stakeNumber, wagerType) => {
        const changeStakesFunction = wagerType === "ML" ? onChangeMLStakes : (wagerType === "ATS" ? onChangeATSStakes : onChangeOUStakes)
        const changeWagerFunction = wagerType === "ML" ? onChangeMLWager : (wagerType === "ATS" ? onChangeATSWager : onChangeOUWager)
        changeStakesFunction(stakeNumber);
        const defaultCurrencyStake = user.details?.defaultCurrencyStake ?? user.details?.currencyStakeValue ?? 100
        changeWagerFunction(stakeNumber * defaultCurrencyStake);
    }

    const onChangeOdds = (lineType, line) => {
        if (lineType === 'ML') {
            if (MLWager > 0 && wagerAlerts.ML) {
                setWagerAlerts({ ...wagerAlerts, ML: null })
            }
            setMLLine(line)
        }
        if (lineType === 'ATS') {
            if (ATSWager > 0 && wagerAlerts.ATS) {
                setWagerAlerts({ ...wagerAlerts, ATS: null })
            }
            setATSLine(line)
        }
        if (lineType === 'OU') {
            if (OUWager > 0 && wagerAlerts.OU) {
                setWagerAlerts({ ...wagerAlerts, OU: null })
            }
            setOULine(line)
        }
    }

    const onChangeWager = (wagerType, wagerAmount) => {
        if (wagersAccepted) {
            setWagersAccepted(false)
        }
        const val = parseInt(wagerAmount) || 0
        if (wagerType === 'ML') {
            onChangeMLWager(val)
        }
        if (wagerType === 'ATS') {
            onChangeATSWager(val)
        }
        if (wagerType === 'OU') {
            onChangeOUWager(val)
        }
    }

    const resetStakes = (wagerType) => {
        if (wagerType === "ML") {
            onChangeMLStakes(0)
            setMLLine(null)
        }
        if (wagerType === "ATS") {
            onChangeATSStakes(0)
            setATSLine(null)
        }
        if (wagerType === "OU") {
            onChangeOUStakes(0)
            setOULine(null)
        }
    }

    if (!game) return null;

    const { awayTeam, homeTeam, startDateTime, gameId } = game;
    const gameDate = new Date(startDateTime).toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });
    const gameCannotBeUpdated = checkGameStart(startDateTime);
    const handleChangeGameScore = (e) => {
        handleOnChangeGameScore(gameId, e);
    }
    const { odds, currentLines } = game;

    // prediction && straightUpPredictionWager(game, prediction, true)}
    // wagerType={"ML"}
    // wagerAmount={MLWager}
    // wagerStakes={MLStakes}
    // wagerLine={MLLine}
    // wagerWinnerId={MLWinnerId}
    // game={game}
    // prediction={prediction}
    // gameCannotBeUpdated={gameCannotBeUpdated}
    // onChangeStakes={onChangeStakes}
    // onChangeWager={onChangeWager}
    // onChangeOdds={onChangeOdds}
    // resetStakes={resetStakes}
    // wagerAlerts={wagerAlerts}
    // currentLines={currentLines['moneyline']}
    // loadingOdds={games.loadingOdds}

    const userPrediction = {
        type: 'user',
        name: 'Me',
        ...prediction
    }
    const onSubmitPrediction = (event) => {
        event.preventDefault()
        const newprediction = {
            gameId: game.gameId,
            gameWeek: game.gameWeek,
            year: game.year,
            sport: game.sport,
            season: game.season,
            awayTeam: {
                fullName: game.awayTeam.fullName,
                shortName: game.awayTeam.shortName,
                code: game.awayTeam.code,
                score: userPrediction && userPrediction.awayTeam ? userPrediction.awayTeam.score : game.prediction.awayTeam.score,
            },
            homeTeam: {
                fullName: game.homeTeam.fullName,
                shortName: game.homeTeam.shortName,
                code: game.homeTeam.code,
                score: userPrediction && userPrediction.homeTeam ? userPrediction.homeTeam.score : game.prediction.homeTeam.score,
            },
            stars: userPrediction.stars ? {
                spread: userPrediction.stars.spread ? userPrediction.stars.spread : 0,
                total: userPrediction.stars.total ? userPrediction.stars.total : 0
            } : { spread: 0, total: 0 },
            odds: game.odds
        }
        handleSubmitPrediction(game.gameId, newprediction)
    }

    console.log('prediction :>> ', prediction);
    return (
        <Card className="featured-game-card" bordered={false}>
            <div className="featured-badge">
                <Tag color="#f50" icon={<FireOutlined />}>
                    TRENDING MATCHUP
                </Tag>
            </div>

            <div className="matchup-content" onClick={() => onGameClick(game.gameId)}>
                <Row align="middle" justify="center" gutter={[16, 16]}>
                    <Col xs={10} sm={8} className="team-col">
                        <div className={`team-logo-placeholder ${awayTeam.code.toLowerCase()} primary`}>
                            {awayTeam.code}
                        </div>
                        <Title level={3} className="team-name">{awayTeam.fullName}</Title>
                        <Form
                            initialValues={
                                {
                                    awayTeam: prediction?.awayTeam?.score ? prediction.awayTeam.score : null
                                }
                            }
                            name={`${game.gameId}awayTeam`}>
                            <Form.Item
                                name="awayTeam"
                                id={`${gameId}awayTeam`}>
                                <Input
                                    disabled={gameCannotBeUpdated || !user.authenticated}
                                    type="number"
                                    style={{ width: '100%' }}
                                    onChange={handleChangeGameScore}
                                    name='awayTeam'
                                    id={`${gameId}awayTeam_input`}
                                    placeholder={`${(!prediction || (prediction && !prediction.awayTeam) || (prediction && prediction.awayTeam && !prediction.awayTeam.score)) ? ('##') : null}`}
                                    value={(prediction && prediction?.awayTeam?.score !== null) ? prediction.awayTeam.score : ''}
                                />
                            </Form.Item>
                        </Form>
                    </Col>

                    <Col xs={4} sm={8} className="vs-col">
                        <Text className="vs-text">VS</Text>
                        <div className="game-time">{gameDate}</div>
                    </Col>

                    <Col xs={10} sm={8} className="team-col">
                        <div className={`team-logo-placeholder ${homeTeam.code.toLowerCase()} primary`}>
                            {homeTeam.code}
                        </div>
                        <Title level={3} className="team-name">{homeTeam.fullName}</Title>
                        <Form
                            initialValues={
                                {
                                    homeTeam: prediction?.homeTeam?.score ? prediction.homeTeam.score : null
                                }
                            }
                            name={`${game.gameId}homeTeam`}>
                            <Form.Item
                                name="homeTeam"
                                id={`${gameId}homeTeam`}>
                                <Input
                                    disabled={gameCannotBeUpdated || !user.authenticated}
                                    type="number"
                                    style={{ width: '100%' }}
                                    onChange={handleChangeGameScore}
                                    name='homeTeam'
                                    id={`${gameId}homeTeam_input`}
                                    placeholder={`${(!prediction || (prediction && !prediction.homeTeam) || (prediction && prediction.homeTeam && !prediction.homeTeam.score)) ? ('##') : null}`}
                                    value={(prediction && prediction?.homeTeam?.score !== null) ? prediction.homeTeam.score : ''}
                                />
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>

                <div className="cta-section">
                    <Button type="primary" size="large" shape="round" onClick={(e) => onSubmitPrediction(e)} icon={<RightCircleOutlined className={game.prediction || userPrediction.submitted ? "cta-button-icon" : "cta-button-disabled"} />}
                        disabled={!(userPrediction?.awayTeam && parseInt(userPrediction?.awayTeam?.score) && userPrediction?.homeTeam && parseInt(userPrediction.homeTeam.score)) || userPrediction?.submitting}
                        loading={userPrediction && userPrediction.submitting}>
                        {game.prediction || userPrediction.submitted ? (
                            <span>Update</span>
                        ) : (
                            <span className="cta-button-disabled">Make Your Prediction</span>

                        )}
                        {userPrediction.submitted && (
                            <CheckCircleOutlined style={{ color: '#fff' }} />
                        )}
                    </Button>
                    <Button type="default" size="large" shape="round" onClick={() => setShowWagerModal(true)} disabled={!game.odds || gameCannotBeUpdated || !user.authenticated} className="wager-button">
                        {game.odds ? (
                            <span>Make a Wager</span>
                        ) : (
                            <span className="cta-button-disabled">No Odds Available</span>
                        )}
                    </Button>
                    {!game.prediction && !userPrediction.submitted && (
                        <div className="engagement-text">
                            <Text type="secondary">Join the crowd and predict the winner!</Text>
                        </div>
                    )}
                </div>
            </div>
            <WagerModal
                showWagerModal={showWagerModal}
                game={game}
                odds={game.odds}
                hideModal={setShowWagerModal}
                gameCannotBeUpdated={gameCannotBeUpdated}
                user={user}
                prediction={prediction}
                handleOnChangeGameScore={handleOnChangeGameScore}
                handleSubmitPrediction={handleSubmitPrediction}
                games={games}
            />
        </Card>
    );
};

FeaturedGame.propTypes = {
    game: PropTypes.object.isRequired,
    onGameClick: PropTypes.func.isRequired,
};

export default FeaturedGame;
