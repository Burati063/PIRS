
import React from "react";
import Mainavigation from "./MainNavigation";

function Layout({children}){
    return(
        <React.Fragment>
          <Mainavigation/>
          <main>{children}</main>
        
          
        </React.Fragment>
    );
}
export default Layout;