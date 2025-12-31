const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const Room = require('../models/Room');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const { calculateEqualSplit, calculateCustomSplit, calculateBalances } = require('../utils/expenseCalculator');
const { apiLimiter, createLimiter } = require('../middleware/rateLimiter');

// Create a new expense
router.post('/', createLimiter, auth, async (req, res) => {
  try {
    const { roomId, description, amount, category, splitType, customSplits } = req.body;

    if (!roomId || !description || !amount) {
      return res.status(400).json({ error: 'Room ID, description, and amount are required' });
    }

    // Verify room exists and user is a member
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    const isMember = room.members.some(m => m.user.toString() === req.userId);
    if (!isMember) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Calculate split
    let splitBetween;
    const memberIds = room.members.map(m => m.user);

    if (splitType === 'custom' && customSplits) {
      splitBetween = calculateCustomSplit(amount, customSplits);
    } else {
      // Default to equal split among all members
      splitBetween = calculateEqualSplit(amount, memberIds);
    }

    const expense = new Expense({
      room: roomId,
      description,
      amount,
      paidBy: req.userId,
      splitBetween,
      category: category || 'other'
    });

    await expense.save();

    const populatedExpense = await Expense.findById(expense._id)
      .populate('paidBy', 'name email')
      .populate('splitBetween.user', 'name email');

    res.status(201).json(populatedExpense);
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({ error: error.message || 'Failed to create expense' });
  }
});

// Get all expenses for a room
router.get('/room/:roomId', apiLimiter, auth, async (req, res) => {
  try {
    const { roomId } = req.params;

    // Verify room exists and user is a member
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    const isMember = room.members.some(m => m.user.toString() === req.userId);
    if (!isMember) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const expenses = await Expense.find({ room: roomId })
      .populate('paidBy', 'name email')
      .populate('splitBetween.user', 'name email')
      .sort({ date: -1 });

    res.json(expenses);
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({ error: 'Failed to get expenses' });
  }
});

// Get balance summary for a room
router.get('/room/:roomId/balances', apiLimiter, auth, async (req, res) => {
  try {
    const { roomId } = req.params;

    // Verify room exists and user is a member
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    const isMember = room.members.some(m => m.user.toString() === req.userId);
    if (!isMember) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const expenses = await Expense.find({ room: roomId })
      .populate('paidBy', 'name email')
      .populate('splitBetween.user', 'name email');

    const memberIds = room.members.map(m => m.user);
    const balanceSummary = calculateBalances(expenses, memberIds);

    // Populate user details in settlements
    const populatedRoom = await Room.findById(roomId).populate('members.user', 'name email');
    const populatedSettlements = balanceSummary.settlements.map((settlement) => {
      const fromUser = populatedRoom.members.find(m => m.user._id.toString() === settlement.from);
      const toUser = populatedRoom.members.find(m => m.user._id.toString() === settlement.to);

      return {
        from: fromUser ? fromUser.user : null,
        to: toUser ? toUser.user : null,
        amount: settlement.amount
      };
    });

    res.json({
      balances: balanceSummary.balances,
      settlements: populatedSettlements
    });
  } catch (error) {
    console.error('Get balances error:', error);
    res.status(500).json({ error: 'Failed to get balances' });
  }
});

// Update expense
router.put('/:id', apiLimiter, auth, async (req, res) => {
  try {
    const { description, amount, category } = req.body;
    
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    // Only the person who paid can update
    if (expense.paidBy.toString() !== req.userId) {
      return res.status(403).json({ error: 'Only the payer can update this expense' });
    }

    expense.description = description || expense.description;
    expense.category = category || expense.category;
    
    // Only update amount if provided and different
    // Note: Updating amount will recalculate as equal split
    // Custom splits are not preserved when changing amounts
    if (amount && amount !== expense.amount) {
      const room = await Room.findById(expense.room);
      const memberIds = room.members.map(m => m.user);
      expense.amount = amount;
      // Recalculate with equal split (custom splits are lost)
      expense.splitBetween = calculateEqualSplit(amount, memberIds);
    }

    await expense.save();

    const populatedExpense = await Expense.findById(expense._id)
      .populate('paidBy', 'name email')
      .populate('splitBetween.user', 'name email');

    res.json(populatedExpense);
  } catch (error) {
    console.error('Update expense error:', error);
    res.status(500).json({ error: 'Failed to update expense' });
  }
});

// Mark expense split as settled
router.put('/:id/settle/:userId', apiLimiter, auth, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    // Only the payer can mark as settled
    if (expense.paidBy.toString() !== req.userId) {
      return res.status(403).json({ error: 'Only the payer can settle expenses' });
    }

    // Find and update the split
    const split = expense.splitBetween.find(s => s.user.toString() === req.params.userId);
    if (!split) {
      return res.status(404).json({ error: 'User not found in expense split' });
    }

    split.settled = true;
    await expense.save();

    const populatedExpense = await Expense.findById(expense._id)
      .populate('paidBy', 'name email')
      .populate('splitBetween.user', 'name email');

    res.json(populatedExpense);
  } catch (error) {
    console.error('Settle expense error:', error);
    res.status(500).json({ error: 'Failed to settle expense' });
  }
});

// Delete expense
router.delete('/:id', apiLimiter, auth, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    // Only the person who paid can delete
    if (expense.paidBy.toString() !== req.userId) {
      return res.status(403).json({ error: 'Only the payer can delete this expense' });
    }

    await Expense.findByIdAndDelete(req.params.id);

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

module.exports = router;
