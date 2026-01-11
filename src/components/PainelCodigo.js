import React, { useState } from 'react';

const PainelCodigo = ({ aoConfirmar, aoFechar }) => {
  const [input, setInput] = useState("");

  return (
    <div className="modal-sobreposicao">
      <div className="caixa-codigo">
        <h3>SISTEMA DE SEGURANÇA</h3>
        <p>Introduza o código de acesso:</p>
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          maxLength={4}
          autoFocus
        />
        <div className="botoes-painel">
          <button onClick={() => aoConfirmar(input)}>OK</button>
          <button onClick={aoFechar}>CANCELAR</button>
        </div>
      </div>
    </div>
  );
};

export default PainelCodigo;