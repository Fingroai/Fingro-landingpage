document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const header = document.querySelector('.sticky-header');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('show');
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-xmark');
            }
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navLinks.classList.contains('show') && 
            !navLinks.contains(e.target) && 
            !mobileMenuBtn.contains(e.target)) {
            navLinks.classList.remove('show');
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-xmark');
            }
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu if open
            if (navLinks.classList.contains('show')) {
                navLinks.classList.remove('show');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-xmark');
                }
            }
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                
                window.scrollTo({
                    top: targetPosition - headerHeight - 20,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // FAQ accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
    
    // Testimonial slider
    const testimonials = document.querySelectorAll('.testimonial');
    const controls = document.querySelectorAll('.testimonial-controls .control');
    let currentSlide = 0;
    
    function showSlide(index) {
        testimonials.forEach(testimonial => {
            testimonial.classList.remove('active');
        });
        
        controls.forEach(control => {
            control.classList.remove('active');
        });
        
        testimonials[index].classList.add('active');
        controls[index].classList.add('active');
    }
    
    // Initial slide
    showSlide(0);
    
    // Click on controls to navigate
    controls.forEach((control, index) => {
        control.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });
    
    // Auto rotate slides
    let slideInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % testimonials.length;
        showSlide(currentSlide);
    }, 5000);
    
    // Pause rotation on hover
    const testimonialContainer = document.querySelector('.testimonial-container');
    if (testimonialContainer) {
        testimonialContainer.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        testimonialContainer.addEventListener('mouseleave', () => {
            slideInterval = setInterval(() => {
                currentSlide = (currentSlide + 1) % testimonials.length;
                showSlide(currentSlide);
            }, 5000);
        });
    }
    
    // Modal functionality
    const modalOverlay = document.getElementById('demo-modal');
    const modalClose = document.querySelector('.modal-close');
    const demoButtons = document.querySelectorAll('.open-demo-modal');
    
    // Open modal
    demoButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent body scrolling
        });
    });
    
    // Close modal
    if (modalClose) {
        modalClose.addEventListener('click', () => {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Close modal when clicking outside
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Demo form submission
    const demoForm = document.getElementById('demo-form');
    
    if (demoForm) {
        demoForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitButton = demoForm.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            
            try {
                // Enviar formulario usando fetch API a Formspree
                const formData = new FormData(demoForm);
                const response = await fetch(demoForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    demoForm.innerHTML = `
                        <div class="success-message">
                            <i class="fas fa-check-circle"></i>
                            <h3>¡Demo Agendada!</h3>
                            <p>Gracias por tu interés en Fingro. Un especialista se pondrá en contacto contigo en las próximas 24 horas para confirmar la fecha y hora de tu demo personalizada.</p>
                        </div>
                    `;
                    
                    // Close modal after 5 seconds
                    setTimeout(() => {
                        modalOverlay.classList.remove('active');
                        document.body.style.overflow = '';
                        
                        // Reset form after closing
                        setTimeout(() => {
                            demoForm.reset();
                            demoForm.innerHTML = `
                                <div class="form-group">
                                    <input type="text" id="demo-name" name="name" placeholder="Nombre completo" required>
                                </div>
                                <div class="form-group">
                                    <input type="email" id="demo-email" name="email" placeholder="Correo electrónico" required>
                                </div>
                                <div class="form-group">
                                    <input type="text" id="demo-cooperative" name="cooperative" placeholder="Nombre de la cooperativa" required>
                                </div>
                                <div class="form-group">
                                    <input type="tel" id="demo-phone" name="phone" placeholder="Teléfono / WhatsApp" required>
                                </div>
                                <div class="form-group">
                                    <select id="demo-interest" name="interest" required>
                                        <option value="">¿Qué te interesa más?</option>
                                        <option value="chatbot">Fingro Chatbot</option>
                                        <option value="score">Fingro Score</option>
                                        <option value="both">Ambos</option>
                                    </select>
                                </div>
                                <input type="hidden" name="_subject" value="Nueva solicitud de demo - Fingro">
                                <input type="hidden" name="form_type" value="solicitud_demo">
                                <button type="submit" class="btn-primary">Solicitar Demo</button>
                            `;
                        }, 500);
                    }, 5000);
                } else {
                    throw new Error('Error al enviar formulario');
                }
            } catch (error) {
                submitButton.disabled = false;
                submitButton.innerHTML = 'Solicitar Demo';
                alert('Hubo un error al enviar el formulario. Por favor intenta nuevamente.');
            }
        });
    }
    
    // Animate elements on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.feature, .step, .benefit-card, .score-feature, .pricing-card');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            
            if (elementTop < window.innerHeight && elementBottom > 0) {
                element.classList.add('animate');
            }
        });
    };

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Initial check
    
    // Header scroll effect
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > lastScroll && currentScroll > 100) {
            // Scrolling down
            header.classList.add('header-hidden');
        } else {
            // Scrolling up
            header.classList.remove('header-hidden');
        }
        
        if (currentScroll > 100) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // Form submission with validation
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        const validateEmail = (email) => {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        };
        
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Validación básica
            let isValid = true;
            const nameInput = contactForm.querySelector('#name');
            const emailInput = contactForm.querySelector('#email');
            const cooperativeInput = contactForm.querySelector('#cooperative');
            const planInput = contactForm.querySelector('#plan');
            const messageInput = contactForm.querySelector('#message');
            
            if (!nameInput.value.trim()) {
                isValid = false;
                nameInput.classList.add('error');
            } else {
                nameInput.classList.remove('error');
            }
            
            if (!emailInput.value.trim() || !validateEmail(emailInput.value)) {
                isValid = false;
                emailInput.classList.add('error');
            } else {
                emailInput.classList.remove('error');
            }
            
            if (!cooperativeInput.value.trim()) {
                isValid = false;
                cooperativeInput.classList.add('error');
            } else {
                cooperativeInput.classList.remove('error');
            }
            
            if (!planInput.value) {
                isValid = false;
                planInput.classList.add('error');
            } else {
                planInput.classList.remove('error');
            }
            
            if (!messageInput.value.trim()) {
                isValid = false;
                messageInput.classList.add('error');
            } else {
                messageInput.classList.remove('error');
            }
            
            if (isValid) {
                const submitButton = contactForm.querySelector('button[type="submit"]');
                submitButton.disabled = true;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
                
                try {
                    // Crear objeto con los datos del formulario
                    const formData = new FormData();
                    formData.append('name', nameInput.value);
                    formData.append('email', emailInput.value);
                    formData.append('cooperative', cooperativeInput.value);
                    formData.append('plan', planInput.value);
                    formData.append('message', messageInput.value);
                    formData.append('form_type', 'solicitud_acceso');
                    formData.append('_subject', 'Nueva solicitud de acceso a prueba piloto - Fingro');
                    
                    // Enviar formulario usando fetch API a Formspree
                    const response = await fetch('https://formspree.io/f/movearpy', {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Accept': 'application/json'
                        }
                    });

                    if (response.ok) {
                        contactForm.innerHTML = `
                            <div class="success-message">
                                <i class="fas fa-check-circle"></i>
                                <h3>¡Gracias por tu interés!</h3>
                                <p>Hemos recibido tu solicitud. Nuestro equipo se pondrá en contacto contigo pronto para comenzar con la prueba piloto.</p>
                            </div>
                        `;
                    } else {
                        throw new Error('Error al enviar formulario');
                    }
                } catch (error) {
                    submitButton.disabled = false;
                    submitButton.innerHTML = 'Enviar Solicitud';
                    alert('Hubo un error al enviar el formulario. Por favor intenta nuevamente.');
                }
            } else {
                alert('Por favor completa todos los campos correctamente.');
            }
        });
        
        // Eliminar clase de error al escribir
        contactForm.querySelectorAll('input, select, textarea').forEach(input => {
            input.addEventListener('input', function() {
                this.classList.remove('error');
            });
        });
    }
    
    // Add CSS for dynamic elements
    const style = document.createElement('style');
    style.textContent = `
        .nav-links.show {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(10px);
            padding: 20px;
            box-shadow: var(--shadow-md);
            z-index: 1000;
        }
        
        .nav-links.show li {
            margin: 10px 0;
        }
        
        .header-scrolled {
            backdrop-filter: blur(10px);
            box-shadow: var(--shadow-md);
        }
        
        .header-hidden {
            transform: translateY(-100%);
        }
        
        .success-message {
            text-align: center;
            padding: 40px;
            animation: fadeIn 0.5s ease;
        }
        
        .success-message i {
            font-size: 4rem;
            color: var(--green-neon);
            margin-bottom: 20px;
        }
        
        .error-message {
            color: #dc3545;
            font-size: 0.875rem;
            margin-top: 5px;
            animation: fadeIn 0.3s ease;
        }
        
        input.error,
        select.error,
        textarea.error {
            border-color: #dc3545;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        /* Animation classes */
        .feature,
        .step,
        .benefit-card,
        .score-feature,
        .pricing-card {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .feature.animate,
        .step.animate,
        .benefit-card.animate,
        .score-feature.animate,
        .pricing-card.animate {
            opacity: 1;
            transform: translateY(0);
        }
        
        /* Stagger animations */
        .feature:nth-child(1) { transition-delay: 0.1s; }
        .feature:nth-child(2) { transition-delay: 0.2s; }
        .feature:nth-child(3) { transition-delay: 0.3s; }
        .feature:nth-child(4) { transition-delay: 0.4s; }
        
        .step:nth-child(1) { transition-delay: 0.1s; }
        .step:nth-child(2) { transition-delay: 0.2s; }
        .step:nth-child(3) { transition-delay: 0.3s; }
        
        .benefit-card:nth-child(1) { transition-delay: 0.1s; }
        .benefit-card:nth-child(2) { transition-delay: 0.2s; }
        .benefit-card:nth-child(3) { transition-delay: 0.3s; }
        .benefit-card:nth-child(4) { transition-delay: 0.4s; }
        .benefit-card:nth-child(5) { transition-delay: 0.5s; }

        /* Apply active class to first testimonial control */
        .testimonial-controls .control:first-child {
            background: var(--blue-neon);
            transform: scale(1.2);
        }
    `;
    document.head.appendChild(style);
});
