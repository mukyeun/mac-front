import React, { useRef, useState, useEffect } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Typography,
  useTheme
} from '@mui/material';
import { FixedSizeList, VariableSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import InfiniteLoader from 'react-window-infinite-loader';

const VirtualList = ({
  items = [],
  renderItem,
  height = 400,
  width = '100%',
  itemSize = 50,
  overscanCount = 5,
  threshold = 15,
  hasMore = false,
  loading = false,
  onLoadMore,
  emptyMessage = '데이터가 없습니다',
  loadingMessage = '로딩 중...',
  variableSize = false,
  estimatedItemSize = 50,
  getItemSize,
  headerHeight = 0,
  header,
  scrollToItem,
  onScroll,
  sx = {}
}) => {
  const theme = useTheme();
  const listRef = useRef(null);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // 아이템 렌더링
  const ItemRenderer = ({ index, style }) => {
    // 헤더 렌더링
    if (header && index === 0) {
      return (
        <div style={style}>
          {header}
        </div>
      );
    }

    // 로딩 인디케이터 렌더링
    if (index === items.length) {
      return (
        <ListItem style={style}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              py: 2
            }}
          >
            <CircularProgress size={24} sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {loadingMessage}
            </Typography>
          </Box>
        </ListItem>
      );
    }

    // 실제 아이템 렌더링
    const actualIndex = header ? index - 1 : index;
    const item = items[actualIndex];

    if (!item) return null;

    return (
      <div style={style}>
        {renderItem ? (
          renderItem(item, actualIndex)
        ) : (
          <ListItem>
            <ListItemText primary={item.toString()} />
          </ListItem>
        )}
      </div>
    );
  };

  // 아이템 크기 계산
  const getSize = (index) => {
    if (header && index === 0) return headerHeight;
    if (index === items.length) return 64; // 로딩 인디케이터 높이
    
    const actualIndex = header ? index - 1 : index;
    return getItemSize ? getItemSize(actualIndex) : itemSize;
  };

  // 무한 스크롤 처리
  const loadMoreItems = async (startIndex, stopIndex) => {
    if (!hasMore || loading || isLoadingMore) return;

    const threshold = items.length - stopIndex;
    if (threshold <= 15) {
      setIsLoadingMore(true);
      if (onLoadMore) {
        await onLoadMore();
      }
      setIsLoadingMore(false);
    }
  };

  // 스크롤 이벤트 처리
  const handleScroll = ({ scrollOffset, scrollDirection }) => {
    setScrollOffset(scrollOffset);
    if (onScroll) {
      onScroll({ scrollOffset, scrollDirection });
    }
  };

  // scrollToItem prop 변경 시 스크롤 처리
  useEffect(() => {
    if (scrollToItem !== undefined && listRef.current) {
      listRef.current.scrollToItem(scrollToItem, 'start');
    }
  }, [scrollToItem]);

  // 빈 상태 렌더링
  if (items.length === 0 && !loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height,
          width,
          ...sx
        }}
      >
        <Typography color="text.secondary">
          {emptyMessage}
        </Typography>
      </Box>
    );
  }

  // 초기 로딩 상태 렌더링
  if (items.length === 0 && loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height,
          width,
          ...sx
        }}
      >
        <CircularProgress size={24} sx={{ mr: 1 }} />
        <Typography color="text.secondary">
          {loadingMessage}
        </Typography>
      </Box>
    );
  }

  const itemCount = items.length + (hasMore ? 1 : 0) + (header ? 1 : 0);

  return (
    <Box
      sx={{
        height,
        width,
        ...sx
      }}
    >
      <AutoSizer>
        {({ height: autoHeight, width: autoWidth }) => (
          <InfiniteLoader
            isItemLoaded={index => index < items.length}
            itemCount={itemCount}
            loadMoreItems={loadMoreItems}
            threshold={threshold}
          >
            {({ onItemsRendered, ref }) => {
              const ListComponent = variableSize ? VariableSizeList : FixedSizeList;
              return (
                <ListComponent
                  ref={(list) => {
                    ref(list);
                    listRef.current = list;
                  }}
                  height={autoHeight}
                  width={autoWidth}
                  itemCount={itemCount}
                  itemSize={variableSize ? getSize : itemSize}
                  estimatedItemSize={estimatedItemSize}
                  overscanCount={overscanCount}
                  onItemsRendered={onItemsRendered}
                  onScroll={handleScroll}
                >
                  {ItemRenderer}
                </ListComponent>
              );
            }}
          </InfiniteLoader>
        )}
      </AutoSizer>
    </Box>
  );
};

export default VirtualList;