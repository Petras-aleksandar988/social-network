class Post {
  api_url = "http://localhost:8000";

  async create(userId, content) {
    let data = {
        user_id: userId,
        content: content,
        likes: 0,
    };
    data = JSON.stringify(data);
    const apiKey = await getApiKey();
    try {
        let response = await fetch(this.api_url + "/posts.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'API_KEY': apiKey 
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
    const apiKey = await getApiKey();
    let response = await fetch(this.api_url  + "/posts.php" ,{
      headers: {
        'API_KEY': apiKey
      },
    });
    let data = await response.json();
    return data;
  }



 async  delete(post_id) {
  const apiKey = await getApiKey();
    fetch(this.api_url + `/posts.php?id=${post_id}`  , {
      method: "DELETE",
      headers: {
        'API_KEY': apiKey
      },
    })
      .then((res) => res.json())
      .then((data) => {
        alert("your post is deleted");
      });
  }

 async like(post_id, numberOfLikes) {
  const apiKey = await getApiKey();
    let data = {
      likes: numberOfLikes,
    };
    data = JSON.stringify(data);
    fetch(this.api_url +  `/posts.php?id=${post_id}`,  {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        'API_KEY': apiKey
      },
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {});
  }
}
