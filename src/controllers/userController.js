import bcrypt from 'bcrypt';
import { userRepository } from '../repositories/userRepository.js';

export async function createUser(req, res) {
  const user = req.body;

  try {
    const existingUsers = await userRepository.selectUser(user.email);
    
    if (existingUsers.rowCount > 0) {
      return res.sendStatus(409);
    }

    const passwordHash = bcrypt.hashSync(user.password, 10);

    await userRepository.createUser(user, passwordHash);

    res.sendStatus(201);

  } catch (error) {

    console.log(error);
    return res.sendStatus(500);
  }
}

export async function getUserDataById(req, res){

  const {id} = req.params;

  const {rows: user} = await userRepository.getUserDataById(id);

  if (user.length === 0) {
      return res.sendStatus(422);
  }

  delete(user[0].params);

  res.send(user[0]);
}

export async function getUsers(req, res){
  try{
    const {like} = req.query;

    const {rows: users} = await userRepository.getUsers(like);
    
    return res.status(200).send(users);
  }
  catch(error)
  {
    return res.status(500).send(error.message);
  }
}

export async function getUserPosts(req, res){
  const { id } = req.params;
  
  try {
    const { user, userPosts } = await userRepository.getUserPosts(id);

    const response = { posts: userPosts.rows, user: user.rows };
    
    res.send(response)
  } catch (error) {
    res.sendStatus(500)
  }
}
