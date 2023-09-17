
import DelayedTable from '../DelayedTable.vue'
import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { expect, beforeAll, afterEach, afterAll, describe, it, vi } from "vitest";
import { mount } from '@vue/test-utils'
// import DelayedItem from '../DelayedItem.vue'
// import { RouterLinkStub } from '@vue/test-utils'

// function createFetchResponse(data) {
//     return { json: () => new Promise((resolve) => resolve(data)) }
//   }


// import { mount } from '@vue/test-utils'


const delayed = {
    data: [
        {
            ActivityId: "585e1717-bd25-f032-c480-2314bb56b2ee",
            ActivityType: "Avgang",
            AdvertisedTimeAtLocation: "2023-09-16T18:42:00.000+02:00",
            Canceled: false,
            EstimatedTimeAtLocation: "2023-09-16T20:09:41.000+02:00",
            LocationSignature: "Lö",
            OperationalTrainNumber: "34023",
            TimeAtLocation: "2023-09-16T14:07:00.000+02:00",
            TrainOwner: "HR"
        },
        {
            ActivityId: "1500adde-f75d-c409-08db-aa839f90c4b0",
            ActivityType: "Avgang",
            AdvertisedTimeAtLocation: "2023-09-16T18:54:00.000+02:00",
            AdvertisedTrainIdent: 3571,
            Canceled: false,
            EstimatedTimeAtLocation: "2023-09-16T18:58:00.000+02:00",
            FromLocation: [
                {
                    LocationName: "A",
                    Priority: 1,
                    Order: 0
                }
            ],
            LocationSignature: "Vbd",
            OperationalTrainNumber: 3571,
            ToLocation: [
                {
                    LocationName: "G",
                    Priority: 1,
                    Order: 0
                }
            ],
            TrainOwner: "VASTTRAF"
        },
        {
            ActivityId: "1500adde-f75d-c409-08db-b60ad7239ad2",
            ActivityType: "Avgang",
            AdvertisedTimeAtLocation: "2023-09-16T19:30:00.000+02:00",
            AdvertisedTrainIdent: 3942,
            Canceled: false,
            EstimatedTimeAtLocation: "2023-09-16T19:45:00.000+02:00",
            FromLocation: [
                {
                    LocationName: "M",
                    Priority: 1,
                    Order: 0
                }
            ],
            LocationSignature: "G",
            OperationalTrainNumber: "13946",
            ToLocation: [
                {
                    LocationName: "Cst",
                    Priority: 1,
                    Order: 0
                }
            ],
            TrainOwner: "SNÄLL"
        },
        {
            ActivityId: "0d2ac41f-5578-c89f-3db5-55da26423f68",
            ActivityType: "Avgang",
            AdvertisedTimeAtLocation: "2023-09-16T19:30:00.000+02:00",
            Canceled: false,
            EstimatedTimeAtLocation: "2023-09-16T19:55:46.000+02:00",
            LocationSignature: "Arb",
            OperationalTrainNumber: "61100",
            TimeAtLocation: "2023-09-16T16:39:00.000+02:00",
            TrainOwner: "MÄLAB"
        },
        {
            ActivityId: "1500adde-f75d-c409-08db-aa82f5f27903",
            ActivityType: "Avgang",
            AdvertisedTimeAtLocation: "2023-09-16T19:45:00.000+02:00",
            AdvertisedTrainIdent: "1231",
            Canceled: false,
            EstimatedTimeAtLocation: "2023-09-16T19:50:00.000+02:00",
            FromLocation: [
                {
                    LocationName: "Cr",
                    Priority: 1,
                    Order: 0
                }
            ],
            LocationSignature: "Mpb",
            OperationalTrainNumber: "11232",
            ToLocation: [
                {
                    LocationName: "M",
                    Priority: 1,
                    Order: 0
                }
            ],
            TrainOwner: "SKANE"
        },
    ]
}


// export const restHandlers = [
//     rest.get('https://localhost:1337/delayed', (req, res, ctx) => {
//        return res(ctx.status(200), ctx.json(delayed))
//     }),
//     // rest.get('https://jsramverk-marjul2023.azurewebsites.net/delayed', (req, res, ctx) => {
//     //    return res(ctx.status(200), ctx.json(delayed))
//     // }),
//  ]
//  const server = setupServer(...restHandlers)
//  // Start server before all tests
//  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
 
//  //  Close server after all tests
//  afterAll(() => server.close())
 
//  // Reset handlers after each test `important for test isolation`
//  afterEach(() => server.resetHandlers())



describe('DelayedTable', () => {
    it('renders properly', async () => {
        const wrapper = mount(DelayedTable, { 
            props: { 
                delayed
            },
            // stubs: {
            //     RouterLink: RouterLinkStub
            // }
        })
        expect(wrapper.text()).toContain('442KG ->  Cst31 minuter')
    })
})

