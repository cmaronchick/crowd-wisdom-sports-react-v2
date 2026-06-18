import React, { Fragment } from 'react'
import { Row, Col, Input, Button, Spin, Tooltip, Badge } from 'antd'
import { CloseCircleOutlined } from '@ant-design/icons'
import StakeImage from '../../images/stake-image-blue-dual-ring.svg'
import { getWagerValueSignals } from '../../functions/oddsMovement'

const WagerRow = ({
  wagerTitle,
  wagerType,
  wagerStakes,
  wagerAmount,
  wagerLine,
  wagerWinnerId,
  loadingOdds,
  game,
  prediction,
  currentLines,
  gameCannotBeUpdated,
  onChangeWager,
  onChangeStakes,
  onChangeOdds,
  resetStakes,
  wagerAlerts
}) => {
  const displayLines = (currentLines || []).filter((item) => {
    const itemParticipantId = item?.['participant id'] ?? item?.participantId
    const isMatchingWinner = (wagerWinnerId !== undefined && wagerWinnerId !== null && itemParticipantId !== undefined && itemParticipantId !== null)
      ? String(wagerWinnerId) === String(itemParticipantId)
      : false

    if (!isMatchingWinner) {
      return false
    }

    if (item?.type === 'total') {
      const OUPrediction = prediction.homeTeam.score + prediction.awayTeam.score
      return OUPrediction !== item['spread / total']
    }

    if (item?.type === 'spread') {
      const ATSPrediction = prediction.homeTeam.score - prediction.awayTeam.score
      return ATSPrediction !== item['spread / total']
    }

    return true
  })

  const handleCustomWagerChange = (e) => {
    const value = e.target.value;
    onChangeWager(wagerType, value);
    resetStakes(wagerType);
  }

  const selectedSportsbookId = wagerLine?.['sportsbook id'] ?? wagerLine?.sportsbookId

  return (
    <div className="wager-row-container" style={{ margin: '15px 0', borderBottom: '1px solid #f0f0f0', paddingBottom: '15px' }}>
      <Row align="middle" gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <div style={{ fontWeight: '700', fontSize: '15px', color: '#1890ff', marginBottom: '8px' }}>
            {wagerTitle}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {!gameCannotBeUpdated && (
              <Fragment>
                <Tooltip title="Reset Stakes">
                  <Button 
                    shape="circle" 
                    icon={<CloseCircleOutlined />} 
                    size="small" 
                    onClick={() => onChangeStakes(0, wagerType)}
                  />
                </Tooltip>
                {[1, 2, 3].map((starNum) => {
                  const isSelected = wagerStakes >= starNum
                  return (
                    <img
                      key={starNum}
                      src={StakeImage}
                      alt={`Stake ${starNum}`}
                      onClick={() => onChangeStakes(starNum, wagerType)}
                      style={{
                        width: '24px',
                        height: '24px',
                        cursor: 'pointer',
                        opacity: isSelected ? 1 : 0.35,
                        transition: 'opacity 0.2s',
                        filter: isSelected ? 'drop-shadow(0px 2px 4px rgba(24, 144, 255, 0.45))' : 'none'
                      }}
                    />
                  )
                })}
              </Fragment>
            )}
            <Input
              style={{ width: '80px', marginLeft: '10px' }}
              value={wagerAmount > 0 ? wagerAmount : ''}
              placeholder="Custom"
              onChange={handleCustomWagerChange}
              disabled={gameCannotBeUpdated}
              type="number"
            />
          </div>
          {wagerAlerts && wagerAlerts[wagerType] && (
            <div style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '4px' }}>
              {wagerAlerts[wagerType]}
            </div>
          )}
        </Col>

        <Col xs={24} sm={16}>
          {loadingOdds ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
              <Spin size="small" />
            </div>
          ) : (displayLines && displayLines.length > 0) ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {displayLines.map((item) => {
                const itemSportsbookId = item?.['sportsbook id'] ?? item?.sportsbookId
                const isSelected = selectedSportsbookId !== undefined && String(selectedSportsbookId) === String(itemSportsbookId)
                const { betterLine, betterVig } = getWagerValueSignals({
                  wagerType,
                  item,
                  prediction,
                  wagerWinnerId,
                  game
                })
                const hasValueUpgrade = betterLine || betterVig
                const valueLabel = betterLine && betterVig ? 'Line + Vig Edge' : (betterLine ? 'Line Edge' : 'Vig Edge')
                const OUPrediction = prediction.homeTeam.score + prediction.awayTeam.score

                return (
                  <div 
                    key={`${itemSportsbookId}-${item.type}`}
                    onClick={() => onChangeOdds(wagerType, item)}
                    style={{
                      border: isSelected ? '2px solid #1890ff' : '1px solid #d9d9d9',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      backgroundColor: isSelected ? '#e6f7ff' : '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      minWidth: '110px',
                      boxShadow: isSelected ? '0 2px 8px rgba(24, 144, 255, 0.15)' : 'none',
                      transition: 'all 0.2s'
                    }}
                  >
                    <span style={{ fontWeight: '600', fontSize: '13px', color: isSelected ? '#1890ff' : '#262626' }}>
                      {item.name}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: '700', marginTop: '2px' }}>
                      {item['american odds'] > 0 ? `+${item['american odds']}` : item['american odds']}
                    </span>
                    {(wagerType === 'ATS' || wagerType === 'OU') && (
                      <span style={{ fontSize: '11px', color: '#8c8c8c', marginTop: '2px' }}>
                        {item['type'] === 'spread' ? (item['spread / total'] > 0 ? '+' : '') : ''}
                        {item['type'] === 'total' ? (OUPrediction > item['spread / total'] ? 'Over ' : 'Under ') : ''}
                        {item['spread / total']}
                      </span>
                    )}
                    {hasValueUpgrade && (
                      <Badge 
                        status="success" 
                        text={valueLabel} 
                        style={{ fontSize: '10px', marginTop: '4px', fontWeight: '600' }} 
                      />
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <div style={{ color: '#8c8c8c', fontSize: '13px', fontStyle: 'italic', padding: '10px 0' }}>
              No Odds Available from sportsbooks.
            </div>
          )}
        </Col>
      </Row>
    </div>
  )
}

export default WagerRow
