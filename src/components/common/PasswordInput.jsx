import React, { useState } from 'react';

import {
  Button,
  FormGroup,
  InputGroup,
  Intent,
  Tooltip,
} from '@blueprintjs/core';

const PasswordInput = props => {
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPasswordButtonClick = () => setShowPassword(!showPassword);

  let showPasswordButtonIcon = 'lock';
  let showPasswordButtonTooltipText = 'Show';
  let inputType = 'password';

  if(showPassword) {
    showPasswordButtonIcon = 'unlock';
    showPasswordButtonTooltipText = 'Hide';
    inputType = 'text';
  }

  const showPasswordButton = (
    <Tooltip content={`${showPasswordButtonTooltipText} Password`}>
      <Button icon={showPasswordButtonIcon} intent={Intent.WARNING} minimal={true}
              onClick={handleShowPasswordButtonClick} />
    </Tooltip>
  );

  return (
    <FormGroup label={props.label} helperText={props.helperText}>
      <InputGroup autoComplete={props.autoComplete} large={props.large ?? true}
                  placeholder={props.placeholder || 'Password'} leftIcon="key"
                  rightElement={showPasswordButton} type={inputType} onChange={props.onChange}
                  intent={props.intent} className={props.inputClassName} />
    </FormGroup>
  );
};

export default PasswordInput;