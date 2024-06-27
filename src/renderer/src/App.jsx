import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import Company from "./components/Company";
import CompanyMenu from "./components/CompanyMenu";
import Employee from "./components/Employee";
import Login from "./components/Login"
import EmployeeMenu from "./components/EmployeeMenu";


function App() {
  

  return (
    <>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="companymenu/" element={<CompanyMenu/>} />
          <Route path="employeemenu/" element={<EmployeeMenu/>} />
          <Route path="signupemployee/" element={<Employee/>} />
          <Route path="signupcompany/" element={<Company/>}/>
          <Route path="home/" />
        </Routes>
      </HashRouter>
    </>
  )
}

export default App

