import React from 'react';
import Week from './Week';

const Weeks = ({ weeks, onGameWeekClick }) => {
    //console.log('games: ', games);
  return (
    <div>
      {weeks.map(week => 
        <Week key={week.week} className="gameWeek"
         onClick={onGameWeekClick} {...week}/>
      )}
    </div>
  );
};
  
Weeks.propTypes = {
  weeks: React.PropTypes.array.isRequired,
  onGameWeekClick: React.PropTypes.func.isRequired
};

export default Weeks;