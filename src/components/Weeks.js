import React from 'react';
import Week from './Week';

const Weeks = ({ sport, year, season, weeks, onGameWeekClick }) => {
    //console.log('games: ', games);
  return (
    <div className="weeks">
      {weeks.map((week, index) => {
        <Week key={index} className="gameWeek"
         onClick={onGameWeekClick} sport={sport} year={year} season={season} week={week}/>
      })
      }
    </div>
  );
};
  
// Weeks.propTypes = {
//   weeks: React.PropTypes.array.isRequired,
//   onGameWeekClick: React.PropTypes.func.isRequired
// };

export default Weeks;