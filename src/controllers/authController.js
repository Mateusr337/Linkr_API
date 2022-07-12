import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import connection from '../db.js';
import { authRepository } from '../repositories/authRepository.js';

export async function login(req, res) {
	const { email, password } = req.body;

	const { rows: user } = await connection.query('SELECT * FROM users WHERE email=$1', [
		email,
	]);

	if (user.length === 0) {
		return res.sendStatus(401);
	}

	if (!bcrypt.compareSync(password, user[0].password)) {
		return res.sendStatus(401);
	}

	const token = uuid();
	await authRepository.createSession(token, user[0].id);

	return res.send({ token: token, id: user[0].id });
}
