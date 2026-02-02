-- Insert hardcoded blog posts into the database
-- This migration adds the initial blog posts that were previously hardcoded in the frontend

INSERT INTO public.blog_posts (
  title,
  slug,
  excerpt,
  content,
  cover_image,
  category,
  tags,
  read_time,
  featured,
  status,
  published_at,
  created_at
) VALUES 
(
  'Getting Started with MERN Stack Development',
  'getting-started-mern-stack',
  'A comprehensive guide to building full-stack applications with MongoDB, Express, React, and Node.js.',
  '# Getting Started with MERN Stack Development

## Introduction

The MERN stack (MongoDB, Express, React, Node.js) is one of the most popular technology stacks for building modern web applications. This comprehensive guide will walk you through everything you need to know to get started.

## What is MERN Stack?

MERN is an acronym that stands for:
- **MongoDB**: A NoSQL database for storing data
- **Express.js**: A web application framework for Node.js
- **React**: A JavaScript library for building user interfaces
- **Node.js**: A JavaScript runtime for server-side programming

## Why Choose MERN?

1. **JavaScript Everywhere**: Use JavaScript for both frontend and backend
2. **Active Community**: Large ecosystem and plenty of resources
3. **Fast Development**: Rapid prototyping and development
4. **Scalable**: Build scalable applications from the ground up

## Getting Started

### Prerequisites

Before you begin, make sure you have:
- Node.js installed (v14 or higher)
- MongoDB installed locally or a MongoDB Atlas account
- Basic understanding of JavaScript

### Setting Up Your First MERN App

1. **Create a new React app**
```bash
npx create-react-app my-mern-app
cd my-mern-app
```

2. **Set up the backend**
```bash
mkdir server
cd server
npm init -y
npm install express mongoose cors dotenv
```

3. **Create your Express server**
```javascript
const express = require(''express'');
const mongoose = require(''mongoose'');
const cors = require(''cors'');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

## Best Practices

- Use environment variables for sensitive data
- Implement proper error handling
- Write clean, modular code
- Use version control (Git)
- Test your code regularly

## Conclusion

The MERN stack provides a powerful foundation for building modern web applications. With practice and dedication, you''ll be building full-stack applications in no time!',
  'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop',
  'Development',
  ARRAY['MERN', 'MongoDB', 'Express', 'React', 'Node.js', 'Full-stack'],
  8,
  true,
  'published',
  '2025-01-15T00:00:00Z',
  '2025-01-15T00:00:00Z'
),
(
  'Mastering n8n Automation Workflows',
  'mastering-n8n-automation',
  'Learn how to create powerful automation workflows with n8n and integrate AI capabilities.',
  '# Mastering n8n Automation Workflows

## Introduction

n8n is a powerful workflow automation tool that lets you connect different services and automate repetitive tasks. In this guide, we''ll explore how to create effective automation workflows.

## What is n8n?

n8n is a free and open-source workflow automation tool. It allows you to:
- Connect various apps and services
- Automate repetitive tasks
- Build complex workflows with a visual editor
- Self-host your automation workflows

## Key Features

1. **Visual Workflow Editor**: Drag-and-drop interface
2. **400+ Integrations**: Connect to popular services
3. **Custom Code Nodes**: Write JavaScript for custom logic
4. **Self-Hosted**: Full control over your data
5. **Active Community**: Regular updates and support

## Getting Started with n8n

### Installation

You can install n8n using npm:

```bash
npm install n8n -g
n8n start
```

### Creating Your First Workflow

1. Open n8n in your browser (typically http://localhost:5678)
2. Click "New Workflow"
3. Add a trigger node (e.g., Schedule or Webhook)
4. Add action nodes to perform tasks
5. Connect the nodes
6. Test and activate your workflow

## Popular Use Cases

### 1. Social Media Automation
- Auto-post content across platforms
- Monitor mentions and respond
- Collect analytics data

### 2. Data Integration
- Sync data between applications
- Create automated backups
- Generate reports

### 3. AI-Powered Workflows
- Integrate with OpenAI for content generation
- Use AI for data analysis
- Automate customer support

## Best Practices

- Start simple and iterate
- Test workflows before activating
- Use error handling nodes
- Document your workflows
- Monitor execution logs

## Advanced Tips

### Using HTTP Requests

```javascript
// Custom HTTP request node
return {
  json: {
    url: ''https://api.example.com/data'',
    method: ''POST'',
    body: {
      key: ''value''
    }
  }
};
```

### Error Handling

Always add error handling to prevent workflow failures:
- Use "Error Trigger" nodes
- Set up notifications for failures
- Implement retry logic

## Conclusion

n8n is an incredibly versatile tool for automation. Whether you''re automating simple tasks or building complex AI-powered workflows, n8n provides the flexibility and power you need.',
  'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=600&h=400&fit=crop',
  'Automation',
  ARRAY['n8n', 'Automation', 'Workflows', 'Integration', 'AI'],
  6,
  true,
  'published',
  '2025-01-10T00:00:00Z',
  '2025-01-10T00:00:00Z'
),
(
  'Building Scalable React Applications',
  'building-scalable-react-apps',
  'Best practices for structuring large-scale React applications with TypeScript and modern tooling.',
  '# Building Scalable React Applications

## Introduction

As your React application grows, maintaining code quality and scalability becomes crucial. This guide covers best practices for building large-scale React applications.

## Architecture Patterns

### 1. Feature-Based Structure

Organize your code by features rather than file types:

```
src/
  features/
    auth/
      components/
      hooks/
      services/
      types/
    dashboard/
      components/
      hooks/
      services/
      types/
  shared/
    components/
    hooks/
    utils/
```

### 2. Component Composition

Break down complex components into smaller, reusable pieces:

```typescript
// Bad - Monolithic component
const UserProfile = () => {
  // 500 lines of code
};

// Good - Composed components
const UserProfile = () => (
  <div>
    <UserHeader />
    <UserInfo />
    <UserActivity />
  </div>
);
```

## State Management

### Choosing the Right Solution

- **Local State**: useState for component-specific state
- **Context API**: For shared state across components
- **Redux/Zustand**: For complex global state
- **React Query**: For server state management

### Example with Zustand

```typescript
import create from ''zustand'';

interface AppState {
  user: User | null;
  setUser: (user: User) => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
```

## TypeScript Best Practices

### 1. Type Your Props

```typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: ''primary'' | ''secondary'';
}

const Button: React.FC<ButtonProps> = ({ label, onClick, variant = ''primary'' }) => {
  return <button onClick={onClick}>{label}</button>;
};
```

### 2. Use Generics

```typescript
function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });
  
  return [value, setValue] as const;
}
```

## Performance Optimization

### 1. Code Splitting

```typescript
import { lazy, Suspense } from ''react'';

const Dashboard = lazy(() => import(''./features/dashboard''));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Dashboard />
    </Suspense>
  );
}
```

### 2. Memoization

```typescript
import { useMemo, useCallback } from ''react'';

const ExpensiveComponent = ({ data }) => {
  const processedData = useMemo(() => {
    return data.map(item => /* expensive operation */);
  }, [data]);
  
  const handleClick = useCallback(() => {
    // event handler logic
  }, []);
  
  return <div onClick={handleClick}>{/* render */}</div>;
};
```

## Testing Strategy

### 1. Unit Tests

```typescript
import { render, screen } from ''@testing-library/react'';
import Button from ''./Button'';

test(''renders button with label'', () => {
  render(<Button label="Click me" onClick={() => {}} />);
  expect(screen.getByText(''Click me'')).toBeInTheDocument();
});
```

### 2. Integration Tests

Test how components work together:

```typescript
test(''user can login'', async () => {
  render(<LoginForm />);
  
  await userEvent.type(screen.getByLabelText(''Email''), ''user@example.com'');
  await userEvent.type(screen.getByLabelText(''Password''), ''password123'');
  await userEvent.click(screen.getByRole(''button'', { name: ''Login'' }));
  
  await waitFor(() => {
    expect(screen.getByText(''Welcome back!'')).toBeInTheDocument();
  });
});
```

## Deployment Best Practices

1. **Environment Variables**: Use `.env` files for configuration
2. **Build Optimization**: Configure webpack/vite for production
3. **CI/CD**: Automate testing and deployment
4. **Monitoring**: Set up error tracking and analytics

## Conclusion

Building scalable React applications requires careful planning and adherence to best practices. By following these guidelines, you''ll create maintainable, performant applications that can grow with your needs.',
  'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=600&h=400&fit=crop',
  'React',
  ARRAY['React', 'TypeScript', 'Scalability', 'Best-practices', 'Architecture'],
  10,
  true,
  'published',
  '2025-01-05T00:00:00Z',
  '2025-01-05T00:00:00Z'
);
