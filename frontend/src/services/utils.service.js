/**
 * Calculates the time the train is delayed
 * @param {Object} item - Object containing data for a delayed train
 * @return {int} delay-time in minutes
 */
function outputDelay(item) {
    let advertised = new Date(item.AdvertisedTimeAtLocation)
    let estimated = new Date(item.EstimatedTimeAtLocation)
    const diff = Math.abs(estimated - advertised)

    return Math.floor(diff / (1000 * 60)).toString() + ' minuter'
}

export { outputDelay }
