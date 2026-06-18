import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Button, Row, Col, Alert, Spin, message } from 'antd'
import { RefreshOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import WagerRow from './WagerRow'
import { submitWager, fetchWagers } from '../../redux/actions/predictionsActions'
import { fetchCurrentLines } from '../../redux/actions/gamesActions'
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

const PredictionStakesPredict = ({
  user,
  prediction,
  odds,
  games,
  game,
  gameCannotBeUpdated,
  submitWager,
  fetchWagers,
  fetchCurrentLines,
  hideModal
}) => {
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

  const currentLines = game?.currentLines || null
  const { sport, year, season, gameWeek, gameDate, gameId } = game

  const onChangeStakes = (stakeNumber, wagerType) => {
    const changeStakesFunction = wagerType === "ML" ? onChangeMLStakes : (wagerType === "ATS" ? onChangeATSStakes : onChangeOUStakes)
    const changeWagerFunction = wagerType === "ML" ? onChangeMLWager : (wagerType === "ATS" ? onChangeATSWager : onChangeOUWager)
    changeStakesFunction(stakeNumber);
    const defaultCurrencyStake = user.details?.defaultCurrencyStake ?? user.details?.currencyStakeValue ?? 100
    changeWagerFunction(stakeNumber * defaultCurrencyStake);
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

  const resetCurrency = (wagerType) => {
    if (wagerType === "ML") {
      onChangeMLStakes(0);
      onChangeMLWager(0);
      setMLLine(null);
    }
    if (wagerType === "ATS") {
      onChangeATSStakes(0);
      onChangeATSWager(0);
      setATSLine(null);
    }
    if (wagerType === "OU") {
      onChangeOUStakes(0);
      onChangeOUWager(0);
      setOULine(null);
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

  const onSubmitWager = async () => {
    // Validate that if there's a custom wager amount, the sportsbook is selected
    const alerts = {}
    if (MLWager > 0 && !MLLine) {
      alerts.ML = 'Please select a sportsbook.'
    }
    if (ATSWager > 0 && !ATSLine) {
      alerts.ATS = 'Please select a sportsbook.'
    }
    if (OUWager > 0 && !OULine) {
      alerts.OU = 'Please select a sportsbook.'
    }

    if (Object.keys(alerts).length > 0) {
      setWagerAlerts(alerts)
      return
    }

    if (MLWager > 0 || ATSWager > 0 || OUWager > 0) {
      setSubmittingWagers(true)
      let countSuccess = 0

      try {
        if (MLWager > 0 && MLLine) {
          const MLWagerObject = {
            wagerType: 'moneyline',
            currency: parseInt(MLWager),
            odds: MLLine['american odds'],
            sportsbookId: MLLine['sportsbook id'],
            sportsbookName: MLLine['name'],
            marketId: MLLine['market id'],
            participantId: MLLine["participant id"],
            'spreadTotal': MLLine['spread / total']
          }
          let submitWagerResult = await submitWager(game, prediction, MLWagerObject)
          if (submitWagerResult?.status === 200) {
            countSuccess++
            resetCurrency('ML')
          }
        }

        if (ATSWager > 0 && ATSLine) {
          const ATSWagerObject = {
            wagerType: 'spread',
            currency: parseInt(ATSWager),
            odds: ATSLine['american odds'],
            sportsbookId: ATSLine['sportsbook id'],
            sportsbookName: ATSLine['name'],
            marketId: ATSLine['market id'],
            participantId: ATSLine["participant id"],
            'spreadTotal': ATSLine['spread / total']
          }
          let predictionObj = { ...prediction }
          if (prediction.odds?.spread !== ATSLine['spread / total']) {
            predictionObj = {
              ...predictionObj,
              odds: {
                ...predictionObj.odds,
                spread: ATSLine['spread / total']
              }
            }
          }
          let submitWagerResult = await submitWager(game, predictionObj, ATSWagerObject)
          if (submitWagerResult?.status === 200) {
            countSuccess++
            resetCurrency('ATS')
          }
        }

        if (OUWager > 0 && OULine) {
          const OUWagerObject = {
            wagerType: 'total',
            currency: parseInt(OUWager),
            odds: OULine['american odds'],
            sportsbookId: OULine['sportsbook id'],
            sportsbookName: OULine['name'],
            marketId: OULine['market id'],
            participantId: OULine["participant id"],
            'spreadTotal': OULine['spread / total']
          }
          let predictionObj = { ...prediction }
          if (prediction.odds?.total !== OULine['spread / total']) {
            predictionObj = {
              ...predictionObj,
              odds: {
                ...predictionObj.odds,
                total: OULine['spread / total']
              }
            }
          }
          let submitWagerResult = await submitWager(game, predictionObj, OUWagerObject)
          if (submitWagerResult?.status === 200) {
            countSuccess++
            resetCurrency('OU')
          }
        }

        if (countSuccess > 0) {
          setWagersAccepted(true)
          message.success('Bets Accepted!')
        }
      } catch (err) {
        console.error(err)
        message.error('Failed to submit wagers.')
      } finally {
        setSubmittingWagers(false)
      }
    }
  }

  const handleRefreshOdds = async () => {
    setRefreshingOdds(true)
    try {
      await fetchCurrentLines(
        sport,
        year,
        season,
        gameWeek ? gameWeek : gameDate ? gameDate : 0,
        gameId,
        game.awayTeam.participantId,
        game.homeTeam.participantId
      )
      message.success('Odds Refreshed!')
    } catch (err) {
      console.error(err)
      message.error('Failed to refresh lines.')
    } finally {
      setRefreshingOdds(false)
    }
  }

  return game && currentLines ? (
    <div>
      <div style={{ backgroundColor: '#f6dfa4', padding: '10px 15px', borderRadius: '6px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: '700', color: '#231f20' }}>STAKES SYSTEM</span>
        <span style={{ fontSize: '13px', color: '#595959' }}>Predict and back your choice with currency wagers</span>
      </div>

      <div>
        {(odds.homeML || currentLines.moneyline?.length > 0) && MLWinnerId ? (
          <WagerRow
            wagerTitle={prediction && straightUpPredictionWager(game, prediction, true)}
            wagerType={"ML"}
            wagerAmount={MLWager}
            wagerStakes={MLStakes}
            wagerLine={MLLine}
            wagerWinnerId={MLWinnerId}
            game={game}
            prediction={prediction}
            gameCannotBeUpdated={gameCannotBeUpdated}
            onChangeStakes={onChangeStakes}
            onChangeWager={onChangeWager}
            onChangeOdds={onChangeOdds}
            resetStakes={resetStakes}
            wagerAlerts={wagerAlerts}
            currentLines={currentLines['moneyline']}
            loadingOdds={games.loadingOdds}
          />
        ) : (
          <PushRow odds={currentLines.moneyline?.length === 0 ? null : odds.homeML} oddsTitle={'the moneyline'} />
        )}

        {(odds.spread !== '' || currentLines.spread?.length > 0) && ATSWinnerId ? (
          <WagerRow
            wagerTitle={prediction && spreadPredictionWager(game, prediction, true)}
            wagerType={"ATS"}
            wagerAmount={ATSWager}
            wagerStakes={ATSStakes}
            wagerLine={ATSLine}
            wagerWinnerId={ATSWinnerId}
            game={game}
            prediction={prediction}
            gameCannotBeUpdated={gameCannotBeUpdated}
            onChangeStakes={onChangeStakes}
            onChangeWager={onChangeWager}
            onChangeOdds={onChangeOdds}
            resetStakes={resetStakes}
            wagerAlerts={wagerAlerts}
            currentLines={currentLines['spread']}
            loadingOdds={games.loadingOdds}
          />
        ) : (
          <PushRow odds={odds.spread} oddsTitle={'the spread'} />
        )}

        {(odds?.total !== '' || currentLines.total?.length > 0) && OUWinnerId ? (
          <WagerRow
            wagerTitle={prediction && totalPredictionWager(game, prediction, true)}
            wagerType={"OU"}
            wagerAmount={OUWager}
            wagerStakes={OUStakes}
            wagerLine={OULine}
            wagerWinnerId={OUWinnerId}
            game={game}
            prediction={prediction}
            currentLines={currentLines['total']}
            gameCannotBeUpdated={gameCannotBeUpdated}
            onChangeStakes={onChangeStakes}
            onChangeWager={onChangeWager}
            onChangeOdds={onChangeOdds}
            resetStakes={resetStakes}
            wagerAlerts={wagerAlerts}
            loadingOdds={games.loadingOdds}
          />
        ) : (
          <PushRow odds={odds.total} oddsTitle={'the over/under'} />
        )}
      </div>

      {wagersAccepted && (
        <Alert 
          message="BETS ACCEPTED!" 
          type="success" 
          showIcon 
          icon={<CheckCircleOutlined />} 
          style={{ margin: '15px 0' }} 
        />
      )}

      <Row gutter={16} style={{ marginTop: '20px' }}>
        <Col span={12}>
          <Button 
            type="primary" 
            block 
            size="large"
            disabled={submittingWagers || refreshingOdds || (MLWager === 0 && ATSWager === 0 && OUWager === 0)}
            loading={submittingWagers}
            onClick={onSubmitWager}
          >
            BET
          </Button>
        </Col>
        <Col span={12}>
          <Button 
            block 
            size="large"
            onClick={() => hideModal(false)}
          >
            Close
          </Button>
        </Col>
      </Row>

      <Button 
        type="dashed"
        block
        icon={<RefreshOutlined />}
        style={{ marginTop: '15px' }}
        onClick={handleRefreshOdds}
        loading={refreshingOdds}
        disabled={submittingWagers}
      >
        Refresh Betting Lines
      </Button>
    </div>
  ) : (
    <div style={{ textAlign: 'center', padding: '40px 0' }}>
      <Spin tip="Loading betting lines..." />
    </div>
  )
}

const mapStateToProps = (state) => ({
  user: state.user,
  games: state.games
})

const mapActionsToProps = {
  fetchWagers,
  fetchCurrentLines,
  submitWager
}

export default connect(mapStateToProps, mapActionsToProps)(PredictionStakesPredict)
