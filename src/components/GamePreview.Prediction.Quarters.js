import React, { PureComponent } from 'react';
import * as apis from '../apis'

const GameItemPredictionQuarters = ({game, prediction, periods, onChangeTextQuarters}) => {

  if (!game || !periods || !onChangeTextQuarters) {
    console.log(`CRITICAL DATA MISSING: game: ${!game ? 'missing' : 'present'} prediction: ${!prediction ? 'missing' : 'present'} periods: ${!periods ? 'missing' : 'present'} onChangeText: ${!onChangeTextQuarters ? 'missing' : 'present'}`);
    return (
      <Text>CRITICAL DATA MISSING: game: {!game ? 'missing' : 'present'} prediction: {!prediction ? 'missing' : 'present'} periods: {!periods ? 'missing' : 'present'} onChangeText: {!onChangeTextQuarters ? 'missing' : 'present'}</Text>
    )
  }
  const gameCannotBeUpdated = apis.gameCannotBeUpdated(game.startDateTime)
  
  return (
    <Row style={{flex: 1}}>
    <Col>
      <Row style={{justifyContent: 'space-around', backgroundColor: '#0a1f8f', paddingVertical: 3, marginVertical: 3}}>
        <Col style={{marginRight: 5, alignItems: 'center'}}><Text style={{color:'#fff'}}>Team</Text></Col>
        <Col style={{alignItems: 'center'}}><Text style={{color:'#fff'}}>1</Text></Col>
        <Col style={{alignItems: 'center'}}><Text style={{color:'#fff'}}>2</Text></Col>
        <Col style={{alignItems: 'center'}}><Text style={{color:'#fff'}}>3</Text></Col>
        <Col style={{alignItems: 'center'}}><Text style={{color:'#fff'}}>4</Text></Col>
      </Row>
        {// show quarters results only if user has provided them in a prediction 
        gameCannotBeUpdated && prediction && (prediction.homeTeam.periods.length > 0 || prediction.awayTeam.periods.length > 0) ? (
          <Row>
            <Col>
              <Row style={GameItemStyles.quartersRow}>
                <Col style={[{justifyContent: 'center', alignItems: 'center', marginRight: 5},  TeamStyles[`${game.awayTeam.code}Secondary`]]}>
                  <Text style={{color: [TeamStyles[`${game.awayTeam.code}Secondary`]].color}}>{game.awayTeam.code}</Text>
                </Col>
                <Col style={GameItemStyles.quartersCol}>
                  <Text>{prediction.awayTeam.periods.q1}</Text>
                </Col>
                <Col style={GameItemStyles.quartersCol}>
                  <Text>{prediction.awayTeam.periods.q2}</Text>
                </Col>
                <Col style={GameItemStyles.quartersCol}>
                  <Text>{prediction.awayTeam.periods.q3}</Text>
                </Col>
                <Col style={GameItemStyles.quartersCol}>
                  <Text>{prediction.awayTeam.periods.q4}</Text>
                </Col>
              </Row>
              <Row style={GameItemStyles.quartersRow}>
                <Col style={[{justifyContent: 'center', alignItems: 'center', marginRight: 5},  TeamStyles[`${game.homeTeam.code}Primary`]]}>
                  <Text style={{color: [TeamStyles[`${game.homeTeam.code}Primary`]].color}}>{game.homeTeam.code}</Text>
                </Col>
                <Col style={GameItemStyles.quartersCol}>
                  <Text>{prediction.homeTeam.periods.q1}</Text>
                </Col>
                <Col style={GameItemStyles.quartersCol}>
                  <Text>{prediction.homeTeam.periods.q2}</Text>
                </Col>
                <Col style={GameItemStyles.quartersCol}>
                  <Text>{prediction.homeTeam.periods.q3}</Text>
                </Col>
                <Col style={GameItemStyles.quartersCol}>
                  <Text>{prediction.homeTeam.periods.q4}</Text>
                </Col>
              </Row>
            </Col>
          </Row>
          ) : (
            <Row>
              <Col>
                <Row style={GameItemStyles.quartersRow}>
                  <Col style={[{justifyContent: 'center', alignItems: 'center', marginRight: 5},  TeamStyles[`${game.awayTeam.code}Secondary`]]}>
                    <Text style={{color: [TeamStyles[`${game.awayTeam.code}Secondary`]].color}}>{game.awayTeam.code}</Text>
                  </Col>
                  <Col style={GameItemStyles.quartersCol}>
                    <Input
                      value={(parseInt(periods.awayTeam.q1) || periods.awayTeam.q1 == "") ? periods.awayTeam.q1.toString() : prediction ? prediction.awayTeam.periods.q1.toString() : null}
                      placeholder={periods.awayTeam.q1 === null ? '##' : null}
                      onChangeText={value => onChangeTextQuarters('awayTeam', 'q1', value)} style={[styles.inputPrediction, styles.inputText]}
                      disabled={gameCannotBeUpdated}
                      keyboardType='number-pad'
                      />
                  </Col>
                  <Col style={GameItemStyles.quartersCol}>
                    <Input
                      value={(periods.awayTeam.q2 || periods.awayTeam.q2 == "") ? periods.awayTeam.q2.toString() : prediction ? prediction.awayTeam.periods.q2.toString() : null}
                      placeholder={periods.awayTeam.q2 === null ? '##' : null}
                      onChangeText={value => onChangeTextQuarters('awayTeam', 'q2', value)} style={[styles.inputPrediction, styles.inputText]}
                      disabled={gameCannotBeUpdated}
                      keyboardType='number-pad'
                      />
                  </Col>
                  <Col style={GameItemStyles.quartersCol}>
                    <Input
                      value={(periods.awayTeam.q3 || periods.awayTeam.q3 == "") ? periods.awayTeam.q3.toString() : prediction ? prediction.awayTeam.periods.q3.toString() : null}
                      placeholder={periods.awayTeam.q3 === null ? '##' : null}
                      onChangeText={value => onChangeTextQuarters('awayTeam', 'q3', value)} style={[styles.inputPrediction, styles.inputText]}
                      disabled={gameCannotBeUpdated}
                      keyboardType='number-pad'
                      />
                  </Col>
                  <Col style={GameItemStyles.quartersCol}>
                    <Input
                      value={(periods.awayTeam.q4 || periods.awayTeam.q4 == "") ? periods.awayTeam.q4.toString() : prediction ? prediction.awayTeam.periods.q4.toString() : null}
                      placeholder={periods.awayTeam.q4 === null ? '##' : null}
                      onChangeText={value => onChangeTextQuarters('awayTeam', 'q4', value)} style={[styles.inputPrediction, styles.inputText]}
                      disabled={gameCannotBeUpdated}
                      keyboardType='number-pad'
                      />
                  </Col>
                </Row>
                <Row style={GameItemStyles.quartersRow}>
                  <Col style={[{justifyContent: 'center', alignItems: 'center', marginRight: 5},  TeamStyles[`${game.homeTeam.code}Primary`]]}>
                    <Text style={{color: [TeamStyles[`${game.homeTeam.code}Primary`]].color}}>{game.homeTeam.code}</Text>
                  </Col>
                  <Col style={GameItemStyles.quartersCol}>
                    <Input
                      value={(periods.homeTeam.q1 || periods.homeTeam.q1 == "") ? periods.homeTeam.q1.toString() : prediction ? prediction.homeTeam.periods.q1.toString() : null}
                      placeholder={periods.homeTeam.q1 === null ? '##' : null}
                      onChangeText={value => onChangeTextQuarters('homeTeam', 'q1', value)} style={[styles.inputPrediction, styles.inputText]}
                      disabled={gameCannotBeUpdated}
                      keyboardType='number-pad'
                      />
                  </Col>
                  <Col style={GameItemStyles.quartersCol}>
                    <Input
                      value={(periods.homeTeam.q2 || periods.homeTeam.q2 == "") ? periods.homeTeam.q2.toString() : prediction ? prediction.homeTeam.periods.q2.toString() : null}
                      placeholder={periods.homeTeam.q2 === null ? '##' : null}
                      onChangeText={value => onChangeTextQuarters('homeTeam', 'q2', value)} style={[styles.inputPrediction, styles.inputText]}
                      disabled={gameCannotBeUpdated}
                      keyboardType='number-pad'
                      />
                  </Col>
                  <Col style={GameItemStyles.quartersCol}>
                    <Input
                      value={(periods.homeTeam.q3 || periods.homeTeam.q3 == "") ? periods.homeTeam.q3.toString() : prediction ? prediction.homeTeam.periods.q3.toString() : null}
                      placeholder={periods.homeTeam.q3 === null ? '##' : null}
                      onChangeText={value => onChangeTextQuarters('homeTeam', 'q3', value)} style={[styles.inputPrediction, styles.inputText]}
                      disabled={gameCannotBeUpdated}
                      keyboardType='number-pad'
                      />
                  </Col>
                  <Col style={GameItemStyles.quartersCol}>
                    <Input
                      value={(periods.homeTeam.q4 || periods.homeTeam.q4 == "") ? periods.homeTeam.q4.toString() : prediction ? prediction.homeTeam.periods.q4.toString() : null}
                      placeholder={periods.homeTeam.q4 === null ? '##' : null}
                      onChangeText={value => onChangeTextQuarters('homeTeam', 'q4', value)} style={[styles.inputPrediction, styles.inputText]}
                      disabled={gameCannotBeUpdated}
                      keyboardType='number-pad'
                      />
                  </Col>
                </Row>
              </Col>
            </Row>
          )}
      </Col>
    </Row>
  )
}

export default GameItemPredictionQuarters