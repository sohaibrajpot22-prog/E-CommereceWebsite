import React from 'react';

// Animation hatane ke liye humne sirf 'children' return kar diya hai, 
// koi logic, state ya transition nahi rakhi.
export const FadeIn = ({ children }) => {
  return <>{children}</>;
};
export default FadeIn;