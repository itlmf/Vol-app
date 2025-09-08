// Core Backend Simulation for LifeMakers Egypt
class BackendCore {
    constructor() {
        this.database = {
            users: new Map(),
            posts: new Map(),
            events: new Map(),
            pointsLedger: new Map(),
            audits: new Map()
        };
        this.initializeSecurity();
        this.loadSeedData();
    }

    initializeSecurity() {
        this.jwtSecret = 'lifemakers-secret-key-2024';
        this.rateLimits = new Map();
    }

    loadSeedData() {
        // Seed Users with proper hashing
        const seedUsers = [
            {
                id: '1',
                username: 'Admin',
                passwordHash: this.hashPassword('Admin55'),
                role: 'superadmin',
                name: 'مدير النظام',
                governorate: 'القاهرة',
                status: 'active',
                isFirstLogin: false
            },
            {
                id: '2',
                username: 'Ibrahim',
                passwordHash: this.hashPassword('Hima11'),
                role: 'admin',
                name: 'إبراهيم أحمد',
                governorate: 'الإسكندرية',
                status: 'active',
                isFirstLogin: false
            },
            {
                id: '3',
                username: 'Hamed',
                passwordHash: this.hashPassword('Ha11'),
                role: 'admin',
                name: 'حامد محمد',
                governorate: 'الجيزة',
                status: 'active',
                isFirstLogin: false
            },
            {
                id: '4',
                username: 'Walaa',
                passwordHash: this.hashPassword('Lol123'),
                role: 'moderator',
                name: 'ولاء علي',
                governorate: 'الشرقية',
                status: 'active',
                isFirstLogin: false
            },
            {
                id: '5',
                username: 'Odai',
                passwordHash: this.hashPassword('1111'),
                role: 'user',
                name: 'عدي سالم',
                governorate: 'القاهرة',
                status: 'active',
                isFirstLogin: false
            }
        ];

        seedUsers.forEach(user => {
            this.database.users.set(user.id, user);
        });
    }

    // Authentication Methods
    hashPassword(password) {
        return btoa(password + 'salt'); // In production, use bcrypt
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
        return btoa(JSON.stringify(payload));
    }

    verifyJWT(token) {
        try {
            const payload = JSON.parse(atob(token));
            const now = Math.floor(Date.now() / 1000);
            return payload.exp >= now ? payload : null;
        } catch (error) {
            return null;
        }
    }

    async login(username, password) {
        const user = Array.from(this.database.users.values())
            .find(u => u.username === username);

        if (!user || !this.verifyPassword(password, user.passwordHash)) {
            throw new Error('Invalid username or password');
        }

        if (user.status !== 'active') {
            throw new Error('Account is suspended');
        }

        const token = this.generateJWT(user);
        this.logAudit(user.id, 'login', 'user', user.id);

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

    // RBAC Methods
    hasPermission(userRole, capability) {
        const roleCapabilities = {
            user: ['view_feeds', 'create_posts', 'register_events', 'earn_points'],
            moderator: ['view_feeds', 'create_posts', 'register_events', 'earn_points', 'approve_posts', 'delete_content'],
            admin: ['view_feeds', 'create_posts', 'register_events', 'earn_points', 'approve_posts', 'delete_content', 'manage_rewards', 'manage_certificates'],
            superadmin: ['view_feeds', 'create_posts', 'register_events', 'earn_points', 'approve_posts', 'delete_content', 'manage_rewards', 'manage_certificates', 'manage_roles', 'system_settings']
        };

        return roleCapabilities[userRole]?.includes(capability) || false;
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

    // Rate Limiting
    checkRateLimit(key, limit = 10, windowMs = 60000) {
        const now = Date.now();
        const userLimits = this.rateLimits.get(key) || [];
        const validLimits = userLimits.filter(time => now - time < windowMs);
        
        if (validLimits.length >= limit) {
            return false;
        }
        
        validLimits.push(now);
        this.rateLimits.set(key, validLimits);
        return true;
    }
}

// Initialize backend
window.backend = new BackendCore();
