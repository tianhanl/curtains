import React from 'react';

const MovementInfoDisplay = props => {
  const { movementX, movementY } = props;
  return (
    <div>
      MovementX: {movementX} <br />
      MovementY: {movementY}
    </div>
  );
};

export default MovementInfoDisplay;
