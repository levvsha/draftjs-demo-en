import React from 'react';

import './InlineToolbar.styl';

import IconLink from 'material-ui/svg-icons/content/link';

const INLINE_STYLES = [
  { label: 'B', style: 'BOLD' },
  { label: 'I', style: 'ITALIC' },
  { label: 'H', style: 'HIGHLIGHT' }
];

export default ({ editorState, onToggle, position, setLink }) => {
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
            className={`toolbar-item t-${ type.style.toLowerCase() } ${ currentStyle.has(type.style) ? 'active' : '' }`}
            onMouseDown={(e) => {
              e.preventDefault();
              onToggle(type.style);
            }}
          >
            {type.label}
          </li>
        )}
        <li
          key="add-link-button"
          className="toolbar-item"
          onMouseDown={setLink}
        >
          <IconLink />
        </li>
      </ul>
    </div>
  );
};
