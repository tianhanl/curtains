import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class Curtain extends PureComponent {
  render() {
    const {
      children,
      movementX,
      movementY,
      relativeRate,
      relativeRateX,
      relativeRateY,
      style,
      ...rest
    } = this.props;
    const rateX = relativeRateX !== null ? relativeRateX : relativeRate;
    const rateY = relativeRateY !== null ? relativeRateY : relativeRate;
    const offsetX = movementX * rateX;
    const offsetY = movementY * rateY;
    return (
      <div
        style={{
          ...style,
          transform: `translate3d(
            ${offsetX.toFixed(1)}px,
            ${offsetY.toFixed(1)}px,
            0)`
        }}
        {...rest}
      >
        {children}
      </div>
    );
  }
}

Curtain.propTypes = {
  movementX: PropTypes.number,
  movementY: PropTypes.number,
  relativeRate: PropTypes.number,
  relativeRateX: PropTypes.number,
  relativeRateY: PropTypes.number
};

Curtain.defaultProps = {
  movementX: 0,
  movementY: 0,
  relativeRate: 0,
  relativeRateX: null,
  relativeRateY: null
};

export default Curtain;
