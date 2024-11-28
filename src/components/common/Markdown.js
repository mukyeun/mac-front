import React from 'react';
import {
  Box,
  Link,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  useTheme
} from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypePrism from 'rehype-prism-plus';
import 'katex/dist/katex.min.css';
import 'prismjs/themes/prism-tomorrow.css';

const Markdown = ({
  children,
  allowMath = false,
  allowTables = true,
  allowSyntaxHighlight = true,
  linkTarget = '_blank',
  maxWidth = 800,
  sx = {}
}) => {
  const theme = useTheme();

  // 마크다운 컴포넌트 매핑
  const components = {
    // 헤딩
    h1: ({ node, ...props }) => (
      <Typography variant="h1" gutterBottom {...props} />
    ),
    h2: ({ node, ...props }) => (
      <Typography variant="h2" gutterBottom {...props} />
    ),
    h3: ({ node, ...props }) => (
      <Typography variant="h3" gutterBottom {...props} />
    ),
    h4: ({ node, ...props }) => (
      <Typography variant="h4" gutterBottom {...props} />
    ),
    h5: ({ node, ...props }) => (
      <Typography variant="h5" gutterBottom {...props} />
    ),
    h6: ({ node, ...props }) => (
      <Typography variant="h6" gutterBottom {...props} />
    ),
       // 단락
       p: ({ node, ...props }) => (
        <Typography paragraph {...props} />
      ),
  
      // 강조
      strong: ({ node, ...props }) => (
        <Typography component="strong" fontWeight="bold" {...props} />
      ),
      em: ({ node, ...props }) => (
        <Typography component="em" fontStyle="italic" {...props} />
      ),
  
      // 링크
      a: ({ node, href, ...props }) => (
        <Link
          href={href}
          target={linkTarget}
          rel={linkTarget === '_blank' ? 'noopener noreferrer' : undefined}
          {...props}
        />
      ),
  
      // 이미지
      img: ({ node, src, alt, ...props }) => (
        <Box
          component="img"
          src={src}
          alt={alt}
          sx={{
            maxWidth: '100%',
            height: 'auto',
            my: 2,
            borderRadius: 1
          }}
          {...props}
        />
      ),
  
      // 코드 블록
      code: ({ node, inline, className, children, ...props }) => {
        const match = /language-(\w+)/.exec(className || '');
        const language = match ? match[1] : '';
  
        if (inline) {
          return (
            <Typography
              component="code"
              sx={{
                backgroundColor: theme.palette.action.hover,
                padding: '2px 4px',
                borderRadius: 1,
                fontFamily: 'monospace'
              }}
              {...props}
            >
              {children}
            </Typography>
          );
        }
  
        return (
          <Box
            sx={{
              position: 'relative',
              my: 2,
              '& pre': {
                margin: 0,
                padding: 2,
                backgroundColor: theme.palette.mode === 'dark' 
                  ? '#1e1e1e' 
                  : '#f5f5f5',
                borderRadius: 1,
                overflow: 'auto'
              },
              '& code': {
                fontFamily: 'monospace',
                fontSize: '0.875rem'
              }
            }}
          >
            {language && (
              <Typography
                variant="caption"
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  color: theme.palette.text.secondary
                }}
              >
                {language}
              </Typography>
            )}
            <pre className={className} {...props}>
              <code className={className} {...props}>
                {children}
              </code>
            </pre>
          </Box>
        );
      },
  
      // 테이블
      table: ({ node, ...props }) => (
        <Paper
          variant="outlined"
          sx={{
            width: '100%',
            overflowX: 'auto',
            my: 2
          }}
        >
          <Table size="small" {...props} />
        </Paper>
      ),
      thead: ({ node, ...props }) => (
        <TableHead {...props} />
      ),
      tbody: ({ node, ...props }) => (
        <TableBody {...props} />
      ),
      tr: ({ node, ...props }) => (
        <TableRow {...props} />
      ),
      td: ({ node, ...props }) => (
        <TableCell {...props} />
      ),
      th: ({ node, ...props }) => (
        <TableCell component="th" {...props} />
      ),
  
      // 리스트
      ul: ({ node, ...props }) => (
        <Box
          component="ul"
          sx={{
            pl: 2,
            my: 1
          }}
          {...props}
        />
      ),
      ol: ({ node, ...props }) => (
        <Box
          component="ol"
          sx={{
            pl: 2,
            my: 1
          }}
          {...props}
        />
      ),
      li: ({ node, ...props }) => (
        <Box
          component="li"
          sx={{
            my: 0.5
          }}
          {...props}
        />
      ),
  
      // 인용구
      blockquote: ({ node, ...props }) => (
        <Box
          sx={{
            borderLeft: `4px solid ${theme.palette.divider}`,
            pl: 2,
            py: 1,
            my: 2,
            color: theme.palette.text.secondary
          }}
          {...props}
        />
      ),
  
      // 구분선
      hr: ({ node, ...props }) => (
        <Box
          component="hr"
          sx={{
            my: 2,
            border: 'none',
            height: 1,
            backgroundColor: theme.palette.divider
          }}
          {...props}
        />
      )
    };
  
    // 플러그인 설정
    const remarkPlugins = [
      ...(allowTables ? [remarkGfm] : []),
      ...(allowMath ? [remarkMath] : [])
    ];
  
    const rehypePlugins = [
      ...(allowMath ? [rehypeKatex] : []),
      ...(allowSyntaxHighlight ? [rehypePrism] : [])
    ];
  
    return (
      <Box
        sx={{
          maxWidth,
          mx: 'auto',
          ...sx
        }}
      >
        <ReactMarkdown
          components={components}
          remarkPlugins={remarkPlugins}
          rehypePlugins={rehypePlugins}
        >
          {children}
        </ReactMarkdown>
      </Box>
    );
  };
  
  export default Markdown; 