

import React from 'react'
import PropTypes from 'prop-types'
import {VictoryLine, VictoryChart, VictoryAxis, VictoryTheme, VictoryVoronoiContainer} from 'victory'
import dayjs from 'dayjs'


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
    let firstOddsDate = new Date(new Date(game.startDateTime) - (1000 * 60 * 60 * 24 * 14))
    let oddsHistoryLength = odds.history ? odds.history.length : 0
    if (odds && odds.history && odds.history.length > 0) {
        odds.history.forEach(oddsElement => {
            // let firstOddsDate = new Date(new Date(game.startDateTime) - (1000 * 60 * 60 * 24 * 14))
            if (oddsHistoryLength < 14 || (new Date(oddsElement.date) >= firstOddsDate)) {
                labels.push(`${new Date(oddsElement.date).getMonth() + 1}/${new Date(oddsElement.date).getDate()}`)
                dataSpread.push(oddsElement.spread ? oddsElement.spread : null)

                dataTotal.push(oddsElement.total ? oddsElement.total : null)
            }
        })
    }
    
  let spreadArray = []
  let totalArray = []
  let dateTicks = []
  odds.history.sort((a,b) => a.date > b.date ? -1 : 1)
  odds.history.forEach(odds => {
    let oddsLength = 1;
    // console.log(`odds.date`, odds.date)
        
      if (oddsLength < 15) {
        spreadArray.push({x: odds.date, y: odds.spread})
        if (odds.total && odds.total > 0) {
          totalArray.push({x: odds.date, y: odds.total})
        }
        dateTicks.push(odds.date)
        oddsLength++;
      }
  })
  // console.log(`spreadArray`, spreadArray)
  dateTicks.sort((a,b) => a < b ? -1 : 1)
  spreadArray.sort((a,b) => a.x < b.x ? -1 : 1)
  totalArray.sort((a,b) => a.x < b.x ? -1 : 1)
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
    // console.log({spreadMin, spreadMax, spreadArray, totalArray})
    console.log(`spreadArray, spreadMin, spreadMax, totalMax`, spreadArray, spreadMin, spreadMax, totalMax)
    return (
        <div className="chartContainer">
            <div>Open: {(odds.history && odds.history.length > 0) ? `${dayjs(firstSpread.date).format('MMMM DD')} Spread: ${firstSpread.spread} Total: ${firstTotal.total}` : null}</div>
            <div>Last: {(odds.history && odds.history.length > 0) ? `${dayjs(odds.history[odds.history.length-1].date).format('MMMM DD')} Spread: ${odds.history[odds.history.length-1].spread} Total: ${odds.history[odds.history.length-1].total}` : null}</div>            {game.predictions ? (
                <div>Number of Predictions: {game.predictions.length}</div>
            ) : null}
            {chartData && chartOptions && (
                game.oddsChartType === 'total' ? (
                <VictoryChart
                domain={{y: [0, totalMax]}}
                animate={{
                    duration: 500,
                    easing: 'linear'
                }}
                containerComponent={
                    <VictoryVoronoiContainer
                      labels={({ datum }) => `${datum.y}`}
                    />}>
                    <VictoryAxis
                        tickCount={5}
                        tickFormat={(x) => dayjs(x).format('DD MMM')} />
                        <VictoryAxis dependentAxis />
                        <VictoryLine data={totalArray} style={{
                            data: {stroke: '#cc2936'},
                            parent: { backgroundColor: "#fff"}
                        }} />
                </VictoryChart>
                ) : (
                <VictoryChart
                animate={{
                    duration: 500,
                    easing: 'linear'
                }}
                containerComponent={
                    <VictoryVoronoiContainer
                        labels={({ datum }) => `${datum.y}`}
                    />}
                theme={VictoryTheme.material}
                domain={{y: spreadMin > spreadMax ? [spreadMax, spreadMin] :[spreadMin, spreadMax]}}>
                    <VictoryAxis
                        tickCount={5}
                        tickFormat={(x) => dayjs(x).format('DD MMM')} />
                        <VictoryAxis dependentAxis />
                        <VictoryLine data={spreadArray} style={{
                            data: {stroke: '#3d5a80'},
                            parent: { backgroundColor: "#fff"}
                        }} />
                </VictoryChart>
                )
            )}
        </div>
    )
}


export default GameOddsChart;
