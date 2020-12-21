import React from 'react';

import { Button } from '@blueprintjs/core';

import styles from './styles/ExpandableSection.module.scss';

const ExpandableSection = props => {
  const [show, setShow] = props.show;

  return (
    <div className={styles.expandableSubform}>
      <h2>{props.header}</h2>
      <Button className={styles.editExpandButton} icon={props.icon || (show ? 'minus' : 'plus')}
        onClick={() => setShow(!show)} />
      {show && <div className={styles.expandableContent}>{props.content}</div>}
    </div>
  )
};

export default ExpandableSection;