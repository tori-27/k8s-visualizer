import { createAppRoot } from "./composition/createAppRoot";
import StoresProvider from "./providers/StoresProvider";
import ClusterPage from "../pages/cluster/ClusterPage";

// The app root is created once at module load. Building it outside the React
// tree means no `useEffect`/bootstrap hook is needed and StrictMode's double
// render can't double-instantiate stores or infrastructure.
const root = createAppRoot();

// Compositional root: provide the stores and render the page. Nothing else.
export default function App() {
  return (
    <StoresProvider root={root}>
      <ClusterPage />
    </StoresProvider>
  );
}
