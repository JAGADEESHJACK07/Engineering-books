// File Manager JavaScript - Advanced File Management System
class FileManager {
    constructor() {
        this.files = [];
        this.filteredFiles = [];
        this.currentFilters = {
            semester: 'all',
            type: 'all',
            subject: 'all',
            search: ''
        };
        this.sortBy = 'date';
        this.sortOrder = 'desc';
        this.init();
    }

    init() {
        this.loadFilesFromStorage();
        this.initSearch();
        this.initAdvancedFilters();
        this.initSorting();
        this.initBulkActions();
        this.initFileOperations();
        this.initStorageManager();
    }

    // File Storage Management
    loadFilesFromStorage() {
        const storedFiles = localStorage.getItem('college_files');
        if (storedFiles) {
            this.files = JSON.parse(storedFiles);
        } else {
            // Load sample data if no stored files
            this.loadSampleData();
        }
        this.applyFilters();
    }

    saveFilesToStorage() {
        localStorage.setItem('college_files', JSON.stringify(this.files));
    }

    loadSampleData() {
        this.files = [
            {
                id: this.generateId(),
                name: 'Data Structures and Algorithms',
                type: 'book',
                subject: 'Computer Science',
                semester: 3,
                description: 'Complete guide to data structures and algorithms with implementations',
                uploadDate: '2024-01-15',
                fileSize: '2.4 MB',
                downloads: 45,
                rating: 4.5,
                tags: ['programming', 'algorithms', 'computer-science'],
                fileName: 'data-structures-algorithms.pdf',
                uploadedBy: 'student123'
            },
            {
                id: this.generateId(),
                name: 'Database Systems Notes',
                type: 'note',
                subject: 'Database Management',
                semester: 4,
                description: 'Comprehensive lecture notes covering SQL, normalization, and transactions',
                uploadDate: '2024-02-20',
                fileSize: '1.8 MB',
                downloads: 78,
                rating: 4.2,
                tags: ['database', 'sql', 'notes'],
                fileName: 'dbms-notes.pdf',
                uploadedBy: 'student456'
            },
            {
                id: this.generateId(),
                name: 'Physics Lab Manual 2024',
                type: 'record',
                subject: 'Physics',
                semester: 1,
                description: 'Complete lab manual with experiments and procedures',
                uploadDate: '2024-03-10',
                fileSize: '3.1 MB',
                downloads: 23,
                rating: 4.7,
                tags: ['physics', 'lab', 'experiments'],
                fileName: 'physics-lab-manual.pdf',
                uploadedBy: 'professor_smith'
            },
            {
                id: this.generateId(),
                name: 'Previous Year Questions - 2023',
                type: 'question',
                subject: 'Data Structures',
                semester: 3,
                description: 'Final examination questions from 2023 with solutions',
                uploadDate: '2024-01-08',
                fileSize: '1.2 MB',
                downloads: 156,
                rating: 4.8,
                tags: ['exam', 'questions', 'solutions'],
                fileName: 'pyq-2023-ds.pdf',
                uploadedBy: 'admin'
            },
            {
                id: this.generateId(),
                name: 'Calculus I Textbook',
                type: 'book',
                subject: 'Mathematics',
                semester: 1,
                description: 'Fundamental calculus concepts and practice problems',
                uploadDate: '2024-02-28',
                fileSize: '4.2 MB',
                downloads: 34,
                rating: 4.3,
                tags: ['mathematics', 'calculus', 'textbook'],
                fileName: 'calculus-textbook.pdf',
                uploadedBy: 'student789'
            },
            {
                id: this.generateId(),
                name: 'Operating Systems Concepts',
                type: 'note',
                subject: 'Operating Systems',
                semester: 5,
                description: 'Detailed notes on process management, memory allocation, and file systems',
                uploadDate: '2024-03-15',
                fileSize: '2.1 MB',
                downloads: 67,
                rating: 4.6,
                tags: ['os', 'notes', 'computer-science'],
                fileName: 'os-notes.pdf',
                uploadedBy: 'student101'
            }
        ];
        this.saveFilesToStorage();
    }

    // Advanced Search Functionality
    initSearch() {
        this.createSearchInterface();
        this.setupSearchListeners();
    }

    createSearchInterface() {
        const sections = ['books', 'notes', 'records', 'questions'];
        
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                const header = section.querySelector('.section-header');
                if (header && !header.querySelector('.advanced-search-container')) {
                    const searchHTML = `
                        <div class="advanced-search-container">
                            <div class="search-box">
                                <i class="fas fa-search"></i>
                                <input type="text" class="search-input" placeholder="Search files..." 
                                       data-section="${sectionId}">
                                <button class="search-clear" style="display: none;">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                            <div class="search-filters">
                                <button class="filter-toggle">
                                    <i class="fas fa-filter"></i>
                                    Filters
                                </button>
                                <div class="filter-dropdown">
                                    <div class="filter-group">
                                        <label>Semester</label>
                                        <select class="filter-semester" data-section="${sectionId}">
                                            <option value="all">All Semesters</option>
                                            ${[1,2,3,4,5,6,7,8].map(sem => 
                                                `<option value="${sem}">Semester ${sem}</option>`
                                            ).join('')}
                                        </select>
                                    </div>
                                    <div class="filter-group">
                                        <label>Subject</label>
                                        <select class="filter-subject" data-section="${sectionId}">
                                            <option value="all">All Subjects</option>
                                            <option value="Computer Science">Computer Science</option>
                                            <option value="Mathematics">Mathematics</option>
                                            <option value="Physics">Physics</option>
                                            <option value="Chemistry">Chemistry</option>
                                            <option value="Database Management">Database Management</option>
                                            <option value="Operating Systems">Operating Systems</option>
                                        </select>
                                    </div>
                                    <div class="filter-actions">
                                        <button class="btn btn-secondary apply-filters" data-section="${sectionId}">
                                            Apply
                                        </button>
                                        <button class="btn btn-outline reset-filters" data-section="${sectionId}">
                                            Reset
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                    header.insertAdjacentHTML('beforeend', searchHTML);
                }
            }
        });
    }

    setupSearchListeners() {
        // Search input listeners
        document.querySelectorAll('.search-input').forEach(input => {
            input.addEventListener('input', (e) => {
                this.handleSearch(e.target.value, e.target.dataset.section);
                this.toggleClearButton(e.target);
            });

            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSearch(e.target.value, e.target.dataset.section);
                }
            });
        });

        // Clear search buttons
        document.querySelectorAll('.search-clear').forEach(button => {
            button.addEventListener('click', (e) => {
                const section = e.target.closest('.search-box').querySelector('.search-input').dataset.section;
                this.clearSearch(section);
            });
        });

        // Filter toggle
        document.querySelectorAll('.filter-toggle').forEach(button => {
            button.addEventListener('click', (e) => {
                const dropdown = e.target.closest('.search-filters').querySelector('.filter-dropdown');
                dropdown.classList.toggle('active');
            });
        });

        // Apply filters
        document.querySelectorAll('.apply-filters').forEach(button => {
            button.addEventListener('click', (e) => {
                const section = e.target.dataset.section;
                this.applySectionFilters(section);
            });
        });

        // Reset filters
        document.querySelectorAll('.reset-filters').forEach(button => {
            button.addEventListener('click', (e) => {
                const section = e.target.dataset.section;
                this.resetSectionFilters(section);
            });
        });

        // Close filter dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-filters')) {
                document.querySelectorAll('.filter-dropdown').forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            }
        });
    }

    handleSearch(query, section) {
        this.currentFilters.search = query.toLowerCase();
        this.applyFilters();
        this.updateSectionDisplay(section);
    }

    clearSearch(section) {
        const searchInput = document.querySelector(`.search-input[data-section="${section}"]`);
        if (searchInput) {
            searchInput.value = '';
            searchInput.closest('.search-box').querySelector('.search-clear').style.display = 'none';
        }
        this.currentFilters.search = '';
        this.applyFilters();
        this.updateSectionDisplay(section);
    }

    toggleClearButton(input) {
        const clearBtn = input.closest('.search-box').querySelector('.search-clear');
        clearBtn.style.display = input.value ? 'block' : 'none';
    }

    // Advanced Filtering System
    initAdvancedFilters() {
        this.createGlobalFilters();
        this.setupGlobalFilterListeners();
    }

    createGlobalFilters() {
        const semestersSection = document.getElementById('semesters');
        if (semestersSection && !semestersSection.querySelector('.global-filters')) {
            const filtersHTML = `
                <div class="global-filters">
                    <div class="filter-card">
                        <h3>Advanced Filters</h3>
                        <div class="filter-row">
                            <div class="filter-item">
                                <label>File Type</label>
                                <select id="globalTypeFilter">
                                    <option value="all">All Types</option>
                                    <option value="book">Books</option>
                                    <option value="note">Notes</option>
                                    <option value="record">Records</option>
                                    <option value="question">Questions</option>
                                </select>
                            </div>
                            <div class="filter-item">
                                <label>Semester</label>
                                <select id="globalSemesterFilter">
                                    <option value="all">All Semesters</option>
                                    ${[1,2,3,4,5,6,7,8].map(sem => 
                                        `<option value="${sem}">Semester ${sem}</option>`
                                    ).join('')}
                                </select>
                            </div>
                            <div class="filter-item">
                                <label>Subject</label>
                                <select id="globalSubjectFilter">
                                    <option value="all">All Subjects</option>
                                    <option value="Computer Science">Computer Science</option>
                                    <option value="Mathematics">Mathematics</option>
                                    <option value="Physics">Physics</option>
                                    <option value="Chemistry">Chemistry</option>
                                    <option value="Database Management">Database Management</option>
                                    <option value="Operating Systems">Operating Systems</option>
                                </select>
                            </div>
                        </div>
                        <div class="filter-actions">
                            <button id="applyGlobalFilters" class="btn btn-primary">
                                Apply Filters
                            </button>
                            <button id="resetGlobalFilters" class="btn btn-secondary">
                                Reset All
                            </button>
                        </div>
                    </div>
                </div>
            `;
            semestersSection.querySelector('.section-header').insertAdjacentHTML('afterend', filtersHTML);
        }
    }

    setupGlobalFilterListeners() {
        // Global filter application
        document.getElementById('applyGlobalFilters')?.addEventListener('click', () => {
            this.applyGlobalFilters();
        });

        // Global filter reset
        document.getElementById('resetGlobalFilters')?.addEventListener('click', () => {
            this.resetGlobalFilters();
        });

        // Real-time filter updates
        ['globalTypeFilter', 'globalSemesterFilter', 'globalSubjectFilter'].forEach(id => {
            document.getElementById(id)?.addEventListener('change', () => {
                // Optional: Apply filters on change instead of requiring button click
                // this.applyGlobalFilters();
            });
        });
    }

    applyGlobalFilters() {
        this.currentFilters.type = document.getElementById('globalTypeFilter').value;
        this.currentFilters.semester = document.getElementById('globalSemesterFilter').value;
        this.currentFilters.subject = document.getElementById('globalSubjectFilter').value;

        this.applyFilters();
        this.updateAllSections();
    }

    resetGlobalFilters() {
        document.getElementById('globalTypeFilter').value = 'all';
        document.getElementById('globalSemesterFilter').value = 'all';
        document.getElementById('globalSubjectFilter').value = 'all';

        this.currentFilters = {
            semester: 'all',
            type: 'all',
            subject: 'all',
            search: ''
        };

        this.applyFilters();
        this.updateAllSections();
    }

    applySectionFilters(section) {
        const sectionElement = document.getElementById(section);
        if (!sectionElement) return;

        const semesterFilter = sectionElement.querySelector('.filter-semester').value;
        const subjectFilter = sectionElement.querySelector('.filter-subject').value;

        this.currentFilters.semester = semesterFilter;
        this.currentFilters.subject = subjectFilter;
        this.currentFilters.type = this.getTypeFromSection(section);

        this.applyFilters();
        this.updateSectionDisplay(section);
    }

    resetSectionFilters(section) {
        const sectionElement = document.getElementById(section);
        if (!sectionElement) return;

        sectionElement.querySelector('.filter-semester').value = 'all';
        sectionElement.querySelector('.filter-subject').value = 'all';
        sectionElement.querySelector('.search-input').value = '';
        sectionElement.querySelector('.search-clear').style.display = 'none';

        this.currentFilters.semester = 'all';
        this.currentFilters.subject = 'all';
        this.currentFilters.search = '';
        this.currentFilters.type = this.getTypeFromSection(section);

        this.applyFilters();
        this.updateSectionDisplay(section);
    }

    getTypeFromSection(section) {
        const typeMap = {
            'books': 'book',
            'notes': 'note',
            'records': 'record',
            'questions': 'question'
        };
        return typeMap[section] || 'all';
    }

    // Sorting System
    initSorting() {
        this.createSortInterface();
        this.setupSortListeners();
    }

    createSortInterface() {
        const sections = ['books', 'notes', 'records', 'questions'];
        
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                const header = section.querySelector('.section-header');
                const searchContainer = header.querySelector('.advanced-search-container');
                
                if (searchContainer && !searchContainer.querySelector('.sort-options')) {
                    const sortHTML = `
                        <div class="sort-options">
                            <label>Sort by:</label>
                            <select class="sort-select" data-section="${sectionId}">
                                <option value="date-desc">Newest First</option>
                                <option value="date-asc">Oldest First</option>
                                <option value="name-asc">Name A-Z</option>
                                <option value="name-desc">Name Z-A</option>
                                <option value="downloads-desc">Most Popular</option>
                                <option value="rating-desc">Highest Rated</option>
                                <option value="size-asc">Smallest Size</option>
                                <option value="size-desc">Largest Size</option>
                            </select>
                        </div>
                    `;
                    searchContainer.insertAdjacentHTML('beforeend', sortHTML);
                }
            }
        });
    }

    setupSortListeners() {
        document.querySelectorAll('.sort-select').forEach(select => {
            select.addEventListener('change', (e) => {
                const [sortBy, order] = e.target.value.split('-');
                this.sortBy = sortBy;
                this.sortOrder = order;
                this.applyFilters();
                this.updateSectionDisplay(e.target.dataset.section);
            });
        });
    }

    // Bulk Actions System
    initBulkActions() {
        this.createBulkActionInterface();
        this.setupBulkActionListeners();
    }

    createBulkActionInterface() {
        const mainContent = document.querySelector('.main-content');
        if (!mainContent.querySelector('.bulk-actions-bar')) {
            const bulkHTML = `
                <div class="bulk-actions-bar" style="display: none;">
                    <div class="bulk-actions-content">
                        <span class="selected-count">
                            <span id="selectedFilesCount">0</span> files selected
                        </span>
                        <div class="bulk-buttons">
                            <button class="btn btn-outline bulk-download">
                                <i class="fas fa-download"></i> Download Selected
                            </button>
                            <button class="btn btn-outline bulk-delete">
                                <i class="fas fa-trash"></i> Delete Selected
                            </button>
                            <button class="btn btn-outline bulk-clear">
                                <i class="fas fa-times"></i> Clear Selection
                            </button>
                        </div>
                    </div>
                </div>
            `;
            mainContent.insertAdjacentHTML('afterbegin', bulkHTML);
        }
    }

    setupBulkActionListeners() {
        // Bulk download
        document.querySelector('.bulk-download')?.addEventListener('click', () => {
            this.downloadSelectedFiles();
        });

        // Bulk delete
        document.querySelector('.bulk-delete')?.addEventListener('click', () => {
            this.deleteSelectedFiles();
        });

        // Clear selection
        document.querySelector('.bulk-clear')?.addEventListener('click', () => {
            this.clearSelection();
        });
    }

    // File Operations
    initFileOperations() {
        this.setupFileEventListeners();
        this.initFilePreview();
        this.initDragAndDrop();
    }

    setupFileEventListeners() {
        // Delegate file card events
        document.addEventListener('click', (e) => {
            // Download button
            if (e.target.closest('.download-btn')) {
                const fileCard = e.target.closest('.file-card');
                const fileId = fileCard?.dataset.fileId;
                if (fileId) this.downloadFile(fileId);
            }

            // Delete button
            if (e.target.closest('.delete-btn')) {
                const fileCard = e.target.closest('.file-card');
                const fileId = fileCard?.dataset.fileId;
                if (fileId) this.deleteFile(fileId);
            }

            // Share button
            if (e.target.closest('.share-btn')) {
                const fileCard = e.target.closest('.file-card');
                const fileId = fileCard?.dataset.fileId;
                if (fileId) this.shareFile(fileId);
            }

            // Selection checkbox
            if (e.target.type === 'checkbox' && e.target.classList.contains('file-select')) {
                this.toggleFileSelection(e.target);
            }
        });
    }

    initFilePreview() {
        // Enhanced file preview functionality
        document.addEventListener('click', (e) => {
            if (e.target.closest('.file-card') && !e.target.closest('.file-actions')) {
                const fileCard = e.target.closest('.file-card');
                const fileId = fileCard?.dataset.fileId;
                if (fileId) this.showFilePreview(fileId);
            }
        });
    }

    initDragAndDrop() {
        // Enhanced drag and drop for file upload area
        const uploadArea = document.getElementById('fileUploadArea');
        if (uploadArea) {
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.classList.add('dragover');
                uploadArea.innerHTML = `
                    <i class="fas fa-file-upload"></i>
                    <p>Drop files to upload</p>
                `;
            });

            uploadArea.addEventListener('dragleave', () => {
                uploadArea.classList.remove('dragover');
                this.resetUploadArea();
            });

            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('dragover');
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    this.handleDroppedFiles(files);
                }
            });
        }
    }

    // Core File Management Methods
    addFile(fileData) {
        const newFile = {
            id: this.generateId(),
            uploadDate: new Date().toISOString().split('T')[0],
            downloads: 0,
            rating: 0,
            ...fileData
        };

        this.files.unshift(newFile);
        this.saveFilesToStorage();
        this.applyFilters();
        
        // Show success notification
        this.showNotification(`"${fileData.name}" uploaded successfully!`, 'success');
        
        return newFile.id;
    }

    updateFile(fileId, updates) {
        const fileIndex = this.files.findIndex(file => file.id === fileId);
        if (fileIndex !== -1) {
            this.files[fileIndex] = { ...this.files[fileIndex], ...updates };
            this.saveFilesToStorage();
            this.applyFilters();
            return true;
        }
        return false;
    }

    deleteFile(fileId) {
        if (confirm('Are you sure you want to delete this file?')) {
            this.files = this.files.filter(file => file.id !== fileId);
            this.saveFilesToStorage();
            this.applyFilters();
            this.showNotification('File deleted successfully!', 'success');
        }
    }

    downloadFile(fileId) {
        const file = this.files.find(f => f.id === fileId);
        if (file) {
            // Increment download count
            file.downloads = (file.downloads || 0) + 1;
            this.saveFilesToStorage();

            // Simulate download
            this.showNotification(`Downloading "${file.name}"...`, 'info');
            
            // In a real application, this would trigger an actual download
            console.log(`Downloading file: ${file.fileName}`);
        }
    }

    shareFile(fileId) {
        const file = this.files.find(f => f.id === fileId);
        if (file) {
            // Create shareable link (simulated)
            const shareLink = `${window.location.origin}/file/${fileId}`;
            
            // Copy to clipboard
            navigator.clipboard.writeText(shareLink).then(() => {
                this.showNotification('Share link copied to clipboard!', 'success');
            }).catch(() => {
                // Fallback: show link in prompt
                prompt('Share this link:', shareLink);
            });
        }
    }

    // Filtering and Sorting
    applyFilters() {
        let filtered = [...this.files];

        // Apply type filter
        if (this.currentFilters.type !== 'all') {
            filtered = filtered.filter(file => file.type === this.currentFilters.type);
        }

        // Apply semester filter
        if (this.currentFilters.semester !== 'all') {
            filtered = filtered.filter(file => file.semester == this.currentFilters.semester);
        }

        // Apply subject filter
        if (this.currentFilters.subject !== 'all') {
            filtered = filtered.filter(file => 
                file.subject.toLowerCase().includes(this.currentFilters.subject.toLowerCase())
            );
        }

        // Apply search filter
        if (this.currentFilters.search) {
            const searchTerm = this.currentFilters.search.toLowerCase();
            filtered = filtered.filter(file => 
                file.name.toLowerCase().includes(searchTerm) ||
                file.subject.toLowerCase().includes(searchTerm) ||
                file.description.toLowerCase().includes(searchTerm) ||
                file.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
            );
        }

        // Apply sorting
        filtered = this.sortFiles(filtered);

        this.filteredFiles = filtered;
    }

    sortFiles(files) {
        return files.sort((a, b) => {
            let aValue, bValue;

            switch (this.sortBy) {
                case 'name':
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
                    break;
                case 'date':
                    aValue = new Date(a.uploadDate);
                    bValue = new Date(b.uploadDate);
                    break;
                case 'downloads':
                    aValue = a.downloads || 0;
                    bValue = b.downloads || 0;
                    break;
                case 'rating':
                    aValue = a.rating || 0;
                    bValue = b.rating || 0;
                    break;
                case 'size':
                    aValue = this.parseFileSize(a.fileSize);
                    bValue = this.parseFileSize(b.fileSize);
                    break;
                default:
                    return 0;
            }

            if (this.sortOrder === 'asc') {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            } else {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
            }
        });
    }

    parseFileSize(sizeString) {
        if (!sizeString) return 0;
        const units = { 'B': 1, 'KB': 1024, 'MB': 1024 * 1024, 'GB': 1024 * 1024 * 1024 };
        const [value, unit] = sizeString.split(' ');
        return parseFloat(value) * (units[unit] || 1);
    }

    // Bulk Operations
    toggleFileSelection(checkbox) {
        const fileCard = checkbox.closest('.file-card');
        const fileId = fileCard.dataset.fileId;
        
        if (checkbox.checked) {
            fileCard.classList.add('selected');
        } else {
            fileCard.classList.remove('selected');
        }

        this.updateBulkActionsBar();
    }

    updateBulkActionsBar() {
        const selectedCount = document.querySelectorAll('.file-card.selected').length;
        const bulkBar = document.querySelector('.bulk-actions-bar');
        const countElement = document.getElementById('selectedFilesCount');

        if (countElement) countElement.textContent = selectedCount;

        if (selectedCount > 0) {
            bulkBar.style.display = 'block';
        } else {
            bulkBar.style.display = 'none';
        }
    }

    downloadSelectedFiles() {
        const selectedFiles = document.querySelectorAll('.file-card.selected');
        const fileIds = Array.from(selectedFiles).map(card => card.dataset.fileId);
        
        this.showNotification(`Preparing download of ${fileIds.length} files...`, 'info');
        
        // Simulate bulk download
        fileIds.forEach(fileId => {
            this.downloadFile(fileId);
        });

        this.clearSelection();
    }

    deleteSelectedFiles() {
        const selectedFiles = document.querySelectorAll('.file-card.selected');
        const fileIds = Array.from(selectedFiles).map(card => card.dataset.fileId);

        if (confirm(`Are you sure you want to delete ${fileIds.length} selected files?`)) {
            fileIds.forEach(fileId => {
                this.deleteFile(fileId);
            });
            this.clearSelection();
        }
    }

    clearSelection() {
        document.querySelectorAll('.file-card.selected').forEach(card => {
            card.classList.remove('selected');
        });
        document.querySelectorAll('.file-select').forEach(checkbox => {
            checkbox.checked = false;
        });
        this.updateBulkActionsBar();
    }

    // Storage Management
    initStorageManager() {
        this.setupStorageMonitoring();
    }

    setupStorageMonitoring() {
        // Monitor storage usage
        setInterval(() => {
            this.updateStorageInfo();
        }, 30000); // Update every 30 seconds

        this.updateStorageInfo();
    }

    updateStorageInfo() {
        const totalSize = this.files.reduce((sum, file) => {
            return sum + this.parseFileSize(file.fileSize);
        }, 0);

        const fileCount = this.files.length;
        
        // Update storage info in UI if needed
        const storageElement = document.getElementById('storageInfo');
        if (storageElement) {
            storageElement.textContent = `Storage: ${this.formatFileSize(totalSize)} (${fileCount} files)`;
        }
    }

    // Utility Methods
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    showNotification(message, type = 'info') {
        // Use existing notification system or create new one
        const notification = document.getElementById('notification');
        const notificationText = document.getElementById('notificationText');
        
        if (notification && notificationText) {
            notificationText.textContent = message;
            notification.className = `notification ${type}`;
            notification.classList.add('active');

            setTimeout(() => {
                notification.classList.remove('active');
            }, 3000);
        } else {
            // Fallback: alert
            alert(message);
        }
    }

    resetUploadArea() {
        const uploadArea = document.getElementById('fileUploadArea');
        if (uploadArea) {
            uploadArea.innerHTML = `
                <i class="fas fa-cloud-upload-alt"></i>
                <p>Drag & drop files here or click to browse</p>
                <input type="file" id="fileUpload" hidden>
            `;
        }
    }

    handleDroppedFiles(files) {
        // Handle multiple file uploads
        Array.from(files).forEach(file => {
            this.processDroppedFile(file);
        });
    }

    processDroppedFile(file) {
        // Validate file type
        const allowedTypes = ['.pdf', '.doc', '.docx', '.txt', '.jpg', '.png'];
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        
        if (!allowedTypes.includes(fileExtension)) {
            this.showNotification(`File type ${fileExtension} is not supported!`, 'error');
            return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            this.showNotification('File size must be less than 10MB!', 'error');
            return;
        }

        // Create file object and add to system
        const fileData = {
            name: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
            type: this.detectFileType(file),
            subject: 'General',
            semester: 1,
            description: `Uploaded file: ${file.name}`,
            fileSize: this.formatFileSize(file.size),
            fileName: file.name,
            uploadedBy: 'current_user'
        };

        this.addFile(fileData);
    }

    detectFileType(file) {
        const name = file.name.toLowerCase();
        if (name.includes('book') || name.includes('textbook')) return 'book';
        if (name.includes('note') || name.includes('lecture')) return 'note';
        if (name.includes('lab') || name.includes('record')) return 'record';
        if (name.includes('question') || name.includes('exam')) return 'question';
        return 'book'; // Default
    }

    // UI Update Methods
    updateAllSections() {
        ['books', 'notes', 'records', 'questions'].forEach(section => {
            this.updateSectionDisplay(section);
        });
    }

    updateSectionDisplay(section) {
        const sectionElement = document.getElementById(section);
        if (!sectionElement) return;

        const contentGrid = sectionElement.querySelector('.content-grid');
        if (!contentGrid) return;

        // Get files for this section
        const sectionType = this.getTypeFromSection(section);
        let sectionFiles = this.filteredFiles;

        if (sectionType !== 'all') {
            sectionFiles = sectionFiles.filter(file => file.type === sectionType);
        }

        // Update section content
        contentGrid.innerHTML = '';

        if (sectionFiles.length === 0) {
            contentGrid.innerHTML = `
                <div class="no-files-message">
                    <i class="fas fa-folder-open"></i>
                    <h3>No files found</h3>
                    <p>Try adjusting your filters or upload new files.</p>
                </div>
            `;
            return;
        }

        sectionFiles.forEach(file => {
            const fileCard = this.createFileCard(file);
            contentGrid.appendChild(fileCard);
        });

        // Update file count in section header
        this.updateSectionFileCount(section, sectionFiles.length);
    }

    updateSectionFileCount(section, count) {
        const sectionHeader = document.getElementById(section)?.querySelector('.section-header h1');
        if (sectionHeader) {
            const baseText = sectionHeader.textContent.replace(/\(\d+\)/, '').trim();
            sectionHeader.textContent = `${baseText} (${count})`;
        }
    }

    createFileCard(file) {
        const card = document.createElement('div');
        card.className = 'file-card stagger-item';
        card.dataset.fileId = file.id;

        card.innerHTML = `
            <div class="file-card-header">
                <input type="checkbox" class="file-select">
                <div class="file-type-icon ${file.type}">
                    <i class="fas fa-${this.getFileIcon(file.type)}"></i>
                </div>
                <div class="file-actions-mini">
                    <button class="btn-icon download-btn" title="Download">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="btn-icon share-btn" title="Share">
                        <i class="fas fa-share-alt"></i>
                    </button>
                </div>
            </div>
            <div class="file-icon">
                <i class="fas fa-${this.getFileIcon(file.type)}"></i>
            </div>
            <div class="file-info">
                <h3>${file.name}</h3>
                <div class="file-meta">
                    <span class="file-subject">${file.subject}</span>
                    <span class="file-date">${this.formatDate(file.uploadDate)}</span>
                </div>
                <p class="file-description">${file.description}</p>
                <div class="file-stats">
                    <span><i class="fas fa-download"></i> ${file.downloads}</span>
                    <span><i class="fas fa-star"></i> ${file.rating}</span>
                    <span><i class="fas fa-layer-group"></i> Sem ${file.semester}</span>
                </div>
                <div class="file-tags">
                    ${file.tags?.map(tag => `<span class="file-tag">${tag}</span>`).join('') || ''}
                </div>
            </div>
        `;

        return card;
    }

    getFileIcon(type) {
        const icons = {
            'book': 'book',
            'note': 'sticky-note',
            'record': 'file-alt',
            'question': 'question-circle'
        };
        return icons[type] || 'file';
    }

    formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    showFilePreview(fileId) {
        const file = this.files.find(f => f.id === fileId);
        if (!file) return;

        // Update preview modal content
        document.getElementById('previewTitle').textContent = file.name;
        document.getElementById('previewFileName').textContent = file.name;
        document.getElementById('previewFileSubject').textContent = file.subject;
        document.getElementById('previewFileDescription').textContent = file.description;
        document.getElementById('previewFileDate').textContent = this.formatDate(file.uploadDate);
        document.getElementById('previewFileSemester').textContent = file.semester;

        // Show preview modal
        document.getElementById('previewModal').classList.add('active');
    }
}

// Initialize File Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.fileManager = new FileManager();
});

// Export functionality for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FileManager;
}