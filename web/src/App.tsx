// import { useState } from 'react'
// import { Habits } from './components/Habits'
import './lib/dayjs'
import { Header } from "./components/Header";
import { SummaryTable } from "./components/SummaryTable";
import "./styles/global.css";


function App() {
  return (
    <div className=" w-screen h-screen flex justify-center items-center">
      <div className="w-full max-5-xl px-6 flex flex-col gap-16">
        <Header />
        <SummaryTable />
      </div>
    </div>
  );
}
export default App;
