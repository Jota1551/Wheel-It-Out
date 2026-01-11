import React, { useEffect, useRef } from 'react';

const VisaoGuarda = ({ x, y, direcao }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Limpar o triângulo anterior
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Configuração visual do cone
    ctx.fillStyle = 'rgba(0, 255, 0, 0.3)'; // Verde semi-transparente
    ctx.beginPath();
    
    const alcance = 160; // Quão longe o jogador vê o cone no mapa
    const largura = 40;  // Quão largo o cone parece
    
    if (direcao === 1) {
      ctx.moveTo(0, 100);
      ctx.lineTo(alcance, 100 - largura);
      ctx.lineTo(alcance, 100 + largura);
    } else {
      ctx.moveTo(300, 100);
      ctx.lineTo(300 - alcance, 100 - largura);
      ctx.lineTo(300 - alcance, 100 + largura);
    }
    
    ctx.closePath();
    ctx.fill();
  }, [direcao]);

  return (
    <canvas
      ref={canvasRef}
      width={300} // Tamanho da área de desenho do cone
      height={200}
      style={{
        position: 'absolute',
        left: direcao === 1 ? `${x + 20}px` : `${x - 250}px`, // Ajusta conforme o corpo do guarda
        top: `${y + 20}px`, // Ajusta para a altura dos olhos
        transform: 'scale(0.8)',
        pointerEvents: 'none',
        zIndex: 9
      }}
    />
  );
};

export default VisaoGuarda;