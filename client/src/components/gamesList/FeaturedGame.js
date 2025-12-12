import React from 'react';
import PropTypes from 'prop-types';
import { Card, Button, Typography, Row, Col, Tag } from 'antd';
import { FireOutlined, RightCircleOutlined } from '@ant-design/icons';
import './FeaturedGame.less';

const { Title, Text } = Typography;

const FeaturedGame = ({ game, onGameClick }) => {
    if (!game) return null;

    const { awayTeam, homeTeam, startDateTime } = game;
    const gameDate = new Date(startDateTime).toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });

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
                    </Col>
                </Row>

                <div className="cta-section">
                    <Button type="primary" size="large" shape="round" icon={<RightCircleOutlined />}>
                        Make Your Prediction
                    </Button>
                    <div className="engagement-text">
                        <Text type="secondary">Join the crowd and predict the winner!</Text>
                    </div>
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
