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

    this.onChange = (editorState) => {
      console.log('editorState ==>', editorState.toJS());

      this.setState({ editorState });
    }
  }

  render() {
    const {
      editorState
    } = this.state;

    return (
      <div id="editor-container" className="c-editor-container js-editor-container">
        <div className="editor" onClick={() => this.refs.editor.focus()}>
          <Editor
            ref="editor"
            editorState={editorState}
            onChange={this.onChange}
            placeholder="You can type here..."
          />
        </div>
      </div>
    );
  }
}
