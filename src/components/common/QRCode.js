import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Paper,
  IconButton,
  Typography,
  CircularProgress,
  Tooltip,
  useTheme
} from '@mui/material';
import {
  Download as DownloadIcon,
  ContentCopy as CopyIcon,
  Check as CheckIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import QRCodeLib from 'qrcode';

const QRCode = ({
  value = '',
  size = 200,
  level = 'M',
  includeMargin = true,
  color = '#000000',
  backgroundColor = '#ffffff',
  imageSettings = null,
  renderAs = 'canvas',
  onError,
  loading = false,
  title,
  showDownload = true,
  showCopy = true,
  downloadFileName = 'qrcode',
  downloadFormat = 'png',
  sx = {}
}) => {
  const theme = useTheme();
  const canvasRef = useRef(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  // QR 코드 생성
  useEffect(() => {
    if (!value || !canvasRef.current) return;

    const options = {
      errorCorrectionLevel: level,
      margin: includeMargin ? 4 : 0,
      width: size,
      color: {
        dark: color,
        light: backgroundColor
      }
    };

    const generateQR = async () => {
      try {
        if (renderAs === 'canvas') {
          await QRCodeLib.toCanvas(canvasRef.current, value, options);
        } else {
          const dataUrl = await QRCodeLib.toDataURL(value, options);
          const img = canvasRef.current;
          img.src = dataUrl;
        }
        setError(null);
      } catch (err) {
        setError(err.message);
        if (onError) {
          onError(err);
        }
      }
    };

    generateQR();
  }, [value, size, level, includeMargin, color, backgroundColor, renderAs]);

  // 이미지 오버레이 처리
  useEffect(() => {
    if (!imageSettings || !canvasRef.current || renderAs !== 'canvas') return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const image = new Image();
    
    image.onload = () => {
      const { src, width, height, x, y } = imageSettings;
      ctx.drawImage(
        image,
        x ?? (size - width) / 2,
        y ?? (size - height) / 2,
        width,
        height
      );
    };

    image.src = imageSettings.src;
  }, [imageSettings, size]);

  // QR 코드 다운로드
  const handleDownload = () => {
    if (!canvasRef.current) return;

    const link = document.createElement('a');
    link.download = `${downloadFileName}.${downloadFormat}`;
    link.href = canvasRef.current.toDataURL(`image/${downloadFormat}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // QR 코드 복사
  const handleCopy = async () => {
    if (!canvasRef.current) return;

    try {
      const dataUrl = canvasRef.current.toDataURL();
      const blob = await fetch(dataUrl).then(res => res.blob());
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError('QR 코드 복사에 실패했습니다');
    }
  };

  return (
    <Box sx={sx}>
      {title && (
        <Typography
          variant="subtitle2"
          gutterBottom
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          {title}
          {error && (
            <Tooltip title={error}>
              <ErrorIcon color="error" fontSize="small" />
            </Tooltip>
          )}
        </Typography>
      )}

      <Paper
        variant="outlined"
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          backgroundColor: backgroundColor,
          position: 'relative'
        }}
      >
        {loading ? (
          <CircularProgress size={size / 4} />
        ) : (
          <>
            {renderAs === 'canvas' ? (
              <canvas
                ref={canvasRef}
                width={size}
                height={size}
                style={{
                  maxWidth: '100%',
                  height: 'auto'
                }}
              />
            ) : (
              <img
                ref={canvasRef}
                alt="QR Code"
                style={{
                  maxWidth: '100%',
                  height: 'auto'
                }}
              />
            )}

            {(showDownload || showCopy) && (
              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  position: 'absolute',
                  bottom: 8,
                  right: 8,
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: 1,
                  p: 0.5
                }}
              >
                {showDownload && (
                  <Tooltip title="다운로드">
                    <IconButton
                      size="small"
                      onClick={handleDownload}
                      disabled={!value || loading}
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
                      disabled={!value || loading}
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
          </>
        )}
      </Paper>
    </Box>
  );
};

export default QRCode;