
window.addEventListener("load", function () {
        var postBox = document.querySelector('.postbox');
        var likeBox = document.querySelector('.likebox');
        const postBtn = document.getElementById('posts-btn');
        const likeBtn = document.getElementById('likes-btn');

        likeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            postBox.style.display = 'none';
            likeBox.style.display = 'block';

            likeBtn.classList.add('selected');
            postBtn.classList.remove('selected');
        });

        postBtn.addEventListener('click', function(e) {
            e.preventDefault();
            postBox.style.display = 'block';
            likeBox.style.display = 'none';

            likeBtn.classList.remove('selected');
            postBtn.classList.add('selected');
        });

    const deleteButton = document.querySelector('#deleteUser');
    
    if (deleteButton) {
        deleteButton.addEventListener('click', async function() {
            const userId = deleteButton.dataset.userid;
            
            if (!confirm('Are you sure you want to delete your account?')) {
                return;
            }

            try {
                const response = await fetch('/user/' + userId, {
                    method: 'DELETE',
                });
                if (!response.ok) throw new Error(response.statusText);
                // If the deletion was successful, redirect to home page
                window.location.href = '/';
            } catch (error) {
                console.error('Error:', error);
                // Optionally, display an error message to the user
                alert('There was a problem deleting your account. Please try again later.');
            }
        });
    }
});



