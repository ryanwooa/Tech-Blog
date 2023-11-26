
document.addEventListener("DOMContentLoaded", function () {

    const deleteButton = document.querySelectorAll('.deleteUser');

    deleteButton.forEach(function(button) {
        button.addEventListener('click', async function() {
            const userId = this.dataset.userid;
            
            if (!confirm('Are you sure you want to delete your account?')) {
                return;
            }

            try {
                const response = await fetch('/user/' + userId, {
                    method: 'DELETE',
                });
                if (!response.ok) throw new Error(response.statusText);
                // If the deletion was successful, redirect to home page
                window.location.href = '/api/users';
            } catch (error) {
                console.error('Error:', error);
                // Optionally, display an error message to the user
                alert('There was a problem deleting your account. Please try again later.');
            }
        });
    });
});



