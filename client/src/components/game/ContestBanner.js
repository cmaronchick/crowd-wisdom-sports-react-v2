import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { Modal, Typography } from 'antd'

const { Title, Text } = Typography

const RulesText = () => (<span>See <Link to="/rules">Official Rules</Link> for a list of tiebreakers.</span>)

const ContestBanner = ({howToPlayModalOpen, toggleHowToPlayModal}) => {
    return (
        <Fragment>
        <div className="contestBanner">
            <span onClick={() => toggleHowToPlayModal()} style={{cursor: 'pointer'}}>Play and Win</span> | <Link to="/rules">Contest Rules</Link>
        </div>

        <Modal visible={howToPlayModalOpen} onOk={() => toggleHowToPlayModal()} onCancel={() => toggleHowToPlayModal()}>
                <Title>How to Play</Title>

                    <div className="howToPlayText">
                        <ol>
                            <li>Predict the final score for each game.</li>
                            <li>If you are feeling confident, you can wager "virtual" stakes on your prediction for either the spread, over/under, or both.</li>
                        </ol>
                    </div>
                <Title>How To Win</Title>
                    <Title level={2}>Prediction Score</Title>
                    <div className="howToPlayText">
                        You earn points by successfully predicting:
                        <ul>
                            <li>The winning team: 2 points</li>
                            <li>The spread side: 2 points</li>
                            <li>The over/under: 2 points</li>
                            <li>Any exact prediction: 1 point</li>
                            <ul>
                                <li>Away Team or Home Team Score</li>
                                <li>Final spread</li>
                                <li>Total combined score</li>
                            </ul>
                        </ul>
                        The user with the highest overall prediction score at the end of each week wins $25. <RulesText />
                    </div>
                    <Title level={2}>Stakes</Title>
                    <div className="howToPlayText">
                        <p>You win or lose stakes based on whether your prediction was correct or incorrect compared to the odds at the time of your prediction.</p>
                        <p>Your net total stakes is determined by subtracting the total stakes lost from the stakes won.</p>
                        <p>The user with the highest total stakes at the end of each week wins $25.<RulesText /></p>

                        
                    </div>

        </Modal>
        </Fragment>
    )
}

export default ContestBanner