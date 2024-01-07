
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Frame from './components/Frame';
import SocketsExample from './components/SocketsExample';

// ::-webkit-scrollbar
// ::-webkit-scrollbar-button
// ::-webkit-scrollbar-track
// ::-webkit-scrollbar-track-piece
// ::-webkit-scrollbar-thumb
// ::-webkit-scrollbar-corner
// ::-webkit-resizer


const styles = () => ({
  '@global': {
    '*::-webkit-scrollbar': {
      width: '0.3em',
      backgroundColor: "Transparent",
      Color: "Transparent"
    },
    '*::-webkit-scrollbar-track': {
      '-webkit-box-shadow': 'inset 0 0 6px #000',
    },
    '*::-webkit-scrollbar-corner': {
      '-webkit-box-shadow': 'inset 0 0 6px #000',
    },
    '*::-webkit-scrollbar-thumb': {
      "*::Hover": { backgroundColor: "#555", outline: '1px solid Transparent',
      borderRadius: 10 },
      backgroundColor: 'Transparent',
      outline: '1px solid Transparent',
      borderRadius: 10
    },
  },
});

function App() {
  return (
    <Frame></Frame>
    //<SocketsExample></SocketsExample>
  );
}

export default withStyles(styles)(App);

