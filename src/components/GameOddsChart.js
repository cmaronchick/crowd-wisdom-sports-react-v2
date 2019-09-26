

import React from 'react'
import PropTypes from 'prop-types'
import {Line} from 'react-chartjs-2'
import * as utils from '../utils'

const propTypes = {
    
}

function GameOddsChart(props) {
    const { game } = props;
    const { odds } = game;
    let labels = []
    let dataSpread = []
    let dataTotal = []
    if (game.odds && game.odds.history && game.odds.history.length > 0) {
        game.odds.history.forEach(odds => {
            labels.push(`${new Date(odds.date).getMonth() + 1}/${new Date(odds.date).getDate()}`)
            dataSpread.push(odds.spread ? odds.spread : null)
            dataTotal.push(odds.total ? odds.total : null)
        })
    }
    let dataSpreadMin = Math.min(...dataSpread),
        dataSpreadMax = Math.max(...dataSpread),
        dataTotalMin = Math.min(...dataTotal),
        dataTotalMax = Math.max(...dataTotal);

    let spreadMin = (dataSpreadMin > 0) ? Math.floor(dataSpreadMin * 0.5) : Math.floor(dataSpreadMin * 1.5);
    let spreadMax = (dataSpreadMax > 0) ? Math.floor(dataSpreadMax * 1.5) : Math.floor(dataSpreadMax * 0.5);
    let totalMin = Math.floor(dataTotalMin * 0.5);
    let totalMax = Math.floor(dataTotalMax * 1.2);
    console.log({spreadMin, spreadMax, totalMin, totalMax});

    let chartData = {
        labels: labels,
        datasets: [{
            label: 'Spread',
            yAxisID: 'spread',
            backgroundColor: '#124734',
            fill: false,
            data: dataSpread
        }, {
            label: 'Total',
            yAxisID: 'total',
            backgroundColor: '#e04403',
            fill: false,
            data: dataTotal
        }]
    }
    let chartOptions = {
            scales: {
                yAxes: [{
                    id: 'spread',
                    type: 'linear', 
                    position: 'left',
                    ticks: {
                        suggestedMin: spreadMin,
                        suggestedMax: spreadMax
                    }
                },{
                    id: 'total',
                    type: 'linear',
                    position: 'right',
                    ticks: {
                        suggestedMin: totalMin,
                        suggestedMax: totalMax
                    }
                }]
            }
        }
    console.log({chartData})
    return (
        <div>
            Open: {(odds.history && odds.history.length > 0) ? `${odds.history[0].date} Spread: ${odds.history[0].spread} Total: ${odds.history[0].total}` : null}<br/>
            Last: {(odds.history && odds.history.length > 0) ? `${odds.history[odds.history.length-1].date} Spread: ${odds.history[odds.history.length-1].spread} Total: ${odds.history[odds.history.length-1].total}` : null}<br/>
            Number of Predictions: {game.predictions.length}
            <Line data={chartData} options={chartOptions} />
        </div>
    )
}

GameOddsChart.propTypes = propTypes

export default GameOddsChart
