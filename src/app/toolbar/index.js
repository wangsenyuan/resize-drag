import React from "react";
import classNames from 'classnames';
import styles from './index.module.scss';

function Toolbar({ className }) {
  const toolBarStyle = classNames(className, styles.toolbar)
  return <div className={toolBarStyle}></div>;
}

export default Toolbar;
