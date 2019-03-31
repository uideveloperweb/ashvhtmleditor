import React, { Component } from 'react';
import './App.css';
import Editor from './editor/Editor';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="container">
		      <div className="row">
				    <div className="col-md-12 tags buttons">
              <Editor></Editor>
			      </div>
			    </div>
        </div>
      </div>
    );
  }
}

export default App;
