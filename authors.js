$(function() {
    // Hide all answers by default on page load
    $('.faq-answer').hide();

    $('.faq-btn').on('click', function() {
        const $currentAnswer = $(this).next('.faq-answer');
        const $otherAnswers = $('.faq-answer').not($currentAnswer);
        const $otherButtons = $('.faq-btn').not(this);

        // Collapse other open sections and reset their icons
        $otherAnswers.slideUp(300);
        $otherButtons.find('.toggle-icon').text('+');

        // Toggle the visibility of the clicked section
        $currentAnswer.slideToggle(300);

        // Conditional Logic: Toggle icon text based on visibility
        const $icon = $(this).find('.toggle-icon');
        if ($currentAnswer.is(':visible')) {
            $icon.text('−');
        } else {
            $icon.text('+');
        }
    });
});


$(function() {
    let ballActive = false;

    // Logic: Moves the ball to the right end of the track
    function moveRight() {
        if (!ballActive) return;

        const containerWidth = $('#ball-track').width();
        const ballWidth = $('#magic-ball').width();
        const targetPos = containerWidth - ballWidth - 10; 

        $('#magic-ball').animate({ 
            left: targetPos + 'px' 
        }, 2000, 'linear', moveLeft); // Recursion: calls moveLeft after finishing
    }

    // Logic: Moves the ball back to the starting position
    function moveLeft() {
        if (!ballActive) return;

        $('#magic-ball').animate({ 
            left: '10px' 
        }, 3000, 'linear', moveRight); // Recursion: calls moveRight after finishing
    }

    // Event Handler: Starts the infinite animation loop
    $('#start-ball').on('click', function() {
        if (!ballActive) {
            ballActive = true;
            moveRight();
        }
    });

    // Event Handler: Stops all active jQuery animations immediately
    $('#stop-ball').on('click', function() {
        ballActive = false;
        $('#magic-ball').stop(); 
    });
});


// Data Database: Stores biographies and facts in an object
const authorBio = {
    'rowling': {
        name: 'J.K. Rowling',
        img: 'maxresdefault.jpg',
        bio: 'British author, best known for the Harry Potter series.',
        fact: 'She wrote her first story at age six about a rabbit.'
    },
    'christie': {
        name: 'Agatha Christie',
        img: 'a297c4a66b313e410c8780db41d5078c.webp',
        bio: 'The Queen of Mystery and creator of Hercule Poirot.',
        fact: 'Her books are the third most-published in the world.'
    },
    'king': {
        name: 'Stephen King',
        img: 'hqdefault.jpg',
        bio: 'The Master of Horror and author of "The Shining".',
        fact: 'He has written over 60 novels.'
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Dynamic Creation: Injects the modal HTML structure into the body if it doesn't exist
    if (!document.getElementById('author-modal')) {
        const modalHtml = `
            <div id="author-modal" class="modal-overlay" style="display:none;">
                <div class="modal-content shadow-lg">
                    <span class="close-modal" onclick="closeAuthorModal()">&times;</span>
                    <div id="modal-body" class="text-center"></div>
                </div>
            </div>`;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    // Event Delegation: Loops through buttons to assign click events
    document.querySelectorAll('.author-details-btn').forEach(btn => {
        btn.onclick = function() {
            const id = this.getAttribute('data-author');
            const data = authorBio[id];
            const modal = document.getElementById('author-modal');
            const modalBody = document.getElementById('modal-body');

            if (data && modal && modalBody) {
                // Update modal content dynamically based on the selected author
                modalBody.innerHTML = `
                    <img src="${data.img}" class="img-fluid rounded mb-3" style="max-height: 200px; object-fit: cover;">
                    <h3 class="author-name">${data.name}</h3>
                    <p class="mt-3">${data.bio}</p>
                    <p class="small text-muted"><strong>Fact:</strong> ${data.fact}</p>
                    <button class="btn btn-danger mt-3" onclick="closeAuthorModal()">Close</button>
                `;

                modal.style.display = 'flex';
                setTimeout(() => modal.classList.add('active'), 10);
            }
        };
    });
});

// Logic: Handles modal closing with transition delay
window.closeAuthorModal = function() {
    const modal = document.getElementById('author-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.style.display = 'none', 300);
    }
};

// Event Handler: Closes modal when clicking on the overlay (outside content)
window.onclick = function(event) {
    const modal = document.getElementById('author-modal');
    if (event.target == modal) {
        closeAuthorModal();
    }
};

// SUBSCRIPTION FORM VALIDATION (Real-time Feedback & Form Handling)
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('author-subscribe-form');
    const nameInput = document.getElementById('sub-name');
    const emailInput = document.getElementById('sub-email');
    const passInput = document.getElementById('sub-pass');
    
    const nameMsg = document.getElementById('name-msg');
    const emailMsg = document.getElementById('email-msg');
    const passMsg = document.getElementById('pass-msg');
    
    const submitBtn = document.getElementById('submit-btn');
    const clearBtn = document.getElementById('clear-btn');

    // Utility: Reusable function to set validation messages and styling
    function setMessage(element, message, color) {
        element.innerText = message;
        element.style.color = color;
    }

    // Validation Rules Object
    const validate = {
        name: (val) => {
            if (!val.trim()) return { ok: false, msg: "Name is required" };
            return { ok: true, msg: "Good name!" };
        },
        email: (val) => {
            if (!val.trim()) return { ok: false, msg: "Email is required" };
            if (!val.includes('@')) return { ok: false, msg: "Email must contain @" };
            return { ok: true, msg: "Valid email!" };
        },
        pass: (val) => {
            if (!val.trim()) return { ok: false, msg: "Password is required" };
            if (val.length < 6) return { ok: false, msg: "Password too short (min 6)" };
            return { ok: true, msg: "Great password!" };
        }
    };

    // Real-time Event Listeners: Validate inputs as the user types
    nameInput.addEventListener('input', () => {
        const res = validate.name(nameInput.value);
        setMessage(nameMsg, res.msg, res.ok ? 'green' : 'red');
    });

    emailInput.addEventListener('input', () => {
        const res = validate.email(emailInput.value);
        setMessage(emailMsg, res.msg, res.ok ? 'green' : 'red');
    });

    passInput.addEventListener('input', () => {
        const res = validate.pass(passInput.value);
        setMessage(passMsg, res.msg, res.ok ? 'green' : 'red');
    });

    // Final Validation: Checks all fields before allowing submission
    form.addEventListener('submit', (e) => {
        e.preventDefault(); 

        const nameRes = validate.name(nameInput.value);
        const emailRes = validate.email(emailInput.value);
        const passRes = validate.pass(passInput.value);

        if (nameRes.ok && emailRes.ok && passRes.ok) {
            alert('Form submitted successfully!');
            form.reset();
            [nameMsg, emailMsg, passMsg].forEach(el => el.innerText = '');
        }
    });

    // Reset Logic: Clears form and validation messages
    clearBtn.addEventListener('click', () => {
        form.reset();
        [nameMsg, emailMsg, passMsg].forEach(el => el.innerText = '');
    });

    // Styling: Dynamic Hover Effects using Native JS
    submitBtn.addEventListener('mouseenter', () => {
        submitBtn.style.backgroundColor = '#c886c4'; 
        submitBtn.style.transform = 'scale(1.05)';
        submitBtn.style.transition = '0.3s';
    });

    submitBtn.addEventListener('mouseleave', () => {
        submitBtn.style.backgroundColor = '#e0a5dc';
        submitBtn.style.transform = 'scale(1)';
    });
});