import React from 'react';
import {
  Menu as MuiMenu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Box,
  IconButton,
  Tooltip
} from '@mui/material';
import { MoreVert as MoreIcon } from '@mui/icons-material';

const Menu = ({
  items = [],
  icon: IconComponent = MoreIcon,
  iconProps = {},
  iconButtonProps = {},
  tooltip,
  placement = 'bottom-end',
  dense = false,
  disabled = false,
  menuProps = {}
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleItemClick = (item) => {
    if (item.onClick) {
      item.onClick();
    }
    if (!item.keepOpen) {
      handleClose();
    }
  };

  const button = (
    <IconButton
      size="small"
      onClick={handleClick}
      disabled={disabled}
      {...iconButtonProps}
    >
      <IconComponent fontSize="small" {...iconProps} />
    </IconButton>
  );

  return (
    <>
      {tooltip ? (
        <Tooltip title={tooltip}>
          {button}
        </Tooltip>
      ) : button}

      <MuiMenu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        {...menuProps}
      >
        {items.map((item, index) => {
          if (item.divider) {
            return <Divider key={`divider-${index}`} />;
          }

          if (item.custom) {
            return (
              <Box key={`custom-${index}`} sx={{ p: 1 }}>
                {item.custom}
              </Box>
            );
          }

          return (
            <MenuItem
              key={item.key || item.text || index}
              onClick={() => handleItemClick(item)}
              disabled={item.disabled}
              dense={dense}
              sx={{
                minWidth: 150,
                ...item.sx
              }}
            >
              {item.icon && (
                <ListItemIcon sx={{ color: item.color }}>
                  {item.icon}
                </ListItemIcon>
              )}
              <ListItemText>
                <Typography
                  variant="body2"
                  color={item.color || 'inherit'}
                  sx={{
                    fontWeight: item.bold ? 600 : 400
                  }}
                >
                  {item.text}
                </Typography>
              </ListItemText>
              {item.endIcon && (
                <Box component="span" sx={{ ml: 1 }}>
                  {item.endIcon}
                </Box>
              )}
            </MenuItem>
          );
        })}
      </MuiMenu>
    </>
  );
};

export default Menu;