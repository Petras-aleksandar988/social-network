class User {


  api_url = "http://localhost:8000/api";

  /*  - reciving arguments about username,password, email. stringify object and sending it with fetch to database mockapi.io.
    -  creating cookie with method startSession()
    - redirecting user to hexa.html */

    create(username, password, email) {
      let data = {
        username: username,
        password: password,
        email: email,
      };
      data = JSON.stringify(data);
    
      fetch(this.api_url + "/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error('Network response was not ok');
          }
          return res.json();
        })
        .then((response) => {
    
          // Access insertId from the response data
          const insertId = response.data.insertId;
    
          let session = new Session();
          session.startSession(insertId);
          window.location.href = "hexa.html";
        })
        .catch((error) => console.error('Fetch error:', error));
    }
    
  //  pulling info about current user form database
  async getUser(userId) {
    let response = await fetch(this.api_url + "/users/" + userId);
    let data = await response.json();
    return data;
  }
  // changing username and pasword and sending new info to database
  edit(username, email) {
    let session = new Session();
    let session_id = session.getSession();
    let data = {
      username: username,
      email: email,
    };
    data = JSON.stringify(data);
    fetch(this.api_url + "/users/" + session_id, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: data,
    })
      .then((response) => response.json())
      .then((data) => {
        window.location.href = "hexa.html";
      });
  }
  //  looping through every user and comparing with entered info in login section. if there is a match we create cookie and redirect user to hexa.html

  login(email, password) {
    fetch(this.api_url + "/users")
      .then((response) => response.json())
      .then((data) => {
        
        let loginSuccessful = 0;
        data.forEach((dataUser) => {

          if (dataUser.email === email && dataUser.password === password) {
            let session = new Session();
            loginSuccessful = 1;
            session.startSession(dataUser.id);
            window.location.href = "hexa.html";
          }
        });
        if (loginSuccessful === 0) {
          alert("Wrong email and address");
        }
      });
  }
  // delete user from database, destroy cookie and redirect to home page
  delete() {
    let session = new Session();
    let session_id = session.getSession();
    fetch(this.api_url + "/users/" + session_id, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        session.destroySession();
        window.location.href = "index.html";
        alert("your profile is deleted");
      });
  }
}
