

import React from 'react'
import PropTypes from 'prop-types'

const propTypes = {
    
}

function GameOddsChart(props) {
    const { odds } = props.game;
    return (
        <div>
            Open: {(odds.history && odds.history.length > 0) ? `${odds.history[0].date} Spread: ${odds.history[0].spread} Total: ${odds.history[0].total}` : null}<br/>
            Last: {(odds.history && odds.history.length > 0) ? `${odds.history[odds.history.length-1].date} Spread: ${odds.history[odds.history.length-1].spread} Total: ${odds.history[odds.history.length-1].total}` : null}
        </div>
    )
}

GameOddsChart.propTypes = propTypes

export default GameOddsChart
