import React from 'react';
import { List } from 'antd'

const Week = ({onClick, sport, year, season, week, weekIndex, currentWeek}) => {
  
    return (
    <List.Item className={weekIndex === currentWeek ? "link Week currentWeek" : "link Week"}
      onClick={() => onClick(sport, year, season, weekIndex)}
    >
      {week.weekName}
    </List.Item>
    );
}

export default Week;