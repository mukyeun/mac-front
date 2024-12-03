export const stressLevels = [
  { value: 'VERY_LOW', label: '매우 낮음' },
  { value: 'LOW', label: '낮음' },
  { value: 'MEDIUM', label: '보통' },
  { value: 'HIGH', label: '높음' },
  { value: 'VERY_HIGH', label: '매우 높음' }
];

export const workIntensities = [
  { value: 'VERY_LIGHT', label: '매우 가벼움' },
  { value: 'LIGHT', label: '가벼움' },
  { value: 'MODERATE', label: '보통' },
  { value: 'HEAVY', label: '힘듦' },
  { value: 'VERY_HEAVY', label: '매우 힘듦' }
];

export const favoriteItems = [
  { value: 'ALCOHOL', label: '술' },
  { value: 'TOBACCO', label: '담배' },
  { value: 'COFFEE', label: '커피' },
  { value: 'DRUG', label: '마약' },
  { value: 'OTHER', label: '기타' }
];

export const personalityTypes = [
  { value: 'VERY_URGENT', label: '매우 급함' },
  { value: 'URGENT', label: '급함' },
  { value: 'MODERATE', label: '원만' },
  { value: 'RELAXED', label: '느긋' },
  { value: 'VERY_RELAXED', label: '매우 느긋' }
];

export const genderTypes = [
  { value: 'MALE', label: '남성' },
  { value: 'FEMALE', label: '여성' }
];

export const bmiStatuses = [
  { value: 'UNDERWEIGHT', label: '저체중', color: '#ffd43b', range: { min: 0, max: 18.5 } },
  { value: 'NORMAL', label: '정상', color: '#51cf66', range: { min: 18.5, max: 23 } },
  { value: 'OVERWEIGHT', label: '과체중', color: '#ff922b', range: { min: 23, max: 25 } },
  { value: 'OBESE', label: '비만', color: '#ff6b6b', range: { min: 25, max: 30 } },
  { value: 'SEVERELY_OBESE', label: '고도비만', color: '#c92a2a', range: { min: 30, max: Infinity } }
];

export const getBmiStatusInfo = (bmi) => {
  if (!bmi || isNaN(bmi)) return null;
  
  return bmiStatuses.find(status => 
    bmi >= status.range.min && bmi < status.range.max
  );
};

export const vitalSigns = {
  맥박: {
    label: '맥박',
    unit: '회/분',
    ranges: {
      normal: { min: 60, max: 100 },
      warning: { min: 50, max: 110 },
      danger: { min: 0, max: 200 }
    }
  },
  수축기혈압: {
    label: '수축기 혈압',
    unit: 'mmHg',
    ranges: {
      normal: { min: 90, max: 120 },
      warning: { min: 80, max: 140 },
      danger: { min: 0, max: 200 }
    }
  },
  이완기혈압: {
    label: '이완기 혈압',
    unit: 'mmHg',
    ranges: {
      normal: { min: 60, max: 80 },
      warning: { min: 50, max: 90 },
      danger: { min: 0, max: 150 }
    }
  }
};

export const getVitalSignStatus = (type, value) => {
  const ranges = vitalSigns[type]?.ranges;
  if (!ranges || !value || isNaN(value)) return null;

  if (value >= ranges.normal.min && value <= ranges.normal.max) {
    return { status: 'normal', color: '#51cf66' };
  } else if (value >= ranges.warning.min && value <= ranges.warning.max) {
    return { status: 'warning', color: '#ffd43b' };
  } else {
    return { status: 'danger', color: '#ff6b6b' };
  }
};

// 폼 초기값 정의
export const initialFormData = {
  기본정보: {
    이름: '',
    연락처: '',
    주민등록번호: '',
    성별: '',
    신장: '',
    체중: '',
    BMI: '',
    성격: '',
    스트레스: '',
    노동강도: ''
  },
  맥파분석: {
    맥박: '',
    수축기혈압: '',
    이완기혈압: ''
  },
  증상선택: {
    증상: []
  },
  복용약물: {
    약물: [],
    기호식품: []
  },
  메모: ''
};

// 유효성 검사 규칙
export const validationRules = {
  기본정보: {
    이름: {
      required: true,
      message: '이름을 입력해주세요'
    },
    연락처: {
      required: true,
      pattern: /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/,
      message: '올바른 연락처 형식이 아닙니다'
    },
    주민등록번호: {
      required: true,
      pattern: /^[0-9]{6}-?[0-9]{7}$/,
      message: '올바른 주민등록번호 형식이 아닙니다'
    },
    성별: {
      required: true,
      message: '성별을 선택해주세요'
    },
    신장: {
      required: true,
      min: 100,
      max: 250,
      message: '신장은 100cm에서 250cm 사이여야 합니다'
    },
    체중: {
      required: true,
      min: 30,
      max: 200,
      message: '체중은 30kg에서 200kg 사이여야 합니다'
    }
  }
};