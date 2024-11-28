import React, { useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  IconButton,
  Typography,
  useTheme
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  Check as CheckIcon,
  Code as CodeIcon
} from '@mui/icons-material';
import Editor from '@monaco-editor/react';

const CodeEditor = ({
  value = '',
  onChange,
  language = 'javascript',
  theme: editorTheme,
  height = '400px',
  minHeight = '200px',
  maxHeight = '800px',
  readOnly = false,
  loading = false,
  showLineNumbers = true,
  wordWrap = 'on',
  minimap = true,
  fontSize = 14,
  tabSize = 2,
  title,
  error,
  sx = {}
}) => {
  const theme = useTheme();
  const editorRef = useRef(null);
  const [copied, setCopied] = React.useState(false);

  // 에디터 마운트 처리
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    // 테마 설정
    monaco.editor.defineTheme('customLight', {
      base: 'vs',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': theme.palette.background.paper,
        'editor.foreground': theme.palette.text.primary,
        'editor.lineHighlightBackground': theme.palette.action.hover,
        'editorLineNumber.foreground': theme.palette.text.secondary,
        'editorIndentGuide.background': theme.palette.divider,
        'editorIndentGuide.activeBackground': theme.palette.primary.main
      }
    });

    monaco.editor.defineTheme('customDark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': theme.palette.background.paper,
        'editor.foreground': theme.palette.text.primary,
        'editor.lineHighlightBackground': theme.palette.action.hover,
        'editorLineNumber.foreground': theme.palette.text.secondary,
        'editorIndentGuide.background': theme.palette.divider,
        'editorIndentGuide.activeBackground': theme.palette.primary.main
      }
    });

    // 에디터 옵션 설정
    editor.updateOptions({
      fontSize,
      tabSize,
      minimap: {
        enabled: minimap
      },
      lineNumbers: showLineNumbers ? 'on' : 'off',
      wordWrap,
      readOnly,
      scrollBeyondLastLine: false,
      automaticLayout: true
    });
  };

  // 코드 복사 처리
  const handleCopy = async () => {
    if (editorRef.current) {
      const code = editorRef.current.getValue();
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // 에디터 변경 처리
  const handleChange = (value) => {
    if (onChange) {
      onChange(value);
    }
  };

  // 테마 변경 시 에디터 테마 업데이트
  useEffect(() => {
    if (editorRef.current) {
      const customTheme = theme.palette.mode === 'dark' ? 'customDark' : 'customLight';
      editorRef.current.updateOptions({
        theme: editorTheme || customTheme
      });
    }
  }, [theme.palette.mode, editorTheme]);

  return (
    <Paper
      elevation={0}
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        ...sx
      }}
    >
      {(title || error) && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 1,
            borderBottom: `1px solid ${theme.palette.divider}`,
            backgroundColor: error
              ? alpha(theme.palette.error.main, 0.1)
              : 'transparent'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CodeIcon
              sx={{
                color: error
                  ? theme.palette.error.main
                  : theme.palette.text.secondary
              }}
            />
            <Typography
              variant="subtitle2"
              sx={{
                color: error
                  ? theme.palette.error.main
                  : theme.palette.text.primary
              }}
            >
              {error || title}
            </Typography>
          </Box>
          <IconButton
            onClick={handleCopy}
            size="small"
            sx={{
              color: copied
                ? theme.palette.success.main
                : theme.palette.action.active
            }}
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
          </IconButton>
        </Box>
      )}

      <Box
        sx={{
          height,
          minHeight,
          maxHeight,
          '.monaco-editor': {
            paddingTop: 1,
            paddingBottom: 1
          },
          '.monaco-editor .margin': {
            backgroundColor: 'transparent'
          }
        }}
      >
        <Editor
          value={value}
          language={language}
          theme={editorTheme || (theme.palette.mode === 'dark' ? 'customDark' : 'customLight')}
          loading={loading}
          onMount={handleEditorDidMount}
          onChange={handleChange}
          options={{
            fontSize,
            tabSize,
            minimap: {
              enabled: minimap
            },
            lineNumbers: showLineNumbers ? 'on' : 'off',
            wordWrap,
            readOnly,
            scrollBeyondLastLine: false,
            automaticLayout: true
          }}
        />
      </Box>
    </Paper>
  );
};

// 지원하는 언어 목록
CodeEditor.languages = [
  'javascript',
  'typescript',
  'html',
  'css',
  'json',
  'xml',
  'markdown',
  'python',
  'java',
  'c',
  'cpp',
  'csharp',
  'php',
  'ruby',
  'go',
  'rust',
  'sql',
  'yaml',
  'shell',
  'plaintext'
];

export default CodeEditor;