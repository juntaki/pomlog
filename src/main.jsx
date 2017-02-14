import React from 'react';
import ReactDOM from 'react-dom';
import { RaisedButton } from 'material-ui';

const style = {
  margin: 12,
};

const MainButton = () => (
  <div>
    <RaisedButton
      label="Login with twitter"
      style={style}
      linkButton
      href="/auth?provider=twitter"
    />
  </div>
);

export default MainButton;

ReactDOM.render(
  <MainButton />,
    document.getElementById('react-content')
);
