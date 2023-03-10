class Session {
  //  creating cookie for current user
  startSession(user_id) {
    let date = new Date();
    let twoDays = 2 * 24 * 60 * 60 * 1000;
    date.setTime(date.getTime() + twoDays);
    let expires = "expires=" + date.toUTCString();
    document.cookie = "user_id=" + user_id + ";" + expires;
  }
  //  if cookie is created getSession() method provides value for current user cookie, in our case  user.id
  getSession() {
    let name = "user_id=";
    let ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
  // deleting cookie in case we want logout or delete profile
  destroySession() {
    let cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i];
      let eqPos = cookie.indexOf("=");
      let name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
      document.cookie = name + "=;expires= Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }
}
