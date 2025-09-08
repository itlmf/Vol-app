// Backend Simulation for LifeMakers Egypt Volunteer Platform
// This simulates a real backend with proper RBAC, data persistence, and security

class BackendSimulation {
    constructor() {
        this.initializeDatabase();
        this.initializeSecurity();
        this.initializeServices();
    }

    // Database Simulation
    initializeDatabase() {
        this.database = {
            users: new Map(),
            posts: new Map(),
            events: new Map(),
            eventRegistrations: new Map(),
            attendanceScans: new Map(),
            pointsLedger: new Map(),
            certificates: new Map(),
            rewards: new Map(),
            redemptions: new Map(),
            badges: new Map(),
            userBadges: new Map(),
            friendships: new Map(),
            groups: new Map(),
            groupMembers: new Map(),
            mentions: new Map(),
            inbox: new Map(),
            audits: new Map(),
            qrTokens: new Map(),
            moderationQueue: new Map()
        };

        this.loadSeedData();
    }

    // Security & Authentication
    initializeSecurity() {
        this.jwtSecret = 'lifemakers-secret-key-2024';
        this.refreshTokens = new Map();
        this.rateLimits = new Map();
        this.sessionTokens = new Map();
    }

    // Service Layer
    initializeServices() {
        this.authService = new AuthService(this);
        this.userService = new UserService(this);
        this.postService = new PostService(this);
        this.eventService = new EventService(this);
        this.pointsService = new PointsService(this);
        this.certificateService = new CertificateService(this);
        this.moderationService = new ModerationService(this);
        this.qrService = new QRService(this);
        this.auditService = new AuditService(this);
    }

    // Load Seed Data
    loadSeedData() {
        // Seed Users
        const seedUsers = [
            {
                id: '1',
                username: 'Admin',
                passwordHash: this.authService.hashPassword('Admin55'),
                role: 'superadmin',
                name: 'مدير النظام',
                governorate: 'القاهرة',
                status: 'active',
                isFirstLogin: false,
                createdAt: new Date('2024-01-01'),
                updatedAt: new Date('2024-01-01')
            },
            {
                id: '2',
                username: 'Ibrahim',
                passwordHash: this.authService.hashPassword('Hima11'),
                role: 'admin',
                name: 'إبراهيم أحمد',
                governorate: 'الإسكندرية',
                status: 'active',
                isFirstLogin: false,
                createdAt: new Date('2024-01-01'),
                updatedAt: new Date('2024-01-01')
            },
            {
                id: '3',
                username: 'Hamed',
                passwordHash: this.authService.hashPassword('Ha11'),
                role: 'admin',
                name: 'حامد محمد',
                governorate: 'الجيزة',
                status: 'active',
                isFirstLogin: false,
                createdAt: new Date('2024-01-01'),
                updatedAt: new Date('2024-01-01')
            },
            {
                id: '4',
                username: 'Walaa',
                passwordHash: this.authService.hashPassword('Lol123'),
                role: 'moderator',
                name: 'ولاء علي',
                governorate: 'الشرقية',
                status: 'active',
                isFirstLogin: false,
                createdAt: new Date('2024-01-01'),
                updatedAt: new Date('2024-01-01')
            },
            {
                id: '5',
                username: 'Odai',
                passwordHash: this.authService.hashPassword('1111'),
                role: 'user',
                name: 'عدي سالم',
                governorate: 'القاهرة',
                status: 'active',
                isFirstLogin: false,
                createdAt: new Date('2024-01-01'),
                updatedAt: new Date('2024-01-01')
            }
        ];

        seedUsers.forEach(user => {
            this.database.users.set(user.id, user);
        });

        // Seed Rewards
        const seedRewards = [
            {
                id: '1',
                title: 'كوبون مطعم',
                description: 'خصم 50 جنيه على وجبة في مطعم مميز',
                category: 'food',
                imageUrl: 'restaurant-coupon.jpg',
                pointsCost: 200,
                stock: 50,
                active: true
            },
            {
                id: '2',
                title: 'تذكرة سينما',
                description: 'تذكرة مجانية لفيلم في السينما',
                category: 'entertainment',
                imageUrl: 'cinema-ticket.jpg',
                pointsCost: 150,
                stock: 30,
                active: true
            },
            {
                id: '3',
                title: 'كتاب تطوعي',
                description: 'كتاب عن التطوع والمجتمع',
                category: 'education',
                imageUrl: 'volunteer-book.jpg',
                pointsCost: 100,
                stock: 100,
                active: true
            }
        ];

        seedRewards.forEach(reward => {
            this.database.rewards.set(reward.id, reward);
        });

        // Seed Badges
        const seedBadges = [
            {
                id: '1',
                code: 'first_checkin',
                name: 'أول تسجيل حضور',
                tier: 'bronze',
                imageUrl: 'first-checkin-badge.png',
                criteria: { type: 'first_checkin', count: 1 }
            },
            {
                id: '2',
                code: 'three_events_month',
                name: 'ثلاثة أحداث في الشهر',
                tier: 'silver',
                imageUrl: 'three-events-badge.png',
                criteria: { type: 'events_in_month', count: 3, period: 'month' }
            },
            {
                id: '3',
                code: 'hundred_hours',
                name: 'مئة ساعة تطوع',
                tier: 'gold',
                imageUrl: 'hundred-hours-badge.png',
                criteria: { type: 'total_hours', count: 100 }
            }
        ];

        seedBadges.forEach(badge => {
            this.database.badges.set(badge.id, badge);
        });

        // Seed Events
        const seedEvents = [
            {
                id: '1',
                title: 'قافلة طبية في القاهرة',
                description: 'قافلة طبية مجانية لسكان القاهرة',
                type: 'caravan',
                startAt: new Date('2024-02-15T09:00:00'),
                endAt: new Date('2024-02-15T17:00:00'),
                location: 'ميدان التحرير، القاهرة',
                governorate: 'القاهرة',
                capacity: 50,
                status: 'approved',
                createdBy: '2',
                approvedBy: '1',
                hoursValue: 8,
                pointsPerHour: 10,
                transportMode: 'bus',
                needs: 'أطباء، ممرضين، أدوية'
            }
        ];

        seedEvents.forEach(event => {
            this.database.events.set(event.id, event);
        });
    }

    // Rate Limiting
    checkRateLimit(userId, action, limit = 10, windowMs = 60000) {
        const key = `${userId}:${action}`;
        const now = Date.now();
        const userLimits = this.rateLimits.get(key) || [];
        
        // Remove old entries
        const validLimits = userLimits.filter(time => now - time < windowMs);
        
        if (validLimits.length >= limit) {
            return false;
        }
        
        validLimits.push(now);
        this.rateLimits.set(key, validLimits);
        return true;
    }

    // Audit Logging
    logAudit(actorId, action, entity, entityId, before = null, after = null) {
        const audit = {
            id: Date.now().toString(),
            actorId,
            action,
            entity,
            entityId,
            before: before ? JSON.stringify(before) : null,
            after: after ? JSON.stringify(after) : null,
            createdAt: new Date()
        };
        
        this.database.audits.set(audit.id, audit);
        return audit;
    }
}

// Authentication Service
class AuthService {
    constructor(backend) {
        this.backend = backend;
    }

    hashPassword(password) {
        // In production, use bcrypt or Argon2
        return btoa(password + 'salt');
    }

    verifyPassword(password, hash) {
        return this.hashPassword(password) === hash;
    }

    generateJWT(user) {
        const payload = {
            userId: user.id,
            username: user.username,
            role: user.role,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + (15 * 60) // 15 minutes
        };
        
        // In production, use a proper JWT library
        return btoa(JSON.stringify(payload));
    }

    verifyJWT(token) {
        try {
            const payload = JSON.parse(atob(token));
            const now = Math.floor(Date.now() / 1000);
            
            if (payload.exp < now) {
                return null;
            }
            
            return payload;
        } catch (error) {
            return null;
        }
    }

    async login(username, password) {
        // Rate limiting
        if (!this.backend.checkRateLimit('login', 'login', 5, 300000)) { // 5 attempts per 5 minutes
            throw new Error('Too many login attempts. Please try again later.');
        }

        // Find user
        const user = Array.from(this.backend.database.users.values())
            .find(u => u.username === username);

        if (!user || !this.verifyPassword(password, user.passwordHash)) {
            throw new Error('Invalid username or password');
        }

        if (user.status !== 'active') {
            throw new Error('Account is suspended');
        }

        // Generate JWT
        const token = this.generateJWT(user);
        
        // Log audit
        this.backend.logAudit(user.id, 'login', 'user', user.id);

        return {
            token,
            user: {
                id: user.id,
                username: user.username,
                name: user.name,
                role: user.role,
                governorate: user.governorate,
                isFirstLogin: user.isFirstLogin
            }
        };
    }

    async verifyToken(token) {
        const payload = this.verifyJWT(token);
        if (!payload) {
            throw new Error('Invalid or expired token');
        }

        const user = this.backend.database.users.get(payload.userId);
        if (!user || user.status !== 'active') {
            throw new Error('User not found or inactive');
        }

        return payload;
    }
}

// User Service
class UserService {
    constructor(backend) {
        this.backend = backend;
    }

    async getUserById(userId) {
        const user = this.backend.database.users.get(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Remove sensitive data
        const { passwordHash, ...safeUser } = user;
        return safeUser;
    }

    async updateUser(userId, updates) {
        const user = this.backend.database.users.get(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const before = { ...user };
        const after = { ...user, ...updates, updatedAt: new Date() };

        this.backend.database.users.set(userId, after);
        this.backend.logAudit(userId, 'update_user', 'user', userId, before, after);

        return this.getUserById(userId);
    }

    async suspendUser(userId, reason, actorId) {
        const user = this.backend.database.users.get(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const before = { ...user };
        const after = { ...user, status: 'suspended', updatedAt: new Date() };

        this.backend.database.users.set(userId, after);
        this.backend.logAudit(actorId, 'suspend_user', 'user', userId, before, after);

        return this.getUserById(userId);
    }

    async restoreUser(userId, actorId) {
        const user = this.backend.database.users.get(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const before = { ...user };
        const after = { ...user, status: 'active', updatedAt: new Date() };

        this.backend.database.users.set(userId, after);
        this.backend.logAudit(actorId, 'restore_user', 'user', userId, before, after);

        return this.getUserById(userId);
    }
}

// Post Service
class PostService {
    constructor(backend) {
        this.backend = backend;
    }

    async createPost(userId, postData) {
        const user = this.backend.database.users.get(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const post = {
            id: Date.now().toString(),
            authorId: userId,
            type: postData.type,
            title: postData.title,
            body: postData.body,
            media: postData.media || [],
            tags: postData.tags || [],
            status: 'pending',
            visibility: postData.visibility || 'public',
            createdAt: new Date(),
            approvedBy: null,
            rejectedReason: null
        };

        this.backend.database.posts.set(post.id, post);
        this.backend.logAudit(userId, 'create_post', 'post', post.id);

        return post;
    }

    async approvePost(postId, moderatorId) {
        const post = this.backend.database.posts.get(postId);
        if (!post) {
            throw new Error('Post not found');
        }

        const moderator = this.backend.database.users.get(moderatorId);
        if (!moderator || !['moderator', 'admin', 'superadmin'].includes(moderator.role)) {
            throw new Error('Unauthorized');
        }

        const before = { ...post };
        const after = { ...post, status: 'approved', approvedBy: moderatorId };

        this.backend.database.posts.set(postId, after);
        this.backend.logAudit(moderatorId, 'approve_post', 'post', postId, before, after);

        return after;
    }

    async rejectPost(postId, moderatorId, reason) {
        const post = this.backend.database.posts.get(postId);
        if (!post) {
            throw new Error('Post not found');
        }

        const moderator = this.backend.database.users.get(moderatorId);
        if (!moderator || !['moderator', 'admin', 'superadmin'].includes(moderator.role)) {
            throw new Error('Unauthorized');
        }

        const before = { ...post };
        const after = { ...post, status: 'rejected', rejectedReason: reason };

        this.backend.database.posts.set(postId, after);
        this.backend.logAudit(moderatorId, 'reject_post', 'post', postId, before, after);

        return after;
    }

    async getPosts(filters = {}) {
        let posts = Array.from(this.backend.database.posts.values());

        // Apply filters
        if (filters.status) {
            posts = posts.filter(post => post.status === filters.status);
        }
        if (filters.type) {
            posts = posts.filter(post => post.type === filters.type);
        }
        if (filters.authorId) {
            posts = posts.filter(post => post.authorId === filters.authorId);
        }

        // Sort by creation date
        posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        return posts;
    }
}

// Event Service
class EventService {
    constructor(backend) {
        this.backend = backend;
    }

    async createEvent(userId, eventData) {
        const user = this.backend.database.users.get(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const event = {
            id: Date.now().toString(),
            title: eventData.title,
            description: eventData.description,
            type: eventData.type,
            startAt: new Date(eventData.startAt),
            endAt: new Date(eventData.endAt),
            location: eventData.location,
            governorate: eventData.governorate,
            capacity: eventData.capacity,
            status: 'pending',
            createdBy: userId,
            approvedBy: null,
            hoursValue: eventData.hoursValue,
            pointsPerHour: eventData.pointsPerHour || 10,
            transportMode: eventData.transportMode,
            needs: eventData.needs,
            createdAt: new Date()
        };

        this.backend.database.events.set(event.id, event);
        this.backend.logAudit(userId, 'create_event', 'event', event.id);

        return event;
    }

    async registerForEvent(eventId, userId) {
        const event = this.backend.database.events.get(eventId);
        if (!event) {
            throw new Error('Event not found');
        }

        if (event.status !== 'approved') {
            throw new Error('Event is not available for registration');
        }

        // Check capacity
        const registrations = Array.from(this.backend.database.eventRegistrations.values())
            .filter(reg => reg.eventId === eventId && reg.status === 'registered');
        
        if (registrations.length >= event.capacity) {
            throw new Error('Event is full');
        }

        // Check if already registered
        const existingRegistration = registrations.find(reg => reg.userId === userId);
        if (existingRegistration) {
            throw new Error('Already registered for this event');
        }

        const registration = {
            id: Date.now().toString(),
            eventId,
            userId,
            status: 'registered',
            checkinAt: null,
            checkoutAt: null,
            attendedHours: 0,
            createdAt: new Date()
        };

        this.backend.database.eventRegistrations.set(registration.id, registration);
        this.backend.logAudit(userId, 'register_event', 'event_registration', registration.id);

        return registration;
    }

    async checkIn(eventId, userId, supervisorId, photoUrl = null, lat = null, lng = null) {
        const event = this.backend.database.events.get(eventId);
        if (!event) {
            throw new Error('Event not found');
        }

        const registration = Array.from(this.backend.database.eventRegistrations.values())
            .find(reg => reg.eventId === eventId && reg.userId === userId);

        if (!registration) {
            throw new Error('User not registered for this event');
        }

        if (registration.status !== 'registered') {
            throw new Error('Invalid check-in status');
        }

        const scan = {
            id: Date.now().toString(),
            eventId,
            supervisorId,
            userId,
            action: 'checkin',
            timestamp: new Date(),
            source: 'qr',
            photoUrl,
            lat,
            lng
        };

        this.backend.database.attendanceScans.set(scan.id, scan);

        // Update registration
        const before = { ...registration };
        const after = { ...registration, status: 'checked_in', checkinAt: new Date() };
        this.backend.database.eventRegistrations.set(registration.id, after);

        this.backend.logAudit(supervisorId, 'checkin', 'attendance_scan', scan.id);

        return scan;
    }

    async checkOut(eventId, userId, supervisorId) {
        const event = this.backend.database.events.get(eventId);
        if (!event) {
            throw new Error('Event not found');
        }

        const registration = Array.from(this.backend.database.eventRegistrations.values())
            .find(reg => reg.eventId === eventId && reg.userId === userId);

        if (!registration) {
            throw new Error('User not registered for this event');
        }

        if (registration.status !== 'checked_in') {
            throw new Error('User not checked in');
        }

        const scan = {
            id: Date.now().toString(),
            eventId,
            supervisorId,
            userId,
            action: 'checkout',
            timestamp: new Date(),
            source: 'qr'
        };

        this.backend.database.attendanceScans.set(scan.id, scan);

        // Calculate hours
        const checkinTime = registration.checkinAt;
        const checkoutTime = new Date();
        const hours = this.calculateAttendedHours(checkinTime, checkoutTime);

        // Update registration
        const before = { ...registration };
        const after = { 
            ...registration, 
            status: 'checked_out', 
            checkoutAt: checkoutTime,
            attendedHours: hours
        };
        this.backend.database.eventRegistrations.set(registration.id, after);

        // Award points
        const points = Math.round(hours * event.pointsPerHour);
        await this.backend.pointsService.awardPoints(userId, points, 'hours', 'event', eventId);

        this.backend.logAudit(supervisorId, 'checkout', 'attendance_scan', scan.id);

        return { scan, hours, points };
    }

    calculateAttendedHours(checkinTime, checkoutTime) {
        if (!checkinTime || !checkoutTime) return 0;
        
        const hours = (checkoutTime - checkinTime) / (1000 * 60 * 60);
        
        // Round to nearest 15 minutes (0.25 hours)
        return Math.round(hours * 4) / 4;
    }
}

// Points Service
class PointsService {
    constructor(backend) {
        this.backend = backend;
    }

    async awardPoints(userId, points, reason, refType, refId) {
        const user = this.backend.database.users.get(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Check help credit limits
        if (reason === 'help' && !this.canEarnHelpCredit(userId)) {
            throw new Error('Help credit limit reached');
        }

        const entry = {
            id: Date.now().toString(),
            userId,
            delta: points,
            reason,
            refType,
            refId,
            createdAt: new Date()
        };

        this.backend.database.pointsLedger.set(entry.id, entry);
        this.backend.logAudit(userId, 'award_points', 'points_ledger', entry.id);

        return entry;
    }

    async deductPoints(userId, points, reason, refType, refId) {
        const user = this.backend.database.users.get(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const currentPoints = await this.getUserPoints(userId);
        if (currentPoints < points) {
            throw new Error('Insufficient points');
        }

        const entry = {
            id: Date.now().toString(),
            userId,
            delta: -points,
            reason,
            refType,
            refId,
            createdAt: new Date()
        };

        this.backend.database.pointsLedger.set(entry.id, entry);
        this.backend.logAudit(userId, 'deduct_points', 'points_ledger', entry.id);

        return entry;
    }

    async getUserPoints(userId) {
        const entries = Array.from(this.backend.database.pointsLedger.values())
            .filter(entry => entry.userId === userId);

        return entries.reduce((total, entry) => total + entry.delta, 0);
    }

    async getUserRank(userId) {
        const points = await this.getUserPoints(userId);
        
        if (points >= 1500) return { rank: 'platinum', name: 'بلاتيني' };
        if (points >= 600) return { rank: 'gold', name: 'ذهبي' };
        if (points >= 200) return { rank: 'silver', name: 'فضي' };
        return { rank: 'bronze', name: 'برونزي' };
    }

    canEarnHelpCredit(userId) {
        const entries = Array.from(this.backend.database.pointsLedger.values())
            .filter(entry => entry.userId === userId && entry.reason === 'help');
        
        const recentEntries = entries.filter(entry => {
            const daysAgo = (Date.now() - entry.createdAt.getTime()) / (1000 * 60 * 60 * 24);
            return daysAgo <= 20;
        });

        return recentEntries.length < 2;
    }

    async getLeaderboard(metric = 'points', period = 'all') {
        const users = Array.from(this.backend.database.users.values())
            .filter(user => user.status === 'active');

        const leaderboard = [];

        for (const user of users) {
            let score = 0;

            if (metric === 'points') {
                score = await this.getUserPoints(user.id);
            } else if (metric === 'hours') {
                const registrations = Array.from(this.backend.database.eventRegistrations.values())
                    .filter(reg => reg.userId === user.id && reg.attendedHours > 0);
                score = registrations.reduce((total, reg) => total + reg.attendedHours, 0);
            }

            leaderboard.push({
                userId: user.id,
                username: user.username,
                name: user.name,
                score,
                rank: await this.getUserRank(user.id)
            });
        }

        leaderboard.sort((a, b) => b.score - a.score);
        return leaderboard.slice(0, 50); // Top 50
    }
}

// Certificate Service
class CertificateService {
    constructor(backend) {
        this.backend = backend;
        this.templates = [
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
            }
        ];
    }

    async generateCertificate(userId, templateId, userData) {
        const user = this.backend.database.users.get(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const template = this.templates.find(t => t.id === templateId);
        if (!template) {
            throw new Error('Template not found');
        }

        const certificate = {
            id: Date.now().toString(),
            userId,
            templateId,
            nameOnCert: userData.name || user.name,
            targetName: template.targetName,
            issueDate: new Date(),
            hours: userData.hours || 0,
            eventIds: userData.eventIds || [],
            status: 'generated',
            verifierQR: this.backend.qrService.generateToken('certificate', Date.now()),
            pdfUrl: null // Would be generated by PDF service
        };

        this.backend.database.certificates.set(certificate.id, certificate);
        this.backend.logAudit(userId, 'generate_certificate', 'certificate', certificate.id);

        return certificate;
    }

    async getCertificates(userId) {
        return Array.from(this.backend.database.certificates.values())
            .filter(cert => cert.userId === userId)
            .sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate));
    }

    async verifyCertificate(certificateId) {
        const certificate = this.backend.database.certificates.get(certificateId);
        if (!certificate) {
            throw new Error('Certificate not found');
        }

        const user = this.backend.database.users.get(certificate.userId);
        if (!user) {
            throw new Error('User not found');
        }

        return {
            certificate,
            user: {
                id: user.id,
                name: user.name,
                governorate: user.governorate
            }
        };
    }
}

// Moderation Service
class ModerationService {
    constructor(backend) {
        this.backend = backend;
    }

    async getModerationQueue(type = 'posts') {
        if (type === 'posts') {
            return Array.from(this.backend.database.posts.values())
                .filter(post => post.status === 'pending')
                .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        } else if (type === 'events') {
            return Array.from(this.backend.database.events.values())
                .filter(event => event.status === 'pending')
                .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        }

        return [];
    }

    async getAuditLog(filters = {}) {
        let audits = Array.from(this.backend.database.audits.values());

        if (filters.actorId) {
            audits = audits.filter(audit => audit.actorId === filters.actorId);
        }
        if (filters.entity) {
            audits = audits.filter(audit => audit.entity === filters.entity);
        }
        if (filters.action) {
            audits = audits.filter(audit => audit.action === filters.action);
        }

        return audits.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
}

// QR Service
class QRService {
    constructor(backend) {
        this.backend = backend;
    }

    generateToken(ownerType, ownerId, scope = 'profile-photo') {
        const token = {
            id: Date.now().toString(),
            ownerType,
            ownerId,
            token: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
            scope,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
        };

        this.backend.database.qrTokens.set(token.id, token);
        return token.token;
    }

    verifyToken(tokenString) {
        const token = Array.from(this.backend.database.qrTokens.values())
            .find(t => t.token === tokenString);

        if (!token) {
            throw new Error('Invalid token');
        }

        if (token.expiresAt < new Date()) {
            throw new Error('Token expired');
        }

        return token;
    }
}

// Initialize backend simulation
const backend = new BackendSimulation();

// Export for use in frontend
window.backend = backend;
