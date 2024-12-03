import React, { useEffect, useState, useRef } from 'react';
import styled, { css } from 'styled-components';
import { 약물카테고리 } from '../../data/MedicineCategories.js';
import { getHealthInfoList } from '../../api/healthInfo.js';
import { 
  formatPhoneNumber, 
  formatResidentNumber, 
} from '../../utils/formatters.js';
import ValidationMessage from '../common/ValidationMessage.js';
import { 
  stressLevels, 
  workIntensities, 
  favoriteItems, 
  personalityTypes, 
  genderTypes, 
  getBmiStatusInfo, 
  vitalSigns, 
  getVitalSignStatus, 
  initialFormData, 
  validationRules 
} from '../../constants/healthInfo';
import SymptomSelector from '../symptoms/SymptomSelector';

// 스타일 컴포넌트들
const FormContainer = styled.div`
  max-width: 800px;
  margin: 1rem auto;
  padding: 0 1rem;
`;

const FormSection = styled.div`
  background: #ffffff;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.75rem 0;
  padding: 0.5rem 0.75rem;
  background-color: ${props => {
    switch(props.type) {
      case '기본정보': return '#4361ee';
      case '증상선택': return '#7209b7';
      case '맥파분석': return '#f72585';
      case '복용약물': return '#4cc9f0';
      case '메모': return '#4895ef';
      default: return '#4361ee';
    }
  }};
  color: white;
  border-radius: 4px;
`;
const FormGroup = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr;
  align-items: start;
  margin-bottom: 1rem;
  gap: 0.5rem;
  padding: 0 0.5rem;

  &.memo-group {
    display: block;
  }

  .input-container {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.4rem 0.6rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: #4361ee;
    box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.1);
  }
`;

const ModernSelect = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  color: #1a202c;
  transition: all 0.2s ease;
  background: #f8fafc;
  cursor: pointer;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  &:focus {
    outline: none;
    border-color: #4361ee;
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
    background: white;
  }

  option {
    font-weight: 500;
    color: #1a202c;
  }

  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23000000' d='M6 8L2 4h8z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  padding-right: 2.5rem;
`;

const BodyInfoContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  padding: 0.5rem;
`;

const BodyInfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-size: 0.9rem;
    color: #4a5568;
    font-weight: 500;
  }

  .bmi-container {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
  }
`;
const TextArea = styled.textarea`
  width: calc(100% - 1rem);
  min-height: 100px;
  padding: 0.6rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 0.9rem;
  resize: vertical;
  margin: 0 0.5rem;
  
  &:focus {
    outline: none;
    border-color: #4361ee;
    box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.1);
  }
`;

const SymptomTag = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 0.3rem 0.6rem;
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 0.85rem;
  margin: 0.25rem;
  
  button {
    background: none;
    border: none;
    margin-left: 0.3rem;
    color: #a0aec0;
    cursor: pointer;
    padding: 0 0.2rem;
    
    &:hover {
      color: #e53e3e;
    }
  }
`;

const VitalSignsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const VitalSignBox = styled.div`
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
`;

const VitalSignValue = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const UnitText = styled.span`
  color: #6c757d;
  font-size: 0.9rem;
`;

const RequiredLabel = styled.span`
  color: #e74c3c;
  margin-left: 4px;
`;

const ValidationText = styled.div`
  color: ${props => props.isError ? '#e74c3c' : '#2ecc71'};
  font-size: 0.85rem;
  margin-top: 0.5rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 3rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => props.variant === 'primary' && css`
    background-color: #4A90E2;
    color: white;
    
    &:hover {
      background-color: #357ABD;
      transform: translateY(-1px);
    }
    
    &:disabled {
      background-color: #93C5FD;
      cursor: not-allowed;
      transform: none;
    }
  `}
  
  ${props => props.variant === 'secondary' && css`
    background-color: #EDF2F7;
    color: #4A5568;
    
    &:hover {
      background-color: #E2E8F0;
      transform: translateY(-1px);
    }
  `}
`;

const SelectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const SelectedMedicineList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  min-height: 40px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-left: 136px;
  background: white;
`;

const MedicineTag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  background-color: #f1f3f5;
  border-radius: 4px;
  font-size: 13px;
  color: #495057;

  button {
    border: none;
    background: none;
    margin-left: 6px;
    padding: 0;
    font-size: 16px;
    cursor: pointer;
    color: #adb5bd;
    
    &:hover {
      color: #495057;
    }
  }
`;

const BMIDisplay = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 4px;
  background-color: #f8f9fa;
  display: flex;
  align-items: center;
  gap: 1rem;
`;
const BMIStatus = styled.span`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  color: white;
  font-weight: bold;
  margin-left: 8px;
  background-color: ${props => {
    const status = getBmiStatusInfo(props.bmi);
    return status ? status.color : '#868e96';
  }};
`;

const Divider = styled.div`
  height: 1px;
  background-color: #e2e8f0;
  margin: 1rem 0.5rem;
`;

const CategorySelectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  padding: 0 0.5rem;
`;

const CategoryFormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const SelectedSymptomsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.5rem;
  min-height: 2.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  margin: 0 0.5rem;
  
  &:empty::before {
    content: '선택된 증상이 없습니다';
    color: #a0aec0;
    font-size: 0.9rem;
  }
`;

const EmptyMessage = styled.div`
  color: #a0aec0;
  font-size: 0.9rem;
  padding: 0.5rem;
  text-align: center;
`;

const StatusText = styled.div`
  margin-top: 0.5rem;
  font-weight: bold;
  color: ${props => {
    switch (props.status) {
      case 'normal': return '#51cf66';
      case 'warning': return '#ffd43b';
      case 'danger': return '#ff6b6b';
      default: return '#868e96';
    }
  }};
`;
const HealthInfoForm = ({ onSubmit, initialData = null, id = null }) => {
  const formRef = useRef(null);
  const nameInputRef = useRef(null);

  // formData 초기화에 initialFormData 사용
  const [formData, setFormData] = useState(initialData || initialFormData);
  const [validationErrors, setValidationErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState({
    대분류: '',
    중분류: '',
    소분류: ''
  });

  // 데이터 로딩
  useEffect(() => {
    const loadHealthInfo = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        setLoadError(null);
        const data = await getHealthInfoList(id);
        if (data) {
          setFormData(data);
          if (data.증상선택?.카테고리) {
            setSelectedCategory(data.증상선택.카테고리);
          }
        }
      } catch (error) {
        console.error('Error loading health info:', error);
        setLoadError('데이터 로딩 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadHealthInfo();
  }, [id]);

  // 유효성 검사 함수
  const validateForm = () => {
    const errors = {};
    
    Object.entries(validationRules.기본정보).forEach(([field, rules]) => {
      const value = formData.기본정보[field];
      
      if (rules.required && !value) {
        errors[field] = rules.message;
      } else if (rules.pattern && !rules.pattern.test(value)) {
        errors[field] = rules.message;
      } else if (rules.min && (Number(value) < rules.min)) {
        errors[field] = rules.message;
      } else if (rules.max && (Number(value) > rules.max)) {
        errors[field] = rules.message;
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
    // 폼 초기화 함수
    const handleReset = () => {
      setFormData(initialFormData);
      setValidationErrors({});
      if (formRef.current) {
        formRef.current.reset();
      }
    };
  
    // 폼 제출 함수
    const handleSubmit = async () => {
      if (!validateForm()) {
        alert('필수 항목을 모두 입력해주세요.');
        return;
      }
  
      try {
        await onSubmit(formData);
        handleReset();
      } catch (error) {
        console.error('Form submission error:', error);
        alert('저장 중 오류가 발생했습니다.');
      }
    };
  
    // 통합된 입력 처리 함수
    const handleInputChange = (e, section, field) => {
      const { value } = e.target;
      
      if (section === '메모') {
        setFormData(prev => ({
          ...prev,
          메모: value
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [section]: {
            ...prev[section],
            [field]: value
          }
        }));
      }
  
      // 유효성 검사 오류 제거
      if (validationErrors[field]) {
        setValidationErrors(prev => ({
          ...prev,
          [field]: null
        }));
      }
    };
  
    // 연락처 입력 처리
    const handlePhoneChange = (e) => {
      const formattedNumber = formatPhoneNumber(e.target.value);
      setFormData(prev => ({
        ...prev,
        기본정보: {
          ...prev.기본정보,
          연락처: formattedNumber
        }
      }));
    };
  
    // 주민등록번호 입력 처리
    const handleResidentNumberChange = (e) => {
      const formattedNumber = formatResidentNumber(e.target.value);
      
      let gender = '';
      if (formattedNumber.length >= 8) {
        const genderDigit = formattedNumber.replace('-', '').charAt(6);
        if (['1', '3', '5'].includes(genderDigit)) {
          gender = '남성';
        } else if (['2', '4', '6'].includes(genderDigit)) {
          gender = '여성';
        }
      }
      
      setFormData(prev => ({
        ...prev,
        기본정보: {
          ...prev.기본정보,
          주민등록번호: formattedNumber,
          성별: gender || prev.기본정보?.성별
        }
      }));
    };
      // BMI 계산 핸들러
  const handleBodyInfoChange = (e, field) => {
    const value = e.target.value;
    setFormData(prev => {
      const newFormData = {
        ...prev,
        기본정보: {
          ...prev.기본정보,
          [field]: value
        }
      };

      if (newFormData.기본정보.신장 && newFormData.기본정보.체중) {
        const height = parseFloat(newFormData.기본정보.신장) / 100;
        const weight = parseFloat(newFormData.기본정보.체중);
        const bmi = (weight / (height * height)).toFixed(1);
        newFormData.기본정보.BMI = bmi;
      }

      return newFormData;
    });
  };

  // 약물 관련 핸들러
  const handleAddMedicine = (selectedMedicine) => {
    if (!selectedMedicine) return;
    
    setFormData(prev => ({
      ...prev,
      복용약물: {
        ...prev.복용약물,
        약물: Array.isArray(prev.복용약물?.약물) 
          ? prev.복용약물.약물.indexOf(selectedMedicine) === -1
            ? [...prev.복용약물.약물, selectedMedicine]
            : prev.복용약물.약물
          : [selectedMedicine]
      }
    }));
  };

  const handleRemoveMedicine = (medicineToRemove) => {
    setFormData(prev => ({
      ...prev,
      복용약물: {
        ...prev.복용약물,
        약물: Array.isArray(prev.복용약물?.약물) 
          ? prev.복용약물.약물.filter(medicine => medicine !== medicineToRemove)
          : []
      }
    }));
  };

  // 기호식품 관련 핸들러
  const handleAddFavoriteItem = (selectedItem) => {
    if (!selectedItem) return;
    
    setFormData(prev => ({
      ...prev,
      복용약물: {
        ...prev.복용약물,
        기호식품: prev.복용약물?.기호식품?.includes(selectedItem)
          ? prev.복용약물.기호식품
          : [...(prev.복용약물?.기호식품 || []), selectedItem]
      }
    }));
  };

  const handleRemoveFavoriteItem = (itemToRemove) => {
    setFormData(prev => ({
      ...prev,
      복용약물: {
        ...prev.복용약물,
        기호식품: prev.복용약물?.기호식품?.filter(item => item !== itemToRemove) || []
      }
    }));
  };
    // 키보드 이벤트 핸들러
    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const inputs = formRef.current.querySelectorAll(
          'input:not([type="hidden"]), select, textarea'
        );
        const index = Array.from(inputs).indexOf(e.target);
        if (index < inputs.length - 1) {
          inputs[index + 1].focus();
        }
      }
    };
  
    const renderContent = () => {
      if (isLoading) {
        return <div>데이터를 불러오는 중...</div>;
      }
  
      if (loadError) {
        return <div>Error: {loadError}</div>;
      }
  
      if (!formData || !formData.기본정보) {
        return <div>Loading...</div>;
      }
  
      return (
        <FormContainer ref={formRef}>
          {/* 기본정보 섹션 */}
          <FormSection>
            <SectionTitle type="기본정보">기본 정보</SectionTitle>
            
            <FormGroup>
              <label>이름<RequiredLabel>*</RequiredLabel></label>
              <div className="input-container">
                <Input
                  ref={nameInputRef}
                  type="text"
                  name="이름"
                  value={formData.기본정보?.이름 || ''}
                  onChange={(e) => handleInputChange(e, '기본정보', '이름')}
                  onKeyPress={handleKeyPress}
                  placeholder="이름을 입력하세요"
                />
                {validationErrors.이름 && (
                  <ValidationMessage type="error" message={validationErrors.이름} />
                )}
              </div>
            </FormGroup>
  
            <FormGroup>
              <label>연락처<RequiredLabel>*</RequiredLabel></label>
              <div className="input-container">
                <Input
                  type="tel"
                  name="연락처"
                  value={formData.기본정보?.연락처 || ''}
                  onChange={handlePhoneChange}
                  onKeyPress={handleKeyPress}
                  placeholder="연락처를 입력하세요"
                  maxLength={13}
                />
                {validationErrors.연락처 && (
                  <ValidationMessage type="error" message={validationErrors.연락처} />
                )}
              </div>
            </FormGroup>
            <FormGroup>
            <label>주민등록번호<RequiredLabel>*</RequiredLabel></label>
            <div className="input-container">
              <Input
                type="text"
                name="주민등록번호"
                value={formData.기본정보?.주민등록번호 || ''}
                onChange={handleResidentNumberChange}
                onKeyPress={handleKeyPress}
                placeholder="주민등록번호를 입력하세요"
                maxLength={14}
              />
              {validationErrors.주민등록번호 && (
                <ValidationMessage type="error" message={validationErrors.주민등록번호} />
              )}
            </div>
          </FormGroup>

          <FormGroup>
            <label>성별<RequiredLabel>*</RequiredLabel></label>
            <div className="input-container">
              <ModernSelect
                value={formData.기본정보?.성별 || ''}
                onChange={(e) => handleInputChange(e, '기본정보', '성별')}
              >
                <option value="">선택하세요</option>
                {genderTypes.map(gender => (
                  <option key={gender.value} value={gender.value}>
                    {gender.label}
                  </option>
                ))}
              </ModernSelect>
              {validationErrors.성별 && (
                <ValidationMessage type="error" message={validationErrors.성별} />
              )}
            </div>
          </FormGroup>

          <FormGroup>
            <label>성격</label>
            <ModernSelect
              value={formData.기본정보?.성격 || ''}
              onChange={(e) => handleInputChange(e, '기본정보', '성격')}
            >
              <option value="">선택하세요</option>
              {personalityTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </ModernSelect>
          </FormGroup>

          <BodyInfoContainer>
            <BodyInfoItem>
              <label>신장</label>
              <Input
                type="number"
                value={formData.기본정보?.신장 || ''}
                onChange={(e) => handleBodyInfoChange(e, '신장')}
                placeholder="cm"
              />
            </BodyInfoItem>
            
            <BodyInfoItem>
              <label>체중</label>
              <Input
                type="number"
                value={formData.기본정보?.체중 || ''}
                onChange={(e) => handleBodyInfoChange(e, '체중')}
                placeholder="kg"
              />
            </BodyInfoItem>
            <BodyInfoItem>
              <label>BMI 지수</label>
              <div className="bmi-container">
                <Input
                  type="text"
                  value={
                    formData.기본정보?.신장 && formData.기본정보?.체중
                      ? (formData.기본정보.체중 / Math.pow(formData.기본정보.신장 / 100, 2)).toFixed(1)
                      : ''
                  }
                  readOnly
                  placeholder="BMI"
                  style={{ width: '80px' }}
                />
                {formData.기본정보?.신장 && formData.기본정보?.체중 && (
                  <BMIDisplay>
                    <span>BMI: {formData.기본정보.BMI}</span>
                    {(() => {
                      const bmiStatus = getBmiStatusInfo(formData.기본정보.BMI);
                      if (bmiStatus) {
                        return (
                          <BMIStatus status={bmiStatus.value} style={{ backgroundColor: bmiStatus.color }}>
                            {bmiStatus.label}
                          </BMIStatus>
                        );
                      }
                      return null;
                    })()}
                  </BMIDisplay>
                )}
              </div>
            </BodyInfoItem>
          </BodyInfoContainer>
        </FormSection>

        {/* 맥파분석 섹션 */}
        <FormSection>
          <SectionTitle type="맥파분석">맥파 분석</SectionTitle>
          <VitalSignsGrid>
            {Object.entries(vitalSigns).map(([key, info]) => (
              <VitalSignBox key={key}>
                <h3>{info.label}</h3>
                <VitalSignValue>
                  <Input
                    type="number"
                    value={formData.맥파분석?.[key] || ''}
                    onChange={(e) => handleInputChange(e, '맥파분석', key)}
                    style={{
                      width: '100px',
                      textAlign: 'right',
                      backgroundColor: (() => {
                        const status = getVitalSignStatus(key, formData.맥파분석?.[key]);
                        return status ? `${status.color}20` : 'transparent';
                      })()
                    }}
                  />
                  <UnitText>{info.unit}</UnitText>
                </VitalSignValue>
                {formData.맥파분석?.[key] && (
                  <StatusText status={getVitalSignStatus(key, formData.맥파분석[key])?.status}>
                    {(() => {
                      const value = formData.맥파분석[key];
                      const ranges = info.ranges;
                      if (value >= ranges.normal.min && value <= ranges.normal.max) {
                        return '정상';
                      } else if (value >= ranges.warning.min && value <= ranges.warning.max) {
                        return '주의';
                      } else {
                        return '위험';
                      }
                    })()}
                  </StatusText>
                )}
              </VitalSignBox>
            ))}
          </VitalSignsGrid>
        </FormSection>
                {/* 증상선택 섹션 */}
                <FormSection>
          <SectionTitle type="증상선택">증상 선택</SectionTitle>
          
          <CategorySelectGrid>
            <CategoryFormGroup>
              <label>스트레스 수준</label>
              <ModernSelect
                value={formData.기본정보?.스트레스 || ''}
                onChange={(e) => handleInputChange(e, '기본정보', '스트레스')}
              >
                <option value="">선택하세요</option>
                {stressLevels.map(level => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </ModernSelect>
            </CategoryFormGroup>

            <CategoryFormGroup>
              <label>노동강도</label>
              <ModernSelect
                value={formData.기본정보?.노동강도 || ''}
                onChange={(e) => handleInputChange(e, '기본정보', '노동강도')}
              >
                <option value="">선택하세요</option>
                {workIntensities.map(intensity => (
                  <option key={intensity.value} value={intensity.value}>
                    {intensity.label}
                  </option>
                ))}
              </ModernSelect>
            </CategoryFormGroup>
          </CategorySelectGrid>

          <Divider />
          
          <SymptomSelector
            selectedSymptoms={formData.증상선택?.증상 || []}
            onSymptomSelect={(symptoms) => {
              setFormData(prev => ({
                ...prev,
                증상선택: {
                  ...prev.증상선택,
                  증상: symptoms
                }
              }));
            }}
          />
        </FormSection>

        {/* 복용약물 섹션 */}
        <FormSection>
          <SectionTitle type="복용약물">복용약물</SectionTitle>
          
          <FormGroup>
            <label>복용 중인 약물</label>
            <SelectWrapper>
              <ModernSelect
                onChange={(e) => handleAddMedicine(e.target.value)}
                value=""
              >
                <option value="">약물을 선택하세요</option>
                {약물카테고리.map((medicine) => (
                  <option key={medicine} value={medicine}>
                    {medicine}
                  </option>
                ))}
              </ModernSelect>
            </SelectWrapper>
          </FormGroup>
          <SelectedMedicineList>
            {(!formData.복용약물?.약물 || formData.복용약물.약물.length === 0) ? (
              <EmptyMessage>선택된 약물이 없습니다</EmptyMessage>
            ) : (
              formData.복용약물.약물.map((medicine, index) => (
                <MedicineTag key={index}>
                  {medicine}
                  <button
                    type="button"
                    onClick={() => handleRemoveMedicine(medicine)}
                    aria-label={`${medicine} 제거`}
                  >
                    ×
                  </button>
                </MedicineTag>
              ))
            )}
          </SelectedMedicineList>

          <FormGroup style={{ marginTop: '20px' }}>
            <label>기호품</label>
            <SelectWrapper>
              <ModernSelect
                onChange={(e) => handleAddFavoriteItem(e.target.value)}
                value=""
              >
                <option value="">기호품을 선택해주세요</option>
                {favoriteItems.map(item => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </ModernSelect>
            </SelectWrapper>
          </FormGroup>

          <SelectedMedicineList>
            {(!formData.복용약물?.기호식품 || formData.복용약물.기호식품?.length === 0) ? (
              <EmptyMessage>선택된 기호품이 없습니다</EmptyMessage>
            ) : (
              formData.복용약물.기호식품?.map((itemValue, index) => {
                const item = favoriteItems.find(f => f.value === itemValue);
                return (
                  <MedicineTag key={index}>
                    {item?.label || itemValue}
                    <button
                      type="button"
                      onClick={() => handleRemoveFavoriteItem(itemValue)}
                      aria-label={`${item?.label || itemValue} 제거`}
                    >
                      ×
                    </button>
                  </MedicineTag>
                );
              })
            )}
          </SelectedMedicineList>
        </FormSection>

        {/* 메모 섹션 */}
        <FormSection>
          <SectionTitle type="메모">메모</SectionTitle>
          <FormGroup className="memo-group">
            <TextArea
              value={formData.메모 || ''}
              onChange={(e) => handleInputChange(e, '메모')}
              onKeyPress={handleKeyPress}
              placeholder="메모를 입력하세요"
            />
          </FormGroup>
        </FormSection>
                {/* 버튼 그룹 */}
                <ButtonContainer>
          <Button 
            variant="secondary"
            type="button" 
            onClick={handleReset}
          >
            초기화
          </Button>
          <Button 
            variant="primary"
            type="button"
            onClick={handleSubmit}
          >
            저장
          </Button>
        </ButtonContainer>
      </FormContainer>
    );
  };

  return renderContent();
};

// defaultProps 설정
HealthInfoForm.defaultProps = {
  initialData: null,
  onSubmit: async (data) => console.log('Form submitted:', data),
  id: null
};

export default HealthInfoForm;