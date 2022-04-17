import { html } from '../../lib/render';
export const ResultMsg = ({ winner, playCount, WIN_MSG, TIE_MSG }) => {
    if (winner) {
        return html`${WIN_MSG(winner)}`
    } else if (playCount === 9) {
        return html`${TIE_MSG()}`
    }
    return html``;
}