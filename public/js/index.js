const title = this.window.location.pathname;
const head = this.document.querySelector("head");
const cssfile = cssAdapter(title);
if(cssfile){
head.innerHTML += `<link rel="stylesheet" href="http://127.0.0.1:3000/css/${cssfile}">`
}


window.addEventListener("load", async function() {

    //Acording url path to set CSS file:  
    if(title == "/"){
        document.querySelector("nav").classList.add("home");
    }

    window.addEventListener("scroll", function() {
        const nav = document.querySelector("nav");
        
        // Define the scroll threshold (in pixels) after which the background color will change
        const scrollThreshold = 700;
             
        if (window.scrollY > scrollThreshold) {
            // Add a CSS class to change the background color and font color
            nav.classList.add("scrolled");
           
        } else {
            // Remove the CSS class when scrolling back to the top
            nav.classList.remove("scrolled");
         
        }
    });

    //nav notification
    const notiData = await getNotificationData();
    const navbox = document.querySelector("#navbox");
    const unread = await getUnreadNotifications();

    navbox.innerHTML = "";
    
    if(notiData.cnt){
        unread.forEach((item) => {
            var data = "";
            data +=`<div class="unread-noti-item" data-noid="${item.id}"> 
            <img src="${item.from_avatar_url}" alt="" class="user_avatar unread-noti-avatar">
            <div>
                ${item.from_username}     `;
                if(item.is_comment){
                    data += `commented you in article: ${item.article_title}</a>`;
                } else if(item.is_like){
                    data += `liked your article: ${item.article_title}`;
                } else if(item.is_subscribe){
                    data += `followed you`;
                } else if(item.is_article){
                    data += `publish a new article: ${item.article_title}`;
                }
                data += `<div class="u-noti-time">${item.datetime}</div>`;
                data += `</div></div>`;

            navbox.innerHTML += data;
        });
        
    } else {
        navbox.innerHTML += ` <li>No new notifications</li>`;
    }

    const navpoint = document.querySelector(".notify-history-button");
    if(notiData.cnt){
        navpoint.innerHTML += `<div id="nav-point"> ${notiData.cnt} </div>`
    }

    const noti_btn = document.querySelectorAll(".unread-noti-item");
    noti_btn.forEach((item) => {
        item.addEventListener("click", async function(){
            const noId = item.dataset.noid;

            fetch("/notification/" + noId ) ;
            const num = document.querySelector("#nav-point").innerHTML;
            document.querySelector("#nav-point").innerHTML = num - 1;
            item.innerHTML = "";
            item.style.border = "none";

        });
    });

});


// return CSS file name acording the url path
function cssAdapter(url){
    if (url.startsWith("/articles/")) {
        return "articlepage.css";
    }
    if (url.startsWith("/article_editor")) {
        return "article_editor.css";
    }
    if (url.startsWith("/account")) {
        if(url.endsWith("/edit")){
            return ;
        }
        return "myaccount.css";
    }
    if(url.startsWith("/comments")){
        return "comments.css";
    }
    if(url.startsWith("/likes")){
        return "likes.css";
    }
    if(url.startsWith("/subscriptions")){
        return "subscriptions.css";
    }

    switch (url) {
        case "/" : return "home.css";
        case "/article_editor": return "article_editor.css";
        case "/analytics" : return "analytics.css";  
        case "/login" : return "login.css"
        case "/myAccount" : return "myaccount.css";
        case "/notification-history" : return "notification.css";
        case "/users" : return "alluser.css";

    }
        
}

// get notify data
async function getNotificationData(){
    const data = await fetch(`../newNotifiesSummary`)
            .then((response) => response.json());
    return data;
}

// get unread notifications
async function getUnreadNotifications(){
    const data = await fetch(`../unreadNotifications`)
            .then((response) => response.json());
    return data;
}