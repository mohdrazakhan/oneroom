const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Room = require('../models/Room');
const { auth } = require('../middleware/auth');
const { getNextAssignee, rotateRecurringTasks } = require('../utils/taskAssignment');

// Create a new task
router.post('/', auth, async (req, res) => {
  try {
    const { roomId, title, description, assignedTo, category, priority, dueDate, recurring } = req.body;

    if (!roomId || !title) {
      return res.status(400).json({ error: 'Room ID and title are required' });
    }

    // Verify room exists and user is a member
    const room = await Room.findById(roomId).populate('members.user');
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    const isMember = room.members.some(m => m.user._id.toString() === req.userId);
    if (!isMember) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Auto-assign if not specified and auto-assign is enabled (default: true)
    let taskAssignee = assignedTo;
    const shouldAutoAssign = !assignedTo && (recurring?.autoAssign !== false);
    
    if (shouldAutoAssign) {
      taskAssignee = await getNextAssignee(room.members, roomId, category || 'other');
    }

    const task = new Task({
      room: roomId,
      title,
      description,
      assignedTo: taskAssignee,
      category: category || 'other',
      priority: priority || 'medium',
      dueDate,
      recurring: recurring || { enabled: false }
    });

    await task.save();

    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email');

    res.status(201).json(populatedTask);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: error.message || 'Failed to create task' });
  }
});

// Get all tasks for a room
router.get('/room/:roomId', auth, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { status } = req.query;

    // Verify room exists and user is a member
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    const isMember = room.members.some(m => m.user.toString() === req.userId);
    if (!isMember) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const query = { room: roomId };
    if (status) {
      query.status = status;
    }

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email')
      .sort({ dueDate: 1, priority: -1 });

    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Failed to get tasks' });
  }
});

// Get tasks assigned to current user
router.get('/my-tasks', auth, async (req, res) => {
  try {
    const { status } = req.query;

    const query = { assignedTo: req.userId };
    if (status) {
      query.status = status;
    }

    const tasks = await Task.find(query)
      .populate('room', 'name')
      .sort({ dueDate: 1, priority: -1 });

    res.json(tasks);
  } catch (error) {
    console.error('Get my tasks error:', error);
    res.status(500).json({ error: 'Failed to get tasks' });
  }
});

// Update task status
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'in-progress', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Verify user is assigned to this task or is a room member
    const room = await Room.findById(task.room);
    const isMember = room.members.some(m => m.user.toString() === req.userId);
    
    if (!isMember) {
      return res.status(403).json({ error: 'Access denied' });
    }

    task.status = status;
    if (status === 'completed') {
      task.completedAt = new Date();
      
      // If recurring, create next occurrence
      if (task.recurring.enabled) {
        const nextTask = new Task({
          room: task.room,
          title: task.title,
          description: task.description,
          category: task.category,
          priority: task.priority,
          recurring: task.recurring,
          status: 'pending'
        });

        // Calculate next due date
        if (task.dueDate) {
          const nextDueDate = new Date(task.dueDate);
          if (task.recurring.frequency === 'daily') {
            nextDueDate.setDate(nextDueDate.getDate() + 1);
          } else if (task.recurring.frequency === 'weekly') {
            nextDueDate.setDate(nextDueDate.getDate() + 7);
          } else if (task.recurring.frequency === 'monthly') {
            // Handle month-end edge cases
            const currentDay = nextDueDate.getDate();
            nextDueDate.setMonth(nextDueDate.getMonth() + 1);
            // If day changed (e.g., Jan 31 -> Mar 3), set to last day of target month
            if (nextDueDate.getDate() !== currentDay) {
              nextDueDate.setDate(0); // Set to last day of previous month
            }
          }
          nextTask.dueDate = nextDueDate;
        }

        // Auto-assign next task
        if (task.recurring.autoAssign) {
          const roomWithMembers = await Room.findById(task.room).populate('members.user');
          nextTask.assignedTo = await getNextAssignee(roomWithMembers.members, task.room, task.category);
        } else {
          nextTask.assignedTo = task.assignedTo;
        }

        await nextTask.save();
      }
    }

    await task.save();

    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email');

    res.json(populatedTask);
  } catch (error) {
    console.error('Update task status error:', error);
    res.status(500).json({ error: 'Failed to update task status' });
  }
});

// Update task
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, assignedTo, category, priority, dueDate, recurring } = req.body;
    
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Verify user is a room member
    const room = await Room.findById(task.room);
    const isMember = room.members.some(m => m.user.toString() === req.userId);
    
    if (!isMember) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (assignedTo) task.assignedTo = assignedTo;
    if (category) task.category = category;
    if (priority) task.priority = priority;
    if (dueDate) task.dueDate = dueDate;
    if (recurring) task.recurring = recurring;

    await task.save();

    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email');

    res.json(populatedTask);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Verify user is a room member
    const room = await Room.findById(task.room);
    const isMember = room.members.some(m => m.user.toString() === req.userId);
    
    if (!isMember) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// Rotate recurring tasks for a room (admin only)
router.post('/room/:roomId/rotate', auth, async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Check if user is admin
    const member = room.members.find(m => m.user.toString() === req.userId);
    if (!member || member.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can rotate tasks' });
    }

    await rotateRecurringTasks(roomId);

    res.json({ message: 'Tasks rotated successfully' });
  } catch (error) {
    console.error('Rotate tasks error:', error);
    res.status(500).json({ error: 'Failed to rotate tasks' });
  }
});

module.exports = router;
