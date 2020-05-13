import React from 'react';
import Week from './Week';

const Weeks = ({ sport, year, season, weeks, currentWeek, onGameWeekClick }) => {
    // console.log('weeks: ', weeks);
  return (
    <ul className="weeks pagination pagination-info">
      {weeks.map((week, index) => {
          return <Week 
          key={index} 
          onClick={onGameWeekClick} 
          sport={sport} 
          year={year} 
          season={season} 
          week={week} 
          weekIndex={index + 1}
          currentWeek={currentWeek}/>
        })
      }
    </ul>
  );
};
  
// Weeks.propTypes = {
//   weeks: React.PropTypes.array.isRequired,
//   onGameWeekClick: React.PropTypes.func.isRequired
// };

export default Weeks;