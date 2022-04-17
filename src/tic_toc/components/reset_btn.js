import { html } from '../../lib/render';
export const ResetBtn = ({ playCount, onReset, ELEMENT_NAME }) => {
    const canUndo = playCount > 0;
    return html`
        <button onClick="${onReset}"
                .dataset = "${{ target: `${ELEMENT_NAME}.resetBtn` }}"
                .disabled=${!canUndo}>Reset</button>`
}