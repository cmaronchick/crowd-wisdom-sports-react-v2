import React from 'react';

const Weeks = ({ weeks, onGameWeekClick }) => {
    //console.log('games: ', games);
  return (
    <div>
      {weeks.map(week => 
        <div key={week} className="gameWeek"
         onClick={onGameWeekClick}>
         {week}
        </div>
      )}
    </div>
  );
};
  
Weeks.propTypes = {
  weeks: React.PropTypes.array.isRequired,
  onGameWeekClick: React.PropTypes.func.isRequired
};
  
export default Weeks;