import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header/Header";
import Home from "./pages/Home";
import HouseDetail from "./pages/HouseDetail";
import "./App.css";
import Filter from "./Filter/Filter";
import Survey from "./Survey/Survey";
import Forum from "./Forum/Forum";
import Modal from "./components/Modal/Modal";
// import Admin from "./admin/App"
const Layout = () => {
  return (
    <>
      <div className="content">
        <Routes>
          {/* <Route path="/admin" element={<Admin />} /> */}

          <Route path="/" element={<Home />} />
          <Route path="/house/:id" element={<HouseDetail />} />
          <Route path="/filter" element={<Filter />} />
          <Route path="/survey" element={<Survey />} />
          <Route path="/forum" element={<Forum />} />
        </Routes>
      </div>
    </>
  );
};
export const ModalContext = React.createContext();
const App = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({ desc: "", note: "" });

  const showModal = (desc, note, type = "success") => {
    console.log("showModal called with:", desc, note);
    setModalContent({ desc, note, type });
    setIsModalVisible(false);
    setTimeout(() => {
      setIsModalVisible(true);
      console.log("Modal is now visible");
    }, 50);
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };
  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {isModalVisible && (
        <Modal
          desc={modalContent.desc}
          note={modalContent.note}
          type={modalContent.type}
          onClose={hideModal}
        />
      )}
      <Router>
        <Layout />
      </Router>
    </ModalContext.Provider>
  );
};

export default App;
