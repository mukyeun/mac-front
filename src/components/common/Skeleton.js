import React from 'react';
import {
  Skeleton as MuiSkeleton,
  Box,
  useTheme
} from '@mui/material';

const Skeleton = ({
  variant = 'text',
  type,
  width,
  height,
  rows = 1,
  spacing = 1,
  animation = 'pulse',
  rounded = false,
  sx = {}
}) => {
  const theme = useTheme();

  // 미리 정의된 타입별 스타일
  const types = {
    // 텍스트 스켈레톤
    text: {
      width: '100%',
      height: 20
    },
    title: {
      width: '60%',
      height: 32
    },
    subtitle: {
      width: '40%',
      height: 24
    },
    // 이미지 스켈레톤
    avatar: {
      width: 40,
      height: 40,
      variant: 'circular'
    },
    thumbnail: {
      width: 100,
      height: 100,
      variant: 'rectangular'
    },
    image: {
      width: '100%',
      height: 200,
      variant: 'rectangular'
    },
    // 버튼 스켈레톤
    button: {
      width: 100,
      height: 36,
      variant: 'rectangular'
    },
    iconButton: {
      width: 40,
      height: 40,
      variant: 'circular'
    },
    // 카드 스켈레톤
    card: {
      width: '100%',
      height: 200,
      variant: 'rectangular'
    },
    // 커스텀 테이블 로우 스켈레톤
    tableRow: {
      width: '100%',
      height: 53,
      variant: 'rectangular'
    }
  };

  // 현재 타입의 스타일 가져오기
  const currentType = type ? types[type] || {} : {};
  
  // 스켈레톤 컴포넌트 생성
  const createSkeleton = (index) => (
    <MuiSkeleton
      key={index}
      variant={currentType.variant || variant}
      width={width || currentType.width}
      height={height || currentType.height}
      animation={animation}
      sx={{
        borderRadius: rounded ? 1 : undefined,
        ...sx
      }}
    />
  );

  // 여러 줄의 스켈레톤이 필요한 경우
  if (rows > 1) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: spacing }}>
        {Array.from(new Array(rows)).map((_, index) => createSkeleton(index))}
      </Box>
    );
  }

  return createSkeleton(0);
};

// 미리 정의된 스켈레톤 그룹
export const SkeletonGroup = {
  // 카드 컨텐츠 스켈레톤
  CardContent: () => (
    <Box sx={{ p: 2 }}>
      <Skeleton type="title" sx={{ mb: 2 }} />
      <Skeleton type="text" rows={3} />
    </Box>
  ),

  // 리스트 아이템 스켈레톤
  ListItem: () => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
      <Skeleton type="avatar" />
      <Box sx={{ flex: 1 }}>
        <Skeleton type="text" width="80%" />
        <Skeleton type="text" width="60%" />
      </Box>
    </Box>
  ),

  // 테이블 로우 스켈레톤
  TableRows: ({ rows = 5 }) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {Array.from(new Array(rows)).map((_, index) => (
        <Skeleton key={index} type="tableRow" />
      ))}
    </Box>
  ),

  // 폼 스켈레톤
  Form: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
      <Skeleton type="title" />
      <Skeleton type="text" rows={3} />
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Skeleton type="button" />
        <Skeleton type="button" />
      </Box>
    </Box>
  )
};

export default Skeleton;