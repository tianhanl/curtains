import React from 'react';
import { render } from 'react-dom';
import { Stage } from '../lib';
import './styles.css';

function Demo() {
  return (
    <div>
      <h1>Demo with examples of the component</h1>
      <Stage>
        {(movementX, movementY) => (
          <div>
            x:{movementX} y:{movementY}
          </div>
        )}
      </Stage>
      <Stage>
        {(movementX, movementY) => (
          <span>
            x:{movementX} y:{movementY}
          </span>
        )}
      </Stage>
    </div>
  );
}

render(<Demo />, document.getElementById('app'));
