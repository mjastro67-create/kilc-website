// 설정 관리 JavaScript

// 기본 설정값
const defaultSettings = {
    general: {
        siteName: 'KILC 세계지도자협회',
        siteNameEn: 'KILC World Leaders Association',
        siteDescription: '세계평화와 인류공영을 위한 세계지도자들의 협력체',
        siteUrl: 'https://www.dongpo750.com',
        defaultLang: 'ko',
        enableMultiLang: true
    },
    contact: {
        phone: '+82-2-737-4727',
        email: 'info@dongpo750.com',
        fax: '+82-2-737-4728',
        address: '서울특별시 중구 세종대로 110'
    },
    social: {
        facebook: '',
        instagram: '',
        youtube: '',
        twitter: ''
    },
    seo: {
        metaTitle: 'KILC 세계지도자협회 - 세계평화와 인류공영',
        metaDescription: 'KILC는 세계평화와 인류공영을 위해 노력하는 세계지도자들의 협력체입니다.',
        metaKeywords: 'KILC, 세계지도자협회, 세계평화, 인류공영',
        googleAnalytics: '',
        naverWebmaster: '',
        ogImage: 'https://www.dongpo750.com/images/og-image.jpg'
    },
    appearance: {
        primaryColor: '#2d8659',
        secondaryColor: '#1f6b44',
        accentColor: '#3fa76f',
        blueColor: '#2874a6',
        logoUrl: '/images/logo.png',
        faviconUrl: '/favicon.ico',
        enableGradient: true,
        enableStickyNav: true,
        enableFooterSocial: true
    },
    advanced: {
        customCSS: '',
        customJS: '',
        customHead: '',
        maintenanceMode: false,
        maintenanceMessage: '현재 사이트 점검 중입니다. 잠시 후 다시 방문해 주세요.'
    }
};

// 현재 설정 저장
let currentSettings = {};

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', function() {
    loadSettings();
    setupEventListeners();
});

// 설정 로드
function loadSettings() {
    const savedSettings = localStorage.getItem('siteSettings');
    if (savedSettings) {
        currentSettings = JSON.parse(savedSettings);
    } else {
        currentSettings = JSON.parse(JSON.stringify(defaultSettings));
    }
    
    populateForm();
}

// 폼에 데이터 채우기
function populateForm() {
    // 일반 설정
    document.getElementById('siteName').value = currentSettings.general.siteName || '';
    document.getElementById('siteNameEn').value = currentSettings.general.siteNameEn || '';
    document.getElementById('siteDescription').value = currentSettings.general.siteDescription || '';
    document.getElementById('siteUrl').value = currentSettings.general.siteUrl || '';
    document.getElementById('defaultLang').value = currentSettings.general.defaultLang || 'ko';
    document.getElementById('enableMultiLang').checked = currentSettings.general.enableMultiLang !== false;

    // 연락처 정보
    document.getElementById('contactPhone').value = currentSettings.contact.phone || '';
    document.getElementById('contactEmail').value = currentSettings.contact.email || '';
    document.getElementById('contactFax').value = currentSettings.contact.fax || '';
    document.getElementById('contactAddress').value = currentSettings.contact.address || '';

    // 소셜 미디어
    document.getElementById('socialFacebook').value = currentSettings.social.facebook || '';
    document.getElementById('socialInstagram').value = currentSettings.social.instagram || '';
    document.getElementById('socialYoutube').value = currentSettings.social.youtube || '';
    document.getElementById('socialTwitter').value = currentSettings.social.twitter || '';

    // SEO 설정
    document.getElementById('metaTitle').value = currentSettings.seo.metaTitle || '';
    document.getElementById('metaDescription').value = currentSettings.seo.metaDescription || '';
    document.getElementById('metaKeywords').value = currentSettings.seo.metaKeywords || '';
    document.getElementById('googleAnalytics').value = currentSettings.seo.googleAnalytics || '';
    document.getElementById('naverWebmaster').value = currentSettings.seo.naverWebmaster || '';
    document.getElementById('ogImage').value = currentSettings.seo.ogImage || '';

    // 디자인 설정
    document.getElementById('primaryColor').value = currentSettings.appearance.primaryColor || '#2d8659';
    document.getElementById('primaryColorText').value = currentSettings.appearance.primaryColor || '#2d8659';
    document.getElementById('secondaryColor').value = currentSettings.appearance.secondaryColor || '#1f6b44';
    document.getElementById('secondaryColorText').value = currentSettings.appearance.secondaryColor || '#1f6b44';
    document.getElementById('accentColor').value = currentSettings.appearance.accentColor || '#3fa76f';
    document.getElementById('accentColorText').value = currentSettings.appearance.accentColor || '#3fa76f';
    document.getElementById('blueColor').value = currentSettings.appearance.blueColor || '#2874a6';
    document.getElementById('blueColorText').value = currentSettings.appearance.blueColor || '#2874a6';
    document.getElementById('logoUrl').value = currentSettings.appearance.logoUrl || '';
    document.getElementById('faviconUrl').value = currentSettings.appearance.faviconUrl || '';
    document.getElementById('enableGradient').checked = currentSettings.appearance.enableGradient !== false;
    document.getElementById('enableStickyNav').checked = currentSettings.appearance.enableStickyNav !== false;
    document.getElementById('enableFooterSocial').checked = currentSettings.appearance.enableFooterSocial !== false;

    // 고급 설정
    document.getElementById('customCSS').value = currentSettings.advanced.customCSS || '';
    document.getElementById('customJS').value = currentSettings.advanced.customJS || '';
    document.getElementById('customHead').value = currentSettings.advanced.customHead || '';
    document.getElementById('maintenanceMode').checked = currentSettings.advanced.maintenanceMode === true;
    document.getElementById('maintenanceMessage').value = currentSettings.advanced.maintenanceMessage || '';
}

// 이벤트 리스너 설정
function setupEventListeners() {
    // 색상 picker와 텍스트 input 연동
    setupColorSync('primaryColor', 'primaryColorText');
    setupColorSync('secondaryColor', 'secondaryColorText');
    setupColorSync('accentColor', 'accentColorText');
    setupColorSync('blueColor', 'blueColorText');
}

// 색상 동기화 설정
function setupColorSync(colorId, textId) {
    const colorInput = document.getElementById(colorId);
    const textInput = document.getElementById(textId);
    
    if (colorInput && textInput) {
        colorInput.addEventListener('input', function() {
            textInput.value = this.value;
        });
        
        textInput.addEventListener('input', function() {
            if (/^#[0-9A-F]{6}$/i.test(this.value)) {
                colorInput.value = this.value;
            }
        });
    }
}

// 탭 전환
function switchTab(tabName) {
    // 모든 탭 버튼 비활성화
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 모든 탭 콘텐츠 숨기기
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // 선택된 탭 활성화
    event.target.classList.add('active');
    
    // 선택된 탭 콘텐츠 표시
    const tabContent = document.getElementById(tabName + 'Tab');
    if (tabContent) {
        tabContent.classList.add('active');
    }
}

// 설정 저장
function saveSettings() {
    // 폼에서 데이터 수집
    currentSettings = {
        general: {
            siteName: document.getElementById('siteName').value,
            siteNameEn: document.getElementById('siteNameEn').value,
            siteDescription: document.getElementById('siteDescription').value,
            siteUrl: document.getElementById('siteUrl').value,
            defaultLang: document.getElementById('defaultLang').value,
            enableMultiLang: document.getElementById('enableMultiLang').checked
        },
        contact: {
            phone: document.getElementById('contactPhone').value,
            email: document.getElementById('contactEmail').value,
            fax: document.getElementById('contactFax').value,
            address: document.getElementById('contactAddress').value
        },
        social: {
            facebook: document.getElementById('socialFacebook').value,
            instagram: document.getElementById('socialInstagram').value,
            youtube: document.getElementById('socialYoutube').value,
            twitter: document.getElementById('socialTwitter').value
        },
        seo: {
            metaTitle: document.getElementById('metaTitle').value,
            metaDescription: document.getElementById('metaDescription').value,
            metaKeywords: document.getElementById('metaKeywords').value,
            googleAnalytics: document.getElementById('googleAnalytics').value,
            naverWebmaster: document.getElementById('naverWebmaster').value,
            ogImage: document.getElementById('ogImage').value
        },
        appearance: {
            primaryColor: document.getElementById('primaryColor').value,
            secondaryColor: document.getElementById('secondaryColor').value,
            accentColor: document.getElementById('accentColor').value,
            blueColor: document.getElementById('blueColor').value,
            logoUrl: document.getElementById('logoUrl').value,
            faviconUrl: document.getElementById('faviconUrl').value,
            enableGradient: document.getElementById('enableGradient').checked,
            enableStickyNav: document.getElementById('enableStickyNav').checked,
            enableFooterSocial: document.getElementById('enableFooterSocial').checked
        },
        advanced: {
            customCSS: document.getElementById('customCSS').value,
            customJS: document.getElementById('customJS').value,
            customHead: document.getElementById('customHead').value,
            maintenanceMode: document.getElementById('maintenanceMode').checked,
            maintenanceMessage: document.getElementById('maintenanceMessage').value
        }
    };
    
    // localStorage에 저장
    localStorage.setItem('siteSettings', JSON.stringify(currentSettings));
    
    // 성공 메시지 표시
    showAlert('설정이 성공적으로 저장되었습니다.', 'success');
    
    // 실제 웹사이트에 적용 (데모용 - 실제로는 서버에 저장 필요)
    console.log('저장된 설정:', currentSettings);
}

// 변경사항 취소
function resetForm() {
    if (confirm('변경사항을 취소하시겠습니까?')) {
        loadSettings();
        showAlert('변경사항이 취소되었습니다.', 'info');
    }
}

// 설정 초기화
function resetSettings() {
    if (confirm('모든 설정을 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
        currentSettings = JSON.parse(JSON.stringify(defaultSettings));
        localStorage.setItem('siteSettings', JSON.stringify(currentSettings));
        populateForm();
        showAlert('설정이 초기화되었습니다.', 'success');
    }
}

// 설정 내보내기
function exportSettings() {
    const dataStr = JSON.stringify(currentSettings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kilc-settings-${new Date().getTime()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showAlert('설정이 내보내기 되었습니다.', 'success');
}

// 설정 가져오기
function importSettings() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                try {
                    const importedSettings = JSON.parse(event.target.result);
                    currentSettings = importedSettings;
                    localStorage.setItem('siteSettings', JSON.stringify(currentSettings));
                    populateForm();
                    showAlert('설정이 가져오기 되었습니다.', 'success');
                } catch (error) {
                    showAlert('설정 파일을 읽을 수 없습니다.', 'error');
                }
            };
            reader.readAsText(file);
        }
    };
    input.click();
}

// 알림 메시지 표시
function showAlert(message, type = 'info') {
    const alertDiv = document.getElementById('alertMessage');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    alertDiv.style.display = 'block';
    
    setTimeout(() => {
        alertDiv.style.display = 'none';
    }, 3000);
}
