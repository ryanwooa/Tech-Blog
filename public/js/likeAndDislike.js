document.addEventListener("DOMContentLoaded", function () {
    
    // like & dislike article
    const likeButton = document.querySelector("#like-button");
    const likeIcon = document.getElementById("likeicon");
    likeButton.addEventListener("click", function (event) {
        event.preventDefault();
        const articleId = likeButton.dataset.id;
        const likeNum = document.querySelector("#article-likes");

        if (!articleId) {
            console.error("Article ID is not defined!");
            return;
        }


        if(likeIcon.classList.contains("liked")){
            fetch(`/articles/${articleId}/unlike`, {
                method: "POST"
            }).then(response => response.json())
              .then(data => {
                  // update like count
                  likeNum.textContent = data.likesCount > 0 ? data.likesCount : 0 ;
              });
              likeIcon.classList.remove("liked");
              

        } else {
            fetch(`/articles/${articleId}/like`, {
                method: "POST"
            }).then(response => response.json())
            .then(data => {
                // update like count
                likeNum.textContent = data.likesCount > 0 ? data.likesCount : 0 ;
                // alert("You have liked this article.");
            });
            likeIcon.classList.add("liked");

        }
    });

    // // dislike article
    // const dislikeButton = document.getElementById("dislike-button");
    // dislikeButton.addEventListener("click", function (event) {
    //     event.preventDefault();
    //     const articleId = dislikeButton.dataset.id;

    //     if (!articleId) {
    //         console.error("Article ID is not defined!");
    //         return;
    //     }

    //     fetch(`/articles/${articleId}/unlike`, {
    //         method: "POST"
    //     }).then(response => response.json())
    //       .then(data => {
    //           // update like count
    //           const likeText = data.likesCount === 1 ? 'like' : 'likes';
    //           document.getElementById("like-count").textContent = data.likesCount > 0 ? `You have ${data.likesCount} ${likeText} in this article` : 'You have 0 like in this article';
    //       });
    // });
});
