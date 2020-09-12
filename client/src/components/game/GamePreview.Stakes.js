import React, { Component } from 'react'
import { connect } from 'react-redux'
import StarRatingComponent from 'react-star-rating-component'
import StakeImage from '../../images/stake-image-dual-ring.png'
import { Row, Col, Typography } from 'antd'
import { changeStakesValue } from '../../redux/actions/predictionsActions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons'

const StakeIcon = ({className}) => {
    return (
      <img src={StakeImage} className={`stakeIcon ${className}`} alt="Stake" />
    )
  }

const { Title, Text, Paragraph } = Typography

export const GamePreviewStakes = (props) => {
    console.log('stake props', props)
    const { game, prediction } = props
    const { results } = game

    const handleOnChangeStakes = (stakeType, value) => {
        props.changeStakesValue(game.gameId, stakeType, value)
    }
    return (prediction && prediction.awayTeam.score && prediction.homeTeam.score) ? (
        <Row className="stakesRow">
            <Col span={window.innerWidth > 500 ? 12 : 24} className='stakesCol'>
            {window.innerWidth < 768 ? (
                <span className="stakesLabel">ATS:</span>
            ) : (
                <span className="stakesLabel">Spread: </span>
            )}
            {!results ? (
                <span>
                <input className="dv-star-rating-input" type="radio" name="starsSpread" id="starsSpread_0" value="0" style={{display: 'none', position: 'absolute', marginLeft: -9999}}></input>
                <label className="dv-star-rating-star dv-star-rating-empty-star dv-star-rating-null" htmlFor="starsSpread_0" >
                    {/* <i className="fa fa-minus-circle" aria-hidden="true" onClick={() => handleOnChangeStakes('spread', 0)}></i> */}
                    <FontAwesomeIcon icon={faMinusCircle} onClick={() => handleOnChangeStakes('spread', 0)} />
                </label>
                </span>
            ) : null}
            <StarRatingComponent 
                name={'spread'}
                className="starRatingComponent"
                editing={!results}
                renderStarIcon={(index) => {
                    console.log('prediction?.stars?.spread, index', prediction?.stars?.spread, index)
                    return (<StakeIcon className={`${prediction.stars && prediction.stars.spread >= index ? `stakeSelected ${results ? ((prediction && prediction.results && prediction.results.spread.correct === 1) ? 'stakeCorrect' : 'stakeIncorrect') : ''}` : "stakeUnselected"}`} />)
                }}
                value={(prediction && prediction.stars) ? prediction.stars.spread : 0}
                starCount={3}
                starColor={(!results || (prediction && prediction.results && prediction.results.spread.correct === 1)) ? '#124734' : '#e04403'} /* color of selected icons, default `#ffb400` */
                emptyStarColor={'#f6dfa4'}
                onStarClick={(value) => handleOnChangeStakes('spread', value)}
                />
            </Col>
            <Col span={window.innerWidth > 500 ? 12 : 24} className='stakes'>
            {window.innerWidth < 768 ? (
                <span className="stakesLabel">O/U:</span>
            ) : (
                <span className="stakesLabel">Total:</span>
            )} 
            {!results ? (
                <span>
                <input className="dv-star-rating-input" type="radio" name="starsSpread" id="starsTotal_0" value="0" style={{display: 'none', position: 'absolute', marginLeft: -9999}}></input>
                <label className="dv-star-rating-star dv-star-rating-empty-star dv-star-rating-null" htmlFor="starsTotal_0" >
                    {/* <i className="fa fa-minus-circle" aria-hidden="true" onClick={() => handleOnChangeStakes('total', 0)}></i> */}
                    <FontAwesomeIcon icon={faMinusCircle} onClick={() => handleOnChangeStakes('total', 0)} />
                </label>
                </span>
            ) : null}
            <StarRatingComponent 
                name='total'
                editing={!results}
                renderStarIcon={(index) => {
                    return (<StakeIcon className={`${prediction.stars && prediction.stars.total >= index ? `stakeSelected ${results ? ((prediction && prediction.results && prediction.results.total.correct === 1) ? 'stakeCorrect' : 'stakeIncorrect') : ''}` : "stakeUnselected"}`} />)
                }}
                value={(prediction && prediction.stars) ? prediction.stars.total : 0}
                starCount={3}
                starColor={(!results || (prediction && prediction.results && prediction.results.total.correct === 1)) ? '#124734' : '#e04403'} /* color of selected icons, default `#ffb400` */
                emptyStarColor={'#f6dfa4'}
                onStarClick={(value) => handleOnChangeStakes('total', value)}
                />
            </Col>
        </Row>
        ) : null
}

const mapStateToProps = (state) => ({
    
})

const mapDispatchToProps = {
    changeStakesValue
}

export default connect(mapStateToProps, mapDispatchToProps)(GamePreviewStakes)
