import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Header from './components/Layout/Header';
import MainPage from './components/Main/MainPage';
import Footer from './components/Layout/Footer';
import { Route, Routes } from 'react-router-dom';
import User from './components/User/User';
import MyPage from './components/MyPage/MyPage';
import { getAccessTokenWithRefreshToken, getUserDataWithToken } from './utils/JWT-Utils';
import { useAppDispatch, useAppSelector } from './Store/hooks/hooks';
import ReviewPage from './components/ReviewPage/ReviewPage';
import { kakaoCategorySearch } from './utils/kakao-Utils';


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
        <Route path="/user" element={<User/>}></Route>
        <Route path="/mypage" element={<MyPage/>}></Route>
        <Route path="/review" element={<ReviewPage/>}></Route>
      </Routes>
      
    </div>
  );
}

export default App;
