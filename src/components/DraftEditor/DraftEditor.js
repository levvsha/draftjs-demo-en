import './DraftEditor.styl';

import React, { Component } from 'react';

import {
  Editor,
  EditorState
} from 'draft-js';

export default class DraftEditor extends Component {
  constructor() {
    super();

    this.state = {
      editorState: EditorState.createEmpty()
    };

    this.onChange = (editorState) => this.setState({ editorState });
  }

  render() {
    const {
      editorState
    } = this.state;

    return (
      <div id="editor-container" className="c-editor-container js-editor-container">
        <div className="editor">
          <Editor
            editorState={editorState}
            onChange={this.onChange}
            placeholder="Здесь можно печатать..."
          />
        </div>
      </div>
    );
  }
}
