import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

const RegisterContainer = styled.div`
  max-width: 400px;
  margin: 100px auto;
  padding: 2rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const Button = styled.button`
  padding: 0.8rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2563eb;
  }

  &:disabled {
    background-color: #93c5fd;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const LoginLink = styled(Link)`
  display: block;
  text-align: center;
  margin-top: 1rem;
  color: #3b82f6;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const RegisterForm = () => {
  const { register, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: ''
  });
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!formData.name) errors.name = '이름을 입력해주세요';
    if (!formData.email) errors.email = '이메일을 입력해주세요';
    if (!formData.password) errors.password = '비밀번호를 입력해주세요';
    if (formData.password !== formData.passwordConfirm) {
      errors.passwordConfirm = '비밀번호가 일치하지 않습니다';
    }
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    
    if (Object.keys(errors).length === 0) {
      try {
        await register({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
      } catch (err) {
        console.error('Registration failed:', err);
      }
    } else {
      setFormErrors(errors);
    }
  };

  return (
    <RegisterContainer>
      <Title>회원가입</Title>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          name="name"
          placeholder="이름"
          value={formData.name}
          onChange={handleChange}
          required
        />
        {formErrors.name && <ErrorMessage>{formErrors.name}</ErrorMessage>}
        
        <Input
          type="email"
          name="email"
          placeholder="이메일"
          value={formData.email}
          onChange={handleChange}
          required
        />
        {formErrors.email && <ErrorMessage>{formErrors.email}</ErrorMessage>}
        
        <Input
          type="password"
          name="password"
          placeholder="비밀번호"
          value={formData.password}
          onChange={handleChange}
          required
        />
        {formErrors.password && <ErrorMessage>{formErrors.password}</ErrorMessage>}
        
        <Input
          type="password"
          name="passwordConfirm"
          placeholder="비밀번호 확인"
          value={formData.passwordConfirm}
          onChange={handleChange}
          required
        />
        {formErrors.passwordConfirm && <ErrorMessage>{formErrors.passwordConfirm}</ErrorMessage>}
        
        <Button type="submit" disabled={loading}>
          {loading ? '가입 중...' : '회원가입'}
        </Button>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </Form>
      <LoginLink to="/login">이미 계정이 있으신가요? 로그인하기</LoginLink>
    </RegisterContainer>
  );
};

export default RegisterForm;