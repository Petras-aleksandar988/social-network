class Comment {
  api_url = "http://localhost:8000";
  //   sending comment content, post and user info to database

 async create(post_id, session_id, commentContent) {
    let data = {
      user_id: session_id,
      post_id: post_id,
      content: commentContent,
    };
    data = JSON.stringify(data);
    const apiKey = await getApiKey();
    fetch(this.api_url  + "/comments.php", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        'API_KEY': apiKey
      },
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {});
  }
  //  pulling comments from database for every different post
  async getComment(post_id) {
    const apiKey = await getApiKey();
    const response = await fetch(this.api_url + "/comments.php",{
      headers: {
        'API_KEY': apiKey
      },
  });
    const data = await response.json();
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
