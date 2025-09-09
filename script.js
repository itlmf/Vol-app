// Global Variables
let currentPage = 'login-page';
let userPoints = 1250;
let userRank = 15;
let isLoggedIn = false;
let currentUser = null;
let authToken = null;

// Seed Users Database (Development Only - Never ship to production)
const SEED_USERS = {
    'Admin': { password: 'Admin55', role: 'superadmin', name: 'مدير النظام', governorate: 'القاهرة', isFirstLogin: false },
    'Ibrahim': { password: 'Hima11', role: 'admin', name: 'إبراهيم أحمد', governorate: 'الإسكندرية', isFirstLogin: false },
    'Hamed': { password: 'Ha11', role: 'admin', name: 'حامد محمد', governorate: 'الجيزة', isFirstLogin: false },
    'Walaa': { password: 'Lol123', role: 'moderator', name: 'ولاء علي', governorate: 'الشرقية', isFirstLogin: false },
    'Odai': { password: '1111', role: 'user', name: 'عدي سالم', governorate: 'القاهرة', isFirstLogin: false }
};

// Role Capability Matrix (Expanded per specifications)
const ROLE_CAPABILITIES = {
    user: {
        // Auth
        loginLogout: true,
        passwordReset: true,
        
        // Profile
        viewEditOwnProfile: true,
        viewOthersProfiles: true,
        addFriends: true,
        
        // Feed
        createPosts: true,
        viewFeeds: true,
        
        // Events
        createPersonalEvents: true,
        registerEvents: true,
        viewEvents: true,
        
        // Rewards & Points
        viewRedeemRewards: true,
        earnPoints: true,
        viewBadges: true,
        
        // Certificates
        generateInstantCertificates: true,
        
        // Groups
        joinLeaveGroups: true,
        
        // QR
        scanQR: true
    },
    moderator: {
        // Auth
        loginLogout: true,
        passwordReset: true,
        
        // Profile
        viewEditOwnProfile: true,
        viewOthersProfiles: true,
        addFriends: true,
        
        // Feed
        createPosts: true,
        viewFeeds: true,
        approveRejectPosts: true,
        deleteHidePosts: true,
        
        // Events
        createPersonalEvents: true,
        registerEvents: true,
        viewEvents: true,
        approveRejectEvents: true,
        viewAttendanceDashboard: true,
        
        // Rewards & Points
        viewRedeemRewards: true,
        earnPoints: true,
        viewBadges: true,
        
        // Certificates
        generateInstantCertificates: true,
        
        // Groups
        joinLeaveGroups: true,
        
        // QR
        scanQR: true,
        
        // Moderation
        viewModerationQueue: true,
        viewContentAnalytics: true
    },
    admin: {
        // Auth
        loginLogout: true,
        passwordReset: true,
        
        // Profile
        viewEditOwnProfile: true,
        viewOthersProfiles: true,
        addFriends: true,
        
        // Feed
        createPosts: true,
        viewFeeds: true,
        approveRejectPosts: true,
        deleteHidePosts: true,
        
        // Events
        createPersonalEvents: true,
        registerEvents: true,
        viewEvents: true,
        approveRejectEvents: true,
        viewAttendanceDashboard: true,
        
        // Rewards & Points
        viewRedeemRewards: true,
        earnPoints: true,
        viewBadges: true,
        manageRewardsCatalog: true,
        configurePointsRules: true,
        defineBadges: true,
        
        // Certificates
        generateInstantCertificates: true,
        approveStampedCertificates: true,
        manageCertificateTemplates: true,
        
        // Groups
        joinLeaveGroups: true,
        createManageGroups: true,
        
        // QR
        scanQR: true,
        
        // Moderation
        viewModerationQueue: true,
        viewOperationsAnalytics: true,
        
        // User Management
        viewUserManagement: true
    },
    superadmin: {
        // Auth
        loginLogout: true,
        passwordReset: true,
        
        // Profile
        viewEditOwnProfile: true,
        viewOthersProfiles: true,
        addFriends: true,
        
        // Feed
        createPosts: true,
        viewFeeds: true,
        approveRejectPosts: true,
        deleteHidePosts: true,
        
        // Events
        createPersonalEvents: true,
        registerEvents: true,
        viewEvents: true,
        approveRejectEvents: true,
        viewAttendanceDashboard: true,
        
        // Rewards & Points
        viewRedeemRewards: true,
        earnPoints: true,
        viewBadges: true,
        manageRewardsCatalog: true,
        configurePointsRules: true,
        defineBadges: true,
        
        // Certificates
        generateInstantCertificates: true,
        approveStampedCertificates: true,
        manageCertificateTemplates: true,
        
        // Groups
        joinLeaveGroups: true,
        createManageGroups: true,
        
        // QR
        scanQR: true,
        
        // Moderation
        viewModerationQueue: true,
        viewAllAnalytics: true,
        
        // User Management
        viewUserManagement: true,
        assignRoles: true,
        suspendRestoreUsers: true,
        
        // System
        systemSettings: true,
        legacyToggle: true
    }
};

// Page Navigation System
function navigateTo(pageId) {
    console.log('Navigating to:', pageId); // Debug log
    
    const currentPageElement = document.querySelector('.page.active');
    const targetPageElement = document.getElementById(pageId);
    
    console.log('Current page element:', currentPageElement); // Debug log
    console.log('Target page element:', targetPageElement); // Debug log
    
    if (!targetPageElement) {
        console.error('Target page not found:', pageId);
        return;
    }
    
    if (currentPageElement === targetPageElement) {
        console.log('Already on target page');
        return;
    }
    
    // Add slide out animation to current page
    if (currentPageElement) {
        currentPageElement.classList.add('slide-out-left');
    }
    
    // After animation completes, switch pages
    setTimeout(() => {
        if (currentPageElement) {
            currentPageElement.classList.remove('active', 'slide-out-left');
        }
        targetPageElement.classList.add('active', 'slide-in-right');
        currentPage = pageId;
        
        // Update bottom navigation
        updateBottomNavigation(pageId);
        
        // Remove slide in animation after completion
        setTimeout(() => {
            targetPageElement.classList.remove('slide-in-right');
        }, 300);
    }, 150);
}

// Update Bottom Navigation Active State
function updateBottomNavigation(pageId) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
        item.removeAttribute('aria-current');
    });
    
    // Map page IDs to navigation items (updated for new structure)
    const pageNavMap = {
        'home-page': 0,
        'events-page': 1,
        'rewards-page': 2,
        'communities-page': 3,
        'settings-page': 4
    };
    
    const navIndex = pageNavMap[pageId];
    if (navIndex !== undefined && navItems[navIndex]) {
        navItems[navIndex].classList.add('active');
        navItems[navIndex].setAttribute('aria-current', 'page');
    }
    
    // Update page title for better UX
    const pageTitles = {
        'home-page': 'الرئيسية',
        'events-page': 'الأحداث',
        'rewards-page': 'المكافآت',
        'communities-page': 'المجتمع',
        'settings-page': 'الإعدادات'
    };
    
    const title = pageTitles[pageId];
    if (title) {
        document.title = `تطبيق المتطوعين - ${title}`;
    }
    
        // Initialize rewards page if navigating to it
    if (pageId === 'rewards-page') {
        setTimeout(() => {
            initializeRewardsPage();
        }, 100);
    }
    
    // Initialize home page features
    if (pageId === 'home-page') {
        setTimeout(() => {
            initializeHomePage();
        }, 100);
    }
}

// Authentication Functions
async function authenticateUser(username, password) {
    try {
        const result = await backend.login(username, password);
        return result;
    } catch (error) {
        throw new Error(error.message);
    }
}

async function login() {
    const username = document.querySelector('#login-username').value;
    const password = document.querySelector('#login-password').value;
    
    if (!username || !password) {
        showToast('يرجى إدخال اسم المستخدم وكلمة المرور', 'error');
        return;
    }
    
    try {
        const result = await authenticateUser(username, password);
        currentUser = result.user;
        currentUserRole = result.user.role;
        authToken = result.token;
        isLoggedIn = true;
        
        // Update UI with user info
        updateUserInterface();
        
        // Navigate to home
        navigateTo('home-page');
        showToast(`مرحباً ${result.user.name}!`, 'success');
        
        // Force password change on first login (production feature)
        if (result.user.isFirstLogin) {
            showToast('يرجى تغيير كلمة المرور في أول تسجيل دخول', 'warning');
        }
    } catch (error) {
        showToast(error.message, 'error');
    }
}

function showRegistrationSuccess() {
    showToast('تم إرسال طلب التسجيل للمسئول. سيتم إشعارك عند الموافقة.', 'success');
    setTimeout(() => {
        navigateTo('login-page');
    }, 2000);
}

function logout() {
    if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
        isLoggedIn = false;
        currentUser = null;
        currentUserRole = 'user';
        navigateTo('login-page');
        showToast('تم تسجيل الخروج بنجاح', 'success');
    }
}

function updateUserInterface() {
    if (!currentUser) return;
    
    // Update user info in header
    const userElements = document.querySelectorAll('.user-name, .user-details h3');
    userElements.forEach(el => {
        if (el) el.textContent = currentUser.name;
    });
    
    // Update role display
    const roleElements = document.querySelectorAll('.user-role, .user-rank');
    roleElements.forEach(el => {
        if (el) {
            const roleNames = {
                'user': 'متطوع',
                'moderator': 'مشرف',
                'admin': 'مدير',
                'superadmin': 'مدير النظام'
            };
            el.textContent = roleNames[currentUser.role] || 'متطوع';
        }
    });
    
    // Update governorate
    const govElements = document.querySelectorAll('.user-governorate');
    govElements.forEach(el => {
        if (el) el.textContent = currentUser.governorate;
    });
}

// Profile Functions
function switchTab(tabName) {
    // Remove active class from all tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.add('hidden'));
    
    // Activate selected tab
    const activeButton = document.querySelector(`[onclick="switchTab('${tabName}')"]`);
    const activeContent = document.getElementById(`${tabName}-tab`);
    
    if (activeButton && activeContent) {
        activeButton.classList.add('active');
        activeContent.classList.remove('hidden');
    }
}

// Events Functions
function registerEvent(button) {
    const eventCard = button.closest('.event-card');
    const eventStatus = eventCard.querySelector('.event-status');
    const eventActions = eventCard.querySelector('.event-actions');
    
    // Update status
    eventStatus.innerHTML = '<i class="fas fa-check-circle"></i><span>مسجل</span>';
    eventStatus.className = 'event-status registered';
    
    // Update button
    eventActions.innerHTML = `
        <button class="btn-danger" onclick="cancelRegistration(this)">إلغاء التسجيل</button>
        <button class="btn-primary" onclick="openQRScanner()">
            <i class="fas fa-qrcode"></i>
        </button>
    `;
    
    showToast('تم التسجيل في الفعالية بنجاح!', 'success');
    
    // Add animation
    eventCard.classList.add('fade-in');
    setTimeout(() => eventCard.classList.remove('fade-in'), 300);
}

function cancelRegistration(button) {
    if (confirm('هل أنت متأكد من إلغاء التسجيل؟')) {
        const eventCard = button.closest('.event-card');
        const eventStatus = eventCard.querySelector('.event-status');
        const eventActions = eventCard.querySelector('.event-actions');
        
        // Update status
        eventStatus.innerHTML = '<i class="fas fa-calendar-plus"></i><span>متاح للتسجيل</span>';
        eventStatus.className = 'event-status available';
        
        // Update button
        eventActions.innerHTML = '<button class="btn-primary" onclick="registerEvent(this)">تسجيل</button>';
        
        showToast('تم إلغاء التسجيل', 'warning');
        
        // Add animation
        eventCard.classList.add('fade-in');
        setTimeout(() => eventCard.classList.remove('fade-in'), 300);
    }
}

// QR Scanner Functions
function showQRScanner() {
    openModal('qr-modal');
    // Simulate QR scanning
    setTimeout(() => {
        closeModal('qr-modal');
        showToast('تم تسجيل الحضور بنجاح! +50 نقطة', 'success');
        updateUserPoints(50);
    }, 3000);
}

function openQRScanner() {
    showQRScanner();
}

// Business Rules & Points System
const POINTS_RULES = {
    // Event base points calculation
    defaultPointsPerHour: 10,
    helpCreditPoints: 10,
    helpCreditLimit: 2,
    helpCreditWindow: 20, // days
    
    // Rank thresholds
    ranks: {
        bronze: { min: 0, max: 199, name: 'برونزي' },
        silver: { min: 200, max: 599, name: 'فضي' },
        gold: { min: 600, max: 1499, name: 'ذهبي' },
        platinum: { min: 1500, max: Infinity, name: 'بلاتيني' }
    }
};

// Points calculation functions
function calculateEventPoints(attendedHours, pointsPerHour = POINTS_RULES.defaultPointsPerHour) {
    return Math.round(attendedHours * pointsPerHour);
}

function calculateAttendedHours(checkinTime, checkoutTime) {
    if (!checkinTime || !checkoutTime) return 0;
    
    const checkin = new Date(checkinTime);
    const checkout = new Date(checkoutTime);
    const hours = (checkout - checkin) / (1000 * 60 * 60);
    
    // Round to nearest 15 minutes (0.25 hours)
    return Math.round(hours * 4) / 4;
}

function canEarnHelpCredit() {
    // Check if user can earn help credit (max 2 per 20 days)
    const helpCredits = getHelpCreditsInWindow(POINTS_RULES.helpCreditWindow);
    return helpCredits < POINTS_RULES.helpCreditLimit;
}

function getHelpCreditsInWindow(days) {
    // This would query the points_ledger table in production
    // For now, return 0 (no help credits earned yet)
    return 0;
}

function getCurrentRank(points) {
    for (const [rank, config] of Object.entries(POINTS_RULES.ranks)) {
        if (points >= config.min && points <= config.max) {
            return { rank, name: config.name, ...config };
        }
    }
    return { rank: 'bronze', name: 'برونزي', ...POINTS_RULES.ranks.bronze };
}

// Points and Ranking System
function updateUserPoints(points, reason = 'hours', refType = null, refId = null) {
    userPoints += points;
    
    // Log to points ledger (in production, this would be a database entry)
    logPointsLedgerEntry(points, reason, refType, refId);
    
    // Update points display in home page
    const pointsElements = document.querySelectorAll('.stat-number');
    if (pointsElements[0]) {
        pointsElements[0].textContent = userPoints.toLocaleString();
    }
    
    // Update points in profile
    const profileStats = document.querySelectorAll('.profile-stat .stat-number');
    if (profileStats[0]) {
        profileStats[0].textContent = userPoints.toLocaleString();
    }
    
    // Update points in journey
    const journeyPoints = document.querySelectorAll('.points-badge span');
    journeyPoints.forEach(element => {
        element.textContent = userPoints.toLocaleString();
    });
    
    // Check for rank upgrades
    checkRankUpgrade();
}

function logPointsLedgerEntry(delta, reason, refType, refId) {
    const entry = {
        id: Date.now(),
        userId: currentUser?.username || 'unknown',
        delta: delta,
        reason: reason,
        refType: refType,
        refId: refId,
        createdAt: new Date()
    };
    
    // In production, this would be saved to the points_ledger table
    if (!window.pointsLedger) window.pointsLedger = [];
    window.pointsLedger.push(entry);
}

function checkRankUpgrade() {
    const currentRank = getCurrentRank(userPoints);
    const rankElements = document.querySelectorAll('.user-rank, .rank-badge');
    
    rankElements.forEach(element => {
        element.textContent = currentRank.name;
    });
    
    // Show rank upgrade notification if applicable
    if (currentRank.rank !== 'bronze') {
        showToast(`مبروك! وصلت إلى رتبة ${currentRank.name}`, 'success');
    }
}

function checkRankUpdate() {
    const oldRank = userRank;
    // Simple ranking logic (in real app, this would come from server)
    if (userPoints >= 1500 && userRank > 10) {
        userRank = 10;
    } else if (userPoints >= 1300 && userRank > 12) {
        userRank = 12;
    }
    
    if (oldRank !== userRank) {
        showToast(`تهانينا! ترتيبك الجديد: #${userRank}`, 'success');
        
        // Update rank displays
        const rankElements = document.querySelectorAll('.stat-number');
        if (rankElements[1]) {
            rankElements[1].textContent = `#${userRank}`;
        }
        
        const profileRankElements = document.querySelectorAll('.profile-stat .stat-number');
        if (profileRankElements[1]) {
            profileRankElements[1].textContent = `#${userRank}`;
        }
    }
}

// Entertainment Functions
function playGame(gameType) {
    const games = {
        'puzzle': { name: 'لعبة الألغاز', points: 30 },
        'quiz': { name: 'اختبار المعلومات', points: 40 },
        'memory': { name: 'لعبة الذاكرة', points: 25 }
    };
    
    const game = games[gameType];
    if (game) {
        showToast(`بدء ${game.name}...`, 'success');
        
        // Simulate game completion
        setTimeout(() => {
            showToast(`تهانينا! أكملت ${game.name} وحصلت على ${game.points} نقطة`, 'success');
            updateUserPoints(game.points);
            updateGameProgress(gameType);
        }, 2000);
    }
}

function updateGameProgress(gameType) {
    const activityCards = document.querySelectorAll('.activity-card');
    activityCards.forEach(card => {
        const button = card.querySelector('button');
        if (button && button.getAttribute('onclick').includes(gameType)) {
            const progressBar = card.querySelector('.progress-fill');
            const progressText = card.querySelector('.progress-text');
            
            if (progressBar && progressText) {
                const currentWidth = parseInt(progressBar.style.width) || 0;
                const newWidth = Math.min(currentWidth + 20, 100);
                
                progressBar.style.width = `${newWidth}%`;
                progressText.textContent = `${newWidth}% مكتمل - ${Math.floor(newWidth / 20) * 10 + 15} نقطة`;
                
                if (newWidth >= 100) {
                    button.textContent = 'مكتمل';
                    button.disabled = true;
                    button.style.opacity = '0.6';
                }
            }
        }
    });
}

// Certificate Templates System
const CERTIFICATE_TEMPLATES = [
    {
        id: 1,
        title: 'To Whom It May Concern',
        targetType: 'generic',
        targetName: 'To Whom It May Concern',
        layoutMeta: {
            header: 'شهادة مشاركة',
            subtitle: 'Certificate of Participation',
            logo: 'lifemakers-logo.png'
        },
        active: true
    },
    {
        id: 2,
        title: 'Cairo University',
        targetType: 'university',
        targetName: 'Cairo University',
        layoutMeta: {
            header: 'شهادة مشاركة',
            subtitle: 'Certificate of Participation',
            logo: 'lifemakers-logo.png',
            universityLogo: 'cairo-university-logo.png'
        },
        active: true
    },
    {
        id: 3,
        title: 'Ain Shams University',
        targetType: 'university',
        targetName: 'Ain Shams University',
        layoutMeta: {
            header: 'شهادة مشاركة',
            subtitle: 'Certificate of Participation',
            logo: 'lifemakers-logo.png',
            universityLogo: 'ain-shams-logo.png'
        },
        active: true
    },
    {
        id: 4,
        title: 'Helwan University',
        targetType: 'university',
        targetName: 'Helwan University',
        layoutMeta: {
            header: 'شهادة مشاركة',
            subtitle: 'Certificate of Participation',
            logo: 'lifemakers-logo.png',
            universityLogo: 'helwan-logo.png'
        },
        active: true
    }
];

// Certificate Functions
function generateCertificate(templateId, userData) {
    const template = CERTIFICATE_TEMPLATES.find(t => t.id === templateId);
    if (!template) {
        showToast('قالب الشهادة غير موجود', 'error');
        return;
    }
    
    // Generate certificate data
    const certificate = {
        id: Date.now(),
        userId: currentUser.username,
        templateId: templateId,
        nameOnCert: userData.name || currentUser.name,
        targetName: template.targetName,
        issueDate: new Date(),
        hours: userData.hours || 0,
        eventIds: userData.eventIds || [],
        status: 'generated',
        verifierQR: generateQRToken('certificate', Date.now())
    };
    
    // Save certificate (in production, this would be saved to database)
    if (!window.certificatesDatabase) window.certificatesDatabase = [];
    window.certificatesDatabase.push(certificate);
    
    showToast('تم إنشاء الشهادة بنجاح!', 'success');
    return certificate;
}

function generateQRToken(ownerType, ownerId, scope = 'profile-photo') {
    const token = {
        id: Date.now(),
        ownerType: ownerType,
        ownerId: ownerId,
        token: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        scope: scope,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    };
    
    // In production, this would be saved to qr_tokens table
    if (!window.qrTokensDatabase) window.qrTokensDatabase = [];
    window.qrTokensDatabase.push(token);
    
    return token.token;
}

function downloadCertificate(certificateId) {
    showToast('جاري تحميل الشهادة...', 'success');
    
    // Simulate download
    setTimeout(() => {
        showToast('تم تحميل الشهادة بنجاح', 'success');
    }, 1500);
}

function shareCertificate(certificateId) {
    if (navigator.share) {
        navigator.share({
            title: 'شهادتي من تطبيق المتطوعين',
            text: 'انظر إلى شهادتي الجديدة!',
            url: window.location.href
        });
    } else {
        // Fallback for browsers that don't support Web Share API
        const shareText = 'شاهد شهادتي الجديدة من تطبيق المتطوعين!';
        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareText);
            showToast('تم نسخ رابط المشاركة', 'success');
        } else {
            showToast('تم إنشاء رابط المشاركة', 'success');
        }
    }
}

// LMS Functions
function startCourse(courseId) {
    showToast('بدء الكورس...', 'success');
    
    // Simulate course start
    setTimeout(() => {
        showToast('مرحباً بك في الكورس!', 'success');
        updateCourseProgress(courseId, 10);
    }, 1000);
}

function continueCourse(courseId) {
    showToast('متابعة الكورس...', 'success');
    
    // Simulate course progress
    setTimeout(() => {
        updateCourseProgress(courseId, 15);
    }, 1000);
}

function updateCourseProgress(courseId, progressIncrease) {
    const courseCards = document.querySelectorAll('.course-card');
    courseCards.forEach(card => {
        const button = card.querySelector('button');
        if (button && button.getAttribute('onclick').includes(courseId)) {
            const progressBar = card.querySelector('.progress-fill');
            const progressText = card.querySelector('.progress-text');
            
            if (progressBar && progressText) {
                const currentWidth = parseInt(progressBar.style.width) || 0;
                const newWidth = Math.min(currentWidth + progressIncrease, 100);
                
                progressBar.style.width = `${newWidth}%`;
                
                if (newWidth >= 100) {
                    progressText.textContent = 'مكتمل - تم الحصول على الشهادة';
                    button.textContent = 'عرض الشهادة';
                    button.className = 'btn-secondary';
                    button.setAttribute('onclick', `viewCertificate('${courseId}')`);
                } else {
                    const totalLessons = 4; // Example
                    const completedLessons = Math.floor((newWidth / 100) * totalLessons);
                    progressText.textContent = `${newWidth}% مكتمل (${completedLessons} من ${totalLessons} دروس)`;
                }
            }
        }
    });
}

function viewCertificate(courseId) {
    navigateTo('certificates-page');
    showToast('تم عرض صفحة الشهادات', 'success');
}

// Top Volunteers Functions
function switchLeaderboard(period) {
    // Remove active class from all tab buttons
    const tabButtons = document.querySelectorAll('.leaderboard-tabs .tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    
    // Activate selected tab
    const activeButton = document.querySelector(`[onclick="switchLeaderboard('${period}')"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
    
    // Show loading toast
    showToast(`تحديث قائمة المتطوعين - ${getLeaderboardPeriodName(period)}`, 'success');
    
    // In a real app, this would fetch data from server
    setTimeout(() => {
        updateLeaderboardData(period);
    }, 500);
}

function getLeaderboardPeriodName(period) {
    const periodNames = {
        'daily': 'يومي',
        'weekly': 'أسبوعي',
        'monthly': 'شهري',
        'alltime': 'كل الأوقات'
    };
    return periodNames[period] || 'يومي';
}

function updateLeaderboardData(period) {
    // Simulate different data for different periods
    const leaderboardData = {
        'daily': {
            podium: [
                { name: 'أحمد سالم', points: 120, avatar: 'A', color: '#28a745' },
                { name: 'فاطمة أحمد', points: 95, avatar: 'F', color: '#ff6b35' },
                { name: 'محمد علي', points: 80, avatar: 'M', color: '#007bff' }
            ]
        },
        'weekly': {
            podium: [
                { name: 'سارة حسن', points: 850, avatar: 'S', color: '#28a745' },
                { name: 'خالد محمود', points: 720, avatar: 'K', color: '#ff6b35' },
                { name: 'نور الدين', points: 680, avatar: 'N', color: '#007bff' }
            ]
        },
        'monthly': {
            podium: [
                { name: 'محمد علي', points: 2800, avatar: 'M', color: '#28a745' },
                { name: 'سارة أحمد', points: 2650, avatar: 'S', color: '#ff6b35' },
                { name: 'أحمد محمد', points: 2400, avatar: 'A', color: '#007bff' }
            ]
        },
        'alltime': {
            podium: [
                { name: 'محمد علي', points: 12500, avatar: 'M', color: '#28a745' },
                { name: 'سارة أحمد', points: 11800, avatar: 'S', color: '#ff6b35' },
                { name: 'خالد محمود', points: 10200, avatar: 'K', color: '#007bff' }
            ]
        }
    };
    
    // Update podium display
    const data = leaderboardData[period] || leaderboardData['daily'];
    updatePodiumDisplay(data.podium);
    
    showToast('تم تحديث البيانات بنجاح', 'success');
}

function updatePodiumDisplay(podiumData) {
    const podiumPlaces = document.querySelectorAll('.podium-place');
    
    podiumData.forEach((volunteer, index) => {
        const place = podiumPlaces[index];
        if (place) {
            const nameElement = place.querySelector('h4');
            const pointsElement = place.querySelector('p');
            const avatarImg = place.querySelector('.volunteer-avatar img');
            
            if (nameElement) nameElement.textContent = volunteer.name;
            if (pointsElement) pointsElement.textContent = `${volunteer.points.toLocaleString()} نقطة`;
            if (avatarImg) {
                avatarImg.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='${encodeURIComponent(volunteer.color)}'/%3E%3Ctext x='50' y='55' text-anchor='middle' fill='white' font-size='30' font-family='Arial'%3E${volunteer.avatar}%3C/text%3E%3C/svg%3E`;
            }
        }
    });
}

function loadMoreVolunteers() {
    showToast('تحميل المزيد من المتطوعين...', 'success');
    
    // Simulate loading more volunteers
    setTimeout(() => {
        const leaderboardList = document.querySelector('.leaderboard-list');
        const moreButton = document.querySelector('.more-volunteers');
        
        // Add new volunteer items (simulated)
        const newVolunteers = [
            { rank: 16, name: 'ليلى حسام', points: 410, avatar: 'L', color: '#e91e63' },
            { rank: 17, name: 'يوسف كامل', points: 395, avatar: 'Y', color: '#9c27b0' },
            { rank: 18, name: 'دينا صلاح', points: 380, avatar: 'D', color: '#673ab7' }
        ];
        
        newVolunteers.forEach(volunteer => {
            const volunteerItem = document.createElement('div');
            volunteerItem.className = 'volunteer-rank-item';
            volunteerItem.innerHTML = `
                <div class="rank-number">${volunteer.rank}</div>
                <div class="volunteer-info">
                    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='${encodeURIComponent(volunteer.color)}'/%3E%3Ctext x='50' y='55' text-anchor='middle' fill='white' font-size='30' font-family='Arial'%3E${volunteer.avatar}%3C/text%3E%3C/svg%3E" alt="${volunteer.name}">
                    <div class="volunteer-details">
                        <h5>${volunteer.name}</h5>
                        <span>${volunteer.points} نقطة</span>
                    </div>
                </div>
                <div class="volunteer-badges">
                    <i class="fas fa-star" title="متطوع جديد"></i>
                </div>
            `;
            
            leaderboardList.insertBefore(volunteerItem, moreButton);
        });
        
        showToast('تم تحميل 3 متطوعين إضافيين', 'success');
    }, 1000);
}

// Settings Functions
function changeMembership() {
    showToast('جاري فتح نموذج تحديث العضوية...', 'success');
    // In a real app, this would open a form or navigate to a membership page
}

function registerFieldwork() {
    showToast('جاري فتح نموذج تسجيل النزول الميداني...', 'success');
    // In a real app, this would open a form for fieldwork registration
}

function changeLocation() {
    const newLocation = prompt('اختر المحافظة الجديدة:', 'القاهرة');
    if (newLocation) {
        showToast(`تم تغيير المحافظة إلى: ${newLocation}`, 'success');
        // Update location display
        const locationSetting = document.querySelector('[onclick="changeLocation()"]').closest('.setting-item');
        const locationText = locationSetting.querySelector('p');
        if (locationText) {
            locationText.textContent = `المحافظة الحالية: ${newLocation}`;
        }
    }
}

function changeGroup() {
    const newGroup = prompt('اختر المجموعة الجديدة:', 'المجموعة الأولى');
    if (newGroup) {
        showToast(`تم تغيير المجموعة إلى: ${newGroup}`, 'success');
        // Update group display
        const groupSetting = document.querySelector('[onclick="changeGroup()"]').closest('.setting-item');
        const groupText = groupSetting.querySelector('p');
        if (groupText) {
            groupText.textContent = `المجموعة الحالية: ${newGroup}`;
        }
    }
}

function contactManagement() {
    const message = prompt('اكتب رسالتك لمجلس الإدارة:');
    if (message && message.trim()) {
        showToast('تم إرسال الرسالة بنجاح', 'success');
        // In a real app, this would send the message to the server
    }
}

// News Functions
function openNewsDetails(newsId) {
    // In a real app, this would open a detailed news page
    showToast('فتح تفاصيل الخبر...', 'success');
}

// Modal Functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

// Toast Notification System (Consolidated, ARIA-friendly)
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    // Update ARIA attributes for assistive tech
    toast.setAttribute('aria-live', (type === 'error' || type === 'warning') ? 'assertive' : 'polite');
    toast.setAttribute('aria-atomic', 'true');
    
    // Update content and styling
    toast.textContent = message;
    toast.className = `toast ${type}`;
    
    // Trigger reflow then show for CSS transition
    void toast.offsetWidth;
    toast.classList.add('show');
    
    // Debounce hide timeout
    if (window.__toastTimeoutId) {
        clearTimeout(window.__toastTimeoutId);
    }
    window.__toastTimeoutId = setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Filter and Search Functions
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Apply filter
            const filterType = this.dataset.filter || 'all';
            filterEventsByCategory(filterType);
            
            const filterName = this.textContent;
            showToast(`تم تطبيق فلتر: ${filterName}`, 'success');
        });
    });
}

function filterEvents() {
    const searchInput = document.getElementById('events-search');
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const activeFilter = document.querySelector('.filter-btn.active');
    const category = activeFilter ? (activeFilter.dataset.filter || 'all') : 'all';
    
    filterEventsBySearchAndCategory(searchTerm, category);
}

function filterEventsByCategory(category) {
    const eventCards = document.querySelectorAll('.event-card');
    let visibleCount = 0;
    
    eventCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
            card.classList.add('fade-in');
            visibleCount++;
            setTimeout(() => card.classList.remove('fade-in'), 300);
        } else {
            card.style.display = 'none';
        }
    });
    
    updateEventsCountDisplay(visibleCount, category);
}

function filterEventsBySearchAndCategory(searchTerm, category) {
    const eventCards = document.querySelectorAll('.event-card');
    let visibleCount = 0;
    
    eventCards.forEach(card => {
        const title = card.dataset.title ? card.dataset.title.toLowerCase() : '';
        const location = card.dataset.location ? card.dataset.location.toLowerCase() : '';
        const cardCategory = card.dataset.category || '';
        
        const matchesSearch = !searchTerm || title.includes(searchTerm) || location.includes(searchTerm);
        const matchesCategory = category === 'all' || cardCategory === category;
        
        if (matchesSearch && matchesCategory) {
            card.style.display = 'block';
            card.classList.add('fade-in');
            visibleCount++;
            setTimeout(() => card.classList.remove('fade-in'), 300);
        } else {
            card.style.display = 'none';
        }
    });
    
    updateEventsCountDisplay(visibleCount, category, searchTerm);
}

function updateEventsCountDisplay(count, category, searchTerm) {
    // Remove existing count display
    const existingCount = document.querySelector('.events-count');
    if (existingCount) {
        existingCount.remove();
    }
    
    // Add count display
    const eventsContainer = document.querySelector('.events-container');
    if (eventsContainer && count >= 0) {
        const countElement = document.createElement('div');
        countElement.className = 'events-count';
        
        let message = `${count} فعالية`;
        if (searchTerm) {
            message += ` تحتوي على "${searchTerm}"`;
        }
        if (category !== 'all') {
            const categoryNames = {
                'educational': 'تعليمية',
                'environmental': 'بيئية',
                'social': 'اجتماعية',
                'health': 'صحية'
            };
            message += ` في فئة ${categoryNames[category] || category}`;
        }
        
        countElement.innerHTML = `
            <div class="count-display">
                <i class="fas fa-info-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        eventsContainer.insertBefore(countElement, eventsContainer.firstChild);
        
        if (count === 0) {
            countElement.innerHTML += `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h4>لا توجد فعاليات</h4>
                    <p>جرب تغيير كلمات البحث أو الفلتر</p>
                    <button class="btn-outline" onclick="clearFilters()">مسح الفلاتر</button>
                </div>
            `;
        }
    }
}

function clearFilters() {
    // Clear search
    const searchInput = document.getElementById('events-search');
    if (searchInput) {
        searchInput.value = '';
    }
    
    // Reset filter to "الكل"
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => btn.classList.remove('active'));
    
    const allButton = document.querySelector('.filter-btn[data-filter="all"]');
    if (allButton) {
        allButton.classList.add('active');
    }
    
    // Show all events
    filterEventsBySearchAndCategory('', 'all');
    
    showToast('تم مسح جميع الفلاتر', 'success');
}

// Initialize App
function initializeApp() {
    // Set up event listeners
    setupEventListeners();
    
    // Initialize filters
    initializeFilters();
    
    // Update time in status bar
    updateStatusBarTime();
    setInterval(updateStatusBarTime, 60000); // Update every minute
    
    // Initialize notifications
    initializeNotifications();
    
    // Set up keyboard navigation
    setupKeyboardNavigation();
}

function setupEventListeners() {
    // Close modals when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target.id);
        }
    });
    
    // Handle escape key for modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal.show');
            if (openModal) {
                closeModal(openModal.id);
            }
        }
    });
    
    // Handle form submissions
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // Handle form submission
        });
    });
    
    // Handle input focus animations
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
}

function updateStatusBarTime() {
    const timeElement = document.querySelector('.time');
    if (timeElement) {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        timeElement.textContent = `${hours}:${minutes}`;
    }
}

function initializeNotifications() {
    const notificationItems = document.querySelectorAll('.notification-item');
    notificationItems.forEach(item => {
        item.addEventListener('click', () => handleNotificationClick(item));
    });
    
    // Add click outside listener for notification dropdown
    document.addEventListener('click', function(e) {
        const dropdown = document.getElementById('notification-dropdown');
        const notificationIcon = document.querySelector('.notification-icon');
        
        if (dropdown && notificationIcon && !notificationIcon.contains(e.target)) {
            dropdown.classList.remove('show');
        }
    });
    
    // Initialize enhanced interactions
    enhanceTabInteractions();
    enhancePreviewCardInteractions();
    enhanceAvatarInteractions();
    
    // Simulate receiving notifications
    setTimeout(() => {
        showNotification('مرحباً بك في تطبيق المتطوعين!');
    }, 2000);
    
    // Simulate periodic notifications
    setInterval(() => {
        const notifications = [
            'لديك فعالية جديدة غداً',
            'تم إضافة كورس تدريبي جديد',
            'تذكير: تحديث العضوية',
            'تهانينا! حصلت على شارة جديدة'
        ];
        
        const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
        showNotification(randomNotification);
    }, 30000); // Every 30 seconds
}

function showNotification(message) {
    // Update notification badge
    const badge = document.querySelector('.notification-badge');
    if (badge) {
        const currentCount = parseInt(badge.textContent) || 0;
        badge.textContent = currentCount + 1;
    }
    
    // Show toast notification
    showToast(message, 'success');
}

function setupKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        // Handle arrow key navigation for bottom nav
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            const activeNav = document.querySelector('.nav-item.active');
            if (activeNav) {
                const navItems = Array.from(document.querySelectorAll('.nav-item'));
                const currentIndex = navItems.indexOf(activeNav);
                let newIndex;
                
                if (e.key === 'ArrowLeft') {
                    newIndex = currentIndex > 0 ? currentIndex - 1 : navItems.length - 1;
                } else {
                    newIndex = currentIndex < navItems.length - 1 ? currentIndex + 1 : 0;
                }
                
                navItems[newIndex].click();
            }
        }
    });
}

// Utility Functions
function formatDate(date) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        weekday: 'long'
    };
    return date.toLocaleDateString('ar-EG', options);
}

function formatTime(date) {
    const options = { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true
    };
    return date.toLocaleTimeString('ar-EG', options);
}

function generateQRCode(data) {
    // In a real app, this would generate an actual QR code
    return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="white"/><text x="50" y="50" text-anchor="middle" fill="black" font-size="8">QR: ${data}</text></svg>`;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone);
}

// Performance Optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Local Storage Functions
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.error('Failed to save to localStorage:', e);
    }
}

function loadFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.error('Failed to load from localStorage:', e);
        return null;
    }
}

// Data Management
function loadUserData() {
    const userData = loadFromLocalStorage('volunteerUserData');
    if (userData) {
        userPoints = userData.points || 1250;
        userRank = userData.rank || 15;
        isLoggedIn = userData.isLoggedIn || false;
    }
}

function saveUserData() {
    const userData = {
        points: userPoints,
        rank: userRank,
        isLoggedIn: isLoggedIn,
        lastLogin: new Date().toISOString()
    };
    saveToLocalStorage('volunteerUserData', userData);
}

// App Lifecycle
function onAppStart() {
    loadUserData();
    initializeApp();
    
    // Auto-save user data periodically
    setInterval(saveUserData, 30000); // Every 30 seconds
}

function onAppClose() {
    saveUserData();
}

// Service Worker Registration (for PWA functionality)
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker registered successfully');
            })
            .catch(error => {
                console.log('Service Worker registration failed');
            });
    }
}

// Offline Detection
function setupOfflineDetection() {
    window.addEventListener('online', function() {
        showToast('تم استعادة الاتصال بالإنترنت', 'success');
    });
    
    window.addEventListener('offline', function() {
        showToast('تم فقدان الاتصال بالإنترنت', 'warning');
    });
}

// Error Handling
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    showToast('حدث خطأ غير متوقع', 'error');
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    showToast('حدث خطأ في النظام', 'error');
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    onAppStart();
    setupOfflineDetection();
    registerServiceWorker();
    initializeNotifications();
});

// Handle page unload
window.addEventListener('beforeunload', function() {
    onAppClose();
});

// Handle visibility change (app backgrounding)
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        saveUserData();
    } else {
        loadUserData();
        // Refresh notifications when app becomes visible
        updateStatusBarTime();
    }
});

// Touch and Gesture Support
let startX, startY;

document.addEventListener('touchstart', function(e) {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
});

document.addEventListener('touchmove', function(e) {
    if (!startX || !startY) return;
    
    const diffX = startX - e.touches[0].clientX;
    const diffY = startY - e.touches[0].clientY;
    
    // Prevent default scrolling for horizontal swipes
    if (Math.abs(diffX) > Math.abs(diffY)) {
        e.preventDefault();
    }
});

document.addEventListener('touchend', function(e) {
    if (!startX || !startY) return;
    
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const diffX = startX - endX;
    const diffY = startY - endY;
    
    // Only handle horizontal swipes
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        // Swipe left (next page) or right (previous page)
        const currentPageElement = document.querySelector('.page.active');
        const pageId = currentPageElement.id;
        
        // Simple page navigation based on swipe
        const pages = ['home-page', 'events-page', 'entertainment-page', 'lms-page', 'settings-page'];
        const currentIndex = pages.indexOf(pageId);
        
        if (diffX > 0 && currentIndex < pages.length - 1) {
            // Swipe left - next page
            navigateTo(pages[currentIndex + 1]);
        } else if (diffX < 0 && currentIndex > 0) {
            // Swipe right - previous page
            navigateTo(pages[currentIndex - 1]);
        }
    }
    
    startX = null;
    startY = null;
});

// Haptic Feedback (if supported)
function hapticFeedback(type = 'light') {
    if (navigator.vibrate) {
        const patterns = {
            light: 10,
            medium: 50,
            heavy: 100
        };
        navigator.vibrate(patterns[type] || patterns.light);
    }
}

// Add haptic feedback to buttons
document.addEventListener('click', function(e) {
    if (e.target.matches('button, .nav-item, .btn-primary, .btn-secondary')) {
        hapticFeedback('light');
    }
});

// Network Status Monitoring
function checkNetworkStatus() {
    return navigator.onLine;
}

function handleNetworkChange() {
    const isOnline = checkNetworkStatus();
    const statusIndicator = document.querySelector('.network-status');
    
    if (statusIndicator) {
        statusIndicator.textContent = isOnline ? 'متصل' : 'غير متصل';
        statusIndicator.className = `network-status ${isOnline ? 'online' : 'offline'}`;
    }
}

// Battery Status (if supported)
function initializeBatteryStatus() {
    if ('getBattery' in navigator) {
        navigator.getBattery().then(function(battery) {
            function updateBatteryStatus() {
                const batteryIcon = document.querySelector('.fa-battery-three-quarters');
                if (batteryIcon) {
                    const level = Math.round(battery.level * 4);
                    const icons = [
                        'fa-battery-empty',
                        'fa-battery-quarter', 
                        'fa-battery-half',
                        'fa-battery-three-quarters',
                        'fa-battery-full'
                    ];
                    
                    batteryIcon.className = `fas ${icons[level]}`;
                }
            }
            
            battery.addEventListener('levelchange', updateBatteryStatus);
            updateBatteryStatus();
        });
    }
}

// Initialize battery status when app starts
document.addEventListener('DOMContentLoaded', function() {
    initializeBatteryStatus();
});

// Performance Monitoring
function measurePerformance(name, fn) {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    console.log(`${name} took ${end - start} milliseconds`);
    return result;
}

// Memory Management
function cleanupUnusedElements() {
    // Remove unused event listeners and clean up DOM
    const unusedElements = document.querySelectorAll('.cleanup-needed');
    unusedElements.forEach(element => {
        element.remove();
    });
}

// Run cleanup periodically
setInterval(cleanupUnusedElements, 60000); // Every minute

// Export functions for testing (if in development environment)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        navigateTo,
        showToast,
        updateUserPoints,
        validateEmail,
        validatePhone,
        formatDate,
        formatTime
    };
}

// Explore Page Functions
function showFilters() {
    showToast('سيتم إضافة خيارات التصفية قريباً', 'info');
}

function applyOpportunity(opportunityId) {
    showToast('تم إرسال طلب التطبيق بنجاح!', 'success');
    // Here you would typically send the application to the backend
    setTimeout(() => {
        navigateTo('home-page');
    }, 1500);
}

function startMicroMission(missionType) {
    const missions = {
        share: { title: 'مشاركة منشور', points: 10, time: '5 دقائق' },
        photo: { title: 'التقاط صورة', points: 15, time: '10 دقائق' },
        call: { title: 'اتصال تذكير', points: 25, time: '20 دقيقة' },
        report: { title: 'كتابة تقرير', points: 30, time: '30 دقيقة' }
    };
    
    const mission = missions[missionType];
    if (mission) {
        showToast(`بدأت مهمة: ${mission.title}`, 'success');
        // Here you would start the mission timer and tracking
        setTimeout(() => {
            userPoints += mission.points;
            showToast(`أحسنت! أكملت المهمة وحصلت على ${mission.points} نقاط`, 'success');
            updatePointsDisplay();
        }, 2000);
    }
}

// Communities Page Functions
function createGroup() {
    showToast('سيتم إضافة إنشاء المجموعات قريباً', 'info');
}

function openGroupChat(groupId) {
    showToast(`فتح محادثة مجموعة: ${groupId}`, 'info');
    // Here you would open the group chat interface
}

function joinGroup(groupId) {
    showToast(`انضممت إلى المجموعة: ${groupId}`, 'success');
    // Here you would send the join request to the backend
}

function requestJoinGroup(groupId) {
    showToast(`تم إرسال طلب الانضمام إلى: ${groupId}`, 'success');
    // Here you would send the join request to the backend
}

// Update points display across the app
function updatePointsDisplay() {
    const pointsElements = document.querySelectorAll('.points-badge span, .stat-number');
    pointsElements.forEach(element => {
        if (element.textContent.includes('نقطة') || element.textContent.includes('1,250')) {
            element.textContent = userPoints.toLocaleString();
        }
    });
}

// Filter functions for explore page
function filterExploreContent(filter) {
    const filterChips = document.querySelectorAll('.filter-chip');
    filterChips.forEach(chip => chip.classList.remove('active'));
    
    const activeChip = document.querySelector(`[data-filter="${filter}"]`);
    if (activeChip) {
        activeChip.classList.add('active');
    }
    
    showToast(`تم تطبيق الفلتر: ${filter}`, 'info');
}

// Governorate tab switching
function switchGovernorate(governorate) {
    const govTabs = document.querySelectorAll('.gov-tab');
    govTabs.forEach(tab => tab.classList.remove('active'));
    
    const activeTab = document.querySelector(`[data-governorate="${governorate}"]`);
    if (activeTab) {
        activeTab.classList.add('active');
    }
    
    showToast(`تم التبديل إلى: ${governorate}`, 'info');
}

// Add event listeners for new interactive elements
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app...'); // Debug log
    
    // Test navigation immediately
    testNavigation();
    
    // Filter chips
    const filterChips = document.querySelectorAll('.filter-chip');
    filterChips.forEach(chip => {
        chip.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            filterExploreContent(filter);
        });
    });
    
    // Governorate tabs
    const govTabs = document.querySelectorAll('.gov-tab');
    govTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const governorate = this.getAttribute('data-governorate');
            switchGovernorate(governorate);
        });
    });
    
    // Search functionality
    const exploreSearch = document.getElementById('explore-search');
    if (exploreSearch) {
        exploreSearch.addEventListener('input', function() {
            const searchTerm = this.value;
            if (searchTerm.length > 2) {
                showToast(`البحث عن: ${searchTerm}`, 'info');
            }
        });
    }
    
    // Initialize all pages
    initializePages();
});

// Test navigation function
function testNavigation() {
    console.log('Testing navigation...');
    
    // Test each page
    const testPages = ['rewards-page', 'certificates-page', 'explore-page', 'communities-page'];
    
    testPages.forEach(pageId => {
        const page = document.getElementById(pageId);
        if (page) {
            console.log(`✓ ${pageId} exists and has content:`, page.children.length, 'children');
            
            // Check if page has visible content
            const hasContent = page.querySelector('.page-header') || 
                             page.querySelector('.rewards-container') || 
                             page.querySelector('.certificates-container') ||
                             page.querySelector('.explore-container') || 
                             page.querySelector('.communities-container');
            
            if (hasContent) {
                console.log(`✓ ${pageId} has proper content structure`);
            } else {
                console.error(`✗ ${pageId} missing content structure`);
            }
        } else {
            console.error(`✗ ${pageId} not found`);
        }
    });
}

// Force show page for testing (add this to browser console)
function forceShowPage(pageId) {
    console.log('Force showing page:', pageId);
    
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show target page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        console.log('Page shown successfully');
    } else {
        console.error('Page not found');
    }
}

// Enhanced Certificates & Documents Functions
function switchDocumentCategory(category) {
    // Remove active class from all tabs
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Add active class to clicked tab
    const targetTab = document.querySelector(`[data-category="${category}"]`);
    if (targetTab) {
        targetTab.classList.add('active');
    }
    
    // Hide all sections
    document.querySelectorAll('.document-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(`${category}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    showToast(`تم التبديل إلى ${getCategoryName(category)}`, 'info');
}

// Get category name in Arabic
function getCategoryName(category) {
    const names = {
        'certificates': 'الشهادات',
        'recommendations': 'التوصيات',
        'official': 'الوثائق الرسمية',
        'temporary': 'الوثائق المؤقتة'
    };
    return names[category] || category;
}

// Certificate functions
function downloadCertificate(certificateId) {
    showToast('جاري تحميل الشهادة...', 'info');
    setTimeout(() => {
        showToast('تم تحميل الشهادة بنجاح!', 'success');
    }, 2000);
}

function shareCertificate(certificateId) {
    showToast('جاري مشاركة الشهادة...', 'info');
    setTimeout(() => {
        showToast('تم مشاركة الشهادة بنجاح!', 'success');
    }, 1500);
}

function showCertificateDetails(certificateId) {
    showToast(`عرض تفاصيل الشهادة: ${certificateId}`, 'info');
}

// Recommendation functions
function downloadRecommendation(recommendationId) {
    showToast('جاري تحميل خطاب التوصية...', 'info');
    setTimeout(() => {
        showToast('تم تحميل خطاب التوصية بنجاح!', 'success');
    }, 2000);
}

function shareRecommendation(recommendationId) {
    showToast('جاري مشاركة خطاب التوصية...', 'info');
    setTimeout(() => {
        showToast('تم مشاركة خطاب التوصية بنجاح!', 'success');
    }, 1500);
}

function trackRecommendation(recommendationId) {
    showToast('جاري متابعة حالة الطلب...', 'info');
    setTimeout(() => {
        showToast('الطلب قيد المعالجة - سيتم إشعارك عند الانتهاء', 'info');
    }, 1500);
}

function showRecommendationDetails(recommendationId) {
    showToast(`عرض تفاصيل خطاب التوصية: ${recommendationId}`, 'info');
}

// Document request functions
function requestDocument(documentType) {
    const documentNames = {
        'certificate': 'شهادة مشاركة',
        'recommendation': 'خطاب توصية',
        'experience': 'شهادة خبرة'
    };
    
    showToast(`جاري إنشاء طلب ${documentNames[documentType]}...`, 'info');
    setTimeout(() => {
        showToast(`تم إرسال طلب ${documentNames[documentType]} بنجاح!`, 'success');
    }, 2000);
}

function requestNewDocument() {
    showToast('اختر نوع الوثيقة المطلوبة', 'info');
}

// Digital passport functions
function scanPassportQR() {
    showToast('جاري فتح كاميرا المسح...', 'info');
    setTimeout(() => {
        showToast('تم مسح رمز QR بنجاح!', 'success');
    }, 1500);
}

function sharePassport() {
    showToast('جاري مشاركة جواز التطوع...', 'info');
    setTimeout(() => {
        showToast('تم مشاركة جواز التطوع بنجاح!', 'success');
    }, 1500);
}

// Enhanced Settings Page Functions
function editProfile() {
    showToast('جاري فتح نموذج تعديل البيانات الشخصية...', 'info');
    setTimeout(() => {
        showToast('تم فتح نموذج التعديل', 'success');
    }, 1000);
}

function changePassword() {
    showToast('جاري فتح نموذج تغيير كلمة السر...', 'info');
    setTimeout(() => {
        showToast('تم فتح نموذج تغيير كلمة السر', 'success');
    }, 1000);
}

function editPhoto() {
    showToast('جاري فتح كاميرا التطبيق...', 'info');
    setTimeout(() => {
        showToast('تم فتح الكاميرا لالتقاط صورة جديدة', 'success');
    }, 1000);
}

function editMembership() {
    showToast('جاري فتح إعدادات العضوية...', 'info');
    setTimeout(() => {
        showToast('تم فتح إعدادات العضوية', 'success');
    }, 1000);
}

function editLocation() {
    const newLocation = prompt('اختر المحافظة الجديدة:', 'القاهرة');
    if (newLocation) {
        showToast(`تم تغيير المحافظة إلى: ${newLocation}`, 'success');
    }
}

function editGroup() {
    const newGroup = prompt('اختر المجموعة الجديدة:', 'المجموعة الأولى');
    if (newGroup) {
        showToast(`تم تغيير المجموعة إلى: ${newGroup}`, 'success');
    }
}

function privacySettings() {
    showToast('جاري فتح إعدادات الخصوصية...', 'info');
    setTimeout(() => {
        showToast('تم فتح إعدادات الخصوصية', 'success');
    }, 1000);
}

function twoFactorAuth() {
    showToast('جاري فتح إعدادات المصادقة الثنائية...', 'info');
    setTimeout(() => {
        showToast('تم فتح إعدادات المصادقة الثنائية', 'success');
    }, 1000);
}

function showFAQ() {
    showToast('جاري فتح الأسئلة الشائعة...', 'info');
    setTimeout(() => {
        showToast('تم فتح الأسئلة الشائعة', 'success');
    }, 1000);
}

function contactSupport() {
    showToast('جاري فتح صفحة الدعم الفني...', 'info');
    setTimeout(() => {
        showToast('تم فتح صفحة الدعم الفني', 'success');
    }, 1000);
}

function aboutApp() {
    showToast('جاري فتح معلومات التطبيق...', 'info');
    setTimeout(() => {
        showToast('تم فتح معلومات التطبيق', 'success');
    }, 1000);
}



// Initialize all pages and their functionality
function initializePages() {
    console.log('Initializing pages...'); // Debug log
    
    // Check if all pages exist
    const pages = ['home-page', 'journey-page', 'rewards-page', 'certificates-page', 'explore-page', 'communities-page'];
    pages.forEach(pageId => {
        const page = document.getElementById(pageId);
        if (page) {
            console.log(`✓ Page found: ${pageId}`);
        } else {
            console.error(`✗ Page missing: ${pageId}`);
        }
    });
    
    // Initialize journey page animations
    initializeJourneyAnimations();
    
    // Initialize rewards page
    initializeRewardsPage();
    
    // Initialize certificates page
    initializeCertificatesPage();
    
    // Initialize explore page
    initializeExplorePage();
    
    // Initialize communities page
    initializeCommunitiesPage();
    
    console.log('Pages initialization complete');
}

// Initialize journey page animations and interactions
function initializeJourneyAnimations() {
    // Animate progress circles
    const progressCircles = document.querySelectorAll('.progress-ring-fill');
    progressCircles.forEach(circle => {
        const progress = circle.getAttribute('stroke-dashoffset');
        if (progress) {
            setTimeout(() => {
                circle.style.strokeDashoffset = progress;
            }, 500);
        }
    });
    
    // Add click handlers for timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        item.addEventListener('click', function() {
            const isCompleted = this.classList.contains('completed');
            const isCurrent = this.classList.contains('current');
            
            if (isCompleted) {
                showToast('إنجاز مكتمل!', 'success');
            } else if (isCurrent) {
                showToast('أنت في هذا المستوى حالياً', 'info');
            } else {
                showToast('هذا المستوى سيتم فتحه قريباً', 'info');
            }
        });
    });
}

// Initialize rewards page functionality
function initializeRewardsPage() {
    // Start carousel
    startCarousel();
    
    // Add category filter event listeners
    const categoryChips = document.querySelectorAll('.category-chip');
    categoryChips.forEach(chip => {
        chip.addEventListener('click', (e) => {
            const category = e.currentTarget.dataset.category;
            filterRewards(category);
        });
    });
    
    // Add carousel indicator event listeners
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => goToSlide(index));
    });
    
    // Add carousel control event listeners
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    
    if (prevBtn) prevBtn.addEventListener('click', previousSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
}

// Initialize explore page functionality
function initializeExplorePage() {
    // Add click handlers for recommendation cards
    const recommendationCards = document.querySelectorAll('.recommendation-card');
    recommendationCards.forEach(card => {
        card.addEventListener('click', function() {
            const opportunityName = this.querySelector('h5').textContent;
            showToast(`عرض تفاصيل: ${opportunityName}`, 'info');
        });
    });
    
    // Add click handlers for micro missions
    const microMissionCards = document.querySelectorAll('.micro-mission-card');
    microMissionCards.forEach(card => {
        card.addEventListener('click', function() {
            const missionName = this.querySelector('h6').textContent;
            showToast(`بدء مهمة: ${missionName}`, 'success');
        });
    });
}

// Initialize communities page functionality
function initializeCommunitiesPage() {
    // Add click handlers for group cards
    const groupCards = document.querySelectorAll('.group-card');
    groupCards.forEach(card => {
        card.addEventListener('click', function() {
            const groupName = this.querySelector('h5').textContent;
            showToast(`عرض مجموعة: ${groupName}`, 'info');
        });
    });
    
    // Add click handlers for activity items
    const activityItems = document.querySelectorAll('.activity-item');
    activityItems.forEach(item => {
        item.addEventListener('click', function() {
            const activityText = this.querySelector('p').textContent;
            showToast(`عرض النشاط: ${activityText.substring(0, 30)}...`, 'info');
        });
    });
}

// Initialize certificates page functionality
function initializeCertificatesPage() {
    // Add click handlers for category tabs
    const categoryTabs = document.querySelectorAll('.category-tab');
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            switchDocumentCategory(category);
        });
    });
    
    // Add click handlers for certificate cards
    const certificateCards = document.querySelectorAll('.certificate-card');
    certificateCards.forEach(card => {
        card.addEventListener('click', function() {
            const certificateName = this.querySelector('h4').textContent;
            showToast(`عرض شهادة: ${certificateName}`, 'info');
        });
    });
    
    // Add click handlers for recommendation cards
    const recommendationCards = document.querySelectorAll('.recommendation-card');
    recommendationCards.forEach(card => {
        card.addEventListener('click', function() {
            const recommendationName = card.querySelector('h4').textContent;
            showToast(`عرض خطاب توصية: ${recommendationName}`, 'info');
        });
    });
    
    // Add click handlers for request options
    const requestOptions = document.querySelectorAll('.request-option');
    requestOptions.forEach(option => {
        option.addEventListener('click', function() {
            const optionName = this.querySelector('h5').textContent;
            showToast(`طلب ${optionName}`, 'info');
        });
    });
}

// Notification System Functions
function toggleNotifications() {
    const dropdown = document.getElementById('notification-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function closeDropdown(e) {
            if (!e.target.closest('.notification-icon')) {
                dropdown.classList.remove('show');
                document.removeEventListener('click', closeDropdown);
            }
        });
    }
}

function markAllAsRead() {
    const unreadItems = document.querySelectorAll('.notification-item.unread');
    const badge = document.querySelector('.notification-badge');
    
    unreadItems.forEach(item => {
        item.classList.remove('unread');
    });
    
    if (badge) {
        badge.textContent = '0';
        badge.style.display = 'none';
    }
    
    showToast('تم تحديد جميع الإشعارات كمقروءة', 'success');
}

function markNotificationAsRead(notificationItem) {
    const badge = document.querySelector('.notification-badge');
    
    if (notificationItem.classList.contains('unread')) {
        notificationItem.classList.remove('unread');
        
        if (badge) {
            const currentCount = parseInt(badge.textContent);
            if (currentCount > 0) {
                badge.textContent = (currentCount - 1).toString();
                if (currentCount - 1 === 0) {
                    badge.style.display = 'none';
                }
            }
        }
    }
}

// Enhanced notification click handler
function handleNotificationClick(notificationItem) {
    markNotificationAsRead(notificationItem);
    
    // Add click animation
    notificationItem.style.transform = 'scale(0.98)';
    setTimeout(() => {
        notificationItem.style.transform = 'scale(1)';
    }, 150);
    
    // Handle different notification types
    const icon = notificationItem.querySelector('i');
    if (icon) {
        const iconClass = icon.className;
        if (iconClass.includes('calendar-check')) {
            navigateTo('events-page');
        } else if (iconClass.includes('trophy')) {
            navigateTo('rewards-page');
        } else if (iconClass.includes('users')) {
            navigateTo('communities-page');
        }
    }
}

// Enhanced tab interactions
function enhanceTabInteractions() {
    const tabItems = document.querySelectorAll('.tab-item');
    
    tabItems.forEach(tab => {
        tab.addEventListener('click', function() {
            // Add click animation
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // Add haptic feedback
            hapticFeedback('light');
        });
        
        // Add hover sound effect (optional)
        tab.addEventListener('mouseenter', function() {
            this.classList.add('animate-pulse');
        });
        
        tab.addEventListener('mouseleave', function() {
            this.classList.remove('animate-pulse');
        });
    });
}

// Enhanced preview card interactions
function enhancePreviewCardInteractions() {
    const previewCards = document.querySelectorAll('.preview-card');
    
    previewCards.forEach(card => {
        card.addEventListener('click', function() {
            // Add click animation
            this.style.transform = 'scale(0.98) translateY(-2px)';
            setTimeout(() => {
                this.style.transform = 'scale(1) translateY(-3px)';
            }, 150);
            
            // Add haptic feedback
            hapticFeedback('light');
        });
        
        // Add entrance animation
        card.classList.add('animate-slide-in');
    });
}

// Enhanced avatar interactions
function enhanceAvatarInteractions() {
    const avatar = document.querySelector('.user-avatar');
    if (avatar) {
        avatar.addEventListener('click', function() {
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1.05)';
            }, 150);
            
            // Add haptic feedback
            hapticFeedback('medium');
        });
    }
}

// Rewards Page Carousel and Interactions
let currentSlide = 0;
const totalSlides = 3;

function goToSlide(slideIndex) {
    const cards = document.querySelectorAll('.hero-reward-card');
    const indicators = document.querySelectorAll('.indicator');
    
    // Hide all cards
    cards.forEach(card => card.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));
    
    // Show target card
    cards[slideIndex].classList.add('active');
    indicators[slideIndex].classList.add('active');
    
    currentSlide = slideIndex;
}

function nextSlide() {
    const nextIndex = (currentSlide + 1) % totalSlides;
    goToSlide(nextIndex);
}

function previousSlide() {
    const prevIndex = (currentSlide - 1 + totalSlides) % totalSlides;
    goToSlide(prevIndex);
}

// Auto-rotate carousel
function startCarousel() {
    setInterval(() => {
        nextSlide();
    }, 5000); // Change slide every 5 seconds
}

// Category filtering
function filterRewards(category) {
    const rewardCards = document.querySelectorAll('.reward-card');
    const categoryChips = document.querySelectorAll('.category-chip');
    
    // Update active category chip
    categoryChips.forEach(chip => chip.classList.remove('active'));
    event.target.closest('.category-chip').classList.add('active');
    
    // Filter reward cards
    rewardCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.3s ease-in';
        } else {
            card.style.display = 'none';
        }
    });
}

// Reward redemption with confetti animation
function redeemReward(rewardType, pointsCost) {
    if (userPoints < pointsCost) {
        showToast('نقاط غير كافية! تحتاج إلى ' + pointsCost + ' نقطة', 'error');
        return;
    }
    
    // Show loading state
    const button = event.target.closest('.reward-btn, .hero-redeem-btn');
    const originalText = button.innerHTML;
    button.classList.add('loading');
    button.innerHTML = '';
    
    // Simulate API call
    setTimeout(() => {
        // Deduct points
        userPoints -= pointsCost;
        
        // Update points display
        updatePointsDisplay();
        
        // Remove loading state
        button.classList.remove('loading');
        button.innerHTML = originalText;
        
        // Show success message
        showToast('تم استبدال المكافأة بنجاح! 🎉', 'success');
        
        // Create confetti animation
        createConfetti();
        
        // Add to redemption history
        addToRedemptionHistory(rewardType, pointsCost);
        
    }, 1500);
}

// Create confetti animation
function createConfetti() {
    const colors = ['#ffd700', '#ff6b35', '#28a745', '#007bff', '#6f42c1'];
    
    for (let i = 0; i < 20; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        confetti.style.animationDuration = (Math.random() * 0.5 + 0.5) + 's';
        
        document.body.appendChild(confetti);
        
        // Remove confetti after animation
        setTimeout(() => {
            confetti.remove();
        }, 2000);
    }
}

// Update points display
function updatePointsDisplay() {
    const pointsBadge = document.querySelector('.points-balance-badge span');
    if (pointsBadge) {
        pointsBadge.textContent = '⭐ ' + userPoints.toLocaleString() + ' نقطة';
    }
    
    // Update points in other locations
    const pointsElements = document.querySelectorAll('.stat-number');
    pointsElements.forEach(element => {
        if (element.textContent.includes('نقطة')) {
            element.textContent = userPoints.toLocaleString();
        }
    });
}

// Add to redemption history
function addToRedemptionHistory(rewardType, pointsCost) {
    const rewardNames = {
        'cinema': 'تذكرة سينما',
        'shopping': 'خصم تسوق',
        'badge': 'شارة إنجاز',
        'concert': 'تذكرة حفل',
        'tshirt': 'قميص تطوعي',
        'course': 'كورس تعليمي',
        'certificate': 'شهادة تقدير',
        'meeting': 'لقاء حصري',
        'workshop': 'ورشة تقنية'
    };
    
    const historyContainer = document.querySelector('.redemption-history');
    if (historyContainer) {
        const newItem = document.createElement('div');
        newItem.className = 'redemption-item';
        newItem.innerHTML = `
            <div class="redemption-icon">
                <i class="fas fa-gift"></i>
            </div>
            <div class="redemption-info">
                <h6>${rewardNames[rewardType] || 'مكافأة'}</h6>
                <span>الآن - ${pointsCost} نقطة</span>
            </div>
            <div class="redemption-status completed">
                <i class="fas fa-check"></i>
            </div>
        `;
        
        // Add to beginning of history
        historyContainer.insertBefore(newItem, historyContainer.firstChild);
        
        // Limit history to 5 items
        const items = historyContainer.querySelectorAll('.redemption-item');
        if (items.length > 5) {
            items[items.length - 1].remove();
        }
    }
}

// Add CSS animations for rewards page
const rewardsStyles = document.createElement('style');
rewardsStyles.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes confetti {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
    }
    
    .confetti {
        position: fixed;
        width: 10px;
        height: 10px;
        background: #ffd700;
        animation: confetti 1s ease-out forwards;
        pointer-events: none;
        z-index: 1000;
    }
    
    .reward-card {
        animation: fadeIn 0.3s ease-in;
    }
`;
document.head.appendChild(rewardsStyles);

// Role-based Access Control
let currentUserRole = 'user'; // 'user', 'moderator', 'admin', 'superadmin'

function initializeUserRole(role) {
    currentUserRole = role;
    updateUIForRole();
}

function updateUIForRole() {
    const adminTools = document.getElementById('admin-tools');
    if (!adminTools) return;
    
    if (currentUserRole === 'admin' || currentUserRole === 'superadmin' || currentUserRole === 'moderator') {
        adminTools.style.display = 'block';
    } else {
        adminTools.style.display = 'none';
    }
}

// Post Management Functions
function createNewPost() {
    showModal('create-post-modal');
}

function createNewEvent() {
    showModal('create-event-modal');
}

function uploadCertificate() {
    showModal('upload-certificate-modal');
}

function likePost(button) {
    const likeIcon = button.querySelector('i');
    const likeCount = button.querySelector('span');
    
    if (likeIcon.classList.contains('liked')) {
        likeIcon.classList.remove('liked');
        likeIcon.style.color = '';
        likeCount.textContent = parseInt(likeCount.textContent) - 1;
    } else {
        likeIcon.classList.add('liked');
        likeIcon.style.color = '#e53e3e';
        likeCount.textContent = parseInt(likeCount.textContent) + 1;
    }
    
    // Add animation
    button.classList.add('pulse');
    setTimeout(() => button.classList.remove('pulse'), 300);
}

function commentPost(button) {
    const postCard = button.closest('.post-card');
    const postId = postCard.dataset.postId || '1';
    showModal('comment-modal');
    // You can pass postId to the modal for context
}

function sharePost(button) {
    const postCard = button.closest('.post-card');
    const postTitle = postCard.querySelector('h4').textContent;
    
    if (navigator.share) {
        navigator.share({
            title: postTitle,
            text: 'شاهد هذا المنشور من تطبيق المتطوعين',
            url: window.location.href
        });
    } else {
        // Fallback for browsers that don't support Web Share API
        showToast('تم نسخ الرابط إلى الحافظة', 'success');
    }
}

function loadMorePosts() {
    const loadMoreBtn = document.querySelector('.load-more-section button');
    loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التحميل...';
    loadMoreBtn.disabled = true;
    
    // Simulate loading more posts
    setTimeout(() => {
        // Add new posts to the feed
        const feedContainer = document.querySelector('.feed-container');
        const newPost = createSamplePost();
        feedContainer.appendChild(newPost);
        
        loadMoreBtn.innerHTML = '<i class="fas fa-chevron-down"></i> عرض المزيد';
        loadMoreBtn.disabled = false;
        
        showToast('تم تحميل منشورات جديدة', 'success');
    }, 2000);
}

function createSamplePost() {
    const postDiv = document.createElement('div');
    postDiv.className = 'post-card';
    postDiv.dataset.category = 'achievements';
    
    postDiv.innerHTML = `
        <div class="post-header">
            <div class="post-author">
                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%236f42c1'/%3E%3Ctext x='50' y='55' text-anchor='middle' fill='white' font-size='30' font-family='Arial'%3EF%3C/text%3E%3C/svg%3E" alt="فاطمة">
                <div class="author-info">
                    <h5>فاطمة حسن</h5>
                    <span class="post-time">منذ دقيقة</span>
                </div>
            </div>
            <div class="post-badge achievement">
                <i class="fas fa-trophy"></i>
                <span>إنجاز</span>
            </div>
        </div>
        <div class="post-content">
            <h4>أتممت 50 ساعة تطوع!</h4>
            <p>وصلت إلى معلم جديد في رحلتي التطوعية. شكراً لجميع من ساعدني في الوصول إلى هذا الإنجاز.</p>
        </div>
        <div class="post-actions">
            <button class="action-btn" onclick="likePost(this)">
                <i class="fas fa-heart"></i>
                <span>0</span>
            </button>
            <button class="action-btn" onclick="commentPost(this)">
                <i class="fas fa-comment"></i>
                <span>0</span>
            </button>
            <button class="action-btn" onclick="sharePost(this)">
                <i class="fas fa-share"></i>
                <span>مشاركة</span>
            </button>
        </div>
    `;
    
    return postDiv;
}

// Feed Filtering
function filterFeed(category) {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const posts = document.querySelectorAll('.post-card');
    
    // Update active filter button
    filterBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Filter posts
    posts.forEach(post => {
        if (category === 'all' || post.dataset.category === category) {
            post.style.display = 'block';
            post.classList.add('fade-in');
        } else {
            post.style.display = 'none';
        }
    });
    
    // Remove animation class after animation completes
    setTimeout(() => {
        posts.forEach(post => post.classList.remove('fade-in'));
    }, 300);
}

// Initialize feed filters
document.addEventListener('DOMContentLoaded', function() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.dataset.filter;
            filterFeed(category);
        });
    });
    
    // Initialize user role (you can get this from your authentication system)
    initializeUserRole('user');

    // Example: show skeletons while loading initial data
    const skeletonLists = document.querySelectorAll('[data-skeleton-list]');
    skeletonLists.forEach(list => {
        const count = Number(list.dataset.skeletonCount || 3);
        const placeholder = document.createDocumentFragment();
        for (let i = 0; i < count; i++) {
            const card = document.createElement('div');
            card.className = 'skeleton skeleton-card';
            placeholder.appendChild(card);
        }
        list.appendChild(placeholder);
    });
});

// Enhanced Modal System
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('fade-in');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('fade-out');
        setTimeout(() => {
            modal.style.display = 'none';
            modal.classList.remove('fade-in', 'fade-out');
            document.body.style.overflow = '';
        }, 300);
    }
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        closeModal(event.target.id);
    }
});

// Enhanced Toast System (removed duplicate; see consolidated showToast above)

// Role-based Access Control
function initializeUserRole(role) {
    currentUserRole = role;
    updateUIForRole();
}

function updateUIForRole() {
    // Update admin tools visibility
    const adminTools = document.getElementById('admin-tools');
    if (adminTools) {
        const hasModerationAccess = ['moderator', 'admin', 'superadmin'].includes(currentUserRole);
        adminTools.style.display = hasModerationAccess ? 'block' : 'none';
    }
    
    // Update quick actions based on role
    updateQuickActions();
    
    // Update navigation items based on role
    updateNavigationVisibility();
    
    // Update settings menu based on role
    updateSettingsMenu();
}

function updateQuickActions() {
    const createEventBtn = document.querySelector('[onclick="createNewEvent()"]');
    const createPostBtn = document.querySelector('[onclick="createNewPost()"]');
    
    if (createEventBtn) {
        const canCreateEvents = ROLE_CAPABILITIES[currentUserRole]?.createEvents || false;
        createEventBtn.style.display = canCreateEvents ? 'flex' : 'none';
    }
    
    if (createPostBtn) {
        const canCreatePosts = ROLE_CAPABILITIES[currentUserRole]?.createPosts || false;
        createPostBtn.style.display = canCreatePosts ? 'flex' : 'none';
    }
}

function updateNavigationVisibility() {
    // Hide/show navigation items based on role capabilities
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        const navText = item.querySelector('span')?.textContent;
        if (navText) {
            // Example: Hide admin features for regular users
            if (navText.includes('الإدارة') && currentUserRole === 'user') {
                item.style.display = 'none';
            }
        }
    });
}

function updateSettingsMenu() {
    // Update settings menu items based on role
    const adminSettings = document.querySelectorAll('.admin-setting');
    const hasAdminAccess = ['admin', 'superadmin'].includes(currentUserRole);
    
    adminSettings.forEach(setting => {
        setting.style.display = hasAdminAccess ? 'block' : 'none';
    });
}

// Theme System
const THEME_MODES = {
    LIGHT: 'light',
    DARK: 'dark',
    AUTO: 'auto'
};

function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || THEME_MODES.LIGHT;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? THEME_MODES.DARK : THEME_MODES.LIGHT;
    
    let activeTheme = savedTheme;
    if (savedTheme === THEME_MODES.AUTO) {
        activeTheme = systemTheme;
    }
    
    applyTheme(activeTheme);
}

function applyTheme(theme) {
    const root = document.documentElement;
    
    // Normalize theme classes on :root
    root.classList.remove('light-theme', 'dark-theme');
    if (theme === THEME_MODES.DARK) {
        root.classList.add('dark-theme');
    } else {
        root.classList.add('light-theme');
    }
    
    // Update theme toggle buttons and simple buttons
    const themeToggles = document.querySelectorAll('.theme-toggle');
    themeToggles.forEach(toggle => {
        const input = toggle.querySelector('input');
        if (input) input.checked = theme === THEME_MODES.DARK;
    });
    const themeButtons = document.querySelectorAll('.theme-btn');
    themeButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('onclick')?.includes(theme)) {
            btn.classList.add('active');
        }
    });
    
    // Persist
    localStorage.setItem('theme', theme);
}

function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || THEME_MODES.LIGHT;
    const newTheme = currentTheme === THEME_MODES.DARK ? THEME_MODES.LIGHT : THEME_MODES.DARK;
    
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
    
    showToast(`تم التبديل إلى الوضع ${newTheme === THEME_MODES.DARK ? 'الداكن' : 'الفاتح'}`, 'success');
}

function setThemeAuto() {
    localStorage.setItem('theme', THEME_MODES.AUTO);
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? THEME_MODES.DARK : THEME_MODES.LIGHT;
    applyTheme(systemTheme);
    
    showToast('تم ضبط المظهر ليتطابق مع النظام', 'success');
}

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === THEME_MODES.AUTO) {
        const newSystemTheme = e.matches ? THEME_MODES.DARK : THEME_MODES.LIGHT;
        applyTheme(newSystemTheme);
    }
});

function hasCapability(capability) {
    return ROLE_CAPABILITIES[currentUserRole]?.[capability] || false;
}

function checkPermission(capability) {
    if (!hasCapability(capability)) {
        showToast('ليس لديك صلاحية لتنفيذ هذا الإجراء', 'error');
        return false;
    }
    return true;
}

// Post Management Functions
function createNewPost() {
    if (!checkPermission('createPosts')) return;
    
    showModal('create-post-modal');
}

function createNewEvent() {
    if (!checkPermission('createEvents')) return;
    
    showModal('create-event-modal');
}

function uploadCertificate() {
    if (!checkPermission('generateCertificates')) return;
    
    showModal('upload-certificate-modal');
}

// Post Moderation System
const POST_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    REMOVED: 'removed'
};

const POST_TYPES = {
    CELEBRATION: 'celebration',
    VOLUNTEERING: 'volunteering',
    NEWS: 'news',
    PHOTO: 'photo'
};

// Sample posts database
let postsDatabase = [
    {
        id: 1,
        author: 'إدارة التطوع',
        authorRole: 'admin',
        type: POST_TYPES.NEWS,
        title: 'فعالية تنظيف الشواطئ - الإسكندرية',
        content: 'انضم إلينا في حملة تنظيف شواطئ الإسكندرية هذا الأسبوع. سنقوم بتنظيف 5 كيلومترات من الشاطئ مع أكثر من 200 متطوع.',
        status: POST_STATUS.APPROVED,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        likes: 45,
        comments: 12,
        category: 'announcements'
    },
    {
        id: 2,
        author: 'سارة أحمد',
        authorRole: 'user',
        type: POST_TYPES.CELEBRATION,
        title: 'مبروك! حصلت على شهادة الإسعافات الأولية',
        content: 'أتممت بنجاح دورة الإسعافات الأولية وحصلت على شهادة معتمدة. شكراً لجميع المدربين والمتطوعين الذين ساعدوني في هذه الرحلة.',
        status: POST_STATUS.APPROVED,
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        likes: 28,
        comments: 8,
        category: 'achievements'
    },
    {
        id: 3,
        author: 'محمد علي',
        authorRole: 'user',
        type: POST_TYPES.VOLUNTEERING,
        title: 'ورشة تدريبية - مهارات القيادة',
        content: 'سأقوم بتنظيم ورشة تدريبية في مهارات القيادة للمتطوعين الجدد. الورشة ستكون يوم الجمعة من 10 صباحاً حتى 2 ظهراً.',
        status: POST_STATUS.PENDING,
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        likes: 32,
        comments: 15,
        category: 'events'
    }
];

async function submitPost(postData) {
    try {
        const post = await postService.createPost(currentUser.id, {
            type: postData.type,
            title: postData.title,
            body: postData.content,
            visibility: 'public'
        });
        
        showToast('تم إرسال المنشور للمراجعة. سيتم نشره بعد الموافقة.', 'info');
        closeModal('create-post-modal');
        await refreshFeed();
    } catch (error) {
        showToast(error.message, 'error');
    }
}

async function approvePost(postId) {
    try {
        await postService.approvePost(postId, currentUser.id);
        showToast('تم الموافقة على المنشور', 'success');
        await refreshFeed();
    } catch (error) {
        showToast(error.message, 'error');
    }
}

async function rejectPost(postId) {
    const reason = prompt('سبب الرفض:');
    if (!reason) return;
    
    try {
        await postService.rejectPost(postId, currentUser.id, reason);
        showToast('تم رفض المنشور', 'warning');
        await refreshFeed();
    } catch (error) {
        showToast(error.message, 'error');
    }
}

function deletePost(postId) {
    if (!checkPermission('deleteContent')) return;
    
    const post = postsDatabase.find(p => p.id === postId);
    if (post) {
        post.status = POST_STATUS.REMOVED;
        showToast('تم حذف المنشور', 'success');
        refreshFeed();
    }
}

async function refreshFeed() {
    const feedContainer = document.querySelector('.news-feed-section');
    if (!feedContainer) return;
    
    try {
        const posts = await postService.getPosts({ status: 'approved' });
        
        // Clear existing posts
        const existingPosts = feedContainer.querySelectorAll('.post-card');
        existingPosts.forEach(post => post.remove());
        
        // Add approved posts
        posts.forEach(post => {
            const postElement = createPostElement(post);
            feedContainer.appendChild(postElement);
        });
    } catch (error) {
        showToast('خطأ في تحميل المنشورات', 'error');
    }
}

// Form Submission Functions
function submitPostForm() {
    const postData = {
        type: document.getElementById('post-type').value,
        title: document.getElementById('post-title').value,
        content: document.getElementById('post-content').value,
        category: document.getElementById('post-category').value
    };
    
    submitPost(postData);
}

function submitEventForm() {
    const eventData = {
        title: document.getElementById('event-title').value,
        description: document.getElementById('event-description').value,
        type: document.getElementById('event-type').value,
        datetime: document.getElementById('event-datetime').value,
        location: document.getElementById('event-location').value,
        capacity: parseInt(document.getElementById('event-capacity').value)
    };
    
    // Create new event
    const newEvent = {
        id: Date.now(),
        title: eventData.title,
        description: eventData.description,
        type: eventData.type,
        datetime: eventData.datetime,
        location: eventData.location,
        capacity: eventData.capacity,
        status: currentUser.role === 'user' ? 'pending' : 'approved',
        createdBy: currentUser.name,
        registeredCount: 0
    };
    
    // Add to events database (you would typically save to backend)
    if (!window.eventsDatabase) window.eventsDatabase = [];
    window.eventsDatabase.push(newEvent);
    
    showToast('تم إنشاء الفعالية بنجاح!', 'success');
    closeModal('create-event-modal');
    
    // Clear form
    document.getElementById('event-form').reset();
}

function likePost(button) {
    const likeIcon = button.querySelector('i');
    const likeCount = button.querySelector('span');
    
    if (likeIcon.classList.contains('liked')) {
        likeIcon.classList.remove('liked');
        likeIcon.style.color = '';
        likeCount.textContent = parseInt(likeCount.textContent) - 1;
    } else {
        likeIcon.classList.add('liked');
        likeIcon.style.color = '#e53e3e';
        likeCount.textContent = parseInt(likeCount.textContent) + 1;
    }
    
    // Add animation
    button.classList.add('pulse');
    setTimeout(() => button.classList.remove('pulse'), 300);
}

function commentPost(button) {
    showToast('سيتم إضافة هذه الميزة قريباً', 'info');
}

function sharePost(button) {
    const postCard = button.closest('.post-card');
    const postTitle = postCard.querySelector('h4').textContent;
    
    if (navigator.share) {
        navigator.share({
            title: postTitle,
            text: 'شاهد هذا المنشور من تطبيق المتطوعين',
            url: window.location.href
        });
    } else {
        // Fallback for browsers that don't support Web Share API
        showToast('تم نسخ الرابط إلى الحافظة', 'success');
    }
}

function loadMorePosts() {
    const loadMoreBtn = document.querySelector('.load-more-section button');
    if (!loadMoreBtn) return;
    
    loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التحميل...';
    loadMoreBtn.disabled = true;
    
    // Simulate loading more posts
    setTimeout(() => {
        loadMoreBtn.innerHTML = '<i class="fas fa-chevron-down"></i> عرض المزيد';
        loadMoreBtn.disabled = false;
        
        showToast('تم تحميل منشورات جديدة', 'success');
    }, 2000);
}

// Initialize Home Page Features
function initializeHomePage() {
    // Initialize user role (you can get this from your authentication system)
    initializeUserRole('user');
    
    // Initialize feed filters
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.dataset.filter;
            filterFeed(category);
        });
    });
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme system
    initializeTheme();
    
    // Initialize feed filters
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.dataset.filter;
            filterFeed(category);
        });
    });
});

// Feed Filtering
function filterFeed(category) {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const posts = document.querySelectorAll('.post-card');
    
    // Update active filter button
    filterBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Filter posts
    posts.forEach(post => {
        if (category === 'all' || post.dataset.category === category) {
            post.style.display = 'block';
            post.classList.add('fade-in');
        } else {
            post.style.display = 'none';
        }
    });
    
    // Remove animation class after animation completes
    setTimeout(() => {
        posts.forEach(post => post.classList.remove('fade-in'));
    }, 300);
}

// Animation Classes
function addPulseAnimation(element) {
    element.classList.add('pulse');
    setTimeout(() => element.classList.remove('pulse'), 300);
}

// Enhanced Event Registration
function registerEvent(button) {
    const eventCard = button.closest('.event-preview') || button.closest('.event-card');
    if (!eventCard) return;
    
    // Add loading state
    const originalText = button.textContent;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التسجيل...';
    button.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        button.innerHTML = '<i class="fas fa-check"></i> مسجل';
        button.className = 'btn-success';
        button.disabled = true;
        
        showToast('تم التسجيل في الفعالية بنجاح!', 'success');
        updateUserPoints(25); // Award points for registration
        
        // Add animation
        eventCard.classList.add('fade-in');
        setTimeout(() => eventCard.classList.remove('fade-in'), 300);
    }, 1500);
}