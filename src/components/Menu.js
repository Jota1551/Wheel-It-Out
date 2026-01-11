import React from 'react';

function Menu({ aoIniciar }) {
  return (
    <div className="menu-overlay">
      <div className="menu-caixa">
        <h1>WHEEL IT OUT</h1>
        <p>A tua neta está prestes a dar à luz!</p>
        <p>Escapa do lar antes que o tempo se esgote.</p>
        
        <button className="botao-jogar" onClick={aoIniciar}>
          INICIAR FUGA
        </button>

        <div className="instrucoes">
          <p><strong>Controlos:</strong> WASD para mover | Espaço para interagir</p>
        </div>
      </div>
    </div>
  );
}

export default Menu;