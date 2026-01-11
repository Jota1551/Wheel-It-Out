import { useState, useEffect, useRef } from 'react';
import mascaraImg from '../assets/imagens/mapa-colisao.png';

// 1. O Hook agora recebe guardaPos e direcaoGuarda como argumentos
export const useMovimento = (posicaoInicial, guardaPos, direcaoGuarda, escadasAbertas) => {
  const [posicao, setPosicao] = useState(posicaoInicial);
  const posicaoRef = useRef(posicaoInicial);
  const [teclasPremidas, setTeclasPremidas] = useState({});
  /*const [dadosColisao, setDadosColisao] = useState(null);*/
  const [portaAberta, setPortaAberta] = useState(false);
  const [proximoDaPorta, setProximoDaPorta] = useState(false);
  const [proximoDoItem, setProximoDoItem] = useState(false);
  const [apanhado, setApanhado] = useState(false);
  const [proximoDasEscadas, setProximoDasEscadas] = useState(false);
  const [proximoDosArrumos, setProximoDosArrumos] = useState(false);

  // 2. Refs para manipular a máscara dinamicamente
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const imgMascaraRef = useRef(null);

  const VELOCIDADE = 4;
  const ESCALA = 4;
  const LARGURA_ORIGINAL = 297;
  const ALTURA_ORIGINAL = 189;
  const RAIO_COLISAO = 12; 
  const RAIO_INTERACAO = 16; 

  // 3. Inicializa o Canvas uma única vez e guarda a imagem original
  useEffect(() => {
    const img = new Image();
    img.src = mascaraImg;
    img.onload = () => {
      imgMascaraRef.current = img;
      const canvas = document.createElement('canvas');
      canvas.width = LARGURA_ORIGINAL;
      canvas.height = ALTURA_ORIGINAL;

      /*// --- ADICIONA ISTO PARA VER O CANVAS NO JOGO ---
      canvas.style.position = "fixed";
      canvas.style.top = "10px";
      canvas.style.left = "10px";
      canvas.style.zIndex = "9999";
      canvas.style.border = "2px solid red";
      canvas.style.background = "white"; // Para veres bem as cores
      canvas.style.transform = "scale(1)"; // Aumenta para veres melhor
      canvas.style.imageRendering = "pixelated";
      document.body.appendChild(canvas); 
      // ----------------------------------------------*/

      canvasRef.current = canvas;
      ctxRef.current = canvas.getContext('2d', { willReadFrequently: true });
    };
  }, []);

  // 4. Função de verificação de cor adaptada para ler do Canvas dinâmico
  const verificarCor = (x, y) => {
    if (!ctxRef.current) return { r: 0, g: 0, b: 0, a: 0 };
    const mapaX = Math.floor((x + 300) / ESCALA);
    const mapaY = Math.floor((y + 200) / ESCALA);
    
    if (mapaX < 0 || mapaX >= LARGURA_ORIGINAL || mapaY < 0 || mapaY >= ALTURA_ORIGINAL) 
      return { r: 0, g: 0, b: 0, a: 255 };

    const pixel = ctxRef.current.getImageData(mapaX, mapaY, 1, 1).data;
    return { r: pixel[0], g: pixel[1], b: pixel[2], a: pixel[3] };
  };

  useEffect(() => {
    const handleKeyDown = (e) => setTeclasPremidas(p => ({ ...p, [e.key.toLowerCase()]: true }));
    const handleKeyUp = (e) => setTeclasPremidas(p => ({ ...p, [e.key.toLowerCase()]: false }));
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const loop = setInterval(() => {
      if (!ctxRef.current || !imgMascaraRef.current) return;
      let ajusteX = 0;
      const ajusteY = 220;

      // --- A. DESENHAR MÁSCARA DINÂMICA ---
      // Limpa o canvas e desenha a máscara de colisão original (paredes)
      ctxRef.current.clearRect(0, 0, LARGURA_ORIGINAL, ALTURA_ORIGINAL);
      ctxRef.current.drawImage(imgMascaraRef.current, 0, 0);

      if (direcaoGuarda === 1) {
        // Quando olha para a DIREITA
        ajusteX = 40; // Ajusta este valor para aproximar/afastar o cone da cara
      } else {
        // Quando olha para a ESQUERDA
        ajusteX = 20; // Ajusta este valor (provavelmente menor que o da direita)
      }

      // Desenha o "Verde" do guarda na posição atual dele
      // Convertemos a posição do ecrã para a escala da máscara
      const gx = (guardaPos.x + ajusteX) / ESCALA;
      const gy = (guardaPos.y + ajusteY) / ESCALA;
      
      ctxRef.current.fillStyle = 'rgb(0, 255, 0)';
      ctxRef.current.beginPath();
      // Desenha um triângulo (cone de visão) à frente do guarda
      ctxRef.current.moveTo(gx, gy);
      const alcance = 40; // Comprimento do cone na máscara
      const largura = 15; // Largura do cone na máscara
      if (direcaoGuarda === 1) {
        ctxRef.current.lineTo(gx + alcance, gy - largura);
        ctxRef.current.lineTo(gx + alcance, gy + largura);
      } else {
        ctxRef.current.lineTo(gx - alcance, gy - largura);
        ctxRef.current.lineTo(gx - alcance, gy + largura);
      }

      ctxRef.current.closePath();
      ctxRef.current.fill();

      // --- B. DETEÇÃO DE CORES (Radar e Morte) ---
      const px = posicaoRef.current.x;
      const py = posicaoRef.current.y;
      
      const cCentro = verificarCor(px, py);

      // Detetar se o jogador pisou no VERDE desenhado agora mesmo
      if (cCentro.g > 200 && cCentro.r < 50 && cCentro.b < 50) {
        setApanhado(true);
      }

      // Radar de interação (Porta e Itens)
      const pontosInteracao = [
        { x: px, y: py },
        { x: px - RAIO_INTERACAO, y: py },
        { x: px + RAIO_INTERACAO, y: py },
        { x: px, y: py - RAIO_INTERACAO },
        { x: px, y: py + RAIO_INTERACAO }
      ];

      let detetouPorta = false;
      let detetouItem = false;
      let escadas = false;
      let arrumos = false;

      for (let p of pontosInteracao) {
        const c = verificarCor(p.x, p.y);
        if (c.r > 200 && c.g < 50 && c.b < 50) detetouPorta = true;
        if (c.r < 50 && c.g < 50 && c.b > 200) detetouItem = true;
        if (c.r > 200 && c.g > 200 && c.b < 50) escadas = true;
        if (c.r < 50 && c.g > 200 && c.b > 200) arrumos = true;
      }
      
      setProximoDaPorta(detetouPorta);
      setProximoDoItem(detetouItem);
      setProximoDasEscadas(escadas);
      setProximoDosArrumos(arrumos);

      // --- C. MOVIMENTO DO JOGADOR ---
      setPosicao((prev) => {
        let nX = prev.x;
        let nY = prev.y;
        if (teclasPremidas['w']) nY -= VELOCIDADE;
        if (teclasPremidas['s']) nY += VELOCIDADE;
        if (teclasPremidas['a']) nX -= VELOCIDADE;
        if (teclasPremidas['d']) nX += VELOCIDADE;

        const checarColisaoFisica = (x, y) => {
          const pontosFisicos = [
            { x, y },
            { x: x - RAIO_COLISAO, y: y - RAIO_COLISAO },
            { x: x + RAIO_COLISAO, y: y - RAIO_COLISAO },
            { x: x - RAIO_COLISAO, y: y + RAIO_COLISAO },
            { x: x + RAIO_COLISAO, y: y + RAIO_COLISAO }
          ];
          for (let p of pontosFisicos) {
            const c = verificarCor(p.x, p.y);
            if (c.a !== 0 && c.r < 50 && c.g < 50 && c.b < 50) return true;
            if (!portaAberta && c.r > 200 && c.g < 50 && c.b < 50) return true;
            if (!escadasAbertas && c.r > 200 && c.g > 200 && c.b < 50) return true;
          }
          return false;
        };

        const moveuX = !checarColisaoFisica(nX, prev.y);
        const moveuY = !checarColisaoFisica(moveuX ? nX : prev.x, nY);
        const novaPos = { x: moveuX ? nX : prev.x, y: moveuY ? nY : prev.y };
        posicaoRef.current = novaPos;
        return novaPos;
      });
    }, 1000 / 60);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      clearInterval(loop);
    };
  }, [teclasPremidas, portaAberta, escadasAbertas, guardaPos, direcaoGuarda]); // Dependências atualizadas

  // 5. Retorna o estado 'apanhado' para o App.js
  return { posicao, portaAberta, setPortaAberta, proximoDaPorta, proximoDoItem, apanhado, proximoDasEscadas, proximoDosArrumos };
};