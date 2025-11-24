import React from 'react';

const Header = () => {
  return (
    <header style={{
      backgroundColor: '#213547',
      color: 'white',
      padding: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: '8px',
      marginBottom: '1rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{
          backgroundColor: '#646cff',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: '1rem',
          fontWeight: 'bold'
        }}>
          FS
        </div>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>FlowServe</h1>
      </div>
      <div>
        <button style={{
          backgroundColor: '#646cff',
          color: 'white',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          cursor: 'pointer',
          marginLeft: '0.5rem'
        }}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;