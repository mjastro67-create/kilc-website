// ============================================
// KILC Menu Manager JavaScript
// ============================================

// 메뉴 데이터 (초기 데이터 - 실제로는 서버에서 가져와야 함)
let menuData = [
    {
        id: 1,
        name: 'KILC 소개',
        link: '#',
        parent: null,
        order: 1,
        children: [
            { id: 11, name: '이사장 인사말', link: 'pages/greeting.html', parent: 1, order: 1 },
            { id: 12, name: '설립 취지', link: 'pages/founding.html', parent: 1, order: 2 },
            { id: 13, name: 'KILC 정관', link: 'pages/charter.html', parent: 1, order: 3 },
            { id: 14, name: 'KILC 조직도', link: 'pages/organization.html', parent: 1, order: 4 }
        ]
    },
    {
        id: 2,
        name: 'KILC 동향',
        link: '#',
        parent: null,
        order: 2,
        children: [
            {
                id: 21,
                name: '세계지도자대회',
                link: '#',
                parent: 2,
                order: 1,
                children: [
                    { id: 211, name: '2025 세계지도자대회', link: 'pages/leaders-convention-2025.html', parent: 21, order: 1 }
                ]
            },
            {
                id: 22,
                name: '정기총회',
                link: '#',
                parent: 2,
                order: 2,
                children: [
                    { id: 221, name: '2026 정기총회', link: 'pages/general-meeting-2026.html', parent: 22, order: 1 }
                ]
            },
            {
                id: 23,
                name: '기타',
                link: '#',
                parent: 2,
                order: 3,
                children: [
                    { id: 231, name: '상임이사회', link: 'pages/board-meeting.html', parent: 23, order: 1 },
                    { id: 232, name: '임시회의', link: 'pages/special-meeting.html', parent: 23, order: 2 }
                ]
            }
        ]
    },
    {
        id: 3,
        name: '동포정보',
        link: '#',
        parent: null,
        order: 3,
        children: [
            { id: 31, name: '해외동포', link: 'pages/overseas-info.html', parent: 3, order: 1 },
            { id: 32, name: '국내동포', link: 'pages/domestic-info.html', parent: 3, order: 2 }
        ]
    },
    {
        id: 4,
        name: '9한1통',
        link: '#',
        parent: null,
        order: 4,
        children: [
            { id: 41, name: '한글', link: 'pages/hangeul.html', parent: 4, order: 1 },
            { id: 42, name: '한식', link: 'pages/hansik.html', parent: 4, order: 2 },
            { id: 43, name: '한복', link: 'pages/hanbok.html', parent: 4, order: 3 },
            { id: 44, name: '한옥', link: 'pages/hanok.html', parent: 4, order: 4 }
        ]
    },
    {
        id: 5,
        name: '비즈파트너',
        link: '#',
        parent: null,
        order: 5,
        children: [
            { id: 51, name: '기업소개', link: 'pages/company-intro.html', parent: 5, order: 1 },
            { id: 52, name: '사업제안', link: 'pages/business-proposal.html', parent: 5, order: 2 }
        ]
    },
    {
        id: 6,
        name: '포럼',
        link: 'pages/forum.html',
        parent: null,
        order: 6,
        children: []
    }
];

// 메뉴 렌더링
function renderMenuTree() {
    const menuTree = document.getElementById('menuTree');
    menuTree.innerHTML = '';

    // 최상위 메뉴만 필터링
    const topMenus = menuData.filter(m => !m.parent);
    topMenus.sort((a, b) => a.order - b.order);

    topMenus.forEach(menu => {
        renderMenuItem(menu, menuTree, 1);
    });
}

// 메뉴 아이템 렌더링 (재귀)
function renderMenuItem(menu, container, level) {
    const menuItem = document.createElement('div');
    menuItem.className = `menu-item level-${level}`;
    menuItem.dataset.id = menu.id;
    menuItem.draggable = true;

    menuItem.innerHTML = `
        <div class="menu-info">
            <i class="fas fa-grip-vertical menu-handle"></i>
            <div>
                <div class="menu-name">${menu.name}</div>
                <div class="menu-link">${menu.link}</div>
            </div>
        </div>
        <div class="menu-actions">
            <button class="btn-icon btn-add-sub" onclick="openAddSubmenuModal(${menu.id})" title="서브메뉴 추가">
                <i class="fas fa-plus"></i>
            </button>
            <button class="btn-icon btn-edit" onclick="editMenu(${menu.id})" title="편집">
                <i class="fas fa-edit"></i>
            </button>
            <button class="btn-icon btn-delete" onclick="deleteMenu(${menu.id})" title="삭제">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;

    container.appendChild(menuItem);

    // 드래그 앤 드롭 이벤트
    menuItem.addEventListener('dragstart', handleDragStart);
    menuItem.addEventListener('dragover', handleDragOver);
    menuItem.addEventListener('drop', handleDrop);
    menuItem.addEventListener('dragend', handleDragEnd);

    // 자식 메뉴 렌더링
    if (menu.children && menu.children.length > 0) {
        menu.children.sort((a, b) => a.order - b.order);
        menu.children.forEach(child => {
            renderMenuItem(child, container, level + 1);
        });
    }
}

// 모달 열기/닫기
function openAddMenuModal() {
    document.getElementById('modalTitle').textContent = '새 메뉴 추가';
    document.getElementById('menuForm').reset();
    document.getElementById('menuId').value = '';
    updateParentMenuOptions();
    document.getElementById('menuModal').classList.add('active');
}

function openAddSubmenuModal(parentId) {
    document.getElementById('modalTitle').textContent = '서브메뉴 추가';
    document.getElementById('menuForm').reset();
    document.getElementById('menuId').value = '';
    document.getElementById('menuParent').value = parentId;
    updateParentMenuOptions();
    document.getElementById('menuModal').classList.add('active');
}

function closeMenuModal() {
    document.getElementById('menuModal').classList.remove('active');
}

// 상위 메뉴 옵션 업데이트
function updateParentMenuOptions() {
    const select = document.getElementById('menuParent');
    select.innerHTML = '<option value="">없음 (최상위 메뉴)</option>';

    // 모든 메뉴를 플랫하게 만들기
    function getAllMenus(menus, result = []) {
        menus.forEach(menu => {
            result.push(menu);
            if (menu.children && menu.children.length > 0) {
                getAllMenus(menu.children, result);
            }
        });
        return result;
    }

    const allMenus = getAllMenus(menuData);
    allMenus.forEach(menu => {
        const option = document.createElement('option');
        option.value = menu.id;
        option.textContent = menu.name;
        select.appendChild(option);
    });
}

// 메뉴 추가/수정 폼 제출
document.getElementById('menuForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const menuId = document.getElementById('menuId').value;
    const menuName = document.getElementById('menuName').value;
    const menuLink = document.getElementById('menuLink').value || '#';
    const menuParent = document.getElementById('menuParent').value;
    const menuOrder = parseInt(document.getElementById('menuOrder').value);

    if (menuId) {
        // 수정
        updateMenuRecursive(menuData, parseInt(menuId), {
            name: menuName,
            link: menuLink,
            parent: menuParent ? parseInt(menuParent) : null,
            order: menuOrder
        });
    } else {
        // 추가
        const newMenu = {
            id: Date.now(), // 임시 ID (실제로는 서버에서 생성)
            name: menuName,
            link: menuLink,
            parent: menuParent ? parseInt(menuParent) : null,
            order: menuOrder,
            children: []
        };

        if (menuParent) {
            // 서브메뉴로 추가
            addSubmenuRecursive(menuData, parseInt(menuParent), newMenu);
        } else {
            // 최상위 메뉴로 추가
            menuData.push(newMenu);
        }
    }

    // 변경사항 저장 (실제로는 서버에 저장)
    saveMenuData();

    closeMenuModal();
    renderMenuTree();
    showNotification('메뉴가 저장되었습니다.', 'success');
});

// 재귀적으로 메뉴 찾아서 업데이트
function updateMenuRecursive(menus, id, updates) {
    for (let i = 0; i < menus.length; i++) {
        if (menus[i].id === id) {
            Object.assign(menus[i], updates);
            return true;
        }
        if (menus[i].children && menus[i].children.length > 0) {
            if (updateMenuRecursive(menus[i].children, id, updates)) {
                return true;
            }
        }
    }
    return false;
}

// 재귀적으로 서브메뉴 추가
function addSubmenuRecursive(menus, parentId, newMenu) {
    for (let i = 0; i < menus.length; i++) {
        if (menus[i].id === parentId) {
            menus[i].children.push(newMenu);
            return true;
        }
        if (menus[i].children && menus[i].children.length > 0) {
            if (addSubmenuRecursive(menus[i].children, parentId, newMenu)) {
                return true;
            }
        }
    }
    return false;
}

// 메뉴 편집
function editMenu(id) {
    const menu = findMenuById(menuData, id);
    if (!menu) return;

    document.getElementById('modalTitle').textContent = '메뉴 편집';
    document.getElementById('menuId').value = menu.id;
    document.getElementById('menuName').value = menu.name;
    document.getElementById('menuLink').value = menu.link;
    document.getElementById('menuParent').value = menu.parent || '';
    document.getElementById('menuOrder').value = menu.order;
    updateParentMenuOptions();
    document.getElementById('menuModal').classList.add('active');
}

// 재귀적으로 메뉴 찾기
function findMenuById(menus, id) {
    for (let menu of menus) {
        if (menu.id === id) return menu;
        if (menu.children && menu.children.length > 0) {
            const found = findMenuById(menu.children, id);
            if (found) return found;
        }
    }
    return null;
}

// 메뉴 삭제
function deleteMenu(id) {
    const menu = findMenuById(menuData, id);
    if (!menu) return;

    if (menu.children && menu.children.length > 0) {
        if (!confirm(`'${menu.name}' 메뉴에는 ${menu.children.length}개의 서브메뉴가 있습니다.\n모두 삭제하시겠습니까?`)) {
            return;
        }
    } else {
        if (!confirm(`'${menu.name}' 메뉴를 삭제하시겠습니까?`)) {
            return;
        }
    }

    deleteMenuRecursive(menuData, id);
    saveMenuData();
    renderMenuTree();
    showNotification('메뉴가 삭제되었습니다.', 'success');
}

// 재귀적으로 메뉴 삭제
function deleteMenuRecursive(menus, id) {
    for (let i = 0; i < menus.length; i++) {
        if (menus[i].id === id) {
            menus.splice(i, 1);
            return true;
        }
        if (menus[i].children && menus[i].children.length > 0) {
            if (deleteMenuRecursive(menus[i].children, id)) {
                return true;
            }
        }
    }
    return false;
}

// 드래그 앤 드롭 핸들러
let draggedElement = null;

function handleDragStart(e) {
    draggedElement = this;
    this.style.opacity = '0.4';
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }

    if (draggedElement !== this) {
        // 순서 변경 로직 (간단한 구현)
        const allItems = Array.from(document.querySelectorAll('.menu-item'));
        const draggedIndex = allItems.indexOf(draggedElement);
        const targetIndex = allItems.indexOf(this);

        if (draggedIndex < targetIndex) {
            this.parentNode.insertBefore(draggedElement, this.nextSibling);
        } else {
            this.parentNode.insertBefore(draggedElement, this);
        }

        showNotification('메뉴 순서가 변경되었습니다. 저장하려면 "변경사항 적용"을 클릭하세요.', 'info');
    }

    return false;
}

function handleDragEnd(e) {
    this.style.opacity = '1';
    draggedElement = null;
}

// 메뉴 데이터 저장 (LocalStorage 사용)
function saveMenuData() {
    localStorage.setItem('kilc_menu_data', JSON.stringify(menuData));
    console.log('메뉴 데이터 저장됨:', menuData);
}

// 메뉴 데이터 불러오기
function loadMenuData() {
    const saved = localStorage.getItem('kilc_menu_data');
    if (saved) {
        menuData = JSON.parse(saved);
    }
}

// 알림 표시
function showNotification(message, type = 'info') {
    // 간단한 알림 구현
    alert(message);
}

// 사이트 미리보기
function previewSite() {
    window.open('../index.html', '_blank');
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    loadMenuData();
    renderMenuTree();
});

// 모달 외부 클릭 시 닫기
document.getElementById('menuModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeMenuModal();
    }
});
