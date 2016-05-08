import React from 'react';
import ReactDOM from 'react-dom';
import RaisedButton from 'material-ui/lib/raised-button';

const style = {
    margin: 12,
};

const MainButton = () => (
    <div>
        <RaisedButton label="Sign up" style={style} />
        <RaisedButton label="Login" style={style} />
    </div>
);

export default MainButton;

ReactDOM.render(
    <MainButton />,
    document.getElementById('react-content')
);
