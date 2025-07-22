<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ pnpm install
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).

# Small Bytes Academy API

A NestJS-based academy management system with streamlined course creation.

## New Streamlined Course Creation Flow

### Before (Complex Flow)
The old approach required multiple API calls:
1. Create certificate
2. Create course
3. Create lessons
4. Create quizzes
5. Link certificate to course
6. Link lessons to course
7. Link quizzes to lessons

### After (Streamlined Flow)
Now you can create a complete course with one API call:

```bash
POST /academy/course/complete
```

**Example Request Body:**
```json
{
  "title": "JavaScript Fundamentals",
  "description": "Learn the basics of JavaScript programming",
  "category": "Programming",
  "certificate": {
    "title": "JavaScript Fundamentals Certificate",
    "description": "Certificate for completing JavaScript Fundamentals course",
    "issuedBy": "Small Bytes Academy"
  },
  "lessons": [
    {
      "title": "Introduction to JavaScript",
      "content": "JavaScript is a programming language...",
      "xpReward": 100,
      "quiz": {
        "questions": [
          {
            "question": "What is JavaScript?",
            "options": [
              "A programming language",
              "A markup language",
              "A styling language",
              "A database"
            ],
            "correctIndex": 0
          }
        ]
      }
    },
    {
      "title": "Variables and Data Types",
      "content": "Variables are containers for storing data...",
      "xpReward": 150,
      "quiz": {
        "questions": [
          {
            "question": "How do you declare a variable in JavaScript?",
            "options": [
              "var x = 5",
              "let x = 5",
              "const x = 5",
              "All of the above"
            ],
            "correctIndex": 3
          }
        ]
      }
    }
  ]
}
```

### Benefits of the New Approach

1. **Single API Call**: Create entire course structure in one request
2. **Automatic Linking**: All relationships are created automatically
3. **Better UX**: Admins can focus on content rather than technical linking
4. **Reduced Errors**: No risk of forgetting to link entities
5. **Atomic Operations**: Either everything succeeds or everything fails
6. **Complete Data**: All course endpoints now return fully populated data including lessons, quizzes, and certificates

### Still Available: Individual Operations

The original individual creation endpoints are still available for:
- Creating standalone certificates: `POST /academy/create-certificate`
- Creating standalone courses: `POST /academy/course`
- Creating standalone lessons: `POST /academy/lesson`
- Creating standalone quizzes: `POST /academy/quiz`

## API Endpoints

### Course Management
- `GET /academy/course` - Get all courses (with populated lessons, quizzes, and certificates)
- `GET /academy/course/:id` - Get course by ID (with populated lessons, quizzes, and certificates)
- `POST /academy/course` - Create course (individual)
- `POST /academy/course/complete` - Create complete course with all components
- `PATCH /academy/course/:id` - Update course
- `DELETE /academy/course/:id` - Delete course

### Response Structure
All course endpoints now return complete data with nested relationships:

```json
{
  "_id": "course_id",
  "title": "JavaScript Fundamentals",
  "description": "Learn the basics of JavaScript programming",
  "category": "Programming",
  "certificate": {
    "_id": "certificate_id",
    "title": "JavaScript Fundamentals Certificate",
    "description": "Certificate for completing JavaScript Fundamentals course",
    "issuedBy": "Small Bytes Academy"
  },
  "lessons": [
    {
      "_id": "lesson_id",
      "title": "Introduction to JavaScript",
      "content": "JavaScript is a programming language...",
      "xpReward": 100,
      "quizId": {
        "_id": "quiz_id",
        "questions": [
          {
            "question": "What is JavaScript?",
            "options": ["A programming language", "A markup language", "A styling language", "A database"],
            "correctIndex": 0
          }
        ]
      }
    }
  ]
}
```

### Certificate Management
- `GET /academy/certificate` - Get all certificates
- `GET /academy/certificate/:id` - Get certificate by ID
- `POST /academy/create-certificate` - Create certificate
- `PATCH /academy/update-certificate/:id` - Update certificate
- `DELETE /academy/certificate/:id` - Delete certificate

### Lesson Management
- `GET /academy/lesson` - Get all lessons
- `GET /academy/lesson/:id` - Get lesson by ID
- `POST /academy/lesson` - Create lesson
- `PATCH /academy/lesson/:id` - Update lesson
- `DELETE /academy/quiz/:id` - Delete lesson

### Quiz Management
- `GET /academy/quiz/:id` - Get quiz by ID
- `POST /academy/quiz` - Create quiz
- `PATCH /academy/quiz/:id` - Update quiz

### Relationship Management
- `POST /academy/set-course-certificate` - Link certificate to course
- `POST /academy/add-lesson-to-course` - Add lesson to course
- `POST /academy/remove-lesson-from-course` - Remove lesson from course
- `POST /academy/add-quiz-to-lesson` - Add quiz to lesson
- `POST /academy/remove-quiz-from-lesson` - Remove quiz from lesson

## Getting Started

1. Install dependencies:
```bash
pnpm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Run the application:
```bash
pnpm run start:dev
```

The API will be available at `http://localhost:3000`
