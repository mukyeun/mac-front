import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const MessageContainer = styled.div`
  margin-top: 0.5rem;
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  background-color: ${({ type, theme }) => {
    switch (type) {
      case 'error':
        return theme.palette?.error?.light || '#ffebee';
      case 'success':
        return theme.palette?.success?.light || '#e8f5e9';
      case 'warning':
        return theme.palette?.warning?.light || '#fff3e0';
      case 'info':
        return theme.palette?.info?.light || '#e3f2fd';
      default:
        return theme.palette?.grey?.[100] || '#f5f5f5';
    }
  }};
  color: ${({ type, theme }) => {
    switch (type) {
      case 'error':
        return theme.palette?.error?.main || '#d32f2f';
      case 'success':
        return theme.palette?.success?.main || '#2e7d32';
      case 'warning':
        return theme.palette?.warning?.main || '#ed6c02';
      case 'info':
        return theme.palette?.info?.main || '#0288d1';
      default:
        return theme.palette?.text?.primary || '#000000';
    }
  }};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Icon = styled.span`
  font-size: 1rem;
`;

const Message = styled.span`
  flex: 1;
`;

const getIcon = (type) => {
  switch (type) {
    case 'error':
      return '⚠️';
    case 'success':
      return '✅';
    case 'warning':
      return '⚠️';
    case 'info':
      return 'ℹ️';
    default:
      return null;
  }
};

const ValidationMessage = ({ type = 'error', message, className }) => {
  if (!message) return null;

  return (
    <MessageContainer type={type} className={className}>
      <Icon>{getIcon(type)}</Icon>
      <Message>{message}</Message>
    </MessageContainer>
  );
};

ValidationMessage.propTypes = {
  type: PropTypes.oneOf(['error', 'success', 'warning', 'info']),
  message: PropTypes.string.isRequired,
  className: PropTypes.string
};

export default ValidationMessage;
