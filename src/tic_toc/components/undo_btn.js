import { html } from '../../lib/render'
export const UndoBtn = ({ playCount, onUndo, ELEMENT_NAME }) => {
    const canUndo = playCount > 0;
    return html`
        <button onClick="${onUndo}"
                .dataset = "${{ target: `${ELEMENT_NAME}.undoBtn` }}"
                .disabled=${!canUndo}>Undo</button>`
}