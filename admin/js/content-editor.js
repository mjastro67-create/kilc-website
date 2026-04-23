// ============================================
// KILC Content Editor JavaScript
// ============================================

// Quill 에디터 초기화
let quill = new Quill('#editor', {
    theme: 'snow',
    placeholder: '페이지 내용을 작성하세요...',
    modules: {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'font': [] }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'script': 'sub'}, { 'script': 'super' }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'indent': '-1'}, { 'indent': '+1' }],
            [{ 'direction': 'rtl' }],
            [{ 'align': [] }],
            ['blockquote', 'code-block'],
            ['link', 'image', 'video'],
            ['clean']
        ]
    }
});

// 현재 편집 중인 페이지 ID
let currentPageId = null;

// 페이지 데이터 (예시)
let contentData = {
    1: {
        id: 1,
        title: '이사장 인사말',
        language: 'ko',
        status: 'published',
        path: 'pages/greeting.html',
        content: `
            <h1>이사장 인사말</h1>
            <p>안녕하십니까. 한국국제지도자회의(KILC) 이사장 박철언입니다.</p>
            <p>한국국제지도자회의(KILC)는 전 세계 한민족 지도자들이 교류하고 협력하는 글로벌 네트워크입니다.</p>
            <h2>우리의 비전</h2>
            <p>KILC는 세계 각국에 거주하는 한민족 지도자들이 하나로 연결되어, 한민족의 번영과 세계 평화에 기여하고자 합니다.</p>
        `
    },
    2: {
        id: 2,
        title: 'Chairman\'s Greeting',
        language: 'en',
        status: 'published',
        path: 'pages-en/greeting.html',
        content: `
            <h1>Chairman's Greeting</h1>
            <p>Greetings. I am Park Cheol-eon, Chairman of the Korea International Leaders Congress (KILC).</p>
            <p>KILC is a global network where Korean leaders from around the world exchange and cooperate.</p>
        `
    }
};

// 페이지 선택 옵션 로드
function loadPageOptions() {
    const select = document.getElementById('pageSelect');
    const savedPages = localStorage.getItem('kilc_pages_data');
    
    if (savedPages) {
        const pages = JSON.parse(savedPages);
        pages.forEach(page => {
            const option = document.createElement('option');
            option.value = page.id;
            option.textContent = `${page.title} (${page.language === 'ko' ? '한국어' : 'English'})`;
            select.appendChild(option);
        });
    } else {
        // 기본 페이지 옵션
        Object.values(contentData).forEach(page => {
            const option = document.createElement('option');
            option.value = page.id;
            option.textContent = `${page.title} (${page.language === 'ko' ? '한국어' : 'English'})`;
            select.appendChild(option);
        });
    }

    // URL 파라미터에서 페이지 ID 확인
    const urlParams = new URLSearchParams(window.location.search);
    const pageId = urlParams.get('page');
    if (pageId) {
        select.value = pageId;
        loadPageContent();
    }
}

// 페이지 내용 로드
function loadPageContent() {
    const pageId = document.getElementById('pageSelect').value;
    if (!pageId) {
        clearEditor();
        return;
    }

    currentPageId = parseInt(pageId);
    
    // LocalStorage에서 내용 불러오기
    const savedContent = localStorage.getItem(`kilc_content_${pageId}`);
    let pageData;
    
    if (savedContent) {
        pageData = JSON.parse(savedContent);
    } else if (contentData[pageId]) {
        pageData = contentData[pageId];
    } else {
        pageData = {
            title: '새 페이지',
            language: 'ko',
            status: 'draft',
            path: 'pages/new-page.html',
            content: ''
        };
    }

    // 폼에 데이터 채우기
    document.getElementById('pageTitle').value = pageData.title;
    document.getElementById('pageLanguage').value = pageData.language;
    document.getElementById('pageStatus').value = pageData.status;
    document.getElementById('pagePath').value = pageData.path;
    
    // Quill 에디터에 내용 설정
    quill.root.innerHTML = pageData.content || '';
    
    showNotification('페이지를 불러왔습니다.', 'success');
}

// 에디터 초기화
function clearEditor() {
    document.getElementById('pageTitle').value = '';
    document.getElementById('pageLanguage').value = 'ko';
    document.getElementById('pageStatus').value = 'draft';
    document.getElementById('pagePath').value = '';
    quill.root.innerHTML = '';
    currentPageId = null;
}

// 페이지 저장
function savePage() {
    if (!currentPageId) {
        alert('저장할 페이지를 선택하세요.');
        return;
    }

    const pageData = {
        id: currentPageId,
        title: document.getElementById('pageTitle').value,
        language: document.getElementById('pageLanguage').value,
        status: document.getElementById('pageStatus').value,
        path: document.getElementById('pagePath').value,
        content: quill.root.innerHTML,
        lastModified: new Date().toISOString().split('T')[0]
    };

    // 유효성 검사
    if (!pageData.title) {
        alert('페이지 제목을 입력하세요.');
        return;
    }

    if (!pageData.path) {
        alert('URL 경로를 입력하세요.');
        return;
    }

    // LocalStorage에 저장
    localStorage.setItem(`kilc_content_${currentPageId}`, JSON.stringify(pageData));
    
    // 상태 업데이트
    updateAutoSaveStatus('저장 완료', 'success');
    
    showNotification('페이지가 저장되었습니다!', 'success');
    
    // 실제 환경에서는 여기서 서버에 전송하고 HTML 파일 생성
    generateHTMLFile(pageData);
}

// 임시저장
function saveDraft() {
    if (!currentPageId) {
        alert('저장할 페이지를 선택하세요.');
        return;
    }

    // 상태를 draft로 설정
    document.getElementById('pageStatus').value = 'draft';
    savePage();
}

// 페이지 삭제
function deletePage() {
    if (!currentPageId) {
        alert('삭제할 페이지를 선택하세요.');
        return;
    }

    if (!confirm('이 페이지를 삭제하시겠습니까?')) {
        return;
    }

    // LocalStorage에서 삭제
    localStorage.removeItem(`kilc_content_${currentPageId}`);
    
    showNotification('페이지가 삭제되었습니다.', 'success');
    
    // 페이지 목록으로 이동
    window.location.href = 'page-manager.html';
}

// 미리보기 토글
function togglePreview() {
    const editorMode = document.getElementById('editorMode');
    const previewMode = document.getElementById('previewMode');
    const previewBtn = document.getElementById('previewBtnText');

    if (previewMode.classList.contains('active')) {
        // 편집 모드로 전환
        previewMode.classList.remove('active');
        editorMode.style.display = 'block';
        previewBtn.textContent = '미리보기';
    } else {
        // 미리보기 모드로 전환
        editorMode.style.display = 'none';
        previewMode.classList.add('active');
        previewBtn.textContent = '편집';
        
        // 미리보기 내용 업데이트
        document.getElementById('previewTitle').textContent = document.getElementById('pageTitle').value || '제목 없음';
        document.getElementById('previewContent').innerHTML = quill.root.innerHTML;
    }
}

// 자동 저장 상태 업데이트
function updateAutoSaveStatus(text, type = 'success') {
    const statusElement = document.getElementById('autoSaveStatus');
    const icon = statusElement.querySelector('i');
    const span = statusElement.querySelector('span');
    
    statusElement.className = 'auto-save-status';
    
    if (type === 'saving') {
        statusElement.classList.add('saving');
        icon.className = 'fas fa-spinner';
    } else if (type === 'success') {
        icon.className = 'fas fa-check-circle';
    } else if (type === 'error') {
        icon.className = 'fas fa-exclamation-circle';
    }
    
    span.textContent = text;
}

// 자동 저장 (5초마다)
let autoSaveInterval;

function startAutoSave() {
    autoSaveInterval = setInterval(() => {
        if (currentPageId && quill.getText().trim().length > 0) {
            updateAutoSaveStatus('자동 저장 중...', 'saving');
            
            setTimeout(() => {
                savePage();
            }, 500);
        }
    }, 30000); // 30초마다 자동 저장
}

function stopAutoSave() {
    if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
    }
}

// HTML 파일 생성 (실제 배포용)
function generateHTMLFile(pageData) {
    // 완전한 HTML 페이지 생성
    const htmlTemplate = `<!DOCTYPE html>
<html lang="${pageData.language}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageData.title} - KILC</title>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/pages.css">
</head>
<body>
    <!-- 헤더 -->
    <header class="header">
        <!-- 헤더 내용 -->
    </header>

    <!-- 메인 콘텐츠 -->
    <main class="page-content">
        <div class="container">
            ${pageData.content}
        </div>
    </main>

    <!-- 푸터 -->
    <footer class="footer">
        <!-- 푸터 내용 -->
    </footer>

    <script src="../js/main.js"></script>
</body>
</html>`;

    // 다운로드 가능한 형태로 제공
    const blob = new Blob([htmlTemplate], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = pageData.path.split('/').pop();
    
    console.log('HTML 파일 생성됨:', pageData.path);
    console.log('다운로드하려면 아래 코드의 주석을 해제하세요');
    // a.click();
    // URL.revokeObjectURL(url);
}

// 알림 표시
function showNotification(message, type = 'info') {
    // 간단한 알림 구현
    updateAutoSaveStatus(message, type);
    setTimeout(() => {
        updateAutoSaveStatus('저장 완료', 'success');
    }, 3000);
}

// 에디터 내용 변경 감지
quill.on('text-change', function() {
    if (currentPageId) {
        updateAutoSaveStatus('변경 사항 있음', 'saving');
    }
});

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    loadPageOptions();
    startAutoSave();
});

// 페이지 언로드 시 자동 저장 중지
window.addEventListener('beforeunload', function() {
    stopAutoSave();
});
