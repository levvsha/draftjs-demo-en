/* eslint-disable */

import React from 'react';
import { convertToHTML } from 'draft-convert';

export const styleToHTML = (style) => {
  switch (style) {
    case 'ITALIC':
      return <em className="ed-italic" />;
    case 'BOLD':
      return <strong className="ed-bold" />;
    case 'HIGHLIGHT':
      return <strong className="ed-highlight" />;
    default:
      return null;
  }
};

export const blockToHTML = (block) => {
  const blockType = block.type;

  switch (blockType) {
    case 'SLIDER': {
      const slides = block.data.slides;

      return {
        start: `<div class="ed-slider js-ed-slider" data-slides="${ JSON.stringify(slides).replace(/"/g, "'")}"><div>`,
        end: `</div></div>`
      }
    }

    default: return null;
  }
};

export const entityToHTML = (entity, originalText) => {
  if (entity.type === 'LINK') {
    return (
      <a
        className="ed-link"
        href={entity.data.url}
        target="_blank"
      >
        {originalText}
      </a>
    );
  }
  return originalText;
};

export const options = {
  styleToHTML,
  blockToHTML,
  entityToHTML,
};

export default (contentState, htmlOptions = options) => convertToHTML(htmlOptions)(contentState);