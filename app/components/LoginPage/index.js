import React, { Component, Fragment } from 'react';
import { injectIntl } from 'react-intl';
import { Link, withRouter, Redirect } from 'react-router-dom';
import Joi from 'joi-browser';
import cookie from 'js-cookie';

import {
  Grid,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Button,
} from '@material-ui/core';

import messages from './messages';

// uistyle
import Logo from '../../images/logo.svg';
import Image from '../uiStyle/Images';
import Form from '../uiStyle/Form';
// images

import ShowPass from '../../images/icon/eye.svg';
import Pass from '../../images/icon/eye2.svg';

import '../SignupPage/account.scss';
import { toast } from 'react-toastify';

class LoginPage extends Component {
  state = {
    email: '',
    password: '',
    passwordShow: false,
    error: {},
  };

  t(msg, values) {
    return this.props.intl.formatMessage(msg, values);
  }

  handleClickShowPassword = current => {
    this.setState({
      [current]: !this.state[current],
    });
  };

  schema = {
    email: Joi.string()
      .required()
      .email()
      .error(errors => {
        errors.forEach(err => {
          switch (err.type) {
            case 'string.email':
              err.message = 'Email Must be Email Format';
              break;
            case 'any.required':
              err.message = 'Email is Requared';
              break;
            default:
              break;
          }
        });
        return errors;
      }),
    password: Joi.string()
      .required()
      .min(8)
      .regex(/^[a-zA-Z0-9]{3,30}$/)
      .error(errors => ({
        message: 'Please Provide a strong password',
      })),
  };

  changeHandler = event => {
    const error = { ...this.state.error };
    const errorMassage = this.validationProperty(event);
    if (errorMassage) {
      error[event.target.name] = errorMassage;
    } else {
      delete error[event.target.name];
    }
    this.setState({
      [event.target.name]: event.target.value,
      error,
    });
  };

  validationProperty = event => {
    const Obj = { [event.target.name]: event.target.value };
    const schema = { [event.target.name]: this.schema[event.target.name] };
    const { error } = Joi.validate(Obj, schema);
    return error ? error.details[0].message : null;
  };

  validate = () => {
    const options = { abortEarly: false };
    const form = {
      email: this.state.email,
      password: this.state.password,
    };
    const { error } = Joi.validate(form, this.schema, options);
    if (!error) return null;

    const errors = {};
    for (const item of error.details) errors[item.path[0]] = item.message;
    return errors;
  };

  submitHandler = event => {
    event.preventDefault();
    const error = this.validate();
    this.setState({
      error: error || {},
    });
    const { email, password } = this.state;
    if (!error) {
      cookie.set('Auth', true);
      toast.success('Successfully login');
      this.props.history.push('/dashboard');
    }
  };

  render() {
    const { email, password } = this.state;

    const auth = cookie.get('Auth');
    if (auth) {
      toast.info('You are Loged in');
      return <Redirect to="/dashboard" />;
    }

    return (
      <Fragment>
        <Grid className="accountArea">
          <Grid className="container" container>
            <Grid item lg={6} xs={12}>
              <Grid className="accountImage">
                <Image src={Logo} alt="logo" />
                <p>
                  Store and manage digital currencies with ease in the smart and
                  beautiful cryptocurrency wallets.
                </p>
              </Grid>
            </Grid>
            <Grid item lg={6} xs={12}>
              <Grid className="accountContent">
                <Typography variant="h3">Sign In</Typography>
                <Typography className="text" paragraph>
                  Please sign in to your account.
                </Typography>
                <Form onSubmit={this.submitHandler}>
                  <TextField
                    label="Email"
                    className="inputStyle"
                    name="email"
                    variant="outlined"
                    onChange={this.changeHandler}
                    value={email}
                    helperText={
                      this.state.error.email ? this.state.error.email : ''
                    }
                  />
                  <TextField
                    label="Password"
                    className="inputStyle"
                    name="password"
                    variant="outlined"
                    type={this.state.passwordShow ? 'text' : 'password'}
                    onChange={this.changeHandler}
                    value={password}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment className="showPassword" position="end">
                          <IconButton
                            onClick={() =>
                              this.handleClickShowPassword('passwordShow')
                            }
                          >
                            <Image
                              src={this.state.passwordShow ? Pass : ShowPass}
                            />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    helperText={
                      this.state.error.password ? this.state.error.password : ''
                    }
                  />
                  <Grid className="forgotPassword">
                    <Link to="/forgot-password">Forgot Password ?</Link>
                  </Grid>
                  <Button type="submit" className="submitButton">
                    Sign In
                  </Button>
                  <Typography variant="h6">
                    Don’t have account ? <Link to="/signup">Sign Up</Link>
                  </Typography>
                </Form>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Fragment>
    );
  }
}

export default withRouter(LoginPage);
