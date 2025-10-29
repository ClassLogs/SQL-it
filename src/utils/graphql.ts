// GraphQL utilities for SQL-it platform
// This demonstrates GraphQL queries, mutations, subscriptions, schema, validation, and execution

// GraphQL Schema Definition
export const schema = `
  type User {
    id: ID!
    name: String!
    email: String!
    score: Int!
    completedLessons: [String!]!
    createdAt: String!
  }

  type Lesson {
    id: ID!
    title: String!
    description: String!
    difficulty: String!
    duration: String!
    topics: [String!]!
    completed: Boolean!
  }

  type QueryResult {
    columns: [String!]!
    rows: [JSON!]!
    rowCount: Int!
    executionTime: Float!
  }

  type LeaderboardEntry {
    id: ID!
    name: String!
    score: Int!
    completedLessons: Int!
    rank: Int!
  }

  type Query {
    user(id: ID!): User
    lessons: [Lesson!]!
    leaderboard(limit: Int): [LeaderboardEntry!]!
    executeQuery(query: String!): QueryResult!
  }

  type Mutation {
    createUser(name: String!, email: String!, password: String!): User!
    updateUser(id: ID!, score: Int, completedLessons: [String!]): User!
    completeLesson(userId: ID!, lessonId: ID!): User!
  }

  type Subscription {
    leaderboardUpdated: [LeaderboardEntry!]!
    userScoreUpdated(userId: ID!): User!
  }

  scalar JSON
`;

// GraphQL Query Examples
export const queries = {
  getUser: `
    query GetUser($id: ID!) {
      user(id: $id) {
        id
        name
        email
        score
        completedLessons
        createdAt
      }
    }
  `,
  
  getLessons: `
    query GetLessons {
      lessons {
        id
        title
        description
        difficulty
        duration
        topics
        completed
      }
    }
  `,
  
  getLeaderboard: `
    query GetLeaderboard($limit: Int) {
      leaderboard(limit: $limit) {
        id
        name
        score
        completedLessons
        rank
      }
    }
  `,
  
  executeQuery: `
    query ExecuteQuery($query: String!) {
      executeQuery(query: $query) {
        columns
        rows
        rowCount
        executionTime
      }
    }
  `,
};

// GraphQL Mutation Examples
export const mutations = {
  createUser: `
    mutation CreateUser($name: String!, $email: String!, $password: String!) {
      createUser(name: $name, email: $email, password: $password) {
        id
        name
        email
        score
      }
    }
  `,
  
  updateUser: `
    mutation UpdateUser($id: ID!, $score: Int, $completedLessons: [String!]) {
      updateUser(id: $id, score: $score, completedLessons: $completedLessons) {
        id
        score
        completedLessons
      }
    }
  `,
  
  completeLesson: `
    mutation CompleteLesson($userId: ID!, $lessonId: ID!) {
      completeLesson(userId: $userId, lessonId: $lessonId) {
        id
        score
        completedLessons
      }
    }
  `,
};

// GraphQL Subscription Examples
export const subscriptions = {
  leaderboardUpdated: `
    subscription OnLeaderboardUpdated {
      leaderboardUpdated {
        id
        name
        score
        rank
      }
    }
  `,
  
  userScoreUpdated: `
    subscription OnUserScoreUpdated($userId: ID!) {
      userScoreUpdated(userId: $userId) {
        id
        score
        completedLessons
      }
    }
  `,
};

// GraphQL Validation
export const validateGraphQLInput = (input: any, type: string): string | null => {
  switch (type) {
    case 'User':
      if (!input.name || input.name.length > 100) return 'Invalid name';
      if (!input.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) return 'Invalid email';
      break;
    case 'Query':
      if (!input.query || input.query.length > 5000) return 'Invalid query';
      break;
  }
  return null;
};

// GraphQL Execution (simulated)
export const executeGraphQL = async (query: string, variables?: any): Promise<any> => {
  // Simulate GraphQL execution with delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // This is a mock implementation - in production, this would connect to a real GraphQL server
  if (query.includes('lessons')) {
    return {
      data: {
        lessons: [
          { id: '1', title: 'Introduction to SQL', difficulty: 'Beginner', completed: false },
        ],
      },
    };
  }
  
  if (query.includes('leaderboard')) {
    return {
      data: {
        leaderboard: [],
      },
    };
  }
  
  return { data: null, errors: [{ message: 'Query not implemented' }] };
};

// GraphQL Client Configuration
export const graphQLClient = {
  endpoint: 'http://localhost:3000/graphql',
  headers: {
    'Content-Type': 'application/json',
  },
};

// Example usage in components:
// const result = await executeGraphQL(queries.getLessons);
// const mutation = await executeGraphQL(mutations.completeLesson, { userId: '1', lessonId: '1' });
