import { html } from '../../lib/render';
import { WIN_MSG, TIE_MSG } from '../constants';
export const ResultMsg = ({ winner, playCount, text = {} }) => {

    const winMsg = text.win ? text.win : WIN_MSG;
    const tieMsg = text.tie ? text.tie : TIE_MSG;

    if (winner) {
        return html`${winMsg(winner)}`
    } else if (playCount === 9) {
        return html`${tieMsg()}`
    }

    return html``;
}