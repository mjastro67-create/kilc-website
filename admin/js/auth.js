// ============================================
// KILC Admin Authentication System
// ============================================

// 세션 확인
function getSession() {
    const localSession = localStorage.getItem('kilc_admin_session');
    const sessionSession = sessionStorage.getItem('kilc_admin_session');
    
    if (localSession) {
        return JSON.parse(localSession);
    } else if (sessionSession) {
        return JSON.parse(sessionSession);
    }
    return null;
}

// 인증 확인
function checkAuth() {
    const session = getSession();
    const currentPage = window.location.pathname;
    
    // 로그인 페이지가 아닌 경우
    if (!currentPage.includes('login.html')) {
        if (!session || !session.isAdmin) {
            // 로그인되지 않았으면 로그인 페이지로 리다이렉트
            window.location.href = 'login.html';
            return false;
        }
    }
    return true;
}

// 로그아웃
function logout() {
    localStorage.removeItem('kilc_admin_session');
    sessionStorage.removeItem('kilc_admin_session');
    window.location.href = 'login.html';
}

// 페이지 로드 시 자동 인증 확인
document.addEventListener('DOMContentLoaded', function() {
    // 로그인 페이지가 아닌 경우에만 인증 확인
    if (!window.location.pathname.includes('login.html')) {
        checkAuth();
    }
});
