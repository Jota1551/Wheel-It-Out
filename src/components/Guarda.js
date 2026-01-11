import React from 'react';
import spriteGuarda from '../assets/imagens/Guarda.png';

const Guarda = ({ x, y, direcao }) => {
  return (
    <div 
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        zIndex: 10,
        pointerEvents: 'none',
        // Inverte a imagem quando ele muda de direção
        transform: direcao === 1 ? 'scaleX(1)' : 'scaleX(-1)',
        transition: 'transform 0.2s'
      }}
    >
      <img 
        src={spriteGuarda} 
        alt="Guarda" 
        style={{ width: '50px' }} 
      />
    </div>
  );
};

export default Guarda;