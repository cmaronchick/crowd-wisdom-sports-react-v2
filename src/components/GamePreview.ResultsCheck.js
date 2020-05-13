import React from 'react'

 export const straightUpResults = (results, prediction) => {
    return (results.awayTeam.score > results.homeTeam.score)
    ? (prediction.awayTeam.score > prediction.homeTeam.score)
      ? (<i className={`ion-md-checkmark resultIcon resultWin`}></i>)
      : (<i className={`ion-md-close resultIcon resultLoss`}></i>)
    : (prediction.awayTeam.score < prediction.homeTeam.score)
    ? (<i className={`ion-md-checkmark resultIcon resultWin`}></i>)
    : (<i className={`ion-md-close resultIcon resultLoss`}></i>)
  }
  
  export const spreadResults = (odds, results, prediction) => {
    return (results.awayTeam.score > (results.homeTeam.score + odds.spread))
    ? (prediction.awayTeam.score > (prediction.homeTeam.score + odds.spread))
      ? (<i className={`ion-md-checkmark resultIcon resultWin`}></i>)
      : (<i className={`ion-md-close resultIcon resultLoss`}></i>)
    : (prediction.awayTeam.score < (prediction.homeTeam.score + odds.spread))
    ? (<i className={`ion-md-checkmark resultIcon resultWin`}></i>)
    : (<i className={`ion-md-close resultIcon resultLoss`}></i>)
  }
  
  export const totalResults = (odds, results, prediction) => {
    return ((results.awayTeam.score + results.homeTeam.score) > odds.total)
    ? ((prediction.awayTeam.score + prediction.homeTeam.score) > odds.total)
      ? (<i className={`ion-md-checkmark resultIcon resultWin`}></i>)
      : (<i className={`ion-md-close resultIcon resultLoss`}></i>)
    : ((prediction.awayTeam.score + prediction.homeTeam.score) < odds.total)
    ? (<i className={`ion-md-checkmark resultIcon resultWin`}></i>)
    : (<i className={`ion-md-close resultIcon resultLoss`}></i>)
  }

  export const checkBullseye = (prediction, actual) => {
    return (prediction === actual) ? (<i className={`fas fa-bullseye bullseyeIcon`}></i>) : null
  }