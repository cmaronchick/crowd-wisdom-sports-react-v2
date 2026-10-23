const toNumber = (value) => {
  if (value === null || value === undefined || value === '') {
    return null
  }
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric : null
}

const selectedSpreadLine = (spread, pickedAway) => {
  const spreadNumber = toNumber(spread)
  if (spreadNumber === null || pickedAway === null) {
    return null
  }
  return pickedAway ? spreadNumber * -1 : spreadNumber
}

const selectedSpreadLineForWager = (spread, wagerWinnerId, game) => {
  if (!game) {
    return null
  }
  const pickedAway = wagerWinnerId === game.awayTeam?.participantId
  const pickedHome = wagerWinnerId === game.homeTeam?.participantId
  if (!pickedAway && !pickedHome) {
    return null
  }
  return selectedSpreadLine(spread, pickedAway)
}

const isBetterAmericanOdds = (candidateOdds, baselineOdds) => {
  const candidate = toNumber(candidateOdds)
  const baseline = toNumber(baselineOdds)
  if (candidate === null || baseline === null) {
    return false
  }
  // Higher american odds is always better for bettor payout (+120 > +110, -105 > -110)
  return candidate > baseline
}

export const getWagerValueSignals = ({ wagerType, item, prediction, wagerWinnerId, game }) => {
  if (!prediction || !prediction.odds || !item) {
    return { betterLine: false, betterVig: false }
  }

  if (wagerType === 'ATS') {
    const baselineLine = selectedSpreadLineForWager(prediction.odds.spread, wagerWinnerId, game)
    const candidateLine = selectedSpreadLineForWager(item['spread / total'], wagerWinnerId, game)
    const betterLine = baselineLine !== null && candidateLine !== null ? candidateLine > baselineLine : false
    const betterVig = isBetterAmericanOdds(item['american odds'], prediction.odds.spreadOdds)
    return { betterLine, betterVig }
  }

  if (wagerType === 'OU') {
    const baselineTotal = toNumber(prediction.odds.total)
    const candidateTotal = toNumber(item['spread / total'])
    const predictionTotal = toNumber(prediction.total)
    const pickedOver = predictionTotal !== null && baselineTotal !== null ? predictionTotal > baselineTotal : null
    const pickedUnder = predictionTotal !== null && baselineTotal !== null ? predictionTotal < baselineTotal : null
    const betterLine = baselineTotal !== null && candidateTotal !== null
      ? (pickedOver ? candidateTotal < baselineTotal : (pickedUnder ? candidateTotal > baselineTotal : false))
      : false
    const betterVig = isBetterAmericanOdds(item['american odds'], prediction.odds.totalOdds)
    return { betterLine, betterVig }
  }

  return { betterLine: false, betterVig: false }
}

export const getOddsMovementSummary = (game, prediction) => {
  if (!game || !prediction || !prediction.odds) {
    return []
  }

  const messages = []
  const predictedAwayScore = toNumber(prediction.awayTeam?.score)
  const predictedHomeScore = toNumber(prediction.homeTeam?.score)

  const originalSpread = toNumber(prediction.odds.spread)
  const currentSpread = toNumber(game.odds?.spread)
  const pickedAwaySpread =
    predictedAwayScore !== null &&
    predictedHomeScore !== null &&
    originalSpread !== null
      ? predictedAwayScore > (predictedHomeScore + originalSpread)
      : null

  if (originalSpread !== null && currentSpread !== null && pickedAwaySpread !== null && originalSpread !== currentSpread) {
    const originalSelectedLine = selectedSpreadLine(originalSpread, pickedAwaySpread)
    const currentSelectedLine = selectedSpreadLine(currentSpread, pickedAwaySpread)
    const selectedTeamCode = pickedAwaySpread ? game.awayTeam?.code : game.homeTeam?.code

    if (originalSelectedLine !== null && currentSelectedLine !== null && selectedTeamCode) {
      if (currentSelectedLine > originalSelectedLine) {
        messages.push({ type: 'positive', text: `Spread improved for your ${selectedTeamCode} pick.` })
      } else {
        messages.push({ type: 'negative', text: `Spread moved against your ${selectedTeamCode} pick.` })
      }
    }
  }

  const originalTotal = toNumber(prediction.odds.total)
  const currentTotal = toNumber(game.odds?.total)
  const predictedTotal = predictedAwayScore !== null && predictedHomeScore !== null ? predictedAwayScore + predictedHomeScore : null
  const pickedOver = predictedTotal !== null && originalTotal !== null ? predictedTotal > originalTotal : null
  const pickedUnder = predictedTotal !== null && originalTotal !== null ? predictedTotal < originalTotal : null

  if (originalTotal !== null && currentTotal !== null && originalTotal !== currentTotal && (pickedOver || pickedUnder)) {
    if ((pickedOver && currentTotal < originalTotal) || (pickedUnder && currentTotal > originalTotal)) {
      messages.push({ type: 'positive', text: 'Total improved for your pick.' })
    } else {
      messages.push({ type: 'negative', text: 'Total moved against your pick.' })
    }
  }

  const originalSpreadOdds = toNumber(prediction.odds.spreadOdds)
  const currentSpreadOdds = toNumber(game.odds?.spreadOdds)
  if (originalSpreadOdds !== null && currentSpreadOdds !== null && originalSpreadOdds !== currentSpreadOdds) {
    if (currentSpreadOdds > originalSpreadOdds) {
      messages.push({ type: 'positive', text: 'Spread vig improved.' })
    }
  }

  const originalTotalOdds = toNumber(prediction.odds.totalOdds)
  const currentTotalOdds = toNumber(game.odds?.totalOdds)
  if (originalTotalOdds !== null && currentTotalOdds !== null && originalTotalOdds !== currentTotalOdds) {
    if (currentTotalOdds > originalTotalOdds) {
      messages.push({ type: 'positive', text: 'Total vig improved.' })
    }
  }

  return messages
}
