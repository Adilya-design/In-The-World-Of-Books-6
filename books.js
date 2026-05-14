// NUMBER SORTING TOOL (Logic: Arrays, Loops, & Sorting)
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements for the sorting form
    const sortForm = document.getElementById('sort-form');
    const inputField = document.getElementById('number-input');
    const resultArea = document.getElementById('sort-result');
    const errorArea = document.getElementById('sort-error');

    if (sortForm) {
        // Handle form submission for number sorting
        sortForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default form submission and page reload
            resultArea.textContent = '';
            errorArea.textContent = '';
            
            const rawValue = inputField.value.trim();

            // Validate: ensure input is not empty
            if (rawValue === "") {
                errorArea.textContent = 'Please enter at least one number.';
                return;
            }

            // Split input string by spaces to create an array
            const stringArray = rawValue.split(' ');
            const numbers = [];

            // Convert each string element to a floating-point number
            for (let i = 0; i < stringArray.length; i++) {
                const num = parseFloat(stringArray[i]);
                // Validate: check if the conversion resulted in a valid number
                if (isNaN(num)) {
                    errorArea.textContent = 'Invalid input. Please enter only numbers.';
                    return;
                }
                numbers.push(num);
            }

            // Get selected sort order from radio buttons (default to 'asc' if none selected)
            const order = document.querySelector('input[name="order"]:checked')?.value || 'asc';

            // Sort array based on selected order: ascending or descending
            numbers.sort((a, b) => order === 'asc' ? a - b : b - a);

            // Display the sorted result
            resultArea.textContent = 'Sorted list: ' + numbers.join(', ');
        });
    }
});

// READING LIST MANAGER (jQuery DOM Manipulation)
$(function() {
    // Add book: append or prepend a new list item based on checkbox state
    $('#add-btn').on('click', function() {
        const title = $('#book-input').val().trim();
        if (!title) {
            alert('Please enter a book title.');
            return;
        }
        
        const $newBook = $('<li class="list-group-item">' + title + '</li>');
        
        // Insert at beginning or end of list based on checkbox
        if ($('#use-prepend').is(':checked')) {
            $('#reading-list').prepend($newBook);
        } else {
            $('#reading-list').append($newBook);
        }
        $('#book-input').val('').focus(); // Clear input and restore focus
    });

    // Remove book: delete the last item from the list
    $('#remove-btn').on('click', function() {
        $('#reading-list li:last-child').remove();
    });

    // Hover effect: fade book cover images on mouse enter/leave
    $(document)
        .on('mouseenter', '.book-cover-wrapper img', function() {
            $(this).fadeTo('fast', 0.8);
        })
        .on('mouseleave', '.book-cover-wrapper img', function() {
            $(this).fadeTo('fast', 1.0);
        });

  
    // LOCAL SEARCH SYSTEM (Filtering Book Cards by Text Content)
    
    $('#api-search-input').on('input', function() {
        const searchTerm = $(this).val().toLowerCase().trim();
        
        // Select all elements that directly contain book cards
        // Adjust selector below if your HTML structure differs:
        // Common patterns: '.col', '.card', '.book-item', '[data-book-id]'
        $('.col').each(function() {
            const $container = $(this);
            
            // Get all text content from the container, normalized to lowercase
            const containerText = $container.text().toLowerCase();
            
            // Show container if search term is empty OR if text contains the search term
            if (searchTerm === '' || containerText.indexOf(searchTerm) > -1) {
                $container.show();
            } else {
                $container.hide();
            }
        });
    });
});

// GLOBAL SEARCH (Google Books API Logic)
// Get reference to the search button and attach event listener
const apiSearchBtn = document.getElementById('api-search-btn');

if (apiSearchBtn) {
    apiSearchBtn.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent page reload on form submit
        
        // Retrieve input field and results container
        const searchElement = document.getElementById('global-search-input');
        const query = searchElement.value.trim();
        const resultsContainer = document.getElementById('api-results');

        // Validate: ensure search query is not empty
        if (!query) {
            alert("Please enter a book name!");
            return;
        }

        // Disable button to prevent duplicate requests during loading
        apiSearchBtn.disabled = true;
        resultsContainer.innerHTML = '<p class="text-center">Searching the global library...</p>';

        // Fetch books from Google Books API with encoded query
        fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=6`)
            .then(response => {
                // Handle rate limiting (429) with a user-friendly message
                if (response.status === 429) {
                    throw new Error('Too many requests. Please wait a moment and try again.');
                }
                // Throw error for other failed HTTP statuses
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.json();
            })
            .then(data => {
                // Clear loading state before rendering
                resultsContainer.innerHTML = ''; 
                
                // Handle case where API returns no matching items
                if (!data.items || data.items.length === 0) {
                    resultsContainer.innerHTML = '<p class="text-center">No books found globally.</p>';
                    return;
                }

                // Render each book as a styled card
                data.items.forEach(item => {
                    const info = item.volumeInfo;
                    const thumbnail = info.imageLinks ? info.imageLinks.thumbnail : 'https://via.placeholder.com/150?text=No+Cover';
                    
                    resultsContainer.innerHTML += `
                        <div class="col">
                            <div class="card h-100 shadow-sm border-0">
                                <img src="${thumbnail}" class="card-img-top p-3" style="height: 180px; object-fit: contain;">
                                <div class="card-body d-flex flex-column">
                                    <h6 class="fw-bold mb-1">${info.title}</h6>
                                    <p class="small text-muted mb-auto">By: ${info.authors ? info.authors[0] : 'Unknown'}</p>
                                    <a href="${info.infoLink}" target="_blank" class="btn btn-sm btn-danger mt-2">View Details</a>
                                </div>
                            </div>
                        </div>`;
                });
            })
            .catch(error => {
                // Log technical error for debugging
                console.error("API Error: ", error);
                // Display readable error message to the user
                resultsContainer.innerHTML = `<p class="text-danger text-center">Error: ${error.message}</p>`;
            })
            .finally(() => {
                // Re-enable search button regardless of success or failure
                apiSearchBtn.disabled = false;
            });
    });
}
// FAVORITES SYSTEM (Logic: LocalStorage & Dynamic Sorting)
let favorites = JSON.parse(localStorage.getItem('bookFavorites')) || [];

document.addEventListener('DOMContentLoaded', () => {
    updateHeartsUI(); 
    sortBooksByFavorites();
    
    // Event Delegation: Listens for clicks on any heart button across the page
    document.body.addEventListener('click', (event) => {
        if (event.target.classList.contains('heart-btn')) {
            const bookId = event.target.getAttribute('data-id');
            toggleFavorite(bookId, event.target);
        }
    });
});

// Logic: Updates the favorites array and saves it to LocalStorage
function toggleFavorite(id, element) {
    const index = favorites.indexOf(id);
    if (index === -1) {
        favorites.push(id);
        element.innerHTML = '❤️';
    } else {
        favorites.splice(index, 1);
        element.innerHTML = '🤍';
    }
    localStorage.setItem('bookFavorites', JSON.stringify(favorites));
    sortBooksByFavorites(); // Move favorites to the top immediately
}

// Logic: Reorders HTML elements so that favorites appear first in their rows
function sortBooksByFavorites() {
    // We target all rows that contain book columns
    const containers = document.querySelectorAll('.row');
    containers.forEach(container => {
        const cards = Array.from(container.querySelectorAll('.col'));
        if (cards.length === 0) return;

        // Sorting Logic: Comparing favorite status
        cards.sort((a, b) => {
            const heartA = a.querySelector('.heart-btn');
            const heartB = b.querySelector('.heart-btn');
            if (!heartA || !heartB) return 0;
            
            const isAFav = favorites.includes(heartA.getAttribute('data-id'));
            const isBFav = favorites.includes(heartB.getAttribute('data-id'));
            return isBFav - isAFav; // Favorites (true/1) come before others (false/0)
        });
        
        // Re-append cards in the new sorted order
        cards.forEach(card => container.appendChild(card));
    });
}

function updateHeartsUI() {
    document.querySelectorAll('.heart-btn').forEach(btn => {
        const id = btn.getAttribute('data-id');
        btn.innerHTML = favorites.includes(id) ? '❤️' : '🤍';
    });
}

// BOOK DELIVERY ANIMATION
$(function() { 
    $('#start-journey').on('click', function() { 
        const $book = $('#flying-book'); 
        $book.stop(true, true).css({ 
            left: '50px', 
            bottom: '20px', 
            opacity: 1 
        }); 

        $book.animate({ left: '85%' }, 2000) 
        .animate({ bottom: '3px' }, 800) 
        .delay(2000) 
        .fadeTo(300, 0.5).fadeTo(300, 1) 
        .animate({ left: '50px', bottom: '20px' }, 1500); 
    }); 

    // Initial fade in for images
    $('.book-cover-wrapper img').hide().fadeIn(2000);
});