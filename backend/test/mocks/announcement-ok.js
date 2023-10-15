module.exports.announcementOk = {
    ActivityId: "1500adde-f75d-c409-08db-cbbeabdb5506",
    AdvertisedTimeAtLocation: "2023-10-15T17:35:00.000+02:00",
    Canceled: false,
    EstimatedTimeAtLocation: "2023-10-15T17:40:00.000+02:00",
    FromLocation: [
        {
            LocationName: "M",
            Priority: 1,
            Order: 0
        }
    ],
    LocationSignature: "Av",
    OperationalTrainNumber: "3942",
    ToLocation: [
        {
            LocationName: "Cst",
            Priority: 1,
            Order: 0
        }
    ]
}

module.exports.announcementOkResult = {
    ActivityId: "1500adde-f75d-c409-08db-cbbeabdb5506",
    AdvertisedTimeAtLocation: "2023-10-15T17:35:00.000+02:00",
    EstimatedTimeAtLocation: "2023-10-15T17:40:00.000+02:00",
    OperationalTrainNumber: "3942",
    Canceled: false,
    FromLocation: "Malmö C",
    ToLocation: "Stockholm C",
    LocationSignature: "Alvesta",
}
