import React from 'react';
import { convertToHTML } from 'draft-convert';

export const styleToHTML = (style) => {
  switch (style) {
    case 'ITALIC':
      return <em className="italic" />;
    case 'BOLD':
      return <strong className="bold" />;
    case 'HIGHLIGHT':
      return <strong className="highlight" />;
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
        start: `<div class="slider js-slider" data-slides="${ JSON.stringify(slides).replace(/"/g, "'")}"><div>`,
        end: `</div></div>`
      }
    }

    default: return null;
  }
};

export const entityToHTML = (entity, text) => {
  if (entity.type === 'LINK') {
    return (
      <a
        className="link"
        href={entity.data.url}
        target="_blank"
      >
        {text}
      </a>
    );
  }
  return text;
};

export const options = {
  styleToHTML,
  blockToHTML,
  entityToHTML,
};

const converterFunction = convertToHTML(options);

export default contentState => converterFunction(contentState);