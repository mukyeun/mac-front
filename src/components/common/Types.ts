import { ReactNode } from 'react';
import { SxProps, Theme } from '@mui/material';

// SearchInput Props
export interface SearchInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  onClear?: () => void;
  loading?: boolean;
  suggestions?: string[];
  history?: string[];
  trending?: string[];
  placeholder?: string;
  maxHistory?: number;
  showHistory?: boolean;
  showTrending?: boolean;
  showClear?: boolean;
  clearOnSearch?: boolean;
  autoFocus?: boolean;
  fullWidth?: boolean;
  size?: 'small' | 'medium';
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  sx?: SxProps<Theme>;
}

// FileUploader Props
export interface FileUploaderProps {
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number;
  onUpload?: (files: File | File[]) => Promise<void>;
  onRemove?: (file: File) => void;
  value?: File[];
  disabled?: boolean;
  preview?: boolean;
  dropzoneText?: string;
  error?: boolean;
  helperText?: string;
  sx?: SxProps<Theme>;
}

// VirtualList Props
export interface VirtualListProps {
  items?: any[];
  renderItem?: (item: any, index: number) => ReactNode;
  height?: number | string;
  width?: number | string;
  itemSize?: number;
  overscanCount?: number;
  threshold?: number;
  hasMore?: boolean;
  loading?: boolean;
  onLoadMore?: () => Promise<void>;
  emptyMessage?: string;
  loadingMessage?: string;
  variableSize?: boolean;
  estimatedItemSize?: number;
  getItemSize?: (index: number) => number;
  headerHeight?: number;
  header?: ReactNode;
  scrollToItem?: number;
  onScroll?: (params: { scrollOffset: number; scrollDirection: string }) => void;
  sx?: SxProps<Theme>;
}

// Markdown Props
export interface MarkdownProps {
  children: string;
  allowHtml?: boolean;
  allowMath?: boolean;
  allowTables?: boolean;
  allowSyntaxHighlight?: boolean;
  linkTarget?: string;
  maxWidth?: number | string;
  sx?: SxProps<Theme>;
}

// QRCode Props
export interface QRCodeProps {
  value?: string;
  size?: number;
  level?: 'L' | 'M' | 'Q' | 'H';
  includeMargin?: boolean;
  color?: string;
  backgroundColor?: string;
  imageSettings?: {
    src: string;
    width: number;
    height: number;
    x?: number;
    y?: number;
  };
  renderAs?: 'canvas' | 'svg';
  onError?: (error: Error) => void;
  loading?: boolean;
  title?: string;
  showDownload?: boolean;
  showCopy?: boolean;
  downloadFileName?: string;
  downloadFormat?: 'png' | 'jpeg' | 'webp';
  sx?: SxProps<Theme>;
}

// OTPInput Props
export interface OTPInputProps {
  value?: string;
  onChange?: (value: string) => void;
  length?: number;
  type?: 'text' | 'number';
  autoFocus?: boolean;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  label?: string;
  placeholder?: string;
  showMask?: boolean;
  allowPaste?: boolean;
  size?: 'small' | 'medium';
  spacing?: number;
  inputProps?: object;
  sx?: SxProps<Theme>;
}

// Rating Props
export interface RatingProps {
  value?: number;
  onChange?: (value: number) => void;
  max?: number;
  precision?: 0.5 | 1;
  size?: 'small' | 'medium' | 'large';
  showClear?: boolean;
  showValue?: boolean;
  valuePosition?: 'left' | 'right';
  emptyIcon?: ReactNode;
  filledIcon?: ReactNode;
  halfFilledIcon?: ReactNode;
  disabled?: boolean;
  readOnly?: boolean;
  label?: string;
  helperText?: string;
  error?: boolean;
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  highlightSelectedOnly?: boolean;
  tooltips?: string[];
  sx?: SxProps<Theme>;
}

// Signature Props
export interface SignatureProps {
  value?: string;
  onChange?: (value: string) => void;
  width?: number;
  height?: number;
  lineWidth?: number;
  lineColor?: string;
  backgroundColor?: string;
  disabled?: boolean;
  readOnly?: boolean;
  error?: boolean;
  label?: string;
  helperText?: string;
  showControls?: boolean;
  showUndo?: boolean;
  showClear?: boolean;
  showDownload?: boolean;
  showCopy?: boolean;
  downloadFormat?: 'png' | 'jpeg' | 'webp';
  downloadFileName?: string;
  sx?: SxProps<Theme>;
}

// CodeEditor Props
export interface CodeEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  language?: string;
  theme?: 'light' | 'dark';
  height?: number | string;
  width?: number | string;
  readOnly?: boolean;
  minimap?: boolean;
  lineNumbers?: boolean;
  wordWrap?: boolean;
  fontSize?: number;
  tabSize?: number;
  autoFocus?: boolean;
  formatOnPaste?: boolean;
  formatOnType?: boolean;
  suggestions?: boolean;
  error?: boolean;
  helperText?: string;
  sx?: SxProps<Theme>;
}