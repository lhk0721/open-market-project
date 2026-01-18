// 스토리지 키 정의 (상수화)
const STORAGE_KEYS = {
    ACCESS_TOKEN: 'accessToken',
    USER_TYPE: 'user_type',
};

// 토큰 관련 유틸리티
export const getAccessToken = () => {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
};

export const setToken = (access, refresh) => { // refresh 인자 추가
    if (!access) return;
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access);
    
    // refresh 토큰 저장
    if (refresh) {
        localStorage.setItem('refreshToken', refresh);
    }
};

export const removeToken = () => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_TYPE);
};

// 사용자 정보 및 상태 유틸리티
export const setUserType = (type) => {
    if (!type) return;
    localStorage.setItem(STORAGE_KEYS.USER_TYPE, type);
};

export const getUserType = () => {
    return localStorage.getItem(STORAGE_KEYS.USER_TYPE);
};

export const isAuthenticated = () => {
    return !!getAccessToken(); // 토큰 존재 여부를 불리언 값으로 반환
};