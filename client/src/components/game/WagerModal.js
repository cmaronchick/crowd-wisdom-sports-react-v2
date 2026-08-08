import React, { useEffect, useRef } from 'react'
import { Modal } from 'antd'
import PredictionStakesPredict from './PredictionStakesPredict'
import WagerSlip from './WagerSlip'
import { connect } from 'react-redux'
import { submitWager, fetchWagers } from '../../redux/actions/predictionsActions'
import { fetchCurrentLines } from '../../redux/actions/gamesActions'

const WagerModal = ({ 
  showWagerModal,
  hideModal,
  prediction,
  games,
  game,
  odds,
  gameCannotBeUpdated,
  fetchCurrentLines,
  submitWager,
  user }) => {
  const lastFetchedGameIdRef = useRef(null)

  const gameId = game?.gameId
  const awayTeamId = game?.awayTeam?.participantId
  const homeTeamId = game?.homeTeam?.participantId
    
  useEffect(() => {
    if (!showWagerModal || !gameId) {
      if (!showWagerModal) {
        lastFetchedGameIdRef.current = null
      }
      return
    }

    if (lastFetchedGameIdRef.current === gameId) {
      return
    }

    const { sport, year, season, gameWeek } = game
    lastFetchedGameIdRef.current = gameId
    console.log('WagerModal useEffect', gameId)
    fetchCurrentLines(sport, year, season, gameWeek, gameId, awayTeamId, homeTeamId)
  }, [showWagerModal, gameId, awayTeamId, homeTeamId, fetchCurrentLines])

  if (!game) {
    return null
  }

  
  return (
    <Modal
      title={() => (
        <span style={{ fontSize: '18px', fontWeight: '600' }}>
          My Prediction: {
            prediction?.awayTeam?.score !== undefined && prediction?.homeTeam?.score !== undefined
              ? `(${game.awayTeam.code} ${prediction.awayTeam.score} vs ${game.homeTeam.code} ${prediction.homeTeam.score})`
              : `${game.awayTeam.code} vs ${game.homeTeam.code}`
          }
        </span>
  )}
      open={showWagerModal}
      onCancel={() => hideModal()}
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
            loadingOdds={games?.loadingOdds}

  // user,
  // prediction,
  // odds,
  // games,
  // game,
  // gameCannotBeUpdated,
  // submitWager,
  // fetchWagers,
  // fetchCurrentLines,
  // hideModal
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

const mapStateToProps = (state) => ({
  user: state.user,
  games: state.games.games
})

const mapActionsToProps = {
  submitWager,
  fetchWagers,
  fetchCurrentLines
}

export default connect(mapStateToProps, mapActionsToProps)(WagerModal)
