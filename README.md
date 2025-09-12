#  Social Media API

A full-featured backend API for a social media platform built with Node.js, Express, MongoDB, and Mongoose. It supports user authentication, tweet creation, commenting, replying to comments, liking/unliking, and image uploads via Cloudinary.

---

##  Features

-  User registration and login with JWT authentication
-  Rate limiting to avoid brute force attacks using Express-Rate-Limitter
-  Profile photo upload using Multer and Cloudinary
-  Tweet creation with optional photo attachments
-  Commenting system with nested author population
-  sending messages with optional photo attachments using websockets
-  Like/unlike functionality for tweets
-  Follow/unfollow users
-  Input validation using Joi
-  Secure password hashing with Argon2
-  Modular service/controller architecture

---

##  Tech Stack

| Layer         | Technology                     |
|--------------|---------------------------------|
| Runtime       | Node.js                         |
| Framework     | Express.js                      |
| Database      | MongoDB + Mongoose              |
| Auth          | JWT + Argon2                    |
| Validation    | Joi                             |
| File Uploads  | Multer + Cloudinary             |

---

##  Installation

```bash
git clone https://github.com/your-username Martin-social-media_API.git
cd Martin-social-media_API
npm install

Create a .env file and configure your environment variables:

MONGODB_URI=mongodb://localhost:27017/socialMediaApi
JWT_SECRET=your_jwt_secret
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

### Running the server

npm run start:dev

#### API Endpoints
Auth

POST /api/v1/auth/register — Create a new user
POST /api/v1/auth/login — Authenticate user
GET /api/v1/auth/user - Get authenticated user
POST /api/v1/auth/logout - log out a user
DELETE /api/v1/auth/user/user:Id - only admins and owner of an account can delete that account


Tweets

POST /api/v1/tweets/ - Create a new tweet
GET /api/v1/tweets/ - fetch all tweets
GET /api/v1/tweets/search - search for tweets and users using keywords
GET /api/v1/tweets/:id - fetch a single tweet
DELETE /api/v1/tweets/:id - deletes a single tweet
POST /api/v1/tweets/:tweetId/like - like/unlike a tweet

MESSAGES

POST /api/v1/messages/ - send messages, you can also attach photos
GET /api/v1/messages/:userId - get messages 

Comments

POST /api/v1/comments/:tweetId - adds a comment to tweet
GET /api/v1/comments/:tweetId - get comment by tweet
DELETE /api/v1/comments/:tweetId/:commentId - deletes comment from tweet
POST /api/v1/comments/:commentId/like - like/unlike comment
POST /api/v1/comments/:tweetId/commentId/reply - reply to comment

Authorization Rules
Users can only delete comments and tweets they authored.
A user cannot delete another user's comment and tweet, even if they know the comment or tweet ID.
All comment and tweet actions are securely tied to the authenticated user.


Developer Notes
Comments and tweets are securely tied to the authenticated user via req.user.id
All user passwords are hashed before saving
JWT payload includes profilePhoto and username for frontend use

License
This project is licensed under the MIT License.

Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you’d like to change.