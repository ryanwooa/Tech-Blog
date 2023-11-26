window.addEventListener("load", function () {


    const checkButton = document.querySelectorAll(".noti_check_btn");

    checkButton.forEach(function (button) {
        button.addEventListener("click", function (event) {
            event.preventDefault();
            const noId = button.dataset.noid;
            if (button.innerHTML == "Check") {
                //update read status
                fetch("/notification/" + noId ) ;
                button.innerHTML = "Checked";
                button.classList.add("check-notification");
            };

        });
    })


});   