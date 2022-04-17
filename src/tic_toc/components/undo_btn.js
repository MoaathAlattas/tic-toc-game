import { html } from '../../lib/render'
export const UndoBtn = ({ playCount, onUndo, tagName }) => {
    const canUndo = playCount > 0;
    return html`
        <button onClick="${onUndo}"
                .dataset = "${{ target: `${tagName}.undoBtn` }}"
                .disabled=${!canUndo}>Undo</button>`
}