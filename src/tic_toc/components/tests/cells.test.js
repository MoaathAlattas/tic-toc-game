import { render } from '../../../lib/render.js'
import { WIN_DATA_ATTR, POS_DATA_ATTR } from '../../tic_toc.view.js'
import { Cells } from '../cells.js'


describe('Cells', () => {
    afterEach(() => {
        document.body.innerHTML = ''
    })

    test("Verify 9 cells rendered with position attribute", () => {
        render(document.body, Cells({ plays: [], POS_DATA_ATTR, WIN_DATA_ATTR }))
        const divs = document.body.querySelectorAll(`div[data-${POS_DATA_ATTR}]`)
        expect(divs.length).toBe(9);
    })

    test("Verify cells render value", () => {
        const value = 'YA WLD'
        const plays = [...Array(9)].map((_, i) => ({ value, position: i }))
        render(document.body, Cells({ plays }))
        const divs = document.body.querySelectorAll(`div[data-${POS_DATA_ATTR}]`)
        divs.forEach(div => {
            expect(div.textContent.trim()).toContain(value);
        })
    })
    test("Verify cells doesn't render value", () => {
        const value = ""
        const plays = [...Array(9)].map((_, i) => ({ value, position: i }))
        render(document.body, Cells({ plays }))
        const divs = document.body.querySelectorAll(`div[data-${POS_DATA_ATTR}]`)
        divs.forEach(div => {
            expect(div.textContent.trim()).toContain(value);
        })
    })
    test("Verify cells render win data attr", () => {
        const win = true
        const plays = [...Array(9)].map((_, i) => ({ position: i, win }))
        render(document.body, Cells({ plays }))
        const divs = document.body.querySelectorAll(`div[data-${WIN_DATA_ATTR}]`)
        divs.forEach(div => {
            expect(div.dataset[WIN_DATA_ATTR]).toBe("true");
        })
    });
    test("Verify cells doesn't render win data attr", () => {
        const win = false
        const plays = [...Array(9)].map((_, i) => ({ position: i, win }))
        render(document.body, Cells({ plays }))
        const divs = document.body.querySelectorAll(`div[data-${WIN_DATA_ATTR}]`)
        divs.forEach(div => {
            expect(div.dataset[WIN_DATA_ATTR]).toBe(undefined);
        })
    });
})