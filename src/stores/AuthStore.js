export function getAuthToken() {
    return localStorage.getItem('token');
}

export function getUserId() {
    return localStorage.getItem('userId');
}
 
export function setAuthData(userId, token) {
    localStorage.setItem('userId', userId);
    localStorage.setItem('token', token);
}

export function resetAuthData() {
    localStorage.setItem('userId', '');
    localStorage.setItem('token', '');
}