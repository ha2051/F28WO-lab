const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mysql = require('mysql');
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

exports.register = (req, res) => {
    console.log(req.body);

    const { name, email, password, passwordConfirm } = req.body;

    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, result) => {
        if (error) {
            console.log(error);
        }

        if (result.length > 0) {
            return res.render('register', {
                message: 'This email is already taken..'
            });
        } else if (password !== passwordConfirm) {
            return res.render('register', {
                message: 'Passwords do not match'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        db.query('INSERT INTO users SET ?', { name: name, email: email, password: hashedPassword }, (error, result) => {
            if (error) {
                console.log(error);
            } else {
                console.log(result);
                return res.render('register', {
                    message: 'User Registered!'
                });
            }
        });
    });
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).render('login', {
            message: 'Please provide an Email and Password'
        });
    }

    db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
        console.log(results);
        if (!results || !(await bcrypt.compare(password, results[0].password))) {
            if (req.headers.accept && req.headers.accept.includes('application/json')) {
                return res.status(401).json({ message: 'Email or Password is incorrect' });
            } else {
                return res.status(401).render('login', {
                    message: 'Email or Password is incorrect'
                });
            }
        } else {
            const id = results[0].id;

            const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN
            });

            console.log(" The token is:" + token);

            const cookieOptions = {
                expires: new Date(
                    Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                ),
                httpOnly: true
            };

            res.cookie('jwt', token, cookieOptions);

            if (req.headers.accept && req.headers.accept.includes('application/json')) {
               
                return res.status(200).json({ message: 'Login successful', user: results[0] });
            } else {
               
                return res.status(200).redirect("/profile");
            }
        }
    });
};



exports.logout = async (req, res) => {
    res.cookie('jwt', 'logout', {
        expires: new Date(Date.now() + 2 * 1000),
        httpOnly: true
    });

    res.status(200).redirect("/");
};


exports.getProfile = (req, res) => {
    db.query('SELECT * FROM users WHERE id = ?', [req.user.id], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: 'Something went wrong' });
        }

        if (!results || results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = results[0];

      
        if (req.headers.accept && req.headers.accept.includes('application/json')) {
            return res.status(200).json({ user });
        }


        res.render('profile', { user });
    });
};


