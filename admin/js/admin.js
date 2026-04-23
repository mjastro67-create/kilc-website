// ============================================
// KILC Admin Common JavaScript
// ============================================

// 사이트 미리보기
function previewSite() {
    window.open('../index.html', '_blank');
}

// 변경사항 적용
function publishChanges() {
    if (confirm('변경사항을 적용하시겠습니까?\n\n적용된 내용은 즉시 웹사이트에 반영됩니다.')) {
        // 실제로는 여기서 서버에 변경사항 전송
        showProgressModal();
        
        setTimeout(() => {
            hideProgressModal();
            showSuccessModal('변경사항이 성공적으로 적용되었습니다! ✅');
        }, 2000);
    }
}

// 진행 상황 모달 표시
function showProgressModal() {
    const modal = document.createElement('div');
    modal.id = 'progressModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    `;
    
    modal.innerHTML = `
        <div style="background: white; padding: 40px; border-radius: 12px; text-align: center;">
            <div style="width: 60px; height: 60px; border: 5px solid #f3f3f3; border-top: 5px solid #2d8659; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
            <h3 style="color: #333; margin-bottom: 10px;">변경사항 적용 중...</h3>
            <p style="color: #666; font-size: 14px;">잠시만 기다려 주세요</p>
        </div>
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;
    
    document.body.appendChild(modal);
}

// 진행 상황 모달 숨기기
function hideProgressModal() {
    const modal = document.getElementById('progressModal');
    if (modal) {
        modal.remove();
    }
}

// 성공 모달 표시
function showSuccessModal(message) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    `;
    
    modal.innerHTML = `
        <div style="background: white; padding: 40px; border-radius: 12px; text-align: center; max-width: 400px;">
            <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; animation: scaleIn 0.5s ease;">
                <i class="fas fa-check" style="font-size: 40px; color: white;"></i>
            </div>
            <h3 style="color: #333; margin-bottom: 10px; font-size: 20px;">${message}</h3>
            <button onclick="this.closest('div').parentElement.remove()" style="margin-top: 20px; padding: 10px 30px; background: #2d8659; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">확인</button>
        </div>
        <style>
            @keyframes scaleIn {
                0% { transform: scale(0); }
                100% { transform: scale(1); }
            }
        </style>
    `;
    
    document.body.appendChild(modal);
    
    // 3초 후 자동 닫기
    setTimeout(() => {
        modal.remove();
    }, 3000);
}

// 알림 토스트 표시
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: ${type === 'success' ? '#43e97b' : type === 'error' ? '#f5576c' : '#4facfe'};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        z-index: 9999;
        animation: slideIn 0.3s ease;
        display: flex;
        align-items: center;
        gap: 10px;
        max-width: 400px;
    `;
    
    const icon = type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
    
    toast.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
        <style>
            @keyframes slideIn {
                from { transform: translateX(400px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        </style>
    `;
    
    document.body.appendChild(toast);
    
    // 3초 후 자동 제거
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// LocalStorage 데이터 백업
function backupAllData() {
    const backup = {
        menu: localStorage.getItem('kilc_menu_data'),
        pages: localStorage.getItem('kilc_pages_data'),
        content: {},
        timestamp: new Date().toISOString()
    };
    
    // 모든 콘텐츠 데이터 백업
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('kilc_content_')) {
            backup.content[key] = localStorage.getItem(key);
        }
    }
    
    // JSON 파일로 다운로드
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kilc-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    showToast('데이터 백업이 완료되었습니다.', 'success');
}

// LocalStorage 데이터 복원
function restoreData(fileInput) {
    const file = fileInput.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const backup = JSON.parse(e.target.result);
            
            if (confirm('기존 데이터를 모두 덮어쓰시겠습니까?')) {
                // 메뉴 데이터 복원
                if (backup.menu) {
                    localStorage.setItem('kilc_menu_data', backup.menu);
                }
                
                // 페이지 데이터 복원
                if (backup.pages) {
                    localStorage.setItem('kilc_pages_data', backup.pages);
                }
                
                // 콘텐츠 데이터 복원
                if (backup.content) {
                    Object.keys(backup.content).forEach(key => {
                        localStorage.setItem(key, backup.content[key]);
                    });
                }
                
                showSuccessModal('데이터 복원이 완료되었습니다!');
                
                // 페이지 새로고침
                setTimeout(() => {
                    location.reload();
                }, 2000);
            }
        } catch (error) {
            alert('백업 파일을 읽을 수 없습니다.');
            console.error(error);
        }
    };
    reader.readAsText(file);
}

// 모바일 사이드바 토글
function toggleMobileSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('open');
}

// 반응형: 모바일에서 메뉴 버튼 추가
if (window.innerWidth <= 768) {
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        const menuBtn = document.createElement('button');
        menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        menuBtn.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            width: 50px;
            height: 50px;
            background: #2d8659;
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 20px;
            cursor: pointer;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            z-index: 999;
        `;
        menuBtn.onclick = toggleMobileSidebar;
        document.body.appendChild(menuBtn);
    }
}

// 키보드 단축키
document.addEventListener('keydown', function(e) {
    // Ctrl+S: 저장
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        if (typeof savePage === 'function') {
            savePage();
        }
    }
    
    // Ctrl+P: 미리보기
    if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        if (typeof togglePreview === 'function') {
            togglePreview();
        } else {
            previewSite();
        }
    }
});

// 페이지 로드 완료 후 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log('KILC Admin System Loaded');
    
    // 세션 만료 확인 (1시간)
    checkSessionExpiry();
});

// 세션 만료 확인
function checkSessionExpiry() {
    const session = getSession();
    if (session && session.loginTime) {
        const loginTime = new Date(session.loginTime);
        const now = new Date();
        const diff = now - loginTime;
        const hours = diff / (1000 * 60 * 60);
        
        if (hours > 1) {
            alert('세션이 만료되었습니다. 다시 로그인해주세요.');
            logout();
        }
    }
}
