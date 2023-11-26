DROP TABLE IF EXISTS notification;
DROP TABLE IF EXISTS user_status;
DROP TABLE IF EXISTS subscription;
DROP TABLE IF EXISTS like_article;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS image;
DROP TABLE IF EXISTS articles;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS avatar;

CREATE TABLE avatar (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    file_url TEXT
);

CREATE TABLE users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username varchar(64) UNIQUE NOT NULL,
    realname TEXT,
    password varchar (64)  NOT NULL,
    date_of_birth TEXT,
    gender TEXT,
    country TEXT,
    description TEXT,
    avatar_id INTEGER,
    authToken varchar(128),
    is_admin INTEGER DEFAULT 0,
    FOREIGN KEY (avatar_id) REFERENCES avatar(id)
);

CREATE TABLE articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    title TEXT,
    datetime TEXT,
    content TEXT,
    cover_url TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE image (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT,
    article_id INTEGER,
    FOREIGN KEY (article_id) REFERENCES articles(id)
);

CREATE TABLE comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    content TEXT,
    parent_id INTEGER,
    article_id INTEGER,
    datetime TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (article_id) REFERENCES articles(id)
);

CREATE TABLE like_article (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    article_id INTEGER,
    user_id INTEGER,
    datetime TEXT,
    FOREIGN KEY (article_id) REFERENCES articles(id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE subscription (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    from_id INTEGER,
    to_id INTEGER,
    datetime TEXT,
    FOREIGN KEY (from_id) REFERENCES users(user_id),
    FOREIGN KEY (to_id) REFERENCES users(user_id)
);

CREATE TABLE user_status (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    logout_time TEXT,
    total_follower INTEGER,
    new_follower INTEGER,
    total_like INTEGER,
    new_like INTEGER,
    total_comment INTEGER,
    new_comment INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE notification (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    from_id INTEGER,
    to_id INTEGER,
    article_id INTEGER,
    is_like INTEGER,
    is_subscribe INTEGER,
    is_comment INTEGER,
    is_article INTEGER,
    datetime TEXT,
    is_read INTEGER,

    FOREIGN KEY (from_id) REFERENCES users(user_id)
    FOREIGN KEY (to_id) REFERENCES users(user_id)
    FOREIGN KEY (article_id) REFERENCES articles(id)

);


/* Insert test data */
INSERT INTO avatar (file_url) VALUES
('http://localhost:3000/images/avatar/avatar1.jpeg'),
('http://localhost:3000/images/avatar/avatar2.jpeg'),
("http://localhost:3000/images/avatar/avatar3.jpeg"),
("http://localhost:3000/images/avatar/avatar4.jpeg"),
("http://localhost:3000/images/avatar/avatar5.jpeg"),
("http://localhost:3000/images/avatar/avatar6.jpeg"),
("http://localhost:3000/images/avatar/avatar7.jpeg"),
("http://localhost:3000/images/avatar/avatar8.jpeg"),
("http://localhost:3000/images/avatar/avatar9.jpeg"),
("http://localhost:3000/images/avatar/avatar10.jpeg"),
("http://localhost:3000/images/avatar/avatar11.jpeg"),
("http://localhost:3000/images/avatar/avatar12.jpeg"),
("http://localhost:3000/images/avatar/avatar13.jpeg"),
("http://localhost:3000/images/avatar/avatar14.jpeg"),
("http://localhost:3000/images/avatar/avatar15.jpeg");



INSERT INTO users (username, realname, password, date_of_birth, gender, country, description, avatar_id, is_admin) VALUES
('user1', 'User One', '$2b$10$.Y30q1PacjzW9dcvKB64w.4mmiZ5SDHMN3U7JSbjO5Jl5699wrou2', '1990-01-01', 'male', 'Country1', 'Description1',1,1),
('user2', 'User Two', '$2b$10$C5G6vQ/qY38eGIbQuTcYUu8K2MduAvZGg0zHb/O3CVUQeIRqlZB6i', '1992-02-02', 'female', 'Country2', 'Description2',4,0),
('user3', 'User Three', '$2b$10$YRCYYETeyUr7ETxJI21.0eEA0CNr9Y2A5V5QjEFgSmjXDDG9tuz0K', '2023-01-01', 'female', 'Country1', 'Description3',5,0),
('user4', 'User Four', '$2b$10$GVw6PmP31zzrZhNf9g0b3e223h4m1WotV8xO0W93hNN/VVJ11rd..', '2022-09-01', 'male', 'Country1', 'Description4',8,0);



-- INSERT INTO users (username, realname, password, date_of_birth, gender, country, description, avatar_id) VALUES
-- ('user1', 'Real Name 1', 'password1', '1980-01-01', 'M', 'Country 1', 'Description 1', 1),
-- ('user2', 'Real Name 2', 'password2', '1985-01-01', 'F', 'Country 2', 'Description 2', 2);

-- Insert articles
INSERT INTO articles (user_id, title, datetime, content,cover_url) VALUES
(1, 'Article 1 by User 1', '2023-05-10 08:00:00', 'Content 1','http://localhost:3000/images/cover/cover1.jpg'),
(2, 'Article 2 by User 2', '2023-05-10 09:00:00', 'Content 2','http://localhost:3000/images/cover/cover2.jpg'),
(1, 'Article 3 by User 1', '2023-05-11 08:00:00', 'Content 3','http://localhost:3000/images/cover/cover3.jpg'),
(2, 'Article 4 by User 2', '2023-05-11 09:00:00', 'Content 4','http://localhost:3000/images/cover/cover6.jpg'),
(1, 'Article 5 by User 1', '2023-05-12 08:00:00', 'Content 5','http://localhost:3000/images/cover/cover3.jpg'),
(2, 'Article 6 by User 2', '2023-05-12 09:00:00', 'Content 6','http://localhost:3000/images/cover/cover2.jpg'),
(1, 'Article 7 by User 1', '2023-05-13 08:00:00', 'Content 7','http://localhost:3000/images/cover/cover4.jpg'),
(2, 'Article 8 by User 2', '2023-05-13 09:00:00', 'Content 8','http://localhost:3000/images/cover/cover8.jpg'),
(1, 'Article 9 by User 1', '2023-05-14 08:00:00', 'Content 9','http://localhost:3000/images/cover/cover7.jpg'),
(2, 'Article 10 by User 2', '2023-05-14 09:00:00', 'Content 10','http://localhost:3000/images/cover/cover5.jpg');


INSERT INTO image (url, article_id) VALUES
('http://example.com/image1.jpg', 1),
('http://example.com/image2.jpg', 2);

-- Insert comments
INSERT INTO comments (user_id, content, parent_id, article_id, datetime) VALUES
(1, 'Comment 1 on Article 1', NULL, 1, '2023-05-20 09:00:00'),
(2, 'Comment 2 on Article 1', NULL, 1, '2023-05-20 09:30:00'),
(1, 'Comment 3 on Article 1', NULL, 1, '2023-05-20 10:00:00'),
(2, 'Comment 4 on Article 1', NULL, 1, '2023-05-20 10:30:00'),

(1, 'Comment 1 on Article 2', NULL, 1, '2023-05-21 10:00:00'),
(2, 'Comment 2 on Article 2', NULL, 1, '2023-05-21 10:30:00'),
(1, 'Comment 3 on Article 2', NULL, 1, '2023-05-22 11:00:00'),
(2, 'Comment 4 on Article 2', NULL, 1, '2023-05-22 11:30:00'),

(1, 'Comment 1 on Article 3', NULL, 3, '2023-05-22 09:00:00'),
(2, 'Comment 2 on Article 3', NULL, 3, '2023-05-23 09:30:00'),
(1, 'Comment 3 on Article 3', NULL, 3, '2023-05-24 10:00:00'),
(2, 'Comment 4 on Article 3', NULL, 3, '2023-05-24 10:30:00'),

(1, 'Comment 1 on Article 3', NULL, 3, '2023-05-31 09:00:00'),
(2, 'Comment 2 on Article 3', NULL, 3, '2023-05-31 09:30:00'),
(1, 'Comment 3 on Article 3', NULL, 3, '2023-05-31 10:00:00'),
(2, 'Comment 4 on Article 3', NULL, 3, '2023-05-31 10:30:00'),

(1, 'Comment 1 on Article 9', NULL, 9, '2023-05-24 09:00:00'),
(2, 'Comment 2 on Article 9', NULL, 9, '2023-05-24 09:30:00'),
(1, 'Comment 3 on Article 9', NULL, 9, '2023-05-25 10:00:00'),
(2, 'Comment 4 on Article 9', NULL, 9, '2023-05-25 10:30:00'),

(1, 'Comment 1 on Article 10', NULL, 5, '2023-05-26 10:00:00'),
(2, 'Comment 2 on Article 10', NULL, 5, '2023-05-27 10:30:00'),
(1, 'Comment 3 on Article 10', NULL, 5, '2023-05-27 11:00:00'),
(2, 'Comment 4 on Article 10', NULL, 5, '2023-05-27 11:30:00'),

(2, 'Comment 4 on Article 10', NULL, 5, '2023-06-01 11:30:00'),
(1, 'Comment 4 on Article 10', NULL, 5, '2023-06-01 01:30:00'),
(2, 'Comment 4 on Article 10', NULL, 5, '2023-06-01 11:20:00'),
(2, 'Comment 4 on Article 10', NULL, 5, '2023-06-01 11:30:00'),


(1, 'Comment 1 on Article 10', NULL, 5, '2023-05-28 10:00:00'),
(2, 'Comment 2 on Article 10', NULL, 5, '2023-05-28 10:30:00'),
(1, 'Comment 3 on Article 10', NULL, 5, '2023-05-29 11:00:00'),
(2, 'Comment 4 on Article 10', NULL, 5, '2023-05-30 11:30:00'),

(1, 'Comment 1 on Article 1', NULL, 2, '2023-05-20 09:00:00'),
(2, 'Comment 2 on Article 1', NULL, 2, '2023-05-20 09:30:00'),
(1, 'Comment 3 on Article 1', NULL, 2, '2023-05-20 10:00:00'),
(2, 'Comment 4 on Article 1', NULL, 2, '2023-05-20 10:30:00'),

(1, 'Comment 1 on Article 2', NULL, 4, '2023-05-21 10:00:00'),
(2, 'Comment 2 on Article 2', NULL, 4, '2023-05-21 10:30:00'),
(1, 'Comment 3 on Article 2', NULL, 4, '2023-05-22 11:00:00'),
(2, 'Comment 4 on Article 2', NULL, 4, '2023-05-22 11:30:00'),

(1, 'Comment 1 on Article 3', NULL, 6, '2023-05-22 09:00:00'),
(2, 'Comment 2 on Article 3', NULL, 6, '2023-05-23 09:30:00'),
(1, 'Comment 3 on Article 3', NULL, 6, '2023-05-24 10:00:00'),
(2, 'Comment 4 on Article 3', NULL, 6, '2023-05-24 10:30:00'),

(1, 'Comment 1 on Article 3', NULL, 8, '2023-05-31 09:00:00'),
(2, 'Comment 2 on Article 3', NULL, 8, '2023-05-31 09:30:00'),
(1, 'Comment 3 on Article 3', NULL, 8, '2023-05-31 10:00:00'),
(2, 'Comment 4 on Article 3', NULL, 8, '2023-05-31 10:30:00'),

(1, 'Comment 1 on Article 9', NULL, 10, '2023-05-24 09:00:00'),
(2, 'Comment 2 on Article 9', NULL, 10, '2023-05-24 09:30:00'),
(1, 'Comment 3 on Article 9', NULL, 10, '2023-05-25 10:00:00'),
(2, 'Comment 4 on Article 9', NULL, 10, '2023-05-25 10:30:00'),

(1, 'Comment 1 on Article 10', NULL, 2, '2023-05-26 10:00:00'),
(2, 'Comment 2 on Article 10', NULL, 4, '2023-05-27 10:30:00'),
(1, 'Comment 3 on Article 10', NULL, 4, '2023-05-27 11:00:00'),
(2, 'Comment 4 on Article 10', NULL, 6, '2023-05-27 11:30:00'),

(2, 'Comment 4 on Article 10', NULL, 8, '2023-06-01 11:30:00'),
(1, 'Comment 4 on Article 10', NULL, 8, '2023-06-01 01:30:00'),
(2, 'Comment 4 on Article 10', NULL, 8, '2023-06-01 11:20:00'),
(2, 'Comment 4 on Article 10', NULL, 4, '2023-06-01 11:30:00'),


(1, 'Comment 1 on Article 10', NULL, 8, '2023-05-28 10:00:00'),
(2, 'Comment 2 on Article 10', NULL, 10, '2023-05-28 10:30:00'),
(1, 'Comment 3 on Article 10', NULL, 10, '2023-05-29 11:00:00'),
(2, 'Comment 4 on Article 10', NULL, 2, '2023-05-30 11:30:00');

-- Insert like_article
INSERT INTO like_article (article_id, user_id, datetime) VALUES
(1, 1, '2023-05-10 09:30:00'),
(1, 2, '2023-05-10 10:00:00'),

(2, 1, '2023-05-10 10:30:00'),
(2, 2, '2023-05-10 11:00:00'),

(3, 1, '2023-05-11 09:30:00'),
(3, 2, '2023-05-11 10:00:00'),

(4, 1, '2023-05-11 10:30:00'),
(4, 2, '2023-05-11 11:00:00'),

-- ... Continue this pattern for each article and day
(9, 1, '2023-05-14 09:30:00'),
(9, 2, '2023-05-14 10:00:00'),

(10, 1, '2023-05-14 10:30:00'),
(10, 2, '2023-05-14 11:00:00');

-- ... Continue this pattern for each day until 2023-05-19



INSERT INTO subscription (from_id, to_id, datetime) VALUES
(1, 2, datetime("now","localtime")),
(2, 1, datetime("now","localtime"));

INSERT INTO user_status (user_id, logout_time, total_follower, new_follower, total_like, new_like, total_comment, new_comment) VALUES
(1, datetime("now","localtime"), 10, 2, 50, 5, 20, 2),
(2, datetime("now","localtime"), 15, 3, 60, 6, 30, 3);

INSERT INTO notification (from_id, to_id, article_id,  is_like, is_subscribe, is_comment, is_article, datetime, is_read)
VALUES 
(1, 2, 3, 1, null, null,null, datetime("now","localtime"), 0),
(2, 1, 1, null, null, 1, null, datetime("now","localtime"),0),
(1, 2, null, null, 1, null, null, datetime("now","localtime"),0),
(1, 2, 1, null, null, null, 1, datetime("now","localtime"),0),
(2, 1, 6,  1, null, null, null, datetime("now","localtime"),1);
