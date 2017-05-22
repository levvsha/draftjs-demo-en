import React from 'react';

import './InlineToolbar.styl';

const INLINE_STYLES = [
  { label: 'B', style: 'BOLD' },
  { label: 'I', style: 'ITALIC' },
  { label: 'H', style: 'HIGHLIGHT' }
];

export default ({ editorState, onToggle, position }) => {
  const currentStyle = editorState.getCurrentInlineStyle();

  return (
    <div
      className="toolbar"
      style={position}
    >
      <ul className="toolbar-items">
        {INLINE_STYLES.map(type =>
          <li
            key={type.label}
            className={`toolbar-item ${ type.style.toLowerCase() } ${ currentStyle.has(type.style) ? 'active' : '' }`}
            onMouseDown={(e) => {
              e.preventDefault();
              onToggle(type.style);
            }}
          >
            {type.label}
          </li>
        )}
      </ul>
    </div>
  );
};
