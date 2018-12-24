import React, { Component, Children } from 'react';

const ORIENTATION_MODE = 'orientation_mode';
const POINTER_MODE = 'pointer_mode';

/**
 *
 * Stage component will handle the registration of listeners and provide the
 * relative translation regarding user interaction to its children. It will
 * listen to pointer move for desktop devices and orientation change for mobile
 * device
 *
 * @class Stage
 * @extends {Component}
 */
class Stage extends Component {
  // used to determine the size of current container
  ref = React.createRef();
  mode = null;
  constructor(props) {
    super(props);
    this.state = {
      movementX: 0,
      movementY: 0
    };
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
  transformChildren = children => {
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
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const windowCenterX = windowWidth * 0.5;
    const windowCenterY = windowHeight * 0.5;
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
    const element = this.ref.current;
    const boundingClientRect = element.getBoundingClientRect();
    const elementWidth = boundingClientRect.width;
    const elementHeight = boundingClientRect.height;
    return {
      elementWidth,
      elementHeight
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
    return {
      movementX: elementWidth * translationPercentageX,
      movementY: elementHeight * translationPercentageY
    };
  };

  handlePointerMove = pointerEvent => {
    const {
      windowCenterX,
      windowCenterY,
      windowRadiusX,
      windowRadiusY
    } = this.state;
    const { clientX, clientY } = pointerEvent;
    const translationPercentageX = (clientX - windowCenterX) / windowRadiusX;
    const translationPercentageY = (clientY - windowCenterY) / windowRadiusY;
    this.setState(
      this.calculateMovement(translationPercentageX, translationPercentageY)
    );
  };

  handleDeviceOrientation = deviceOrientationEvent => {};

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
  };

  render() {
    const { children, ...rest } = this.props;
    return (
      <div ref={this.ref} {...rest}>
        {this.transformChildren(children)}
      </div>
    );
  }
}

export default Stage;
