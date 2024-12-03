import React, { useState } from 'react';
import { 증상카테고리 } from '../../data/SymptomCategories';
import styled from 'styled-components';

// 스타일 컴포넌트들...
const SelectedSymptomsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.5rem;
  min-height: 2.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  margin-top: 1rem;
`;

const SymptomTag = styled.span`
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

const AddButton = styled.button`
  padding: 0.4rem 0.8rem;
  background-color: #4361ee;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  margin-top: 0.5rem;
  
  &:hover {
    background-color: #3730a3;
  }
  
  &:disabled {
    background-color: #a5b4fc;
    cursor: not-allowed;
  }
`;

const SymptomSelector = ({ selectedSymptoms = [], onSymptomSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState({
    대분류: '',
    중분류: '',
    소분류: ''
  });

  const handleCategoryChange = (e, level) => {
    const { value } = e.target;
    
    setSelectedCategory(prev => {
      const newCategory = { ...prev };
      newCategory[level] = value;
      
      // 하위 카테고리 초기화
      if (level === '대분류') {
        newCategory.중분류 = '';
        newCategory.소분류 = '';
      } else if (level === '중분류') {
        newCategory.소분류 = '';
      }
      
      return newCategory;
    });
  };

  const handleAddSymptom = () => {
    if (selectedCategory.소분류) {
      const symptomObj = JSON.parse(selectedCategory.소분류);
      if (!selectedSymptoms.some(s => s.code === symptomObj.code)) {
        onSymptomSelect([...selectedSymptoms, symptomObj]);
        setSelectedCategory(prev => ({ ...prev, 소분류: '' }));
      }
    }
  };

  const handleRemoveSymptom = (symptomToRemove) => {
    onSymptomSelect(selectedSymptoms.filter(symptom => symptom !== symptomToRemove));
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
        <div>
          <select
            value={selectedCategory.대분류}
            onChange={(e) => handleCategoryChange(e, '대분류')}
            style={{ width: '100%', padding: '0.5rem' }}
          >
            <option value="">대분류 선택</option>
            {Object.keys(증상카테고리).map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={selectedCategory.중분류}
            onChange={(e) => handleCategoryChange(e, '중분류')}
            disabled={!selectedCategory.대분류}
            style={{ width: '100%', padding: '0.5rem' }}
          >
            <option value="">중분류 선택</option>
            {selectedCategory.대분류 && 
              Object.keys(증상카테고리[selectedCategory.대분류]).map(subCategory => (
                <option key={subCategory} value={subCategory}>{subCategory}</option>
              ))}
          </select>
        </div>

        <div>
          <select
            value={selectedCategory.소분류}
            onChange={(e) => handleCategoryChange(e, '소분류')}
            disabled={!selectedCategory.중분류}
            style={{ width: '100%', padding: '0.5rem' }}
          >
            <option value="">소분류 선택</option>
            {selectedCategory.중분류 && 
              증상카테고리[selectedCategory.대분류][selectedCategory.중분류].map(symptom => (
                <option key={symptom.code} value={JSON.stringify(symptom)}>
                  {symptom.name} ({symptom.code})
                </option>
              ))}
          </select>
        </div>
      </div>

      <div style={{ textAlign: 'right' }}>
        <AddButton
          onClick={handleAddSymptom}
          disabled={!selectedCategory.소분류}
        >
          증상 추가
        </AddButton>
      </div>

      <SelectedSymptomsList>
        {selectedSymptoms.map((symptom, index) => (
          <SymptomTag key={index}>
            {symptom.name} ({symptom.code})
            <button
              type="button"
              onClick={() => handleRemoveSymptom(symptom)}
              aria-label={`${symptom.name} 제거`}
            >
              ×
            </button>
          </SymptomTag>
        ))}
        {selectedSymptoms.length === 0 && (
          <div style={{ color: '#868e96' }}>선택된 증상이 없습니다</div>
        )}
      </SelectedSymptomsList>
    </div>
  );
};

export default SymptomSelector; 