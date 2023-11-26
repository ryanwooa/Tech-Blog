const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");
const bcrypt = require('bcrypt');
const saltRounds = 10;



/**
 * Inserts the given user into the database. Then, reads the ID which the database auto-assigned, and adds it
 * to the user.
 * 
 * @param user the user to insert
 */
async function createUser(user) {
    const db = await dbPromise;

    // hash the password
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);


    const result = await db.run(SQL`
            insert into users (username, realname, password, date_of_birth, gender, country, description,avatar_id) 
            values(${user.username}, ${user.name}, ${hashedPassword}, ${user.date}, ${user.gender}, ${user.country}, ${user.description}, ${user.avatarID})`);
    user.user_id = result.lastID;

}




/**
 * Gets the user with the given id from the database.
 * If there is no such user, undefined will be returned.
 * 
 * @param {number} user_id the id of the user to get.
 */
async function retrieveUserById(user_id) {
    const db = await dbPromise;

    const user = await db.get(SQL`
        select users.*, avatar.file_url as avatar_url from users
        left join avatar on users.avatar_id = avatar.id
        where user_id = ${user_id}`);

    return user;
}


/**
 * Gets the user with the given username and password from the database.
 * If there is no such user, undefined will be returned.
 * 
 * @param {string} username the user's username
 * @param {string} password the user's password
 */
async function retrieveUserWithCredentials(username, password) {
    const db = await dbPromise;

    // Get the hashed password from the database
    const user = await db.get(SQL`
        select users.*, avatar.file_url as avatar_url from users
        left join avatar on users.avatar_id = avatar.id
        where username = ${username}`);

    if (user) {
        // Compare the input password with the stored hashed password
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            // If the password matches, return the user object
            return user;
        } else {
            // If the password doesn't match, return undefined
            return undefined;
        }
    } else {
        return undefined;
    }
}



/**
 * Gets the user with the given authToken from the database.
 * If there is no such user, undefined will be returned.
 * 
 * @param {string} authToken the user's authentication token
 */
async function retrieveUserWithAuthToken(authToken) {
    const db = await dbPromise;

    const user = await db.get(SQL`
    select users.*, avatar.file_url as avatar_url from users
    left join avatar on users.avatar_id = avatar.id
    where authToken = ${authToken}`);

    return user;
}

/**
 * Gets the user with the given username from the database.
 * If there is no such user, undefined will be returned.
 * 
 * @param {string} username the user's username
 */
async function retrieveUserByUsername(username) {
    const db = await dbPromise;

    const user = await db.get(SQL`
        select users.*, avatar.file_url as avatar_url from users
        left join avatar on users.avatar_id = avatar.id
        where username = ${username}`);

    return user;
}

/**
 * Gets an array of all users from the database.
 */
async function retrieveAllUsers() {
    const db = await dbPromise;

    const users = await db.all(SQL`
    select 
    a.*, 
    b.file_url as avatar_url ,
    c.article_cnt
    from users  a
    left join avatar  b
    on a.avatar_id = b.id
    left join (
        select
        user_id,
         count(1) article_cnt
        from articles
        group by user_id
    )c
    on a.user_id = c.user_id
        
        
        `);

    return users;
}

/**
 * Updates the given user in the database, not including auth token
 * 
 * @param user the user to update
 */
async function updateUser(user) {
    const db = await dbPromise;

    await db.run(SQL`
        update users
        set username = ${user.username}, password = ${user.password},
            realname = ${user.realname}, authToken = ${user.authToken}
        where user_id = ${user.user_id}`);
}







/**
 * Deletes the user with the given id from the database.
 * 
 * @param {number} user_id the user's id
 */
async function deleteUser(user_id) {
    const db = await dbPromise;

    // Begin a database transaction
    await db.run('BEGIN TRANSACTION;');

    try {
        // Delete all related data from other tables
        // ... your other delete operations here
        await db.run(SQL`DELETE FROM notification WHERE from_id = ${user_id} OR to_id = ${user_id}`);
        await db.run(SQL`DELETE FROM user_status WHERE user_id = ${user_id}`);
        await db.run(SQL`DELETE FROM subscription WHERE from_id = ${user_id} OR to_id = ${user_id}`);
        await db.run(SQL`DELETE FROM like_article WHERE user_id = ${user_id}`);
        await db.run(SQL`DELETE FROM comments WHERE user_id = ${user_id}`);
        await db.run(SQL`DELETE FROM image WHERE article_id IN (SELECT id FROM articles WHERE user_id = ${user_id})`);
        await db.run(SQL`DELETE FROM articles WHERE user_id = ${user_id}`);
        await db.run(SQL`DELETE FROM users WHERE user_id = ${user_id}`);


        await db.run(SQL`DELETE FROM users WHERE user_id = ${user_id}`);
        await db.run('COMMIT;');

    } catch (error) {
        await db.run('ROLLBACK;');
        throw error;
    }
}
/**
 * Updates the given user's details in the database.
 * 
 * @param user the user to update
 */

async function updateUserDetails(user) {
    const db = await dbPromise;

    // Hash the new password if it is provided
    if (user.password) {
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);
        user.password = hashedPassword;
    } else {
        user.password = null;
    }

    const sql = SQL`
        UPDATE users SET 
            username = ${user.username}, 
            realname = ${user.realname}, 
            password = COALESCE(${user.password}, (SELECT password FROM users WHERE user_id = ${user.user_id})), 
            date_of_birth = ${user.date_of_birth}, 
            gender = ${user.gender}, 
            country = ${user.country}, 
            description = ${user.description}, 
            avatar_id = COALESCE(${user.avatar}, (SELECT avatar_id FROM users WHERE user_id = ${user.user_id})) 
        WHERE user_id = ${user.user_id}`;

    const result = await db.run(sql);
    console.log(result.changes); // Prints the number of rows affected
}


// Export functions.
module.exports = {
    createUser,
    retrieveUserById,
    retrieveUserWithCredentials,
    retrieveUserWithAuthToken,
    retrieveUserByUsername,
    retrieveAllUsers,
    deleteUser,
    updateUserDetails,
    updateUser

};



