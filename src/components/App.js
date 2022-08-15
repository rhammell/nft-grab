import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { useMoralis } from "react-moralis"

import Layout from './Layout'
import Home from './Home'
import Grabs from './Grabs'
import NewGrab from './NewGrab'
import MyGrabs from './MyGrabs'
import NotFound from './NotFound'

const App = () => {
  const { enableWeb3, isWeb3Enabled, isWeb3EnableLoading } = useMoralis();

  useEffect( async () => {
    const connectorId = window.localStorage.getItem("connectorId");
    if (connectorId && !isWeb3Enabled && !isWeb3EnableLoading) {
      await enableWeb3({ provider: connectorId, anyNetwork: "true" });
    }
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
