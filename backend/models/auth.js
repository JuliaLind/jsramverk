/**
 * @module auth
 * @description Auth module containing methods for registering
 * new user in database + authorization and generating new
 * token
 */
const database = require("../db/database.js");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;



const auth = {
    register: function register(res, body) {
        const saltRounds = 10;
        const email = body.email;
        const password = body.password;
        const name = body.name;

        if (!email || !password) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/register",
                    title: "Email or password missing",
                    detail: "Email or password missing in request"
                }
            });
        }
        bcrypt.hash(password, saltRounds, async function(err, hash) {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/register",
                        title: "bcrypt error",
                        detail: "bcrypt error"
                    }
                });
            }

            try {
                const db = await database.getDb();
                const doc = {
                    name: name,
                    email: email,
                    hash: hash,
                };

                await db.collection.users.insertOne(doc);
                await db.client.close();
                return res.status(201).json({
                    data: {
                        message: `User ${email} successfully registered.`
                    }
                });
            } catch (e) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/register",
                        title: "Database error",
                        detail: e.message
                    }
                });
            }
        });
    },

    login: async function login(res, body) {
        const email = body.email;
        const password = body.password;

        if (!email || !password) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/login",
                    title: "Email or password missing",
                    detail: "Email or password missing in request"
                }
            });
        }
        try {
            const db = await database.getDb();
            const filter = { email: email };
            const user = await db.collection.users.findOne(filter);

            console.log(user);

            await db.client.close();
            if (user) {
                return auth.comparePasswords(
                    res,
                    password,
                    user,
                );
            } else {
                return res.status(401).json({
                    errors: {
                        status: 401,
                        source: "/login",
                        title: "User not found",
                        detail: "User with provided email not found."
                    }
                });
            }
        } catch (e) {
            return res.status(500).json({
                errors: {
                    status: 500,
                    source: "/login",
                    title: "Database error",
                    detail: e.message
                }
            });
        }
    },
    comparePasswords: function(res, password, user) {
        bcrypt.compare(password, user.hash, (err, result) => {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/login",
                        title: "bcrypt error",
                        detail: "bcrypt error"
                    }
                });
            }

            if (result) {
                const payload = {
                    email: user.email,
                    name: user.name
                };
                const jwtToken = jwt.sign(payload, jwtSecret, { expiresIn: '24h' });

                return res.json({
                    data: {
                        type: "success",
                        message: "User logged in",
                        user: payload,
                        token: jwtToken
                    }
                });
            }

            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/login",
                    title: "Wrong password",
                    detail: "Password is incorrect."
                }
            });
        });
    },
    // this one is used in GraphQL
    checkGQToken: function(context) {
        const token = context.headers['x-access-token'];

        if (token) {
            try {
                jwt.verify(token, jwtSecret);
            } catch (err) {
                throw new Error(`Failed authentication: ${err.message}`);
            }
        } else {
            throw new Error('Token not provided');
        }
    },
    // this one is used in the ticket routes,
    // so can be removed when we remove the routes
    // and corresponding tests
    checkToken: function(req, res, next) {
        let token = req.headers['x-access-token'];

        if (token) {
            jwt.verify(token, jwtSecret, function(err, decoded) {
                if (err) {
                    return res.status(500).json({
                        errors: {
                            status: 500,
                            source: "/login",
                            title: "Failed authentication",
                            detail: err.message
                        }
                    });
                }

                req.user = {};
                req.user.email = decoded.email;

                return next();
            });
        } else {
            return res.status(401).json({
                errors: {
                    status: 401,
                    // source: req.path,
                    source: req.originalUrl,
                    title: "No token",
                    detail: "No token provided in request headers"
                }
            });
        }
    }
};

module.exports = auth;
