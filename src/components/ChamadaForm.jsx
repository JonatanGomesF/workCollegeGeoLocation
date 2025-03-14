import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ChamadaForm.module.css';
const FACULDADE_LAT = -23.393763; //-23.267737; // Latitude da minha casa (testezinho)
//const FACULDADE_LAT =  -23.26869223475282; //-23.267737;  // Latitude da faculdade
const FACULDADE_LON = -47.341203; //-47.299174; // Longitude da minha casa (testezinho)
//const FACULDADE_LON = -47.29805184868463;//-47.341203;   // Longitude da faculdade
const RAIO_MAX_KM = 1; // Raio máximo permitido (1 km)
 
function calcularDistancia(lat1, lon1, lat2, lon2) {
  const R = 6371; // Raio da Terra em km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Retorna a distância em km
}

const ChamadaForm = () => {
  const [aluno, setAluno] = useState('');
  const [professor, setProfessor] = useState('');
  const [RGM, setRGM] = useState('');
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [distancia, setDistancia] = useState(null);
  const [permitido, setPermitido] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;
        setLocation({ latitude: userLat, longitude: userLon });

        const distanciaCalculada = calcularDistancia(userLat, userLon, FACULDADE_LAT, FACULDADE_LON);
        setDistancia(distanciaCalculada);

        if (distanciaCalculada <= RAIO_MAX_KM) {
          setPermitido(true);
        } else {
          setPermitido(false);
        }
      },
      error => console.error('Erro ao obter localização', error)
    );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!permitido) {
      alert('Você está fora do raio permitido para registrar presença.');
      return;
    }
    await axios.post('http://localhost:3002/chamada', {
      aluno,
      RGM,
      professor,
      latitude: location.latitude,
      longitude: location.longitude
    });
    alert('Chamada registrada!');
  };

  return (
    <div className={styles.central}>
      <h2 className={styles.epigrafe}>Registro de Chamada</h2>
      <p className={styles.distFacul}>{distancia !== null ? `Distância até a faculdade: ${distancia.toFixed(2)} km` : 'Obtendo localização...'}</p>
      {permitido ? <p className={styles.Raio}>✅ Você está dentro do raio permitido!</p> : <p className={styles.foraRaio}>❌ Você está fora do raio permitido!</p>}
      
      <form onSubmit={handleSubmit}>
        <label>Nome do aluno</label><br />
        <input type="text" placeholder="Nome do aluno" value={aluno} onChange={e => setAluno(e.target.value)} required /><br />
        <label>RGM:</label><br />
        <input type="text" placeholder="RGM" value={RGM} onChange={e => setRGM(e.target.value)} required /><br />
        <label>Nome do professor</label><br />
        <input type="text" placeholder="Nome do professor" value={professor} onChange={e => setProfessor(e.target.value)} required /><br /><br />
        <button type="submit" disabled={!permitido}>Registrar Presença</button>
      </form>
    </div>
  );
};

export default ChamadaForm;