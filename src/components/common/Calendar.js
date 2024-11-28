import React, { useState } from 'react';
import {
  Box,
  Paper,
  IconButton,
  Typography,
  Button,
  Badge,
  Tooltip,
  useTheme,
  alpha
} from '@mui/material';
import {
  ChevronLeft as PrevIcon,
  ChevronRight as NextIcon,
  Today as TodayIcon
} from '@mui/icons-material';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';

const Calendar = ({
  events = [],
  selectedDate = new Date(),
  onDateSelect,
  onEventClick,
  onMonthChange,
  loading = false,
  minDate,
  maxDate,
  eventColors = {
    default: 'primary',
    success: 'success',
    warning: 'warning',
    error: 'error'
  },
  firstDayOfWeek = 0, // 0: 일요일, 1: 월요일
  showWeekends = true,
  dense = false,
  sx = {}
}) => {
  const theme = useTheme();
  const [currentDate, setCurrentDate] = useState(dayjs(selectedDate));

  // 요일 레이블
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
  const sortedWeekDays = [
    ...weekDays.slice(firstDayOfWeek),
    ...weekDays.slice(0, firstDayOfWeek)
  ];

  // 달력 데이터 생성
  const generateCalendarData = () => {
    const firstDay = currentDate.startOf('month');
    const lastDay = currentDate.endOf('month');
    const startDate = firstDay.subtract(
      (firstDay.day() - firstDayOfWeek + 7) % 7,
      'day'
    );
    
    const calendarDays = [];
    let currentWeek = [];
    
    for (let i = 0; i < 42; i++) {
      const date = startDate.add(i, 'day');
      const isCurrentMonth = date.month() === currentDate.month();
      const isToday = date.isSame(dayjs(), 'day');
      const isSelected = date.isSame(dayjs(selectedDate), 'day');
      const isWeekend = date.day() === 0 || date.day() === 6;
      const isDisabled = (
        (minDate && date.isBefore(dayjs(minDate), 'day')) ||
        (maxDate && date.isAfter(dayjs(maxDate), 'day'))
      );

      // 해당 날짜의 이벤트 필터링
      const dayEvents = events.filter(event =>
        dayjs(event.date).isSame(date, 'day')
      );

      currentWeek.push({
        date,
        isCurrentMonth,
        isToday,
        isSelected,
        isWeekend,
        isDisabled,
        events: dayEvents
      });

      if (currentWeek.length === 7) {
        calendarDays.push(currentWeek);
        currentWeek = [];
      }
    }

    return calendarDays;
  };

  // 월 변경 처리
  const handleMonthChange = (amount) => {
    const newDate = currentDate.add(amount, 'month');
    setCurrentDate(newDate);
    if (onMonthChange) {
      onMonthChange(newDate.toDate());
    }
  };

  // 오늘로 이동
  const handleTodayClick = () => {
    const today = dayjs();
    setCurrentDate(today);
    if (onDateSelect) {
      onDateSelect(today.toDate());
    }
    if (onMonthChange) {
      onMonthChange(today.toDate());
    }
  };

  // 날짜 선택 처리
  const handleDateClick = (day) => {
    if (!day.isDisabled && onDateSelect) {
      onDateSelect(day.date.toDate());
    }
  };

  // 이벤트 클릭 처리
  const handleEventClick = (event, e) => {
    e.stopPropagation();
    if (onEventClick) {
      onEventClick(event);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        ...sx
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={() => handleMonthChange(-1)}>
            <PrevIcon />
          </IconButton>
          <Typography variant="h6">
            {currentDate.format('YYYY년 M월')}
          </Typography>
          <IconButton onClick={() => handleMonthChange(1)}>
            <NextIcon />
          </IconButton>
        </Box>
        <Button
          startIcon={<TodayIcon />}
          onClick={handleTodayClick}
          size="small"
        >
          오늘
        </Button>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          borderBottom: `1px solid ${theme.palette.divider}`
        }}
      >
        {sortedWeekDays.map((day, index) => (
          <Typography
            key={day}
            variant="subtitle2"
            align="center"
            sx={{
              py: 1,
              color: [0, 6].includes((index + firstDayOfWeek) % 7)
                ? theme.palette.error.main
                : 'inherit'
            }}
          >
            {day}
          </Typography>
        ))}
      </Box>

      <Box>
        {generateCalendarData().map((week, weekIndex) => (
          <Box
            key={weekIndex}
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              borderBottom: weekIndex < 5 ? `1px solid ${theme.palette.divider}` : 'none'
            }}
          >
            {week.map((day, dayIndex) => (
              <Box
                key={dayIndex}
                onClick={() => handleDateClick(day)}
                sx={{
                  position: 'relative',
                  height: dense ? 80 : 120,
                  p: 0.5,
                  cursor: day.isDisabled ? 'default' : 'pointer',
                  backgroundColor: day.isSelected
                    ? alpha(theme.palette.primary.main, 0.1)
                    : day.isToday
                    ? alpha(theme.palette.primary.main, 0.05)
                    : 'transparent',
                  '&:hover': {
                    backgroundColor: !day.isDisabled && alpha(theme.palette.action.hover, 0.1)
                  },
                  borderRight: dayIndex < 6 ? `1px solid ${theme.palette.divider}` : 'none'
                }}
              >
                <Typography
                  variant="body2"
                  align="center"
                  sx={{
                    fontWeight: day.isToday ? 600 : 400,
                    color: !day.isCurrentMonth
                      ? theme.palette.text.disabled
                      : day.isWeekend
                      ? theme.palette.error.main
                      : 'inherit',
                    opacity: day.isDisabled ? 0.5 : 1
                  }}
                >
                  {day.date.format('D')}
                </Typography>

                <Box
                  sx={{
                    mt: 0.5,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.5
                  }}
                >
                  {day.events.slice(0, dense ? 2 : 3).map((event, index) => (
                    <Tooltip
                      key={index}
                      title={event.title}
                      placement="top"
                    >
                      <Box
                        onClick={(e) => handleEventClick(event, e)}
                        sx={{
                          p: 0.5,
                          borderRadius: 0.5,
                          backgroundColor: alpha(
                            theme.palette[eventColors[event.type] || eventColors.default].main,
                            0.1
                          ),
                          color: theme.palette[eventColors[event.type] || eventColors.default].main,
                          fontSize: '0.75rem',
                          lineHeight: 1.2,
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: alpha(
                              theme.palette[eventColors[event.type] || eventColors.default].main,
                              0.2
                            )
                          }
                        }}
                      >
                        {event.title}
                      </Box>
                    </Tooltip>
                  ))}
                  {day.events.length > (dense ? 2 : 3) && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      align="center"
                    >
                      +{day.events.length - (dense ? 2 : 3)}개
                    </Typography>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default Calendar;