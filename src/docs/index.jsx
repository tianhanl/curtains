import React from 'react';
import { render } from 'react-dom';
import { Stage, Curtain } from '../../lib';
import './styles.css';

function Demo() {
  return (
    <div>
      <h1>Demo with examples of the component</h1>
      <Stage
        id={'stage'}
        style={{
          height: '80vh',
          position: 'realtive',
          background: 'gray',
          overflow: 'hidden'
        }}
        relativeToElement
        clipToElement
      >
        <Curtain
          style={{
            height: 20,
            width: 20,
            background: 'red',
            position: 'absolute',
            top: '50%',
            left: '50%'
          }}
          relativeRate={0.2}
        />
        <Curtain
          style={{
            height: 20,
            width: 20,
            background: 'blue',
            position: 'absolute',
            top: '50%',
            left: '50%'
          }}
          relativeRate={0.5}
        />
      </Stage>
    </div>
  );
}

render(<Demo />, document.getElementById('app'));
