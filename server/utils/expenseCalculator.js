/**
 * Expense calculation and splitting utilities
 */

/**
 * Calculate equal split of an expense
 * @param {Number} totalAmount - Total expense amount
 * @param {Array} members - Array of user IDs to split between
 * @returns {Array} - Array of split objects with user and amount
 */
function calculateEqualSplit(totalAmount, members) {
  if (!members || members.length === 0) {
    throw new Error('No members to split expense between');
  }

  const amountPerPerson = parseFloat((totalAmount / members.length).toFixed(2));
  
  return members.map(userId => ({
    user: userId,
    amount: amountPerPerson,
    settled: false
  }));
}

/**
 * Calculate custom split of an expense
 * @param {Number} totalAmount - Total expense amount
 * @param {Array} customSplits - Array of {userId, percentage} objects
 * @returns {Array} - Array of split objects with user and amount
 */
function calculateCustomSplit(totalAmount, customSplits) {
  if (!customSplits || customSplits.length === 0) {
    throw new Error('No custom splits provided');
  }

  // Validate percentages sum to 100
  const totalPercentage = customSplits.reduce((sum, split) => sum + split.percentage, 0);
  if (Math.abs(totalPercentage - 100) > 0.01) {
    throw new Error('Custom split percentages must sum to 100');
  }

  return customSplits.map(split => ({
    user: split.userId,
    amount: parseFloat((totalAmount * split.percentage / 100).toFixed(2)),
    settled: false
  }));
}

/**
 * Calculate balance summary for a room
 * @param {Array} expenses - Array of expense documents
 * @param {Array} members - Array of member user IDs
 * @returns {Object} - Balance summary with who owes whom
 */
function calculateBalances(expenses, members) {
  const balances = {};
  
  // Initialize balances
  members.forEach(memberId => {
    balances[memberId.toString()] = 0;
  });

  // Calculate net balances
  expenses.forEach(expense => {
    const paidById = expense.paidBy.toString();
    
    // First, the payer is credited with the full amount they paid
    balances[paidById] += expense.amount;
    
    // Then, each person (including the payer) is debited their share
    expense.splitBetween.forEach(split => {
      const userId = split.user.toString();
      
      if (!split.settled) {
        balances[userId] -= split.amount;
      }
    });
  });

  // Create simplified settlement plan
  const settlements = [];
  const debtors = [];
  const creditors = [];

  Object.keys(balances).forEach(userId => {
    if (balances[userId] > 0.01) {
      creditors.push({ user: userId, amount: balances[userId] });
    } else if (balances[userId] < -0.01) {
      debtors.push({ user: userId, amount: Math.abs(balances[userId]) });
    }
  });

  // Create settlement transactions
  let i = 0, j = 0;
  while (i < debtors.length && j < creditors.length) {
    const debt = debtors[i].amount;
    const credit = creditors[j].amount;
    const settleAmount = Math.min(debt, credit);

    settlements.push({
      from: debtors[i].user,
      to: creditors[j].user,
      amount: parseFloat(settleAmount.toFixed(2))
    });

    debtors[i].amount -= settleAmount;
    creditors[j].amount -= settleAmount;

    if (debtors[i].amount < 0.01) i++;
    if (creditors[j].amount < 0.01) j++;
  }

  return {
    balances,
    settlements
  };
}

module.exports = {
  calculateEqualSplit,
  calculateCustomSplit,
  calculateBalances
};
