import React, { Component, useEffect } from 'react';
import configData from "./config.json";
import './SignUpForm.css';

class SignUpForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      phone: '',
      signUpData: {
        email: '',
        password: '',
        phone: '',
      },
      authenticateWithOTP: false,
      redirectToDashboard: false,
      otpFailedTries: 0,
      cooldownTimer: configData.BUTTON_COOLDOWN,
      otpSentTimestamp: Math.round(+new Date() / 1000),
      enableResendOTP: false,
      otpValidateRequestWaiting: false,
      signUpFormGenericError: false,
      signUpFormValidationErrors: [],
    };

    this.submitSignUpForm = this.submitSignUpForm.bind(this);
    this.validateOTP = this.validateOTP.bind(this);
    this.resendOTP = this.resendOTP.bind(this);
    this.onChange = this.onChange.bind(this);
    this.updateCooldown = this.updateCooldown.bind(this);
  }

  formatPhoneNumber = phone => {
    phone = phone.replace(/\D/g, '');
    if (phone.charAt(0) === '0') {
      phone = `359${phone.substring(1)}`;
    }
    return phone;
  }

  submitSignUpForm() {
    this.setState({
      signUpFormGenericError: false,
      signUpFormValidationErrors: []
    });

    let email = this.state.email;
    let password = this.state.password;
    let phone = this.formatPhoneNumber(this.state.phone);
    let errors = [];
    // Validation
    if (!email.match(/\S+@\S+\.\S+/)) {
      errors.push('email');
    }
    if (this.state.password.length < 6) {
      errors.push('password');
    }
    if (phone.indexOf('359') !== 0 || phone.length !== 12) {
      errors.push('phone');
    }

    if (errors.length) {
      this.setState({ signUpFormValidationErrors: errors });
      return;
    }

    let signUpDataToSend = { email, password, phone };

    this.setState({ signUpData: signUpDataToSend });

    console.log(this, this.state.signUpData, signUpDataToSend)
    fetch(`${configData.API_URL}/api/signup`, {
      method: 'POST',
      body: JSON.stringify(signUpDataToSend)
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        if (data && data.status === 'SUCCESS') {
          this.setState({
            authenticateWithOTP: true,
            otpSentTimestamp: Math.round(+new Date() / 1000)
          });
        } else {
          this.setState({ signUpFormGenericError: true });
        }
      })
      .catch(error => {
        this.setState({ signUpFormGenericError: true });
        console.log(error)
      });
  }

  validateOTP() {
    if (this.state.authenticateWithOTP && this.state.otpFailedTries < 3 && !this.state.otpValidateRequestWaiting) {
      this.setState({ otpValidateRequestWaiting: true });
      const data = { ...this.state.signUpData, otp: this.state.otp };
      fetch(`${configData.API_URL}/api/signup-validate-otp`, {
        method: 'POST',
        body: JSON.stringify(data)
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data)
          if (data && data.status === 'SUCCESS' && data.userData) {
            sessionStorage.setItem('userData', JSON.stringify(data.userData));
            this.setState({
              authenticateWithOTP: false,
              otpFailedTries: 0
            });
          } else {
            this.setState({ otpFailedTries: this.state.otpFailedTries + 1 });
          }
          this.setState({ otpValidateRequestWaiting: false });
        })
        .catch((error) => {
          this.setState({
            signUpFormGenericError: true,
            otpFailedTries: this.state.otpFailedTries + 1,
            otpValidateRequestWaiting: false
          });
          console.log(error)
        });
    }
  }

  resendOTP() {
    if (this.state.authenticateWithOTP && !this.state.otpValidateRequestWaiting) {
      this.setState({
        otpValidateRequestWaiting: true,
        otpFailedTries: 0,
      });
      fetch(`${configData.API_URL}/api/signup-resend-otp`, {
        method: 'POST',
        body: JSON.stringify(this.state.signUpData)
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data)
          if (data && data.status === 'SUCCESS') {
            this.setState({
              otpFailedTries: 0,
              otpSentTimestamp: Math.round(+new Date() / 1000),
              showResendCodeButton: false
            });
          } else {
            this.setState({ otpFailedTries: this.state.otpFailedTries + 1 });
          }
          this.setState({ otpValidateRequestWaiting: false });
        })
        .catch((error) => {
          this.setState({
            otpValidateRequestWaiting: false
          });
          console.log(error)
        });
    }
  }

  updateCooldown() {
    if (this.state.otpFailedTries >= 3) {
      if (this.state.cooldownTimer < 1) {
        this.setState({
          otpFailedTries: 0,
          cooldownTimer: configData.BUTTON_COOLDOWN,
        });
      } else {
        this.setState({
          cooldownTimer: this.state.cooldownTimer - 1,
        });
      }
    }

    if (this.state.authenticateWithOTP) {
      this.setState({
        enableResendOTP: (Math.round(+new Date() / 1000) - this.state.otpSentTimestamp) > 10
      });
    }

  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
    console.log(this.state)
  }

  render() {
    // THIS CAN BE MOVED TO APP.JS
    // The user already created an account and validated the number
    if (sessionStorage.getItem('userData')) {
      let userData = JSON.parse(sessionStorage.getItem('userData'));
      return (
        <div id="welcome-container">
          <h3>Hello {userData.email}!</h3>
          <h4>Welcome to SMS Bump :)</h4>
        </div>
      );
    }

    // Signup and OTP validation form
    if (!this.state.authenticateWithOTP) {
      return (
        <SignUpInitialForm
          data={this}
          showGenericError={this.state.signUpFormGenericError}
          validationErrors={this.state.signUpFormValidationErrors}
        />
      );
    } else {

      return (
        <ValidateOTPForm
          data={this}
          verifyOTP={this.validateOTP}
          resendOTP={this.resendOTP}
          updateCooldown={this.updateCooldown}
          otpFailedTries={this.state.otpFailedTries}
          disableVerifyButton={(this.state.otpFailedTries >= 3) || this.state.otpValidateRequestWaiting}
          cooldownTimer={this.state.cooldownTimer}
          enableResendOTP={this.state.enableResendOTP}
        />
      );
    }
  }
}

function SignUpInitialForm(props) {
  return (
    <div id="signUpForm">
      <h3>1. Sign up</h3>
      <label htmlFor="email">Email:</label>
      <input type="text" id="email" name="email" onChange={props.data.onChange} />
      {props.validationErrors.indexOf('email') !== -1 ? <i>Invalid email address</i> : ''}
      <br />
      <label>Password:</label>
      <input type="password" name="password" onChange={props.data.onChange} />
      {props.validationErrors.indexOf('password') !== -1 ? <i>Password must contain at least 6 characters</i> : ''}
      <br />
      <label>Phone:</label>
      <input type="text" name="phone" placeholder="Ex. +359 881 234 567" onChange={props.data.onChange} />
      {props.validationErrors.indexOf('phone') !== -1 ? <i>Invalid phone number</i> : ''}
      <br />
      <button type="button" onClick={props.data.submitSignUpForm}>Sign up</button>
      {props.showGenericError ? <p>Something happened. Please try again.</p> : ''}
    </div>
  );
}

function ValidateOTPForm(props) {
  let showResendCodeButton = props.enableResendOTP
    ? <button onClick={props.resendOTP}>RESEND CODE</button>
    : '';
  let verifyButtonText = props.otpFailedTries >= 3
    ? `Verify (${props.cooldownTimer} sec. remaining)`
    : 'Verify';

  let updateCooldownFunc = props.updateCooldown;
  useEffect((props) => {
    setInterval(() => {
      updateCooldownFunc()
    }, 1000);
  }, [updateCooldownFunc]);

  return (
    // reset try attempts
    <div id="ValidateOTPForm">
      <h3>2. Validate your phone number</h3>
      <label htmlFor="otp">Enter OTP sent to {props.data.state.phone}:</label>
      <input type="text" id="otp" name="otp" onChange={props.data.onChange} />
      <br />
      <button onClick={props.verifyOTP} disabled={props.disableVerifyButton}>{verifyButtonText}</button>
      <br />
      <br />
      {showResendCodeButton}
    </div>
  );
}

export default SignUpForm;