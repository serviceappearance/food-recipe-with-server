import Main from "./components/Main";
import Random from "./components/Random";
import Like from "./components/Like";
import Recipe from "./components/Recipe";

function App() {
  return (
    <div className="App bg-slate-100">
      <Main/>
      <Random/>
      <Recipe/>
      <Like/>
    </div>
  );
}

export default App;
