
import {BrowserRouter as Router, Route, Routes, useNavigate} from "react-router-dom";

import RecipeShowcase from "./pages/MainPage";
import CreateRecipeForm from "./pages/CreateRecipePage";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RecipeShowcase  />} />
        <Route path="/create-recipe" element={<CreateRecipeForm />} />
      </Routes>
      
    </Router>
  )
}

export default App