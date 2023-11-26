const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");



async function retrieveAllTestData() {
    const db = await dbPromise;

    const allTestData = await db.all(SQL`select * from user_account`);

    return allTestData;
}


// Export functions.
module.exports = {
   
    retrieveAllTestData
   
};
