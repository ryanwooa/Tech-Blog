
window.addEventListener("load", async function() {

    const subscriptions_btn = document.querySelector("#subscriptions_btn");
    const subscribers_btn = document.querySelector("#subscribers_btn");
   
    const subscriptions_box = document.querySelector(".subscriptions_box");
    const subscribers_box = document.querySelector(".subscribers_box");

    subscriptions_btn.addEventListener("click", function() {
        subscriptions_btn.classList.add("selected");
        subscribers_btn.classList.remove("selected");

        subscriptions_box.classList.add("selected2");
        subscribers_box.classList.remove("selected2");
    });

    subscribers_btn.addEventListener("click", function() {
        subscriptions_btn.classList.remove("selected");
        subscribers_btn.classList.add("selected");

        subscriptions_box.classList.remove("selected2");
        subscribers_box.classList.add("selected2");
    });

    


});