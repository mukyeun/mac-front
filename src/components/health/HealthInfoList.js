import React, { useEffect, useState, useCallback } from 'react';
import { 
  Box, 
  Button, 
  IconButton, 
  Checkbox as MuiCheckbox,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  Tooltip
} from '@mui/material';
import { useHealthInfo } from '../../hooks/useHealthInfo';
import SearchBar from '../common/SearchBar';
import FilterPanel from '../common/FilterPanel';
import Pagination from '../common/Pagination';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import ErrorBoundary from '../common/ErrorBoundary';
import { healthInfoService } from '../../services/api';
import { newHealthInfoService } from '../../services/newHealthInfoService';

// Excel 아이콘 컴포넌트
const ExcelIcon = () => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="17" x2="16" y2="17" />
    <line x1="10" y1="9" x2="14" y2="9" />
  </svg>
);

// 테이블 열 설정
const columns = [
  { id: 'date', label: '날짜', width: 100 },
  { id: 'name', label: '이름', width: 120 },
  { id: 'phone', label: '연락처', width: 130 },
  { id: 'age', label: '나이', width: 70 },
  { id: 'gender', label: '성별', width: 70 },
  { id: 'personality', label: '성격', width: 100 },
  { id: 'bmi', label: 'BMI', width: 70 },
  { id: 'stress', label: '스트레스', width: 100 },
  { id: 'workload', label: '노동강도', width: 100 },
  { id: 'symptoms', label: '증상', width: 150 },
  { id: 'bloodPressure', label: '혈압', width: 100 },
  { id: 'medication', label: '복용약물', width: 150 }
];

// 증상 표시를 위한 커스텀 셀 컴포넌트
const SymptomsCell = ({ symptoms }) => {
  // 증상이 없는 경우
  if (!symptoms || symptoms.length === 0) {
    return <TableCell>-</TableCell>;
  }

  // 증상이 3개 이상인 경우 툴팁으로 전체 목록 표시
  if (symptoms.length > 2) {
    return (
      <TableCell>
        <Tooltip title={symptoms.join(', ')} arrow placement="top">
          <span>
            {symptoms.slice(0, 2).join(', ')} +{symptoms.length - 2}
          </span>
        </Tooltip>
      </TableCell>
    );
  }

  // 1-2개의 증상인 경우 직접 표시
  return <TableCell>{symptoms.join(', ')}</TableCell>;
};

const HealthInfoList = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  const [orderBy, setOrderBy] = useState('date');
  const [order, setOrder] = useState('desc');
  
  const {
    listStatus,
    listData,
    listError,
    loadList,
    searchTerm,
    setSearchTerm,
    filters,
    handleFilterChange,
  } = useHealthInfo();
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    loadList({ 
      sort: property,
      order: isAsc ? 'desc' : 'asc',
      ...filters 
    });
  };

  const handleInputChange = useCallback((e) => {
    e.preventDefault();
    setSearchTerm(e.target.value);
  }, [setSearchTerm]);

  const handleSearchSubmit = useCallback(async (e) => {
    if (e) e.preventDefault();
    if (!searchTerm.trim()) {
      loadList();
      return;
    }
    try {
      await loadList({
        name: searchTerm,
        ...filters,
        sort: orderBy,
        order
      });
    } catch (err) {
      console.error('검색 오류:', err);
    }
  }, [searchTerm, filters, orderBy, order, loadList]);

  useEffect(() => {
    loadList({ sort: orderBy, order });
  }, [loadList, orderBy, order]);

  const handleSelectAll = (e) => {
    setSelectedItems(e.target.checked ? (listData?.items?.map(item => item.id) || []) : []);
  };

  const handleSelectItem = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (!selectedItems.length) {
      alert('삭제할 항목을 선택해주세요.');
      return;
    }

    if (window.confirm(`선택한 ${selectedItems.length}개 항목을 삭제하시겠습니까?`)) {
      try {
        await newHealthInfoService.deleteMultiple(selectedItems);
        setSelectedItems([]);
        loadList({ sort: orderBy, order });
        alert('선택한 항목이 삭제되었습니다.');
      } catch (error) {
        console.error('Bulk delete error:', error);
        alert('삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const response = await fetch('http://localhost:5000/api/health-info/export');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `건강정보_${new Date().toLocaleDateString()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Excel export error:', error);
      alert('엑셀 파일 다운로드 중 오류가 발생했습니다.');
    } finally {
      setIsExporting(false);
    }
  };

  if (listStatus === 'loading') {
    return <LoadingSpinner message="건강 정보를 불러오는 중..." />;
  }

  if (listStatus === 'error') {
    return (
      <ErrorMessage 
        error={listError}
        onRetry={() => loadList({ sort: orderBy, order })}
        message="건강 정보를 불러오는데 실패했습니다."
        details="네트워크 연결을 확인하시거나 잠시 후 다시 시도해주세요."
      />
    );
  }

  return (
    <TableContainer component={Paper}>
      <Box sx={{ p: 2 }}>
        <SearchBar
          value={searchTerm}
          onChange={handleInputChange}
          onSearch={handleSearchSubmit}
        />

        <FilterPanel
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        <Box sx={{ display: 'flex', gap: 1, mb: 2, justifyContent: 'flex-end' }}>
          {selectedItems.length > 0 && (
            <Button
              variant="contained"
              color="error"
              onClick={handleBulkDelete}
            >
              선택한 항목 삭제 ({selectedItems.length}개)
            </Button>
          )}
          
          <Button
            variant="contained"
            color="success"
            onClick={handleExportExcel}
            disabled={isExporting}
            startIcon={<ExcelIcon />}
          >
            {isExporting ? '내보내는 중...' : '엑셀로 내보내기'}
          </Button>
        </Box>

        {listData?.items?.length > 0 ? (
          <>
            <MuiTable>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <MuiCheckbox
                      checked={selectedItems.length === listData.items.length}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      style={{ width: column.width }}
                      sortDirection={orderBy === column.id ? order : false}
                    >
                      <TableSortLabel
                        active={orderBy === column.id}
                        direction={orderBy === column.id ? order : 'asc'}
                        onClick={() => handleRequestSort(column.id)}
                      >
                        {column.label}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {listData.items.map(item => (
                  <TableRow 
                    key={item.id}
                    selected={selectedItems.includes(item.id)}
                    hover
                  >
                    <TableCell padding="checkbox">
                      <MuiCheckbox
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleSelectItem(item.id)}
                      />
                    </TableCell>
                    {columns.map(column => {
                      if (column.id === 'symptoms') {
                        return <SymptomsCell key={column.id} symptoms={item.symptoms} />;
                      }
                      return <TableCell key={column.id}>{item[column.id]}</TableCell>;
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </MuiTable>

            <Box sx={{ mt: 2 }}>
              <Pagination
                currentPage={listData.currentPage}
                totalPages={listData.totalPages}
                onPageChange={(page) => loadList({ page, sort: orderBy, order })}
              />
            </Box>
          </>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
            데이터가 없습니다.
          </Box>
        )}
      </Box>
    </TableContainer>
  );
};

export default function HealthInfoListWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <HealthInfoList />
    </ErrorBoundary>
  );
}