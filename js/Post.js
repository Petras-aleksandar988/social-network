class Post {
  api_url = "https://aleksa-scandiweb.shop/socialNetwork";

  async create(userId, content) {
    let data = {
        user_id: userId,
        content: content,
        likes: 0,
    };
    data = JSON.stringify(data);

    try {
        let response = await fetch(this.api_url + "/posts.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: data,
        });

        // Check if the response is successful
        if (!response.ok) {
            // Handle HTTP errors
            const errorText = await response.text();
            throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
        }

        // Parse and return the JSON data
        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Error:', error);
        // Handle the error appropriately
        throw error;
    }
}

  async getPosts() {
    let response = await fetch(this.api_url  + "/posts.php");
    let data = await response.json();
    return data;
  }



  delete(post_id) {
    
    fetch(this.api_url + `/posts.php?id=${post_id}`  , {
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
    fetch(this.api_url +  `/posts.php?id=${post_id}`,  {
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
