// Test script for Academy Features
// This script demonstrates the key functionality of the academy system

const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
let authToken = '';

// Test data
const testUser = {
  email: 'test@example.com',
  password: 'password123'
};

const testCourse = {
  title: 'JavaScript Fundamentals',
  description: 'Learn the basics of JavaScript programming',
  category: 'Programming'
};

const testQuiz = {
  questions: [
    {
      question: 'What is JavaScript?',
      options: ['A programming language', 'A markup language', 'A styling language', 'A database'],
      correctIndex: 0
    },
    {
      question: 'Which keyword is used to declare a variable in JavaScript?',
      options: ['var', 'let', 'const', 'All of the above'],
      correctIndex: 3
    },
    {
      question: 'What does DOM stand for?',
      options: ['Document Object Model', 'Data Object Model', 'Document Oriented Model', 'Dynamic Object Model'],
      correctIndex: 0
    }
  ]
};

async function testAcademyFeatures() {
  console.log('🚀 Testing Academy System Features\n');

  try {
    // 1. Login to get auth token
    console.log('1. Authenticating user...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, testUser);
    authToken = loginResponse.data.accessToken;
    console.log('✅ Authentication successful\n');

    // 2. Create a course
    console.log('2. Creating a course...');
    const courseResponse = await axios.post(`${BASE_URL}/academy/course`, testCourse, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    const courseId = courseResponse.data._id;
    console.log('✅ Course created:', courseResponse.data.title, '\n');

    // 3. Create a quiz
    console.log('3. Creating a quiz...');
    const quizResponse = await axios.post(`${BASE_URL}/academy/quiz`, testQuiz, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    const quizId = quizResponse.data._id;
    console.log('✅ Quiz created with', testQuiz.questions.length, 'questions\n');

    // 4. Submit quiz answers
    console.log('4. Submitting quiz answers...');
    const quizAnswers = {
      quizId: quizId,
      lessonId: 'lesson_id_placeholder', // You'll need to create a lesson first
      courseId: courseId,
      answers: [
        { questionIndex: 0, selectedAnswer: 0 }, // Correct
        { questionIndex: 1, selectedAnswer: 3 }, // Correct
        { questionIndex: 2, selectedAnswer: 0 }  // Correct
      ]
    };
    
    const quizSubmitResponse = await axios.post(`${BASE_URL}/academy/quiz/submit`, quizAnswers, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Quiz submitted successfully');
    console.log('   Score:', quizSubmitResponse.data.score + '%');
    console.log('   Passed:', quizSubmitResponse.data.passed);
    console.log('   XP Earned:', quizSubmitResponse.data.xpEarned);
    console.log('   Message:', quizSubmitResponse.data.message, '\n');

    // 5. Get user progress
    console.log('5. Getting user progress...');
    const progressResponse = await axios.get(`${BASE_URL}/academy/progress`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Progress retrieved:', progressResponse.data.length, 'progress records\n');

    // 6. Get XP history
    console.log('6. Getting XP history...');
    const xpHistoryResponse = await axios.get(`${BASE_URL}/academy/xp/history`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ XP History retrieved:', xpHistoryResponse.data.length, 'activities\n');

    // 7. Get user stats
    console.log('7. Getting user statistics...');
    const statsResponse = await axios.get(`${BASE_URL}/academy/progress/stats`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ User stats retrieved:');
    console.log('   Current XP:', statsResponse.data.currentXP);
    console.log('   Total XP:', statsResponse.data.totalXP);
    console.log('   Total Activities:', statsResponse.data.totalActivities);
    console.log('   Certificates Earned:', statsResponse.data.certificatesEarned);
    console.log('   Courses Completed:', statsResponse.data.coursesCompleted, '\n');

    // 8. Get XP leaderboard
    console.log('8. Getting XP leaderboard...');
    const leaderboardResponse = await axios.get(`${BASE_URL}/academy/xp/leaderboard?limit=5`);
    console.log('✅ Leaderboard retrieved:');
    leaderboardResponse.data.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.firstName} ${user.lastName} - ${user.xp} XP`);
    });
    console.log();

    // 9. Get recent activity
    console.log('9. Getting recent activity...');
    const activityResponse = await axios.get(`${BASE_URL}/academy/xp/recent-activity?limit=3`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Recent activity retrieved:');
    activityResponse.data.forEach((activity, index) => {
      console.log(`   ${index + 1}. ${activity.description} (+${activity.xpChange} XP)`);
    });
    console.log();

    console.log('🎉 All tests completed successfully!');
    console.log('\n📋 Summary:');
    console.log('- Quiz system is working');
    console.log('- Progress tracking is functional');
    console.log('- XP system is operational');
    console.log('- Leaderboard is accessible');
    console.log('- Activity tracking is working');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
if (require.main === module) {
  testAcademyFeatures();
}

module.exports = { testAcademyFeatures }; 