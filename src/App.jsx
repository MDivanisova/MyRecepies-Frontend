import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './routes/ProtectedRoute';
import VerifyPage from './pages/VerifyPage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import InternalServerPage from './pages/InternalServerPage';
import "./index.css"
import UnauthorizedRoute from './routes/UnauthorizedRoute';
import HelpPage from './pages/HelpPage';
import ProfilePage from './pages/ProfilePage';
import AddRecepiePage from './pages/AddRecepiePage';
import ManageUsersPage from './pages/ManageUsersPage';
import BookmarkPage from './pages/BookmarkPage';
import StatisticPage from './pages/StatisticPage';
import RecipeDetailPage from './pages/RecipeDetailPage';

function App() {

  return (
    <>
      <Routes>
        {/* Unauthorized routes*/}
        <Route element={<UnauthorizedRoute />}>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/verify' element={<VerifyPage />} />
        </Route>
        
        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path='/' element={<HomePage />}></Route>
          <Route path='/help' element={<HelpPage />} />
          <Route path='/profile/me' element={<ProfilePage />} />
          <Route path='/profile/:userId' element={<ProfilePage />} />
          <Route path='/addRecepie' element={<AddRecepiePage />} />
          <Route path='/manageUsers' element={<ManageUsersPage />} />
          <Route path='/bookmarks' element={<BookmarkPage />} />
          <Route path='/statistic' element={<StatisticPage />} />
          <Route path='/recipe/details/:recipeId' element={<RecipeDetailPage />} />
        </Route>

        <Route path='/pageNotFound' element={<NotFoundPage />} />
        <Route path='/internalServerError' element={<InternalServerPage />} />
        
        <Route path='*' element={<NotFoundPage />}/>        
      </Routes>
    </>
  )
}

export default App
