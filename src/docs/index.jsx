import React from 'react';
import { render } from 'react-dom';
import { Stage } from '../../lib';
import './styles.css';

function Demo() {
  return (
    <div>
      <h1>Demo with examples of the component</h1>
      <Stage>
        {(movementX, movementY) => (
          <div style={{ height: 30 }}>
            x:{movementX} y:{movementY}
          </div>
        )}
      </Stage>
      <Stage>
        {(movementX, movementY) => (
          <div style={{ height: 20 }}>
            x:{movementX} y:{movementY}
          </div>
        )}
      </Stage>
    </div>
  );
}

render(<Demo />, document.getElementById('app'));
