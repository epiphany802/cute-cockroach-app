class Cockroach {
    constructor(playground) {
        this.playground = playground;
        this.element = this.createElement();
        this.x = Math.random() * (playground.offsetWidth - 40);
        this.y = Math.random() * (playground.offsetHeight - 40);
        this.baseSpeed = 0.8 + Math.random() * 1.2; // 基础速度
        this.speedX = (Math.random() - 0.5) * this.baseSpeed * 2;
        this.speedY = (Math.random() - 0.5) * this.baseSpeed * 2;
        this.direction = Math.random() * 360;
        this.isAlive = true;
        this.isPaused = false;
        this.pauseTimer = 0;
        this.wiggleTimer = 0;
        this.scaredLevel = 0; // 恐惧等级

        this.updatePosition();
        this.startMoving();
        this.addEventListeners();
    }
    
    createElement() {
        const cockroach = document.createElement('div');
        cockroach.className = 'cockroach';
        
        const img = document.createElement('img');
        img.src = '/static/images/cockroach.svg';
        img.alt = '可爱的小蟑螂';
        
        cockroach.appendChild(img);
        this.playground.appendChild(cockroach);
        
        return cockroach;
    }
    
    updatePosition() {
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
        this.element.style.transform = `rotate(${this.direction}deg)`;
    }
    
    move() {
        if (!this.isAlive) return;

        // 处理暂停状态
        if (this.isPaused) {
            this.element.classList.add('paused');
            this.pauseTimer--;
            if (this.pauseTimer <= 0) {
                this.isPaused = false;
                this.element.classList.remove('paused');
                // 暂停结束后随机选择新方向
                this.direction = Math.random() * 360;
                this.speedX = Math.cos(this.direction * Math.PI / 180) * this.baseSpeed;
                this.speedY = Math.sin(this.direction * Math.PI / 180) * this.baseSpeed;
            }
            return;
        }

        // 随机暂停（模拟蟑螂停下来观察环境）
        if (Math.random() < 0.005) {
            this.isPaused = true;
            this.pauseTimer = 20 + Math.random() * 40; // 暂停1-3秒
            this.speedX = 0;
            this.speedY = 0;
            return;
        }

        // 随机改变方向（更频繁）
        if (Math.random() < 0.03) {
            this.direction += (Math.random() - 0.5) * 90;
            const speed = this.baseSpeed * (0.8 + Math.random() * 0.4);
            this.speedX = Math.cos(this.direction * Math.PI / 180) * speed;
            this.speedY = Math.sin(this.direction * Math.PI / 180) * speed;
        }

        // 恐惧等级逐渐降低
        if (this.scaredLevel > 0) {
            this.scaredLevel -= 0.02;
            this.element.classList.add('scared');
        } else {
            this.element.classList.remove('scared');
        }

        // 根据恐惧等级调整速度
        const fearMultiplier = 1 + this.scaredLevel;

        // 更新位置
        this.x += this.speedX * fearMultiplier;
        this.y += this.speedY * fearMultiplier;

        // 边界检测和反弹
        if (this.x <= 0 || this.x >= this.playground.offsetWidth - 40) {
            this.speedX = -this.speedX;
            this.direction = 180 - this.direction;
            this.x = Math.max(0, Math.min(this.playground.offsetWidth - 40, this.x));
            // 撞墙时增加一点恐惧
            this.scaredLevel = Math.min(2, this.scaredLevel + 0.3);
        }

        if (this.y <= 0 || this.y >= this.playground.offsetHeight - 40) {
            this.speedY = -this.speedY;
            this.direction = -this.direction;
            this.y = Math.max(0, Math.min(this.playground.offsetHeight - 40, this.y));
            // 撞墙时增加一点恐惧
            this.scaredLevel = Math.min(2, this.scaredLevel + 0.3);
        }

        this.updatePosition();

        // 随机摆动（更频繁）
        this.wiggleTimer++;
        if (this.wiggleTimer > 100 && Math.random() < 0.02) {
            this.element.classList.add('wiggle');
            this.wiggleTimer = 0;
            setTimeout(() => {
                this.element.classList.remove('wiggle');
            }, 500);
        }
    }
    
    startMoving() {
        this.moveInterval = setInterval(() => {
            this.move();
        }, 50);
    }
    
    addEventListeners() {
        this.element.addEventListener('click', () => {
            this.onClick();
        });

        this.element.addEventListener('mouseenter', () => {
            // 鼠标悬停时变得恐惧并快速逃跑
            this.scaredLevel = Math.min(3, this.scaredLevel + 1);
            this.isPaused = false;
            this.pauseTimer = 0;

            // 随机选择逃跑方向（远离鼠标）
            this.direction = Math.random() * 360;
            const escapeSpeed = this.baseSpeed * 2;
            this.speedX = Math.cos(this.direction * Math.PI / 180) * escapeSpeed;
            this.speedY = Math.sin(this.direction * Math.PI / 180) * escapeSpeed;
        });

        // 添加鼠标离开事件
        this.element.addEventListener('mouseleave', () => {
            // 鼠标离开后逐渐恢复正常速度
            setTimeout(() => {
                if (this.scaredLevel > 0) {
                    this.scaredLevel *= 0.7;
                }
            }, 500);
        });
    }
    
    onClick() {
        this.element.classList.add('clicked');

        // 点击后极度恐惧并快速逃跑
        this.scaredLevel = 3;
        this.isPaused = false;
        this.pauseTimer = 0;

        // 随机逃跑方向
        this.direction = Math.random() * 360;
        const panicSpeed = this.baseSpeed * 4;
        this.speedX = Math.cos(this.direction * Math.PI / 180) * panicSpeed;
        this.speedY = Math.sin(this.direction * Math.PI / 180) * panicSpeed;

        // 连续摆动表示恐慌
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                this.element.classList.add('wiggle');
                setTimeout(() => {
                    this.element.classList.remove('wiggle');
                }, 200);
            }, i * 250);
        }

        setTimeout(() => {
            this.element.classList.remove('clicked');
            // 恐惧状态持续一段时间
            setTimeout(() => {
                this.scaredLevel *= 0.5;
            }, 2000);
        }, 300);
    }
    
    destroy() {
        this.isAlive = false;
        clearInterval(this.moveInterval);
        this.element.remove();
    }
}

class CockroachManager {
    constructor() {
        this.playground = document.getElementById('playground');
        this.cockroaches = [];
        this.countElement = document.getElementById('count');
        
        this.initEventListeners();
        this.addInitialCockroaches();
    }
    
    initEventListeners() {
        document.getElementById('addCockroach').addEventListener('click', () => {
            this.addCockroach();
        });
        
        document.getElementById('clearAll').addEventListener('click', () => {
            this.clearAll();
        });
        
        // 双击添加蟑螂
        this.playground.addEventListener('dblclick', (e) => {
            this.addCockroachAt(e.offsetX, e.offsetY);
        });
    }
    
    addCockroach() {
        const cockroach = new Cockroach(this.playground);
        this.cockroaches.push(cockroach);
        this.updateCount();
    }
    
    addCockroachAt(x, y) {
        const cockroach = new Cockroach(this.playground);
        cockroach.x = x - 20;
        cockroach.y = y - 20;
        cockroach.updatePosition();
        this.cockroaches.push(cockroach);
        this.updateCount();
    }
    
    addInitialCockroaches() {
        // 初始添加3只小蟑螂
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                this.addCockroach();
            }, i * 500);
        }
    }
    
    clearAll() {
        this.cockroaches.forEach(cockroach => {
            cockroach.destroy();
        });
        this.cockroaches = [];
        this.updateCount();
    }
    
    updateCount() {
        this.countElement.textContent = this.cockroaches.length;
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new CockroachManager();
});
