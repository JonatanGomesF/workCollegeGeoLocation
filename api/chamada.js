// api/chamada.js
import mysql from 'mysql2';

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'chamada_db'
});

// Função serverless para registrar chamada
export default function handler(req, res) {
  if (req.method === 'POST') {
    const { aluno, RGM, professor, latitude, longitude } = req.body;
    const query = 'INSERT INTO chamadas (aluno, RGM, professor, latitude, longitude) VALUES (?, ?, ?, ?, ?)';

    // Executa a query no banco de dados
    db.query(query, [aluno, RGM, professor, latitude, longitude], (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Erro ao registrar chamada', details: err });
        return;
      }
      res.status(200).json({ message: 'Chamada registrada com sucesso' });
    });
  } else {
    // Retorna erro 405 se o método não for POST
    res.status(405).json({ error: 'Método não permitido' });
  }
}
