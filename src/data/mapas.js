export const MAPAS = {
  PISO_2: {
    nome: "Piso 2 - Alas Residenciais",
    salas: [
      { id: "quarto1", nome: "Quarto 1", x: 10, y: 10, w: 100, h: 80 },
      { id: "quarto2", nome: "Quarto 2", x: 120, y: 10, w: 100, h: 80 },
      { id: "quartoA1", nome: "Quarto A1", x: 230, y: 10, w: 150, h: 80 },
      { id: "corredor", nome: "Corredor Principal", x: 10, y: 100, w: 370, h: 60 },
      { id: "escadas", nome: "Escadas", x: -40, y: 100, w: 40, h: 120 }, // Saída para Piso 1
      { id: "quarto3", nome: "Quarto 3", x: 10, y: 170, w: 100, h: 80 },
      { id: "quarto4", nome: "Quarto 4", x: 120, y: 170, w: 100, h: 80 },
      { id: "quarto5", nome: "Quarto 5", x: 230, y: 170, w: 90, h: 80 },
      { id: "arrumos", nome: "Arrumos", x: 330, y: 170, w: 50, h: 80 },
    ]
  },
  PISO_1: {
    nome: "Piso 1 - Serviços e Receção",
    salas: [
      { id: "rececao", nome: "Receção", x: 10, y: 50, w: 120, h: 80 },
      { id: "sala_estar", nome: "Sala de Estar", x: 140, y: 50, w: 180, h: 150 },
      { id: "cantina", nome: "Cantina", x: 330, y: 10, w: 80, h: 140 },
      { id: "enfermaria", nome: "Enfermaria", x: 230, y: 10, w: 90, h: 30 },
      // ... adicionar as restantes conforme o esquema
    ]
  }
};