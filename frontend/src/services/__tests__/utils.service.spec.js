import { outputDelay } from '../utils.service.js'


describe('outputDelay', () => {
    test('caluclates the delayed time of a dealyitem', () => {
        const item = {
            ActivityId: '1500adde-f75d-c409-08db-ab4a0395417d',
            AdvertisedTimeAtLocation: '2023-09-17T23:18:00.000+02:00',
            EstimatedTimeAtLocation: '2023-09-17T23:28:00.000+02:00',
            OperationalTrainNumber: '8483',
            Canceled: false,
            FromLocation: 'Borlänge C',
            ToLocation: 'Morastrand',
            LocationSignature: 'Djurås',
        }
        expect(outputDelay(item)).toBe('10 minuter')
    })

    test('caluclates the delayed time of anoter dealyitem', () => {
        const item = {
            ActivityId: '1500adde-f75d-c409-08db-ab4a0395417d',
            AdvertisedTimeAtLocation: '2023-09-17T20:11:00.000+02:00',
            EstimatedTimeAtLocation: '2023-09-17T23:07:00.000+02:00',
            OperationalTrainNumber: '8483',
            Canceled: false,
            FromLocation: 'Borlänge C',
            ToLocation: 'Morastrand',
            LocationSignature: 'Djurås',
        }
        expect(outputDelay(item)).toBe('176 minuter')
    })
  
  })

