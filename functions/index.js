/**
 * Firebase Cloud Functions for OneRoom Stats
 * 
 * This file contains Cloud Functions to automatically update app statistics
 * including Play Store data (rating, downloads, reviews)
 * 
 * Setup:
 * 1. Install Firebase CLI: npm install -g firebase-tools
 * 2. Initialize functions: firebase init functions
 * 3. Install dependencies: cd functions && npm install
 * 4. Deploy: firebase deploy --only functions
 */

const functions = require('firebase-functions/v2');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

/**
 * Scheduled function to fetch Play Store data
 * Runs every 6 hours to update rating and download count
 * 
 * Schedule format: https://crontab.guru/
 * 0 star-slash-6 star star star = Every 6 hours
 */
exports.updatePlayStoreStats = functions.scheduler.onSchedule({
    schedule: '0 */6 * * *',
    timeZone: 'America/New_York', // Change to your timezone
}, async (event) => {
    try {
        // Dynamic import for ES Module
        const gplayModule = await import('google-play-scraper');
        const gplay = gplayModule.default;

        // Your app's package name on Play Store
        // Find it in: Play Console → App → Dashboard → Package name
        // Or in your Android app: android/app/build.gradle → applicationId
        const APP_ID = 'com.oneroom.app'; // Your actual package name

        console.log('Fetching Play Store data for:', APP_ID);

        // Fetch app details from Play Store
        const appData = await gplay.app({ appId: APP_ID });

        // Extract relevant stats
        const playStoreStats = {
            rating: appData.score || 0,
            ratingCount: appData.ratings || 0,
            reviews: appData.reviews || 0,
            downloads: parseDownloads(appData.installs || '0'),
            version: appData.version || 'Unknown',
            updated: appData.updated || new Date(),
            lastFetched: admin.firestore.FieldValue.serverTimestamp()
        };

        console.log('Play Store stats:', playStoreStats);

        // Update Firestore
        await db.collection('appStats').doc('playStore').set(playStoreStats, { merge: true });

        // Also update the global stats with rating and downloads
        await db.collection('appStats').doc('global').set({
            appRating: playStoreStats.rating,
            totalDownloads: playStoreStats.downloads,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        console.log('Successfully updated Play Store stats');
        return null;
    } catch (error) {
        console.error('Error updating Play Store stats:', error);
        throw error;
    }
});

/**
 * HTTP function to manually trigger Play Store stats update
 * Call this endpoint to force an update
 * 
 * Usage: https://YOUR_REGION-YOUR_PROJECT.cloudfunctions.net/fetchPlayStoreData
 */
exports.fetchPlayStoreData = functions.https.onRequest(async (req, res) => {
    try {
        // Dynamic import for ES Module
        const gplayModule = await import('google-play-scraper');
        const gplay = gplayModule.default;

        const APP_ID = 'com.oneroom.app'; // Your actual package name

        const appData = await gplay.app({ appId: APP_ID });

        const playStoreStats = {
            rating: appData.score || 0,
            ratingCount: appData.ratings || 0,
            reviews: appData.reviews || 0,
            downloads: parseDownloads(appData.installs || '0'),
            version: appData.version || 'Unknown',
            updated: appData.updated || new Date(),
            lastFetched: admin.firestore.FieldValue.serverTimestamp()
        };

        await db.collection('appStats').doc('playStore').set(playStoreStats, { merge: true });

        await db.collection('appStats').doc('global').set({
            appRating: playStoreStats.rating,
            totalDownloads: playStoreStats.downloads,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        res.json({
            success: true,
            data: playStoreStats
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * Scheduled function to calculate and update app statistics
 * Counts users, tasks, expenses from Firestore collections
 * Runs daily at midnight
 */
/**
 * Scheduled function to calculate and update app statistics
 * Counts users, expenses, and bug reports from Firestore collections
 * Runs daily at midnight to correct any drift in counters
 */
exports.updateAppStats = functions.scheduler.onSchedule({
    schedule: '0 0 * * *',
    timeZone: 'America/New_York'
}, async (event) => {
    try {
        console.log('Calculating app statistics...');

        // 1. Count Active Users
        const usersSnapshot = await db.collection('users').count().get();
        const activeUsers = usersSnapshot.data().count;

        // 2. Count & Sum Expenses (using collectionGroup to find all expenses in all rooms)
        // Note: 'expenses' must be the collection name
        const expensesCountSnapshot = await db.collectionGroup('expenses').count().get();
        const totalExpensesCount = expensesCountSnapshot.data().count;

        // Calculate total amount (sum) - optimize if possible with aggregate, otherwise manual loop
        // Ideally: await db.collectionGroup('expenses').aggregate({ total: admin.firestore.AggregateField.sum('amount') }).get();
        let expensesTracked = 0;
        try {
            // Try aggregation first (requires index)
            const expensesSumSnapshot = await db.collectionGroup('expenses')
                .aggregate({
                    totalAmount: admin.firestore.AggregateField.sum('amount')
                })
                .get();
            expensesTracked = expensesSumSnapshot.data().totalAmount || 0;
        } catch (e) {
            console.log('Aggregation failed (likely missing index), falling back to manual sum', e.message);
            const allExpenses = await db.collectionGroup('expenses').get();
            allExpenses.forEach(doc => {
                const data = doc.data();
                expensesTracked += (Number(data.amount) || 0);
            });
        }

        // 3. Count Bug Reports
        const bugsSnapshot = await db.collection('bug_reports').count().get();
        const bugReports = bugsSnapshot.data().count;

        // Update global stats
        const stats = {
            activeUsers,
            totalExpensesCount,
            expensesTracked,
            bugReports,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp()
        };

        await db.collection('appStats').doc('global').set(stats, { merge: true });

        console.log('Successfully updated app stats:', stats);
        return null;
    } catch (error) {
        console.error('Error updating app stats:', error);
        throw error;
    }
});

/**
 * HTTP function to manually force recalculation of all stats
 * Useful for initializing data or fixing drift
 * Usage: https://YOUR_REGION-YOUR_PROJECT.cloudfunctions.net/recalculateStats
 */
exports.recalculateStats = functions.https.onRequest(async (req, res) => {
    try {
        console.log('Recalculating app statistics manually...');

        // 1. Count Active Users
        const usersSnapshot = await db.collection('users').count().get();
        const activeUsers = usersSnapshot.data().count;

        // 2. Count & Sum Expenses
        const expensesCountSnapshot = await db.collectionGroup('expenses').count().get();
        const totalExpensesCount = expensesCountSnapshot.data().count;

        let expensesTracked = 0;
        try {
            const expensesSumSnapshot = await db.collectionGroup('expenses')
                .aggregate({
                    totalAmount: admin.firestore.AggregateField.sum('amount')
                })
                .get();
            expensesTracked = expensesSumSnapshot.data().totalAmount || 0;
        } catch (e) {
            console.log('Aggregation failed, falling back to manual sum', e.message);
            const allExpenses = await db.collectionGroup('expenses').get();
            allExpenses.forEach(doc => {
                const data = doc.data();
                expensesTracked += (Number(data.amount) || 0);
            });
        }

        // 3. Count Bug Reports
        const bugsSnapshot = await db.collection('bug_reports').count().get();
        const bugReports = bugsSnapshot.data().count;

        // Update global stats
        const stats = {
            activeUsers,
            totalExpensesCount,
            expensesTracked,
            bugReports,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp()
        };

        await db.collection('appStats').doc('global').set(stats, { merge: true });

        res.json({
            success: true,
            message: 'Stats recalculated successfully',
            data: stats
        });
    } catch (error) {
        console.error('Error recalculating stats:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// --- Real-time Triggers ---

// 1. Users Triggers
exports.updateUserStatsOnCreate = functions.firestore.onDocumentCreated('users/{userId}', async (event) => {
    await db.collection('appStats').doc('global').update({
        activeUsers: admin.firestore.FieldValue.increment(1)
    });
});

exports.updateUserStatsOnDelete = functions.firestore.onDocumentDeleted('users/{userId}', async (event) => {
    await db.collection('appStats').doc('global').update({
        activeUsers: admin.firestore.FieldValue.increment(-1)
    });
});

// 2. Bug Reports Triggers
exports.updateBugStatsOnCreate = functions.firestore.onDocumentCreated('bug_reports/{reportId}', async (event) => {
    await db.collection('appStats').doc('global').update({
        bugReports: admin.firestore.FieldValue.increment(1)
    });
});

exports.updateBugStatsOnDelete = functions.firestore.onDocumentDeleted('bug_reports/{reportId}', async (event) => {
    await db.collection('appStats').doc('global').update({
        bugReports: admin.firestore.FieldValue.increment(-1)
    });
});

// 3. Expenses Triggers (Assuming 'expenses' is a subcollection of 'rooms')
exports.updateExpenseStatsOnCreate = functions.firestore.onDocumentCreated('rooms/{roomId}/expenses/{expenseId}', async (event) => {
    const data = event.data.data();
    const amount = Number(data.amount) || 0;

    await db.collection('appStats').doc('global').update({
        totalExpensesCount: admin.firestore.FieldValue.increment(1),
        expensesTracked: admin.firestore.FieldValue.increment(amount)
    });
});

exports.updateExpenseStatsOnDelete = functions.firestore.onDocumentDeleted('rooms/{roomId}/expenses/{expenseId}', async (event) => {
    const data = event.data.data();
    const amount = Number(data.amount) || 0;

    await db.collection('appStats').doc('global').update({
        totalExpensesCount: admin.firestore.FieldValue.increment(-1),
        expensesTracked: admin.firestore.FieldValue.increment(-amount)
    });
});

/**
 * Helper function to parse download count from Play Store format
 * Converts "10,000+" to 10000, "1,000,000+" to 1000000, etc.
 */
function parseDownloads(installsString) {
    if (!installsString) return 0;

    // Remove commas and plus sign
    const cleaned = installsString.replace(/[,+]/g, '');

    // Parse the number
    const num = parseInt(cleaned, 10);

    return isNaN(num) ? 0 : num;
}

/**
 * HTTP function to get current stats (for testing)
 * Usage: https://YOUR_REGION-YOUR_PROJECT.cloudfunctions.net/getStats
 */
exports.getStats = functions.https.onRequest(async (req, res) => {
    try {
        const globalStats = await db.collection('appStats').doc('global').get();
        const playStoreStats = await db.collection('appStats').doc('playStore').get();

        res.json({
            success: true,
            global: globalStats.exists ? globalStats.data() : null,
            playStore: playStoreStats.exists ? playStoreStats.data() : null
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
