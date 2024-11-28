import React from 'react';
import {
  Card as MuiCard,
  CardHeader,
  CardContent,
  CardActions,
  IconButton,
  Typography,
  Box,
  Divider,
  Collapse,
  Tooltip
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

const Card = ({
  title,
  subtitle,
  action,
  children,
  footer,
  collapsible = false,
  defaultExpanded = true,
  onRefresh,
  loading = false,
  error = null,
  headerProps = {},
  contentProps = {},
  footerProps = {},
  elevation = 1,
  sx = {}
}) => {
  const [expanded, setExpanded] = React.useState(defaultExpanded);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const renderHeader = () => {
    if (!title && !subtitle && !action && !collapsible && !onRefresh) {
      return null;
    }

    return (
      <CardHeader
        {...headerProps}
        title={
          title && (
            <Typography variant="h6" component="div">
              {title}
            </Typography>
          )
        }
        subheader={
          subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )
        }
        action={
          <Box sx={{ display: 'flex', gap: 1 }}>
            {action}
            {onRefresh && (
              <Tooltip title="새로고침">
                <IconButton
                  size="small"
                  onClick={onRefresh}
                  disabled={loading}
                >
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {collapsible && (
              <Tooltip title={expanded ? "접기" : "펼치기"}>
                <IconButton
                  size="small"
                  onClick={handleExpandClick}
                  aria-expanded={expanded}
                  aria-label="show more"
                >
                  {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Tooltip>
            )}
          </Box>
        }
        sx={{
          p: 2,
          '& .MuiCardHeader-action': {
            m: 0,
            alignSelf: 'center'
          },
          ...headerProps.sx
        }}
      />
    );
  };

  return (
    <MuiCard elevation={elevation} sx={sx}>
      {renderHeader()}
      
      <Collapse in={!collapsible || expanded}>
        <CardContent
          {...contentProps}
          sx={{
            pt: title ? 0 : 2,
            ...contentProps.sx
          }}
        >
          {error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            children
          )}
        </CardContent>

        {footer && (
          <>
            <Divider />
            <CardActions
              {...footerProps}
              sx={{
                p: 2,
                ...footerProps.sx
              }}
            >
              {footer}
            </CardActions>
          </>
        )}
      </Collapse>
    </MuiCard>
  );
};

export default Card;