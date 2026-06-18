import React from 'react'
import { Modal } from 'antd'
import PredictionStakesPredict from './PredictionStakesPredict'
import WagerSlip from './WagerSlip'

const WagerModal = ({ showWagerModal, hideModal, prediction, game, odds, gameCannotBeUpdated }) => {
  return (
    <Modal
      title={
        <span style={{ fontSize: '18px', fontWeight: '600' }}>
          My Prediction: {
            prediction?.awayTeam?.score !== undefined && prediction?.homeTeam?.score !== undefined
              ? `(${game.awayTeam.code} ${prediction.awayTeam.score} vs ${game.homeTeam.code} ${prediction.homeTeam.score})`
              : `${game.awayTeam.code} vs ${game.homeTeam.code}`
          }
        </span>
      }
      visible={showWagerModal}
      onCancel={() => hideModal(false)}
      footer={null}
      width={750}
      className="wager-modal"
      centered
      destroyOnClose
    >
      <div style={{ minHeight: '300px', padding: '10px 0' }}>
        {!gameCannotBeUpdated ? (
          <PredictionStakesPredict 
            prediction={prediction}
            odds={odds}
            game={game}
            gameCannotBeUpdated={gameCannotBeUpdated}
            hideModal={hideModal}
          />
        ) : (
          <WagerSlip
            prediction={prediction}
            game={game}
            hideModal={hideModal}
          />
        )}
        <div style={{ marginTop: '20px', borderTop: '1px solid #f0f0f0', paddingTop: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8c8c8c', fontSize: '12px', textAlign: 'center' }}>
          <span style={{ marginRight: '8px', color: '#ff4d4f', fontWeight: 'bold' }}>NOTE:</span>
          Wagering is for entertainment purposes only. There is no connection to actual sportsbooks.
        </div>
      </div>
    </Modal>
  )
}

export default WagerModal
