

import React from 'react'
import PropTypes from 'prop-types'
import {VictoryLine, VictoryChart, VictoryAxis, VictoryTheme, VictoryVoronoiContainer} from 'victory'
import dayjs from 'dayjs'


const GameOddsChart = (props) => {
    const { game, chartType } = props;
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
    let dataSpreadVig = []
    let dataTotal = []
    let dataTotalVig = []
    let firstOddsDate = new Date(new Date(game.startDateTime) - (1000 * 60 * 60 * 24 * 14))
    let oddsHistoryLength = odds.history ? odds.history.length : 0
    if (odds && odds.history && odds.history.length > 0) {
        odds.history.forEach(oddsElement => {
            // let firstOddsDate = new Date(new Date(game.startDateTime) - (1000 * 60 * 60 * 24 * 14))
            if ((oddsHistoryLength < 14 || (new Date(oddsElement.date) >= firstOddsDate)) && (oddsElement.spread !== '' || oddsElement.total !== '')) {
                labels.push(`${new Date(oddsElement.date).getMonth() + 1}/${new Date(oddsElement.date).getDate()}`)
                if (oddsElement.spread !== '') {
                    dataSpread.push(oddsElement.spread !== '' ? oddsElement.spread : null)
                    dataSpreadVig.push(oddsElement.spreadOdds !== '' ? ((100/Math.abs(oddsElement.spreadOdds)) + 1).toFixed(2) : null)
                }
                if (oddsElement.total !== '') {
                    dataTotal.push(oddsElement.total ? oddsElement.total : null)
                    dataTotalVig.push(oddsElement.totalOdds !== '' ? ((100/Math.abs(oddsElement.spreadOdds)) + 1).toFixed(2) : null)
                }
            }
        })
    }
    
  let spreadArray = []
  let spreadVigArray = []
  let totalArray = []
  let totalVigArray = []
  let dateTicks = []
  odds.history.sort((a,b) => a.date > b.date ? -1 : 1)
  odds.history.forEach(odds => {
    let oddsLength = 1;
    const { date, spread, spreadOdds, total, totalOdds } = odds
        
      if (oddsLength < 15) {
        if (spread !== '') {
            spreadArray.push({x: odds.date, y: odds.spread})
            if (Number.isInteger(odds.spreadOdds)) {
                let spreadDecimalOdds = (100/Math.abs(odds.spreadOdds)) + 1;

                spreadVigArray.push({x: odds.date, y: spreadDecimalOdds})
            }
        }
        if (odds.total !== '' && odds.total > 0) {
            totalArray.push({x: odds.date, y: odds.total})
            if (Number.isInteger(odds.totalOdds)) {
                let totalDecimalOdds = (100/Math.abs(odds.totalOdds)) + 1;
                console.log(`totalDecimalOdds`, totalDecimalOdds)
                totalVigArray.push({x: odds.date, y: totalDecimalOdds})
            }
        }
        if (odds.spread !== '' && odds.total !== '') {
            dateTicks.push(odds.date)
            oddsLength++;
        }
      }
  })
  // console.log(`spreadArray`, spreadArray)
  dateTicks.sort((a,b) => a < b ? -1 : 1)
  spreadArray.sort((a,b) => a.x < b.x ? -1 : 1)
  spreadVigArray.sort((a,b) => a.x < b.x ? -1 : 1)
  totalArray.sort((a,b) => a.x < b.x ? -1 : 1)
  totalVigArray.sort((a,b) => a.x < b.x ? -1 : 1)
    // console.log({dataSpread});
    let dataSpreadMin = Math.min(...dataSpread),
        dataSpreadMax = Math.max(...dataSpread),
        dataSpreadVigMin = Math.min(...dataSpreadVig),
        dataSpreadVigMax = Math.max(...dataSpreadVig),
        dataTotalMin = Math.min(...dataTotal),
        dataTotalMax = Math.max(...dataTotal),
        dataTotalVigMin = Math.min(...dataTotalVig),
        dataTotalVigMax = Math.max(...dataTotalVig);

    let spreadMin = (dataSpreadMin > 0) ? 0 : Math.floor(dataSpreadMin * 1.5);
    let spreadMax = (dataSpreadMax > 0) ? Math.floor(dataSpreadMax * 1.5) : 0;
    let spreadVigMin = (dataSpreadVigMin > 0) ? 100 : Math.floor(dataSpreadVigMin * 1.5);
    let spreadVigMax = Math.floor(dataSpreadVigMax * 1.5);
    let totalMin = Math.floor(dataTotalMin * 0.5);
    let totalMax = Math.floor(dataTotalMax * 1.2);
    let totalVigMin = 0;
    let totalVigMax = Math.floor(dataTotalVigMax * 1.5);
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
    
    console.log(`dataTotalVig, totalVigArray`, dataTotalVig, totalVigArray, totalVigMax)
    return (
        <div className="chartContainer">
            <div>Open: {(odds.history && odds.history.length > 0) ? `${dayjs(firstSpread.date).format('MMMM DD')} Spread: ${firstSpread.spread} Total: ${firstTotal.total}` : null}</div>
            <div>Last: {(odds.history && odds.history.length > 0) ? `${dayjs(odds.history[odds.history.length-1].date).format('MMMM DD')} Spread: ${odds.history[odds.history.length-1].spread} Total: ${odds.history[odds.history.length-1].total}` : null}</div>            {game.predictions ? (
                <div>Number of Predictions: {game.predictions.length}</div>
            ) : null}
            {chartData && chartOptions && (
                chartType === 'total' ? (
                <VictoryChart
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
                        <VictoryAxis dependentAxis
                        domain={{y: [0, totalMax]}} />
                        <VictoryLine data={totalArray} style={{
                            data: {stroke: '#cc2936'},
                            parent: { backgroundColor: "#fff"}
                        }} />
                </VictoryChart>
                ) : chartType === 'spread' ? (
                    <VictoryChart
                    animate={{
                        duration: 500,
                        easing: 'linear'
                    }}
                    containerComponent={
                        <VictoryVoronoiContainer
                            labels={({ datum }) => `${datum.y}`}
                        />}
                    theme={VictoryTheme.material}>
                        <VictoryAxis
                            tickCount={5}
                            tickFormat={(x) => dayjs(x).format('DD MMM')} />
                        <VictoryAxis dependentAxis
                        tickValues={dataSpread}
                        domain={{y: spreadMin > spreadMax ? [spreadMax, spreadMin] :[spreadMin, spreadMax]}} />
                            
                        <VictoryLine data={spreadArray} style={{
                            data: {stroke: '#3d5a80'},
                            parent: { backgroundColor: "#fff"}
                        }} />
                    </VictoryChart>
                ) : chartType === 'spreadOdds' ? (
                    <VictoryChart
                    animate={{
                        duration: 500,
                        easing: 'linear'
                    }}
                    containerComponent={
                        <VictoryVoronoiContainer
                            labels={({ datum }) => `${datum.y}`}
                        />}
                    theme={VictoryTheme.material}>
                        <VictoryAxis
                            tickCount={5}
                            tickFormat={(x) => dayjs(x).format('DD MMM')} />
                        <VictoryAxis dependentAxis
                        tickValues={[0,1,2,3]}
                        domain={{y: [0, Math.round(spreadVigMax) +1]}} />
                            
                        <VictoryLine data={spreadVigArray} style={{
                            data: {stroke: '#3d5a80'},
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
                    theme={VictoryTheme.material}>
                    <VictoryAxis
                        tickCount={5}
                        tickFormat={(x) => dayjs(x).format('DD MMM')} />
                        <VictoryAxis dependentAxis
                        tickValues={[0,1,2,3]}
                        domain={{y: [0, Math.round(totalVigMax) +1]}} />
                        <VictoryLine data={totalVigArray} style={{
                            data: {stroke: '#cc2936'},
                            parent: { backgroundColor: "#fff"}
                        }} />
                </VictoryChart>
            ))}
        </div>
    )
}

const BLUE_COLOR = "#00a3de";
const RED_COLOR = "#7c270b";

const styles = () => ({
    axisOne: {
        grid: {
          stroke: ({ tick }) =>
            tick === -10 ? "transparent" : "#ffffff",
          strokeWidth: 2
        },
        axis: { stroke: BLUE_COLOR, strokeWidth: 0 },
        ticks: { strokeWidth: 0 },
        tickLabels: {
          fill: BLUE_COLOR,
          fontFamily: "inherit",
          fontSize: 16
        }
      },
      labelOne: {
        fill: BLUE_COLOR,
        fontFamily: "inherit",
        fontSize: 12,
        fontStyle: "italic"
      },
      lineOne: {
        data: { stroke: BLUE_COLOR, strokeWidth: 4.5 }
      },
      axisOneCustomLabel: {
        fill: BLUE_COLOR,
        fontFamily: "inherit",
        fontWeight: 300,
        fontSize: 21
      },
    axisTwo: {
        axis: { stroke: RED_COLOR, strokeWidth: 0 },
        tickLabels: {
          fill: RED_COLOR,
          fontFamily: "inherit",
          fontSize: 16
        }
      },
      labelTwo: {
        textAnchor: "end",
        fill: RED_COLOR,
        fontFamily: "inherit",
        fontSize: 12,
        fontStyle: "italic"
      },
      lineTwo: {
        data: { stroke: RED_COLOR, strokeWidth: 4.5 }
      }
})


export default GameOddsChart;
