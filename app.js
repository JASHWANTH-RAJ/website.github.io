// Network Animation Canvas
class NetworkAnimation {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.nodes = [];
        this.connections = [];
        this.animationId = null;
        
        this.init();
        this.animate();
        this.handleResize();
    }
    
    init() {
        this.resize();
        this.createNodes();
        this.createConnections();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createNodes() {
        const nodeCount = Math.floor((this.canvas.width * this.canvas.height) / 15000);
        this.nodes = [];
        
        for (let i = 0; i < nodeCount; i++) {
            this.nodes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }
    
    createConnections() {
        this.connections = [];
        
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const dx = this.nodes[i].x - this.nodes[j].x;
                const dy = this.nodes[i].y - this.nodes[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    this.connections.push({
                        nodeA: this.nodes[i],
                        nodeB: this.nodes[j],
                        distance: distance
                    });
                }
            }
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw nodes
        this.nodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;
            
            // Boundary check
            if (node.x < 0 || node.x > this.canvas.width) node.vx *= -1;
            if (node.y < 0 || node.y > this.canvas.height) node.vy *= -1;
            
            // Draw node
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(0, 207, 255, ${node.opacity})`;
            this.ctx.fill();
        });
        
        // Update and draw connections
        this.connections.forEach(conn => {
            const dx = conn.nodeA.x - conn.nodeB.x;
            const dy = conn.nodeA.y - conn.nodeB.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 120) {
                const opacity = (120 - distance) / 120 * 0.3;
                
                this.ctx.beginPath();
                this.ctx.moveTo(conn.nodeA.x, conn.nodeA.y);
                this.ctx.lineTo(conn.nodeB.x, conn.nodeB.y);
                this.ctx.strokeStyle = `rgba(0, 207, 255, ${opacity})`;
                this.ctx.lineWidth = 1;
                this.ctx.stroke();
            }
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    handleResize() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createNodes();
            this.createConnections();
        });
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Image Loading Manager
class ImageManager {
    constructor() {
        this.initImageHandling();
    }
    
    initImageHandling() {
        // Handle hero profile image
        const profileImage = document.getElementById('profileImage');
        const profileFallback = document.getElementById('profileFallback');
        
        if (profileImage && profileFallback) {
            this.setupImageWithFallback(profileImage, profileFallback, 'Hero Profile');
        }
        
        // Handle about section image
        const aboutImage = document.getElementById('aboutImage');
        const aboutFallback = document.getElementById('aboutFallback');
        
        if (aboutImage && aboutFallback) {
            this.setupImageWithFallback(aboutImage, aboutFallback, 'About Profile');
        }
    }
    
    setupImageWithFallback(imgElement, fallbackElement, context) {
        // Set loading state
        imgElement.classList.add('loading');
        
        const handleImageLoad = () => {
            imgElement.classList.remove('loading', 'error');
            fallbackElement.style.opacity = '0';
            console.log(`✅ ${context} image loaded successfully`);
        };
        
        const handleImageError = () => {
            imgElement.classList.remove('loading');
            imgElement.classList.add('error');
            fallbackElement.style.opacity = '1';
            console.warn(`⚠️ ${context} image failed to load, showing fallback`);
        };
        
        // Check if image is already loaded (cached)
        if (imgElement.complete) {
            if (imgElement.naturalWidth && imgElement.naturalHeight) {
                handleImageLoad();
            } else {
                handleImageError();
            }
        } else {
            imgElement.addEventListener('load', handleImageLoad);
            imgElement.addEventListener('error', handleImageError);
        }
        
        // Add lazy loading optimization
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Force image refresh if needed
                        if (imgElement.classList.contains('error')) {
                            setTimeout(() => {
                                imgElement.src = imgElement.src;
                            }, 100);
                        }
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(imgElement);
        }
    }
}

// Main Portfolio Application Class
class PortfolioApp {
    constructor() {
        this.networkAnimation = null;
        this.imageManager = null;
        this.currentTheme = 'dark';
        this.skillBarsAnimated = false;
        this.languageBarsAnimated = false;
        
        this.init();
    }
    
    init() {
        this.initNetworkBackground();
        this.initImageHandling();
        this.initNavigation();
        this.initThemeToggle();
        this.initMobileMenu();
        this.initScrollAnimations();
        this.initContactForm();
        this.initScrollToTop();
        this.initParallaxEffects();
        
        // Set initial theme
        this.setTheme('dark');
        
        // Initialize loading animation
        this.initPageLoad();
    }
    
    initNetworkBackground() {
        const canvas = document.getElementById('networkCanvas');
        if (canvas) {
            this.networkAnimation = new NetworkAnimation(canvas);
        }
    }
    
    initImageHandling() {
        this.imageManager = new ImageManager();
    }
    
    initNavigation() {
        // Get all navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    // Calculate offset for fixed navbar
                    const navbar = document.querySelector('.navbar');
                    const navbarHeight = navbar ? navbar.offsetHeight : 80;
                    const targetPosition = targetSection.offsetTop - navbarHeight - 20;
                    
                    // Smooth scroll to target
                    window.scrollTo({
                        top: Math.max(0, targetPosition),
                        behavior: 'smooth'
                    });
                    
                    // Update active link immediately
                    this.updateActiveNavLink(link);
                    
                    // Close mobile menu if open
                    const navMenu = document.getElementById('navMenu');
                    const mobileToggle = document.getElementById('mobileMenuToggle');
                    if (navMenu && navMenu.classList.contains('mobile-open')) {
                        navMenu.classList.remove('mobile-open');
                        mobileToggle.classList.remove('active');
                    }
                }
            });
        });
        
        // Handle other anchor links (CTA buttons, etc.)
        const otherLinks = document.querySelectorAll('a[href^="#"]:not(.nav-link)');
        otherLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const navbar = document.querySelector('.navbar');
                    const navbarHeight = navbar ? navbar.offsetHeight : 80;
                    const targetPosition = targetSection.offsetTop - navbarHeight - 20;
                    
                    window.scrollTo({
                        top: Math.max(0, targetPosition),
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // Update active navigation on scroll
        window.addEventListener('scroll', this.debounce(() => {
            this.updateNavigationOnScroll();
            this.updateNavbarBackground();
        }, 10));
    }
    
    updateActiveNavLink(activeLink) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }
    
    updateNavigationOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        const navbar = document.querySelector('.navbar');
        const navbarHeight = navbar ? navbar.offsetHeight : 80;
        const scrollPosition = window.scrollY + navbarHeight + 100;
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = sectionId;
            }
        });
        
        // Update active nav link
        if (currentSection) {
            const activeLink = document.querySelector(`.nav-link[href="#${currentSection}"]`);
            if (activeLink && !activeLink.classList.contains('active')) {
                this.updateActiveNavLink(activeLink);
            }
        }
    }
    
    updateNavbarBackground() {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;
        
        if (window.scrollY > 50) {
            navbar.style.background = this.currentTheme === 'dark' 
                ? 'rgba(11, 15, 20, 0.98)' 
                : 'rgba(255, 255, 255, 0.98)';
            navbar.style.backdropFilter = 'blur(15px)';
        } else {
            navbar.style.background = this.currentTheme === 'dark' 
                ? 'rgba(11, 15, 20, 0.95)' 
                : 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        }
    }
    
    initThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        const themeIcon = themeToggle ? themeToggle.querySelector('.theme-icon') : null;
        
        if (!themeToggle || !themeIcon) return;
        
        themeToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Toggle theme
            this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
            
            // Apply theme
            this.setTheme(this.currentTheme);
            
            // Update icon
            themeIcon.textContent = this.currentTheme === 'dark' ? '🌙' : '☀️';
            
            // Show feedback
            this.showNotification(`Switched to ${this.currentTheme} mode`, 'info');
        });
    }
    
    setTheme(theme) {
        // Update data attributes
        document.body.setAttribute('data-color-scheme', theme);
        document.documentElement.setAttribute('data-color-scheme', theme);
        
        // Update CSS custom properties for immediate effect
        const root = document.documentElement;
        
        if (theme === 'light') {
            root.style.setProperty('--midnight-black', '#FFFFFF');
            root.style.setProperty('--dark-surface', '#F8F9FA');
            root.style.setProperty('--darker-surface', '#F1F3F4');
            root.style.setProperty('--text-primary', '#0B0F14');
            root.style.setProperty('--text-secondary', '#4A5568');
            root.style.setProperty('--text-muted', 'rgba(74, 85, 104, 0.7)');
        } else {
            root.style.setProperty('--midnight-black', '#0B0F14');
            root.style.setProperty('--dark-surface', '#151922');
            root.style.setProperty('--darker-surface', '#0F1319');
            root.style.setProperty('--text-primary', '#FFFFFF');
            root.style.setProperty('--text-secondary', '#C0C0C0');
            root.style.setProperty('--text-muted', 'rgba(192, 192, 192, 0.7)');
        }
        
        // Store preference
        try {
            localStorage.setItem('preferred-theme', theme);
        } catch (e) {
            console.warn('Could not save theme preference:', e);
        }
        
        this.currentTheme = theme;
        
        // Update navbar background based on new theme
        this.updateNavbarBackground();
    }
    
    initMobileMenu() {
        const mobileToggle = document.getElementById('mobileMenuToggle');
        const navMenu = document.getElementById('navMenu');
        
        if (mobileToggle && navMenu) {
            mobileToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                navMenu.classList.toggle('mobile-open');
                mobileToggle.classList.toggle('active');
            });
            
            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!mobileToggle.contains(e.target) && !navMenu.contains(e.target)) {
                    navMenu.classList.remove('mobile-open');
                    mobileToggle.classList.remove('active');
                }
            });
        }
    }
    
    initScrollAnimations() {
        // Intersection Observer for fade-in animations
        const observerOptions = {
            root: null,
            rootMargin: '-20px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Trigger skill bar animations
                    if (entry.target.classList.contains('skills')) {
                        setTimeout(() => this.animateSkillBars(), 300);
                    }
                    
                    // Trigger language bar animations
                    if (entry.target.classList.contains('about')) {
                        setTimeout(() => this.animateLanguageBars(), 300);
                    }
                }
            });
        }, observerOptions);
        
        // Observe sections for animations
        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });
        
        // Observe individual elements
        document.querySelectorAll('.timeline-item, .achievement-card, .skill-category').forEach(element => {
            observer.observe(element);
        });
    }
    
    animateSkillBars() {
        if (this.skillBarsAnimated) return;
        
        const skillBars = document.querySelectorAll('.skill-progress');
        
        skillBars.forEach((bar, index) => {
            const targetWidth = bar.getAttribute('data-width');
            
            setTimeout(() => {
                bar.style.width = targetWidth + '%';
            }, index * 150);
        });
        
        this.skillBarsAnimated = true;
    }
    
    animateLanguageBars() {
        if (this.languageBarsAnimated) return;
        
        const languageBars = document.querySelectorAll('.language-progress');
        
        languageBars.forEach((bar, index) => {
            const targetWidth = bar.getAttribute('data-width');
            
            setTimeout(() => {
                bar.style.width = targetWidth + '%';
            }, index * 200);
        });
        
        this.languageBarsAnimated = true;
    }
    
    initContactForm() {
        const form = document.getElementById('contactForm');
        
        if (!form) return;
        
        // Initialize form controls
        const formControls = form.querySelectorAll('.form-control');
        formControls.forEach(control => {
            // Ensure form controls are properly initialized
            control.addEventListener('input', () => {
                if (control.value.trim()) {
                    control.parentElement.classList.add('focused');
                } else {
                    control.parentElement.classList.remove('focused');
                }
            });
            
            control.addEventListener('focus', () => {
                control.parentElement.classList.add('focused');
            });
            
            control.addEventListener('blur', () => {
                if (!control.value.trim()) {
                    control.parentElement.classList.remove('focused');
                }
            });
        });
        
        // Handle form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Get form data
            const formData = new FormData(form);
            const data = {
                name: formData.get('name') ? formData.get('name').toString().trim() : '',
                email: formData.get('email') ? formData.get('email').toString().trim() : '',
                subject: formData.get('subject') ? formData.get('subject').toString().trim() : '',
                message: formData.get('message') ? formData.get('message').toString().trim() : ''
            };
            
            // Validate and submit form
            if (this.validateForm(data)) {
                this.submitContactForm(data);
            }
        });
    }
    
    validateForm(data) {
        const { name, email, subject, message } = data;
        
        // Check required fields
        if (!name) {
            this.showNotification('Please enter your name.', 'error');
            document.getElementById('name').focus();
            return false;
        }
        
        if (!email) {
            this.showNotification('Please enter your email address.', 'error');
            document.getElementById('email').focus();
            return false;
        }
        
        if (!subject) {
            this.showNotification('Please enter a subject.', 'error');
            document.getElementById('subject').focus();
            return false;
        }
        
        if (!message) {
            this.showNotification('Please enter your message.', 'error');
            document.getElementById('message').focus();
            return false;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showNotification('Please enter a valid email address.', 'error');
            document.getElementById('email').focus();
            return false;
        }
        
        // Check minimum lengths
        if (name.length < 2) {
            this.showNotification('Name must be at least 2 characters long.', 'error');
            document.getElementById('name').focus();
            return false;
        }
        
        if (message.length < 10) {
            this.showNotification('Message must be at least 10 characters long.', 'error');
            document.getElementById('message').focus();
            return false;
        }
        
        return true;
    }
    
    submitContactForm(data) {
        const submitBtn = document.querySelector('#contactForm button[type="submit"]');
        if (!submitBtn) return;
        
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
        
        // Create mailto URL with proper formatting
        const { name, email, subject, message } = data;
        const emailBody = `Hello Jashwanth,\n\n${message}\n\nBest regards,\n${name}\nEmail: ${email}`;
        const mailtoUrl = `mailto:iamjashuraj@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
        
        // Delay to show the loading state, then open email client
        setTimeout(() => {
            try {
                // Try to open email client
                const emailLink = document.createElement('a');
                emailLink.href = mailtoUrl;
                emailLink.style.display = 'none';
                document.body.appendChild(emailLink);
                emailLink.click();
                document.body.removeChild(emailLink);
                
                // Show success message
                this.showNotification('Email client opened! Your message is ready to send.', 'success');
                
                // Reset form after successful mailto
                setTimeout(() => {
                    const form = document.getElementById('contactForm');
                    if (form) {
                        form.reset();
                        
                        // Remove focused class from form groups
                        form.querySelectorAll('.form-group').forEach(group => {
                            group.classList.remove('focused');
                        });
                    }
                }, 500);
                
            } catch (error) {
                console.warn('Mailto failed:', error);
                
                // Fallback: show email details for manual copy
                this.showNotification('Please copy the email details to send manually: iamjashuraj@gmail.com', 'info');
                
                // Create a text area with the email content for easy copying
                const textArea = document.createElement('textarea');
                textArea.value = `To: iamjashuraj@gmail.com\nSubject: ${subject}\n\nHello Jashwanth,\n\n${message}\n\nBest regards,\n${name}\nEmail: ${email}`;
                textArea.style.position = 'fixed';
                textArea.style.top = '-9999px';
                document.body.appendChild(textArea);
                textArea.select();
                
                try {
                    document.execCommand('copy');
                    this.showNotification('Email content copied to clipboard!', 'success');
                } catch (copyError) {
                    console.warn('Copy failed:', copyError);
                }
                
                document.body.removeChild(textArea);
            } finally {
                // Reset button state
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
            }
        }, 800);
    }
    
    showNotification(message, type = 'info') {
        // Remove existing notifications
        document.querySelectorAll('.notification').forEach(n => n.remove());
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.textContent = message;
        
        // Style notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '600',
            fontSize: '14px',
            zIndex: '10000',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            maxWidth: '350px',
            wordWrap: 'break-word',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
        });
        
        // Set background based on type
        const colors = {
            success: '#39FF14',
            error: '#FF4444',
            info: '#00CFFF'
        };
        notification.style.background = colors[type] || colors.info;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
    
    initScrollToTop() {
        const scrollBtn = document.createElement('button');
        scrollBtn.innerHTML = '↑';
        scrollBtn.className = 'scroll-to-top';
        scrollBtn.setAttribute('aria-label', 'Scroll to top');
        
        Object.assign(scrollBtn.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'var(--neon-blue)',
            color: 'var(--midnight-black)',
            border: 'none',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            opacity: '0',
            transform: 'translateY(20px)',
            transition: 'all 0.3s ease',
            zIndex: '1000',
            boxShadow: '0 4px 12px rgba(0, 207, 255, 0.3)'
        });
        
        document.body.appendChild(scrollBtn);
        
        // Show/hide based on scroll position
        window.addEventListener('scroll', this.debounce(() => {
            if (window.scrollY > 500) {
                scrollBtn.style.opacity = '1';
                scrollBtn.style.transform = 'translateY(0)';
            } else {
                scrollBtn.style.opacity = '0';
                scrollBtn.style.transform = 'translateY(20px)';
            }
        }, 10));
        
        // Add hover effect
        scrollBtn.addEventListener('mouseenter', () => {
            scrollBtn.style.boxShadow = '0 0 20px rgba(0, 207, 255, 0.5)';
            scrollBtn.style.transform = 'translateY(0) scale(1.1)';
        });
        
        scrollBtn.addEventListener('mouseleave', () => {
            scrollBtn.style.boxShadow = '0 4px 12px rgba(0, 207, 255, 0.3)';
            scrollBtn.style.transform = 'translateY(0) scale(1)';
        });
        
        // Scroll to top on click
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    initParallaxEffects() {
        // Add subtle parallax effect to floating OS logos
        window.addEventListener('scroll', this.debounce(() => {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.2;
            
            const floatingLogos = document.querySelector('.floating-os-logos');
            if (floatingLogos) {
                floatingLogos.style.transform = `translateY(${parallax}px)`;
            }
        }, 16));
    }
    
    initPageLoad() {
        // Add loading animation for the page
        const body = document.body;
        body.style.opacity = '0';
        body.style.transition = 'opacity 0.5s ease';
        
        const handleLoad = () => {
            setTimeout(() => {
                body.style.opacity = '1';
                this.triggerInitialAnimations();
            }, 100);
        };
        
        if (document.readyState === 'complete') {
            handleLoad();
        } else {
            window.addEventListener('load', handleLoad);
        }
    }
    
    triggerInitialAnimations() {
        // Add stagger animation to hero elements
        const heroElements = document.querySelectorAll('.status-badge, .hero-title, .hero-tagline, .hero-description, .hero-cta');
        
        heroElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'all 0.6s ease';
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 150);
        });
        
        // Animate profile image container
        const profileContainer = document.querySelector('.profile-container');
        if (profileContainer) {
            profileContainer.style.opacity = '0';
            profileContainer.style.transform = 'scale(0.8)';
            profileContainer.style.transition = 'all 0.8s ease';
            
            setTimeout(() => {
                profileContainer.style.opacity = '1';
                profileContainer.style.transform = 'scale(1)';
            }, 500);
        }
    }
    
    // Utility method to debounce scroll events
    debounce(func, wait) {
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
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the application
    const app = new PortfolioApp();
    
    // Check for saved theme preference (with fallback)
    let savedTheme = 'dark';
    try {
        savedTheme = localStorage.getItem('preferred-theme') || 'dark';
    } catch (e) {
        console.warn('Could not access localStorage:', e);
    }
    
    app.setTheme(savedTheme);
    
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
        themeIcon.textContent = savedTheme === 'dark' ? '🌙' : '☀️';
    }
    
    // Add keyboard navigation support
    document.addEventListener('keydown', (e) => {
        // ESC key closes mobile menu
        if (e.key === 'Escape') {
            const navMenu = document.getElementById('navMenu');
            const mobileToggle = document.getElementById('mobileMenuToggle');
            
            if (navMenu && navMenu.classList.contains('mobile-open')) {
                navMenu.classList.remove('mobile-open');
                if (mobileToggle) mobileToggle.classList.remove('active');
            }
        }
        
        // Tab navigation enhancement
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    // Remove keyboard navigation class on mouse use
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });
    
    console.log('🚀 Portfolio loaded successfully!');
    console.log('✨ Network animation initialized');
    console.log('🎨 Theme system ready');
    console.log('📱 Responsive design active');
    console.log('🖼️ Image fallback system ready');
    console.log('📧 Contact form with mailto integration');
});