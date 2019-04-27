import React, { Component } from 'react';

class Week extends Component {
  handleClick = () => {
    this.props.onClick(this.props.sport, this.props.year, this.props.season, this.props.week);
  }
  render() {
    //console.log('this.props: ', this.props);
    return (
    <div className="link Week" onClick={this.handleClick}>
    {this.props.weekName}
    </div>
    );
  }
}

// Week.propTypes = {
//   week: React.PropTypes.number.isRequired,
//   year: React.PropTypes.number.isRequired,
//   onClick: React.PropTypes.func.isRequired
// };

export default Week;