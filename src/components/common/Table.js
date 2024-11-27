import React from 'react';
import {
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Checkbox,
  IconButton,
  Tooltip,
  Box,
  Typography
} from '@mui/material';
import {
  KeyboardArrowRight as ExpandIcon,
  KeyboardArrowDown as CollapseIcon
} from '@mui/icons-material';

const Table = ({
  columns,
  data,
  selectedItems = [],
  onSelectItem,
  onSelectAll,
  sortConfig,
  onSort,
  onRowClick,
  expandable,
  renderExpandedRow,
  emptyMessage = '데이터가 없습니다.',
  stickyHeader = true,
  dense = false,
  maxHeight
}) => {
  const [expandedRows, setExpandedRows] = React.useState(new Set());

  const handleExpandRow = (rowId) => {
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
  return (
    <TableContainer 
      component={Paper} 
      sx={{ maxHeight: maxHeight }}
    >
      <MuiTable 
        stickyHeader={stickyHeader}
        size={dense ? 'small' : 'medium'}
      >
        <TableHead>
          <TableRow>
            {onSelectAll && (
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    selectedItems.length > 0 && 
                    selectedItems.length < data.length
                  }
                  checked={
                    data.length > 0 && 
                    selectedItems.length === data.length
                  }
                  onChange={onSelectAll}
                />
              </TableCell>
            )}
            {expandable && <TableCell padding="checkbox" />}
            {columns.map((column) => (
              <TableCell
                key={column.id}
                align={column.numeric ? 'right' : 'left'}
                padding={column.disablePadding ? 'none' : 'normal'}
                sortDirection={sortConfig?.field === column.id ? sortConfig.direction : false}
                sx={column.width ? { width: column.width } : {}}
              >
                {onSort ? (
                  <TableSortLabel
                    active={sortConfig?.field === column.id}
                    direction={sortConfig?.field === column.id ? sortConfig.direction : 'asc'}
                    onClick={() => onSort(column.id)}
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
        <TableBody>
          {data.length > 0 ? (
            data.map((row, index) => (
              <React.Fragment key={row.id || index}>
                <TableRow
                  hover
                  onClick={(event) => {
                    if (onRowClick) onRowClick(row);
                    if (expandable) handleExpandRow(row.id);
                  }}
                  selected={selectedItems.includes(row.id)}
                  sx={{ cursor: (onRowClick || expandable) ? 'pointer' : 'default' }}
                >
                  {onSelectItem && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedItems.includes(row.id)}
                        onChange={(event) => {
                          event.stopPropagation();
                          onSelectItem(row.id);
                        }}
                      />
                    </TableCell>
                  )}
                  {expandable && (
                    <TableCell padding="checkbox">
                      <IconButton size="small" onClick={() => handleExpandRow(row.id)}>
                        {expandedRows.has(row.id) ? <CollapseIcon /> : <ExpandIcon />}
                      </IconButton>
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.numeric ? 'right' : 'left'}
                      padding={column.disablePadding ? 'none' : 'normal'}
                    >
                      {column.render ? column.render(row) : row[column.id]}
                    </TableCell>
                  ))}
                </TableRow>
                {expandable && expandedRows.has(row.id) && (
                  <TableRow>
                    <TableCell 
                      colSpan={columns.length + (onSelectItem ? 2 : 1)}
                      sx={{ py: 0 }}
                    >
                      {renderExpandedRow(row)}
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))
          ) : (
            <TableRow>
              <TableCell 
                colSpan={columns.length + (onSelectItem ? 1 : 0) + (expandable ? 1 : 0)}
                align="center"
              >
                <Typography color="text.secondary">
                  {emptyMessage}
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
};

export default Table;