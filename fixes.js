// COMPREHENSIVE FIXES FOR LIFEMAKERS EGYPT VOLUNTEER PLATFORM
// This file contains all the fixes for the issues mentioned

// ========================================
// 1. THEME SYSTEM FIX
// ========================================

// Replace the existing applyTheme function (unify with root element)
function applyTheme(theme) {
    const root = document.documentElement;
    
    // Remove all theme classes first
    root.classList.remove('light-theme', 'dark-theme');
    
    if (theme === THEME_MODES.DARK) {
        root.classList.add('dark-theme');
    } else {
        root.classList.add('light-theme');
    }
    
    // Update theme toggle buttons
    const themeButtons = document.querySelectorAll('.theme-btn');
    themeButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('onclick')?.includes(theme)) {
            btn.classList.add('active');
        }
    });
    
    // Store the current theme
    localStorage.setItem('theme', theme);
}

// ========================================
// 2. REWARDS EXCHANGE FUNCTIONALITY
// ========================================

function redeemReward(rewardType, pointsCost) {
    if (!currentUser) {
        showToast('يرجى تسجيل الدخول أولاً', 'error');
        return;
    }
    
    if (userPoints < pointsCost) {
        showToast('نقاطك غير كافية لاستبدال هذه المكافأة', 'error');
        return;
    }
    
    // Confirm redemption
    if (confirm(`هل أنت متأكد من استبدال ${pointsCost} نقطة؟`)) {
        // Deduct points
        userPoints -= pointsCost;
        
        // Update UI
        updateUserPoints();
        
        // Show success message
        showToast(`تم استبدال المكافأة بنجاح! تم خصم ${pointsCost} نقطة`, 'success');
        
        // Here you would typically make an API call to record the redemption
        console.log(`Redeemed ${rewardType} for ${pointsCost} points`);
    }
}

function updateUserPoints() {
    // Update all points displays
    const pointsDisplays = document.querySelectorAll('.points-display, .stat-number');
    pointsDisplays.forEach(display => {
        if (display.textContent.includes('نقطة') || display.textContent.includes('⭐')) {
            display.textContent = `${userPoints} نقطة`;
        }
    });
}

// ========================================
// 3. IMAGE UPLOAD FUNCTIONALITY
// ========================================

function initializeImageUpload() {
    const imageInput = document.getElementById('post-image');
    if (imageInput) {
        imageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const preview = document.getElementById('image-preview');
                    const previewImg = document.getElementById('preview-img');
                    if (preview && previewImg) {
                        previewImg.src = e.target.result;
                        preview.style.display = 'block';
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

function removeImage() {
    const imageInput = document.getElementById('post-image');
    const preview = document.getElementById('image-preview');
    
    if (imageInput) imageInput.value = '';
    if (preview) preview.style.display = 'none';
}

// ========================================
// 4. CATEGORY SELECTION FUNCTIONALITY
// ========================================

function initializeCategorySelection() {
    const categoryOptions = document.querySelectorAll('.category-option');
    categoryOptions.forEach(option => {
        option.addEventListener('click', function() {
            categoryOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            
            // Update hidden input
            const categoryInput = document.getElementById('post-category');
            if (categoryInput) {
                categoryInput.value = this.dataset.category;
            }
        });
    });
}

// ========================================
// 5. PROFILE DISPLAY FUNCTIONALITY
// ========================================

function displayUserProfile(userId) {
    // Get user data
    const user = getUserById(userId);
    if (!user) {
        showToast('لم يتم العثور على المستخدم', 'error');
        return;
    }
    
    // Update profile page content
    const profileContainer = document.querySelector('.profile-container');
    if (profileContainer) {
        profileContainer.innerHTML = `
            <div class="profile-header">
                <div class="profile-avatar">
                    <div class="avatar-initial">${user.name.charAt(0)}</div>
                </div>
                <div class="profile-info">
                    <h2>${user.name}</h2>
                    <p class="user-role">${getRoleDisplayName(user.role)}</p>
                    <p class="user-location">${user.governorate}</p>
                </div>
            </div>
            
            <div class="profile-stats">
                <div class="stat-item">
                    <span class="stat-number">${userPoints}</span>
                    <span class="stat-label">النقاط</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">${userRank}</span>
                    <span class="stat-label">الترتيب</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">${userHours}</span>
                    <span class="stat-label">الساعات</span>
                </div>
            </div>
            
            <div class="profile-actions">
                <button class="btn-primary" onclick="editProfile()">
                    <i class="fas fa-edit"></i>
                    تعديل الملف الشخصي
                </button>
            </div>
        `;
    }
}

function getRoleDisplayName(role) {
    const roleNames = {
        'user': 'متطوع',
        'moderator': 'مشرف',
        'admin': 'مدير',
        'superadmin': 'مدير النظام'
    };
    return roleNames[role] || role;
}

function getUserById(userId) {
    // This would typically fetch from backend
    // For now, return current user or mock data
    if (currentUser && currentUser.id === userId) {
        return currentUser;
    }
    
    // Mock user data
    return {
        id: userId,
        name: 'أحمد محمد',
        role: 'user',
        governorate: 'القاهرة'
    };
}

// ========================================
// 6. ENHANCED POST SUBMISSION
// ========================================

function submitPostForm() {
    const postData = {
        type: document.getElementById('post-type').value,
        title: document.getElementById('post-title').value,
        content: document.getElementById('post-content').value,
        category: document.getElementById('post-category').value
    };
    
    // Get image if uploaded
    const imageInput = document.getElementById('post-image');
    if (imageInput && imageInput.files[0]) {
        postData.image = imageInput.files[0];
    }
    
    submitPost(postData);
}

// ========================================
// 7. INITIALIZATION FUNCTION
// ========================================

function initializeAllFixes() {
    // Initialize image upload
    initializeImageUpload();
    
    // Initialize category selection
    initializeCategorySelection();
    
    // Initialize theme system
    initializeTheme();
    
    // Add event listeners for new interactive elements
    addEventListeners();
}

function addEventListeners() {
    // Add event listeners for any new interactive elements
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Initializing fixes...');
        
        // Initialize all fixes
        initializeAllFixes();
        
        // Add any additional event listeners here
    });
}

// ========================================
// 8. MOBILE RESPONSIVENESS FIXES
// ========================================

function applyMobileFixes() {
    // Add mobile-specific classes and styles
    const isMobile = window.innerWidth <= 480;
    
    if (isMobile) {
        document.body.classList.add('mobile-view');
        
        // Fix specific mobile issues
        fixMobileLayout();
    }
}

function fixMobileLayout() {
    // Fix specific layout issues for mobile
    const containers = document.querySelectorAll('.rewards-container, .communities-container, .top-volunteers-container');
    
    containers.forEach(container => {
        if (container) {
            container.classList.add('mobile-optimized');
        }
    });
}

// ========================================
// 9. UTILITY FUNCTIONS
// ========================================

function showToast(message, type = 'info') {
    // Enhanced toast function
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = message;
        toast.className = `toast ${type}`;
        toast.style.display = 'block';
        
        setTimeout(() => {
            toast.style.display = 'none';
        }, 3000);
    }
}

function navigateTo(pageId) {
    // Enhanced navigation with mobile fixes
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        
        // Apply mobile fixes for specific pages
        if (pageId === 'rewards-page' || pageId === 'communities-page' || pageId === 'top-volunteers-page') {
            applyMobileFixes();
        }
    }
}

// ========================================
// 10. EXPORT FUNCTIONS
// ========================================

// Make functions available globally
window.redeemReward = redeemReward;
window.removeImage = removeImage;
window.displayUserProfile = displayUserProfile;
window.submitPostForm = submitPostForm;
window.initializeAllFixes = initializeAllFixes;
window.applyMobileFixes = applyMobileFixes;

// Initialize when script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAllFixes);
} else {
    initializeAllFixes();
}
