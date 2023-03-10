class Post {
  api_url = "https://62fcfa83b9e38585cd4a4f4e.mockapi.io";

  //  creating post with entered content and info about user behind it
  async create(userId, content) {
    let data = {
      user_id: userId,
      content: content,
      likes: 0,
    };
    data = JSON.stringify(data);
    let response = await fetch(this.api_url + "/posts", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: data,
    });
    data = await response.json();
    return data;
  }
  // pulling  and returning all posts so we can manipulate with DOM elements outside of class
  async getPosts() {
    let response = await fetch(this.api_url + "/posts");
    let data = await response.json();
    return data;
    }
    
//   delete() {
//     let session = new Session();
//     let session_id = session.getSession();
//     fetch(this.api_url + "/users/" + session_id, {
//       method: "DELETE",
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         session.destroySession();
//         window.location.href = "index.html";
//       });
//   }
    //  delete post 
  delete(post_id) {
    fetch(this.api_url + "/posts/" + post_id, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        alert("your post is deleted");
      });
    }
    //   changing number of likes in database with method PUT
    
  like(post_id, numberOfLikes) {
    let data = {
      likes: numberOfLikes,
    };
    data = JSON.stringify(data);
    fetch(this.api_url + "/posts/" + post_id, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {});
  }
}
