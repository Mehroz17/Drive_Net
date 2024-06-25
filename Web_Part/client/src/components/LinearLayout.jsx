import React from 'react';

// Define a custom heading component
const LinearLayout = ({ children, ...rest }) => {
  return <div className="custom-heading" {...rest}>{children}</div>;
};

export default LinearLayout;
