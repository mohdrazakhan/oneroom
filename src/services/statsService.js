import { db } from '../config/firebase';
import { doc, getDoc, collection, getDocs, query, where, onSnapshot } from 'firebase/firestore';

/**
 * Stats Service - Fetches real-time statistics from Firebase
 * 
 * Expected Firestore structure:
 * 
 * Collection: 'appStats' (single document with aggregated stats)
 * Document ID: 'global'
 * Fields:
 *   - activeUsers: number
 *   - tasksCompleted: number
 *   - expensesTracked: number (total amount in dollars)
 *   - satisfactionRate: number (percentage)
 *   - appRating: number (e.g., 4.8)
 *   - totalDownloads: number
 *   - lastUpdated: timestamp
 * 
 * Alternative: Calculate from collections (users, tasks, expenses)
 */

class StatsService {
    /**
     * Fetch aggregated stats from a single document
     * This is the recommended approach for performance
     */
    async getAggregatedStats() {
        try {
            const statsDoc = await getDoc(doc(db, 'appStats', 'global'));

            if (statsDoc.exists()) {
                return statsDoc.data();
            } else {
                console.warn('Stats document not found, returning default values');
                return this.getDefaultStats();
            }
        } catch (error) {
            console.error('Error fetching aggregated stats:', error);
            return this.getDefaultStats();
        }
    }

    /**
     * Subscribe to real-time stats updates
     * @param {Function} callback - Called whenever stats change
     * @returns {Function} Unsubscribe function
     */
    subscribeToStats(callback) {
        const statsDocRef = doc(db, 'appStats', 'global');

        return onSnapshot(statsDocRef, (doc) => {
            if (doc.exists()) {
                callback(doc.data());
            } else {
                callback(this.getDefaultStats());
            }
        }, (error) => {
            console.error('Error subscribing to stats:', error);
            callback(this.getDefaultStats());
        });
    }

    /**
     * Calculate stats from collections (slower, use only if needed)
     * This queries your actual collections to count documents
     */
    async calculateStatsFromCollections() {
        try {
            // Count active users
            const usersSnapshot = await getDocs(collection(db, 'users'));
            const activeUsers = usersSnapshot.size;

            // Count completed tasks
            const tasksQuery = query(
                collection(db, 'tasks'),
                where('status', '==', 'completed')
            );
            const tasksSnapshot = await getDocs(tasksQuery);
            const tasksCompleted = tasksSnapshot.size;

            // Calculate total expenses
            const expensesSnapshot = await getDocs(collection(db, 'expenses'));
            let expensesTracked = 0;
            expensesSnapshot.forEach(doc => {
                const expense = doc.data();
                expensesTracked += expense.amount || 0;
            });

            // Get app stats (rating, satisfaction, downloads)
            const appStatsDoc = await getDoc(doc(db, 'appStats', 'global'));
            const appStats = appStatsDoc.exists() ? appStatsDoc.data() : {};

            return {
                activeUsers,
                tasksCompleted,
                expensesTracked,
                satisfactionRate: appStats.satisfactionRate || 98,
                appRating: appStats.appRating || 4.8,
                totalDownloads: appStats.totalDownloads || activeUsers * 5,
                lastUpdated: new Date()
            };
        } catch (error) {
            console.error('Error calculating stats from collections:', error);
            return this.getDefaultStats();
        }
    }

    /**
     * Fetch Play Store stats (rating and downloads)
     * Note: This requires a backend service or Cloud Function
     * For now, we'll fetch from Firebase where you can manually update
     */
    async getPlayStoreStats() {
        try {
            const playStoreDoc = await getDoc(doc(db, 'appStats', 'playStore'));

            if (playStoreDoc.exists()) {
                return playStoreDoc.data();
            } else {
                return {
                    rating: 4.8,
                    downloads: 50000,
                    reviews: 2500,
                    lastUpdated: new Date()
                };
            }
        } catch (error) {
            console.error('Error fetching Play Store stats:', error);
            return {
                rating: 4.8,
                downloads: 50000,
                reviews: 2500
            };
        }
    }

    /**
     * Get default/fallback stats
     */
    getDefaultStats() {
        return {
            activeUsers: 10000,
            tasksCompleted: 500000,
            expensesTracked: 1000000,
            satisfactionRate: 98,
            appRating: 4.8,
            totalDownloads: 50000,
            lastUpdated: new Date()
        };
    }

    /**
     * Combined method to get all stats
     * Uses aggregated stats for performance
     */
    async getAllStats() {
        try {
            const [appStats, playStoreStats] = await Promise.all([
                this.getAggregatedStats(),
                this.getPlayStoreStats()
            ]);

            return {
                ...appStats,
                playStore: playStoreStats
            };
        } catch (error) {
            console.error('Error fetching all stats:', error);
            return this.getDefaultStats();
        }
    }
}

export default new StatsService();
