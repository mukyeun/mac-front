import React, { useRef, useState, useEffect } from 'react';
import {
  Box,
  Paper,
  IconButton,
  Typography,
  Tooltip,
  useTheme
} from '@mui/material';
import {
  Undo as UndoIcon,
  Clear as ClearIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  ContentCopy as CopyIcon,
  Check as CheckIcon
} from '@mui/icons-material';

const Signature = ({
  value,
  onChange,
  width = 400,
  height = 200,
  lineWidth = 2,
  lineColor = '#000000',
  backgroundColor = '#ffffff',
  disabled = false,
  readOnly = false,
  error = false,
  label,
  helperText,
  showControls = true,
  showUndo = true,
  showClear = true,
  showDownload = true,
  showCopy = true,
  downloadFormat = 'png',
  downloadFileName = 'signature',
  sx = {}
}) => {
  const theme = useTheme();
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState(null);
  const [history, setHistory] = useState([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [copied, setCopied] = useState(false);

  // 캔버스 초기화
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // 캔버스 크기 설정
    canvas.width = width;
    canvas.height = height;

    // 배경색 설정
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // 선 스타일 설정
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // 초기 이미지 로드
    if (value) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        saveState();
      };
      img.src = value;
    } else {
      saveState();
    }
  }, [width, height, lineColor, backgroundColor, lineWidth]);

  // 상태 저장
  const saveState = () => {
    const canvas = canvasRef.current;
    const newHistory = history.slice(0, currentStep + 1);
    newHistory.push(canvas.toDataURL());
    setHistory(newHistory);
    setCurrentStep(newHistory.length - 1);

    if (onChange) {
      onChange(canvas.toDataURL());
    }
  };

  // 실행 취소
  const handleUndo = () => {
    if (currentStep > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0);
        setCurrentStep(currentStep - 1);
        
        if (onChange) {
          onChange(history[currentStep - 1]);
        }
      };
      
      img.src = history[currentStep - 1];
    }
  };

  // 전체 지우기
  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);
    saveState();
  };

  // 다운로드
  const handleDownload = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `${downloadFileName}.${downloadFormat}`;
    link.href = canvas.toDataURL(`image/${downloadFormat}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 복사
  const handleCopy = async () => {
    try {
      const canvas = canvasRef.current;
      const dataUrl = canvas.toDataURL();
      const blob = await fetch(dataUrl).then(res => res.blob());
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy signature:', err);
    }
  };

  // 마우스/터치 이벤트 처리
  const handleStart = (event) => {
    if (disabled || readOnly) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const point = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };

    setIsDrawing(true);
    setLastPoint(point);
  };

  const handleMove = (event) => {
    if (!isDrawing || disabled || readOnly) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const point = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };

    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();

    setLastPoint(point);
  };

  const handleEnd = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveState();
    }
  };

  return (
    <Box sx={sx}>
      {label && (
        <Typography
          variant="body2"
          color={error ? 'error' : 'text.secondary'}
          gutterBottom
        >
          {label}
        </Typography>
      )}

      <Paper
        variant="outlined"
        sx={{
          p: 2,
          backgroundColor,
          borderColor: error ? 'error.main' : 'divider',
          opacity: disabled ? 0.5 : 1
        }}
      >
        <canvas
          ref={canvasRef}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          style={{
            touchAction: 'none',
            cursor: disabled || readOnly ? 'default' : 'crosshair'
          }}
        />

        {showControls && (
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              mt: 1,
              justifyContent: 'flex-end'
            }}
          >
            {showUndo && (
              <Tooltip title="실행 취소">
                <IconButton
                  size="small"
                  onClick={handleUndo}
                  disabled={disabled || readOnly || currentStep <= 0}
                >
                  <UndoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}

            {showClear && (
              <Tooltip title="전체 지우기">
                <IconButton
                  size="small"
                  onClick={handleClear}
                  disabled={disabled || readOnly}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}

            {showDownload && (
              <Tooltip title="다운로드">
                <IconButton
                  size="small"
                  onClick={handleDownload}
                  disabled={disabled}
                >
                  <DownloadIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}

            {showCopy && (
              <Tooltip title={copied ? '복사됨!' : '복사'}>
                <IconButton
                  size="small"
                  onClick={handleCopy}
                  disabled={disabled}
                  color={copied ? 'success' : 'default'}
                >
                  {copied ? (
                    <CheckIcon fontSize="small" />
                  ) : (
                    <CopyIcon fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>
            )}
          </Box>
        )}
      </Paper>

      {helperText && (
        <Typography
          variant="caption"
          color={error ? 'error' : 'text.secondary'}
          sx={{ mt: 0.5, display: 'block' }}
        >
          {helperText}
        </Typography>
      )}
    </Box>
  );
};

export default Signature;