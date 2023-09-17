/**
 * 
 */

import { vi, describe } from 'vitest';
import DelayedItem from '../DelayedItem.vue'
import { mount} from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from "@/router"

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
})

vi.mock('@/stores/ticket', () => ({
    useTicketStore: () => ({
        currentItem: {},
    }),
}));

describe('DelayedItem', async () => {
    router.push('/')
  // After this line, router is ready
    await router.isReady()
    it('renders properly', () => {
        const wrapper = mount(DelayedItem, { 
            props: { 
                item: {
                    ActivityId: "1500adde-f75d-c409-08db-aa83ab51b321",
                    ActivityType: "Avgang",
                    AdvertisedTimeAtLocation: "2023-09-16T18:45:00.000+02:00",
                    AdvertisedTrainIdent: "442",
                    Canceled: false,
                    EstimatedTimeAtLocation: "2023-09-16T19:16:00.000+02:00",
                    FromLocation: [
                        {
                            LocationName: "G",
                            Priority: 1,
                            Order: 0
                        }
                    ],
                    LocationSignature: "K",
                    OperationalTrainNumber: "442",
                    ToLocation: [
                        {
                            LocationName: "Cst",
                            Priority: 1,
                            Order: 0
                        }
                    ],
                    TrainOwner: "SJ"
                } 
            },
            global: {
                plugins: [router]
            },
        })
        expect(wrapper.text()).toContain('442KG ->  Cst31 minuter')
    })
})
