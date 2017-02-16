import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { createStore } from 'redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import PomTimer from './pomTimer';
import reducer from './action';

injectTapEventPlugin();

// store
const store = createStore(reducer);
store.subscribe(() => console.log(store.getState()));

render(
  <Provider store={store}>
    <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
      <PomTimer />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('react-counter')
);

