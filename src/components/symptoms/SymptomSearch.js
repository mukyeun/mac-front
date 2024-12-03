import React, { useState, useMemo } from 'react';
import { 증상카테고리 } from '../../data/SymptomCategories';
import './SymptomSearch.css';

const SymptomSearch = ({ onSymptomSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    
    // 모든 증상을 플랫한 배열로 변환
    const allSymptoms = useMemo(() => {
        const symptoms = [];
        Object.entries(증상카테고리).forEach(([대분류, 중분류객체]) => {
            Object.entries(중분류객체).forEach(([중분류, 증상배열]) => {
                증상배열.forEach(증상 => {
                    symptoms.push({
                        증상,
                        대분류,
                        중분류
                    });
                });
            });
        });
        return symptoms;
    }, []);

    // 검색어에 따른 필터링
    const filteredSymptoms = useMemo(() => {
        if (!searchTerm) return [];
        
        return allSymptoms.filter(item => 
            item.증상.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.대분류.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.중분류.toLowerCase().includes(searchTerm.toLowerCase())
        ).slice(0, 10); // 최대 10개 결과만 표시
    }, [searchTerm, allSymptoms]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSymptomClick = (symptomData) => {
        onSymptomSelect(symptomData);
        setSearchTerm(''); // 선택 후 검색어 초기화
    };

    return (
        <div className="symptom-search">
            <div className="search-input-container">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="증상을 검색하세요..."
                    className="search-input"
                />
                {searchTerm && (
                    <button 
                        className="clear-button"
                        onClick={() => setSearchTerm('')}
                    >
                        ×
                    </button>
                )}
            </div>

            {filteredSymptoms.length > 0 && (
                <div className="search-results">
                    {filteredSymptoms.map((item, index) => (
                        <div 
                            key={index}
                            className="search-result-item"
                            onClick={() => handleSymptomClick(item)}
                        >
                            <span className="symptom-name">{item.증상}</span>
                            <div className="symptom-categories">
                                <span className="category">{item.대분류}</span>
                                <span className="subcategory">{item.중분류}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SymptomSearch;
