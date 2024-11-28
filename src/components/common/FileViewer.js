import React, { useState } from 'react';
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
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  RotateRight as RotateIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  NavigateBefore as PrevIcon,
  NavigateNext as NextIcon,
  Close as CloseIcon,
  OpenInNew as OpenIcon,
  Image as ImageIcon,
  PictureAsPdf as PdfIcon,
  VideoLibrary as VideoIcon,
  AudioFile as AudioIcon,
  Description as TextIcon
} from '@mui/icons-material';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// PDF.js 워커 설정
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const FileViewer = ({
  file,
  onClose,
  onDownload,
  onPrint,
  loading = false,
  showToolbar = true,
  showFileName = true,
  allowZoom = true,
  allowRotate = true,
  allowDownload = true,
  allowPrint = true,
  allowFullscreen = true,
  maxZoom = 3,
  minZoom = 0.5,
  sx = {}
}) => {
  const theme = useTheme();
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  // 파일 타입 확인
  const getFileType = () => {
    if (!file) return null;
    if (typeof file === 'string') {
      const extension = file.split('.').pop().toLowerCase();
      if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) return 'image';
      if (extension === 'pdf') return 'pdf';
      if (['mp4', 'webm', 'ogg'].includes(extension)) return 'video';
      if (['mp3', 'wav'].includes(extension)) return 'audio';
      if (['txt', 'csv', 'json'].includes(extension)) return 'text';
    }
    return null;
  };

  // 파일 아이콘 가져오기
  const getFileIcon = () => {
    const icons = {
      image: ImageIcon,
      pdf: PdfIcon,
      video: VideoIcon,
      audio: AudioIcon,
      text: TextIcon
    };
    const Icon = icons[getFileType()] || TextIcon;
    return <Icon />;
  };

  // 줌 처리
  const handleZoom = (delta) => {
    setZoom((prev) => {
      const newZoom = prev + delta;
      return Math.min(Math.max(newZoom, minZoom), maxZoom);
    });
  };

  // 회전 처리
  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // PDF 페이지 변경 처리
  const handlePageChange = (delta) => {
    setPageNumber((prev) => {
      const newPage = prev + delta;
      return Math.min(Math.max(newPage, 1), numPages || 1);
    });
  };

  // 툴바 렌더링
  const renderToolbar = () => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 1,
        borderBottom: `1px solid ${theme.palette.divider}`
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {getFileIcon()}
        {showFileName && (
          <Typography variant="subtitle2" noWrap>
            {typeof file === 'string' ? file.split('/').pop() : 'File'}
          </Typography>
        )}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {allowZoom && (
          <>
            <Tooltip title="축소">
              <IconButton
                onClick={() => handleZoom(-0.1)}
                disabled={zoom <= minZoom}
                size="small"
              >
                <ZoomOutIcon />
              </IconButton>
            </Tooltip>
            <Typography variant="body2">
              {Math.round(zoom * 100)}%
            </Typography>
            <Tooltip title="확대">
              <IconButton
                onClick={() => handleZoom(0.1)}
                disabled={zoom >= maxZoom}
                size="small"
              >
                <ZoomInIcon />
              </IconButton>
            </Tooltip>
          </>
        )}

        {allowRotate && (
          <Tooltip title="회전">
            <IconButton onClick={handleRotate} size="small">
              <RotateIcon />
            </IconButton>
          </Tooltip>
        )}

        {getFileType() === 'pdf' && (
          <>
            <Tooltip title="이전 페이지">
              <IconButton
                onClick={() => handlePageChange(-1)}
                disabled={pageNumber <= 1}
                size="small"
              >
                <PrevIcon />
              </IconButton>
            </Tooltip>
            <Typography variant="body2">
              {pageNumber} / {numPages || 1}
            </Typography>
            <Tooltip title="다음 페이지">
              <IconButton
                onClick={() => handlePageChange(1)}
                disabled={pageNumber >= (numPages || 1)}
                size="small"
              >
                <NextIcon />
              </IconButton>
            </Tooltip>
          </>
        )}

        {allowDownload && (
          <Tooltip title="다운로드">
            <IconButton
              onClick={onDownload}
              size="small"
            >
              <DownloadIcon />
            </IconButton>
          </Tooltip>
        )}

        {allowPrint && (
          <Tooltip title="인쇄">
            <IconButton
              onClick={onPrint}
              size="small"
            >
              <PrintIcon />
            </IconButton>
          </Tooltip>
        )}

        {allowFullscreen && (
          <Tooltip title="새 창에서 열기">
            <IconButton
              onClick={() => window.open(file, '_blank')}
              size="small"
            >
              <OpenIcon />
            </IconButton>
          </Tooltip>
        )}

        {onClose && (
          <Tooltip title="닫기">
            <IconButton
              onClick={onClose}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  );

  // 컨텐츠 렌더링
  const renderContent = () => {
    if (loading) {
      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%'
          }}
        >
          <CircularProgress />
        </Box>
      );
    }

    const fileType = getFileType();
    
    switch (fileType) {
      case 'image':
        return (
          <Box
            component="img"
            src={file}
            alt="preview"
            sx={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
              transition: 'transform 0.3s ease'
            }}
          />
        );

      case 'pdf':
        return (
          <Document
            file={file}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            loading={<CircularProgress />}
          >
            <Page
              pageNumber={pageNumber}
              scale={zoom}
              rotate={rotation}
              loading={<CircularProgress />}
            />
          </Document>
        );

      case 'video':
        return (
          <Box
            component="video"
            src={file}
            controls
            sx={{
              maxWidth: '100%',
              maxHeight: '100%'
            }}
          />
        );

      case 'audio':
        return (
          <Box
            component="audio"
            src={file}
            controls
            sx={{
              width: '100%'
            }}
          />
        );

      default:
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              p: 3
            }}
          >
            <Typography color="text.secondary">
              미리보기를 지원하지 않는 파일 형식입니다
            </Typography>
          </Box>
        );
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        border: `1px solid ${theme.palette.divider}`,
        ...sx
      }}
    >
      {showToolbar && renderToolbar()}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'auto',
          p: 2
        }}
      >
        {renderContent()}
      </Box>
    </Paper>
  );
};

export default FileViewer;