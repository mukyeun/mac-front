import React, { useMemo } from 'react';
import { 증상카테고리 } from '../../data/SymptomCategories';
import './SymptomFilter.css';

const SymptomFilter = ({ selectedSymptoms, onFilterChange }) => {
    // 선택된 증상들의 카테고리 정보 추출
    const categoryInfo = useMemo(() => {
        const info = {
            대분류: new Set(),
            중분류: new Set(),
            관련증상: new Set()
        };

        Object.entries(증상카테고리).forEach(([대분류, 중분류객체]) => {
            Object.entries(중분류객체).forEach(([중분류, 증상배열]) => {
                selectedSymptoms.forEach(선택증상 => {
                    if (증상배열.includes(선택증상)) {
                        info.대분류.add(대분류);
                        info.중분류.add(중분류);
                        증상배열.forEach(관련 => info.관련증상.add(관련));
                    }
                });
            });
        });

        return {
            대분류: Array.from(info.대분류),
            중분류: Array.from(info.중분류),
            관련증상: Array.from(info.관련증상)
                .filter(증상 => !selectedSymptoms.includes(증상))
        };
    }, [selectedSymptoms]);

    // 필터 옵션 변경 처리
    const handleFilterChange = (type, value) => {
        onFilterChange(type, value);
    };

    return (
        <div className="symptom-filter">
            {selectedSymptoms.length > 0 && (
                <>
                    <div className="filter-section">
                        <h3>관련 대분류</h3>
                        <div className="filter-tags">
                            {categoryInfo.대분류.map(category => (
                                <button
                                    key={category}
                                    className="filter-tag"
                                    onClick={() => handleFilterChange('대분류', category)}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="filter-section">
                        <h3>관련 중분류</h3>
                        <div className="filter-tags">
                            {categoryInfo.중분류.map(subCategory => (
                                <button
                                    key={subCategory}
                                    className="filter-tag"
                                    onClick={() => handleFilterChange('중분류', subCategory)}
                                >
                                    {subCategory}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="filter-section">
                        <h3>연관 증상</h3>
                        <div className="filter-tags">
                            {categoryInfo.관련증상.map(symptom => (
                                <button
                                    key={symptom}
                                    className="filter-tag related"
                                    onClick={() => handleFilterChange('증상', symptom)}
                                >
                                    {symptom}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {selectedSymptoms.length === 0 && (
                <div className="no-symptoms">
                    증상을 선택하면 관련된 필터 옵션이 표시됩니다.
                </div>
            )}
        </div>
    );
};

export default SymptomFilter;
