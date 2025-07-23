# Academy System Features

This document outlines the comprehensive academy system features including quiz functionality, progress tracking, certificate generation, and XP history.

## 🎯 Core Features

### 1. Quiz System
Users can take quizzes associated with lessons and earn XP based on performance.

#### Quiz Attempt Endpoints
- `POST /academy/quiz/submit` - Submit quiz answers and get results
- `GET /academy/quiz/attempts` - Get user's quiz attempt history
- `GET /academy/quiz/attempt/:id` - Get specific quiz attempt details

#### Quiz Scoring System
- **Passing Score**: 70% minimum to pass
- **XP Rewards**:
  - Failed attempt: 5 XP (participation)
  - Passed attempt: 50 XP base
  - High score bonus (80%+): +20 XP
  - Perfect score bonus (90%+): +30 XP
  - Long quiz bonus (10+ questions): +10 XP

### 2. Progress Tracking
Track user progress across courses, lessons, and individual activities.

#### Progress Endpoints
- `GET /academy/progress` - Get user's overall progress
- `GET /academy/progress/course/:courseId` - Get progress for specific course
- `GET /academy/progress/courses` - Get progress for all courses
- `GET /academy/progress/stats` - Get user statistics

#### Progress Features
- Track completion status for each lesson
- Record attempts and best scores
- Calculate course completion percentage
- Track XP earned per lesson/course

### 3. Certificate Generation
Automatic certificate generation when users complete courses.

#### Certificate Endpoints
- `GET /academy/certificates/earned` - Get user's earned certificates
- `GET /academy/certificates/:id` - Get specific certificate details
- `GET /academy/certificates/:id/pdf` - Generate PDF certificate
- `GET /academy/certificates/verify/:certificateNumber` - Verify certificate validity
- `GET /academy/certificates/stats` - Get certificate statistics
- `GET /academy/certificates/recent` - Get recent certificates (public)

#### Certificate Features
- Automatic generation upon course completion
- Unique certificate numbers
- XP rewards for earning certificates
- Certificate verification system
- PDF generation capability (placeholder)

### 4. XP History & Gamification
Comprehensive XP tracking and gamification system.

#### XP Endpoints
- `GET /academy/xp/history` - Get user's XP history
- `GET /academy/xp/stats` - Get user's XP statistics
- `GET /academy/xp/leaderboard` - Get XP leaderboard
- `GET /academy/xp/activity-stats` - Get activity type statistics
- `GET /academy/xp/recent-activity` - Get recent XP activities

#### XP System Features
- Track all XP changes with timestamps
- Activity type categorization
- Leaderboard functionality
- Activity statistics and analytics
- Recent activity feed

## 📊 Data Models

### UserProgress Entity
```typescript
{
  userId: ObjectId,
  courseId: ObjectId,
  lessonId: ObjectId,
  isCompleted: boolean,
  score: number,
  xpEarned: number,
  attempts: number,
  completedAt?: Date
}
```

### QuizAttempt Entity
```typescript
{
  userId: ObjectId,
  quizId: ObjectId,
  lessonId: ObjectId,
  courseId: ObjectId,
  answers: Array<{
    questionIndex: number,
    selectedAnswer: number,
    isCorrect: boolean
  }>,
  score: number,
  totalQuestions: number,
  correctAnswers: number,
  passed: boolean,
  xpEarned: number,
  passingScore: number
}
```

### XPHistory Entity
```typescript
{
  userId: ObjectId,
  xpChange: number,
  previousXP: number,
  newXP: number,
  activityType: XPActivityType,
  description: string,
  relatedEntityId?: ObjectId,
  relatedEntityType?: string
}
```

### UserCertificate Entity
```typescript
{
  userId: ObjectId,
  certificateId: ObjectId,
  courseId: ObjectId,
  certificateNumber: string,
  issuedAt: Date,
  xpEarned: number,
  finalScore: number
}
```

## 🎮 XP Activity Types

- `QUIZ_COMPLETION` - Completing a quiz
- `LESSON_COMPLETION` - Completing a lesson
- `COURSE_COMPLETION` - Completing a course
- `CERTIFICATE_EARNED` - Earning a certificate
- `BONUS` - Bonus XP awards
- `PENALTY` - XP penalties

## 🔐 Authentication

All user-specific endpoints require authentication using the `AuthenticationGuard`. Public endpoints include:
- Certificate verification
- Recent certificates
- XP leaderboard

## 📈 Dashboard Integration

The system provides comprehensive data for dashboard displays:

### User Dashboard Data
- Current XP and total XP earned
- Course completion progress
- Recent activities
- Certificate count and statistics
- Quiz performance metrics

### Analytics Data
- XP earning trends
- Activity type distribution
- Course completion rates
- Certificate earning patterns
- Leaderboard rankings

## 🚀 Usage Examples

### Taking a Quiz
```bash
POST /academy/quiz/submit
{
  "quizId": "quiz_id",
  "lessonId": "lesson_id", 
  "courseId": "course_id",
  "answers": [
    {
      "questionIndex": 0,
      "selectedAnswer": 2
    },
    {
      "questionIndex": 1,
      "selectedAnswer": 0
    }
  ]
}
```

### Getting Progress
```bash
GET /academy/progress/course/course_id
```

### Getting XP History
```bash
GET /academy/xp/history?limit=20&offset=0
```

## 🔧 Configuration

### XP Rewards Configuration
The system uses configurable XP rewards:
- Quiz completion: 50 XP base
- Course completion: 100 XP
- Certificate earning: 200 XP base
- High score bonuses: +20-30 XP
- Perfect score bonuses: +30-100 XP

### Passing Score Configuration
- Quiz passing score: 70% (configurable)
- Certificate minimum score: Based on course average

## 📝 Future Enhancements

1. **PDF Generation**: Integrate with PDF generation service
2. **Email Notifications**: Send certificates via email
3. **Achievement System**: Add badges and achievements
4. **Social Features**: Share certificates on social media
5. **Advanced Analytics**: Detailed learning analytics
6. **Mobile App**: Native mobile application
7. **Offline Support**: Offline quiz taking capability 