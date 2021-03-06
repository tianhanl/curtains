import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';

const ORIENTATION_MODE = 'orientation_mode';
const POINTER_MODE = 'pointer_mode';

/**
 *
 * Stage component will handle the registration of listeners and provide the
 * relative translation regarding user interaction to its children. It will
 * listen to pointer move for desktop devices and orientation change for mobile
 * device
 *
 * This component will pass the calculated movement realtive to the dimensinos
 * of the container to its children
 *
 * @class Stage
 * @extends {Component}
 */
class Stage extends Component {
  // used to determine the size of current container
  ref = React.createRef();
  // used to indicate which mode is the stage
  mode = null;
  defaultState = {
    movementX: 0,
    movementY: 0,
    windowWidth: 0,
    windowHeight: 0,
    windowCenterX: 0,
    windowCenterY: 0,
    windowRadiusX: 0,
    windowRadiusY: 0,
    elementWidth: 0,
    elementHeight: 0,
    elementTop: 0,
    elementLeft: 0,
    elementBottom: 0,
    elementRight: 0,
    elementCenterX: 0,
    elementCenterY: 0,
    elementRadiusX: 0,
    elementRadiusY: 0,
    calibrationX: null,
    calibrationY: null
  };

  constructor(props) {
    super(props);
    this.state = this.defaultState;
  }

  componentDidMount = () => {
    this.updateDimensions();
    this.mode = this.detectMode();
    this.registerHandlers();
  };

  componentWillUnmount = () => {
    this.removeHandlers();
  };

  // pass movement in x and y direction to children
  passMovementToChildren = children => {
    const { movementX, movementY } = this.state;
    if (typeof children === 'function') {
      return children(movementX, movementY);
    } else {
      return Children.map(children, child => {
        return React.cloneElement(child, {
          movementX,
          movementY
        });
      });
    }
  };

  measureWindowDimension = () => {
    const { originX, originY } = this.props;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const windowCenterX = windowWidth * originX;
    const windowCenterY = windowHeight * originY;
    const windowRadiusX = Math.max(windowCenterX, windowWidth - windowCenterX);
    const windowRadiusY = Math.max(windowCenterY, windowHeight - windowCenterY);
    return {
      windowWidth,
      windowHeight,
      windowCenterX,
      windowCenterY,
      windowRadiusX,
      windowRadiusY
    };
  };

  measureElementDimension = () => {
    const { originX, originY } = this.props;
    const element = this.ref.current;
    const domRect = element.getBoundingClientRect();
    const elementWidth = domRect.width;
    const elementHeight = domRect.height;
    const elementTop = domRect.top;
    const elementLeft = domRect.left;
    const elementBottom = domRect.bottom;
    const elementRight = domRect.right;
    const elementCenterX = (elementLeft + elementWidth) * originX;
    const elementCenterY = (elementTop + elementHeight) * originY;
    const elementRadiusX = Math.max(
      elementWidth * originX,
      elementWidth * (1 - originX)
    );
    const elementRadiusY = Math.max(
      elementHeight * originY,
      elementHeight * (1 - originY)
    );
    return {
      elementWidth,
      elementHeight,
      elementTop,
      elementLeft,
      elementBottom,
      elementRight,
      elementCenterX,
      elementCenterY,
      elementRadiusX,
      elementRadiusY
    };
  };

  updateDimensions = () => {
    this.setState({
      ...this.measureWindowDimension(),
      ...this.measureElementDimension()
    });
  };

  calculateMovement = (translationPercentageX, translationPercentageY) => {
    const { elementHeight, elementWidth } = this.state;
    const { scalarX, scalarY } = this.props;
    return {
      movementX: elementWidth * translationPercentageX * scalarX,
      movementY: elementHeight * translationPercentageY * scalarY
    };
  };

  handlePointerMove = pointerEvent => {
    const { relativeToElement, clipToElement } = this.props;
    const { clientX, clientY } = pointerEvent;
    const {
      windowCenterX,
      windowCenterY,
      windowRadiusX,
      windowRadiusY,
      elementCenterX,
      elementCenterY,
      elementRadiusX,
      elementRadiusY,
      elementTop,
      elementLeft,
      elementRight,
      elementBottom
    } = this.state;
    // clip if needed
    if (
      clipToElement &&
      (clientX < elementLeft ||
        clientX > elementRight ||
        clientY < elementTop ||
        clientY > elementBottom)
    ) {
      return;
    }

    let translationPercentageX = 0;
    let translationPercentageY = 0;
    if (relativeToElement) {
      translationPercentageX = (clientX - elementCenterX) / elementRadiusX;
      translationPercentageY = (clientY - elementCenterY) / elementRadiusY;
    } else {
      translationPercentageX = (clientX - windowCenterX) / windowRadiusX;
      translationPercentageY = (clientY - windowCenterY) / windowRadiusY;
    }
    this.setState(
      this.calculateMovement(translationPercentageX, translationPercentageY)
    );
  };

  handleDeviceOrientation = deviceOrientationEvent => {
    const { maxViewingAngle } = this.props;
    const { calibrationX, calibrationY } = this.state;
    const { beta, gamma } = deviceOrientationEvent;
    const normalizedBeta = beta.toFixed(1);
    const normalizedGamma = gamma.toFixed(1);
    if ((calibrationX === calibrationY) === null) {
      this.setState({
        calibrationX: normalizedGamma,
        calibrationY: normalizedBeta
      });
    } else {
      this.setState(
        this.calculateMovement(
          (normalizedGamma - calibrationX) / maxViewingAngle,
          (normalizedBeta - calibrationY) / maxViewingAngle
        )
      );
    }
  };

  handleResize = resizeEvent => {
    this.updateDimensions();
  };

  detectMode = () => {
    // from http://www.javascriptkit.com/javatutors/navigator.shtml
    const isMobile = navigator.userAgent.match(
      /(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i
    );
    if (!!window.DeviceOrientationEvent && isMobile) {
      return ORIENTATION_MODE;
    } else {
      return POINTER_MODE;
    }
  };

  registerHandlers = () => {
    switch (this.mode) {
      case ORIENTATION_MODE: {
        window.addEventListener(
          'deviceorientation',
          this.handleDeviceOrientation
        );
        break;
      }
      case POINTER_MODE: {
        window.addEventListener('pointermove', this.handlePointerMove);
        break;
      }
      default:
    }
    window.addEventListener('resize', this.handleResize);
  };

  removeHandlers = () => {
    switch (this.mode) {
      case ORIENTATION_MODE: {
        window.removeEventListener(
          'deviceorientation',
          this.handleDeviceOrientation
        );
        break;
      }
      case POINTER_MODE: {
        window.removeEventListener('pointermove', this.handlePointerMove);
        break;
      }
      default:
    }
    window.removeEventListener('resize', this.handleResize);
  };

  render() {
    const {
      children,
      scalarX,
      scalarY,
      originX,
      originY,
      maxViewingAngle,
      relativeToElement,
      clipToElement,
      ...rest
    } = this.props;
    return (
      <div ref={this.ref} {...rest}>
        {this.passMovementToChildren(children)}
      </div>
    );
  }
}

Stage.propTypes = {
  // globally translation scaling
  scalarX: PropTypes.number,
  scalarY: PropTypes.number,
  // the percentage position of origin relative to top left
  originX: PropTypes.number,
  originY: PropTypes.number,
  // max viewing angle used in orientation calculation
  maxViewingAngle: PropTypes.number,
  // is movement determined based on element's center
  relativeToElement: PropTypes.bool,
  // should pointer outsize the element region be clipped
  clipToElement: PropTypes.bool
};

Stage.defaultProps = {
  scalarX: 0.1,
  scalarY: 0.1,
  originX: 0.5,
  originY: 0.5,
  maxViewingAngle: 30,
  relativeToElement: false,
  clipToElement: false
};

export default Stage;
