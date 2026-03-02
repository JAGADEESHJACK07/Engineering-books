// Semester Manager JavaScript

function initSemesterManager() {
    // Initialize semester filters
    initSemesterFilters();
    
    // Load semester data
    loadSemesterData();
    
    // Initialize semester modal
    initSemesterModal();
}

function initSemesterFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const semesterCards = document.querySelectorAll('.semester-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active filter
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-semester');
            
            // Filter semester cards
            semesterCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-semester') === filter) {
                    card.style.display = 'block';
                    // Add animation
                    card.style.animation = 'fadeIn 0.5s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

function loadSemesterData() {
    const semesterGrid = document.querySelector('.semester-grid');
    if (!semesterGrid) return;
    
    // Sample semester data
    const semesterData = [
        {
            number: 1,
            title: 'First Semester',
            subjects: ['Mathematics I', 'Physics', 'Chemistry', 'Programming', 'English'],
            books: 6,
            notes: 12,
            records: 2,
            questions: 56,
            color: 'semester-1'
        },
        {
            number: 2,
            title: 'Second Semester',
            subjects: ['Mathematics II', 'Electrical', 'Mechanics', 'Economics', 'Environmental'],
            books: 28,
            notes: 38,
            records: 15,
            questions: 48,
            color: 'semester-2'
        },
        {
            number: 3,
            title: 'Third Semester',
            subjects: ['Data Structures', 'Digital Logic', 'Mathematics III', 'Statistics', 'Accounting'],
            books: 35,
            notes: 52,
            records: 18,
            questions: 62,
            color: 'semester-3'
        },
        {
            number: 4,
            title: 'Fourth Semester',
            subjects: ['Algorithms', 'Computer Organization', 'Discrete Math', 'Management', 'Communication'],
            books: 31,
            notes: 47,
            records: 14,
            questions: 58,
            color: 'semester-4'
        },
        {
            number: 5,
            title: 'Fifth Semester',
            subjects: ['Database Systems', 'Operating Systems', 'Software Engineering', 'AI Basics', 'Networks'],
            books: 29,
            notes: 41,
            records: 16,
            questions: 51,
            color: 'semester-5'
        },
        {
            number: 6,
            title: 'Sixth Semester',
            subjects: ['Web Development', 'Machine Learning', 'Cyber Security', 'Cloud Computing', 'Project I'],
            books: 33,
            notes: 49,
            records: 17,
            questions: 55,
            color: 'semester-6'
        },
        {
            number: 7,
            title: 'Seventh Semester',
            subjects: ['Big Data', 'Mobile Development', 'IoT', 'Blockchain', 'Project II'],
            books: 27,
            notes: 39,
            records: 13,
            questions: 47,
            color: 'semester-7'
        },
        {
            number: 8,
            title: 'Eighth Semester',
            subjects: ['Industry Project', 'Research Paper', 'Professional Ethics', 'Entrepreneurship', 'Seminar'],
            books: 23,
            notes: 35,
            records: 11,
            questions: 43,
            color: 'semester-8'
        }
    ];
    
    // Clear existing content
    semesterGrid.innerHTML = '';
    
    // Create semester cards
    semesterData.forEach(semester => {
        const semesterCard = createSemesterCard(semester);
        semesterGrid.appendChild(semesterCard);
    });
}

function createSemesterCard(semesterData) {
    const card = document.createElement('div');
    card.className = 'semester-card stagger-item';
    card.setAttribute('data-semester', semesterData.number);
    
    card.innerHTML = `
        <div class="semester-header ${semesterData.color}">
            <div class="semester-number">${semesterData.number}</div>
            <div class="semester-title">${semesterData.title}</div>
        </div>
        <div class="semester-content">
            <div class="semester-stats">
                <div class="semester-stat">
                    <div class="semester-stat-value">${semesterData.books}</div>
                    <div class="semester-stat-label">Books</div>
                </div>
                <div class="semester-stat">
                    <div class="semester-stat-value">${semesterData.notes}</div>
                    <div class="semester-stat-label">Notes</div>
                </div>
                <div class="semester-stat">
                    <div class="semester-stat-value">${semesterData.records}</div>
                    <div class="semester-stat-label">Records</div>
                </div>
                <div class="semester-stat">
                    <div class="semester-stat-value">${semesterData.questions}</div>
                    <div class="semester-stat-label">PYQs</div>
                </div>
            </div>
            <div class="semester-subjects">
                <h4>Subjects</h4>
                <div class="subject-list">
                    ${semesterData.subjects.map(subject => 
                        `<span class="subject-tag">${subject}</span>`
                    ).join('')}
                </div>
            </div>
            <div class="semester-actions">
                <button class="btn btn-primary view-semester-btn" data-semester="${semesterData.number}">
                    <i class="fas fa-eye"></i> View Details
                </button>
                <button class="btn btn-secondary explore-semester-btn" data-semester="${semesterData.number}">
                    <i class="fas fa-folder-open"></i> Explore
                </button>
            </div>
        </div>
    `;
    
    return card;
}

function initSemesterModal() {
    const semesterModal = document.getElementById('semesterModal');
    const closeSemesterModal = document.getElementById('closeSemesterModal');
    const viewSemesterBtns = document.querySelectorAll('.view-semester-btn');
    
    // Close semester modal
    closeSemesterModal.addEventListener('click', function() {
        semesterModal.classList.remove('active');
    });
    
    // Open semester modal
    viewSemesterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const semesterNumber = this.getAttribute('data-semester');
            loadSemesterDetails(semesterNumber);
            semesterModal.classList.add('active');
        });
    });
    
    // Also handle semester card clicks
    document.addEventListener('click', function(e) {
        if (e.target.closest('.semester-card')) {
            const card = e.target.closest('.semester-card');
            if (!e.target.closest('.semester-actions')) {
                const semesterNumber = card.getAttribute('data-semester');
                loadSemesterDetails(semesterNumber);
                semesterModal.classList.add('active');
            }
        }
    });
    
    // Semester tab switching
    const semesterTabs = document.querySelectorAll('.semester-tab');
    semesterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Update active tab
            semesterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding content
            document.querySelectorAll('.semester-tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(tabId).classList.add('active');
        });
    });
}

function loadSemesterDetails(semesterNumber) {
    const semesterModalTitle = document.getElementById('semesterModalTitle');
    const semesterDetailContent = document.querySelector('.semester-detail-content');
    
    // Sample detailed semester data
    const semesterDetails = {
        1: {
            title: 'First Semester',
            duration: 'Aug 2023 - Dec 2023',
            subjects: [
                { name: 'Mathematics I', code: 'MATH101', credits: 4, books: 8, notes: 12, records: 3, questions: 15 },
                { name: 'Physics', code: 'PHYS101', credits: 4, books: 7, notes: 10, records: 4, questions: 12 },
                { name: 'Chemistry', code: 'CHEM101', credits: 3, books: 6, notes: 8, records: 2, questions: 10 },
                { name: 'Programming Fundamentals', code: 'CS101', credits: 4, books: 8, notes: 12, records: 3, questions: 16 },
                { name: 'English Communication', code: 'ENG101', credits: 2, books: 3, notes: 3, records: 0, questions: 3 }
            ],
            totalBooks: 32,
            totalNotes: 45,
            totalRecords: 12,
            totalQuestions: 56
        },
        // Add similar data for other semesters...
    };
    
    const semester = semesterDetails[semesterNumber] || semesterDetails[1];
    
    // Update modal title
    semesterModalTitle.textContent = `Semester ${semesterNumber} - ${semester.title}`;
    
    // Update sidebar
    const sidebarHTML = `
        <div class="semester-info-card ${getSemesterColorClass(semesterNumber)}">
            <div class="semester-big-number">${semesterNumber}</div>
            <div class="semester-big-title">${semester.title}</div>
            <div class="semester-duration">${semester.duration}</div>
        </div>
        <div class="semester-detail-stats">
            <div class="detail-stat">
                <span class="detail-stat-label">Total Books</span>
                <span class="detail-stat-value">${semester.totalBooks}</span>
            </div>
            <div class="detail-stat">
                <span class="detail-stat-label">Study Notes</span>
                <span class="detail-stat-value">${semester.totalNotes}</span>
            </div>
            <div class="detail-stat">
                <span class="detail-stat-label">Record Manuals</span>
                <span class="detail-stat-value">${semester.totalRecords}</span>
            </div>
            <div class="detail-stat">
                <span class="detail-stat-label">PY Questions</span>
                <span class="detail-stat-value">${semester.totalQuestions}</span>
            </div>
            <div class="detail-stat">
                <span class="detail-stat-label">Subjects</span>
                <span class="detail-stat-value">${semester.subjects.length}</span>
            </div>
            <div class="detail-stat">
                <span class="detail-stat-label">Total Credits</span>
                <span class="detail-stat-value">${semester.subjects.reduce((sum, subject) => sum + subject.credits, 0)}</span>
            </div>
        </div>
    `;
    
    // Update subjects tab
    const subjectsHTML = semester.subjects.map(subject => `
        <div class="subject-detail-card">
            <div class="subject-detail-header">
                <div>
                    <div class="subject-detail-name">${subject.name}</div>
                    <div class="subject-detail-code">${subject.code}</div>
                </div>
                <span class="subject-detail-credits">${subject.credits} Credits</span>
            </div>
            <div class="subject-detail-resources">
                <div class="resource-count">
                    <i class="fas fa-book"></i>
                    <div class="resource-count-value">${subject.books}</div>
                    <div class="resource-count-label">Books</div>
                </div>
                <div class="resource-count">
                    <i class="fas fa-sticky-note"></i>
                    <div class="resource-count-value">${subject.notes}</div>
                    <div class="resource-count-label">Notes</div>
                </div>
                <div class="resource-count">
                    <i class="fas fa-file-alt"></i>
                    <div class="resource-count-value">${subject.records}</div>
                    <div class="resource-count-label">Records</div>
                </div>
                <div class="resource-count">
                    <i class="fas fa-question-circle"></i>
                    <div class="resource-count-value">${subject.questions}</div>
                    <div class="resource-count-label">Questions</div>
                </div>
            </div>
        </div>
    `).join('');
    
    // Update main content
    const mainContentHTML = `
        <div class="semester-tabs">
            <button class="semester-tab active" data-tab="subjects-tab">Subjects</button>
            <button class="semester-tab" data-tab="resources-tab">Resources</button>
            <button class="semester-tab" data-tab="schedule-tab">Schedule</button>
        </div>
        <div class="semester-tab-content active" id="subjects-tab">
            <div class="subject-detail-grid">
                ${subjectsHTML}
            </div>
        </div>
        <div class="semester-tab-content" id="resources-tab">
            <p>Resource distribution and analytics for Semester ${semesterNumber} will be displayed here.</p>
        </div>
        <div class="semester-tab-content" id="schedule-tab">
            <p>Class schedule and important dates for Semester ${semesterNumber} will be displayed here.</p>
        </div>
    `;
    
    // Update the modal content
    semesterDetailContent.innerHTML = `
        <div class="semester-sidebar">
            ${sidebarHTML}
        </div>
        <div class="semester-main-content">
            ${mainContentHTML}
        </div>
    `;
    
    // Reinitialize tab functionality
    const semesterTabs = document.querySelectorAll('.semester-tab');
    semesterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Update active tab
            semesterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding content
            document.querySelectorAll('.semester-tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(tabId).classList.add('active');
        });
    });
}

function getSemesterColorClass(semesterNumber) {
    return `semester-${semesterNumber}`;
}

// Explore semester functionality
document.addEventListener('click', function(e) {
    if (e.target.closest('.explore-semester-btn')) {
        const btn = e.target.closest('.explore-semester-btn');
        const semesterNumber = btn.getAttribute('data-semester');
        
        // Filter content by semester
        const filterBtn = document.querySelector(`.filter-btn[data-semester="${semesterNumber}"]`);
        if (filterBtn) {
            filterBtn.click();
        }
        
        // Switch to semesters section
        const semestersLink = document.querySelector('.nav-link[href="#semesters"]');
        if (semestersLink) {
            semestersLink.click();
        }
        
        showNotification(`Now viewing Semester ${semesterNumber} content`);
    }
});