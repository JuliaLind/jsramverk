const stations = require("./stations.js").stations
const positions = require("./positions.js").positions
const announcements = require("./announcements.js").announcements

module.exports.trafikverketResult = {
    RESPONSE: {
        RESULT: [
            {
                TrainPosition: positions
            },
            {
                TrainAnnouncement: announcements
            },
            {
                TrainStation: stations
            }
        ]
    }
}
