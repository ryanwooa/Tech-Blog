window.addEventListener("load", function() {
  const sub_btn = document.querySelector("#submit_btn");

  //submit article to server
  sub_btn.addEventListener("click", function() {
    const title = document.querySelector("#edit-title").value;
    const html = editor.getHtml();

    const id = sub_btn.dataset.articleid;

    // Get the selected cover
    const coverRadios = document.querySelectorAll('input[type=radio][name="cover"]');
    let selectedCover;
    for (let radio of coverRadios) {
      if (radio.checked) {
        selectedCover = `http://localhost:3000/images/cover/cover${radio.value}.jpg`;
        break;
      }
    }

    if (!title) {
      alert("Please enter the title");
      return;
    }

    if (!selectedCover) {
      alert("Please select the cover");
      return;
    }

    if (html == "<p><br></p>" ) {
      alert("Please enter the content");
      return;
    }


    if (id != null) {
      //edit article
      const article_data = {
        title: title,
        content: html,
        cover_url: selectedCover,
        articleId: id
      };
      fetch("/update_article", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(article_data)
        })
        .then(response => response.json())
        .then(data => {
          // 处理服务器返回的响应数据
          if (data.status) {
            window.location.href = `/articles/${data.article_id}`;  /// when success , render to home page
          } else {
            // 服务器返回错误
            alert(data.message);
          }
        })
        .catch(error => {
          // 处理请求错误
          console.error('Error:', error);
        });

    } else {
      //new article
      const article_data = {
        title: title,
        content: html,
        cover_url: selectedCover
      };


      fetch("/submit_article", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(article_data)
        })
        .then(response => response.json())
        .then(data => {
          // 处理服务器返回的响应数据
          if (data.status) {
            window.location.href = `/articles/${data.article_id}`;  /// when success , render to home page
          } else {
            // 服务器返回错误
            alert(data.message);
          }
        })
        .catch(error => {
          // 处理请求错误
          console.error('Error:', error);
        });
    }
  });
  
  
    // limit the length of title of 15
  //   const title = document.querySelector("#edit-title");
  //   const counter = document.querySelector("#counter");
  //   title.addEventListener("input",function(){
  //     const inputText = title.value.trim();
  //     const wordCount = inputText.split(/\s+/).length;

  // if (wordCount <= 15) {
  //   counter.textContent = `${15 - wordCount} words remaining`;
  // } else {
  //   // 如果超过最大单词数，则截断文本内容
  //   title.value = inputText
  //     .split(/\s+/)
  //     .slice(0, 15)
  //     .join(' ');
  //     counter.textContent = '15 words maximum!';
  // }
  // });

});
