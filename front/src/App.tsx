import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Header from './components/Layout/Header';
import MainPage from './components/Main/MainPage';
import { Route, Routes } from 'react-router-dom';
import User from './components/User/User';
import MyPage from './components/MyPage/MyPage';
import { getAccessTokenWithRefreshToken, getUserDataWithToken } from './utils/JWT-Utils';
import { useAppDispatch, useAppSelector } from './Store/hooks/hooks';
import ReviewPage from './components/ReviewPage/ReviewPage';
import ReviewDetail from './components/ReviewPage/ReviewDetail';
import PrivateRoute from './utils/PrivateRoute-Utils';


const App:React.FC = ()=> {
  // access 토큰 가져오기
  const accessToken = useAppSelector((state)=>state.tokenData.accessToken)  
  const dispatch = useAppDispatch()

  // Access Token으로 로그인 처리
  useEffect(()=>{
    if(accessToken !== ""){
      getUserDataWithToken(dispatch, accessToken)
    }
  },[accessToken])

  useEffect(()=>{
    // Refresh Token으로 Access Token 재발급
    getAccessTokenWithRefreshToken(dispatch)
    
  },[])



  return (
    <div className="App">
      <Header/>
      <Routes>
          <Route path="/" element={<MainPage/>}></Route>
          <Route path="/review" element={<ReviewPage/>}></Route>
          <Route path="/reviewDetail/:_id" element={<ReviewDetail/>}></Route>
          
        <Route element={<PrivateRoute authentication={false} accessToken={accessToken}/>}>
          <Route path="/user" element={<User/>}></Route>
        </Route>
        <Route element={<PrivateRoute authentication={true} accessToken={accessToken}/>}>
          <Route path="/mypage" element={<MyPage/>}></Route>
        </Route>
      </Routes>
      
    </div>
  );
}

export default App;
