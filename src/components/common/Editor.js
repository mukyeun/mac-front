import React, { useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Skeleton,
  useTheme
} from '@mui/material';
import { Editor as TinyMCEEditor } from '@tinymce/tinymce-react';

const Editor = ({
  value = '',
  onChange,
  height = 500,
  minHeight = 300,
  maxHeight = 800,
  placeholder = '내용을 입력하세요',
  disabled = false,
  readOnly = false,
  loading = false,
  toolbarMode = 'sliding',
  plugins = [
    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
    'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
  ],
  toolbar = [
    'undo redo | formatselect | bold italic backcolor | \
    alignleft aligncenter alignright alignjustify | \
    bullist numlist outdent indent | removeformat | help'
  ],
  menubar = true,
  statusbar = true,
  autoresize = true,
  uploadImage,
  sx = {}
}) => {
  const theme = useTheme();
  const editorRef = useRef(null);

  // 이미지 업로드 핸들러
  const handleImageUpload = async (blobInfo) => {
    if (!uploadImage) {
      return Promise.reject('이미지 업로드 핸들러가 설정되지 않았습니다.');
    }

    try {
      const url = await uploadImage(blobInfo.blob());
      return url;
    } catch (error) {
      return Promise.reject(error.message || '이미지 업로드에 실패했습니다.');
    }
  };

  // 에디터 초기화 설정
  const init = {
    height,
    min_height: minHeight,
    max_height: maxHeight,
    menubar,
    plugins,
    toolbar,
    toolbar_mode: toolbarMode,
    statusbar,
    placeholder,
    readonly: readOnly,
    language: 'ko_KR',
    language_url: '/tinymce/langs/ko_KR.js',
    content_style: `
      body {
        font-family: ${theme.typography.fontFamily};
        font-size: ${theme.typography.body1.fontSize};
        color: ${theme.palette.text.primary};
      }
      p { margin: 0; padding: 0; }
    `,
    skin: theme.palette.mode === 'dark' ? 'oxide-dark' : 'oxide',
    content_css: theme.palette.mode === 'dark' ? 'dark' : 'default',
    paste_data_images: true,
    automatic_uploads: true,
    file_picker_types: 'image',
    images_upload_handler: handleImageUpload,
    setup: (editor) => {
      // 자동 크기 조절
      if (autoresize) {
        editor.on('init', () => {
          editor.getBody().style.resize = 'vertical';
          editor.getBody().style.overflow = 'hidden';
        });
      }

      // 변경 이벤트
      editor.on('change', () => {
        if (onChange) {
          onChange(editor.getContent());
        }
      });
    }
  };

  // 테마 변경 시 에디터 리로드
  useEffect(() => {
    if (editorRef.current) {
      const editor = editorRef.current.editor;
      if (editor) {
        editor.setContent(editor.getContent());
      }
    }
  }, [theme.palette.mode]);

  if (loading) {
    return (
      <Box sx={sx}>
        <Skeleton variant="rectangular" height={height} />
      </Box>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        ...sx
      }}
    >
      <TinyMCEEditor
        ref={editorRef}
        value={value}
        disabled={disabled}
        init={init}
        onInit={(evt, editor) => {
          editorRef.current = editor;
        }}
      />
    </Paper>
  );
};

// 툴바 프리셋
Editor.toolbarPresets = {
  basic: [
    'undo redo | formatselect | bold italic | \
    alignleft aligncenter alignright | \
    bullist numlist | removeformat'
  ],
  standard: [
    'undo redo | formatselect | bold italic backcolor | \
    alignleft aligncenter alignright alignjustify | \
    bullist numlist outdent indent | removeformat | help'
  ],
  full: [
    'undo redo | formatselect | bold italic backcolor | \
    alignleft aligncenter alignright alignjustify | \
    bullist numlist outdent indent | link image media table | \
    removeformat code fullscreen help'
  ]
};

// 플러그인 프리셋
Editor.pluginPresets = {
  basic: [
    'advlist', 'autolink', 'lists', 'link', 'charmap',
    'searchreplace', 'visualblocks', 'code', 'help', 'wordcount'
  ],
  standard: [
    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
    'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
  ],
  full: [
    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
    'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount',
    'emoticons', 'template', 'paste', 'print', 'hr', 'pagebreak',
    'nonbreaking', 'contextmenu', 'directionality', 'textpattern'
  ]
};

export default Editor;