const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc } = require('firebase/firestore');

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDZpQ2EU3Eus9jdU8FYalmfpZTagZhON6k",
  authDomain: "coderank-edb76.firebaseapp.com",
  projectId: "coderank-edb76",
  storageBucket: "coderank-edb76.firebasestorage.app",
  messagingSenderId: "68333853617",
  appId: "1:68333853617:web:69a9ec256c96705ef7fb90"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

// Problems data with multi-language starter code
const problems = [
  {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    category: "Array",
    order: 1,
    videoId: "8-k1C6ehKuw",
    likes: 0,
    dislikes: 0,
    starterCode: {
      javascript: `function twoSum(nums, target) {
    // Write your code here
    
}`,
      python: `def twoSum(nums, target):
    # Write your code here
    pass`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your code here
        
    }
}`
    }
  },
  {
    id: "reverse-linked-list",
    title: "Reverse Linked List",
    difficulty: "Hard",
    category: "Linked List",
    order: 2,
    videoId: "",
    likes: 0,
    dislikes: 0,
    starterCode: {
      javascript: `function reverseList(head) {
    // Write your code here
    
}`,
      python: `def reverseList(head):
    # Write your code here
    pass`,
      java: `class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
}

class Solution {
    public ListNode reverseList(ListNode head) {
        // Write your code here
        
    }
}`,
      cpp: `struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
};

class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        // Write your code here
        
    }
};`,
      c: `struct ListNode {
    int val;
    struct ListNode *next;
};

struct ListNode* reverseList(struct ListNode* head) {
    // Write your code here
    
}`
    }
  },
  {
    id: "jump-game",
    title: "Jump Game",
    difficulty: "Medium",
    category: "Dynamic Programming",
    order: 3,
    videoId: "",
    likes: 0,
    dislikes: 0,
    starterCode: {
      javascript: `function canJump(nums) {
    // Write your code here
    
}`,
      python: `def canJump(nums):
    # Write your code here
    pass`,
      java: `class Solution {
    public boolean canJump(int[] nums) {
        // Write your code here
        
    }
}`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    bool canJump(vector<int>& nums) {
        // Write your code here
        
    }
};`,
      c: `#include <stdbool.h>

bool canJump(int* nums, int numsSize) {
    // Write your code here
    
}`
    }
  },
  {
    id: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "Easy",
    category: "Stack",
    order: 4,
    videoId: "xty7fr-k0TU",
    likes: 0,
    dislikes: 0,
    starterCode: {
      javascript: `function isValid(s) {
    // Write your code here
    
}`,
      python: `def isValid(s):
    # Write your code here
    pass`,
      java: `class Solution {
    public boolean isValid(String s) {
        // Write your code here
        
    }
}`,
      cpp: `#include <string>
using namespace std;

class Solution {
public:
    bool isValid(string s) {
        // Write your code here
        
    }
};`,
      c: `#include <stdbool.h>
#include <string.h>

bool isValid(char* s) {
    // Write your code here
    
}`
    }
  },
  {
    id: "search-a-2d-matrix",
    title: "Search a 2D Matrix",
    difficulty: "Medium",
    category: "Binary Search",
    order: 5,
    videoId: "ZfFl4torNg4",
    likes: 0,
    dislikes: 0,
    starterCode: {
      javascript: `function searchMatrix(matrix, target) {
    // Write your code here
    
}`,
      python: `def searchMatrix(matrix, target):
    # Write your code here
    pass`,
      java: `class Solution {
    public boolean searchMatrix(int[][] matrix, int target) {
        // Write your code here
        
    }
}`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    bool searchMatrix(vector<vector<int>>& matrix, int target) {
        // Write your code here
        
    }
};`,
      c: `#include <stdbool.h>

bool searchMatrix(int** matrix, int matrixSize, int* matrixColSize, int target) {
    // Write your code here
    
}`
    }
  },
];

async function seedProblems() {
  try {
    console.log('Starting to seed problems...');
    
    for (const problem of problems) {
      await setDoc(doc(firestore, 'problems', problem.id), problem);
      console.log(`Added problem: ${problem.title}`);
    }
    
    console.log('✅ All problems added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding problems:', error);
    process.exit(1);
  }
}

seedProblems();
