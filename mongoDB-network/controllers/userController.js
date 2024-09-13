
import promisePool from '../database/index.js'
 import User from '../models/userModel.js';
 import Post from '../models/postModel.js';
 import Comment from '../models/commentModel.js';
import bcrypt from 'bcrypt';
// @desc   Get all posts
// @route  GET /api/posts
export const getUsers  = async  (req, res, next) => {

  try {
    // Fetch all users from the database
    const users = await User.find({}).select('-_id -password');;
    
    // Send users in the response
    res.status(200).json(users);
  } catch (error) {
    next(error); // Pass error to the error handling middleware
  }
//   const limit = parseInt(req.query.limit);
//   const { email, password } = req.body;
//   const [rows, fields] = await promisePool.query('SELECT * from users');
  
//   if (!isNaN(limit) && limit > 0) {
//     return res.status(200).json(rows.slice(0, limit));
//   }

//   res.status(200).json(rows);
};

// @desc    Get single post
// @route   GET /api/posts/:id
export const getUser = async (req, res, next) => {
  try {
    // Retrieve user ID from the request parameters
    const id = req.params.id;

    // Find user by ID, excluding the password field
    const user = await User.findById(id).select('-password');
    
    // If user not found, return an error response
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Send the user details in the response
    res.status(200).json(user);
  } catch (error) {
    next(error); // Pass error to the error handling middleware
  }
  // const [rows, fields] = await promisePool.query('SELECT * from users where id = ?', [id]);


  // if (rows.length === 0) {
  //   const error = new Error(`A user with the id of ${id} was not found`);
  //   error.status = 404;
  //   return next(error);
  // }

  // res.status(200).json(rows[0]);
};


export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare the hashed password in DB with the password sent by the user
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Password is valid, login the user (e.g., create a session or token)
    res.status(200).json({ message: 'Login successful', userId: user._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }

  // // Check if user exists
  // const sql = 'SELECT * FROM users WHERE email = ?';
  // const [rows] = await promisePool.query(sql, [email]);

  // if (rows.length === 0) {
  //   return res.status(401).json({ message: 'Invalid email or password' });
  // }

  // const user = rows[0];

  // // Compare the hashed password in DB with the password sent by the user
  // const isPasswordValid = await bcrypt.compare(password, user.password);

  // if (!isPasswordValid) {
  //   return res.status(401).json({ message: 'Invalid email or password' });
  // }

  // // Password is valid, login the user (e.g., create a session or token)
  // res.status(200).json({ message: 'Login successful', userId: user.id });
};
// @desc    Create new post
// @route   POST /api/posts
export const createUser = async (req, res, next) => {

  try {
    const { email, username, password } = req.body;
   // Check if the user already exists
   const userExists = await User.findOne({ email });

   if (userExists) {
     return res.json({ error: 'User already exists' });
   }

   // Create new user
   const user = await User.create({
     username,
     email,
     password
   });

   // If user is created successfully
   if (user) {
     res.status(201).json({
       _id: user._id,
       username: user.username,
       email: user.email
     });
   } else {
     res.status(400).json({ error: 'Invalid user data' });
   }
 } catch (error) {
   next(error); // Pass the error to the error handling middleware
 }
  // const emailCheckSql = 'SELECT email FROM users WHERE email = ?';
  // const [emailRows] = await promisePool.query(emailCheckSql, [email]);

  // if (emailRows.length > 0) {
  //   // If the email exists, send an error response
  //   return res.json({ error: 'Email already exists', emailExist:'Email already exists, please choose another one!' });
  // }

  // const saltRounds = 10;
  // const hashedPassword = await bcrypt.hash(password, saltRounds);
  // const sql = 'INSERT INTO users (email, username, password) VALUES (?, ?, ?)';
  // const [rows] = await promisePool.query(sql, [email, username, hashedPassword]);

  // res.status(201).json({ insertId: rows.insertId });
};


// @desc    Update post
// @route   PUT /api/posts/:id
export const updateUser = async (req, res, next) => {
  const id = req.params.id;
  const { email, username, logo, password } = req.body;
  

  try {
    // Find the user by ID
    const user = await User.findById(id);
  
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields if they are provided
    if (email) user.email = email;
    if (username) user.username = username;
    if (logo) user.logo = logo;
    
    // Hash the new password if provided
    if (password) {
      const saltRounds = 10;
      user.password = await bcrypt.hash(password, saltRounds);
    }

    // Save the updated user
    const updatedUser = await user.save();

    // Respond with the updated user information excluding the password
    res.status(200).json({
      _id: updatedUser._id,
      email: updatedUser.email,
      username: updatedUser.username,
      logo: updatedUser.logo,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }

  // const {email,username,logo,password} = req.body
  // const sql = 'update  users  set email = ? ,username = ? ,logo = ? ,password = ? where id= ?';
  // const [rows, fields] = await promisePool.query(sql, [email,username,logo,password, id]);

  // res.status(200).json({data: rows});
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
export const deleteUser = async(req, res, next) => {
  try {
    const id = req.params.id;
    const userDeleted = await User.findByIdAndDelete(id);
   // Delete posts that belong to the user (where user_id matches the user's id)
   await Post.deleteMany({ user_id: id });
   await Comment.deleteMany({ user_id: id });
    if(!userDeleted){
    return  res.status(400).json({message: 'User not found' })
    }

    res.status(200).json({message: 'User deleted' })
  } catch (error) {
    next(error)
  }
  // try {
  //   const id = parseInt(req.params.id);
  //   const sql = 'delete from users where id =?';
  //   const deletePostSql = 'DELETE FROM posts WHERE user_id = ?';
  //   const deleteCommentsSql = 'DELETE FROM comments WHERE user_id = ?';
  //   await promisePool.query(sql, [id]);
  //   await promisePool.query(deletePostSql, [id]);
  //    await promisePool.query(deleteCommentsSql, [id]);
  //   res.status(200).json(`user with id ${id} is deleted`);
  // } catch (error) {
  //   console.log(error);
  //   res.json({
  //     status: 'error'
  //   })
    
  // }
 
};
