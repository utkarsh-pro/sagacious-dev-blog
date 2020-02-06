import React from 'react';
import Editor from './components/Editor';
import Classes from './App.module.css';

const App = () => {
  return (
    <div className={Classes.App}>
      <Editor className={Classes.editor} language="typescript" />
    </div>
  );
}

export default App;
