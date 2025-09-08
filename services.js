// Service Layer for LifeMakers Egypt Platform

// Post Service
class PostService {
    constructor(backend) {
        this.backend = backend;
    }

    async createPost(userId, postData) {
        if (!this.backend.hasPermission(currentUserRole, 'create_posts')) {
            throw new Error('Unauthorized: Cannot create posts');
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
        if (!this.backend.hasPermission(currentUserRole, 'approve_posts')) {
            throw new Error('Unauthorized: Cannot approve posts');
        }

        const post = this.backend.database.posts.get(postId);
        if (!post) {
            throw new Error('Post not found');
        }

        const before = { ...post };
        const after = { ...post, status: 'approved', approvedBy: moderatorId };

        this.backend.database.posts.set(postId, after);
        this.backend.logAudit(moderatorId, 'approve_post', 'post', postId, before, after);

        return after;
    }

    async rejectPost(postId, moderatorId, reason) {
        if (!this.backend.hasPermission(currentUserRole, 'approve_posts')) {
            throw new Error('Unauthorized: Cannot reject posts');
        }

        const post = this.backend.database.posts.get(postId);
        if (!post) {
            throw new Error('Post not found');
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

    async getModerationQueue() {
        if (!this.backend.hasPermission(currentUserRole, 'approve_posts')) {
            throw new Error('Unauthorized: Cannot view moderation queue');
        }

        return Array.from(this.backend.database.posts.values())
            .filter(post => post.status === 'pending')
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }
}

// Event Service
class EventService {
    constructor(backend) {
        this.backend = backend;
    }

    async createEvent(userId, eventData) {
        if (!this.backend.hasPermission(currentUserRole, 'create_posts')) {
            throw new Error('Unauthorized: Cannot create events');
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
        if (!this.backend.hasPermission(currentUserRole, 'register_events')) {
            throw new Error('Unauthorized: Cannot register for events');
        }

        const event = this.backend.database.events.get(eventId);
        if (!event) {
            throw new Error('Event not found');
        }

        if (event.status !== 'approved') {
            throw new Error('Event is not available for registration');
        }

        // Check capacity
        const registrations = Array.from(this.backend.database.eventRegistrations?.values() || [])
            .filter(reg => reg.eventId === eventId && reg.status === 'registered');
        
        if (registrations.length >= event.capacity) {
            throw new Error('Event is full');
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

        if (!this.backend.database.eventRegistrations) {
            this.backend.database.eventRegistrations = new Map();
        }
        
        this.backend.database.eventRegistrations.set(registration.id, registration);
        this.backend.logAudit(userId, 'register_event', 'event_registration', registration.id);

        return registration;
    }

    async getEvents(filters = {}) {
        let events = Array.from(this.backend.database.events.values());

        if (filters.status) {
            events = events.filter(event => event.status === filters.status);
        }
        if (filters.type) {
            events = events.filter(event => event.type === filters.type);
        }
        if (filters.governorate) {
            events = events.filter(event => event.governorate === filters.governorate);
        }

        events.sort((a, b) => new Date(a.startAt) - new Date(b.startAt));
        return events;
    }
}

// Points Service
class PointsService {
    constructor(backend) {
        this.backend = backend;
    }

    async awardPoints(userId, points, reason, refType, refId) {
        if (!this.backend.hasPermission(currentUserRole, 'earn_points')) {
            throw new Error('Unauthorized: Cannot award points');
        }

        // Check help credit limits
        if (reason === 'help' && !this.canEarnHelpCredit(userId)) {
            throw new Error('Help credit limit reached (max 2 per 20 days)');
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

    async getLeaderboard(metric = 'points') {
        const users = Array.from(this.backend.database.users.values())
            .filter(user => user.status === 'active');

        const leaderboard = [];

        for (const user of users) {
            let score = 0;

            if (metric === 'points') {
                score = await this.getUserPoints(user.id);
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
        return leaderboard.slice(0, 50);
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
            }
        ];
    }

    async generateCertificate(userId, templateId, userData) {
        if (!this.backend.hasPermission(currentUserRole, 'generate_instant_certificates')) {
            throw new Error('Unauthorized: Cannot generate certificates');
        }

        const template = this.templates.find(t => t.id === templateId);
        if (!template) {
            throw new Error('Template not found');
        }

        const certificate = {
            id: Date.now().toString(),
            userId,
            templateId,
            nameOnCert: userData.name || currentUser.name,
            targetName: template.targetName,
            issueDate: new Date(),
            hours: userData.hours || 0,
            eventIds: userData.eventIds || [],
            status: 'generated',
            verifierQR: this.generateQRToken('certificate', Date.now()),
            pdfUrl: null
        };

        if (!this.backend.database.certificates) {
            this.backend.database.certificates = new Map();
        }

        this.backend.database.certificates.set(certificate.id, certificate);
        this.backend.logAudit(userId, 'generate_certificate', 'certificate', certificate.id);

        return certificate;
    }

    generateQRToken(ownerType, ownerId) {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    async getCertificates(userId) {
        if (!this.backend.database.certificates) {
            return [];
        }

        return Array.from(this.backend.database.certificates.values())
            .filter(cert => cert.userId === userId)
            .sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate));
    }

    getTemplates() {
        return this.templates.filter(t => t.active);
    }
}

// Initialize services
window.postService = new PostService(window.backend);
window.eventService = new EventService(window.backend);
window.pointsService = new PointsService(window.backend);
window.certificateService = new CertificateService(window.backend);
