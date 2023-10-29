import { Route, Routes } from 'react-router-dom';
import MenuAdminPage from "./pages/MenuAdminPage";
import WarehouseAdminPage from "./pages/WarehouseAdminPage";
import BranchesAdminPage from "./pages/BranchesAdminPage";
import EmployeesPageAdmin from "./pages/EmployeesPageAdmin";
import Auth from './pages/Auth';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element = {<MenuAdminPage/>}/>
        <Route path='/warehouse-admin-page' element = {<WarehouseAdminPage/>}/>
        <Route path='/branches-admin-page' element = {<BranchesAdminPage/>}/>
        <Route path='/employees-page-admin' element = {<EmployeesPageAdmin/>}/>
        <Route path='/auth' element = {<Auth/>}/>
      </Routes>
    </div>
  );
}

export default App;
