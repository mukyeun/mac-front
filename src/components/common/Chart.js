import React, { useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  useTheme
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Pie, Doughnut, PolarArea, Radar } from 'react-chartjs-2';

// Chart.js 플러그인 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Chart = ({
  type = 'line',
  data,
  options = {},
  width,
  height,
  title,
  loading = false,
  error = null,
  emptyMessage = '데이터가 없습니다',
  errorMessage = '차트를 불러오는 중 오류가 발생했습니다',
  sx = {}
}) => {
  const theme = useTheme();
  const chartRef = useRef(null);

  // 기본 옵션 설정
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: theme.typography.fontFamily,
            size: 12
          },
          color: theme.palette.text.primary
        }
      },
      title: {
        display: !!title,
        text: title,
        font: {
          family: theme.typography.fontFamily,
          size: 14,
          weight: 500
        },
        color: theme.palette.text.primary,
        padding: 16
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
        backgroundColor: theme.palette.background.paper,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        padding: 8,
        bodyFont: {
          family: theme.typography.fontFamily
        },
        titleFont: {
          family: theme.typography.fontFamily,
          weight: 600
        }
      }
    },
    scales: type === 'line' || type === 'bar' ? {
      x: {
        grid: {
          color: theme.palette.divider,
          borderColor: theme.palette.divider
        },
        ticks: {
          font: {
            family: theme.typography.fontFamily,
            size: 12
          },
          color: theme.palette.text.secondary
        }
      },
      y: {
        grid: {
          color: theme.palette.divider,
          borderColor: theme.palette.divider
        },
        ticks: {
          font: {
            family: theme.typography.fontFamily,
            size: 12
          },
          color: theme.palette.text.secondary
        }
      }
    } : undefined
  };

  // 차트 컴포넌트 선택
  const ChartComponent = {
    line: Line,
    bar: Bar,
    pie: Pie,
    doughnut: Doughnut,
    polarArea: PolarArea,
    radar: Radar
  }[type];

  // 테마 변경 시 차트 업데이트
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.update();
    }
  }, [theme.palette.mode]);

  // 로딩 상태 렌더링
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: width || '100%',
          height: height || 400,
          ...sx
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // 에러 상태 렌더링
  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: width || '100%',
          height: height || 400,
          ...sx
        }}
      >
        <Typography color="error">
          {error || errorMessage}
        </Typography>
      </Box>
    );
  }

  // 빈 데이터 상태 렌더링
  if (!data || !data.datasets || data.datasets.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: width || '100%',
          height: height || 400,
          ...sx
        }}
      >
        <Typography color="text.secondary">
          {emptyMessage}
        </Typography>
      </Box>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        width: width || '100%',
        height: height || 400,
        border: `1px solid ${theme.palette.divider}`,
        ...sx
      }}
    >
      <ChartComponent
        ref={chartRef}
        data={data}
        options={{
          ...defaultOptions,
          ...options
        }}
      />
    </Paper>
  );
};

export default Chart;