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
// Temporarily not in use
// /**
//  *
//  * @param {Object} item - associative array with
//  * info about the deayled train
//  * @returns {string} string to use in the TicketForm component
//  */
// function createLocationString(item) {
//     let locationString = ''

//     if (item.FromLocation) {
//         locationString = `Tåg från ${item.FromLocation[0].LocationName} till ${item.ToLocation[0].LocationName}. Just nu i ${item.LocationSignature}.`
//     }
//     return locationString
// }

// export { outputDelay, createLocationString }
export { outputDelay }
