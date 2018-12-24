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
