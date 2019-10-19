import React, { Component } from 'react';

const Week = ({onClick, sport, year, season, week, weekIndex, currentWeek}) => {
  
    return (
    <li className={weekIndex === currentWeek ? "link Week currentWeek" : "link Week"}
      onClick={() => onClick(sport, year, season, weekIndex)}
    >
      {week.weekName}
    </li>
    );
}

export default Week;