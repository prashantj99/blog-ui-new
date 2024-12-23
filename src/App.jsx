import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home.page";
import Signup from "./pages/signup.page";
import Login from "./pages/login.page";
import EditorPage from "./pages/editor.page";
import PrivateRouteWrapper from "./components/PrivateRouteWrapper";
import ResetPasswordPage from "./pages/reset-password.page";
import ChangePasswordPage from "./pages/change-password.page"
import NotFoundPage from "./pages/404.page";
import Layout from "./components/Layout.jsx";
import Unauthorized from './pages/Unauthorized.page.jsx'
import { ROLES } from './commons/AppConstant.jsx'
import PersistentLogin from './components/PersistentLogin.jsx'
import ProfilePage from './pages/profile.page.jsx'
import PersonalInfo from "./components/PersonalInfo.jsx";
import InternalServerError from "./pages/500.page.jsx";
import UserBlogs from "./components/UserBlogs.jsx";
import TopicPage from "./pages/topics.page.jsx";
import ReadMorePage from "./pages/read-more.page.jsx";
import SearchResultPage from "./pages/search-result.page.jsx";
import UserPublicProfilePage from "./pages/user-public-profile.page.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgotpassword" element={<ResetPasswordPage />} />
        <Route path="/changepassword" element={<ChangePasswordPage />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/500" element={<InternalServerError />} />
        <Route path="/" element={<Layout />}>
          {/* Private routes */}
          <Route element={<PersistentLogin />}>
            <Route element={<PrivateRouteWrapper allowedRoles={[ROLES.User, ROLES.Admin]} />}>
              <Route exact path="/feed" element={<Home />} />
              <Route path="feed/:feedType" element={<Home />} />

              <Route path="topic/:id" element={<TopicPage />} />
              <Route path="read-more/:id" element={<ReadMorePage />} />
              <Route path="/topics" element={<TopicPage />} />

              <Route path="profile" element={<ProfilePage />}>
                <Route path="info" element={<PersonalInfo />} />
                <Route path="blogs/:status" element={<UserBlogs />} />
              </Route>

              <Route path="/search" element={<SearchResultPage />} />
              <Route path="public/profile/:userId" element={<UserPublicProfilePage />} />

            </Route>
          </Route>
        </Route>
        <Route element={<PersistentLogin />}>
          <Route element={<PrivateRouteWrapper allowedRoles={[ROLES.User, ROLES.Admin]} />}>
            <Route path="/editor" element={<EditorPage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
