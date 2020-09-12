

import React from 'react'
import PropTypes from 'prop-types'
import {VictoryLine, VictoryChart, VictoryAxis} from 'victory'
import dayjs from 'dayjs'

const propTypes = {
    
}

const GameOddsChart = (props) => {
    const { game } = props;
    const { odds } = game;
    // console.log({odds});
    let firstSpread = {
        date: null,
        spread: null
    }, firstTotal = {
        date: null,
        spread: null
    }
    if (!odds.history || odds.history.length === 0) {
        return (
            <div></div>
        )
    }
    odds.history.forEach(odds => {
        if (!firstSpread.date && (odds.spread || odds.spread === 0 || odds.spread !== "")) {
            firstSpread = {
                date: odds.date,
                spread: odds.spread
            }
        }
        if (!firstTotal.date && (odds.total || odds.total !== "")) {
            firstTotal = {
                date: odds.date,
                total: odds.total
            }
        }
    })
    let labels = []
    let dataSpread = []
    let dataTotal = []
    if (odds && odds.history && odds.history.length > 0) {
        odds.history.forEach(odds => {
            let startDate = new Date(game.startDateTime)
            let firstOddsDate = new Date(new Date(game.startDateTime).getDate() - 14)
            let oddsDate = new Date(odds.date)
            // console.log({startDate: new Date(startDate.setDate(startDate.getDate() - 7)),
            // oddsDate: oddsDate,
            // compare: new Date(odds.date) >= new Date(startDate.setDate(startDate.getDate() - 7))});
            // if (new Date(odds.date) >= new Date(startDate.setDate(startDate.getDate()))) {
                labels.push(`${new Date(odds.date).getMonth() + 1}/${new Date(odds.date).getDate()}`)
                dataSpread.push(odds.spread ? odds.spread : null)
                dataTotal.push(odds.total ? odds.total : null)
            // }
        })
    }
    let spreadArray = []
    let totalArray = []
    odds.history.forEach(odds => {
        spreadArray.push({x: odds.date, y: odds.spread})
        totalArray.push({x: odds.date, y: odds.total})
    })
    // console.log({dataSpread});
    let dataSpreadMin = Math.min(...dataSpread),
        dataSpreadMax = Math.max(...dataSpread),
        dataTotalMin = Math.min(...dataTotal),
        dataTotalMax = Math.max(...dataTotal);

    let spreadMin = (dataSpreadMin > 0) ? 0 : Math.floor(dataSpreadMin * 1.5);
    let spreadMax = (dataSpreadMax > 0) ? Math.floor(dataSpreadMax * 1.5) : 0
    let totalMin = Math.floor(dataTotalMin * 0.5);
    let totalMax = Math.floor(dataTotalMax * 1.2);

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
    console.log({spreadMin, spreadMax, spreadArray, totalArray})
    return (
        <div className="chartContainer">
            <div>Open: {(odds.history && odds.history.length > 0) ? `${dayjs(firstSpread.date).format('MMMM DD')} Spread: ${firstSpread.spread} Total: ${firstTotal.total}` : null}</div>
            <div>Last: {(odds.history && odds.history.length > 0) ? `${dayjs(odds.history[odds.history.length-1].date).format('MMMM DD')} Spread: ${odds.history[odds.history.length-1].spread} Total: ${odds.history[odds.history.length-1].total}` : null}</div>            {game.predictions ? (
                <div>Number of Predictions: {game.predictions.length}</div>
            ) : null}
            {chartData && chartOptions && (
                game.oddsChartType === 'total' ? (
                <VictoryChart
                domain={{y: [0, totalMax]}}>
                    <VictoryAxis
                        tickCount={5}
                        tickFormat={(x) => dayjs(x).format('DD MMM')} />
                        <VictoryAxis dependentAxis />
                        <VictoryLine data={totalArray} />
                </VictoryChart>
                ) : (
                <VictoryChart
                domain={{y: spreadMin > spreadMax ? [spreadMax, spreadMin] :[spreadMin, spreadMax]}}>
                    <VictoryAxis
                        tickCount={5}
                        tickFormat={(x) => dayjs(x).format('DD MMM')} />
                        <VictoryAxis dependentAxis />
                        <VictoryLine data={spreadArray} />
                </VictoryChart>
                )
            )}
        </div>
    )
}


export default GameOddsChart;
