Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    const newDay = parseInt(days) + date.getDate();
    date.setDate(newDay);
    return date;
}

export const calcProgress = (task) => {
        const now = new Date();
        const lReset = new Date(task.last_reset);
        let timeSince = 0;
        if (task.pause.length > 0) {
                // More than one pause not allowed
                const pause = task.pause[0];
                const pStart = new Date(pause.starting)
                //console.log("pSatrt: " + pStart);
                timeSince = pStart.getTime() - lReset.getTime();
                const pEnd = pStart.addDays(pause.duration);
                //console.log("pEnd: " + pEnd);
                if (pEnd < now) {
                        timeSince += now.getTime() - pEnd.getTime();
                }
                //console.log("timeSince: " + timeSince);
        } else {
                timeSince = now.getTime() - lReset.getTime();;
        }
        const daysSince = timeSince / (1000 * 3600 * 24);
        //
        const progress = 100 * daysSince / task.days_repeat;
        //console.log("Calulated Progress: " + progress);
        return Math.min(progress, 100);
}

export const isPaused = (task) => {
        if (task.pause !== null) {
                return task.pause.length > 0 ? true : false;
        }
        return false;
}

export const calcPauseRestDays = (pause) => {
        const now = new Date();
        const pauseStart = new Date(pause.starting);
        const pauseEnd = pauseStart.addDays(pause.duration);
        if (pauseEnd < now) {
                return 0;
        }
        const restDays = ( pauseEnd.getTime() - now.getTime() ) / (1000 * 3600 * 24);
        return restDays.toFixed(0);
}