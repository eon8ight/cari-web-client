import React from 'react';

import {
  Button,
  Collapse,
} from '@blueprintjs/core';

import styles from './styles/ExpandableSection.module.scss';

const ExpandableSection = props => {
  const [show, setShow] = props.show;

  return (
    <div>
      <h2 className={styles.expandHeader}>{props.header}</h2>
      <Button className={styles.expandButton} icon={props.icon || (show ? 'minus' : 'plus')}
        onClick={() => setShow(!show)} text={show ? 'Hide' : 'Show'} />
      <Collapse isOpen={show}>
        <div className={styles.expandContent}>
          {props.children}
        </div>
      </Collapse>
    </div>
  )
};

export default ExpandableSection;