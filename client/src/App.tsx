import { Container } from "semantic-ui-react";
import { Account } from './components/Account'
import { InputForm } from './components/InputForm';
import "semantic-ui-css/semantic.min.css";

function App() {
  return (
    <div className="App">
      <Container>
        <Account />
        <InputForm />
      </Container>
    </div>
  );
}

export default App;
