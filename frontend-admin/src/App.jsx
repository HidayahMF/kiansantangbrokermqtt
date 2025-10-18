import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Users from "./view/Users";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/users" element={<Users />} />
      </Routes>
    </Router>
  );
}

export default App;
