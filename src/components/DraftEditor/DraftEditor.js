import './DraftEditor.styl';

import React, { Component } from 'react';

import {
  Editor,
  EditorState,
  RichUtils,
  CompositeDecorator
} from 'draft-js';

import {
  getSelectionRange,
  getSelectionCoords
} from 'utils';

import {
  InlineToolbar
} from 'components';

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

    this.focus = () => this.refs.editor.focus();
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

  handleKeyCommand(command) {
    const { editorState } = this.state;
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      this.onChange(newState);
      return true;
    }

    return false;
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
          Now you can wrap the selected text into link:
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
