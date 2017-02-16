import React, { Component, PropTypes } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { PieChart } from 'rd3';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { increment, reset } from './action';

class PomTimer extends Component {
  static propTypes = {
    minutes: PropTypes.number.isRequired,
    increment: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
  }

  static myColors(idx) {
    return ['#FF5722', '#388E3C', '#FF8A65', '#66BB6A'][idx];
  }

  render() {
    const passedTime = (this.props.minutes > 25) ? 25 : this.props.minutes;
    const remainingTime = 25 - passedTime;
    const breakTime = (this.props.minutes <= 25) ? 0 : this.props.minutes - 25;
    const remainingBreak = 5 - breakTime;

    return (
      <div>
        <PieChart
          data={[
            { label: 'Passed time', value: passedTime },
            { label: 'Remaining time', value: remainingTime },
            { label: 'Break', value: breakTime },
            { label: 'Remaining break', value: remainingBreak },
          ]}
          width={window.innerWidth}
          height={500}
          radius={200}
          colors={this.myColors}
          innerRadius={160}
          sectorBorderColor="white"
          showInnerLabels={false}
        />
        <RaisedButton
          label="Start"
          onClick={this.props.increment}
        />
        <RaisedButton
          label="Reset"
          onClick={this.props.reset}
        />
      </div>
    );
  }
}

export default connect(
  state => state,
  dispatch => bindActionCreators({ increment, reset }, dispatch)
)(PomTimer);
