import React from 'react';
import { 
  Box,
  Pagination as MuiPagination,
  PaginationItem,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  NavigateBefore as PrevIcon,
  NavigateNext as NextIcon
} from '@mui/icons-material';

function Pagination({ currentPage, totalPages, onPageChange }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // 모바일에서는 표시할 페이지 수를 줄임
  const siblingCount = isMobile ? 0 : 1;

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        mt: 3,
        mb: 2
      }}
    >
      <MuiPagination
        page={currentPage}
        count={totalPages}
        onChange={(_, page) => onPageChange(page)}
        color="primary"
        size={isMobile ? "small" : "medium"}
        siblingCount={siblingCount}
        showFirstButton
        showLastButton
        renderItem={(item) => (
          <PaginationItem
            slots={{
              previous: PrevIcon,
              next: NextIcon
            }}
            {...item}
          />
        )}
      />
    </Box>
  );
}

export default Pagination;