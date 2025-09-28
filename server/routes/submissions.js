const express = require('express');
const router = express.Router();

// Mock submissions database
const submissions = [];
let nextSubmissionId = 1;

// Mock users for scoring (in a real app, this would be in a database)
const users = [
  { id: 1, username: 'demo', score: 0 }
];

// Submit solution
router.post('/', (req, res) => {
  try {
    const { problemId, code, language, userId } = req.body;
    
    if (!problemId || !code || !language) {
      return res.status(400).json({ message: 'Problem ID, code, and language are required' });
    }
    
    // Simple code execution simulation
    const result = executeCode(problemId, code, language);
    
    const submission = {
      id: nextSubmissionId++,
      userId: userId || 1,
      problemId: parseInt(problemId),
      code,
      language,
      status: result.status,
      score: result.score,
      executionTime: result.executionTime,
      memory: result.memory,
      timestamp: new Date()
    };
    
    submissions.push(submission);
    
    // Update user score if submission passed
    if (result.status === 'Accepted') {
      const user = users.find(u => u.id === (userId || 1));
      if (user) {
        user.score += result.score;
      }
    }
    
    res.json({
      submission,
      result: {
        status: result.status,
        message: result.message,
        testCases: result.testCases
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get submissions for a user
router.get('/user/:userId', (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const userSubmissions = submissions.filter(s => s.userId === userId);
    res.json(userSubmissions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get submissions for a problem
router.get('/problem/:problemId', (req, res) => {
  try {
    const problemId = parseInt(req.params.problemId);
    const problemSubmissions = submissions.filter(s => s.problemId === problemId);
    res.json(problemSubmissions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Mock code execution function
function executeCode(problemId, code, language) {
  // This is a simplified mock execution
  // In a real system, you'd use Docker containers or sandboxed environments
  
  try {
    // Basic validation
    if (!code || code.trim().length === 0) {
      return {
        status: 'Compilation Error',
        message: 'Empty code submission',
        score: 0,
        executionTime: 0,
        memory: 0,
        testCases: []
      };
    }
    
    // Mock successful execution for demo purposes
    const mockResults = [
      {
        status: 'Accepted',
        message: 'All test cases passed',
        score: 100,
        executionTime: Math.floor(Math.random() * 100) + 50,
        memory: Math.floor(Math.random() * 1024) + 512,
        testCases: [
          { input: 'Test case 1', output: 'Expected output', passed: true },
          { input: 'Test case 2', output: 'Expected output', passed: true }
        ]
      },
      {
        status: 'Wrong Answer',
        message: 'Some test cases failed',
        score: 60,
        executionTime: Math.floor(Math.random() * 100) + 50,
        memory: Math.floor(Math.random() * 1024) + 512,
        testCases: [
          { input: 'Test case 1', output: 'Expected output', passed: true },
          { input: 'Test case 2', output: 'Wrong output', passed: false }
        ]
      },
      {
        status: 'Time Limit Exceeded',
        message: 'Code execution timed out',
        score: 0,
        executionTime: 2000,
        memory: Math.floor(Math.random() * 1024) + 512,
        testCases: []
      }
    ];
    
    // Return random result for demo
    return mockResults[Math.floor(Math.random() * mockResults.length)];
    
  } catch (error) {
    return {
      status: 'Runtime Error',
      message: 'Code execution failed',
      score: 0,
      executionTime: 0,
      memory: 0,
      testCases: []
    };
  }
}

module.exports = router;