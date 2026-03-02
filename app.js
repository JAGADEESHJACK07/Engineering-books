// Main Application JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initApp();
});

function initApp() {
    // Initialize navigation
    initNavigation();
    
    // Initialize file manager
    initFileManager();
    
    // Initialize modals
    initModals();
    
    // Initialize semester manager
    initSemesterManager();
    
    // Load sample data
    loadSampleData();
    
    // Initialize animations
    initAnimations();
    
    // Create background particles
    createParticles();
}

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and sections
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show corresponding section
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
                
                // Add animation to section content
                animateSectionContent(targetSection);
            }
        });
    });
    
    // Quick access cards
    const quickCards = document.querySelectorAll('.quick-card');
    quickCards.forEach(card => {
        card.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            const targetLink = document.querySelector(`.nav-link[href="#${target}"]`);
            if (targetLink) {
                targetLink.click();
            }
        });
    });
}

function initModals() {
    const uploadBtn = document.getElementById('uploadBtn');
    const uploadModal = document.getElementById('uploadModal');
    const closeModal = document.getElementById('closeModal');
    const cancelUpload = document.getElementById('cancelUpload');
    const uploadForm = document.getElementById('uploadForm');
    
    // Open upload modal
    uploadBtn.addEventListener('click', function() {
        uploadModal.classList.add('active');
    });
    
    // Close upload modal
    closeModal.addEventListener('click', function() {
        uploadModal.classList.remove('active');
    });
    
    cancelUpload.addEventListener('click', function() {
        uploadModal.classList.remove('active');
    });
    
    // Handle form submission
    uploadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const fileSemester = document.getElementById('fileSemester').value;
        const fileType = document.getElementById('fileType').value;
        const fileName = document.getElementById('fileName').value;
        const fileSubject = document.getElementById('fileSubject').value;
        const fileDescription = document.getElementById('fileDescription').value;
        
        // In a real app, you would upload the file to a server
        // For this demo, we'll just show a success message
        showNotification('File uploaded successfully!');
        
        // Close modal and reset form
        uploadModal.classList.remove('active');
        uploadForm.reset();
        
        // Reset file upload area
        document.getElementById('fileUploadArea').innerHTML = `
            <i class="fas fa-cloud-upload-alt"></i>
            <p>Drag & drop files here or click to browse</p>
            <input type="file" id="fileUpload" hidden>
        `;
        
        // Add the new file to the appropriate section
        addNewFile(fileSemester, fileType, fileName, fileSubject, fileDescription);
    });
    
    // File upload area interaction
    const fileUploadArea = document.getElementById('fileUploadArea');
    const fileUpload = document.getElementById('fileUpload');
    
    fileUploadArea.addEventListener('click', function() {
        fileUpload.click();
    });
    
    fileUpload.addEventListener('change', function() {
        if (this.files.length > 0) {
            fileUploadArea.innerHTML = `
                <i class="fas fa-file"></i>
                <p>${this.files[0].name}</p>
            `;
        }
    });
    
    // Drag and drop functionality
    fileUploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('dragover');
    });
    
    fileUploadArea.addEventListener('dragleave', function() {
        this.classList.remove('dragover');
    });
    
    fileUploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
        
        if (e.dataTransfer.files.length > 0) {
            fileUpload.files = e.dataTransfer.files;
            fileUploadArea.innerHTML = `
                <i class="fas fa-file"></i>
                <p>${e.dataTransfer.files[0].name}</p>
            `;
        }
    });
}

function initFileManager() {
    // File preview functionality
    const fileCards = document.querySelectorAll('.file-card');
    const previewModal = document.getElementById('previewModal');
    const closePreview = document.getElementById('closePreview');
    
    fileCards.forEach(card => {
        card.addEventListener('click', function() {
            const fileName = this.querySelector('h3').textContent;
            const fileSubject = this.querySelector('.file-subject').textContent;
            const fileDescription = this.querySelector('.file-description').textContent;
            const fileDate = this.querySelector('.file-date').textContent;
            const fileSemester = this.getAttribute('data-semester') || 'N/A';
            
            // Set preview content
            document.getElementById('previewTitle').textContent = fileName;
            document.getElementById('previewFileName').textContent = fileName;
            document.getElementById('previewFileSubject').textContent = fileSubject;
            document.getElementById('previewFileDescription').textContent = fileDescription;
            document.getElementById('previewFileDate').textContent = fileDate;
            document.getElementById('previewFileSemester').textContent = fileSemester;
            
            // Show preview modal
            previewModal.classList.add('active');
        });
    });
    
    // Close preview modal
    closePreview.addEventListener('click', function() {
        previewModal.classList.remove('active');
    });
    
    // Download button
    document.getElementById('downloadBtn').addEventListener('click', function() {
        showNotification('File download started!');
    });
    
    // Share button
    document.getElementById('shareBtn').addEventListener('click', function() {
        showNotification('Share link copied to clipboard!');
    });
}

function loadSampleData() {
    // Sample data for demonstration
    const sampleData = {
        books: [
            { name: 'Data Structures', subject: 'Computer Science', date: '2023-05-15', description: 'Complete guide to data structures and algorithms', semester: 3 },
            { name: 'Calculus I', subject: 'Mathematics', date: '2023-04-22', description: 'Fundamental concepts of differential calculus', semester: 1 },
            { name: 'Organic Chemistry', subject: 'Chemistry', date: '2023-06-10', description: 'Comprehensive organic chemistry textbook', semester: 2 },
            { name: 'Physics for Engineers', subject: 'Physics', date: '2023-03-18', description: 'Applied physics concepts for engineering students', semester: 1 }
        ],
        notes: [
            { name: 'Database Systems Notes', subject: 'Computer Science', date: '2023-07-05', description: 'Complete lecture notes for database systems course', semester: 4 },
            { name: 'Linear Algebra Summary', subject: 'Mathematics', date: '2023-06-28', description: 'Concise summary of linear algebra concepts', semester: 2 },
            { name: 'Electronics Circuits', subject: 'Electrical Engineering', date: '2023-07-12', description: 'Detailed notes on electronic circuits and components', semester: 3 }
        ],
        records: [
            { name: 'Physics Lab Manual', subject: 'Physics', date: '2023-05-30', description: 'Complete lab manual for physics practicals', semester: 1 },
            { name: 'Chemistry Experiments', subject: 'Chemistry', date: '2023-06-15', description: 'Record of chemistry laboratory experiments', semester: 2 },
            { name: 'Programming Lab Records', subject: 'Computer Science', date: '2023-07-08', description: 'C programming lab exercises and solutions', semester: 3 }
        ],
        questions: [
            { name: 'Final Exam 2022', subject: 'Data Structures', date: '2022-12-10', description: 'Previous year final examination questions', semester: 3 },
            { name: 'Midterm 2023', subject: 'Calculus', date: '2023-03-15', description: 'Midterm examination questions with solutions', semester: 1 },
            { name: 'Quiz Questions Set', subject: 'Physics', date: '2023-02-20', description: 'Collection of quiz questions from past sessions', semester: 1 }
        ]
    };
    
    // Populate sections with sample data
    for (const type in sampleData) {
        const section = document.getElementById(type);
        if (section) {
            const contentGrid = section.querySelector('.content-grid');
            if (contentGrid) {
                contentGrid.innerHTML = '';
                
                sampleData[type].forEach(item => {
                    const fileCard = createFileCard(item, type);
                    contentGrid.appendChild(fileCard);
                });
            }
        }
    }
    
    // Populate recent uploads
    const recentUploadsGrid = document.querySelector('.uploads-grid');
    if (recentUploadsGrid) {
        // Combine all sample data and sort by date (newest first)
        const allFiles = [];
        for (const type in sampleData) {
            sampleData[type].forEach(file => {
                file.type = type;
                allFiles.push(file);
            });
        }
        
        allFiles.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Take the 6 most recent files
        const recentFiles = allFiles.slice(0, 6);
        
        recentFiles.forEach(file => {
            const uploadItem = document.createElement('div');
            uploadItem.className = 'upload-item';
            uploadItem.innerHTML = `
                <div class="upload-icon">
                    <i class="fas fa-${getFileIcon(file.type)}"></i>
                </div>
                <div class="upload-info">
                    <h4>${file.name}</h4>
                    <p>Semester ${file.semester} • ${file.subject}</p>
                </div>
            `;
            recentUploadsGrid.appendChild(uploadItem);
        });
    }
    
    // Reinitialize file manager for the new cards
    initFileManager();
}

function createFileCard(fileData, type) {
    const fileCard = document.createElement('div');
    fileCard.className = 'file-card stagger-item';
    fileCard.setAttribute('data-semester', fileData.semester);
    
    const iconClass = getFileIcon(type);
    const typeName = getTypeName(type);
    
    fileCard.innerHTML = `
        <div class="file-icon">
            <i class="fas fa-${iconClass}"></i>
        </div>
        <div class="file-info">
            <h3>${fileData.name}</h3>
            <div class="file-meta">
                <span class="file-subject">${fileData.subject}</span>
                <span class="file-date">${formatDate(fileData.date)}</span>
            </div>
            <p class="file-description">${fileData.description}</p>
            <div class="file-meta">
                <span><i class="fas fa-layer-group"></i> Semester ${fileData.semester}</span>
                <span><i class="fas fa-${iconClass}"></i> ${typeName}</span>
            </div>
            <div class="file-actions">
                <button class="btn btn-primary">
                    <i class="fas fa-eye"></i> View
                </button>
                <button class="btn btn-secondary">
                    <i class="fas fa-download"></i> Download
                </button>
            </div>
        </div>
    `;
    
    return fileCard;
}

function getFileIcon(type) {
    const icons = {
        'books': 'book',
        'notes': 'sticky-note',
        'records': 'file-alt',
        'questions': 'question-circle'
    };
    
    return icons[type] || 'file';
}

function getTypeName(type) {
    const names = {
        'books': 'Book',
        'notes': 'Note',
        'records': 'Record',
        'questions': 'Question Paper'
    };
    
    return names[type] || 'File';
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function addNewFile(semester, type, name, subject, description) {
    const section = document.getElementById(type);
    if (!section) return;
    
    const contentGrid = section.querySelector('.content-grid');
    if (!contentGrid) return;
    
    const newFile = {
        name: name,
        subject: subject,
        date: new Date().toISOString().split('T')[0],
        description: description,
        semester: semester
    };
    
    const fileCard = createFileCard(newFile, type);
    contentGrid.prepend(fileCard);
    
    // Reinitialize file manager for the new card
    initFileManager();
    
    // Animate the new card
    setTimeout(() => {
        fileCard.classList.add('animated');
    }, 100);
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    
    notificationText.textContent = message;
    notification.classList.add('active');
    
    setTimeout(() => {
        notification.classList.remove('active');
    }, 3000);
}

function initAnimations() {
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // Observe all stagger items
    document.querySelectorAll('.stagger-item').forEach(item => {
        observer.observe(item);
    });
    
    // Animate stats cards on dashboard load
    const dashboard = document.getElementById('dashboard');
    if (dashboard.classList.contains('active')) {
        animateSectionContent(dashboard);
    }
}

function animateSectionContent(section) {
    // Animate content in the active section
    const staggerItems = section.querySelectorAll('.stagger-item');
    staggerItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('animated');
        }, index * 100);
    });
    
    // Special animation for stats cards
    if (section.id === 'dashboard') {
        const statCards = section.querySelectorAll('.stat-card');
        statCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.transform = 'translateY(0)';
                card.style.opacity = '1';
            }, index * 150);
        });
    }
}

function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random properties
        const size = Math.random() * 5 + 2;
        const left = Math.random() * 100;
        const animationDuration = Math.random() * 20 + 10;
        const animationDelay = Math.random() * 5;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${left}%`;
        particle.style.animationDuration = `${animationDuration}s`;
        particle.style.animationDelay = `${animationDelay}s`;
        particle.style.opacity = Math.random() * 0.5 + 0.1;
        
        particlesContainer.appendChild(particle);
    }
}

// Semester progress interaction
const semesterMarks = document.querySelectorAll('.semester-mark');
semesterMarks.forEach(mark => {
    mark.addEventListener('click', function() {
        const semester = this.getAttribute('data-semester');
        
        // Update active semester
        semesterMarks.forEach(m => m.classList.remove('active'));
        this.classList.add('active');
        
        // Update progress bar
        const progressFill = document.querySelector('.progress-fill');
        const progressWidth = (semester / 8) * 100;
        progressFill.style.width = `${progressWidth}%`;
        
        // In a real app, you would load semester-specific data
        showNotification(`Switched to Semester ${semester} view`);
    });
});