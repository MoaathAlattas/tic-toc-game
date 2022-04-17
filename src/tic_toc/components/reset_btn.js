import { html } from '../../lib/render';
export const ResetBtn = ({ playCount, onReset, tagName }) => {
    const canUndo = playCount > 0;
    return html`
        <button onClick="${onReset}"
                .dataset = "${{ target: `${tagName}.resetBtn` }}"
                .disabled=${!canUndo}>Reset</button>`
}