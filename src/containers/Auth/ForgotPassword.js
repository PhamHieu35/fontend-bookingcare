import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./ForgotPassword.scss";

import { postUserForgotPassword } from "../../services/userService";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  let history = useHistory();

  const [email, setEmail] = useState("");

  useEffect(() => {
    document.title = "Forgot Password";
  }, []);

  const handleForgotPassword = async () => {
    // alert(email.trim().length);
    // alert(email.length);
    if (email.trim().length === 0) {
      toast.error("Email input empty!");
      return;
    }
    let res = await postUserForgotPassword({
      email: email.trim(),
    });
    if (res && res.errCode === 0) {
      toast.success("Send email to retrieve password succeed!");
    } else {
      toast.error("User's not found, please retype email!");
    }
  };
  return (
    <>
      <div className="login-background">
        <div className="forgot-password-container">
          <div className="login-content row">
            <div className="col-12 text-login">Forgot Password</div>
            <div className="col-12 form-group login-input">
              <label>Email:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your email to retrieve password"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div className="col-12">
              <button
                className="btn-login"
                onClick={() => {
                  handleForgotPassword();
                }}
              >
                Retrieve
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default ForgotPassword;
