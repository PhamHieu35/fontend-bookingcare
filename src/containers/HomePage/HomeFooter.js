import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";

class HomeFooter extends Component {
  render() {
    return (
      <div className="home-footer">
        <div className="logo-footer">

        </div>
        <div>
          <p className="copy-right">
            Copyright &copy; 2022 Phạm Văn Hiếu.
          </p>
        </div>
        <div className="follow-us">
          <ul>
            <li><a>
              <i className="fab fa-facebook"></i>
            </a></li>
            <li><a>
              <i className="fab fa-youtube"></i>
            </a></li>
            <li><a>
              <i className="fab fa-instagram"></i>
            </a></li>
          </ul>

        </div>

      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeFooter);
