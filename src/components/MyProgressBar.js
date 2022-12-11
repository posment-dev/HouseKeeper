import React from 'react';

import "react-step-progress-bar/styles.css";
import {ProgressBar} from 'react-step-progress-bar'


import PropTypes from 'prop-types';

const MyProgressBar = (props) => {
  
  const { task } = props;

  const now = new Date();
  const lReset = new Date(task.last_reset);
  // const daysSince = (now.getTime() - lReset.getTime()) / (1000 * 3600 * 24);
  const daysSince = (now.getTime() - lReset.getTime()) / (1000 * 60);
  const percentage = Math.min(100 * daysSince / task.days_repeat, 100);

  return (
    <ProgressBar
        percent={percentage}
        filledBackground="linear-gradient(to right, #fefb72, #f0bb31)"
      />
  );
}

MyProgressBar.propTypes = {
    task: PropTypes.object
};

export default MyProgressBar;