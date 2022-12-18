export const calcProgress = (last_reset, days_repeat) => {
        const now = new Date();
        const lReset = new Date(last_reset);
        const daysSince = (now.getTime() - lReset.getTime()) / (1000 * 3600 * 24);
        return Math.min(100 * daysSince / days_repeat, 100);
}