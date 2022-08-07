import React from "react";
import {Routes, Route, Navigate} from "react-router-dom";



export default function App(){
  return(
    <div className="app">
      <Routes>
        <Route
          path="/"
          // element={token ? <Navigate to="/profile"/> : <Auth />}
          element = {() => <Auth />}
        />
      </Routes>
    </div>
  )
}
