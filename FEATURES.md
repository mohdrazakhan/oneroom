# OneRoom - Feature Documentation

## Overview
OneRoom is a comprehensive roommate management application that simplifies shared living by automating expense splitting and task assignment.

## Core Features

### 1. User Authentication & Authorization
- **Secure Registration & Login**: JWT-based authentication with bcrypt password hashing (12 salt rounds)
- **Protected Routes**: All API endpoints require authentication
- **Rate Limiting**: 
  - Authentication endpoints: 5 requests per 15 minutes
  - Create operations: 30 requests per 15 minutes
  - General API: 100 requests per 15 minutes

### 2. Room Management
- **Create Rooms**: Users can create multiple living spaces
- **Unique Invite Codes**: Each room gets a unique 8-character code for easy sharing
- **Role-Based Access**: 
  - Admin: Can modify room settings and remove members
  - Member: Can participate and view room content
- **Multi-Room Support**: Users can join and manage multiple rooms simultaneously

### 3. Expense Management

#### Expense Tracking
- Add expenses with description, amount, and category
- Categories: Groceries, Utilities, Rent, Entertainment, Other
- Automatic timestamp for all expenses
- View expense history by room

#### Smart Splitting
- **Equal Split (Default)**: Automatically divides expenses equally among all roommates
- **Custom Percentage Split**: Set custom percentages for different split scenarios
- Precise calculation with 2 decimal places

#### Balance Calculation
- Real-time calculation of who owes whom
- Smart settlement algorithm minimizes the number of transactions needed
- Clear settlement recommendations (e.g., "Alice owes Bob $25.50")
- Mark individual splits as settled when paid

#### Settlement Features
- Track settlement status per person per expense
- Calculate net balances across all expenses
- Optimized settlement plan to minimize transactions

### 4. Task Management

#### Task Creation & Organization
- Create tasks with title, description, and category
- Categories: Cleaning, Cooking, Shopping, Maintenance, Other
- Set priority levels: Low, Medium, High
- Add due dates for time-sensitive tasks
- Track status: Pending, In Progress, Completed

#### Automatic Task Assignment
- **Fair Distribution Algorithm**: 
  - Tracks assignment history per category
  - Assigns tasks to the member with least recent assignments
  - Tie-breaker: Assigns to member who was assigned longest ago
  - Ensures fair rotation across all roommates

#### Recurring Tasks
- Set tasks to recur: Daily, Weekly, or Monthly
- **Auto-Rotation**: When completed, automatically creates next occurrence and assigns to next person
- Smart date calculation:
  - Daily: Adds 1 day
  - Weekly: Adds 7 days
  - Monthly: Handles month-end edge cases (e.g., Jan 31 → Feb 28)

#### Personal Task Dashboard
- View all assigned tasks across all rooms
- Filter by status (All, Pending, In Progress, Completed)
- Quick actions: Start task, Mark as complete
- See task details including room, priority, and due date

### 5. User Interface

#### Responsive Design
- Mobile-first responsive layout
- Works seamlessly on desktop, tablet, and mobile
- Modern gradient-based color scheme (purple to blue)
- Smooth animations and transitions

#### Dashboard
- Overview of all rooms and pending tasks
- Quick stats: Number of rooms, pending tasks
- Recent tasks preview
- Easy access to create or join rooms

#### Room Details View
- Tabbed interface: Overview, Expenses, Tasks, Members
- **Overview Tab**: Key statistics and settlement summary
- **Expenses Tab**: Complete expense list with add functionality
- **Tasks Tab**: All room tasks with filtering and quick actions
- **Members Tab**: Room member list with roles

#### Navigation
- Clean navbar with user profile display
- Quick access to Dashboard and My Tasks
- One-click logout

### 6. Security Features

#### Authentication Security
- Passwords hashed with bcrypt (12 salt rounds)
- JWT tokens with 7-day expiration
- Secure token storage in localStorage
- Automatic redirect on token expiration

#### Rate Limiting
- Prevents brute force attacks on login
- Protects against spam and abuse
- Different limits for different operation types
- Standard rate limit headers in responses

#### API Security
- All routes require authentication (except login/register)
- Input validation on all endpoints
- CORS enabled for cross-origin requests
- Error messages don't leak sensitive information

#### Environment Security
- JWT_SECRET validation (fails in production if not set)
- Development fallback with clear warnings
- Secure defaults for all configurations

### 7. Data Models

#### User Model
- Name, email (unique), password (hashed)
- Associated rooms (array of references)
- Creation timestamp

#### Room Model
- Name, description
- Members with roles and join dates
- Unique invite code
- Creator reference and creation date

#### Expense Model
- Description, amount, category
- Paid by reference
- Split between (array with user references, amounts, settled status)
- Date and creation timestamp

#### Task Model
- Title, description, category
- Assigned to reference
- Status, priority
- Recurring configuration (enabled, frequency, auto-assign)
- Due date, completion date
- Creation timestamp

## Technical Architecture

### Backend Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + bcryptjs
- **Security**: express-rate-limit, CORS
- **Utilities**: uuid (for invite codes)

### Frontend Stack
- **Library**: React 18
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios
- **Styling**: Custom CSS3 with modern features
- **Build Tool**: Create React App

### API Structure
- RESTful API design
- JSON request/response format
- Consistent error handling
- Standard HTTP status codes
- Bearer token authentication

## Algorithms

### Expense Settlement Algorithm
1. Initialize balance for each member to 0
2. For each expense:
   - Credit the payer with the full amount
   - Debit each person in the split for their share
3. Separate members into debtors (negative balance) and creditors (positive balance)
4. Create minimum transactions:
   - Match smallest debt with smallest credit
   - Create settlement transaction
   - Continue until all balances are zero

### Task Assignment Algorithm
1. Get recent task history for the category
2. Count assignments per member
3. Track last assignment date per member
4. Find members with minimum assignment count
5. If tie, select member assigned longest ago (or never assigned)
6. Return selected member for assignment

### Recurring Task Rotation
1. When task is marked complete:
   - Create new task instance with same properties
   - Calculate next due date based on frequency
   - Use assignment algorithm to get next assignee
   - Save new task and mark original as complete

## Future Enhancement Possibilities

### Potential Features
- Push notifications for new expenses and tasks
- Mobile app (React Native)
- Expense categories analytics and charts
- Task completion statistics
- Shopping lists with auto-assignment
- Calendar integration for tasks
- Bill reminders and recurring expenses
- Photo attachments for expenses
- Task comments and discussions
- Room announcements board
- Integration with payment apps (Venmo, PayPal)
- Export data (CSV, PDF reports)
- Dark mode theme
- Multiple language support

### Scalability Considerations
- Database indexing for performance
- Caching layer (Redis)
- Background job processing for recurring tasks
- WebSocket for real-time updates
- CDN for static assets
- Load balancing for high traffic
- Database replication and backups

## Development Guidelines

### Running Locally
1. Install MongoDB and ensure it's running
2. Copy `.env.example` to `.env` and configure
3. Run `npm install` and `cd client && npm install`
4. Start with `npm run dev-all` for full stack development

### Code Quality
- All routes include rate limiting
- Authentication required for protected endpoints
- Input validation on all user data
- Consistent error handling patterns
- Comments for complex algorithms
- Modular code organization

### Security Checklist
- ✅ Password hashing (bcrypt with 12 rounds)
- ✅ JWT token authentication
- ✅ Rate limiting on all endpoints
- ✅ Environment variable validation
- ✅ Protected routes
- ✅ CORS configuration
- ✅ No sensitive data in error messages
- ✅ Input validation
- ✅ No hardcoded secrets in production

## API Endpoints Summary

### Authentication
- POST `/api/users/register` - Create new account
- POST `/api/users/login` - Authenticate user
- GET `/api/users/me` - Get current user
- PUT `/api/users/me` - Update profile

### Rooms
- POST `/api/rooms` - Create room
- GET `/api/rooms` - List user's rooms
- GET `/api/rooms/:id` - Get room details
- POST `/api/rooms/join` - Join with invite code
- PUT `/api/rooms/:id` - Update room
- DELETE `/api/rooms/:id/members/:userId` - Remove member

### Expenses
- POST `/api/expenses` - Add expense
- GET `/api/expenses/room/:roomId` - List room expenses
- GET `/api/expenses/room/:roomId/balances` - Get balances
- PUT `/api/expenses/:id` - Update expense
- PUT `/api/expenses/:id/settle/:userId` - Mark settled
- DELETE `/api/expenses/:id` - Delete expense

### Tasks
- POST `/api/tasks` - Create task
- GET `/api/tasks/room/:roomId` - List room tasks
- GET `/api/tasks/my-tasks` - Get user's tasks
- PUT `/api/tasks/:id/status` - Update status
- PUT `/api/tasks/:id` - Update task
- DELETE `/api/tasks/:id` - Delete task
- POST `/api/tasks/room/:roomId/rotate` - Manual rotation

## License
MIT License - Free to use and modify
