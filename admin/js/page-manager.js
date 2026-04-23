// ============================================
// KILC Page Manager JavaScript
// ============================================

// 페이지 데이터
let pagesData = [
    {
        id: 1,
        title: '이사장 인사말',
        file: 'greeting.html',
        path: 'pages/greeting.html',
        language: 'ko',
        status: 'published',
        lastModified: '2026-03-12',
        author: '관리자'
    },
    {
        id: 2,
        title: 'Chairman\'s Greeting',
        file: 'greeting.html',
        path: 'pages-en/greeting.html',
        language: 'en',
        status: 'published',
        lastModified: '2026-03-12',
        author: '관리자'
    },
    {
        id: 3,
        title: '설립 취지',
        file: 'founding.html',
        path: 'pages/founding.html',
        language: 'ko',
        status: 'published',
        lastModified: '2026-03-10',
        author: '관리자'
    },
    {
        id: 4,
        title: 'Founding Purpose',
        file: 'founding.html',
        path: 'pages-en/founding.html',
        language: 'en',
        status: 'published',
        lastModified: '2026-03-10',
        author: '관리자'
    },
    {
        id: 5,
        title: 'KILC 정관',
        file: 'charter.html',
        path: 'pages/charter.html',
        language: 'ko',
        status: 'published',
        lastModified: '2026-03-11',
        author: '관리자'
    },
    {
        id: 6,
        title: 'KILC Charter',
        file: 'charter.html',
        path: 'pages-en/charter.html',
        language: 'en',
        status: 'published',
        lastModified: '2026-03-11',
        author: '관리자'
    },
    {
        id: 7,
        title: 'KILC 조직도',
        file: 'organization.html',
        path: 'pages/organization.html',
        language: 'ko',
        status: 'published',
        lastModified: '2026-03-09',
        author: '관리자'
    },
    {
        id: 8,
        title: 'Organization Chart',
        file: 'organization.html',
        path: 'pages-en/organization.html',
        language: 'en',
        status: 'published',
        lastModified: '2026-03-09',
        author: '관리자'
    },
    {
        id: 9,
        title: '2025 세계지도자대회',
        file: 'leaders-convention-2025.html',
        path: 'pages/leaders-convention-2025.html',
        language: 'ko',
        status: 'published',
        lastModified: '2026-03-11',
        author: '관리자'
    },
    {
        id: 10,
        title: '2025 World Leaders Convention',
        file: 'leaders-convention-2025.html',
        path: 'pages-en/leaders-convention-2025.html',
        language: 'en',
        status: 'published',
        lastModified: '2026-03-11',
        author: '관리자'
    }
];

let filteredPages = [...pagesData];

// 페이지 렌더링
function renderPages() {
    const pageGrid = document.getElementById('pageGrid');
    
    if (filteredPages.length === 0) {
        pageGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-file-alt"></i>
                <h3>페이지가 없습니다</h3>
                <p>새 페이지를 만들어 보세요</p>
            </div>
        `;
        return;
    }

    pageGrid.innerHTML = filteredPages.map(page => `
        <div class="page-card" data-id="${page.id}">
            <div class="page-header">
                <div class="page-icon">
                    <i class="fas ${page.language === 'ko' ? 'fa-file-alt' : 'fa-globe'}"></i>
                </div>
                <span class="page-status status-${page.status}">
                    ${page.status === 'published' ? '게시됨' : '임시저장'}
                </span>
            </div>
            <h3 class="page-title">${page.title}</h3>
            <div class="page-meta">
                <div class="page-meta-item">
                    <i class="fas fa-folder"></i>
                    <span>${page.path}</span>
                </div>
                <div class="page-meta-item">
                    <i class="fas fa-language"></i>
                    <span>${page.language === 'ko' ? '한국어' : 'English'}</span>
                </div>
                <div class="page-meta-item">
                    <i class="fas fa-clock"></i>
                    <span>${page.lastModified}</span>
                </div>
                <div class="page-meta-item">
                    <i class="fas fa-user"></i>
                    <span>${page.author}</span>
                </div>
            </div>
            <div class="page-actions">
                <button class="btn-action btn-edit-page" onclick="editPage(${page.id})">
                    <i class="fas fa-edit"></i>
                    편집
                </button>
                <button class="btn-action btn-view-page" onclick="viewPage(${page.id})">
                    <i class="fas fa-eye"></i>
                    보기
                </button>
                <button class="btn-action btn-delete-page" onclick="deletePage(${page.id})">
                    <i class="fas fa-trash"></i>
                    삭제
                </button>
            </div>
        </div>
    `).join('');
}

// 페이지 검색
function searchPages() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    filteredPages = pagesData.filter(page => {
        return page.title.toLowerCase().includes(searchTerm) ||
               page.file.toLowerCase().includes(searchTerm) ||
               page.path.toLowerCase().includes(searchTerm);
    });

    filterPages(); // 기존 필터도 적용
}

// 페이지 필터링
function filterPages() {
    const languageFilter = document.getElementById('languageFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();

    filteredPages = pagesData.filter(page => {
        const matchLanguage = languageFilter === 'all' || page.language === languageFilter;
        const matchStatus = statusFilter === 'all' || page.status === statusFilter;
        const matchSearch = !searchTerm || 
                          page.title.toLowerCase().includes(searchTerm) ||
                          page.file.toLowerCase().includes(searchTerm) ||
                          page.path.toLowerCase().includes(searchTerm);
        
        return matchLanguage && matchStatus && matchSearch;
    });

    renderPages();
}

// 새 페이지 만들기
function createNewPage() {
    const title = prompt('새 페이지 제목을 입력하세요:');
    if (!title) return;

    const language = confirm('한국어 페이지를 만드시겠습니까?\n(취소를 누르면 영문 페이지가 생성됩니다)') ? 'ko' : 'en';
    
    const fileName = title.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-가-힣]/g, '') + '.html';
    
    const path = language === 'ko' ? `pages/${fileName}` : `pages-en/${fileName}`;

    const newPage = {
        id: Date.now(),
        title: title,
        file: fileName,
        path: path,
        language: language,
        status: 'draft',
        lastModified: new Date().toISOString().split('T')[0],
        author: '관리자'
    };

    pagesData.push(newPage);
    savePageData();
    filterPages();
    
    alert(`새 페이지가 생성되었습니다!\n\n파일: ${path}\n\n이제 '내용 편집'에서 페이지 내용을 작성할 수 있습니다.`);
    
    // 실제로는 내용 편집 페이지로 이동
    // window.location.href = `content-editor.html?page=${newPage.id}`;
}

// 페이지 편집
function editPage(id) {
    const page = pagesData.find(p => p.id === id);
    if (!page) return;

    // 내용 편집 페이지로 이동
    window.location.href = `content-editor.html?page=${id}`;
}

// 페이지 보기
function viewPage(id) {
    const page = pagesData.find(p => p.id === id);
    if (!page) return;

    window.open(`../${page.path}`, '_blank');
}

// 페이지 삭제
function deletePage(id) {
    const page = pagesData.find(p => p.id === id);
    if (!page) return;

    if (!confirm(`'${page.title}' 페이지를 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.`)) {
        return;
    }

    pagesData = pagesData.filter(p => p.id !== id);
    savePageData();
    filterPages();
    
    showNotification(`'${page.title}' 페이지가 삭제되었습니다.`, 'success');
}

// 데이터 저장
function savePageData() {
    localStorage.setItem('kilc_pages_data', JSON.stringify(pagesData));
    console.log('페이지 데이터 저장됨:', pagesData);
}

// 데이터 불러오기
function loadPageData() {
    const saved = localStorage.getItem('kilc_pages_data');
    if (saved) {
        pagesData = JSON.parse(saved);
        filteredPages = [...pagesData];
    }
}

// 알림 표시
function showNotification(message, type = 'info') {
    alert(message);
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    loadPageData();
    renderPages();
});
