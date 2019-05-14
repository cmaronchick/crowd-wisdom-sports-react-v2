import React from 'react';
import Week from './Week';

const Weeks = ({ sport, year, season, weeks, onGameWeekClick }) => {
    // console.log('weeks: ', weeks);
  return (
    <div className="weeks">
      {weeks.map((week, index) => <Week key={index} className="gameWeek" onClick={onGameWeekClick} sport={sport} year={year} season={season} week={week} weekIndex={index + 1}/>)}
    </div>
  );
};
  
// Weeks.propTypes = {
//   weeks: React.PropTypes.array.isRequired,
//   onGameWeekClick: React.PropTypes.func.isRequired
// };

export default Weeks;