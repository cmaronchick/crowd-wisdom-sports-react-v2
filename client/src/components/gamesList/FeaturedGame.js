import React from 'react';
import PropTypes from 'prop-types';
import { Card, Button, Typography, Row, Col, Tag, Form, Input } from 'antd';
import { FireOutlined, RightCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import './FeaturedGame.less';
import { checkGameStart } from '../../functions/utils';

const { Title, Text } = Typography;

const FeaturedGame = ({ game, onGameClick, user, handleOnChangeGameScore, prediction, handleSubmitPrediction }) => {
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
                                style={{width: '100%'}}
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
                                style={{width: '100%'}}
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
                        disabled={!(userPrediction?.awayTeam && parseInt(userPrediction?.awayTeam.score) && userPrediction?.homeTeam && parseInt(userPrediction.homeTeam.score)) || userPrediction?.submitting}
                        loading={userPrediction && userPrediction.submitting}>
                        {game.prediction || userPrediction.submitted ? (
                            <span>Update</span>
                        ) : (
                            <span className="cta-button-disabled">Make Your Prediction</span>
                            
                        )}
                        {userPrediction.submitted && (
                            <CheckCircleOutlined style={{color: '#fff'}} />
                        )}
                    </Button>
                        {!game.prediction && !userPrediction.submitted && (
                            <div className="engagement-text">
                                <Text type="secondary">Join the crowd and predict the winner!</Text>
                            </div>
                        )}
                </div>
            </div>
        </Card>
    );
};

FeaturedGame.propTypes = {
    game: PropTypes.object.isRequired,
    onGameClick: PropTypes.func.isRequired,
};

export default FeaturedGame;
