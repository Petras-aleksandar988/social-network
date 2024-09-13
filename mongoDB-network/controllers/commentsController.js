
import promisePool from '../database/index.js'
import Comment from '../models/commentModel.js';

// @desc   Get all posts
// @route  GET /api/posts
export const  getCommnets = async  (req, res, next) => {

  try {
    // Fetch all users from the database
    const comment = await Comment.find({}).select('-_id');;
    
    // Send users in the response
    res.status(200).json(comment);
  } catch (error) {
    next(error); // Pass error to the error handling middleware
  }


  // const limit = parseInt(req.query.limit);
  // const [rows, fields] = await promisePool.query('SELECT * from comments');
  
  // if (!isNaN(limit) && limit > 0) {
  //   return res.status(200).json(rows.slice(0, limit));
  // }

  // res.status(200).json(rows);
};

// @desc    Get single post
// @route   GET /api/posts/:id
export const getCommnet = async (req, res, next) => {


  try {
    // Retrieve user ID from the request parameters
    const id = req.params.id;

    // Find user by ID, excluding the password field
    const comment = await Comment.findById(id).select('-password');
    
    // If user not found, return an error response
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Send the user details in the response
    res.status(200).json(comment);
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
export const createCommnet =  async (req, res, next) => {

  try {
    const { user_id, post_id, content} = req.body;
   // Check if the user already exists
  //  const userExists = await User.findOne({ email });

  //  if (userExists) {
  //    return res.status(400).json({ error: 'User already exists' });
  //  }

   // Create new user
   const comment = await Comment.create({
    user_id,
    content,
    post_id
   });

   // If post is created successfully
   if (comment ) {
     res.status(201).json({
       _id: comment._id,
       content: comment.content,
     });
   } else {
     res.status(400).json({ error: 'Invalid post data' });
   }
 } catch (error) {
   next(error); // Pass the error to the error handling middleware
 }

  // const {user_id, post_id, content} = req.body
  // const sql = 'insert into comments (user_id, post_id, content) values (?,?,?)';
  // const [rows, fields] = await promisePool.query(sql, [user_id, post_id, content]);

  

  // res.status(201).json({data: rows});
};

// @desc    Update post
// @route   PUT /api/posts/:id
export const updateCommnet = async (req, res, next) => {


  

    // Respond with the updated user information excluding the password
  //   res.status(200).json({
  //     _id: updatedPost._id,
  //     content: updatedPost._content,
  //     likes: updatedPost.likes
  //   });
  // } catch (error) {
  //   res.status(500).json({ message: 'Server error' });
  // }



  // const id = parseInt(req.params.id);
  // const {email,username,logo,password} = req.body
  // const sql = 'update  users  set email = ? ,username = ? ,logo = ? ,password = ? where id= ?';
  // const [rows, fields] = await promisePool.query(sql, [email,username,logo,password, id]);

  // res.status(200).json({data: rows});
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
export const deleteCommnet = async(req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const sql = 'delete from users where id =?';
    const [rows, fields] = await promisePool.query(sql, [id]);
    res.status(200).json({data: rows});
  } catch (error) {
    console.log(error);
    res.json({
      status: 'error'
    })
    
  }
 
};
