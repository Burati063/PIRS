import { useState } from 'react';
import {Router, Route, Routes} from "react-router-dom";
import  MiniDrawer  from "./MiniDrawer/MiniDrawer";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

export default function Company() {
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <MiniDrawer/>
  );
}