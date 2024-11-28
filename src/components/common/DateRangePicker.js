import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  ButtonGroup,
  Popover,
  IconButton,
  Typography,
  Stack,
  useTheme
} from '@mui/material';
import {
  DateCalendar,
  LocalizationProvider,
  PickersDay
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  CalendarMonth as CalendarIcon,
  NavigateBefore,
  NavigateNext,
  Clear as ClearIcon
} from '@mui/icons-material';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';

const DateRangePicker = ({
  startDate,
  endDate,
  onChange,
  minDate,
  maxDate,
  disabled = false,
  readOnly = false,
  clearable = true,
  format = 'YYYY-MM-DD',
  placeholder = ['시작일', '종료일'],
  presets = [
    { label: '오늘', days: 0 },
    { label: '어제', days: 1 },
    { label: '지난 7일', days: 7 },
    { label: '지난 30일', days: 30 },
    { label: '지난 90일', days: 90 }
  ],
  sx = {}
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [tempStartDate, setTempStartDate] = useState(startDate);
  const [tempEndDate, setTempEndDate] = useState(endDate);
  const [selectingStart, setSelectingStart] = useState(true);

  const handleClick = (event) => {
    if (!disabled && !readOnly) {
      setAnchorEl(event.currentTarget);
      setTempStartDate(startDate);
      setTempEndDate(endDate);
      setSelectingStart(true);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDateSelect = (date) => {
    if (selectingStart) {
      setTempStartDate(date);
      setSelectingStart(false);
    } else {
      if (date.isBefore(tempStartDate)) {
        setTempStartDate(date);
        setTempEndDate(null);
        setSelectingStart(false);
      } else {
        setTempEndDate(date);
        onChange(tempStartDate, date);
        handleClose();
      }
    }
  };

  const handlePresetClick = (days) => {
    const end = dayjs();
    const start = end.subtract(days, 'day');
    onChange(start, end);
    handleClose();
  };

  const handleClear = () => {
    onChange(null, null);
  };

  const renderCustomDay = (date, selectedDates, pickersDayProps) => {
    const isSelected = date.isSame(tempStartDate, 'day') || date.isSame(tempEndDate, 'day');
    const isInRange = tempStartDate && tempEndDate && 
      date.isAfter(tempStartDate, 'day') && date.isBefore(tempEndDate, 'day');

    return (
      <PickersDay
        {...pickersDayProps}
        sx={{
          ...pickersDayProps.sx,
          ...(isInRange && {
            backgroundColor: theme.palette.primary.light,
            color: theme.palette.primary.contrastText,
            '&:hover': {
              backgroundColor: theme.palette.primary.main
            }
          }),
          ...(isSelected && {
            backgroundColor: `${theme.palette.primary.main} !important`,
            color: `${theme.palette.primary.contrastText} !important`
          })
        }}
      />
    );
  };

  const formatDate = (date) => {
    return date ? dayjs(date).format(format) : '';
  };

  const open = Boolean(anchorEl);

  return (
    <Box sx={sx}>
      <Stack direction="row" spacing={1} alignItems="center">
        <TextField
          value={formatDate(startDate)}
          placeholder={placeholder[0]}
          onClick={handleClick}
          InputProps={{
            startAdornment: <CalendarIcon sx={{ mr: 1, color: 'action.active' }} />,
            readOnly: true
          }}
          disabled={disabled}
          sx={{ width: 150 }}
        />
        <Typography color="text.secondary">~</Typography>
        <TextField
          value={formatDate(endDate)}
          placeholder={placeholder[1]}
          onClick={handleClick}
          InputProps={{
            startAdornment: <CalendarIcon sx={{ mr: 1, color: 'action.active' }} />,
            readOnly: true
          }}
          disabled={disabled}
          sx={{ width: 150 }}
        />
        {clearable && (startDate || endDate) && !disabled && !readOnly && (
          <IconButton size="small" onClick={handleClear}>
            <ClearIcon fontSize="small" />
          </IconButton>
        )}
      </Stack>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        sx={{ mt: 1 }}
      >
        <Box sx={{ p: 2 }}>
          <Stack direction="row" spacing={2}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                {selectingStart ? '시작일 선택' : '종료일 선택'}
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
                <DateCalendar
                  value={selectingStart ? tempStartDate : tempEndDate}
                  onChange={handleDateSelect}
                  minDate={minDate}
                  maxDate={maxDate}
                  slots={{
                    day: renderCustomDay
                  }}
                />
              </LocalizationProvider>
            </Box>
            {presets && (
              <Box sx={{ minWidth: 120 }}>
                <Typography variant="subtitle2" gutterBottom>
                  빠른 선택
                </Typography>
                <ButtonGroup
                  orientation="vertical"
                  variant="outlined"
                  size="small"
                  sx={{ width: '100%' }}
                >
                  {presets.map((preset, index) => (
                    <Button
                      key={index}
                      onClick={() => handlePresetClick(preset.days)}
                      sx={{ justifyContent: 'flex-start' }}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </ButtonGroup>
              </Box>
            )}
          </Stack>
        </Box>
      </Popover>
    </Box>
  );
};

export default DateRangePicker;