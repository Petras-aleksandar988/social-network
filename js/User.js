class User {


  api_url = "https://aleksa-scandiweb.shop/socialNetwork";

  async  create(username, password, email) {
      let data = {
        username: username,
        password: password,
        email: email
      };
      data = JSON.stringify(data);
      const apiKey = await getApiKey();
      
     
      fetch(this.api_url + "/users.php" ,  {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
           'API_KEY': apiKey
        },
        body: data,
      }) .then(response => {
        
        if (!response.ok) {
          // If the response is not OK, throw an error with the response text
          return response.text().then(text => { throw new Error(text); });
        }
        return response.json(); // Convert response to JSON if successful
      })
      .then(data => {
        if (data.error) {
          document.querySelector('#error_message').innerText = data.emailExist;
        } else {
          // const insertId = data._id;
          let session = new Session();
          session.startSession(data.user_id);
          window.location.href = "hexa.html";
        }
      })
      .catch(error => {
        console.error('Fetch error:', error); // Handle any other errors
      });
    }
    
    
  //  pulling info about current user form database
  async getUser(userId) {
    // const apiSecretKey = process.env.API_SECRET_KEY;
    const apiKey = await getApiKey();
    let response = await fetch(this.api_url + `/users.php?id=${userId}` , {
      headers: {
      'API_KEY': apiKey  
      },
    });
    let data = await response.json();
    return data;
  }
  // changing username and pasword and sending new info to database
async  edit(username, email) {
    let session = new Session();
    let session_id = session.getSession();
    let data = {
      username: username,
      email: email,
    };
    data = JSON.stringify(data);
    const apiKey = await getApiKey();
    fetch(this.api_url + `/users.php?id=${session_id}` ,{
      method: "PUT",
      headers: {
        "content-type": "application/json",
        'API_KEY': apiKey  
      },
      body: data,
    })
      .then((response) => response.json())
      .then((data) => {
        window.location.href = "hexa.html";
      });
  }
  //  looping through every user and comparing with entered info in login section. if there is a match we create cookie and redirect user to hexa.html

 async login(email, password) {
  const apiKey = await getApiKey();
    fetch(this.api_url + `/users.php?action=login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'API_KEY': apiKey
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        
        if (data.message === "Login successful") {
          let session = new Session();
          session.startSession(data.userId);
          window.location.href = "hexa.html";
        } else {
          document.querySelector('#error_login').innerText = data.message;
        }
      })
      .catch((error) => {
        console.error('Login error:', error);
      });
  }
  // delete user from database, destroy cookie and redirect to home page
  async delete() {
    let session = new Session();
    let session_id = session.getSession();
    const apiKey = await getApiKey();
    fetch(this.api_url + `/users.php?id=${session_id}` , {

      method: "DELETE",
      headers: {
        'API_KEY': apiKey
      },
    })
      .then((res) => res.json())
      .then((data) => {
        session.destroySession();
        window.location.href = "index.html";
        alert("your profile is deleted");
      });
  }
}
