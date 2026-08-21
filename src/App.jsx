import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import UserPresence from "./components/common/UserPresence";

function App() {
  return (
    <BrowserRouter>
    <UserPresence/>
     <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
