import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import RaisedButton from 'material-ui/RaisedButton';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { PieChart } from 'rd3';

class PomTimer extends Component {
  static myColors(idx) {
    return ['#FF5722', '#388E3C', '#FF8A65', '#66BB6A'][idx];
  }

  constructor(props) {
    super(props);

    this.state = {
      percentage: 0,
      pieData: [
        { label: 'Passed time', value: 0.0 },
        { label: 'Remaining time', value: 25.0 },
        { label: 'Break', value: 0.0 },
        { label: 'Remaining break', value: 5.0 },
      ],
    };
    this.startTimer = this.startTimer.bind(this);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  startTimer() {
    clearTimeout(this.timer);
    this.setState({
      percentage: 0,
      pieData: [
        { label: 'Passed time', value: 0.0 },
        { label: 'Remaining time', value: 25.0 },
        { label: 'Break', value: 0.0 },
        { label: 'Remaining break', value: 5.0 },
      ],
    });
    this.timer = setTimeout(() => this.progress(0.1), 6000);
  }

  progress(minutes) {
    if (minutes > 30) {
      this.setState({
        minutes: 30,
        pieData: [
          { label: 'Passed time', value: 25.0 },
          { label: 'Remaining time', value: 0.0 },
          { label: 'Break', value: 5.0 },
          { label: 'Remaining break', value: 0.0 },
        ],
      });
    } else if (minutes > 25) {
      this.setState({
        minutes,
        pieData: [
          { label: 'Passed time', value: 25.0 },
          { label: 'Remaining time', value: 0.0 },
          { label: 'Break', value: minutes - 25.0 },
          { label: 'Remaining break', value: 5.0 - (minutes - 25.0) },
        ],
      });
    } else {
      this.setState({
        minutes,
        pieData: [
          { label: 'Passed time', value: minutes },
          { label: 'Remaining time', value: 25.0 - minutes },
          { label: 'Break', value: 0.0 },
          { label: 'Remaining break', value: 5.0 },
        ],
      });
    }

    if (minutes <= 30) {
      this.timer = setTimeout(() => this.progress(minutes + 0.1), 6000);
    }
  }

  render() {
    return (
      <div>
        <PieChart
          data={this.state.pieData}
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
          onClick={this.startTimer}
        />
      </div>
    );
  }
}

ReactDOM.render(
  <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
    <PomTimer />
  </MuiThemeProvider>,
  document.getElementById('react-counter')
);
