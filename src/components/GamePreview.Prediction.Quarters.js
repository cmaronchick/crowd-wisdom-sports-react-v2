import React, { PureComponent } from 'react';
import * as apis from '../apis'

const GameItemPredictionQuarters = ({game, prediction, periods, onChangeTextQuarters}) => {

  if (!game || !periods || !onChangeTextQuarters) {
    console.log(`CRITICAL DATA MISSING: game: ${!game ? 'missing' : 'present'} prediction: ${!prediction ? 'missing' : 'present'} periods: ${!periods ? 'missing' : 'present'} onChangeText: ${!onChangeTextQuarters ? 'missing' : 'present'}`);
    return (
      <div>CRITICAL DATA MISSING: game: {!game ? 'missing' : 'present'} prediction: {!prediction ? 'missing' : 'present'} periods: {!periods ? 'missing' : 'present'} onChangeText: {!onChangeTextQuarters ? 'missing' : 'present'}</div>
    )
  }
  const gameCannotBeUpdated = apis.gameCannotBeUpdated(game.startDateTime)
  
  return (
    <div style={{flex: 1}}>
    <div className="column">
      <div className="quartersRow" style={{justifyContent: 'center', backgroundColor: '#0a1f8f', paddingLeft: 3, paddingRight: 3, marginTop: 3, marginBottom: 3, display: 'flex', flexDirection: 'row'}}>
        <div className="quartersCol" style={{marginRight: 5, alignItems: 'center', color:'#fff'}}>Team</div>
        <div className="quartersCol" style={{alignItems: 'center', color:'#fff'}}>1</div>
        <div className="quartersCol" style={{alignItems: 'center', color:'#fff'}}>2</div>
        <div className="quartersCol" style={{alignItems: 'center', color:'#fff'}}>3</div>
        <div className="quartersCol" style={{alignItems: 'center', color:'#fff'}}>4</div>
      </div>
        {// show quarters results only if user has provided them in a prediction 
        gameCannotBeUpdated && prediction && (prediction.homeTeam.periods.length > 0 || prediction.awayTeam.periods.length > 0) ? (
          <div>
              <div className="quartersRow">
                <div className={`teamName ${game.awayTeam.code.toLowerCase()} secondary`}>{game.awayTeam.code}</div>
                <div className="quartersCol">
                  {prediction.awayTeam.periods.q1}
                </div>
                <div className="quartersCol">
                  {prediction.awayTeam.periods.q2}
                </div>
                <div className="quartersCol">
                  {prediction.awayTeam.periods.q3}
                </div>
                <div className="quartersCol">
                  {prediction.awayTeam.periods.q4}
                </div>
              </div>
              <div className="quartersRow">
                
                <div className={`teamName ${game.homeTeam.code.toLowerCase()} primary`}>{game.homeTeam.code}</div>
                <div className="quartersCol">
                  {prediction.homeTeam.periods.q1}
                </div>
                <div className="quartersCol">
                  {prediction.homeTeam.periods.q2}
                </div>
                <div className="quartersCol">
                  {prediction.homeTeam.periods.q3}
                </div>
                <div className="quartersCol">
                  {prediction.homeTeam.periods.q4}
                </div>
              </div>
          </div>
          ) : (
            <div>
                <div className="quartersRow">
                  
                  <div className={`teamName ${game.awayTeam.code.toLowerCase()} secondary`}>{game.awayTeam.code}</div>
                  <div className="quartersCol">
                    <input
                      value={(parseInt(periods.awayTeam.q1) || periods.awayTeam.q1 == "") ? periods.awayTeam.q1.toString() : prediction ? prediction.awayTeam.periods.q1.toString() : null}
                      placeholder={periods.awayTeam.q1 === null ? '##' : null}
                      onChange={value => onChangeTextQuarters('awayTeam', 'q1', value)}
                      className="inputPrediction inputText"
                      disabled={gameCannotBeUpdated}
                      keyboardtype='number-pad'
                      />
                  </div>
                  <div className="quartersCol">
                    <input
                      value={(periods.awayTeam.q2 || periods.awayTeam.q2 == "") ? periods.awayTeam.q2.toString() : prediction ? prediction.awayTeam.periods.q2.toString() : null}
                      placeholder={periods.awayTeam.q2 === null ? '##' : null}
                      onChange={event => onChangeTextQuarters('awayTeam', 'q2', event)} className="inputPrediction inputText"
                      disabled={gameCannotBeUpdated}
                      keyboardtype='number-pad'
                      />
                  </div>
                  <div className="quartersCol">
                    <input
                      value={(periods.awayTeam.q3 || periods.awayTeam.q3 == "") ? periods.awayTeam.q3.toString() : prediction ? prediction.awayTeam.periods.q3.toString() : null}
                      placeholder={periods.awayTeam.q3 === null ? '##' : null}
                      onChange={event => onChangeTextQuarters('awayTeam', 'q3', event)} className="inputPrediction inputText"
                      disabled={gameCannotBeUpdated}
                      keyboardtype='number-pad'
                      />
                  </div>
                  <div className="quartersCol">
                    <input
                      value={(periods.awayTeam.q4 || periods.awayTeam.q4 == "") ? periods.awayTeam.q4.toString() : prediction ? prediction.awayTeam.periods.q4.toString() : null}
                      placeholder={periods.awayTeam.q4 === null ? '##' : null}
                      onChange={value => onChangeTextQuarters('awayTeam', 'q4', value)} className="inputPrediction inputText"
                      disabled={gameCannotBeUpdated}
                      keyboardtype='number-pad'
                      />
                  </div>
                </div>
                <div className="quartersRow">
                  <div className={`teamName ${game.homeTeam.code.toLowerCase()} primary`}>{game.homeTeam.code}</div>
                  <div className="quartersCol">
                    <input
                      value={(periods.homeTeam.q1 || periods.homeTeam.q1 == "") ? periods.homeTeam.q1.toString() : prediction ? prediction.homeTeam.periods.q1.toString() : null}
                      placeholder={periods.homeTeam.q1 === null ? '##' : null}
                      onChange={value => onChangeTextQuarters('homeTeam', 'q1', value)} className="inputPrediction inputText"
                      disabled={gameCannotBeUpdated}
                      keyboardtype='number-pad'
                      />
                  </div>
                  <div className="quartersCol">
                    <input
                      value={(periods.homeTeam.q2 || periods.homeTeam.q2 == "") ? periods.homeTeam.q2.toString() : prediction ? prediction.homeTeam.periods.q2.toString() : null}
                      placeholder={periods.homeTeam.q2 === null ? '##' : null}
                      onChange={value => onChangeTextQuarters('homeTeam', 'q2', value)} className="inputPrediction inputText"
                      disabled={gameCannotBeUpdated}
                      keyboardtype='number-pad'
                      />
                  </div>
                  <div className="quartersCol">
                    <input
                      value={(periods.homeTeam.q3 || periods.homeTeam.q3 == "") ? periods.homeTeam.q3.toString() : prediction ? prediction.homeTeam.periods.q3.toString() : null}
                      placeholder={periods.homeTeam.q3 === null ? '##' : null}
                      onChange={value => onChangeTextQuarters('homeTeam', 'q3', value)} className="inputPrediction inputText"
                      disabled={gameCannotBeUpdated}
                      keyboardtype='number-pad'
                      />
                  </div>
                  <div className="quartersCol">
                    <input
                      value={(periods.homeTeam.q4 || periods.homeTeam.q4 == "") ? periods.homeTeam.q4.toString() : prediction ? prediction.homeTeam.periods.q4.toString() : null}
                      placeholder={periods.homeTeam.q4 === null ? '##' : null}
                      onChange={value => onChangeTextQuarters('homeTeam', 'q4', value)} className="inputPrediction inputText"
                      disabled={gameCannotBeUpdated}
                      keyboardtype='number-pad'
                      />
                  </div>
                </div>
            </div>
          )}
      </div>
    </div>
  )
}

export default GameItemPredictionQuarters