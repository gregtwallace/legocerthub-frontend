import { type FC, type ReactNode } from 'react';

import { type ButtonProps as MuiButtonProps } from '@mui/material';

import { Button as MuiButton } from '@mui/material';

// prop types
type propTypes = {
  children: ReactNode;

  type?: MuiButtonProps['type'];
  onClick?: MuiButtonProps['onClick'];

  color?: MuiButtonProps['color'];
  disabled?: MuiButtonProps['disabled'];
  size?: MuiButtonProps['size'];
  sx?: MuiButtonProps['sx'];
};

// component
const Button: FC<propTypes> = (props) => {
  const { disabled, children, color, onClick, size, sx, type } = props;

  return (
    <MuiButton
      type={type}
      onClick={onClick}
      disabled={!!disabled}
      variant='contained'
      color={color ? color : 'primary'}
      size={size ? size : 'medium'}
      sx={{
        ...sx,
        ml: 2,
      }}
    >
      {children}
    </MuiButton>
  );
};

export default Button;
