import React from 'react';
import Week from './Week';
import './Weeks.less'

import { Link } from 'react-router-dom'
import { List, Button } from 'antd'

import { connect } from 'react-redux'

import { fetchGameWeekGames } from '../../redux/actions/gamesActions'
import { changeGameWeek } from '../../redux/actions/sportActions'

const Weeks = (props) => {
  const { sport, onGameWeekClick } = props
  const { year, season, weeks, week } = sport.gameWeekData
    // console.log('weeks: ', weeks);
    const onWeekClick = (selectedWeek) => {
      onGameWeekClick(sport.sport, year, season, selectedWeek)
      props.changeGameWeek(sport.gameWeekData, selectedWeek)
    }
  return (
    <List
    itemLayout="horizontal"
    grid={{gutter: 4}}
      dataSource={weeks}
      renderItem={(item, index) => {
        return (
        
            <List.Item
            key={index}
               
              // sport={sport} 
              // year={year} 
              // season={season} 
              // week={week} 
              // weekIndex={index + 1}
              // currentWeek={week}
              >
                <Link
                  to={`/${sport.sport}/games/${year}/${season}/${index + 1}`}
                  onClick={() => onWeekClick(index + 1)}
                  className={`week ${index + 1 === week ? 'selectedWeek' : null}`}
                  >
                  {item.weekName}
                </Link>
            </List.Item>
        )
      }}
      />
  );
};
  
// Weeks.propTypes = {
//   weeks: React.PropTypes.array.isRequired,
//   onGameWeekClick: React.PropTypes.func.isRequired
// };

const mapStateToProps = (state) => ({
  sport: state.sport
})

const mapActionsToProps = {
  changeGameWeek
}

export default connect(mapStateToProps, mapActionsToProps)(Weeks);