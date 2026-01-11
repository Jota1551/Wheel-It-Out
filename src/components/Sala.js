import React from 'react';

// Este componente desenha uma sala individual baseada no esquema
function Sala({ dados }) {
  const estiloSala = {
    position: 'absolute',
    left: `${dados.x}px`,
    top: `${dados.y}px`,
    width: `${dados.w}px`,
    height: `${dados.h}px`,
    border: '2px solid white',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    textAlign: 'center'
  };

  return (
    <div style={estiloSala}>
      {dados.nome}
    </div>
  );
}

export default Sala;