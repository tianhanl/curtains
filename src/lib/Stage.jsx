import React, { Component, Children } from 'react';

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
  constructor(props) {
    super(props);
    this.state = {
      movementX: 0,
      movementY: 0
    };
  }

  componentDidMount = () => {
    window.addEventListener('pointermove', this.handlePointerMove);
    this.updateDimensions();
  };

  componentWillUnmount = () => {
    window.removeEventListener('pointermove', this.handlePointerMove);
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
