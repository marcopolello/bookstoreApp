import { readFileSync } from 'fs';

// Sostituisci questo percorso con il percorso della tua immagine
const imagePath = './image.jpg';

try {
    // Leggi l'immagine come buffer
    const imageBuffer = readFileSync(imagePath);
    
    // Converti in base64 e aggiungi il prefisso appropriato
    const base64Image = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
    
    // Stampa il risultato
    console.log(base64Image);
} catch (error) {
    console.error('Errore nella conversione:', error);
}
