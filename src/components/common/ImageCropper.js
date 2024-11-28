import React, { useState, useRef } from 'react';
import {
  Box,
  Paper,
  Button,
  Slider,
  IconButton,
  Typography,
  CircularProgress,
  useTheme
} from '@mui/material';
import {
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Rotate90DegreesCcw as RotateIcon,
  Crop as CropIcon,
  AspectRatio as AspectRatioIcon
} from '@mui/icons-material';
import Cropper from 'react-easy-crop';

const ImageCropper = ({
  image,
  onCrop,
  aspect = 1,
  cropShape = 'rect',
  minZoom = 1,
  maxZoom = 3,
  rotation = 0,
  minCropWidth = 100,
  minCropHeight = 100,
  maxCropWidth,
  maxCropHeight,
  loading = false,
  showGrid = true,
  showControls = true,
  controlPosition = 'bottom',
  sx = {}
}) => {
  const theme = useTheme();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [currentRotation, setCurrentRotation] = useState(rotation);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const cropperRef = useRef(null);

  // 줌 변경 처리
  const handleZoomChange = (event, newValue) => {
    setZoom(newValue);
  };

  // 회전 처리
  const handleRotate = () => {
    setCurrentRotation((prev) => (prev + 90) % 360);
  };

  // 크롭 영역 변경 완료 처리
  const handleCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  // 크롭 실행
  const handleCrop = async () => {
    if (!croppedAreaPixels || !onCrop) return;

    try {
      const croppedImage = await getCroppedImage(
        image,
        croppedAreaPixels,
        currentRotation
      );
      onCrop(croppedImage);
    } catch (error) {
      console.error('Error cropping image:', error);
    }
  };

  // 이미지 크롭 유틸리티 함수
  const getCroppedImage = async (imageSrc, pixelCrop, rotation = 0) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const maxSize = Math.max(image.width, image.height);
    const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

    canvas.width = safeArea;
    canvas.height = safeArea;

    ctx.translate(safeArea / 2, safeArea / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-safeArea / 2, -safeArea / 2);

    ctx.drawImage(
      image,
      safeArea / 2 - image.width * 0.5,
      safeArea / 2 - image.height * 0.5
    );

    const data = ctx.getImageData(0, 0, safeArea, safeArea);

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.putImageData(
      data,
      0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x,
      0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg');
    });
  };

  // 이미지 로드 유틸리티 함수
  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.src = url;
    });

  // 컨트롤 렌더링
  const renderControls = () => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        p: 2,
        borderTop: `1px solid ${theme.palette.divider}`
      }}
    >
      <IconButton
        onClick={() => setZoom((prev) => Math.max(minZoom, prev - 0.1))}
        disabled={zoom <= minZoom}
      >
        <ZoomOutIcon />
      </IconButton>

      <Slider
        value={zoom}
        min={minZoom}
        max={maxZoom}
        step={0.1}
        onChange={handleZoomChange}
        sx={{ flex: 1 }}
      />

      <IconButton
        onClick={() => setZoom((prev) => Math.min(maxZoom, prev + 0.1))}
        disabled={zoom >= maxZoom}
      >
        <ZoomInIcon />
      </IconButton>

      <IconButton onClick={handleRotate}>
        <RotateIcon />
      </IconButton>

      <Button
        variant="contained"
        startIcon={<CropIcon />}
        onClick={handleCrop}
        disabled={loading}
      >
        {loading ? (
          <CircularProgress size={24} />
        ) : (
          '자르기'
        )}
      </Button>
    </Box>
  );

  return (
    <Paper
      elevation={0}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        border: `1px solid ${theme.palette.divider}`,
        overflow: 'hidden',
        ...sx
      }}
    >
      <Box
        sx={{
          position: 'relative',
          height: 400,
          backgroundColor: theme.palette.background.default
        }}
      >
        <Cropper
          ref={cropperRef}
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          rotation={currentRotation}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={handleCropComplete}
          cropShape={cropShape}
          showGrid={showGrid}
          minCropWidth={minCropWidth}
          minCropHeight={minCropHeight}
          maxCropWidth={maxCropWidth}
          maxCropHeight={maxCropHeight}
          restrictPosition={false}
          style={{
            containerStyle: {
              backgroundColor: theme.palette.background.default
            }
          }}
        />
      </Box>

      {showControls && controlPosition === 'bottom' && renderControls()}
    </Paper>
  );
};

export default ImageCropper;