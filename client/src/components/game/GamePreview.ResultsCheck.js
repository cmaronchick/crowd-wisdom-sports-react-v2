import React from 'react'
import { CheckOutlined, CloseOutlined, AimOutlined } from '@ant-design/icons'

 export const straightUpResults = (results, prediction) => {
    return (results.awayTeam.score > results.homeTeam.score)
    ? (prediction.awayTeam.score > prediction.homeTeam.score)
      ? (<span className="resultTriangle resultWin"></span>)
      : (<span className="resultTriangle resultLoss"></span>)
      // : (<CloseOutlined className={`resultIcon resultLoss`} />)
    : (prediction.awayTeam.score < prediction.homeTeam.score)
    ? (<span className="resultTriangle resultWin"></span>)
    : (<span className="resultTriangle resultLoss"></span>)
  }
  
  export const spreadResults = (odds, results, prediction) => {
    console.log('prediction', prediction)
    return (results.awayTeam.score > (results.homeTeam.score + odds.spread))
    ? (prediction.awayTeam.score > (prediction.homeTeam.score + odds.spread))
    ? (<span className={`resultTriangle resultWin`}></span>)
    : (<span className={`resultTriangle resultLoss`}></span>)
    : (prediction.awayTeam.score < (prediction.homeTeam.score + odds.spread))
    ? (<span className={`resultTriangle resultWin`}></span>)
    : (<span className={`resultTriangle resultLoss`}></span>)
  }
  
  export const totalResults = (odds, results, prediction) => {
    return ((results.awayTeam.score + results.homeTeam.score) > odds.total)
    ? ((prediction.awayTeam.score + prediction.homeTeam.score) > odds.total)
    ? (<span className={`resultTriangle resultWin`}></span>)
    : (<span className={`resultTriangle resultLoss`}></span>)
    : ((prediction.awayTeam.score + prediction.homeTeam.score) < odds.total)
    ? (<span className={`resultTriangle resultWin`}></span>)
    : (<span className={`resultTriangle resultLoss`}></span>)
  }

  export const checkBullseye = (prediction, actual) => {
    return (prediction === actual) ? (<i className={`fas fa-bullseye bullseyeIcon`}></i>) : null
  }