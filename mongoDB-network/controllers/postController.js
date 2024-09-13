
import promisePool from '../database/index.js'
import Post from '../models/postModel.js';
import Comment from '../models/commentModel.js';
// @desc   Get all posts
// @route  GET /api/posts
export const getPosts  = async  (req, res, next) => {

  try {
    // Fetch all users from the database
    const posts = await Post.find({});
    
    // Send users in the response
    res.status(200).json(posts);
  } catch (error) {
    next(error); // Pass error to the error handling middleware
  }

  // const limit = parseInt(req.query.limit);
  // const [rows] = await promisePool.query('SELECT * from posts');
  
  // if (!isNaN(limit) && limit > 0) {
  //   return res.status(200).json(rows.slice(0, limit));
  // }

  // res.status(200).json(rows);
};

// @desc    Get single post
// @route   GET /api/posts/:id
export const getPost = async (req, res, next) => {


  try {
    // Retrieve user ID from the request parameters
    const id = req.params.id;

    // Find user by ID, excluding the password field
    const post = await Post.findById(id).select('-password');
    
    // If user not found, return an error response
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Send the user details in the response
    res.status(200).json(post);
  } catch (error) {
    next(error); // Pass error to the error handling middleware
  }

  // const id = parseInt(req.params.id);
  // const [rows, fields] = await promisePool.query('SELECT * from users where id = ?', [id]);


  // if (rows.length === 0) {
  //   const error = new Error(`A user with the id of ${id} was not found`);
  //   error.status = 404;
  //   return next(error);
  // }

  // res.status(200).json({data: rows});
};

// @desc    Create new post
// @route   POST /api/posts
export const createPost =  async (req, res, next) => {

  try {
    const { user_id,content,likes} = req.body;
   // Check if the user already exists
  //  const userExists = await User.findOne({ email });

  //  if (userExists) {
  //    return res.status(400).json({ error: 'User already exists' });
  //  }

   // Create new user
   const post = await Post.create({
    user_id,
    content,
    likes
   });

   // If post is created successfully
   if (post) {
     res.status(201).json({
       id: post._id,
       user_id : post.user_id,
       content: post.content,
       likes: post.likes
     });
   } else {
     res.status(400).json({ error: 'Invalid post data' });
   }
 } catch (error) {
   next(error); // Pass the error to the error handling middleware
 }

//   const {user_id,content,likes} = req.body
//   const sql = 'INSERT INTO posts (user_id, content, likes) VALUES (?, ?, ?)';
//   const [rows, fields] = await promisePool.query(sql, [user_id, content, likes || 0]);

//  // Retrieve the newly created post using the insertId
//  const sqlSelect = 'SELECT * FROM posts WHERE id = ?';
//  const [post] = await promisePool.query(sqlSelect, [rows.insertId]);

//  // Return the new post data
//  res.status(201).json(post[0]);


};

// @desc    Update post
// @route   PUT /api/posts/:id
export const updatePost = async (req, res, next) => {

  const id = req.params.id;
  const { likes} = req.body;
  

  try {
    // Find the user by ID
    const post = await Post.findById(id);
  
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Update fields if they are provided
    if (likes) post.likes = likes;
 
    
 

    // Save the updated user
    const updatedPost = await post.save();

    // Respond with the updated user information excluding the password
    res.status(200).json({
      id: updatedPost._id,
      content: updatedPost._content,
      likes: updatedPost.likes
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }

  // const id = parseInt(req.params.id);
  // const {likes} = req.body
  // const sql = 'UPDATE posts SET likes = ? WHERE id = ?';
  // const [rows, fields] = await promisePool.query(sql, [likes, id]);

  // res.status(200).json(rows);
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
export const deletePost = async(req, res, next) => {

  try {
    const id = req.params.id;
    const postDeleted = await Post.findByIdAndDelete(id);
    await Comment.deleteMany({ post_id: id });
    if(postDeleted){
      res.status(200).json({message: 'post deleted' })
    }
  } catch (error) {
    next(error)
  }
  // try {
  //   const id = parseInt(req.params.id);
  //   const deletePostSql = 'DELETE FROM posts WHERE id = ?';
  //   const deleteCommentsSql = 'DELETE FROM comments WHERE post_id = ?';
  //  await promisePool.query(deletePostSql, [id]);
  //    await promisePool.query(deleteCommentsSql, [id]);

  //   res.status(200).json('post deeted');
  // } catch (error) {
  //   console.log(error);
  //   res.json({
  //     status: 'error'
  //   })
    
  // }
 
};
