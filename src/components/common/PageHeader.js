import React from 'react';
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  Button,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';

const PageHeader = ({
  title,
  subtitle,
  breadcrumbs = [],
  action,
  backButton,
  divider = true,
  sx
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ mb: 3, ...sx }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'center',
          gap: 2,
          mb: 2
        }}
      >
        <Box>
          {breadcrumbs.length > 0 && (
            <Breadcrumbs
              separator={<NavigateNextIcon fontSize="small" />}
              sx={{ mb: 1 }}
            >
              {breadcrumbs.map((item, index) => {
                const isLast = index === breadcrumbs.length - 1;
                return isLast ? (
                  <Typography
                    key={item.path || index}
                    color="text.primary"
                    variant="body2"
                  >
                    {item.label}
                  </Typography>
                ) : (
                  <Link
                    key={item.path || index}
                    component={RouterLink}
                    to={item.path}
                    color="inherit"
                    variant="body2"
                    sx={{ 
                      '&:hover': { 
                        color: 'primary.main' 
                      } 
                    }}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </Breadcrumbs>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {backButton && (
              <Button
                {...backButton}
                size="small"
                sx={{ minWidth: 'auto', ...backButton.sx }}
              />
            )}
            <Typography variant="h5" component="h1">
              {title}
            </Typography>
          </Box>
          {subtitle && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
        {action && (
          <Box sx={{ mt: isMobile ? 1 : 0 }}>
            {action}
          </Box>
        )}
      </Box>
      {divider && <Divider />}
    </Box>
  );
};

export default PageHeader;