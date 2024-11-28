import React, { useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Collapse,
  Checkbox,
  IconButton,
  Typography,
  Skeleton,
  useTheme
} from '@mui/material';
import {
  ExpandMore as ExpandIcon,
  ChevronRight as CollapseIcon,
  MoreVert as MoreIcon,
  FolderOutlined as FolderIcon,
  InsertDriveFileOutlined as FileIcon
} from '@mui/icons-material';

const TreeView = ({
  data = [],
  selected = [],
  expanded = [],
  onSelect,
  onExpand,
  onNodeClick,
  onContextMenu,
  loading = false,
  selectable = false,
  multiSelect = false,
  showCheckbox = false,
  showIcon = true,
  showMore = false,
  loadingRows = 3,
  indentStep = 20,
  nodeHeight = 36,
  sx = {}
}) => {
  const theme = useTheme();
  const [contextMenu, setContextMenu] = useState(null);

  // 노드 확장/축소 처리
  const handleExpand = (nodeId, event) => {
    event.stopPropagation();
    if (onExpand) {
      onExpand(nodeId);
    }
  };

  // 노드 선택 처리
  const handleSelect = (nodeId, event) => {
    event.stopPropagation();
    if (onSelect) {
      if (multiSelect && event.shiftKey && selected.length > 0) {
        // Shift 키를 누른 상태에서의 다중 선택
        const lastSelected = selected[selected.length - 1];
        const allNodes = getAllNodes(data);
        const startIndex = allNodes.findIndex(node => node.id === lastSelected);
        const endIndex = allNodes.findIndex(node => node.id === nodeId);
        const rangeNodes = allNodes.slice(
          Math.min(startIndex, endIndex),
          Math.max(startIndex, endIndex) + 1
        );
        onSelect(rangeNodes.map(node => node.id));
      } else if (multiSelect && (event.ctrlKey || event.metaKey)) {
        // Ctrl/Command 키를 누른 상태에서의 다중 선택
        const newSelected = selected.includes(nodeId)
          ? selected.filter(id => id !== nodeId)
          : [...selected, nodeId];
        onSelect(newSelected);
      } else {
        onSelect([nodeId]);
      }
    }
  };

  // 컨텍스트 메뉴 처리
  const handleContextMenu = (node, event) => {
    event.preventDefault();
    event.stopPropagation();
    if (onContextMenu) {
      setContextMenu({
        node,
        mouseX: event.clientX,
        mouseY: event.clientY
      });
      onContextMenu(node, event);
    }
  };

  // 모든 노드 가져오기 (재귀)
  const getAllNodes = (nodes) => {
    return nodes.reduce((acc, node) => {
      acc.push(node);
      if (node.children) {
        acc.push(...getAllNodes(node.children));
      }
      return acc;
    }, []);
  };

  // 로딩 상태 렌더링
  const renderLoading = () => (
    <List>
      {Array.from({ length: loadingRows }).map((_, index) => (
        <ListItem
          key={`loading-${index}`}
          sx={{ height: nodeHeight }}
        >
          <Skeleton variant="rectangular" width={20} height={20} sx={{ mr: 2 }} />
          <Skeleton variant="text" width={`${Math.random() * 50 + 30}%`} />
        </ListItem>
      ))}
    </List>
  );

  // 노드 렌더링 (재귀)
  const renderNode = (node, level = 0) => {
    const isExpanded = expanded.includes(node.id);
    const isSelected = selected.includes(node.id);
    const hasChildren = node.children && node.children.length > 0;

    return (
      <React.Fragment key={node.id}>
        <ListItem
          disablePadding
          sx={{
            pl: level * (indentStep / 8),
            backgroundColor: isSelected 
              ? theme.palette.action.selected 
              : 'transparent'
          }}
        >
          <ListItemButton
            onClick={(event) => {
              if (onNodeClick) {
                onNodeClick(node, event);
              }
              if (selectable && !showCheckbox) {
                handleSelect(node.id, event);
              }
            }}
            onContextMenu={(event) => handleContextMenu(node, event)}
            dense
            sx={{ height: nodeHeight }}
          >
            <ListItemIcon sx={{ minWidth: 32 }}>
              {hasChildren && (
                <IconButton
                  size="small"
                  onClick={(event) => handleExpand(node.id, event)}
                  sx={{ p: 0 }}
                >
                  {isExpanded ? <ExpandIcon /> : <CollapseIcon />}
                </IconButton>
              )}
            </ListItemIcon>

            {showCheckbox && (
              <Checkbox
                edge="start"
                checked={isSelected}
                onChange={(event) => handleSelect(node.id, event)}
                onClick={(event) => event.stopPropagation()}
              />
            )}

            {showIcon && (
              <ListItemIcon sx={{ minWidth: 32 }}>
                {hasChildren ? <FolderIcon /> : <FileIcon />}
              </ListItemIcon>
            )}

            <ListItemText
              primary={
                <Typography
                  variant="body2"
                  noWrap
                  sx={{
                    fontWeight: isSelected ? 500 : 400
                  }}
                >
                  {node.name}
                </Typography>
              }
              secondary={node.description}
            />

            {showMore && (
              <IconButton
                size="small"
                onClick={(event) => handleContextMenu(node, event)}
              >
                <MoreIcon fontSize="small" />
              </IconButton>
            )}
          </ListItemButton>
        </ListItem>

        {hasChildren && isExpanded && (
          <Collapse in={true}>
            <List disablePadding>
              {node.children.map(childNode => 
                renderNode(childNode, level + 1)
              )}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  if (loading) {
    return renderLoading();
  }

  return (
    <Box sx={sx}>
      <List disablePadding>
        {data.map(node => renderNode(node))}
      </List>
    </Box>
  );
};

export default TreeView;