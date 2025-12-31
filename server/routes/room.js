const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Room = require('../models/Room');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const { apiLimiter, createLimiter } = require('../middleware/rateLimiter');

// Create a new room
router.post('/', auth, createLimiter, async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Room name is required' });
    }

    // Generate unique invite code
    const inviteCode = uuidv4().substring(0, 8).toUpperCase();

    const room = new Room({
      name,
      description,
      members: [{
        user: req.userId,
        role: 'admin'
      }],
      inviteCode,
      createdBy: req.userId
    });

    await room.save();

    // Add room to user's rooms
    await User.findByIdAndUpdate(req.userId, {
      $push: { rooms: room._id }
    });

    res.status(201).json(room);
  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({ error: 'Failed to create room' });
  }
});

// Get all rooms for current user
router.get('/', auth, apiLimiter, async (req, res) => {
  try {
    const rooms = await Room.find({
      'members.user': req.userId
    }).populate('members.user', 'name email');

    res.json(rooms);
  } catch (error) {
    console.error('Get rooms error:', error);
    res.status(500).json({ error: 'Failed to get rooms' });
  }
});

// Get a specific room
router.get('/:id', auth, apiLimiter, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate('members.user', 'name email');

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Check if user is a member
    const isMember = room.members.some(m => m.user._id.toString() === req.userId);
    if (!isMember) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(room);
  } catch (error) {
    console.error('Get room error:', error);
    res.status(500).json({ error: 'Failed to get room' });
  }
});

// Join a room with invite code
router.post('/join', auth, createLimiter, async (req, res) => {
  try {
    const { inviteCode } = req.body;

    if (!inviteCode) {
      return res.status(400).json({ error: 'Invite code is required' });
    }

    const room = await Room.findOne({ inviteCode });

    if (!room) {
      return res.status(404).json({ error: 'Invalid invite code' });
    }

    // Check if already a member
    const isMember = room.members.some(m => m.user.toString() === req.userId);
    if (isMember) {
      return res.status(400).json({ error: 'Already a member of this room' });
    }

    // Add user to room
    room.members.push({
      user: req.userId,
      role: 'member'
    });
    await room.save();

    // Add room to user's rooms
    await User.findByIdAndUpdate(req.userId, {
      $push: { rooms: room._id }
    });

    const populatedRoom = await Room.findById(room._id)
      .populate('members.user', 'name email');

    res.json(populatedRoom);
  } catch (error) {
    console.error('Join room error:', error);
    res.status(500).json({ error: 'Failed to join room' });
  }
});

// Update room
router.put('/:id', auth, apiLimiter, async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Check if user is admin
    const member = room.members.find(m => m.user.toString() === req.userId);
    if (!member || member.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can update room' });
    }

    room.name = name || room.name;
    room.description = description || room.description;
    await room.save();

    res.json(room);
  } catch (error) {
    console.error('Update room error:', error);
    res.status(500).json({ error: 'Failed to update room' });
  }
});

// Remove member from room
router.delete('/:id/members/:userId', auth, apiLimiter, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Check if user is admin or removing themselves
    const member = room.members.find(m => m.user.toString() === req.userId);
    const isAdmin = member && member.role === 'admin';
    const isSelf = req.params.userId === req.userId;

    if (!isAdmin && !isSelf) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Remove member
    room.members = room.members.filter(m => m.user.toString() !== req.params.userId);
    await room.save();

    // Remove room from user's rooms
    await User.findByIdAndUpdate(req.params.userId, {
      $pull: { rooms: room._id }
    });

    res.json({ message: 'Member removed successfully' });
  } catch (error) {
    console.error('Remove member error:', error);
    res.status(500).json({ error: 'Failed to remove member' });
  }
});

module.exports = router;
