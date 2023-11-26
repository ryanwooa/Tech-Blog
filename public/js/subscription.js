$(document).ready(function () {
    const subscribeButton = $('#subscribe-button');
    
    const authorId = $('#subscribe-button').data("authorid");

    // Check subscription status initially
    $.ajax({
        url: `/isSubscribed/${authorId}`,
        method: 'GET',
        success: function (res) {
            if (res.status === 1) {
                subscribeButton.text('Unsubscribe');
            } else {
                subscribeButton.text('Subscribe');
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(`AJAX Error: ${textStatus}\n${errorThrown}`);
        }

    });
  


    // Subscribe or unsubscribe to the author
    subscribeButton.click(function () {
        const currentAction = subscribeButton.text();
        let method = 'POST';
        if (currentAction === 'Unsubscribe') {
            method = 'DELETE';
        }
        $.ajax({
            url: `/subscribe/${authorId}`,
            method: method,
            success: function (res) {
                if (res.status === 1) {
                    if (method === 'POST') {
                        subscribeButton.text('Unsubscribe');
                    } else {
                        subscribeButton.text('Subscribe');
                        // console.log('Subscribe button clicked');

                    }
                    // alert(res.message);
                } else {
                    alert("Subscription action failed, please try again later");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(`AJAX Error: ${textStatus}\n${errorThrown}`);
            }

        });
    });
    

    // Check my subscribers
    $(document).on('click', 'a[href="/subscribers"]', function (event) {
        const userId = $(this).data('userId');
        event.preventDefault(); // stop the link from navigating
        window.location.href = `/user/${userId}/subscribers`;
    });

    // Check my subscriptions
    $(document).on('click', 'a[href="/subscriptions"]', function (event) {
        const userId = $(this).data('userId');
        event.preventDefault(); // stop the link from navigating
        window.location.href = `/user/${userId}/subscriptions`;
    });

    // Unsubscribe from a subscriber
    $(document).on('click', '.unsubscribe', function (event) {


        const to_id = $(this).data('to_id');
        event.preventDefault(); // stop the link from navigating

        $.ajax({
            url: `./subscribe/${to_id}`,
            method: 'DELETE',
            // data:{to_id: to_id},
            success: function (res) {
                if (res.status === 1) {
                    // alert(res.message);
                    // Optionally, refresh the page to reflect the change
                    location.reload();
                } else {
                    alert("Unsubscription failed, please try again later");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(`AJAX Error: ${textStatus}\n${errorThrown}`);
            }
        });
    });
});
