import React, { useState, useMemo } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Checkbox,
  IconButton,
  Paper,
  Typography,
  Skeleton,
  Tooltip,
  useTheme
} from '@mui/material';
import {
  KeyboardArrowRight as ExpandIcon,
  KeyboardArrowDown as CollapseIcon
} from '@mui/icons-material';

const DataGrid = ({
  columns = [],
  data = [],
  loading = false,
  error = null,
  sortable = true,
  selectable = false,
  expandable = false,
  renderExpandedRow,
  selectedRows = [],
  onRowSelect,
  onSelectAll,
  onSort,
  onRowClick,
  emptyMessage = '데이터가 없습니다.',
  errorMessage = '데이터를 불러오는 중 오류가 발생했습니다.',
  loadingRowCount = 5,
  stickyHeader = true,
  dense = false,
  hover = true,
  sx = {}
}) => {
  const theme = useTheme();
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [sortConfig, setSortConfig] = useState({
    field: null,
    direction: 'asc'
  });

  // 정렬된 데이터 계산
  const sortedData = useMemo(() => {
    if (!sortConfig.field) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.field];
      const bValue = b[sortConfig.field];

      if (aValue === bValue) return 0;
      
      const direction = sortConfig.direction === 'asc' ? 1 : -1;
      return aValue > bValue ? direction : -direction;
    });
  }, [data, sortConfig]);

  // 정렬 처리
  const handleSort = (field) => {
    const direction = 
      sortConfig.field === field && sortConfig.direction === 'asc' 
        ? 'desc' 
        : 'asc';

    setSortConfig({ field, direction });

    if (onSort) {
      onSort(field, direction);
    }
  };

  // 행 확장/축소 처리
  const handleExpandRow = (rowId, event) => {
    event.stopPropagation();
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(rowId)) {
        next.delete(rowId);
      } else {
        next.add(rowId);
      }
      return next;
    });
  };

  // 로딩 상태 렌더링
  const renderLoadingState = () => (
    <TableBody>
      {[...Array(loadingRowCount)].map((_, index) => (
        <TableRow key={`loading-${index}`}>
          {selectable && (
            <TableCell padding="checkbox">
              <Skeleton variant="rectangular" width={24} height={24} />
            </TableCell>
          )}
          {expandable && (
            <TableCell padding="checkbox">
              <Skeleton variant="rectangular" width={24} height={24} />
            </TableCell>
          )}
          {columns.map((column, cellIndex) => (
            <TableCell key={`loading-cell-${cellIndex}`}>
              <Skeleton variant="text" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );

  // 에러 상태 렌더링
  const renderErrorState = () => (
    <TableBody>
      <TableRow>
        <TableCell
          colSpan={columns.length + (selectable ? 1 : 0) + (expandable ? 1 : 0)}
          align="center"
        >
          <Typography color="error">
            {error || errorMessage}
          </Typography>
        </TableCell>
      </TableRow>
    </TableBody>
  );

  // 빈 상태 렌더링
  const renderEmptyState = () => (
    <TableBody>
      <TableRow>
        <TableCell
          colSpan={columns.length + (selectable ? 1 : 0) + (expandable ? 1 : 0)}
          align="center"
        >
          <Typography color="text.secondary">
            {emptyMessage}
          </Typography>
        </TableCell>
      </TableRow>
    </TableBody>
  );

  return (
    <TableContainer 
      component={Paper} 
      sx={sx}
    >
      <Table
        stickyHeader={stickyHeader}
        size={dense ? 'small' : 'medium'}
      >
        <TableHead>
          <TableRow>
            {selectable && (
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    selectedRows.length > 0 && 
                    selectedRows.length < data.length
                  }
                  checked={
                    data.length > 0 && 
                    selectedRows.length === data.length
                  }
                  onChange={onSelectAll}
                />
              </TableCell>
            )}
            {expandable && <TableCell padding="checkbox" />}
            {columns.map((column) => (
              <TableCell
                key={column.field}
                align={column.numeric ? 'right' : 'left'}
                padding={column.disablePadding ? 'none' : 'normal'}
                sortDirection={
                  sortConfig.field === column.field 
                    ? sortConfig.direction 
                    : false
                }
              >
                {sortable && column.sortable !== false ? (
                  <TableSortLabel
                    active={sortConfig.field === column.field}
                    direction={
                      sortConfig.field === column.field 
                        ? sortConfig.direction 
                        : 'asc'
                    }
                    onClick={() => handleSort(column.field)}
                  >
                    {column.label}
                  </TableSortLabel>
                ) : (
                  column.label
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        {loading && renderLoadingState()}
        {error && renderErrorState()}
        {!loading && !error && data.length === 0 && renderEmptyState()}
        
        {!loading && !error && data.length > 0 && (
          <TableBody>
            {sortedData.map((row, index) => (
              <React.Fragment key={row.id || index}>
                <TableRow
                  hover={hover}
                  onClick={(event) => {
                    if (onRowClick) onRowClick(row, event);
                  }}
                  selected={selectedRows.includes(row.id)}
                  sx={{ 
                    cursor: (onRowClick || expandable) ? 'pointer' : 'default'
                  }}
                >
                  {selectable && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedRows.includes(row.id)}
                        onChange={(event) => {
                          event.stopPropagation();
                          if (onRowSelect) onRowSelect(row.id);
                        }}
                      />
                    </TableCell>
                  )}
                  {expandable && (
                    <TableCell padding="checkbox">
                      <IconButton
                        size="small"
                        onClick={(event) => handleExpandRow(row.id, event)}
                      >
                        {expandedRows.has(row.id) 
                          ? <CollapseIcon /> 
                          : <ExpandIcon />
                        }
                      </IconButton>
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell
                      key={column.field}
                      align={column.numeric ? 'right' : 'left'}
                    >
                      {column.render 
                        ? column.render(row[column.field], row)
                        : row[column.field]
                      }
                    </TableCell>
                  ))}
                </TableRow>
                {expandable && expandedRows.has(row.id) && (
                  <TableRow>
                    <TableCell
                      colSpan={
                        columns.length + 
                        (selectable ? 1 : 0) + 
                        (expandable ? 1 : 0)
                      }
                      sx={{ py: 0 }}
                    >
                      {renderExpandedRow(row)}
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        )}
      </Table>
    </TableContainer>
  );
};

export default DataGrid;