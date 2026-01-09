// Admin Panel JavaScript
class PortfolioAdmin {
    constructor() {
        this.projects = [];
        this.testimonials = [];
        this.init();
    }
    
    init() {
        this.loadData();
        this.setupEventListeners();
    }
    
    loadData() {
        fetch('projects.json')
            .then(response => response.json())
            .then(data => {
                this.projects = data.projects || [];
                this.testimonials = data.testimonials || [];
                this.displayProjects();
                this.displayTestimonials();
            })
            .catch(error => {
                console.error('Error loading data:', error);
                // Create empty data structure if file doesn't exist
                this.projects = [];
                this.testimonials = [];
                this.saveData();
            });
    }
    
    saveData() {
        const data = {
            projects: this.projects,
            testimonials: this.testimonials
        };
        
        // In a real application, you would send this to a server
        // For local storage (temporary solution):
        localStorage.setItem('portfolioData', JSON.stringify(data));
        
        // For demo purposes - show download link
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        // Create download link
        const downloadLink = document.getElementById('downloadData');
        if (downloadLink) {
            downloadLink.href = URL.createObjectURL(dataBlob);
            downloadLink.download = 'projects.json';
        }
    }
    
    displayProjects() {
        const container = document.getElementById('adminProjects');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.projects.forEach((project, index) => {
            const projectElement = `
                <div class="admin-project-item">
                    <div class="project-preview">
                        <img src="${project.image}" alt="${project.title}" onerror="this.src='assets/images/default.jpg'">
                    </div>
                    <div class="project-info">
                        <h4>${project.title}</h4>
                        <p>${project.type} - ${project.category}</p>
                        <div class="project-actions">
                            <button class="btn-edit" onclick="portfolioAdmin.editProject(${index})">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="btn-delete" onclick="portfolioAdmin.deleteProject(${index})">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += projectElement;
        });
    }
    
    displayTestimonials() {
        const container = document.getElementById('adminTestimonials');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.testimonials.forEach((testimonial, index) => {
            const testimonialElement = `
                <div class="admin-testimonial-item">
                    <div class="testimonial-content">
                        <p>"${testimonial.text}"</p>
                        <div class="client-info">
                            <strong>${testimonial.name}</strong>
                            <span>${testimonial.role}</span>
                        </div>
                    </div>
                    <div class="testimonial-actions">
                        <button class="btn-edit" onclick="portfolioAdmin.editTestimonial(${index})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-delete" onclick="portfolioAdmin.deleteTestimonial(${index})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            container.innerHTML += testimonialElement;
        });
    }
    
    addProject() {
        const title = document.getElementById('projectTitle').value;
        const type = document.getElementById('projectType').value;
        const category = document.getElementById('projectCategory').value;
        const image = document.getElementById('projectImage').value;
        const link = document.getElementById('projectLink').value;
        const description = document.getElementById('projectDescription').value;
        
        if (!title || !type || !category || !image) {
            alert('Please fill in all required fields');
            return;
        }
        
        const newProject = {
            id: Date.now(),
            title,
            type,
            category,
            image,
            link: link || '#',
            description,
            video: category === 'video' ? link : null
        };
        
        this.projects.push(newProject);
        this.saveData();
        this.displayProjects();
        
        // Reset form
        document.getElementById('addProjectForm').reset();
        alert('Project added successfully!');
    }
    
    editProject(index) {
        const project = this.projects[index];
        
        // Fill form with project data
        document.getElementById('projectTitle').value = project.title;
        document.getElementById('projectType').value = project.type;
        document.getElementById('projectCategory').value = project.category;
        document.getElementById('projectImage').value = project.image;
        document.getElementById('projectLink').value = project.link;
        document.getElementById('projectDescription').value = project.description;
        
        // Change button to update
        const submitBtn = document.getElementById('submitProject');
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Update Project';
        submitBtn.onclick = () => this.updateProject(index);
    }
    
    updateProject(index) {
        const title = document.getElementById('projectTitle').value;
        const type = document.getElementById('projectType').value;
        const category = document.getElementById('projectCategory').value;
        const image = document.getElementById('projectImage').value;
        const link = document.getElementById('projectLink').value;
        const description = document.getElementById('projectDescription').value;
        
        this.projects[index] = {
            ...this.projects[index],
            title,
            type,
            category,
            image,
            link: link || '#',
            description,
            video: category === 'video' ? link : null
        };
        
        this.saveData();
        this.displayProjects();
        
        // Reset form and button
        document.getElementById('addProjectForm').reset();
        const submitBtn = document.getElementById('submitProject');
        submitBtn.innerHTML = '<i class="fas fa-plus"></i> Add Project';
        submitBtn.onclick = () => this.addProject();
        
        alert('Project updated successfully!');
    }
    
    deleteProject(index) {
        if (confirm('Are you sure you want to delete this project?')) {
            this.projects.splice(index, 1);
            this.saveData();
            this.displayProjects();
            alert('Project deleted successfully!');
        }
    }
    
    addTestimonial() {
        const name = document.getElementById('clientName').value;
        const role = document.getElementById('clientRole').value;
        const text = document.getElementById('testimonialText').value;
        const rating = document.getElementById('clientRating').value;
        
        if (!name || !role || !text) {
            alert('Please fill in all required fields');
            return;
        }
        
        const newTestimonial = {
            id: Date.now(),
            name,
            role,
            text,
            rating: parseInt(rating) || 5
        };
        
        this.testimonials.push(newTestimonial);
        this.saveData();
        this.displayTestimonials();
        
        // Reset form
        document.getElementById('addTestimonialForm').reset();
        alert('Testimonial added successfully!');
    }
    
    editTestimonial(index) {
        const testimonial = this.testimonials[index];
        
        // Fill form with testimonial data
        document.getElementById('clientName').value = testimonial.name;
        document.getElementById('clientRole').value = testimonial.role;
        document.getElementById('testimonialText').value = testimonial.text;
        document.getElementById('clientRating').value = testimonial.rating;
        
        // Change button to update
        const submitBtn = document.getElementById('submitTestimonial');
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Update Testimonial';
        submitBtn.onclick = () => this.updateTestimonial(index);
    }
    
    updateTestimonial(index) {
        const name = document.getElementById('clientName').value;
        const role = document.getElementById('clientRole').value;
        const text = document.getElementById('testimonialText').value;
        const rating = document.getElementById('clientRating').value;
        
        this.testimonials[index] = {
            ...this.testimonials[index],
            name,
            role,
            text,
            rating: parseInt(rating) || 5
        };
        
        this.saveData();
        this.displayTestimonials();
        
        // Reset form and button
        document.getElementById('addTestimonialForm').reset();
        const submitBtn = document.getElementById('submitTestimonial');
        submitBtn.innerHTML = '<i class="fas fa-plus"></i> Add Testimonial';
        submitBtn.onclick = () => this.addTestimonial();
        
        alert('Testimonial updated successfully!');
    }
    
    deleteTestimonial(index) {
        if (confirm('Are you sure you want to delete this testimonial?')) {
            this.testimonials.splice(index, 1);
            this.saveData();
            this.displayTestimonials();
            alert('Testimonial deleted successfully!');
        }
    }
    
    uploadImage() {
        const fileInput = document.getElementById('imageUpload');
        const file = fileInput.files[0];
        
        if (!file) {
            alert('Please select an image file');
            return;
        }
        
        // In a real application, you would upload to server
        // For demo, create a local URL
        const imageUrl = URL.createObjectURL(file);
        
        // Set the image URL in the project form
        document.getElementById('projectImage').value = imageUrl;
        
        // Show preview
        const preview = document.getElementById('imagePreview');
        preview.innerHTML = `<img src="${imageUrl}" alt="Preview" style="max-width: 200px; border-radius: 5px;">`;
        
        alert('Image ready to use! Copy the URL to use in your project.');
    }
}

// Initialize admin panel
const portfolioAdmin = new PortfolioAdmin();

// Make it available globally
window.portfolioAdmin = portfolioAdmin;