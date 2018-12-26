import React from 'react';
import { render } from 'react-dom';
import { Stage, Curtain } from '../../lib';
import './styles.css';

function Demo() {
  return (
    <div>
      <h1>Demo with examples of the component</h1>
      <Stage style={{ height: 60, position: 'realtive' }}>
        <Curtain
          style={{
            height: 20,
            width: 20,
            background: 'red',
            top: 20,
            left: '50%'
          }}
          relativeRate={1}
        />
      </Stage>
    </div>
  );
}

render(<Demo />, document.getElementById('app'));
