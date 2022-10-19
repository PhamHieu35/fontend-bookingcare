import React from "react";
import { withStyles } from "@material-ui/core/styles";

import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

import VpnKeyIcon from "@material-ui/icons/VpnKey";
import LockIcon from "@material-ui/icons/Lock";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import HomeIcon from "@material-ui/icons/Home";
import AccountBoxIcon from "@material-ui/icons/AccountBox";

import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import { connect } from "react-redux";
import { LANGUAGES } from "../../utils";

import { changeLanguageApp } from "../../store/actions/appActions";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../store/actions";

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    "&:focus": {
      backgroundColor: theme.palette.primary.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

const MenuHomeHeader = () => {
  //mapStateToProps Redux
  const { isLoggedIn, userInfo, language } = useSelector((state) => ({
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
    language: state.app.language,
  }));
  const dispatch = useDispatch();

  //   processLogout: () => dispatch(actions.processLogout()),

  //   const [state, setState] = useState({
  //     isLoggedIn: false,
  //     userInfo: {},
  //     language: "",
  //   });

  let history = useHistory();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickItemMenu = (item) => {
    switch (item) {
      case "login":
        history.push("/login");
        break;
      case "forgot-password":
        history.push("/forgot-password");
        break;
      case "logout":
        dispatch(actions.processLogout()); //mapDispathToProps
        break;
      case "sign-up":
        history.push("/sign-up");
        break;
      case "home-page":
        history.push("/home");
        break;
      default:
      // code block
    }
  };

  return (
    <div>
      {/* <Button
        aria-controls="customized-menu"
        aria-haspopup="true"
        variant="contained"
        color="primary"
        onClick={handleClick}
      > */}
      {/* Open Menu */}
      <span onClick={handleClick}>
        <i className="fas fa-bars"></i>
      </span>

      {/* </Button> */}
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <StyledMenuItem
          onClick={() => {
            handleClickItemMenu("home-page");
          }}
        >
          <ListItemIcon>
            <HomeIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="HomePage" />
        </StyledMenuItem>
        {!isLoggedIn && (
          <>
            <StyledMenuItem
              onClick={() => {
                handleClickItemMenu("login");
              }}
            >
              <ListItemIcon>
                <VpnKeyIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Login" />
            </StyledMenuItem>

            <StyledMenuItem
              onClick={() => {
                handleClickItemMenu("forgot-password");
              }}
            >
              <ListItemIcon>
                <LockIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Forgot Password" />
            </StyledMenuItem>

            <StyledMenuItem
              onClick={() => {
                handleClickItemMenu("sign-up");
              }}
            >
              <ListItemIcon>
                <PersonAddIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Sign Up Account" />
            </StyledMenuItem>
          </>
        )}
        {isLoggedIn && (
          <>
            {/* <StyledMenuItem
            //  onClick={() => {
            //    handleClickItemMenu("logout");
            //  }}
            >
              <ListItemIcon>
                <AccountBoxIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </StyledMenuItem> */}

            <StyledMenuItem
              onClick={() => {
                handleClickItemMenu("logout");
              }}
            >
              <ListItemIcon>
                <ExitToAppIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </StyledMenuItem>
          </>
        )}
      </StyledMenu>
    </div>
  );
};

// const mapStateToProps = (state) => {
//   return {
//     isLoggedIn: state.user.isLoggedIn,
//     userInfo: state.user.userInfo,
//     language: state.app.language,
//   };
// };

// const mapDispatchToProps = (dispatch) => {
//   return {
//     changeLanguageAppRedux: (language) =>
//       dispatch(actions.changeLanguageApp(language)),
//   };
// };

// export default connect(mapStateToProps, mapDispatchToProps)(MenuHomeHeader);
export default MenuHomeHeader;
