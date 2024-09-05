class Post {
  api_url = "http://localhost:8000/api";

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

  async getPosts() {
    let response = await fetch(this.api_url + "/posts");
    let data = await response.json();
    return data;
  }

  // delete() {
  //   let session = new Session();
  //   let session_id = session.getSession();
  //   fetch(this.api_url + "/users/" + session_id, {
  //     method: "DELETE",
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       session.destroySession();
  //       window.location.href = "index.html";
  //     });
  // }

  delete(post_id) {
    
    fetch(this.api_url + "/posts/" + parseInt(post_id), {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        alert("your post is deleted");
      });
  }

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
