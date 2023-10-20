/** global: Event */

import { loader } from '../loader.service.js'
import { describe, expect, it } from 'vitest'

describe('loader', () => {
    it('tests loader show and hide', () => {
        let check = document.querySelector('.loader')
        expect(check).toBe(null)
        loader.show()
        check = document.querySelector('.loader')
        expect(check).not.toBe(null)
        expect(check.classList.contains('loader--hidden')).not.toBe(true)
        const transitionend = new Event('transitionend')
        loader.hide()
        document.dispatchEvent(transitionend)
        check = document.querySelector('.loader')
        expect(check.classList.contains('loader--hidden')).toBe(true)
    })
})
