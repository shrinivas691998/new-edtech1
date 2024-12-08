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

        // Get all form data
        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('popupEmail').value,
            gender: document.getElementById('gender').value,
            currentDegree: document.getElementById('currentDegree').value,
            phone: document.getElementById('phone').value,
            course: courseName,
            branch: branch,
            year: document.getElementById('year').value,
            message: document.getElementById('message').value
        };

        // Show loading state
        const submitBtn = this.querySelector('.submit-btn');
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = 'Processing...';
        submitBtn.disabled = true;

        try {
            // Store formData in sessionStorage for access after payment
            sessionStorage.setItem('registrationData', JSON.stringify(formData));

            // Redirect to payment page
            const paymentURL = `payment-details.html?firstName=${encodeURIComponent(formData.firstName)}&lastName=${encodeURIComponent(formData.lastName)}&branch=${encodeURIComponent(formData.branch)}&course=${encodeURIComponent(formData.course)}`;
            window.location.href = paymentURL;

        } catch (error) {
            console.error('FAILED...', error);
            alert('There was an error processing your registration. Please try again.');
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
        }
    });

    // Add function to send confirmation emails after successful payment
    window.sendConfirmationEmails = async function(paymentDetails) {
        const formData = JSON.parse(sessionStorage.getItem('registrationData'));
        
        if (!formData) {
            console.error('Registration data not found');
            return;
        }

        // Parameters for admission team email
        const admissionTeamParams = {
            from_name: `${formData.firstName} ${formData.lastName}`,
            applicant_email: formData.email,
            gender: formData.gender,
            current_degree: formData.currentDegree,
            phone_number: formData.phone,
            selected_branch: formData.branch,
            selected_course: formData.course,
            passing_year: formData.year,
            message: formData.message || "No message provided",
            payment_status: "Paid",
            payment_id: paymentDetails.paymentId,
            payment_amount: paymentDetails.amount,
            to_email: 'arishrinivas28@gmail.com'
        };

        // Parameters for applicant confirmation email
        const applicantParams = {
            to_name: formData.firstName,
            full_name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            gender: formData.gender,
            current_degree: formData.currentDegree,
            phone_number: formData.phone,
            selected_branch: formData.branch,
            selected_course: formData.course,
            passing_year: formData.year,
            payment_status: "Confirmed",
            payment_id: paymentDetails.paymentId,
            payment_amount: paymentDetails.amount,
            to_email: formData.email
        };

        try {
            // Send email to admission team
            const admissionTeamResponse = await emailjs.send(
                'service_ejwt45e',
                'template_autic0d',
                admissionTeamParams,
                'ZAkK5UikAMPnRSPQq'
            );

            // Send confirmation email to applicant
            const applicantResponse = await emailjs.send(
                'service_ejwt45e',
                'template_xo7uire',
                applicantParams,
                'ZAkK5UikAMPnRSPQq'
            );

            if (admissionTeamResponse.status === 200 && applicantResponse.status === 200) {
                // Clear stored registration data
                sessionStorage.removeItem('registrationData');
                alert('Registration completed successfully! Confirmation emails have been sent.');
                window.location.href = 'index.html'; // Redirect to home page
            }
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