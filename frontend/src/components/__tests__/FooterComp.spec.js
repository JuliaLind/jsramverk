import { describe, it, expect} from 'vitest'
import FooterComp from '../FooterComp.vue'
import { mount } from '@vue/test-utils'


describe('FooterComp', async () => {
    it('renders properly', async () => {
        const wrapper = mount(FooterComp)
        expect(wrapper.text()).contains('Julia & Martin')

        wrapper.unmount()
    })
})
