import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  Tooltip,
  Badge,
  Skeleton,
  useTheme
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreIcon,
  DragIndicator as DragIcon
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const Kanban = ({
  columns = [],
  items = {},
  onDragEnd,
  onAddItem,
  onItemClick,
  onColumnAction,
  loading = false,
  draggable = true,
  showAddButton = true,
  columnMinWidth = 300,
  columnMaxWidth = 350,
  itemHeight = 80,
  loadingColumns = 3,
  loadingItems = 5,
  sx = {}
}) => {
  const theme = useTheme();
  const [draggedItemId, setDraggedItemId] = useState(null);

  // 드래그 시작 처리
  const handleDragStart = (start) => {
    setDraggedItemId(start.draggableId);
  };

  // 드래그 종료 처리
  const handleDragEnd = (result) => {
    setDraggedItemId(null);
    if (!result.destination) return;
    
    if (onDragEnd) {
      onDragEnd(
        result.source.droppableId,
        result.destination.droppableId,
        result.source.index,
        result.destination.index
      );
    }
  };

  // 로딩 상태 렌더링
  const renderLoading = () => (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        overflowX: 'auto',
        p: 2,
        minHeight: 200
      }}
    >
      {Array.from({ length: loadingColumns }).map((_, columnIndex) => (
        <Paper
          key={columnIndex}
          sx={{
            width: columnMinWidth,
            minWidth: columnMinWidth,
            maxWidth: columnMaxWidth,
            p: 2
          }}
        >
          <Skeleton variant="text" width="60%" height={32} />
          <Box sx={{ mt: 2 }}>
            {Array.from({ length: loadingItems }).map((_, itemIndex) => (
              <Skeleton
                key={itemIndex}
                variant="rectangular"
                height={itemHeight}
                sx={{ mb: 1, borderRadius: 1 }}
              />
            ))}
          </Box>
        </Paper>
      ))}
    </Box>
  );

  if (loading) {
    return renderLoading();
  }

  return (
    <DragDropContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          overflowX: 'auto',
          p: 2,
          minHeight: 200,
          '&::-webkit-scrollbar': {
            height: 8
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: theme.palette.action.hover
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.action.active,
            borderRadius: 4
          },
          ...sx
        }}
      >
        {columns.map((column) => (
          <Paper
            key={column.id}
            sx={{
              width: columnMinWidth,
              minWidth: columnMinWidth,
              maxWidth: columnMaxWidth,
              backgroundColor: theme.palette.background.default,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: `1px solid ${theme.palette.divider}`
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  {column.title}
                </Typography>
                {column.count !== undefined && (
                  <Badge
                    badgeContent={column.count}
                    color="primary"
                    sx={{ ml: 1 }}
                  />
                )}
              </Box>
              {onColumnAction && (
                <IconButton
                  size="small"
                  onClick={(event) => onColumnAction(column, event)}
                >
                  <MoreIcon fontSize="small" />
                </IconButton>
              )}
            </Box>

            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <Box
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  sx={{
                    flex: 1,
                    p: 1,
                    backgroundColor: snapshot.isDraggingOver
                      ? theme.palette.action.hover
                      : 'transparent',
                    minHeight: 100
                  }}
                >
                  {items[column.id]?.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                      isDragDisabled={!draggable}
                    >
                      {(provided, snapshot) => (
                        <Paper
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          elevation={snapshot.isDragging ? 8 : 1}
                          sx={{
                            p: 2,
                            mb: 1,
                            backgroundColor: theme.palette.background.paper,
                            cursor: draggable ? 'grab' : 'pointer',
                            '&:hover': {
                              backgroundColor: theme.palette.action.hover
                            },
                            opacity: draggedItemId === item.id ? 0.5 : 1
                          }}
                          onClick={() => {
                            if (onItemClick) onItemClick(item);
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                            {draggable && (
                              <Box
                                {...provided.dragHandleProps}
                                sx={{
                                  mr: 1,
                                  color: theme.palette.text.secondary,
                                  cursor: 'grab'
                                }}
                              >
                                <DragIcon fontSize="small" />
                              </Box>
                            )}
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="subtitle2" gutterBottom>
                                {item.title}
                              </Typography>
                              {item.description && (
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical'
                                  }}
                                >
                                  {item.description}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </Paper>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>

            {showAddButton && onAddItem && (
              <Box sx={{ p: 1 }}>
                <Button
                  fullWidth
                  startIcon={<AddIcon />}
                  onClick={() => onAddItem(column.id)}
                  sx={{ justifyContent: 'flex-start' }}
                >
                  항목 추가
                </Button>
              </Box>
            )}
          </Paper>
        ))}
      </Box>
    </DragDropContext>
  );
};

export default Kanban;