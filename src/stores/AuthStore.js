module.exports = {
    getAuthToken: function() {
        return localStorage.getItem('token');
    },
    getUserId: function() {
        return localStorage.getItem('userId');
    },
    setAuthData: function(userId, token) {
        localStorage.setItem('userId', userId);
        localStorage.setItem('token', token);
    },
    resetAuthData: function() {
        localStorage.setItem('userId', '');
        localStorage.setItem('token', '');
    }
}