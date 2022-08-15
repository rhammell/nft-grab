import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { useMoralis } from "react-moralis"

import Layout from './components/Layout'
import Home from './components/Home'
import Grabs from './components/Grabs'
import NewGrab from './components/NewGrab'
import MyGrabs from './components/MyGrabs'
import NotFound from './components/NotFound'

const App = () => {
  const { enableWeb3, isAuthenticated, isWeb3Enabled, isWeb3EnableLoading } = useMoralis();

  /*
  useEffect(() => {
    const connectorId = window.localStorage.getItem("connectorId");
    if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading)
      enableWeb3({ provider: connectorId });
  }, [isAuthenticated, isWeb3Enabled]);
  */

  useEffect(() => {
    const connectorId = window.localStorage.getItem("connectorId");
    if (connectorId && !isWeb3Enabled && !isWeb3EnableLoading)
      enableWeb3({ provider: connectorId });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="grabs" element={<Grabs />} />
          <Route path="new-grab" element={<NewGrab />} />
          <Route path="my-grabs" element={<MyGrabs />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
