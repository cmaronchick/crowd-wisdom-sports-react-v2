import React, { Fragment } from 'react'
import {Modal, Typography} from 'antd'

const { Title, Text, Paragraph } = Typography


const OddsChangeModal = ({oddsChangeModalShow, toggleOddsChangeModal, oddsChangeModalDetails}) => {
    console.log('oddsChangeModalDetails', oddsChangeModalDetails)
    const { game, prediction } = oddsChangeModalDetails
    return (
        <Modal visible={oddsChangeModalShow} onOk={() => toggleOddsChangeModal()} onCancel={() => toggleOddsChangeModal()}>
            {game && prediction ? (
                <Fragment>
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
                </Fragment>
            ) : (<div>No odds change</div>)}
        </Modal>
    )
}

export default OddsChangeModal