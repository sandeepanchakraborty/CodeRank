const express = require('express');
const router = express.Router();

// Mock users database with scores
const users = [
  { id: 1, username: 'demo', email: 'demo@example.com', score: 150 },
  { id: 2, username: 'alice', email: 'alice@example.com', score: 280 },
  { id: 3, username: 'bob', email: 'bob@example.com', score: 340 },
  { id: 4, username: 'charlie', email: 'charlie@example.com', score: 220 },
  { id: 5, username: 'diana', email: 'diana@example.com', score: 195 }
];

// Get leaderboard
router.get('/', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    
    // Sort users by score in descending order
    const sortedUsers = users
      .map(user => ({
        id: user.id,
        username: user.username,
        score: user.score
      }))
      .sort((a, b) => b.score - a.score);
    
    // Add rank
    const rankedUsers = sortedUsers.map((user, index) => ({
      ...user,
      rank: index + 1
    }));
    
    // Apply pagination
    const paginatedUsers = rankedUsers.slice(offset, offset + limit);
    
    res.json({
      leaderboard: paginatedUsers,
      total: users.length,
      limit,
      offset
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user rank
router.get('/user/:userId', (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Calculate rank
    const higherScoreUsers = users.filter(u => u.score > user.score).length;
    const rank = higherScoreUsers + 1;
    
    res.json({
      userId: user.id,
      username: user.username,
      score: user.score,
      rank
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user score (for internal use)
router.put('/user/:userId/score', (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const { score } = req.body;
    
    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.score += score;
    
    res.json({
      message: 'Score updated',
      user: {
        id: user.id,
        username: user.username,
        score: user.score
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;