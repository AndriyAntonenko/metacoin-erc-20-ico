import { Container, Grid, Divider } from "semantic-ui-react";
import { Account } from './components/Account'
import { InputForm } from './components/InputForm';
import { Greetings } from './components/Greetings'
import "semantic-ui-css/semantic.min.css";

function App() {
  const SemanticGrid = Grid as any
  return (
    <div>
      <Container>
        <Divider />
        <Greetings />
        <Divider />
        <SemanticGrid columns={1} padded>
          <Grid.Row>
            <Grid.Column><Account /></Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column><InputForm /></Grid.Column>
          </Grid.Row>
        </SemanticGrid>
      </Container>
    </div>
  );
}

export default App;
