import React, { useState, useEffect } from 'react';
import Table from './Table';
import SearchBar from './common/SearchBar';
import FilterPanel from './common/FilterPanel';
import { Box } from '@mui/material';

const DataTable = ({
  columns,
  data,
  totalCount,
  onFetch,
  searchable = true,
  filterable = true,
  selectable = false,
  expandable = false,
  renderExpandedRow,
  onRowClick,
  loading = false,
  initialSort = { field: 'id', direction: 'asc' },
  initialFilters = {},
  searchPlaceholder = '검색...',
  emptyMessage = '데이터가 없습니다.'
}) => {
  // 상태 관리
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState(initialSort);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState(initialFilters);

  // 데이터 가져오기
  useEffect(() => {
    onFetch({
      page,
      rowsPerPage,
      sort: sortConfig.field,
      order: sortConfig.direction,
      search: searchQuery,
      filters
    });
  }, [page, rowsPerPage, sortConfig, searchQuery, filters]);

  // 핸들러들
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (field) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectItem = (id) => {
    setSelectedItems(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      }
      return [...prev, id];
    });
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedItems(data.map(row => row.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSearch = () => {
    setPage(0);
    onFetch({
      page: 0,
      rowsPerPage,
      sort: sortConfig.field,
      order: sortConfig.direction,
      search: searchQuery,
      filters
    });
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(0);
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* 검색 및 필터 영역 */}
      <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {searchable && (
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onSearch={handleSearch}
            placeholder={searchPlaceholder}
          />
        )}
        {filterable && (
          <FilterPanel
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        )}
      </Box>

      {/* 테이블 */}
      <Table
        columns={columns}
        data={data}
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={totalCount}
        selectedItems={selectable ? selectedItems : undefined}
        onSelectItem={selectable ? handleSelectItem : undefined}
        onSelectAll={selectable ? handleSelectAll : undefined}
        sortConfig={sortConfig}
        onSort={handleSort}
        onRowClick={onRowClick}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        expandable={expandable}
        renderExpandedRow={renderExpandedRow}
        emptyMessage={emptyMessage}
        loading={loading}
      />
    </Box>
  );
};

export default DataTable;