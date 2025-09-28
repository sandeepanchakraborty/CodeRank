const express = require('express');
const router = express.Router();

// Mock problems database
const problems = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      }
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9"
    ],
    testCases: [
      { input: { nums: [2, 7, 11, 15], target: 9 }, expectedOutput: [0, 1] },
      { input: { nums: [3, 2, 4], target: 6 }, expectedOutput: [1, 2] }
    ]
  },
  {
    id: 2,
    title: "Reverse String",
    difficulty: "Easy",
    description: "Write a function that reverses a string. The input string is given as an array of characters s.",
    examples: [
      {
        input: 's = ["h","e","l","l","o"]',
        output: '["o","l","l","e","h"]',
        explanation: "Reverse the array of characters."
      }
    ],
    constraints: [
      "1 <= s.length <= 10^5",
      "s[i] is a printable ascii character."
    ],
    testCases: [
      { input: { s: ["h", "e", "l", "l", "o"] }, expectedOutput: ["o", "l", "l", "e", "h"] }
    ]
  },
  {
    id: 3,
    title: "Palindrome Number",
    difficulty: "Easy",
    description: "Given an integer x, return true if x is a palindrome, and false otherwise.",
    examples: [
      {
        input: "x = 121",
        output: "true",
        explanation: "121 reads as 121 from left to right and from right to left."
      }
    ],
    constraints: [
      "-2^31 <= x <= 2^31 - 1"
    ],
    testCases: [
      { input: { x: 121 }, expectedOutput: true },
      { input: { x: -121 }, expectedOutput: false }
    ]
  }
];

// Get all problems
router.get('/', (req, res) => {
  try {
    const problemList = problems.map(p => ({
      id: p.id,
      title: p.title,
      difficulty: p.difficulty,
      description: p.description.substring(0, 100) + '...'
    }));
    res.json(problemList);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get problem by ID
router.get('/:id', (req, res) => {
  try {
    const problemId = parseInt(req.params.id);
    const problem = problems.find(p => p.id === problemId);
    
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    
    res.json(problem);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new problem (admin only in a real app)
router.post('/', (req, res) => {
  try {
    const { title, difficulty, description, examples, constraints, testCases } = req.body;
    
    const newProblem = {
      id: problems.length + 1,
      title,
      difficulty,
      description,
      examples: examples || [],
      constraints: constraints || [],
      testCases: testCases || []
    };
    
    problems.push(newProblem);
    res.status(201).json(newProblem);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;