import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { roomAPI, expenseAPI, taskAPI } from '../services/api';

function RoomDetails({ user }) {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [balances, setBalances] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoomData();
  }, [id]);

  const fetchRoomData = async () => {
    try {
      const [roomRes, expensesRes, tasksRes, balancesRes] = await Promise.all([
        roomAPI.getById(id),
        expenseAPI.getByRoom(id),
        taskAPI.getByRoom(id),
        expenseAPI.getBalances(id)
      ]);
      setRoom(roomRes.data);
      setExpenses(expensesRes.data);
      setTasks(tasksRes.data);
      setBalances(balancesRes.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load room data:', err);
      setLoading(false);
    }
  };

  const AddExpenseModal = () => {
    const [formData, setFormData] = useState({
      description: '',
      amount: '',
      category: 'other'
    });
    const [creating, setCreating] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setCreating(true);
      try {
        await expenseAPI.create({
          roomId: id,
          ...formData,
          amount: parseFloat(formData.amount)
        });
        setShowAddExpense(false);
        fetchRoomData();
      } catch (err) {
        alert(err.response?.data?.error || 'Failed to add expense');
      } finally {
        setCreating(false);
      }
    };

    return (
      <div className="modal-overlay" onClick={() => setShowAddExpense(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Add Expense</h3>
            <button className="close-btn" onClick={() => setShowAddExpense(false)}>&times;</button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Amount ($)</label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="groceries">Groceries</option>
                <option value="utilities">Utilities</option>
                <option value="rent">Rent</option>
                <option value="entertainment">Entertainment</option>
                <option value="other">Other</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary" disabled={creating}>
              {creating ? 'Adding...' : 'Add Expense'}
            </button>
          </form>
        </div>
      </div>
    );
  };

  const AddTaskModal = () => {
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      category: 'other',
      priority: 'medium',
      dueDate: '',
      recurring: { enabled: false, frequency: 'daily', autoAssign: true }
    });
    const [creating, setCreating] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setCreating(true);
      try {
        await taskAPI.create({
          roomId: id,
          ...formData
        });
        setShowAddTask(false);
        fetchRoomData();
      } catch (err) {
        alert(err.response?.data?.error || 'Failed to add task');
      } finally {
        setCreating(false);
      }
    };

    return (
      <div className="modal-overlay" onClick={() => setShowAddTask(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Add Task</h3>
            <button className="close-btn" onClick={() => setShowAddTask(false)}>&times;</button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="cleaning">Cleaning</option>
                <option value="cooking">Cooking</option>
                <option value="shopping">Shopping</option>
                <option value="maintenance">Maintenance</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="form-group">
              <label>Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.recurring.enabled}
                  onChange={(e) => setFormData({
                    ...formData,
                    recurring: { ...formData.recurring, enabled: e.target.checked }
                  })}
                />
                {' '}Recurring Task (Auto-assign)
              </label>
            </div>
            {formData.recurring.enabled && (
              <div className="form-group">
                <label>Frequency</label>
                <select
                  value={formData.recurring.frequency}
                  onChange={(e) => setFormData({
                    ...formData,
                    recurring: { ...formData.recurring, frequency: e.target.value }
                  })}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            )}
            <button type="submit" className="btn btn-primary" disabled={creating}>
              {creating ? 'Adding...' : 'Add Task'}
            </button>
          </form>
        </div>
      </div>
    );
  };

  const handleTaskStatusChange = async (taskId, newStatus) => {
    try {
      await taskAPI.updateStatus(taskId, newStatus);
      fetchRoomData();
    } catch (err) {
      alert('Failed to update task status');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!room) {
    return <div className="card">Room not found</div>;
  }

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div>
      <div className="card">
        <h2>{room.name}</h2>
        {room.description && <p>{room.description}</p>}
        <p style={{ color: '#666', marginTop: '0.5rem' }}>
          Invite Code: <strong>{room.inviteCode}</strong> • {room.members.length} members
        </p>
      </div>

      <div className="card">
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', borderBottom: '2px solid #eee', paddingBottom: '0.5rem' }}>
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              background: 'none',
              border: 'none',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              borderBottom: activeTab === 'overview' ? '2px solid #667eea' : 'none',
              fontWeight: activeTab === 'overview' ? 'bold' : 'normal'
            }}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('expenses')}
            style={{
              background: 'none',
              border: 'none',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              borderBottom: activeTab === 'expenses' ? '2px solid #667eea' : 'none',
              fontWeight: activeTab === 'expenses' ? 'bold' : 'normal'
            }}
          >
            Expenses
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            style={{
              background: 'none',
              border: 'none',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              borderBottom: activeTab === 'tasks' ? '2px solid #667eea' : 'none',
              fontWeight: activeTab === 'tasks' ? 'bold' : 'normal'
            }}
          >
            Tasks
          </button>
          <button
            onClick={() => setActiveTab('members')}
            style={{
              background: 'none',
              border: 'none',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              borderBottom: activeTab === 'members' ? '2px solid #667eea' : 'none',
              fontWeight: activeTab === 'members' ? 'bold' : 'normal'
            }}
          >
            Members
          </button>
        </div>

        {activeTab === 'overview' && (
          <div>
            <div className="dashboard-grid">
              <div className="stat-card">
                <h3>${totalExpenses.toFixed(2)}</h3>
                <p>Total Expenses</p>
              </div>
              <div className="stat-card">
                <h3>{tasks.filter(t => t.status === 'pending').length}</h3>
                <p>Pending Tasks</p>
              </div>
            </div>

            {balances && balances.settlements.length > 0 && (
              <div>
                <h3>Settlement Summary</h3>
                {balances.settlements.map((settlement, index) => (
                  <div key={index} className="list-item">
                    <div className="list-item-content">
                      <p>
                        <strong>{settlement.from?.name || 'Unknown'}</strong> owes{' '}
                        <strong>{settlement.to?.name || 'Unknown'}</strong>
                      </p>
                    </div>
                    <div>
                      <strong style={{ color: '#28a745' }}>${settlement.amount.toFixed(2)}</strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'expenses' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3>Expenses</h3>
              <button className="btn btn-primary btn-small" onClick={() => setShowAddExpense(true)}>
                Add Expense
              </button>
            </div>
            {expenses.length === 0 ? (
              <p>No expenses yet. Add your first expense!</p>
            ) : (
              expenses.map(expense => (
                <div key={expense._id} className="list-item">
                  <div className="list-item-content">
                    <h4>{expense.description}</h4>
                    <p>
                      Paid by {expense.paidBy.name} • {expense.category} •{' '}
                      {new Date(expense.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <strong style={{ color: '#667eea' }}>${expense.amount.toFixed(2)}</strong>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'tasks' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3>Tasks</h3>
              <button className="btn btn-primary btn-small" onClick={() => setShowAddTask(true)}>
                Add Task
              </button>
            </div>
            {tasks.length === 0 ? (
              <p>No tasks yet. Add your first task!</p>
            ) : (
              tasks.map(task => (
                <div key={task._id} className="list-item">
                  <div className="list-item-content">
                    <h4>{task.title}</h4>
                    <p>
                      <span className={`tag tag-${task.priority}`}>{task.priority}</span>
                      <span className={`tag tag-${task.status}`}>{task.status}</span>
                      {task.assignedTo && `Assigned to: ${task.assignedTo.name}`}
                      {task.recurring.enabled && ' • 🔄 Recurring'}
                    </p>
                  </div>
                  <div className="list-item-actions">
                    {task.status === 'pending' && (
                      <button
                        className="btn btn-success btn-small"
                        onClick={() => handleTaskStatusChange(task._id, 'completed')}
                      >
                        Complete
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'members' && (
          <div>
            <h3>Members ({room.members.length})</h3>
            {room.members.map(member => (
              <div key={member.user._id} className="list-item">
                <div className="list-item-content">
                  <h4>{member.user.name}</h4>
                  <p>{member.user.email} • {member.role}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddExpense && <AddExpenseModal />}
      {showAddTask && <AddTaskModal />}
    </div>
  );
}

export default RoomDetails;
