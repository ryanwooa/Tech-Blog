document.addEventListener("DOMContentLoaded",async function () {
    
    //sort article
    const datetime_bnt = document.querySelector("#datetime_btn");
    const username_bnt = document.querySelector("#username_btn");
    const title_bnt = document.querySelector("#title_btn");
    const sorted_area = document.querySelector("#sorted_area");
    let sort_status = 0; //0:asc 1:desc

    //sort by datetime
    datetime_bnt.addEventListener("click", async function (event) {
        sorted_area.innerHTML = "";
        let articleList = null;

        if(sort_status == 0){
            articleList = await sortArticleByTimeAsc();
        } else {
            articleList = await sortArticleByTimeDesc();
        }

        let data = "";
        articleList.forEach((article) => {
            data += `
                    <div class="item">
                    <a href="./articles/${article.id}" class="item-img">
                        <div >   
                            <img src="${article.cover_url}" alt="Image" class="img-responsive">                            
                        </div>
                    </a>                           
                    <div class="item-info"> 
                        <h2><a href="./articles/${article.id}">${article.title}</a></h2>
                        
                    
                        <div class="user">
                            <a href="./account/${article.user_id}">
                            <div class="avatar">
                            
                                <img src="${article.avatar_url}" width="24px" height="24px" alt="" id="avatar" class="user_avatar"> 
                            </div>
                            
                            <div class="username">
                                <p>${article.author}</p>
                            </div>
                            </a>
            
                        </div>
                        
                        <div class="icon">
                            <div class="home_timestamp">${article.datetime}</div>
                            <div class="home_icon">
                            <div class="comment">
                            <a href="./articles/${article.id}">
                                <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 96 960 960" width="20"><path d="M107.694 746.767V231.386q0-15.039 10.673-25.212t25.712-10.173h497.46q14.038 0 24.711 10.173 10.673 10.173 10.673 25.212v338.46q0 14.038-10.673 24.711-10.673 10.673-24.711 10.673H252.231L107.694 746.767Zm179.922 33.846q-14.039 0-24.712-10.673t-10.673-24.711V689.23H748.23l12.693 12.693V337h54.998q15.039 0 25.712 10.673t10.673 25.711V922.15L710.769 780.613H287.616ZM612.924 260H171.693v334.848l54.616-53.617h386.615V260Zm-441.231 0v334.848V260Z"></path></svg>
                                <span id="com_num"> ${article.comment_cnt} </span>
                                </a>
                            </div>

                            <div class="like">
                                <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 96 960 960" width="20"><path d="m480 885.075-36.153-32.691q-98.461-88.231-162.5-150.577-64.038-62.346-100.576-109.923-36.539-47.577-50.654-86.269-14.116-38.692-14.116-78.615 0-80.153 55.423-135.576Q226.847 236.001 307 236.001q49.385 0 95 23.501 45.615 23.5 78 67.269 32.385-43.769 78-67.269 45.615-23.501 95-23.501 80.153 0 135.576 55.423Q843.999 346.847 843.999 427q0 39.923-13.616 77.615-13.615 37.692-50.154 84.769-36.538 47.077-100.884 110.423-64.346 63.346-165.192 154.577L480 885.075ZM480 815q93-83.385 153-142.077 60-58.692 95.5-102.192 35.5-43.5 49.5-77.308 14-33.808 14-66.423 0-59-40-99t-99-40q-35.385 0-66.077 14.885-30.692 14.884-61.154 47.808l-35 41h-21.538l-35-41q-30.846-33.308-62.346-48.001Q340.385 288 307 288q-58.615 0-98.808 40Q168 368 168 427q0 32.615 13 64.923t47.5 75.308q34.5 43 95 102T480 815Zm0-264Z"></path></svg>
                                <span id="like_num"> ${article.likes} </span>
                            </div>
                            </div>
                        </div>                                
                    </div>                  
            </div> 
            `
        });

        sorted_area.innerHTML = data;
        sort_status =  sort_status ? 0 : 1;
    });
 

    //sort by username
    username_bnt.addEventListener("click", async function (event) {
        sorted_area.innerHTML = "";
        let articleList = null;

        if(sort_status == 0){
            articleList = await sortArticleByUsernameAsc();
        } else {
            articleList = await sortArticleByUsernameDesc();
        }

        let data = "";
        articleList.forEach((article) => {
            data += `
                    <div class="item">
                    <a href="./articles/${article.id}" class="item-img">
                        <div >   
                            <img src="${article.cover_url}" alt="Image" class="img-responsive">                            
                        </div>
                    </a>                           
                    <div class="item-info"> 
                        <h2><a href="./articles/${article.id}">${article.title}</a></h2>
                        
                    
                        <div class="user">
                            <a href="./account/${article.user_id}">
                            <div class="avatar">
                            
                                <img src="${article.avatar_url}" width="24px" height="24px" alt="" id="avatar" class="user_avatar"> 
                            </div>
                            
                            <div class="username">
                                <p>${article.author}</p>
                            </div>
                            </a>
            
                        </div>
                        
                        <div class="icon">
                            <div class="home_timestamp">${article.datetime}</div>
                            <div class="home_icon">
                            <div class="comment">
                            <a href="./articles/${article.id}">
                                <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 96 960 960" width="20"><path d="M107.694 746.767V231.386q0-15.039 10.673-25.212t25.712-10.173h497.46q14.038 0 24.711 10.173 10.673 10.173 10.673 25.212v338.46q0 14.038-10.673 24.711-10.673 10.673-24.711 10.673H252.231L107.694 746.767Zm179.922 33.846q-14.039 0-24.712-10.673t-10.673-24.711V689.23H748.23l12.693 12.693V337h54.998q15.039 0 25.712 10.673t10.673 25.711V922.15L710.769 780.613H287.616ZM612.924 260H171.693v334.848l54.616-53.617h386.615V260Zm-441.231 0v334.848V260Z"></path></svg>
                                <span id="com_num"> ${article.comment_cnt} </span>
                                </a>
                            </div>

                            <div class="like">
                                <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 96 960 960" width="20"><path d="m480 885.075-36.153-32.691q-98.461-88.231-162.5-150.577-64.038-62.346-100.576-109.923-36.539-47.577-50.654-86.269-14.116-38.692-14.116-78.615 0-80.153 55.423-135.576Q226.847 236.001 307 236.001q49.385 0 95 23.501 45.615 23.5 78 67.269 32.385-43.769 78-67.269 45.615-23.501 95-23.501 80.153 0 135.576 55.423Q843.999 346.847 843.999 427q0 39.923-13.616 77.615-13.615 37.692-50.154 84.769-36.538 47.077-100.884 110.423-64.346 63.346-165.192 154.577L480 885.075ZM480 815q93-83.385 153-142.077 60-58.692 95.5-102.192 35.5-43.5 49.5-77.308 14-33.808 14-66.423 0-59-40-99t-99-40q-35.385 0-66.077 14.885-30.692 14.884-61.154 47.808l-35 41h-21.538l-35-41q-30.846-33.308-62.346-48.001Q340.385 288 307 288q-58.615 0-98.808 40Q168 368 168 427q0 32.615 13 64.923t47.5 75.308q34.5 43 95 102T480 815Zm0-264Z"></path></svg>
                                <span id="like_num"> ${article.likes} </span>
                            </div>
                            </div>
                        </div>                                
                    </div>                  
            </div> 
            `
        });

        sorted_area.innerHTML = data;
        sort_status =  sort_status ? 0 : 1;
    });


    //sort by title
    title_bnt.addEventListener("click", async function (event) {
        sorted_area.innerHTML = "";
        let articleList = null;

        if(sort_status == 0){
            articleList = await sortArticleByTitleAsc();
        } else {
            articleList = await sortArticleByTitleDesc();
        }

        let data = "";
        articleList.forEach((article) => {
            data += `
                    <div class="item">
                    <a href="./articles/${article.id}" class="item-img">
                        <div >   
                            <img src="${article.cover_url}" alt="Image" class="img-responsive">                            
                        </div>
                    </a>                           
                    <div class="item-info"> 
                        <h2><a href="./articles/${article.id}">${article.title}</a></h2>
                        
                    
                        <div class="user">
                            <a href="./account/${article.user_id}">
                            <div class="avatar">
                            
                                <img src="${article.avatar_url}" width="24px" height="24px" alt="" id="avatar" class="user_avatar"> 
                            </div>
                            
                            <div class="username">
                                <p>${article.author}</p>
                            </div>
                            </a>
            
                        </div>
                        
                        <div class="icon">
                            <div class="home_timestamp">${article.datetime}</div>
                            <div class="home_icon">
                            <div class="comment">
                            <a href="./articles/${article.id}">
                                <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 96 960 960" width="20"><path d="M107.694 746.767V231.386q0-15.039 10.673-25.212t25.712-10.173h497.46q14.038 0 24.711 10.173 10.673 10.173 10.673 25.212v338.46q0 14.038-10.673 24.711-10.673 10.673-24.711 10.673H252.231L107.694 746.767Zm179.922 33.846q-14.039 0-24.712-10.673t-10.673-24.711V689.23H748.23l12.693 12.693V337h54.998q15.039 0 25.712 10.673t10.673 25.711V922.15L710.769 780.613H287.616ZM612.924 260H171.693v334.848l54.616-53.617h386.615V260Zm-441.231 0v334.848V260Z"></path></svg>
                                <span id="com_num"> ${article.comment_cnt} </span>
                                </a>
                            </div>

                            <div class="like">
                                <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 96 960 960" width="20"><path d="m480 885.075-36.153-32.691q-98.461-88.231-162.5-150.577-64.038-62.346-100.576-109.923-36.539-47.577-50.654-86.269-14.116-38.692-14.116-78.615 0-80.153 55.423-135.576Q226.847 236.001 307 236.001q49.385 0 95 23.501 45.615 23.5 78 67.269 32.385-43.769 78-67.269 45.615-23.501 95-23.501 80.153 0 135.576 55.423Q843.999 346.847 843.999 427q0 39.923-13.616 77.615-13.615 37.692-50.154 84.769-36.538 47.077-100.884 110.423-64.346 63.346-165.192 154.577L480 885.075ZM480 815q93-83.385 153-142.077 60-58.692 95.5-102.192 35.5-43.5 49.5-77.308 14-33.808 14-66.423 0-59-40-99t-99-40q-35.385 0-66.077 14.885-30.692 14.884-61.154 47.808l-35 41h-21.538l-35-41q-30.846-33.308-62.346-48.001Q340.385 288 307 288q-58.615 0-98.808 40Q168 368 168 427q0 32.615 13 64.923t47.5 75.308q34.5 43 95 102T480 815Zm0-264Z"></path></svg>
                                <span id="like_num"> ${article.likes} </span>
                            </div>
                            </div>
                        </div>                                
                    </div>                  
            </div> 
            `
        });

        sorted_area.innerHTML = data;
        sort_status =  sort_status ? 0 : 1;
    });



});


//get article sort by datetime asc
async function sortArticleByTimeAsc(){
    const data = await fetch(`./sortByTimeAsc`)
            .then((response) => response.json());
    return data;
};

//get article sort by datetime desc
async function sortArticleByTimeDesc(){
    const data = await fetch(`./sortByTimeDesc`)
            .then((response) => response.json());
    return data;
};


//get article sort by username asc
async function sortArticleByUsernameAsc(){
    const data = await fetch(`./sortByUsernameAsc`)
            .then((response) => response.json());
    return data;
};

//get article sort by username desc
async function sortArticleByUsernameDesc(){
    const data = await fetch(`./sortByUsernameDesc`)
            .then((response) => response.json());
    return data;
};


//get article sort by title asc
async function sortArticleByTitleAsc(){
    const data = await fetch(`./sortByTitleAsc`)
            .then((response) => response.json());
    return data;
};

//get article sort by title desc
async function sortArticleByTitleDesc(){
    const data = await fetch(`./sortByTitleDesc`)
            .then((response) => response.json());
    return data;
};