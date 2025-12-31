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
  members.forEach(member => {
    assignmentCounts[member.user.toString()] = 0;
  });

  recentTasks.forEach(task => {
    if (task.assignedTo && assignmentCounts.hasOwnProperty(task.assignedTo._id.toString())) {
      assignmentCounts[task.assignedTo._id.toString()]++;
    }
  });

  // Find member with least assignments
  let minAssignments = Infinity;
  let nextAssignee = members[0].user;

  members.forEach(member => {
    const userId = member.user.toString();
    if (assignmentCounts[userId] < minAssignments) {
      minAssignments = assignmentCounts[userId];
      nextAssignee = member.user;
    }
  });

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
