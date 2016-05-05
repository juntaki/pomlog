import React from 'react';
import ReactDOM from 'react-dom';
import Paper from 'material-ui/lib/paper';

const PaperExampleSimple = () => (
    <div>
        <Paper zDepth={1}/>
        <Paper zDepth={2}/>
        <Paper zDepth={3}/>
        <Paper zDepth={4}/>
        <Paper zDepth={5}/>
    </div>
);

export default PaperExampleSimple;

ReactDOM.render(
    <PaperExampleSimple />,
    document.getElementById('main')
);
