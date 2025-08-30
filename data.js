// Dummy Database - Students Table
const studentsData = [
    { id: 1, name: 'Alice Johnson', age: 20, grade: 'A', major: 'Computer Science' },
    { id: 2, name: 'Bob Smith', age: 22, grade: 'B', major: 'Mathematics' },
    { id: 3, name: 'Charlie Brown', age: 19, grade: 'A', major: 'Physics' },
    { id: 4, name: 'Diana Prince', age: 21, grade: 'A+', major: 'Computer Science' },
    { id: 5, name: 'Edward Wilson', age: 23, grade: 'B+', major: 'Chemistry' },
    { id: 6, name: 'Fiona Davis', age: 20, grade: 'A', major: 'Biology' },
    { id: 7, name: 'George Miller', age: 24, grade: 'C', major: 'History' },
    { id: 8, name: 'Hannah Lee', age: 19, grade: 'A+', major: 'Mathematics' },
    { id: 9, name: 'Ian Thompson', age: 22, grade: 'B', major: 'Physics' },
    { id: 10, name: 'Julia Garcia', age: 21, grade: 'A', major: 'Computer Science' },
    { id: 11, name: 'Kevin Martinez', age: 25, grade: 'C+', major: 'English' },
    { id: 12, name: 'Lisa Anderson', age: 20, grade: 'B+', major: 'Biology' },
    { id: 13, name: 'Michael Taylor', age: 23, grade: 'A', major: 'Chemistry' },
    { id: 14, name: 'Nancy White', age: 19, grade: 'A+', major: 'Mathematics' },
    { id: 15, name: 'Oliver Jackson', age: 22, grade: 'B', major: 'Physics' }
];

// Practice Tasks with step-by-step progression
const practiceTasks = [
    {
        id: 1,
        title: 'Select All Data',
        difficulty: 'Beginner',
        description: 'Write a SQL query to select all columns and all rows from the \'students\' table.',
        hint: 'Use the * symbol to select all columns. The basic syntax is: SELECT * FROM table_name;',
        expectedQuery: 'SELECT * FROM students;',
        expectedResult: studentsData,
        explanation: 'The * symbol is a wildcard that selects all columns from the specified table.'
    },
    {
        id: 2,
        title: 'Select Specific Columns',
        difficulty: 'Beginner',
        description: 'Select only the \'name\' and \'age\' columns from the students table.',
        hint: 'List the column names separated by commas after SELECT.',
        expectedQuery: 'SELECT name, age FROM students;',
        expectedResult: studentsData.map(s => ({ name: s.name, age: s.age })),
        explanation: 'You can specify which columns to retrieve by listing them after SELECT.'
    },
    {
        id: 3,
        title: 'Filter with WHERE',
        difficulty: 'Beginner',
        description: 'Select all students who are older than 21 years.',
        hint: 'Use the WHERE clause with the > operator to filter results.',
        expectedQuery: 'SELECT * FROM students WHERE age > 21;',
        expectedResult: studentsData.filter(s => s.age > 21),
        explanation: 'The WHERE clause filters rows based on specified conditions.'
    },
    {
        id: 4,
        title: 'Filter by Text',
        difficulty: 'Beginner',
        description: 'Select all students who are majoring in \'Computer Science\'.',
        hint: 'Use quotes around text values when comparing strings.',
        expectedQuery: 'SELECT * FROM students WHERE major = \'Computer Science\';',
        expectedResult: studentsData.filter(s => s.major === 'Computer Science'),
        explanation: 'String values must be enclosed in single or double quotes in SQL.'
    },
    {
        id: 5,
        title: 'Sort Results',
        difficulty: 'Beginner',
        description: 'Select all students and sort them by age in ascending order.',
        hint: 'Use ORDER BY column_name ASC to sort in ascending order.',
        expectedQuery: 'SELECT * FROM students ORDER BY age ASC;',
        expectedResult: [...studentsData].sort((a, b) => a.age - b.age),
        explanation: 'ORDER BY sorts the result set. ASC is ascending (default), DESC is descending.'
    },
    {
        id: 6,
        title: 'Sort Descending',
        difficulty: 'Beginner',
        description: 'Select student names and ages, sorted by age in descending order.',
        hint: 'Use ORDER BY column_name DESC for descending order.',
        expectedQuery: 'SELECT name, age FROM students ORDER BY age DESC;',
        expectedResult: [...studentsData].sort((a, b) => b.age - a.age).map(s => ({ name: s.name, age: s.age })),
        explanation: 'DESC keyword sorts results in descending order (highest to lowest).'
    },
    {
        id: 7,
        title: 'Multiple Conditions',
        difficulty: 'Intermediate',
        description: 'Select students who are older than 20 AND have grade \'A\'.',
        hint: 'Use AND to combine multiple conditions in WHERE clause.',
        expectedQuery: 'SELECT * FROM students WHERE age > 20 AND grade = \'A\';',
        expectedResult: studentsData.filter(s => s.age > 20 && s.grade === 'A'),
        explanation: 'AND operator requires both conditions to be true for a row to be selected.'
    },
    {
        id: 8,
        title: 'OR Condition',
        difficulty: 'Intermediate',
        description: 'Select students who are either majoring in \'Physics\' OR \'Mathematics\'.',
        hint: 'Use OR to select rows that match either condition.',
        expectedQuery: 'SELECT * FROM students WHERE major = \'Physics\' OR major = \'Mathematics\';',
        expectedResult: studentsData.filter(s => s.major === 'Physics' || s.major === 'Mathematics'),
        explanation: 'OR operator selects rows where at least one condition is true.'
    },
    {
        id: 9,
        title: 'Count Records',
        difficulty: 'Intermediate',
        description: 'Count the total number of students in the table.',
        hint: 'Use COUNT(*) to count all rows.',
        expectedQuery: 'SELECT COUNT(*) FROM students;',
        expectedResult: [{ 'COUNT(*)': studentsData.length }],
        explanation: 'COUNT(*) returns the number of rows in the result set.'
    },
    {
        id: 10,
        title: 'Advanced Filtering',
        difficulty: 'Advanced',
        description: 'Select students whose names start with \'A\' and sort by grade.',
        hint: 'Use LIKE with % wildcard for pattern matching. A% means starts with A.',
        expectedQuery: 'SELECT * FROM students WHERE name LIKE \'A%\' ORDER BY grade;',
        expectedResult: studentsData.filter(s => s.name.startsWith('A')).sort((a, b) => a.grade.localeCompare(b.grade)),
        explanation: 'LIKE operator with % wildcard allows pattern matching in text fields.'
    }
];

// Quiz Questions
const quizQuestions = [
    {
        id: 1,
        question: 'What does SQL stand for?',
        options: [
            'Structured Query Language',
            'Simple Query Language',
            'Standard Query Language',
            'System Query Language'
        ],
        correctAnswer: 0,
        explanation: 'SQL stands for Structured Query Language, which is used to manage and manipulate relational databases.'
    },
    {
        id: 2,
        question: 'Which SQL command is used to retrieve data from a database?',
        options: [
            'GET',
            'FETCH',
            'SELECT',
            'RETRIEVE'
        ],
        correctAnswer: 2,
        explanation: 'SELECT is the SQL command used to retrieve data from database tables.'
    },
    {
        id: 3,
        question: 'What symbol is used to select all columns in a SELECT statement?',
        options: [
            '#',
            '*',
            '%',
            '&'
        ],
        correctAnswer: 1,
        explanation: 'The asterisk (*) symbol is used as a wildcard to select all columns from a table.'
    },
    {
        id: 4,
        question: 'Which clause is used to filter records in SQL?',
        options: [
            'FILTER',
            'WHERE',
            'HAVING',
            'CONDITION'
        ],
        correctAnswer: 1,
        explanation: 'The WHERE clause is used to filter records based on specified conditions.'
    },
    {
        id: 5,
        question: 'What does the ORDER BY clause do?',
        options: [
            'Filters records',
            'Groups records',
            'Sorts records',
            'Counts records'
        ],
        correctAnswer: 2,
        explanation: 'ORDER BY clause is used to sort the result set in ascending or descending order.'
    },
    {
        id: 6,
        question: 'Which SQL command is used to add new records to a table?',
        options: [
            'ADD',
            'INSERT',
            'CREATE',
            'APPEND'
        ],
        correctAnswer: 1,
        explanation: 'INSERT is the SQL command used to add new records to a database table.'
    },
    {
        id: 7,
        question: 'What is the correct syntax for updating data in SQL?',
        options: [
            'MODIFY table_name SET column = value',
            'CHANGE table_name SET column = value',
            'UPDATE table_name SET column = value',
            'ALTER table_name SET column = value'
        ],
        correctAnswer: 2,
        explanation: 'UPDATE is the correct SQL command for modifying existing records in a table.'
    },
    {
        id: 8,
        question: 'Which function is used to count the number of rows?',
        options: [
            'SUM()',
            'COUNT()',
            'TOTAL()',
            'NUMBER()'
        ],
        correctAnswer: 1,
        explanation: 'COUNT() is the aggregate function used to count the number of rows in a result set.'
    },
    {
        id: 9,
        question: 'What type of JOIN returns only matching records from both tables?',
        options: [
            'LEFT JOIN',
            'RIGHT JOIN',
            'INNER JOIN',
            'OUTER JOIN'
        ],
        correctAnswer: 2,
        explanation: 'INNER JOIN returns only the records that have matching values in both tables.'
    },
    {
        id: 10,
        question: 'Which clause is used with GROUP BY to filter groups?',
        options: [
            'WHERE',
            'FILTER',
            'HAVING',
            'CONDITION'
        ],
        correctAnswer: 2,
        explanation: 'HAVING clause is used to filter groups created by GROUP BY, similar to how WHERE filters individual rows.'
    }
];

// Sample leaderboard data (will be replaced by localStorage data)
const sampleLeaderboardData = [
    {
        id: 1,
        name: 'Alice Johnson',
        score: 95,
        correctAnswers: 9,
        totalQuestions: 10,
        timeTaken: '4:32',
        date: '2024-01-15',
        badge: '🥇'
    },
    {
        id: 2,
        name: 'Bob Smith',
        score: 85,
        correctAnswers: 8,
        totalQuestions: 10,
        timeTaken: '6:15',
        date: '2024-01-14',
        badge: '🥈'
    },
    {
        id: 3,
        name: 'Charlie Brown',
        score: 75,
        correctAnswers: 7,
        totalQuestions: 10,
        timeTaken: '8:45',
        date: '2024-01-13',
        badge: '🥉'
    }
];

// Export data for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        studentsData,
        practiceTasks,
        quizQuestions,
        sampleLeaderboardData
    };
}

