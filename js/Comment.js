class Comment {
  api_url = "https://aleksa-scandiweb.shop/socialNetwork";
  //   sending comment content, post and user info to database

  create(post_id, session_id, commentContent) {
    let data = {
      user_id: session_id,
      post_id: post_id,
      content: commentContent,
    };
    data = JSON.stringify(data);

    fetch(this.api_url  + "/comments.php", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {});
  }
  //  pulling comments from database for every different post
  async getComment(post_id) {
    const response = await fetch(this.api_url + "/comments.php" );
    const data = await response.json();
    console.log(data);
    console.log(post_id);
    
    let post_comments = [];
    let i = 0;
    data.forEach((comment) => {
      if (comment.post_id === post_id) {
        post_comments[i] = comment;
        i++;
      }
    });
    return post_comments;
  }
}
