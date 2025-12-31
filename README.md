# 🏠 OneRoom - Roommate Management Application

OneRoom is a comprehensive web application designed to simplify roommate life by managing shared expenses and automatically assigning daily tasks among roommates.

## ✨ Features

### 💰 Expense Management
- **Easy Expense Tracking**: Add and track all shared expenses
- **Automatic Splitting**: Expenses are automatically split equally among all roommates
- **Custom Splits**: Support for custom percentage-based splits
- **Category Organization**: Categorize expenses (groceries, utilities, rent, entertainment, etc.)
- **Balance Calculation**: Automatic calculation of who owes whom
- **Settlement Tracking**: Mark expenses as settled when payments are made
- **Smart Settlement Plan**: Minimizes the number of transactions needed to settle all debts

### ✅ Task Management
- **Task Assignment**: Create and assign tasks to roommates
- **Auto-Assignment**: Fair rotation system that automatically assigns tasks
- **Recurring Tasks**: Set up daily, weekly, or monthly recurring tasks with auto-rotation
- **Task Categories**: Organize tasks by type (cleaning, cooking, shopping, maintenance)
- **Priority Levels**: Set task priorities (low, medium, high)
- **Status Tracking**: Track task status (pending, in-progress, completed)
- **Due Dates**: Set and track task deadlines
- **Personal Dashboard**: View all your assigned tasks in one place

### 👥 Room & User Management
- **Multiple Rooms**: Support for multiple shared living spaces
- **Easy Onboarding**: Simple registration and login
- **Invite System**: Unique invite codes for each room
- **Role-Based Access**: Admin and member roles with appropriate permissions
- **Member Management**: Add/remove members from rooms

### 🎨 Additional Features
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Intuitive Dashboard**: Clean overview of all your rooms, expenses, and tasks
- **Real-time Updates**: Instant updates when roommates add expenses or tasks
- **Attractive UI**: Modern, gradient-based design with smooth animations
- **Secure Authentication**: JWT-based authentication with password hashing

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/mohdrazakhan/oneroom.git
cd oneroom
```

2. **Install dependencies**
```bash
# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

3. **Set up environment variables**
```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your configuration
# Required variables:
# - MONGODB_URI: Your MongoDB connection string
# - JWT_SECRET: A secure random string for JWT tokens
# - PORT: Server port (default: 5000)
```

4. **Start MongoDB**
```bash
# If running MongoDB locally
mongod
```

5. **Run the application**

Development mode (runs both server and client):
```bash
npm run dev-all
```

Or run separately:
```bash
# Terminal 1 - Start the server
npm run dev

# Terminal 2 - Start the client
npm run client
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Production Build

```bash
# Build the client
npm run build

# Start the server
npm start
```

## 📖 Usage Guide

### Creating Your First Room

1. **Register/Login**: Create an account or login
2. **Create a Room**: Click "Create Room" on the dashboard
3. **Share Invite Code**: Share the generated invite code with your roommates
4. **They Join**: Roommates use the invite code to join your room

### Managing Expenses

1. **Add an Expense**: 
   - Go to your room
   - Click "Add Expense" in the Expenses tab
   - Enter description, amount, and category
   - The expense will be automatically split equally among all members

2. **View Balances**:
   - Check the Overview tab to see who owes whom
   - The app calculates the minimum number of transactions needed

3. **Settle Up**:
   - When someone pays their share, mark it as settled
   - The balance summary updates automatically

### Managing Tasks

1. **Create a Task**:
   - Go to your room
   - Click "Add Task" in the Tasks tab
   - Set title, category, priority, and due date
   - The task will be auto-assigned fairly

2. **Recurring Tasks**:
   - Enable "Recurring Task" when creating
   - Choose frequency (daily, weekly, monthly)
   - Tasks automatically rotate to the next person after completion

3. **Complete Tasks**:
   - View your tasks in "My Tasks"
   - Click "Complete" when done
   - For recurring tasks, a new instance is created and assigned to the next person

## 🏗️ Project Structure

```
oneroom/
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── components/     # Reusable components
│       ├── pages/          # Page components
│       ├── services/       # API services
│       └── utils/          # Utility functions
├── server/                 # Express backend
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── utils/             # Utility functions
│   └── index.js           # Server entry point
├── .env.example           # Example environment variables
├── .gitignore
├── package.json
└── README.md
```

## 🛠️ Tech Stack

### Frontend
- **React 18**: UI library
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **CSS3**: Styling with modern features

### Backend
- **Node.js**: Runtime environment
- **Express**: Web framework
- **MongoDB**: Database
- **Mongoose**: ODM for MongoDB
- **JWT**: Authentication
- **bcryptjs**: Password hashing

## 🔐 Security

- Passwords are hashed using bcrypt
- JWT tokens for secure authentication
- Protected API routes with authentication middleware
- Input validation and sanitization
- CORS enabled for cross-origin requests

## 📱 API Documentation

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile

### Rooms
- `POST /api/rooms` - Create new room
- `GET /api/rooms` - Get all user's rooms
- `GET /api/rooms/:id` - Get room details
- `POST /api/rooms/join` - Join room with invite code
- `PUT /api/rooms/:id` - Update room
- `DELETE /api/rooms/:id/members/:userId` - Remove member

### Expenses
- `POST /api/expenses` - Create expense
- `GET /api/expenses/room/:roomId` - Get room expenses
- `GET /api/expenses/room/:roomId/balances` - Get balance summary
- `PUT /api/expenses/:id` - Update expense
- `PUT /api/expenses/:id/settle/:userId` - Mark as settled
- `DELETE /api/expenses/:id` - Delete expense

### Tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks/room/:roomId` - Get room tasks
- `GET /api/tasks/my-tasks` - Get user's tasks
- `PUT /api/tasks/:id/status` - Update task status
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `POST /api/tasks/room/:roomId/rotate` - Rotate recurring tasks

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Created with ❤️ for making roommate life easier!

## 🙏 Acknowledgments

- Thanks to all roommates who inspired this project
- Built with modern web technologies for the best user experience