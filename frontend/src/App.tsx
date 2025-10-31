import Game from "./Game";
import "./App.css";
import { ScenarioTitle } from "./components/common/ScenarioTitle";
import { FinalSceneText } from "./components/common/FinalSceneText";

function App() {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div>
        <Game />
      </div>

      {/* React Components Overlay */}
      <div
        id="ui-overlay"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none", // allows clicks to pass through if needed
        }}
      >
        <ScenarioTitle />
        <FinalSceneText />
      </div>
    </div>
  );
}

export default App;
