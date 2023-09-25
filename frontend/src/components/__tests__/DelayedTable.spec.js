import { vi, describe, it, expect } from 'vitest'
import DelayedTable from '../DelayedTable.vue'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router'
import { defineComponent } from 'vue';
import { getDelayedTrains } from '../../models/api.service.js'

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

vi.mock('@/stores/ticket', () => ({
    useTicketStore: () => ({
        currentItem: {}
    })
}))


const delayed = [
        {
            ActivityId: '1500adde-f75d-c409-08db-ab49fa36c6b7',
            ActivityType: 'Avgang',
            AdvertisedTimeAtLocation: '2023-09-17T23:11:00.000+02:00',
            AdvertisedTrainIdent: '8150',
            Canceled: false,
            stimatedTimeAtLocation: '2023-09-17T23:25:00.000+02:00',
            FromLocation: [
                {
                    LocationName: 'Blgc',
                    Priority: 1,
                    Order: 0
                }
            ],
            LocationSignature: 'Rv',
            OperationalTrainNumber: '8150',
            ToLocation: [
                {
                    LocationName: 'Mras',
                    Priority: 1,
                    Order: 0
                }
            ],
            TrainOwner: 'SJ'
        },
        {
            ActivityId: '1500adde-f75d-c409-08db-ab4a02a21263',
            ActivityType: 'Avgang',
            AdvertisedTimeAtLocation: '2023-09-17T23:15:00.000+02:00',
            AdvertisedTrainIdent: '8468',
            Canceled: false,
            stimatedTimeAtLocation: '2023-09-17T23:25:00.000+02:00',
            FromLocation: [
                {
                    LocationName: 'U',
                    Priority: 1,
                    Order: 0
                }
            ],
            LocationSignature: 'Fvk',
            OperationalTrainNumber: '8468',
            ToLocation: [
                {
                    LocationName: 'Gä',
                    Priority: 1,
                    Order: 0
                }
            ],
            TrainOwner: 'MÄLAB'
        },
    ]

    vi.mock('../../models/api.service.js', () => {
        return {
            getDelayedTrains: vi.fn(() => {
                return delayed
            }),
        }
    })

describe('DelayedTable', async () => {
    router.push('/')
    // After this line, router is ready
    await router.isReady()

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('renders properly', async () => {
        // Create suspense wrapper for your component
        const SuspenseWrapperComponent = defineComponent({
            components: { DelayedTable },
            template: `
            <Suspense>
                <DelayedTable />
            </Suspense>
            `,
        });

        const createExchangeViewComponent = () => {
            const wrapper = mount(SuspenseWrapperComponent, {
                global: {
                    plugins: [router]
                }
            });
            
            return wrapper;
        };

        const suspenseWrapper = createExchangeViewComponent();
        // Wait suspense promise
        await flushPromises();

        // Access your target component
        const wrapper = suspenseWrapper.findComponent({ name: 'DelayedTable' });

        // Continue your tests
        expect(wrapper.text()).contains('8150');
        expect(wrapper.text()).contains('RvBlgc ->  Mras');

        suspenseWrapper.unmount();
    })
})
