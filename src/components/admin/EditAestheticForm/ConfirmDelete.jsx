import React from 'react';

import {
  Button,
  Classes,
  ControlGroup,
  Intent,
  Popover,
  Position,
} from '@blueprintjs/core';

import styles from './styles/ConfirmDelete.module.scss';

import '@blueprintjs/core/lib/css/blueprint.css';

const ConfirmDelete = (props) => (
  <Popover position={props.position || Position.RIGHT}>
    <Button className={Classes.FIXED} icon="trash" intent={Intent.DANGER}>Delete</Button>
    <div className={styles.confirmDeletePopover}>
      <p>Are you sure?</p>
      <ControlGroup>
        <Button className={Classes.POPOVER_DISMISS}>Cancel</Button>
        <Button intent={Intent.PRIMARY} onClick={props.onClick}>Delete</Button>
      </ControlGroup>
    </div>
  </Popover>
);

export default ConfirmDelete;