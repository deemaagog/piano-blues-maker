import React from 'react';
import Header from '../containers/Header'
import Scheme from '../containers/Scheme'
import Sheet from '../containers/Sheet'

const App = () => {
    return (
      <div className='app'>
        <Header/>
        <div className='main'>
          <Scheme/>
          <Sheet/>
        </div>
      </div>
    );
}

export default App;
