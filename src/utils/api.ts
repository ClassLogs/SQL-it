// Mock API utilities using Fetch API with localStorage as backend

const API_BASE = 'http://localhost:3000/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Lessons API
export const fetchLessons = async (): Promise<ApiResponse<any[]>> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const lessons = [
      {
        id: '1',
        title: 'Introduction to SQL',
        description: 'Learn the basics of SQL and database concepts',
        difficulty: 'Beginner',
        duration: '15 min',
        topics: ['SELECT', 'FROM', 'WHERE'],
        completed: false,
      },
      {
        id: '2',
        title: 'SELECT Statements',
        description: 'Master the art of querying data',
        difficulty: 'Beginner',
        duration: '20 min',
        topics: ['SELECT', 'DISTINCT', 'AS'],
        completed: false,
      },
      {
        id: '3',
        title: 'Filtering Data',
        description: 'Use WHERE clauses to filter results',
        difficulty: 'Beginner',
        duration: '25 min',
        topics: ['WHERE', 'AND', 'OR', 'NOT'],
        completed: false,
      },
      {
        id: '4',
        title: 'Sorting Results',
        description: 'Order your data with ORDER BY',
        difficulty: 'Intermediate',
        duration: '20 min',
        topics: ['ORDER BY', 'ASC', 'DESC'],
        completed: false,
      },
      {
        id: '5',
        title: 'JOIN Operations',
        description: 'Combine data from multiple tables',
        difficulty: 'Intermediate',
        duration: '30 min',
        topics: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN'],
        completed: false,
      },
      {
        id: '6',
        title: 'Aggregate Functions',
        description: 'Calculate summaries with GROUP BY',
        difficulty: 'Advanced',
        duration: '25 min',
        topics: ['COUNT', 'SUM', 'AVG', 'GROUP BY'],
        completed: false,
      },
    ];

    return { success: true, data: lessons };
  } catch (error) {
    return { success: false, error: 'Failed to fetch lessons' };
  }
};

// Quizzes API
export const fetchQuizzes = async (): Promise<ApiResponse<any[]>> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const quizzes = [
      {
        id: 'q1',
        lessonId: '1',
        title: 'SQL Basics Quiz',
        questions: [
          {
            id: 'q1_1',
            question: 'What does SQL stand for?',
            options: [
              'Structured Query Language',
              'Simple Question Language',
              'Structured Question Language',
              'System Query Language',
            ],
            correctAnswer: 0,
          },
          {
            id: 'q1_2',
            question: 'Which statement is used to retrieve data?',
            options: ['GET', 'SELECT', 'FETCH', 'RETRIEVE'],
            correctAnswer: 1,
          },
        ],
      },
    ];

    return { success: true, data: quizzes };
  } catch (error) {
    return { success: false, error: 'Failed to fetch quizzes' };
  }
};

// Leaderboard API
export const fetchLeaderboard = async (): Promise<ApiResponse<any[]>> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const leaderboard = users
      .map((u: any) => ({
        id: u.id,
        name: u.name,
        score: u.score || 0,
        completedLessons: u.completedLessons?.length || 0,
      }))
      .sort((a: any, b: any) => b.score - a.score)
      .slice(0, 10);

    return { success: true, data: leaderboard };
  } catch (error) {
    return { success: false, error: 'Failed to fetch leaderboard' };
  }
};

// Fetch lesson detail
export const fetchLessonDetail = async (id: string): Promise<ApiResponse<any>> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const lessonDetails: Record<string, any> = {
      '1': {
        id: '1',
        title: 'Introduction to SQL',
        description: 'Learn the basics of SQL and database concepts',
        difficulty: 'Beginner',
        content: [
          {
            heading: 'What is SQL?',
            text: 'SQL (Structured Query Language) is a standard language for storing, manipulating and retrieving data in databases. It is used to communicate with a database and perform various operations on the data.',
          },
          {
            heading: 'Key Concepts',
            points: [
              'Database: An organized collection of data',
              'Table: A collection of related data entries consisting of rows and columns',
              'Query: A request for data or information from a database',
              'Schema: The structure that defines the organization of data',
            ],
          },
          {
            heading: 'Why Learn SQL?',
            text: 'SQL is essential for anyone working with data. It is used by data analysts, data scientists, software engineers, and database administrators to interact with databases efficiently.',
          },
        ],
        examples: [
          {
            title: 'Basic SELECT Query',
            query: 'SELECT * FROM users;',
            explanation: 'This query retrieves all columns and all rows from the users table.',
          },
          {
            title: 'Selecting Specific Columns',
            query: 'SELECT name, email FROM users;',
            explanation: 'This query retrieves only the name and email columns from the users table.',
          },
        ],
      },
      '2': {
        id: '2',
        title: 'SELECT Statements',
        description: 'Master the art of querying data',
        difficulty: 'Beginner',
        content: [
          {
            heading: 'The SELECT Statement',
            text: 'The SELECT statement is used to select data from a database. The data returned is stored in a result table, called the result-set.',
          },
          {
            heading: 'SELECT Syntax',
            text: 'SELECT column1, column2, ... FROM table_name;',
          },
          {
            heading: 'Advanced Techniques',
            points: [
              'Use DISTINCT to get unique values',
              'Use AS to create column aliases',
              'Combine multiple columns in output',
              'Use * to select all columns',
            ],
          },
        ],
        examples: [
          {
            title: 'Using DISTINCT',
            query: 'SELECT DISTINCT age FROM users;',
            explanation: 'Returns only unique age values, eliminating duplicates.',
          },
          {
            title: 'Column Aliases',
            query: 'SELECT name AS full_name, email AS contact FROM users;',
            explanation: 'Renames columns in the result set for better readability.',
          },
        ],
      },
    };

    const lesson = lessonDetails[id];
    if (!lesson) {
      return { success: false, error: 'Lesson not found' };
    }

    return { success: true, data: lesson };
  } catch (error) {
    return { success: false, error: 'Failed to fetch lesson detail' };
  }
};

// Fetch practice tasks
export const fetchPracticeTasks = async (lessonId?: string): Promise<ApiResponse<any[]>> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const allTasks = [
      {
        id: 'task1',
        lessonId: '1',
        title: 'Select All Users',
        description: 'Write a query to retrieve all users from the database',
        requirements: [
          'Select all columns from the users table',
          'Return all rows',
        ],
        schema: [
          {
            name: 'users',
            columns: [
              { name: 'id', type: 'INTEGER' },
              { name: 'name', type: 'TEXT' },
              { name: 'email', type: 'TEXT' },
              { name: 'age', type: 'INTEGER' },
            ],
          },
        ],
        hint: 'Use the asterisk (*) to select all columns',
        solution: 'SELECT * FROM users;',
        expectedResult: { type: 'all', table: 'users' },
      },
      {
        id: 'task2',
        lessonId: '1',
        title: 'Select Specific Columns',
        description: 'Retrieve only names and emails of all users',
        requirements: [
          'Select only name and email columns',
          'From the users table',
        ],
        schema: [
          {
            name: 'users',
            columns: [
              { name: 'id', type: 'INTEGER' },
              { name: 'name', type: 'TEXT' },
              { name: 'email', type: 'TEXT' },
              { name: 'age', type: 'INTEGER' },
            ],
          },
        ],
        hint: 'List the column names separated by commas after SELECT',
        solution: 'SELECT name, email FROM users;',
        expectedResult: { type: 'columns', columns: ['name', 'email'] },
      },
      {
        id: 'task3',
        lessonId: '3',
        title: 'Filter Users by Age',
        description: 'Find all users who are older than 30',
        requirements: [
          'Select all columns',
          'Filter users where age is greater than 30',
        ],
        schema: [
          {
            name: 'users',
            columns: [
              { name: 'id', type: 'INTEGER' },
              { name: 'name', type: 'TEXT' },
              { name: 'email', type: 'TEXT' },
              { name: 'age', type: 'INTEGER' },
            ],
          },
        ],
        hint: 'Use WHERE clause with the > operator',
        solution: 'SELECT * FROM users WHERE age > 30;',
        expectedResult: { type: 'filter', condition: 'age > 30' },
      },
      {
        id: 'task4',
        lessonId: '4',
        title: 'Sort Users by Age',
        description: 'Get all users sorted by age in descending order',
        requirements: [
          'Select all columns',
          'Sort by age from highest to lowest',
        ],
        schema: [
          {
            name: 'users',
            columns: [
              { name: 'id', type: 'INTEGER' },
              { name: 'name', type: 'TEXT' },
              { name: 'email', type: 'TEXT' },
              { name: 'age', type: 'INTEGER' },
            ],
          },
        ],
        hint: 'Use ORDER BY clause with DESC for descending order',
        solution: 'SELECT * FROM users ORDER BY age DESC;',
        expectedResult: { type: 'order', column: 'age', direction: 'DESC' },
      },
    ];

    const tasks = lessonId 
      ? allTasks.filter(t => t.lessonId === lessonId)
      : allTasks;

    return { success: true, data: tasks };
  } catch (error) {
    return { success: false, error: 'Failed to fetch practice tasks' };
  }
};

// Execute SQL Query with validation
export const executeQuery = async (query: string, expectedResult?: any): Promise<ApiResponse<any>> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const queryLower = query.toLowerCase().trim();
    
    // Check for basic SQL syntax
    if (!queryLower.startsWith('select')) {
      return { success: false, error: 'Only SELECT queries are allowed in practice mode' };
    }

    if (!queryLower.includes('from')) {
      return { success: false, error: 'Query must include a FROM clause' };
    }

    // Mock database
    const mockData = [
      { id: 1, name: 'John Doe', email: 'john@example.com', age: 28 },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 32 },
      { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 45 },
    ];

    let resultData = [...mockData];
    let columns = ['id', 'name', 'email', 'age'];

    // Parse and execute query logic
    if (queryLower.includes('where')) {
      const whereMatch = queryLower.match(/where\s+(.+?)(?:order|$)/);
      if (whereMatch) {
        const condition = whereMatch[1].trim();
        if (condition.includes('age > 30')) {
          resultData = resultData.filter(u => u.age > 30);
        }
      }
    }

    if (queryLower.includes('order by')) {
      const orderMatch = queryLower.match(/order by\s+(\w+)(?:\s+(asc|desc))?/);
      if (orderMatch) {
        const column = orderMatch[1];
        const direction = orderMatch[2] || 'asc';
        resultData.sort((a: any, b: any) => {
          if (direction === 'desc') {
            return b[column] - a[column];
          }
          return a[column] - b[column];
        });
      }
    }

    // Check for specific columns
    if (!queryLower.includes('select *')) {
      const selectMatch = queryLower.match(/select\s+(.+?)\s+from/);
      if (selectMatch) {
        const selectedCols = selectMatch[1].split(',').map(c => c.trim());
        columns = selectedCols;
        resultData = resultData.map(row => {
          const newRow: any = {};
          selectedCols.forEach(col => {
            if (row.hasOwnProperty(col)) {
              newRow[col] = row[col];
            }
          });
          return newRow;
        });
      }
    }

    // Check if result matches expected
    let isCorrect = true;
    if (expectedResult) {
      if (expectedResult.type === 'columns') {
        isCorrect = JSON.stringify(columns.sort()) === JSON.stringify(expectedResult.columns.sort());
      } else if (expectedResult.type === 'filter') {
        isCorrect = resultData.length < mockData.length;
      } else if (expectedResult.type === 'order') {
        isCorrect = queryLower.includes('order by');
      }
    }

    return {
      success: true,
      data: {
        columns,
        rows: resultData,
        rowCount: resultData.length,
        executionTime: Math.random() * 100 + 50,
        isCorrect,
      },
    };
  } catch (error) {
    return { success: false, error: 'Query execution failed' };
  }
};
