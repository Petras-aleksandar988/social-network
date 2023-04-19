class Comment {
<<<<<<< HEAD
  api_url = "https://62fcfa83b9e38585cd4a4f4e.mockapi.io";
//   sending comment content, post and user info to database
    
=======
  api_url = "https://643f98983dee5b763e203b3a.mockapi.io";
  //   sending comment content, post and user info to database

>>>>>>> af21a80 (update api)
  create(post_id, session_id, commentContent) {
    let data = {
      user_id: session_id,
      post_id: post_id,
      content: commentContent,
    };
<<<<<<< HEAD
      data = JSON.stringify(data);
      
      fetch(this.api_url + "/comments", {
          method: "POST",
          headers: {
              "content-type": "application/json"
          },
          body:data
      }).then(res => res.json()).then(data => {
      })
    }
    //  pulling comments from database for every different post 
    async getComment(post_id) {
        const response = await fetch(this.api_url + "/comments")
       const data = await response.json()
        let post_comments = [];
        let i = 0
        data.forEach(comment => {
            if (comment.post_id === post_id) {
                post_comments[i] = comment
                i++
            }
        })
          return post_comments
    }
=======
    data = JSON.stringify(data);

    fetch(this.api_url + "/comments", {
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
    const response = await fetch(this.api_url + "/comments");
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
>>>>>>> af21a80 (update api)
}
