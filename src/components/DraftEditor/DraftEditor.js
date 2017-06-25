import './DraftEditor.styl';

import React, { Component } from 'react';
import isSoftNewlineEvent from 'draft-js/lib/isSoftNewlineEvent';
import { Map } from 'immutable';

import {
  CompositeDecorator,
  Editor,
  EditorState,
  RichUtils,
  DefaultDraftBlockRenderMap
} from 'draft-js';

import {
  addNewBlockAt,
  getCurrentBlock,
  getSelectionRange,
  getSelectionCoords
} from 'utils';

import {
  InlineToolbar,
  EditorSlider
} from 'components';

const urlCreator = window.URL || window.webkitURL;

import _map from 'lodash/map';

export default class DraftEditor extends Component {
  constructor() {
    super();

    const decorator = new CompositeDecorator([
      {
        strategy: findLinkEntities,
        component: Link,
      },
    ]);

    this.state = {
      inlineToolbar: { show: false },
      editorState: EditorState.createEmpty(decorator)
    };

    this.toggleInlineStyle = ::this.toggleInlineStyle;
    this.handleKeyCommand = ::this.handleKeyCommand;
    this.onChange = ::this.onChange;
    this.setLink = ::this.setLink;
    this.handleDroppedFiles = ::this.handleDroppedFiles;
    this.handleReturn = ::this.handleReturn;

    this.focus = () => this.refs.editor.focus();
        this.getEditorState = () => this.state.editorState;
        this.blockRendererFn = customBlockRenderer(
          this.onChange,
          this.getEditorState
        );
  }

  onChange(editorState) {
    if (!editorState.getSelection().isCollapsed()) {
      const selectionRange = getSelectionRange();

      if (!selectionRange) {
        this.setState({ inlineToolbar: { show: false } });

        return;
      }

      const selectionCoords = getSelectionCoords(selectionRange);

      this.setState({
        inlineToolbar: {
          show: true,
          position: {
            top: selectionCoords.offsetTop,
            left: selectionCoords.offsetLeft
          }
        }
      });
    } else {
      this.setState({ inlineToolbar: { show: false } });
    }

    this.setState({ editorState });
  }

  setLink() {
    const urlValue = prompt('Введите ссылку', '');
    const { editorState } = this.state;
    const contentState = editorState.getCurrentContent();

    const contentStateWithEntity = contentState.createEntity(
      'LINK',
      'MUTABLE',
      { url: urlValue }
    );

    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });

    this.setState({
      editorState: RichUtils.toggleLink(
        newEditorState,
        newEditorState.getSelection(),
        entityKey
      )
    }, () => {
      setTimeout(() => this.focus(), 0);
    });
  }

  toggleInlineStyle(inlineStyle) {
    this.onChange(
      RichUtils.toggleInlineStyle(
        this.state.editorState,
        inlineStyle
      )
    );
  }

  handleDroppedFiles(selection, files) {
    const filteredFiles = files
      .filter(file => (file.type.indexOf('image/') === 0));

    if (!filteredFiles.length) {
      return 'not_handled';
    }

    this.onChange(addNewBlockAt(
      this.state.editorState,
      selection.getAnchorKey(),
      'SLIDER',
      new Map({ slides: _map(
        filteredFiles,
        file => ({ url: urlCreator.createObjectURL(file) })
      )})
    ));

    return 'handled';
  }

  handleKeyCommand(command) {
    const { editorState } = this.state;
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      this.onChange(newState);
      return true;
    }

    return false;
  }

  handleReturn(e) {
    const { editorState } = this.state;

    if (isSoftNewlineEvent(e)) {
      this.onChange(RichUtils.insertSoftNewline(editorState));
      return 'handled';
    }

    if (!e.altKey && !e.metaKey && !e.ctrlKey) {
      const currentBlock = getCurrentBlock(editorState);
      const blockType = currentBlock.getType();

      if (blockType === 'SLIDER') {
        this.onChange(addNewBlockAt(editorState, currentBlock.getKey()));
        return 'handled';
      }
    }
    return 'not_handled';
  }

  render() {
    const {
      editorState,
      inlineToolbar
    } = this.state;

    return (
      <div id="editor-container" className="c-editor-container js-editor-container">
        {inlineToolbar.show
          ? <InlineToolbar
          editorState={editorState}
          onToggle={this.toggleInlineStyle}
          position={inlineToolbar.position}
          setLink={this.setLink}
        />
          : null
        }
        <div className="section-name">
          Перетащите в область редактора несколько изображений:
        </div>
        <div
          className="editor"
          onClick={this.focus}
        >
          <Editor
            editorState={editorState}
            onChange={this.onChange}
            handleKeyCommand={this.handleKeyCommand}
            customStyleMap={customStyleMap}
            handleDroppedFiles={this.handleDroppedFiles}
            handleReturn={this.handleReturn}
            blockRenderMap={RenderMap}
            blockRendererFn={this.blockRendererFn}
            ref="editor"
          />
        </div>
      </div>
    );
  }
}

const customStyleMap = {
  HIGHLIGHT: {
    backgroundColor: 'palegreen',
  },
};

function findLinkEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === 'LINK'
      );
    },
    callback
  );
}

const Link = (props) => {
  const { url } = props.contentState.getEntity(props.entityKey).getData();

  return (
    <a href={url} title={url} className="ed-link">
      {props.children}
    </a>
  );
};

const customBlockRenderer = (setEditorState, getEditorState) => (contentBlock) => {
  const type = contentBlock.getType();

  switch (type) {
    case 'SLIDER':
      return {
        component: EditorSlider,
        props: {
          getEditorState,
          setEditorState,
        }
    };

    default: return null;
  }
};

const RenderMap = new Map({
  SLIDER: {
    element: 'div',
  }
}).merge(DefaultDraftBlockRenderMap);
