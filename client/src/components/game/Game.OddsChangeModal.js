import React from 'react'
import {Modal, Typography} from 'antd'

const { Title, Text, Paragraph } = Typography


const OddsChangeModal = ({game, prediction, oddsChangeModalShow, handleOddsChangeModalHide}) => {
    return (
        <Modal show={oddsChangeModalShow} onHide={handleOddsChangeModalHide}>
              <Title>Odds Change Details</Title>
                <div className="oddsRow">
                    <div>
                        Your Odds:
                    </div>
                    <div>
                        Spread: {prediction.odds.spread}
                    </div>
                    <div>
                        Total: {prediction.odds.total}
                    </div>
                </div>
                <div className="oddsRow">
                    <div>
                        New Odds:
                    </div>
                    <div className={game.odds.spread !== prediction.odds.spread ? 'oddsChangeText' : null}>
                        Spread: {game.odds.spread}
                    </div>
                    <div className={game.odds.total !== prediction.odds.total ? 'oddsChangeText' : null}>
                        Total: {game.odds.total}
                    </div>
                </div>
        </Modal>
    )
}

export default OddsChangeModal