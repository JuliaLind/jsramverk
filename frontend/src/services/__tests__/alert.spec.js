import { customAlert, toast } from '../alert.service.js'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'

describe('alert', () => {
    beforeEach(async () => {
        vi.useFakeTimers()
    })
    afterEach(() => {
        vi.restoreAllMocks()
    })
    it('tests custom alert', () => {
        expect(document.querySelector('.my-alert')).toBe(null)
        expect(document.querySelector('.my-alert-msg')).toBe(null)
        customAlert('this is a test alert')

        expect(document.querySelector('.my-alert')).not.toBe(null)
        const alertMessage = document.getElementsByClassName('my-alert-msg')[0]
        expect(alertMessage).not.toBe(null)
        expect(alertMessage.innerText).toBe('this is a test alert')
        const btn = document.querySelector('.my-alert-btn')
        const clickEvent = new Event('click')
        btn.dispatchEvent(clickEvent)
        expect(document.querySelector('.my-alert-msg')).toBe(null)
        vi.advanceTimersByTime(301)
        const check = document.querySelector('.my-alert')
        expect(check).toBe(null)
        const check2 = document.querySelector('.my-visible')
        expect(check2).toBe(null)
    })

    it('tests toast', () => {
        expect(document.querySelector('.my-toast-message')).toBe(null)
        expect(document.querySelector('.my-toast-body')).toBe(null)
        expect(document.querySelector('.my-toast')).toBe(null)
        toast('this is a toast')

        expect(document.querySelector('.my-toast-body')).not.toBe(null)
        expect(document.querySelector('.my-toast')).not.toBe(null)

        const toastMessage = document.querySelector('.my-toast-message')
        expect(toastMessage).not.toBe(null)

        expect(toastMessage.innerHTML).toContain('this is a toast')

        vi.advanceTimersByTime(3401)
        expect(document.querySelector('.my-toast-message')).toBe(null)
        expect(document.querySelector('.my-toast-body')).toBe(null)
        expect(document.querySelector('.my-toast')).toBe(null)
    })
})
