import React from 'react';
import Header from '../containers/Header'
import Scheme from '../containers/Scheme'
import SheetContainer from '../containers/SheetContainer'



const App = () => {
  return (
    <div className='app'>
      <Header />
      <div className='main'>
        <Scheme />
        <SheetContainer />
      </div>
    </div>
  );
}

export default App;
