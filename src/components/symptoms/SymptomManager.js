import React, { useState, useCallback } from 'react';
import SymptomSelector from './SymptomSelector';
import SymptomSearch from './SymptomSearch';
import SymptomFilter from './SymptomFilter';
import './SymptomManager.css';

const SymptomManager = () => {
    const [selectedSymptoms, setSelectedSymptoms] = useState([]);
    const [activeFilters, setActiveFilters] = useState({
        대분류: [],
        중분류: [],
        증상: []
    });

    // 증상 선택 처리
    const handleSymptomSelect = useCallback((symptoms) => {
        if (Array.isArray(symptoms)) {
            setSelectedSymptoms(symptoms);
        } else {
            // 검색을 통한 단일 증상 선택의 경우
            const symptomName = symptoms.증상;
            if (!selectedSymptoms.includes(symptomName)) {
                setSelectedSymptoms(prev => [...prev, symptomName]);
            }
        }
    }, [selectedSymptoms]);

    // 필터 변경 처리
    const handleFilterChange = useCallback((type, value) => {
        setActiveFilters(prev => {
            const newFilters = { ...prev };
            const index = newFilters[type].indexOf(value);
            
            if (index === -1) {
                newFilters[type] = [...newFilters[type], value];
            } else {
                newFilters[type] = newFilters[type].filter(item => item !== value);
            }
            
            return newFilters;
        });
    }, []);

    // 모든 필터 초기화
    const clearAllFilters = useCallback(() => {
        setActiveFilters({
            대분류: [],
            중분류: [],
            증상: []
        });
    }, []);

    // 선택된 증상 모두 제거
    const clearAllSymptoms = useCallback(() => {
        setSelectedSymptoms([]);
        clearAllFilters();
    }, [clearAllFilters]);

    return (
        <div className="symptom-manager">
            <div className="symptom-manager-header">
                <h2>증상 선택</h2>
                {selectedSymptoms.length > 0 && (
                    <button 
                        className="clear-all-button"
                        onClick={clearAllSymptoms}
                    >
                        모두 지우기
                    </button>
                )}
            </div>

            <div className="search-section">
                <SymptomSearch onSymptomSelect={handleSymptomSelect} />
            </div>

            <div className="selector-section">
                <SymptomSelector onSymptomSelect={handleSymptomSelect} />
            </div>

            <div className="filter-section">
                <SymptomFilter 
                    selectedSymptoms={selectedSymptoms}
                    onFilterChange={handleFilterChange}
                />
            </div>

            {Object.values(activeFilters).some(arr => arr.length > 0) && (
                <div className="active-filters">
                    <h3>적용된 필터</h3>
                    <div className="filter-tags">
                        {Object.entries(activeFilters).map(([type, values]) => (
                            values.map(value => (
                                <span key={`${type}-${value}`} className="active-filter-tag">
                                    {value}
                                    <button 
                                        onClick={() => handleFilterChange(type, value)}
                                    >
                                        ×
                                    </button>
                                </span>
                            ))
                        ))}
                        <button 
                            className="clear-filters-button"
                            onClick={clearAllFilters}
                        >
                            필터 초기화
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SymptomManager;
