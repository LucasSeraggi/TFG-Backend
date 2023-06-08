import app from './src/app'
import { FirebaseConfig } from './src/services/firebase/config';

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log('Server running in port ', port);
  // TODO: Ativar segurança no Storage do Firebase, com email e senha
  new FirebaseConfig()
})
