import React, { Component } from 'react'
import { connect } from 'react-redux'
import StarRatingComponent from 'react-star-rating-component'
import StakeImage from '../../images/stake-image.svg'
import { Row, Col, Typography } from 'antd'

const StakeIcon = () => {
    return (
      <img src={StakeImage} className="stakeIcon" alt="Stake" />
    )
  }

const { Title, Text, Paragraph } = Typography

export const GamePreviewStakes = (props) => {
    const { game, prediction, gamePrediction} = props
    const { results } = game
  
    const handleOnChangeStarSpread = (event) => {
        props.onChangeStarSpread(game.gameId, event)
    }

    const handleOnChangeStarTotal = (event) => {
        props.onChangeStarTotal(game.gameId, event)
    }
    return ((prediction && prediction.awayTeam.score && prediction.homeTeam.score) || (gamePrediction && gamePrediction.predictionAwayTeamScore && gamePrediction.predictionHomeTeamScore)) ? (
        <Row style={{display: 'flex', flexDirection: 'rew', justifyContent: 'space-evenly'}}>
            <Col span={window.innerWidth > 500 ? 12 : 24} className='stakes'>
            <div>Spread: </div>
            {!results ? (
                <span>
                <input className="dv-star-rating-input" type="radio" name="starsSpread" id="starsSpread_0" value="0" style={{display: 'none', position: 'absolute', marginLeft: -9999}}></input>
                <label className="dv-star-rating-star dv-star-rating-empty-star dv-star-rating-null" htmlFor="starsSpread_0" >
                    <i className="fa fa-minus-circle" aria-hidden="true" onClick={handleOnChangeStarTotal}></i>
                </label>
                </span>
            ) : null}
            <StarRatingComponent 
                name={'starsSpread'}
                className="starRatingComponent"
                editing={!results}
                renderStarIcon={() => <StakeIcon/>}
                value={(gamePrediction && gamePrediction.stars) ? gamePrediction.stars.spread : (prediction && prediction.stars) ? prediction.stars.spread : 0}
                starCount={3}
                starColor={(!results || (prediction && prediction.results && prediction.results.spread.correct === 1)) ? '#124734' : '#e04403'} /* color of selected icons, default `#ffb400` */
                emptyStarColor={'#f6dfa4'}
                onStarClick={handleOnChangeStarSpread}
                />
            </Col>
            <Col span={window.innerWidth > 500 ? 12 : 24} className='stakes'>
            Total: 
            {!results ? (
                <span>
                <input className="dv-star-rating-input" type="radio" name="starsSpread" id="starsTotal_0" value="0" style={{display: 'none', position: 'absolute', marginLeft: -9999}}></input>
                <label className="dv-star-rating-star dv-star-rating-empty-star dv-star-rating-null" htmlFor="starsTotal_0" >
                    <i className="fa fa-minus-circle" aria-hidden="true" onClick={handleOnChangeStarTotal}></i>
                </label>
                </span>
            ) : null}
            <StarRatingComponent 
                name='starsTotal'
                editing={!results}
                renderStarIcon={() =><StakeIcon />}
                value={(gamePrediction && gamePrediction.stars) ? gamePrediction.stars.total : (prediction && prediction.stars) ? prediction.stars.total : 0}
                starCount={3}
                starColor={(!results || (prediction && prediction.results && prediction.results.total.correct === 1)) ? '#124734' : '#e04403'} /* color of selected icons, default `#ffb400` */
                emptyStarColor={'#f6dfa4'}
                onStarClick={handleOnChangeStarTotal}
                />
            </Col>
        </Row>
        ) : null
}

const mapStateToProps = (state) => ({
    
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(GamePreviewStakes)
