
import promisePool from '../database/index.js'

// @desc   Get all posts
// @route  GET /api/posts
export const getUsers  = async  (req, res, next) => {
  const limit = parseInt(req.query.limit);
  const [rows, fields] = await promisePool.query('SELECT * from users');
  console.log(rows);
  
  if (!isNaN(limit) && limit > 0) {
    return res.status(200).json(rows.slice(0, limit));
  }

  res.status(200).json(rows);
};

// @desc    Get single post
// @route   GET /api/posts/:id
export const getUser = async (req, res, next) => {
  const id = parseInt(req.params.id);
  const [rows, fields] = await promisePool.query('SELECT * from users where id = ?', [id]);


  if (rows.length === 0) {
    const error = new Error(`A user with the id of ${id} was not found`);
    error.status = 404;
    return next(error);
  }

  res.status(200).json(rows[0]);
};

// @desc    Create new post
// @route   POST /api/posts
export const createUser =  async (req, res, next) => {
  const {email,username,password} = req.body
  const sql = 'insert into users (email,username,password) values (?,?,?)';
  const [rows, fields] = await promisePool.query(sql, [email,username,password]);

  console.log(rows);
  

  res.status(201).json({data: rows});
};

// @desc    Update post
// @route   PUT /api/posts/:id
export const updateUser = async (req, res, next) => {
  const id = parseInt(req.params.id);
  const {email,username,logo,password} = req.body
  const sql = 'update  users  set email = ? ,username = ? ,logo = ? ,password = ? where id= ?';
  const [rows, fields] = await promisePool.query(sql, [email,username,logo,password, id]);

  res.status(200).json({data: rows});
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
export const deleteUser = async(req, res, next) => {
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
