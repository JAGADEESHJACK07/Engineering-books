// Advanced Animations JavaScript - College Data Management System
class AdvancedAnimations {
    constructor() {
        this.animationEnabled = true;
        this.particleSystems = new Map();
        this.scrollAnimations = new Map();
        this.hoverEffects = new Map();
        this.intersectionObserver = null;
        this.init();
    }

    init() {
        this.checkPerformance();
        this.initIntersectionObserver();
        this.initParticleSystems();
        this.initScrollAnimations();
        this.initHoverEffects();
        this.initPageTransitions();
        this.initLoadingAnimations();
        this.initInteractiveAnimations();
        this.initSemesterAnimations();
        this.initFileCardAnimations();
        this.initNotificationAnimations();
        this.initBackgroundAnimations();
        
        // Start animation loops
        this.startAnimationLoops();
    }

    // Performance Check
    checkPerformance() {
        // Check if user prefers reduced motion
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (mediaQuery.matches) {
            this.animationEnabled = false;
            document.body.classList.add('reduced-motion');
            return;
        }

        // Check device performance capabilities
        const isLowEndDevice = this.isLowEndDevice();
        if (isLowEndDevice) {
            this.animationEnabled = false;
            document.body.classList.add('reduced-motion');
        }
    }

    isLowEndDevice() {
        // Simple heuristic for low-end devices
        const concurrency = navigator.hardwareConcurrency || 4;
        const memory = navigator.deviceMemory || 4;
        return concurrency <= 2 || memory <= 2;
    }

    // Intersection Observer for Scroll Animations
    initIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: this.buildThresholdList()
        };

        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                this.handleIntersection(entry);
            });
        }, options);

        // Observe all animatable elements
        document.addEventListener('DOMContentLoaded', () => {
            this.observeAnimatableElements();
        });
    }

    buildThresholdList() {
        const thresholds = [];
        const numSteps = 20;
        for (let i = 1.0; i <= numSteps; i++) {
            const ratio = i / numSteps;
            thresholds.push(ratio);
        }
        thresholds.push(0);
        return thresholds;
    }

    observeAnimatableElements() {
        const animatableSelectors = [
            '.stagger-item',
            '.stat-card',
            '.file-card',
            '.semester-card',
            '.section-header',
            '.quick-card',
            '.upload-item',
            '.progress-track',
            '.filter-btn',
            '.btn-primary',
            '.btn-secondary'
        ];

        animatableSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                this.intersectionObserver.observe(element);
            });
        });
    }

    handleIntersection(entry) {
        if (!this.animationEnabled) return;

        const { target, intersectionRatio, isIntersecting } = entry;

        if (isIntersecting) {
            this.animateOnScroll(target, intersectionRatio);
        } else {
            this.animateOnScrollOut(target, intersectionRatio);
        }
    }

    animateOnScroll(element, ratio) {
        if (element.classList.contains('animated')) return;

        const animationType = element.dataset.animation || 'fadeInUp';
        const delay = element.dataset.delay || 0;

        setTimeout(() => {
            element.classList.add('animated', animationType);
            
            // Add sequential animation for staggered items
            if (element.classList.contains('stagger-item')) {
                this.animateStaggerItem(element);
            }
        }, delay);
    }

    animateOnScrollOut(element, ratio) {
        if (ratio < 0.1) {
            element.classList.remove('animated');
        }
    }

    animateStaggerItem(element) {
        const index = Array.from(element.parentElement.children).indexOf(element);
        const delay = index * 100;
        
        element.style.setProperty('--stagger-delay', `${delay}ms`);
        element.classList.add('stagger-animate');
    }

    // Particle Systems
    initParticleSystems() {
        this.createBackgroundParticles();
        this.createFloatingShapes();
        this.createInteractiveParticles();
    }

    createBackgroundParticles() {
        const container = document.getElementById('particles');
        if (!container) return;

        const particleCount = this.animationEnabled ? 50 : 20;
        
        for (let i = 0; i < particleCount; i++) {
            this.createParticle(container, i);
        }

        this.particleSystems.set('background', {
            container,
            particles: Array.from(container.children)
        });
    }

    createParticle(container, index) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random properties with controlled randomness
        const size = Math.random() * 4 + 1;
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const duration = Math.random() * 30 + 20;
        const delay = Math.random() * 10;
        const opacity = Math.random() * 0.3 + 0.1;
        
        // Color variations
        const colors = [
            'rgba(67, 97, 238, {opacity})',    // Primary blue
            'rgba(114, 9, 183, {opacity})',    // Secondary purple
            'rgba(247, 37, 133, {opacity})',   // Accent pink
            'rgba(76, 201, 240, {opacity})'    // Success blue
        ];
        const color = colors[Math.floor(Math.random() * colors.length)].replace('{opacity}', opacity);

        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${left}%;
            top: ${top}%;
            background: ${color};
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
            opacity: ${opacity};
        `;

        container.appendChild(particle);
        return particle;
    }

    createFloatingShapes() {
        const shapes = document.querySelectorAll('.floating-shape');
        shapes.forEach((shape, index) => {
            this.animateFloatingShape(shape, index);
        });
    }

    animateFloatingShape(shape, index) {
        if (!this.animationEnabled) return;

        const keyframes = [
            { transform: 'translateY(0px) rotate(0deg)' },
            { transform: `translateY(${Math.random() * 40 - 20}px) rotate(${Math.random() * 20 - 10}deg)` },
            { transform: 'translateY(0px) rotate(0deg)' }
        ];

        const options = {
            duration: 15000 + Math.random() * 10000,
            iterations: Infinity,
            delay: index * 2000
        };

        shape.animate(keyframes, options);
    }

    createInteractiveParticles() {
        // Create particles on button clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('.btn-primary, .btn-secondary, .quick-card, .file-card')) {
                this.createClickParticles(e);
            }
        });
    }

    createClickParticles(event) {
        if (!this.animationEnabled) return;

        const button = event.target.closest('.btn-primary, .btn-secondary, .quick-card, .file-card');
        if (!button) return;

        const rect = button.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        this.emitParticles(x, y, 8);
    }

    emitParticles(x, y, count) {
        const container = document.createElement('div');
        container.className = 'particle-emitter';
        container.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            z-index: 10000;
        `;

        document.body.appendChild(container);

        for (let i = 0; i < count; i++) {
            this.createEmittedParticle(container, i);
        }

        setTimeout(() => {
            container.remove();
        }, 1000);
    }

    createEmittedParticle(container, index) {
        const particle = document.createElement('div');
        particle.className = 'emitted-particle';
        
        const angle = (index / 8) * Math.PI * 2;
        const distance = 30 + Math.random() * 50;
        const size = 3 + Math.random() * 4;
        
        const keyframes = [
            {
                transform: 'translate(0, 0) scale(1)',
                opacity: 1
            },
            {
                transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`,
                opacity: 0
            }
        ];

        const options = {
            duration: 600 + Math.random() * 400,
            easing: 'cubic-bezier(0.2, 0, 0.8, 1)',
            fill: 'forwards'
        };

        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            background: ${this.getParticleColor()};
            border-radius: 50%;
            position: absolute;
        `;

        container.appendChild(particle);
        particle.animate(keyframes, options);
    }

    getParticleColor() {
        const colors = [
            '#4361ee', '#7209b7', '#f72585', '#4cc9f0',
            '#3a56d4', '#5a189a', '#ff6b6b', '#4ecdc4'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // Scroll-based Animations
    initScrollAnimations() {
        this.initParallaxEffects();
        this.initProgressAnimations();
        this.initScrollReveal();
    }

    initParallaxEffects() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        window.addEventListener('scroll', () => {
            if (!this.animationEnabled) return;

            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;

            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                element.style.transform = `translateY(${rate * speed}px)`;
            });
        });
    }

    initProgressAnimations() {
        const progressBars = document.querySelectorAll('.progress-fill, .skill-bar');
        
        progressBars.forEach(bar => {
            this.intersectionObserver.observe(bar);
        });
    }

    initScrollReveal() {
        // Custom scroll reveal for complex elements
        const revealElements = document.querySelectorAll('[data-reveal]');
        
        revealElements.forEach(element => {
            this.intersectionObserver.observe(element);
        });
    }

    // Hover Effects
    initHoverEffects() {
        this.initMagneticButtons();
        this.initHoverTransform();
        this.initRippleEffects();
        this.initGlowEffects();
    }

    initMagneticButtons() {
        const magneticButtons = document.querySelectorAll('.btn-primary, .btn-secondary, .quick-card');
        
        magneticButtons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                if (!this.animationEnabled) return;
                
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const deltaX = (x - centerX) / centerX * 10;
                const deltaY = (y - centerY) / centerY * 10;
                
                button.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translate(0, 0)';
            });
        });
    }

    initHoverTransform() {
        const hoverElements = document.querySelectorAll('.file-card, .semester-card, .stat-card');
        
        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                if (!this.animationEnabled) return;
                
                element.style.transform = 'translateY(-8px) scale(1.02)';
                element.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translateY(0) scale(1)';
                element.style.boxShadow = '';
            });
        });
    }

    initRippleEffects() {
        document.addEventListener('click', (e) => {
            const button = e.target.closest('.btn-primary, .btn-secondary');
            if (!button || !this.animationEnabled) return;
            
            this.createRippleEffect(button, e);
        });
    }

    createRippleEffect(button, event) {
        const ripple = document.createElement('span');
        ripple.className = 'ripple-effect';
        
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            position: absolute;
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    initGlowEffects() {
        const glowElements = document.querySelectorAll('.stat-icon, .quick-icon, .file-icon');
        
        glowElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                if (!this.animationEnabled) return;
                
                element.style.filter = 'drop-shadow(0 0 10px currentColor)';
                element.style.transform = 'scale(1.1)';
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.filter = 'none';
                element.style.transform = 'scale(1)';
            });
        });
    }

    // Page Transitions
    initPageTransitions() {
        this.initSectionTransitions();
        this.initModalTransitions();
    }

    initSectionTransitions() {
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('.section');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    this.animateSectionTransition(targetSection);
                }
            });
        });
    }

    animateSectionTransition(newSection) {
        const currentSection = document.querySelector('.section.active');
        
        if (currentSection) {
            // Animate out current section
            currentSection.style.animation = 'fadeOutUp 0.5s ease forwards';
            
            setTimeout(() => {
                currentSection.classList.remove('active');
                currentSection.style.animation = '';
                
                // Animate in new section
                newSection.classList.add('active');
                newSection.style.animation = 'fadeInUp 0.5s ease forwards';
                
                setTimeout(() => {
                    newSection.style.animation = '';
                }, 500);
            }, 300);
        } else {
            newSection.classList.add('active');
            newSection.style.animation = 'fadeInUp 0.5s ease forwards';
            
            setTimeout(() => {
                newSection.style.animation = '';
            }, 500);
        }
    }

    initModalTransitions() {
        const modals = document.querySelectorAll('.modal');
        
        modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.animateModalClose(modal);
                }
            });
        });
    }

    animateModalClose(modal) {
        modal.style.animation = 'fadeOut 0.3s ease forwards';
        
        setTimeout(() => {
            modal.classList.remove('active');
            modal.style.animation = '';
        }, 300);
    }

    // Loading Animations
    initLoadingAnimations() {
        this.initSkeletonLoading();
        this.initProgressIndicators();
    }

    initSkeletonLoading() {
        // Add skeleton loading for dynamic content
        const skeletonElements = document.querySelectorAll('[data-skeleton]');
        
        skeletonElements.forEach(element => {
            element.classList.add('skeleton');
            
            // Simulate loading completion
            setTimeout(() => {
                element.classList.remove('skeleton');
            }, 1000 + Math.random() * 1000);
        });
    }

    initProgressIndicators() {
        // Animate progress bars when they become visible
        const progressBars = document.querySelectorAll('.progress-fill');
        
        progressBars.forEach(bar => {
            this.intersectionObserver.observe(bar);
        });
    }

    // Interactive Animations
    initInteractiveAnimations() {
        this.initTypewriterEffect();
        this.initCounterAnimations();
        this.initDragAndDropAnimations();
    }

    initTypewriterEffect() {
        const typewriterElements = document.querySelectorAll('[data-typewriter]');
        
        typewriterElements.forEach(element => {
            const text = element.textContent;
            element.textContent = '';
            element.style.visibility = 'visible';
            
            this.typeWriter(element, text, 0, 50);
        });
    }

    typeWriter(element, text, index, speed) {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(() => this.typeWriter(element, text, index, speed), speed);
        }
    }

    initCounterAnimations() {
        const counterElements = document.querySelectorAll('[data-counter]');
        
        counterElements.forEach(element => {
            this.intersectionObserver.observe(element);
        });
    }

    animateCounter(element) {
        const target = parseInt(element.dataset.target) || 100;
        const duration = parseInt(element.dataset.duration) || 2000;
        const start = parseInt(element.dataset.start) || 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current).toLocaleString();
        }, 16);
    }

    initDragAndDropAnimations() {
        const dropZones = document.querySelectorAll('.file-upload-area');
        
        dropZones.forEach(zone => {
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                if (!this.animationEnabled) return;
                
                zone.style.transform = 'scale(1.05)';
                zone.style.borderColor = '#4361ee';
            });
            
            zone.addEventListener('dragleave', () => {
                zone.style.transform = 'scale(1)';
                zone.style.borderColor = '';
            });
            
            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.style.transform = 'scale(1)';
                zone.style.borderColor = '';
                
                // Add success animation
                zone.style.animation = 'pulse 0.5s ease';
                setTimeout(() => {
                    zone.style.animation = '';
                }, 500);
            });
        });
    }

    // Semester-specific Animations
    initSemesterAnimations() {
        this.initSemesterProgress();
        this.initSemesterCards();
        this.initSemesterFilters();
    }

    initSemesterProgress() {
        const progressFill = document.querySelector('.progress-fill');
        const semesterMarks = document.querySelectorAll('.semester-mark');
        
        semesterMarks.forEach(mark => {
            mark.addEventListener('click', () => {
                if (!this.animationEnabled) return;
                
                const semester = parseInt(mark.dataset.semester);
                const progress = (semester / 8) * 100;
                
                // Animate progress bar
                progressFill.style.transition = 'width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
                progressFill.style.width = `${progress}%`;
                
                // Animate semester marks
                semesterMarks.forEach(m => m.classList.remove('active', 'pulse'));
                mark.classList.add('active', 'pulse');
                
                setTimeout(() => {
                    mark.classList.remove('pulse');
                }, 1000);
            });
        });
    }

    initSemesterCards() {
        const semesterCards = document.querySelectorAll('.semester-card');
        
        semesterCards.forEach((card, index) => {
            card.style.setProperty('--card-delay', `${index * 100}ms`);
            
            card.addEventListener('click', () => {
                if (!this.animationEnabled) return;
                
                this.animateCardClick(card);
            });
        });
    }

    animateCardClick(card) {
        card.style.animation = 'cardPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
        
        setTimeout(() => {
            card.style.animation = '';
        }, 400);
    }

    initSemesterFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (!this.animationEnabled) return;
                
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Add ripple effect
                this.createRippleEffect(button, {
                    clientX: button.getBoundingClientRect().left + button.offsetWidth / 2,
                    clientY: button.getBoundingClientRect().top + button.offsetHeight / 2
                });
            });
        });
    }

    // File Card Animations
    initFileCardAnimations() {
        this.initFileCardHover();
        this.initFileUploadAnimations();
        this.initFileActionAnimations();
    }

    initFileCardHover() {
        const fileCards = document.querySelectorAll('.file-card');
        
        fileCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                if (!this.animationEnabled) return;
                
                const icon = card.querySelector('.file-icon');
                if (icon) {
                    icon.style.transform = 'scale(1.1) rotate(5deg)';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                const icon = card.querySelector('.file-icon');
                if (icon) {
                    icon.style.transform = 'scale(1) rotate(0deg)';
                }
            });
        });
    }

    initFileUploadAnimations() {
        const uploadForm = document.getElementById('uploadForm');
        
        if (uploadForm) {
            uploadForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                if (!this.animationEnabled) return;
                
                this.animateFileUpload();
            });
        }
    }

    animateFileUpload() {
        const uploadBtn = document.querySelector('#uploadForm button[type="submit"]');
        const originalText = uploadBtn.innerHTML;
        
        uploadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
        uploadBtn.disabled = true;
        
        // Simulate upload process
        setTimeout(() => {
            uploadBtn.innerHTML = '<i class="fas fa-check"></i> Uploaded!';
            uploadBtn.style.background = '#4cc9f0';
            
            setTimeout(() => {
                uploadBtn.innerHTML = originalText;
                uploadBtn.disabled = false;
                uploadBtn.style.background = '';
            }, 1500);
        }, 1000);
    }

    initFileActionAnimations() {
        // Animate file actions (download, share, delete)
        document.addEventListener('click', (e) => {
            const downloadBtn = e.target.closest('.download-btn');
            const shareBtn = e.target.closest('.share-btn');
            const deleteBtn = e.target.closest('.delete-btn');
            
            if (downloadBtn && this.animationEnabled) {
                this.animateFileDownload(downloadBtn);
            }
            
            if (shareBtn && this.animationEnabled) {
                this.animateFileShare(shareBtn);
            }
            
            if (deleteBtn && this.animationEnabled) {
                this.animateFileDelete(deleteBtn);
            }
        });
    }

    animateFileDownload(button) {
        button.style.animation = 'bounce 0.5s ease';
        setTimeout(() => {
            button.style.animation = '';
        }, 500);
    }

    animateFileShare(button) {
        button.innerHTML = '<i class="fas fa-check"></i>';
        button.style.background = '#4cc9f0';
        
        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-share-alt"></i>';
            button.style.background = '';
        }, 1000);
    }

    animateFileDelete(button) {
        const card = button.closest('.file-card');
        if (card) {
            card.style.animation = 'fadeOutRight 0.5s ease forwards';
            
            setTimeout(() => {
                card.remove();
            }, 500);
        }
    }

    // Notification Animations
    initNotificationAnimations() {
        // Notification system is handled in app.js, but we can enhance it here
        this.enhanceNotificationAnimations();
    }

    enhanceNotificationAnimations() {
        // Override or enhance the existing notification system
        const originalShowNotification = window.showNotification;
        
        if (originalShowNotification) {
            window.showNotification = (message, type = 'info') => {
                if (this.animationEnabled) {
                    this.animateNotification(message, type);
                } else {
                    originalShowNotification(message, type);
                }
            };
        }
    }

    animateNotification(message, type) {
        const notification = document.getElementById('notification');
        const notificationText = document.getElementById('notificationText');
        
        if (!notification || !notificationText) return;
        
        // Update content
        notificationText.textContent = message;
        notification.className = `notification ${type} animated`;
        
        // Show with animation
        notification.style.animation = 'slideInRight 0.5s ease forwards';
        notification.classList.add('active');
        
        // Auto hide
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.5s ease forwards';
            
            setTimeout(() => {
                notification.classList.remove('active');
                notification.style.animation = '';
            }, 500);
        }, 3000);
    }

    // Background Animations
    initBackgroundAnimations() {
        this.initGradientAnimations();
        this.initWaveAnimations();
    }

    initGradientAnimations() {
        const animatedBg = document.querySelector('.animated-bg');
        if (!animatedBg) return;
        
        // Animate background gradient
        animatedBg.style.animation = 'gradientShift 20s ease infinite';
    }

    initWaveAnimations() {
        const waveElements = document.querySelectorAll('.stat-wave');
        
        waveElements.forEach(wave => {
            wave.style.animation = 'wave 3s ease-in-out infinite';
        });
    }

    // Animation Loops
    startAnimationLoops() {
        this.startParticleLoop();
        this.startBackgroundLoop();
    }

    startParticleLoop() {
        if (!this.animationEnabled) return;
        
        setInterval(() => {
            this.updateParticles();
        }, 1000 / 30); // 30 FPS
    }

    updateParticles() {
        const backgroundParticles = this.particleSystems.get('background');
        if (!backgroundParticles) return;
        
        backgroundParticles.particles.forEach(particle => {
            // Add subtle floating motion
            const currentTransform = particle.style.transform || 'translate(0, 0)';
            const x = (Math.random() - 0.5) * 2;
            const y = (Math.random() - 0.5) * 2;
            
            particle.style.transform = `translate(${x}px, ${y}px)`;
        });
    }

    startBackgroundLoop() {
        if (!this.animationEnabled) return;
        
        setInterval(() => {
            this.updateBackgroundElements();
        }, 1000 / 60); // 60 FPS
    }

    updateBackgroundElements() {
        // Update any continuous background animations
        const floatingShapes = document.querySelectorAll('.floating-shape');
        
        floatingShapes.forEach(shape => {
            const currentTop = parseFloat(shape.style.top) || 0;
            const newTop = currentTop + (Math.random() - 0.5) * 0.5;
            shape.style.top = `${newTop}%`;
        });
    }

    // Utility Methods
    enableAnimations() {
        this.animationEnabled = true;
        document.body.classList.remove('reduced-motion');
    }

    disableAnimations() {
        this.animationEnabled = false;
        document.body.classList.add('reduced-motion');
    }

    // Public API
    triggerAnimation(element, animationName) {
        if (!this.animationEnabled) return;
        
        element.classList.add(animationName);
        setTimeout(() => {
            element.classList.remove(animationName);
        }, 1000);
    }

    createConfetti(x, y, count = 50) {
        if (!this.animationEnabled) return;
        
        const container = document.createElement('div');
        container.className = 'confetti-container';
        container.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            z-index: 10000;
        `;
        
        document.body.appendChild(container);
        
        for (let i = 0; i < count; i++) {
            this.createConfettiPiece(container, i);
        }
        
        setTimeout(() => {
            container.remove();
        }, 3000);
    }

    createConfettiPiece(container, index) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        
        const size = 8 + Math.random() * 8;
        const color = this.getParticleColor();
        const angle = Math.random() * Math.PI * 2;
        const distance = 100 + Math.random() * 200;
        const duration = 1000 + Math.random() * 1000;
        
        piece.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            position: absolute;
            border-radius: 2px;
        `;
        
        const keyframes = [
            {
                transform: 'translate(0, 0) rotate(0deg)',
                opacity: 1
            },
            {
                transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance + 200}px) rotate(${360 * 3}deg)`,
                opacity: 0
            }
        ];
        
        const options = {
            duration: duration,
            easing: 'cubic-bezier(0.1, 0.8, 0.2, 1)',
            fill: 'forwards'
        };
        
        container.appendChild(piece);
        piece.animate(keyframes, options);
    }
}

// Additional CSS Animation Keyframes (dynamically added)
const additionalStyles = `
@keyframes ripple-animation {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

@keyframes cardPop {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
}

@keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

@keyframes wave {
    0%, 100% { transform: translateX(0) translateY(0); }
    50% { transform: translateX(25%) translateY(-10%); }
}

@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideOutRight {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(100%);
        opacity: 0;
    }
}

@keyframes fadeOutUp {
    from {
        opacity: 1;
        transform: translateY(0);
    }
    to {
        opacity: 0;
        transform: translateY(-20px);
    }
}

@keyframes fadeOutRight {
    from {
        opacity: 1;
        transform: translateX(0);
    }
    to {
        opacity: 0;
        transform: translateX(20px);
    }
}

/* Stagger animation delays */
.stagger-item {
    animation-delay: var(--stagger-delay, 0ms);
}

/* Reduced motion support */
.reduced-motion * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
}

/* Skeleton loading */
.skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
    border-radius: 4px;
    color: transparent !important;
}

@keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}

/* Particle animations */
.particle-emitter {
    pointer-events: none;
}

.emitted-particle {
    will-change: transform, opacity;
}

.confetti-container {
    pointer-events: none;
}

.confetti-piece {
    will-change: transform, opacity;
}
`;

// Add additional styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize Advanced Animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.advancedAnimations = new AdvancedAnimations();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdvancedAnimations;
}