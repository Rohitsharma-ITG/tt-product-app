import { BrowserRouter } from "react-router-dom";
import './App.css'
import Routes from "./Routes";

function App() {
  const pages: Record<string, unknown> = import.meta.glob("./pages/**/!(*.test.[jt]sx)*.([jt]sx)", { eager: true });
  return (
    <div className="ug-cards">
      <BrowserRouter>
        <Routes pages={pages} />
      </BrowserRouter>
    </div>
  )
}
export default App
