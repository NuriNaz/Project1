import dashboard from './dashboard';
// import pages from './pages';
import utilities from './utilities';
import other from './other';

// ==============================|| MENU ITEMS ||============================== //
const GetItem = localStorage.getItem('Profile_Details')
const Details= JSON.parse(GetItem)

const menuItems = {
  items: [dashboard, 
    // pages,
    //  utilities,
    // Details.role === "1"&&
    //   other
    ]

};

export default menuItems;
