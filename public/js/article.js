window.addEventListener("load", async function () {

    const title = this.window.location.pathname;
    const temp = title.split("/")
    const id = temp[temp.length - 1]
    let show_status = 1; //0: hide, 1: show


    //get comments and show on the page
    const commentsData = await getComments(id);
    var processedComments = [];

    function getChildrenComments(parentId) {
        var children = commentsData.filter(function (comment) {
            return comment.parent_id === parentId;
        });

        children.forEach(function (child) {
            child.children = getChildrenComments(child.id);
        });

        return children;
    }

    var topLevelComments = commentsData.filter(function (comment) {
        return comment.parent_id === null;
    });
    topLevelComments.forEach(function (comment) {
        comment.children = getChildrenComments(comment.id);
        processedComments.push(comment);
    });

    const container = this.document.querySelector("#comments-container");
    const html = nestComments(processedComments, 0);
    container.innerHTML = html


    //show child comment input area and submit it
    const comments = this.document.querySelectorAll(".c_btn");

    comments.forEach(function (btn) {
        btn.addEventListener("click", () => {
            const c_id = btn.dataset.cid;
            const article_id = document.querySelector(".article-content").dataset.id;

            const c_area = this.document.querySelector(`#c_area_${c_id}`)

            c_area.innerHTML = `
            <form action="submit_comment" method="POST">
                <input type="text" name="comment" id="comment" placeholder="comment here">
                <input type="hidden" name="hidden_article_id" value=${article_id}>
                <input type="hidden" name="hidden_parent_id" value=${c_id}>
                <button type="submit" class="_btn">Reply</button>
            </form>
            `
        })
    })




    //delete article
    const deleteButton = document.querySelector("#delete-button");
    if (deleteButton) {
        document.getElementById('delete-button').addEventListener('click', async function () {
            try {
                const response = await fetch('/articles/' + id, {
                    method: 'DELETE',
                });
                if (!response.ok) throw new Error(response.statusText);
                window.location.href = '/';
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }


    // Add event listener for each delete comment button
    document.querySelectorAll('.d_btn').forEach(function (button) {
        button.addEventListener('click', async function () {
            const commentId = this.dataset.cid;
            try {
                const response = await fetch('/comments/' + commentId, {
                    method: 'DELETE',
                });
                if (!response.ok) throw new Error(response.statusText);
                // If the deletion was successful, remove the comment from the page
                document.querySelector(`div[data-cid="${commentId}"]`).remove();
            } catch (error) {
                console.error('Error:', error);
            }
        });
    });


    //show and hide comment list
    const showBtn = document.querySelector("#show_comments_btn");
    const commentsList = document.querySelector("#comments-container");

    commentsList.style.display = "block";
    showBtn.innerHTML = "Hide Comments";


    showBtn.addEventListener("click", () => {
        if (show_status == 0) {
            commentsList.style.display = "block";
            showBtn.innerHTML = "Hide Comments";
            show_status = 1;
        } else {
            commentsList.style.display = "none";
            showBtn.innerHTML = " Show Comments";
            show_status = 0;
        }

    });
});


async function getComments(id) {
    const comments = await fetch(`../comments?id=${id}`)
        .then((response) => response.json());
    return comments;
}

function nestComments(comments, index) {
    var html = "";
    index = index == 0 ? 0 : 1;
    comments.forEach(function (comment) {
        html += `
        <div class="comment_box_${index}" data-cid=${comment.id}>
            <div class="c_title">
                <img src="${comment.avatar_url}" alt="User Avatar" class="c_avatar">
                <div>
                    <a href="/account/${comment.user_id}"> <p>${comment.username}</p> </a>
                    <p class="c-time">${comment.datetime}</p>
                </div>
            </div>
            <p class="c-comment">${comment.content}</p>
            <div id="c_area_${comment.id}" class="clearfix"> 
        `;

        if (comment.canDelete === true) {
            html += `
            <button data-cid=${comment.id} class="d_btn "><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M306.461-166.154q-25.577 0-43.557-17.98-17.981-17.981-17.981-43.558v-490.462h-39.385v-36.795h155.693v-29.667h238.154v29.539h155.692v36.923h-39.384v490.64q0 25.759-17.801 43.56-17.8 17.8-43.738 17.8H306.461Zm372.308-552H281.846v490.462q0 10.769 6.923 17.692t17.692 6.923h347.693q9.231 0 16.923-7.692 7.692-7.692 7.692-16.923v-490.462ZM395.384-282.346h36.924v-356.923h-36.924v356.923Zm132.924 0h36.923v-356.923h-36.923v356.923ZM281.846-718.154v515.077-515.077Z"/></svg></button>      
            `
        }
        html += `
        <button data-cid=${comment.id} class="c_btn "><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M774.308-223.692v-137.539q0-58.461-40.737-99.23-40.737-40.77-99.152-40.77H219.231l164 163.385-26.462 26.462-208-208.616 208-208.616 26.462 26.462-164 164h415.077q73.617 0 125.27 51.653 51.653 51.653 51.653 125.27v137.539h-36.923Z"/></svg></button> 
        </div> 
        `

        if (comment.children) {
            html += nestComments(comment.children, index + 1);
        }
        html += "</div>"
    })
    return html;
}



