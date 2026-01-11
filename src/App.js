import React, { useState, useEffect } from 'react';
import './App.css';
import Menu from './components/Menu';
import PainelCodigo from './components/PainelCodigo';
import Guarda from './components/Guarda';
import VisaoGuarda from './components/VisaoGuarda';
import mapaPiso2 from './assets/imagens/mapa-piso2.png';
import { useMovimento } from './hooks/useMovimento'; 

function App() {
  const [jogoIniciado, setJogoIniciado] = useState(false);
  const [tempo, setTempo] = useState(300);
  const [mostrarPainel, setMostrarPainel] = useState(false);
  const [mostrarNota, setMostrarNota] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [guardaX, setGuardaX] = useState(400);
  const [direcao, setDirecao] = useState(1);
  const [temChave, setTemChave] = useState(false);
  const [escadasAbertas, setEscadasAbertas] = useState(false);
  const [vitoria, setVitoria] = useState(false);
  const [podeInteragir, setPodeInteragir] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");

  // CORREÇÃO 1: Apenas uma chamada ao Hook com todos os parâmetros necessários
  const { 
    posicao, 
    portaAberta, 
    setPortaAberta, 
    proximoDaPorta, 
    proximoDoItem, 
    apanhado,
    proximoDasEscadas,
    proximoDosArrumos
  } = useMovimento({ x: 0, y: 0 }, { x: guardaX, y: 250 }, direcao, escadasAbertas);

  // Detectar Game Over por colisão com o guarda
  useEffect(() => {
    if (apanhado) setGameOver(true);
  }, [apanhado]);

  useEffect(() => {
    const interagirPorta = proximoDaPorta && !portaAberta;
    const interagirEscadas = proximoDasEscadas && !escadasAbertas;
    const interagirOutros = proximoDoItem || proximoDosArrumos;

    if (interagirPorta || interagirEscadas || interagirOutros) {
      setPodeInteragir(true);
    } else {
      setPodeInteragir(false);
    }
  }, [proximoDaPorta, proximoDasEscadas, proximoDoItem, proximoDosArrumos, portaAberta, escadasAbertas]);

  // CORREÇÃO 2: Apenas um loop para o movimento do guarda
  useEffect(() => {
    if (jogoIniciado && !gameOver) {
      const t = setInterval(() => {
        setGuardaX(prev => {
          const limiteDireito = 700;
          const limiteEsquerdo = 450;

          if (prev >= limiteDireito) setDirecao(-1);
          if (prev <= limiteEsquerdo) setDirecao(1);
          
          return prev + (1.5 * direcao);
        });
      }, 30);
      return () => clearInterval(t);
    }
  }, [jogoIniciado, gameOver, direcao]);

  // 1. TEMPORIZADOR (Igual ao teu)
  useEffect(() => {
    let timer;
    if (jogoIniciado && !gameOver && tempo > 0 && !mostrarPainel && !mostrarNota) {
      timer = setInterval(() => {
        setTempo((prev) => prev - 1);
      }, 1000);
    } else if (tempo === 0) {
      setGameOver(true);
    }
    return () => clearInterval(timer);
  }, [jogoIniciado, gameOver, tempo, mostrarPainel, mostrarNota]);

  // 2. INTERAÇÕES (Igual ao teu)
  useEffect(() => {
    const handleInteracao = (e) => {
      if (!jogoIniciado || gameOver) return;
      if (e.code === 'Space') {
        if (proximoDaPorta && !portaAberta && !mostrarPainel) {
          setMostrarPainel(true);
        } else if (proximoDoItem && !mostrarNota) {
          setMostrarNota(true);
        }
        if (proximoDosArrumos && !temChave) {
            setTemChave(true);
            alert("Encontraste as chaves das escadas nos arrumos!");
        }
        if (proximoDasEscadas && temChave) {
            setEscadasAbertas(true);
            alert("Escadas destrancadas!");
        }
        if (proximoDasEscadas) {
          if (temChave) {
            setEscadasAbertas(true);
            setVitoria(true);
          } else {
            // Se não tem a chave, mostra o aviso
            setMensagemErro("Está trancada! Tenta procurar a chave no gabinete.");
            // O aviso desaparece após 3 segundos
            setTimeout(() => setMensagemErro(""), 3000);
          }
        }
      }
      if (e.code === 'Escape') {
        setMostrarNota(false);
        setMostrarPainel(false);
      }
      if (proximoDasEscadas && temChave) {
        setEscadasAbertas(true);
        setVitoria(true);
      }
    };
    window.addEventListener('keydown', handleInteracao);
    return () => window.removeEventListener('keydown', handleInteracao);
  }, [proximoDaPorta, proximoDoItem, portaAberta, jogoIniciado, gameOver, mostrarPainel, mostrarNota, proximoDosArrumos, proximoDasEscadas, temChave]);

  const validarCodigo = (codigoInserido) => {
    if (codigoInserido === "1234") {
      setPortaAberta(true);
      setMostrarPainel(false);
    } else {
      alert("Código Incorreto!");
    }
  };

  const formatarTempo = (segundos) => {
    const mins = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${mins.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="game-container">
      {gameOver && (
        <div className="modal-sobreposicao" style={{ zIndex: 1000 }}>
          <div className="game-over-card">
            <h1>{apanhado ? "APANHADO!" : "TEMPO ESGOTADO"}</h1>
            <button onClick={() => window.location.reload()}>TENTAR NOVAMENTE</button>
          </div>
        </div>
      )}

      {vitoria && (
        <div className="modal-sobreposicao" style={{ zIndex: 1100, backgroundColor: 'rgba(0, 50, 0, 0.9)' }}>
          <div className="game-over-card" style={{ borderColor: '#00ff00' }}>
            <h1 style={{ color: '#00ff00' }}>MISSIÃO CUMPRIDA!</h1>
            <p style={{ color: 'white', marginBottom: '20px' }}>Conseguiste escapar do hospital!</p>
            <button 
              onClick={() => window.location.reload()}
              style={{ backgroundColor: '#00ff00', color: 'black' }}
            >
              JOGAR NOVAMENTE
            </button>
          </div>
        </div>
      )}

      {mensagemErro && (
        <div className="aviso-trancado">
          <p>{mensagemErro}</p>
        </div>
      )}

      {podeInteragir && !mostrarPainel && !mostrarNota && (
        <div className="aviso-interacao">
          <span className="tecla-espaco">ESPAÇO</span> INTERAGIR
        </div>
      )}

      {!jogoIniciado && <Menu aoIniciar={() => setJogoIniciado(true)} />}

      {jogoIniciado && !gameOver && (
        <div className="game-viewport">
          {proximoDaPorta && !portaAberta && !mostrarPainel && (
            <div className="tooltip-interacao">Pressiona ESPAÇO para inserir código</div>
          )}

          {proximoDoItem && !mostrarNota && (
            <div className="tooltip-interacao">Pressiona ESPAÇO para ler a nota</div>
          )}

          {mostrarPainel && (
            <PainelCodigo aoConfirmar={validarCodigo} aoFechar={() => setMostrarPainel(false)} />
          )}

          {mostrarNota && (
            <div className="modal-sobreposicao" onClick={() => setMostrarNota(false)}>
              <div className="nota-papel">
                <p>O código da porta é 1234</p>
                <small>(Clica para fechar)</small>
              </div>
            </div>
          )}

          <div className="hud-container">
            <div className={tempo < 30 ? "tempo-alerta" : ""}>🕒 {formatarTempo(tempo)}</div>
            <div>PISO 2</div>
          </div>

          <div className="jogador">🦽</div>

          <div 
            className="mapa-pixelizado" 
            style={{ 
              transform: `translate(${-posicao.x}px, ${-posicao.y}px)`,
              backgroundImage: `url(${mapaPiso2})`,
              width: '1188px', height: '756px', backgroundSize: '100% 100%'
            }}
          >
            <VisaoGuarda x={guardaX} y={340} direcao={direcao} />
            <Guarda x={guardaX} y={420} direcao={direcao} />
          </div>  
        </div>
      )}
    </div>
  );
}

export default App;