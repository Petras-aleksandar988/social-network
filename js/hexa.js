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
   
    if (session_id == post.user_id) {
      
      deletePostHtml = `<button class="remove-btn" onclick="removeMyPost(this)" >Remove</button>`;
    }
    let htmlPosts = document.querySelector(".allPostsWrapper").innerHTML;
    // presenting post in U/I
    document.querySelector(".allPostsWrapper").innerHTML =
      `
        <div class="single-post" data-post_id=${post.id}>
        <div>
        <p><b class='author'>Author: ${user.username}</b></p>
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

  for (const post of allPosts) {
    
    // Fetch post author user details asynchronously
    let postUser = new User();
    let postAuthor = await postUser.getUser(post.user_id);

    // Fetch comments for this post asynchronously
    let comments = new Comment();
    let allComments = await comments.getComment(post._id);

    let comments_html = "";

    // Loop through all comments for the post
    for (const comment of allComments) {
      let commentUser = new User();
      let commentAuthor = await commentUser.getUser(comment.user_id);

      // Append the comment HTML along with its author's name
      comments_html += `
        <div class="single-comment" data-comment_id=${comment.id}>
          <p class='author'>Author: ${commentAuthor.username}</p>
          <p class='comment'>Comment: ${comment.content}</p>
        </div>
      `;
    }

    let deletePostHtml = "";
    if (session_id == post.user_id) {
      deletePostHtml = `<button class="remove-btn" onclick="removeMyPost(this)">Remove</button>`;
    }

    let htmlPosts = document.querySelector(".allPostsWrapper").innerHTML;
    document.querySelector(".allPostsWrapper").innerHTML =
      `
      <div class="single-post" data-post_id=${post._id}>
        <div>
          <p><b class='author'>Author: ${postAuthor.username}</b></p>
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
          <form>
            <input placeholder="Comment...." type="text" />
            <button onclick="commentPostSubmit(event)">Comment</button>
          </form>
          ${comments_html}
        </div>
      </div>
      ` + htmlPosts;

        // Update background image based on whether there are comments
    let currentPostEl = document.querySelector(`.single-post[data-post_id='${post._id}']`);
    let commentBtn = currentPostEl.querySelector(".comment-btn");

    if (allComments.length > 0) {
      // Change background image if there are comments
      commentBtn.style.backgroundImage = "url('img/comment-blue-2.png')";
    
    }
  }
}
getAllPosts();

// like button, sending changes to database with like() method
function likePost(btn) {
  let mainEl = btn.closest(".single-post");
  let post_id = mainEl.getAttribute("data-post_id");
  let numberOfLikes = parseInt(btn.querySelector("span").innerText);
  btn.querySelector("span").innerText = numberOfLikes + 1;
  btn.setAttribute("disabled", true);
  let post = new Post();
  post.like(post_id, numberOfLikes + 1);
}
// button to open comment section
function commentPost(el) {
  let mainEl = el.closest(".single-post");
  let commentsSection = mainEl.querySelector(".post-comments");

  // Toggle the display property between 'block' and 'none'
  if (commentsSection.style.display === "block") {
    commentsSection.style.display = "none"; // Hide the comments
  } else {
    commentsSection.style.display = "block"; // Show the comments
  }
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
const singlePost = btn.closest('.single-post')

  
singlePost.querySelector('.comment-btn').style.backgroundImage = "url('img/comment-blue-2.png')"
  let mainEl = btn.closest(".single-post");
  btn.setAttribute("disabled", true);
  let post_id = mainEl.getAttribute("data-post_id");
  let commentContent = mainEl.querySelector(".post-comments input").value;
  mainEl.querySelector("input").value = "";
  let comment = new Comment();
  comment = comment.create(post_id, session_id, commentContent);
  async function getUserComment() {
    let user = new User();
    user = await user.getUser(session_id);
    mainEl.querySelector(".post-comments").innerHTML += `
    <div class="single-comment" data-user_id=${user.id} >
    <p class='author' >Author: ${user.username}</p>
    <p class='comment' >Comment: ${commentContent}</p>
    </div>
    `;
  }
  getUserComment();
}
