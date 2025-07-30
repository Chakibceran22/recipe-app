
import {BrowserRouter as Router, Route, Routes, useNavigate} from "react-router-dom";

import RecipeShowcase from "./pages/MainPage";
import CreateRecipeForm from "./pages/CreateRecipePage";
import { QueryClientProvider,QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
const App = () => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <Router>
      <Routes>
        <Route path="/" element={<RecipeShowcase  />} />
        <Route path="/create-recipe" element={<CreateRecipeForm queryClient={queryClient} />} />
      </Routes>
    </Router>
    </QueryClientProvider>
  )
}

export default App