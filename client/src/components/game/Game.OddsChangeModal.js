import React from 'react'
import {Modal} from 'antd'

const OddsChangeModal = ({game, prediction, oddsChangeModalShow, handleOddsChangeModalHide}) => {
    return (
        <Modal show={oddsChangeModalShow} onHide={handleOddsChangeModalHide}>
            <Modal.Header closeButton>
              <Modal.Title>Odds Change Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
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
            </Modal.Body>
        </Modal>
    )
}

export default OddsChangeModal