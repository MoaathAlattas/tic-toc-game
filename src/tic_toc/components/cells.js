import { html } from '../../lib/render'
export const Cells = ({ plays, POS_DATA_ATTR, WIN_DATA_ATTR }) => html`${[...Array(9)].map((_, i) => {
    const playObj = plays.find(play => play.position === i);
    const value = playObj ? playObj.value : "";
    const winDataAttr = playObj && playObj.win ? true : null;
    return html`
        <div .dataset=${{
            [POS_DATA_ATTR]: i,
            [WIN_DATA_ATTR]: winDataAttr
        }}>${value}</div>`
})}`