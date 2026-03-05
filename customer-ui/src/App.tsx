import "./App.scss";
import CustomerList from "./pages/CustomerList";
import ErrorBoundary from "./components/molecules/ErrorBoundary/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <CustomerList />
    </ErrorBoundary>
  );
}

export default App;
