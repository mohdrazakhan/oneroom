import React, { useState, useEffect } from 'react';
import { taskAPI } from '../services/api';

function MyTasks({ user }) {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const fetchTasks = async () => {
    try {
      const status = filter === 'all' ? null : filter;
      const response = await taskAPI.getMyTasks(status);
      setTasks(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load tasks:', err);
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskAPI.updateStatus(taskId, newStatus);
      fetchTasks();
    } catch (err) {
      alert('Failed to update task status');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  return (
    <div>
      <div className="card">
        <h2>My Tasks</h2>
        <p>All tasks assigned to you across your rooms.</p>
      </div>

      <div className="card">
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <button
            className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'} btn-small`}
            onClick={() => setFilter('all')}
          >
            All ({tasks.length})
          </button>
          <button
            className={`btn ${filter === 'pending' ? 'btn-primary' : 'btn-secondary'} btn-small`}
            onClick={() => setFilter('pending')}
          >
            Pending ({pendingTasks.length})
          </button>
          <button
            className={`btn ${filter === 'in-progress' ? 'btn-primary' : 'btn-secondary'} btn-small`}
            onClick={() => setFilter('in-progress')}
          >
            In Progress ({inProgressTasks.length})
          </button>
          <button
            className={`btn ${filter === 'completed' ? 'btn-primary' : 'btn-secondary'} btn-small`}
            onClick={() => setFilter('completed')}
          >
            Completed ({completedTasks.length})
          </button>
        </div>

        {tasks.length === 0 ? (
          <p>No tasks found.</p>
        ) : (
          tasks.map(task => (
            <div key={task._id} className="list-item">
              <div className="list-item-content">
                <h4>{task.title}</h4>
                <p>
                  <span className={`tag tag-${task.priority}`}>{task.priority}</span>
                  <span className={`tag tag-${task.status}`}>{task.status}</span>
                  {task.room?.name && `Room: ${task.room.name}`}
                  {task.dueDate && ` • Due: ${new Date(task.dueDate).toLocaleDateString()}`}
                  {task.recurring?.enabled && ' • 🔄 Recurring'}
                </p>
                {task.description && <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>{task.description}</p>}
              </div>
              <div className="list-item-actions">
                {task.status === 'pending' && (
                  <>
                    <button
                      className="btn btn-secondary btn-small"
                      onClick={() => handleStatusChange(task._id, 'in-progress')}
                    >
                      Start
                    </button>
                    <button
                      className="btn btn-success btn-small"
                      onClick={() => handleStatusChange(task._id, 'completed')}
                    >
                      Complete
                    </button>
                  </>
                )}
                {task.status === 'in-progress' && (
                  <button
                    className="btn btn-success btn-small"
                    onClick={() => handleStatusChange(task._id, 'completed')}
                  >
                    Complete
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyTasks;
