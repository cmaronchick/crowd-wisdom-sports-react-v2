import React from 'react'
import { AimOutlined } from '@ant-design/icons'

 export const straightUpResults = (results, prediction) => {
    return results.awayTeam && results.homeTeam && prediction.awayTeam && prediction.homeTeam ? ((results.awayTeam.score > results.homeTeam.score)
    ? (prediction.awayTeam.score > prediction.homeTeam.score)
      ? (<span className="resultTriangle resultWin"></span>)
      : (<span className="resultTriangle resultLoss"></span>)
      // : (<CloseOutlined className={`resultIcon resultLoss`} />)
    : (prediction.awayTeam.score < prediction.homeTeam.score)
    ? (<span className="resultTriangle resultWin"></span>)
    : (<span className="resultTriangle resultLoss"></span>)) : (<span style={{display: "none"}}>No prediction results yet</span>)
  }
  
  export const spreadResults = (odds, results, prediction) => {
    
    return results.awayTeam && results.homeTeam && prediction.awayTeam && prediction.homeTeam ? ((results.awayTeam.score > (results.homeTeam.score + odds.spread))
    ? (prediction.awayTeam.score > (prediction.homeTeam.score + odds.spread))
    ? (<span className={`resultTriangle resultWin`}></span>)
    : (<span className={`resultTriangle resultLoss`}></span>)
    : (prediction.awayTeam.score < (prediction.homeTeam.score + odds.spread))
    ? (<span className={`resultTriangle resultWin`}></span>)
    : (<span className={`resultTriangle resultLoss`}></span>)) :(<span style={{display: "none"}}>No prediction results yet</span>)
  }
  
  export const totalResults = (odds, results, prediction) => {
    // console.log('results, prediction', results, prediction)
    return results.awayTeam && results.homeTeam && prediction.awayTeam && prediction.homeTeam ? (((results.awayTeam.score + results.homeTeam.score) > odds.total)
    ? ((prediction.awayTeam.score + prediction.homeTeam.score) > odds.total)
    ? (<span className={`resultTriangle resultWin`}></span>)
    : (<span className={`resultTriangle resultLoss`}></span>)
    : ((prediction.awayTeam.score + prediction.homeTeam.score) < odds.total)
    ? (<span className={`resultTriangle resultWin`}></span>)
    : (<span className={`resultTriangle resultLoss`}></span>)) : (<span style={{display: "none"}}>No prediction results yet</span>)
  }

  export const checkBullseye = (prediction, actual) => {
    return (prediction === actual) ? (<AimOutlined />) : null
  }