// نظام إدارة المستخدمين
class UserManager {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.init();
    }

    init() {
        // إنشاء مستخدم افتراضي للتجربة
        if (this.users.length === 0) {
            this.users.push({
                id: 1,
                username: 'test',
                password: '123456'
            });
            this.saveUsers();
        }
    }

    saveUsers() {
        localStorage.setItem('users', JSON.stringify(this.users));
    }

    saveCurrentUser() {
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    }

    register(username, password) {
        // التحقق من عدم وجود المستخدم
        if (this.users.find(u => u.username === username)) {
            return { success: false, message: 'اسم المستخدم موجود بالفعل' };
        }

        const newUser = {
            id: Date.now(),
            username,
            password
        };

        this.users.push(newUser);
        this.saveUsers();
        return { success: true, message: 'تم التسجيل بنجاح' };
    }

    login(username, password) {
        const user = this.users.find(u => u.username === username && u.password === password);
        if (user) {
            this.currentUser = user;
            this.saveCurrentUser();
            return { success: true, message: 'تم تسجيل الدخول بنجاح', user };
        }
        return { success: false, message: 'اسم المستخدم أو كلمة المرور غير صحيحة' };
    }

    logout() {
        this.currentUser = null;
        this.saveCurrentUser();
        window.location.href = 'index.html';
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    getCurrentUser() {
        return this.currentUser;
    }
}

// إنشاء مدير المستخدمين
const userManager = new UserManager();

// إدارة النماذج
document.addEventListener('DOMContentLoaded', function() {
    // نموذج تسجيل الدخول
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            const result = userManager.login(username, password);
            if (result.success) {
                alert(result.message);
                window.location.href = 'index.html';
            } else {
                alert(result.message);
            }
        });
    }

    // نموذج التسجيل
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            const result = userManager.register(username, password);
            if (result.success) {
                alert(result.message);
                window.location.href = 'login.html';
            } else {
                alert(result.message);
            }
        });
    }

    // تحديث واجهة المستخدم بناءً على حالة تسجيل الدخول
    updateUI();
});

// تحديث واجهة المستخدم
function updateUI() {
    const currentUser = userManager.getCurrentUser();
    const authSection = document.querySelector('.auth');
    
    if (authSection) {
        if (currentUser) {
            authSection.innerHTML = `
                <div class="user-info">
                    <span>مرحباً، ${currentUser.username}</span>
                    <button class="btn" onclick="logout()">تسجيل الخروج</button>
                </div>
            `;
        } else {
            authSection.innerHTML = `
                <button class="btn" type="button" onclick="window.location.href='login.html'">تسجيل الدخول</button>
            `;
        }
    }
}

// تسجيل الخروج
function logout() {
    userManager.logout();
}

// التحقق من تسجيل الدخول قبل الوصول للصفحات المحمية
function checkAuth() {
    if (!userManager.isLoggedIn()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// إضافة مستخدم تجريبي إذا لم يكن موجود
if (userManager.users.length === 0) {
    userManager.register('test', '123456');
}
