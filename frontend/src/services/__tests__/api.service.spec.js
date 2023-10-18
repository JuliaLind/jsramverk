import { extractTrainNumbers } from '../api.service.js'
import { delayed } from '../../components/__tests__/mockdata/delayed.js'
import { describe, expect, it } from 'vitest'

describe('extractTrainNumbers', () => {
    it('extracts unique trainnumbers from an array with delay items, in sorted order', () => {
        const exp = [
            '10168',
            '13066',
            '13087',
            '1543',
            '20096',
            '20327',
            '20336',
            '3751',
            '527',
            '8013',
            '8136',
            '8739'
        ]
        expect(extractTrainNumbers(delayed)).toStrictEqual(exp)
    })
})
