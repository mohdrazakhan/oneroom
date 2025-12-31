import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { roomAPI, taskAPI } from '../services/api';

function Dashboard({ user }) {
  const [rooms, setRooms] = useState([]);
  const [myTasks, setMyTasks] = useState([]);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showJoinRoom, setShowJoinRoom] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [roomsRes, tasksRes] = await Promise.all([
        roomAPI.getAll(),
        taskAPI.getMyTasks('pending')
      ]);
      setRooms(roomsRes.data);
      setMyTasks(tasksRes.data.slice(0, 5)); // Show only 5 recent tasks
      setLoading(false);
    } catch (err) {
      setError('Failed to load data');
      setLoading(false);
    }
  };

  const CreateRoomModal = () => {
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [creating, setCreating] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setCreating(true);
      try {
        await roomAPI.create(formData);
        setShowCreateRoom(false);
        fetchData();
      } catch (err) {
        alert(err.response?.data?.error || 'Failed to create room');
      } finally {
        setCreating(false);
      }
    };

    return (
      <div className="modal-overlay" onClick={() => setShowCreateRoom(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Create New Room</h3>
            <button className="close-btn" onClick={() => setShowCreateRoom(false)}>&times;</button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Room Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Description (optional)</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={creating}>
              {creating ? 'Creating...' : 'Create Room'}
            </button>
          </form>
        </div>
      </div>
    );
  };

  const JoinRoomModal = () => {
    const [inviteCode, setInviteCode] = useState('');
    const [joining, setJoining] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setJoining(true);
      try {
        await roomAPI.join(inviteCode);
        setShowJoinRoom(false);
        fetchData();
      } catch (err) {
        alert(err.response?.data?.error || 'Failed to join room');
      } finally {
        setJoining(false);
      }
    };

    return (
      <div className="modal-overlay" onClick={() => setShowJoinRoom(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Join Room</h3>
            <button className="close-btn" onClick={() => setShowJoinRoom(false)}>&times;</button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Invite Code</label>
              <input
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                placeholder="Enter invite code"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={joining}>
              {joining ? 'Joining...' : 'Join Room'}
            </button>
          </form>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div>
      <div className="card">
        <h2>👋 Welcome, {user.name}!</h2>
        <p>Manage your shared expenses and tasks with your roommates.</p>
      </div>

      <div className="dashboard-grid">
        <div className="stat-card">
          <h3>{rooms.length}</h3>
          <p>Rooms</p>
        </div>
        <div className="stat-card">
          <h3>{myTasks.length}</h3>
          <p>Pending Tasks</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>My Rooms</h2>
          <div>
            <button className="btn btn-primary btn-small" onClick={() => setShowCreateRoom(true)} style={{ marginRight: '0.5rem' }}>
              Create Room
            </button>
            <button className="btn btn-secondary btn-small" onClick={() => setShowJoinRoom(true)}>
              Join Room
            </button>
          </div>
        </div>

        {rooms.length === 0 ? (
          <p>You haven't joined any rooms yet. Create one or join using an invite code!</p>
        ) : (
          rooms.map(room => (
            <div key={room._id} className="list-item">
              <div className="list-item-content">
                <h4>{room.name}</h4>
                <p>{room.members.length} members • Code: {room.inviteCode}</p>
              </div>
              <div className="list-item-actions">
                <Link to={`/room/${room._id}`}>
                  <button className="btn btn-primary btn-small">View</button>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>Recent Tasks</h2>
          <Link to="/my-tasks">
            <button className="btn btn-secondary btn-small">View All</button>
          </Link>
        </div>

        {myTasks.length === 0 ? (
          <p>No pending tasks assigned to you.</p>
        ) : (
          myTasks.map(task => (
            <div key={task._id} className="list-item">
              <div className="list-item-content">
                <h4>{task.title}</h4>
                <p>
                  <span className={`tag tag-${task.priority}`}>{task.priority}</span>
                  <span className={`tag tag-${task.status}`}>{task.status}</span>
                  {task.room?.name}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {showCreateRoom && <CreateRoomModal />}
      {showJoinRoom && <JoinRoomModal />}
    </div>
  );
}

export default Dashboard;
