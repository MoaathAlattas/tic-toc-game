import { html } from '../../lib/render'
import { POS_DATA_ATTR, WIN_DATA_ATTR } from '../constants';
export const Cells = ({ plays, dataset = {} }) => {

    const pos = dataset.pos ? dataset.pos : POS_DATA_ATTR;
    const win = dataset.win ? dataset.win : WIN_DATA_ATTR;

    return html`${[...Array(9)].map((_, i) => {
        const playObj = plays.find(play => play.position === i);
        const value = playObj ? playObj.value : "";
        const winDataAttr = playObj && playObj.win ? true : null;
        return html`
        <div .dataset=${{
                [pos]: i,
                [win]: winDataAttr
            }}>${value}</div>`
    })}`
}