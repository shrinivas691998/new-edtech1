document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.getElementById('registrationForm');
    const popupOverlay = document.getElementById('popupOverlay');
    const closePopup = document.getElementById('closePopup');
    const fullRegistrationForm = document.getElementById('fullRegistrationForm');
    const branchSelect = document.getElementById('branch');
    const courseSelect = document.getElementById('course');

    // Course options for each branch
    const coursesByBranch = {
        computer_science: [
            { value: 'full_stack', text: 'Full-Stack Development Certification' },
            { value: 'ai', text: 'Artificial Intelligence Certification' },
            { value: 'ml', text: 'Machine Learning Certification' },
            { value: 'dl', text: 'Deep Learning Certification' },
            { value: 'cybersecurity', text: 'Cybersecurity Certification' },
            { value: 'python', text: 'Python Programming Certification' }
        ],
        electronics: [
            { value: 'vlsi', text: 'VLSI Design Certification' },
            { value: 'embedded', text: 'Embedded Systems Certification' },
            { value: 'signal', text: 'Signal Processing Certification' },
            { value: 'power', text: 'Power Electronics Certification' },
            { value: 'iot', text: 'IoT Fundamentals Certification' }
        ],
        mechanical_civil: [
            { value: 'cad_cam', text: 'CAD & CAM Certification' },
            { value: 'structural', text: 'Structural Analysis Certification' },
            { value: 'robotics', text: 'Robotics Fundamentals Certification' },
            { value: 'sustainable', text: 'Sustainable Engineering Certification' },
            { value: 'mechanics', text: 'Engineering Mechanics Certification' }
        ],
        aerospace: [
            { value: 'propulsion', text: 'Rocket Propulsion Certification' },
            { value: 'avionics', text: 'Avionics Certification' },
            { value: 'aerodynamics', text: 'Aerodynamics Certification' },
            { value: 'uav', text: 'UAV Design Certification' }
        ]
    };

    // Update courses when branch is selected
    branchSelect.addEventListener('change', function() {
        const selectedBranch = this.value;
        courseSelect.innerHTML = '<option value="">Select Course</option>';
        courseSelect.disabled = !selectedBranch;

        if (selectedBranch) {
            const courses = coursesByBranch[selectedBranch];
            courses.forEach(course => {
                const option = document.createElement('option');
                option.value = course.value;
                option.textContent = course.text;
                courseSelect.appendChild(option);
            });
        }
    });

    registrationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        document.getElementById('popupEmail').value = email;
        popupOverlay.style.display = 'flex';
    });

    closePopup.addEventListener('click', function() {
        popupOverlay.style.display = 'none';
    });

    popupOverlay.addEventListener('click', function(e) {
        if (e.target === popupOverlay) {
            popupOverlay.style.display = 'none';
        }
    });

    // Update the getCourseDetails function
    function getCourseDetails() {
        const branchElement = document.getElementById('branch');
        const courseElement = document.getElementById('course');
        const branchText = branchElement.options[branchElement.selectedIndex].text;
        const courseText = courseElement.options[courseElement.selectedIndex].text;
        return { branch: branchText, courseName: courseText };
    }

    fullRegistrationForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const { branch, courseName } = getCourseDetails();
        const submitBtn = this.querySelector('.submit-btn');
        const originalBtnText = submitBtn.textContent;

        // Show loading state
        submitBtn.textContent = 'Processing...';
        submitBtn.disabled = true;

        try {
            // Send email to admin
            await emailjs.send(
                "service_36m88l9",      // Your service ID
                "template_ucoe0ba",     // Admin template ID
                {
                    to_email: "mentisera.edtech@gmail.com",
                    name: `${document.getElementById('firstName').value} ${document.getElementById('lastName').value}`, // Combined name
                    email: document.getElementById('popupEmail').value,
                    phone: document.getElementById('phone').value,
                    branch: branch,
                    course: courseName,
                    year_of_passing: document.getElementById('year').value,
                    gender: document.getElementById('gender').value,
                    current_degree: document.getElementById('currentDegree').value,
                    message: document.getElementById('message').value || 'No message provided'
                }
            );

            // Send confirmation to applicant
            await emailjs.send(
                "service_36m88l9",      // Your service ID
                "template_gty84hj",     // Applicant template ID
                {
                    to_name: `${document.getElementById('firstName').value} ${document.getElementById('lastName').value}`,
                    to_email: document.getElementById('popupEmail').value,
                    name: `${document.getElementById('firstName').value} ${document.getElementById('lastName').value}`,
                    branch: branch,
                    course: courseName
                }
            );

            // Show success message
            alert('Registration completed successfully! Confirmation emails have been sent.');
            
            // Reset form and close popup
            this.reset();
            document.getElementById('popupOverlay').style.display = 'none';

        } catch (error) {
            console.error('Error:', error);
            alert(`Registration failed: ${error.message}. Please try again or contact support.`);
        } finally {
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
        }
    });

    // Update the sendConfirmationEmails function
    window.sendConfirmationEmails = async function(paymentDetails) {
        const formData = JSON.parse(sessionStorage.getItem('registrationData'));
        
        if (!formData) {
            console.error('Registration data not found');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/send-confirmation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    paymentId: paymentDetails.paymentId,
                    paymentAmount: paymentDetails.amount
                })
            });

            if (!response.ok) {
                throw new Error('Failed to send confirmation emails');
            }

            // Clear stored registration data
            sessionStorage.removeItem('registrationData');
            
            console.log('Confirmation emails sent successfully');
        } catch (error) {
            console.error('Failed to send confirmation emails:', error);
            alert('Payment successful but failed to send confirmation emails. Please contact support.');
        }
    };

    // Add this function to your existing script
    function resetForm() {
        if (confirm('Are you sure you want to reset the form? All entered data will be cleared.')) {
            document.getElementById('fullRegistrationForm').reset();
            
            // Reset the course dropdown to disabled state
            const courseSelect = document.getElementById('course');
            courseSelect.innerHTML = '<option value="">Select Branch First</option>';
            courseSelect.disabled = true;
            
            // Reset branch select
            document.getElementById('branch').value = '';
        }
    }
}); 