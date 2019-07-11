import React, { Component } from 'react';

class Week extends Component {
  constructor(props) {
    super(props) 
    this.state = {
      ...this.props
    }
  }
  handleClick = () => {
    this.props.onClick(this.props.sport, this.props.year, this.props.season, this.props.weekIndex);
  }
  render() {
    return (
    <li className={this.state.weekIndex === this.state.currentWeek ? "link Week currentWeek" : "link Week"} onClick={this.handleClick}>
      {this.props.week.weekName}
    </li>
    );
  }
}

// Week.propTypes = {
//   week: React.PropTypes.number.isRequired,
//   year: React.PropTypes.number.isRequired,
//   onClick: React.PropTypes.func.isRequired
// };

export default Week;