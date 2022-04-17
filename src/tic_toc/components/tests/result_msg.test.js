import { render } from '../../../lib/render.js'
import { WIN_MSG, TIE_MSG } from '../../constants.js'

import { ResultMsg } from '../result_msg.js'

describe('ResultMsg', () => {
    test("Verify winner message", () => {
        const winner = 'X'
        render(document.body, ResultMsg({ winner, WIN_MSG, TIE_MSG }))
        expect(document.body.innerHTML).toContain(WIN_MSG(winner));
    });
    test("Verify tie message", () => {
        render(document.body, ResultMsg({ winner: "", "playCount": 9, WIN_MSG, TIE_MSG }))
        expect(document.body.innerHTML).toContain(TIE_MSG());
    });
    test("Verify no message", () => {
        render(document.body, ResultMsg({ winner: "", "playCount": 8, WIN_MSG, TIE_MSG }))
        expect(document.body.textContent.trim()).toBe("");
    });
})