import React from 'react';

import "react-step-progress-bar/styles.css";
import {ProgressBar} from 'react-step-progress-bar'


import PropTypes from 'prop-types';

const MyProgressBar = (props) => {

  const { maxDays, daysSinceReset } = props;

  const percentage = Math.min(100 * daysSinceReset / maxDays, 100);

  return (
    <ProgressBar
        percent={percentage}
        filledBackground="linear-gradient(to right, #fefb72, #f0bb31)"
      />
  );
}

MyProgressBar.propTypes = {
    maxDays: PropTypes.number,
    currentDays: PropTypes.number,
};

export default MyProgressBar;