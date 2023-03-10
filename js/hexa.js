let session = new Session();
let session_id = session.getSession();
/*  If we have cookie created for current user we get information about username and email from database with async function getUserData() and present it on U/I.
In case we do not have cookie created we redirect user to home page
*/

if (session_id !== "") {
  async function getUserData() {
    let user = new User();
    let data = await user.getUser(session_id);
    document.querySelector("#username").innerText = data.username;
    document.querySelector("#email").innerText = data.email;
    document.querySelector("#edit_user_name").value = data.username;
    document.querySelector("#edit_email").value = data.email;
  }
  getUserData();
} else {
  window.location.href = "/";
}
// destroying existing cookie when click logout
document.querySelector(".logout").addEventListener("click", (e) => {
  session.destroySession();
  window.location.href = "/";
});
//  showing and closing popup modal
document.querySelector("#editAcount").addEventListener("click", (e) => {
  document.querySelector(".custom-modal").style.display = "block";
});
document.querySelector("#close-modal").addEventListener("click", (e) => {
  document.querySelector(".custom-modal").style.display = "none";
});
//  changging user info by sending current info with User edit() method placing new info in database
document.querySelector("#edit-form").addEventListener("submit", (e) => {
  e.preventDefault();
  let user = new User();
  let username = document.querySelector("#edit_user_name").value;
  let email = document.querySelector("#edit_email").value;
  user.edit(username, email);
});
// delete current user from database and destroying cookie
document.querySelector("#delete-profile").addEventListener("click", (e) => {
  e.preventDefault();

  let user = new User();

  let text = "Do you want to delete your profile?";
  if (confirm(text)) {
    user.delete();
  }
});
//  creating user posts
document.querySelector("#postForm").addEventListener("submit", (e) => {
  e.preventDefault();
//  creating post with async function 
  async function createPost() {
    let post = new Post();
    let content = document.querySelector("#postContent").value;
    document.querySelector("#postContent").value = "";
    post = await post.create(session_id, content);
    // taking current user 
    let user = new User();
    user = await user.getUser(session_id);

    let deletePostHtml = "";
    //  creating remove btn
    if (session_id === post.user_id) {
      deletePostHtml = `<button class="remove-btn" onclick="removeMyPost(this)" >Remove</button>`;
    }
    let htmlPosts = document.querySelector(".allPostsWrapper").innerHTML;
    // presenting post in U/I
    document.querySelector(".allPostsWrapper").innerHTML =
      `
        <div class="single-post" data-post_id=${post.id}>
        <div>
        <p><b>Author: ${user.username}</b></p>
         <div class="post-content">${post.content}</div>
         </div>
          <div class="post-actions">
           <div>
              <button onclick="likePost(this)" class="like-btn"><span>${post.likes}</span> Likes</button>
              <button onclick="commentPost(this)" class="comment-btn">Comments</button>
              ${deletePostHtml}
           </div>
          </div>
         <div class="post-comments">
           <form >
           <input  placeholder= "Comment...." type="text" />
           <button onclick="commentPostSubmit(event)" >Comment</button>
           </form>
         </div>

        </div>
      
      
      ` + htmlPosts;
  }
  createPost();
});
//  retriving all posts with async function from database
async function getAllPosts() {
  let allPosts = new Post();
  allPosts = await allPosts.getPosts();
  //  looping through posts and geting user info from database with async function
  allPosts.forEach((post) => {
    async function getUser() {
      let user = new User();
      user = await user.getUser(post.user_id);
      // getting comments for every post from database with async function
      let comments = new Comment();
      let allComments = await comments.getComment(post.id);

      let comments_html = "";

      if (allComments.length > 0) {
        allComments.forEach((comment) => {
          comments_html += `
          <div class="single-comment" data-comment_id=${comment.id} >
    <p>Author: ${user.username}</p>
    <p>Comment: ${comment.content}</p>
    </div>
    `;
        });
      }
      let deletePostHtml = "";

      if (session_id === post.user_id) {
        deletePostHtml = `<button class="remove-btn" onclick="removeMyPost(this)" >Remove</button>`;
      }
      let htmlPosts = document.querySelector(".allPostsWrapper").innerHTML;
      document.querySelector(".allPostsWrapper").innerHTML =
        `
        <div class="single-post" data-post_id=${post.id}>
        <div>
        <p><b>Author: ${user.username}</b></p>
         <div class="post-content">${post.content}</div>
         </div>
          <div class="post-actions">
           <div>
              <button onclick="likePost(this)" class="like-btn"><span>${post.likes}</span> Likes</button>
              <button onclick="commentPost(this)" class="comment-btn">Comments</button>
              ${deletePostHtml}
           </div>
          </div>
         <div class="post-comments">
           <form >
           <input  placeholder= "Comment...." type="text" />
           <button onclick="commentPostSubmit(event)" >Comment</button>
           </form>
           ${comments_html}
         </div>

        </div>
      
      
      ` + htmlPosts;
    }
    getUser();
  });
}
getAllPosts();
// like button, sending changes to database with like() method
function likePost(btn) {
  let mainEl = btn.closest(".single-post");
  let post_id = mainEl.getAttribute("data-post_id");
  console.log(btn);
  let numberOfLikes = parseInt(btn.querySelector("span").innerText);
  console.log(numberOfLikes);
  btn.querySelector("span").innerText = numberOfLikes + 1;
  btn.setAttribute("disabled", true);
  let post = new Post();
  post.like(post_id, numberOfLikes + 1);
}
// button to open comment section
function commentPost(el) {
  let mainEl = el.closest(".single-post");
  mainEl.querySelector(".post-comments").style.display = "block";
}
// removing post from hexa.html and database
function removeMyPost(el) {
  const mainEl = el.closest(".single-post");
  const post_id = mainEl.getAttribute("data-post_id");
  mainEl.remove();
  let post = new Post();
  let text = "Do you want to delete your post?";
  if (confirm(text)) {
    post.delete(post_id);
  }
}
// presenting comments on specifical post, creating and sending comment to database, getting info form database about user who create comment
function commentPostSubmit(e) {
  e.preventDefault();
  let btn = e.target;

  let mainEl = btn.closest(".single-post");
  btn.setAttribute("disabled", true);
  let post_id = mainEl.getAttribute("data-post_id");
  console.log(post_id);
  let commentContent = mainEl.querySelector(".post-comments input").value;
  mainEl.querySelector("input").value = "";
  let comment = new Comment();
  comment = comment.create(post_id, session_id, commentContent);
  async function getUserComment() {
    let user = new User();
    user = await user.getUser(session_id);
    mainEl.querySelector(".post-comments").innerHTML += `
    <div class="single-comment" data-user_id=${user.id} >
    <p>Author: ${user.username}</p>
    <p>Comment: ${commentContent}</p>
    </div>
    `;
  }
  getUserComment();
}
