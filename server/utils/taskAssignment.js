/**
 * Auto-assign tasks to roommates in a fair rotation
 */
const Task = require('../models/Task');
const Room = require('../models/Room');

/**
 * Get the next user in rotation for task assignment
 * @param {Array} members - Array of room members
 * @param {String} roomId - Room ID
 * @param {String} taskCategory - Category of the task
 * @returns {ObjectId} - User ID to assign the task to
 */
async function getNextAssignee(members, roomId, taskCategory) {
  if (!members || members.length === 0) {
    throw new Error('No members available for task assignment');
  }

  // Get recent tasks for this room and category
  const recentTasks = await Task.find({
    room: roomId,
    category: taskCategory,
    assignedTo: { $exists: true }
  })
  .sort({ createdAt: -1 })
  .limit(members.length)
  .populate('assignedTo');

  // Count assignments per member
  const assignmentCounts = {};
  const lastAssignmentDates = {};
  
  members.forEach(member => {
    assignmentCounts[member.user.toString()] = 0;
    lastAssignmentDates[member.user.toString()] = null;
  });

  recentTasks.forEach(task => {
    if (task.assignedTo && assignmentCounts.hasOwnProperty(task.assignedTo._id.toString())) {
      const userId = task.assignedTo._id.toString();
      assignmentCounts[userId]++;
      
      // Track most recent assignment date
      if (!lastAssignmentDates[userId] || task.createdAt > lastAssignmentDates[userId]) {
        lastAssignmentDates[userId] = task.createdAt;
      }
    }
  });

  // Find member with least assignments, using last assignment date as tie-breaker
  let minAssignments = Infinity;
  let candidates = [];

  members.forEach(member => {
    const userId = member.user.toString();
    if (assignmentCounts[userId] < minAssignments) {
      minAssignments = assignmentCounts[userId];
      candidates = [{ userId, lastDate: lastAssignmentDates[userId] }];
    } else if (assignmentCounts[userId] === minAssignments) {
      candidates.push({ userId, lastDate: lastAssignmentDates[userId] });
    }
  });

  // If multiple candidates, choose the one assigned longest ago (or never assigned)
  let nextAssignee = members[0].user;
  if (candidates.length === 1) {
    nextAssignee = candidates[0].userId;
  } else {
    // Sort by last assignment date (nulls first, then oldest first)
    candidates.sort((a, b) => {
      if (!a.lastDate && !b.lastDate) return 0;
      if (!a.lastDate) return -1;
      if (!b.lastDate) return 1;
      return a.lastDate - b.lastDate;
    });
    nextAssignee = candidates[0].userId;
  }

  return nextAssignee;
}

/**
 * Rotate task assignments for recurring tasks
 * @param {String} roomId - Room ID
 */
async function rotateRecurringTasks(roomId) {
  const room = await Room.findById(roomId).populate('members.user');
  if (!room || room.members.length === 0) {
    return;
  }

  const recurringTasks = await Task.find({
    room: roomId,
    'recurring.enabled': true,
    'recurring.autoAssign': true
  });

  for (const task of recurringTasks) {
    const nextAssignee = await getNextAssignee(room.members, roomId, task.category);
    task.assignedTo = nextAssignee;
    task.status = 'pending';
    task.completedAt = null;
    await task.save();
  }
}

module.exports = {
  getNextAssignee,
  rotateRecurringTasks
};
