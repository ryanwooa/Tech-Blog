# PGCert IT Final Project: Personal Blogging System

## Introduction
The members of Group 2 Final Project include:
- Ryan Wu
- Xinran Wang
- Chaohao Huang
- Derek Liu
- Sharon Selvin

We created a thorough mechanism for individual blogging. This project has been carefully planned and created to offer blogging enthusiasts a reliable and approachable platform. Numerous features are available, such as user account administration, blog creation and management, comment capabilities, notifications, and an analytics dashboard.

## Functionality User Accounts

Users can open new accounts on the system, each with a different username and password. The system keeps track of the user's real name, date of birth, and a brief biographical statement in addition to these fundamental facts. Usernames and other account details are always editable by users. In addition, they have the choice to cancel their account, which also deletes all of their articles and comments from the database.

## Blogging
Users have control over the creation, editing, and deletion of their own blog posts. They have total control over their content thanks to this, and they may openly express their beliefs. While reading articles, users can choose to show or hide comments.

## Comments
The technology gives users a forum to interact with one another through comments. Users have the option to post comments on articles and reply to others' comments, which promotes community and discussion.

## Notifications 
Users receive notifications for a variety of platform actions. These events include the creation of a new article, the posting or replying to a remark, and the beginning of a new user's following. The navigation bar's notification badges provide users with up-to-the-minute information.

## Dashboard for Analytics
The analytics dashboard is a useful tool for authors to track the readership of their articles and other engagement-related information. The top three most popular posts, key performance indicators, and a histogram graphic displaying the average number of comments per day over time are all displayed.


---

# Before you start
## Initialize Database
1. Start the server
```
npm i
npm start
```
2. Then the database will be initialized. Use sql script in ```/sql/project-database-init-script.sql``` to setup the database.

## Default settings 
We have 2 default accounts.

## user1 (admin user)
```
username: user1

password: password1
```

## user2
```
username: user2

password: password2
```

You can log in and check their information. The user1 account has an extra link in the right nav bar which called "All users", when you click this link, you can view all user’s information including their usernames, real names, countries, avatars and descriptions. Also, user1 has the delete other users’ articles, comments even account function. When user1 delete other user’s account, it will automatically delete their notifications, comments, likes and articles. Finally, you can log in the default account to start exploring our blog website.

