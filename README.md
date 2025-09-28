# 🏆 CodeRank - Coding Platform

CodeRank is a comprehensive coding platform where users can solve programming challenges, compete with others, and improve their coding skills. Built with Node.js/Express backend and a responsive web frontend.

## ✨ Features

- **User Authentication**: Register and login system
- **Problem Library**: Collection of coding challenges with different difficulty levels
- **Code Editor**: Multi-language support (JavaScript, Python, Java, C++)
- **Real-time Submission**: Submit and get instant feedback on your solutions
- **Leaderboard**: Competitive ranking system based on solved problems and scores
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sandeepanchakraborty/CodeRank.git
   cd CodeRank
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:5000` to access the platform

### Development Mode

To run in development mode with auto-restart:
```bash
npm run dev
```

## 📖 Usage

### Demo Account
- **Username**: demo
- **Password**: demo123

### Getting Started
1. **Login/Register**: Start by creating an account or using the demo credentials
2. **Browse Problems**: Check out the available coding challenges
3. **Select a Problem**: Click on any problem to start solving
4. **Write Code**: Use the built-in code editor with syntax highlighting
5. **Submit**: Test your solution and get instant feedback
6. **Track Progress**: Check your rank on the leaderboard

## 🏗️ Project Structure

```
CodeRank/
├── server/                 # Backend server
│   ├── app.js             # Main server file
│   ├── routes/            # API routes
│   │   ├── auth.js        # Authentication endpoints
│   │   ├── problems.js    # Problem management
│   │   ├── submissions.js # Code submission handling
│   │   └── leaderboard.js # Ranking system
├── public/                # Frontend files
│   └── index.html        # Main web interface
├── client/               # React frontend (future)
├── package.json          # Project dependencies
└── README.md            # This file
```

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user info

### Problems
- `GET /api/problems` - List all problems
- `GET /api/problems/:id` - Get specific problem
- `POST /api/problems` - Add new problem (admin)

### Submissions
- `POST /api/submissions` - Submit solution
- `GET /api/submissions/user/:userId` - User submissions
- `GET /api/submissions/problem/:problemId` - Problem submissions

### Leaderboard
- `GET /api/leaderboard` - Get leaderboard
- `GET /api/leaderboard/user/:userId` - Get user rank

## 🎯 Supported Languages

- JavaScript
- Python
- Java
- C++

## 📊 Sample Problems

1. **Two Sum** (Easy): Find two numbers that add up to a target
2. **Reverse String** (Easy): Reverse an array of characters
3. **Palindrome Number** (Easy): Check if a number is palindrome

## 🚧 Future Enhancements

- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] Real code execution with Docker containers
- [ ] More programming languages support
- [ ] Advanced problem categories and tags
- [ ] User profiles and statistics
- [ ] Contest system with time-based challenges
- [ ] Social features (comments, discussions)
- [ ] Mobile app development

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **CodeRank Team** - *Initial work*

## 🎉 Acknowledgments

- Inspired by platforms like LeetCode, HackerRank, and Codeforces
- Thanks to the open-source community for the tools and libraries used

---

**Happy Coding! 🚀**