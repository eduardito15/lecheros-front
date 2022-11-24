import Form from "react-validation/build/form";
import CheckButton from "react-validation/build/button";
import React from "react";

import AuthService from "../services/auth.service";
import {withStyles} from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import {Button} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import PermIdentityIcon from "@material-ui/icons/PermIdentity"
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Typography from "@material-ui/core/Typography";

const useStyles = theme => ({
    button: {
        margin: theme.spacing(1),
    },
    resultIcon: {
        align: 'center',
        margin: theme.spacing(1),
        width: '100%',
        fontSize: 100
    },
    textField: {
        margin: theme.spacing(1),
    }
});

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onPasswordKeyPress = this.onPasswordKeyPress.bind(this);

        this.state = {
            username: "",
            password: "",
            loading: false,
            message: ""
        };

        this.passwordInput = React.createRef();
        this.onUserNameKeyPress = this.onUserNameKeyPress.bind(this);
    }

    onChangeUsername(e) {
        this.setState({
            username: e.target.value
        });
    }

    onChangePassword(e) {
        this.setState({
            password: e.target.value
        });
    }

    onUserNameKeyPress(e) {
        if (e.key === 'Enter') {
            this.passwordInput.current.focus();
        }
    }

    onPasswordKeyPress(event) {
        this.setState({
            password: event.target.value
        });
        if (event.key === 'Enter') {

            this.handleLogin(event, event.target.value);
        }
    }

    handleLogin(e, pass) {
        e.preventDefault();

        this.setState({
            message: "",
            loading: true
        });

        this.form.validateAll();

        window.analytics.track('Sign Up Attempt', {

          });

        if (this.checkBtn.context._errors.length === 0) {
            AuthService.login(this.state.username, pass != null ? pass : this.state.password).then(
                (response) => {
                    this.props.closeLogin(true, response);
                    window.analytics.track('Sign Up', {
                        status: 'Ok'
                      });
                },
                error => {
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();

                    this.setState({
                        loading: false,
                        message: resMessage
                    });
                    window.analytics.track('Sign Up', {
                        status: 'Error',
                        errorMessage: resMessage
                      });
                }
            );
        } else {
            this.setState({
                loading: false
            });
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <Dialog open={this.props.openLoginForm}>
                    <DialogTitle id="form-dialog-title">Ingreso de Usuario</DialogTitle>
                    <DialogContent>
                            <PermIdentityIcon className={classes.resultIcon}/>
                            <Form
                                onSubmit={this.handleLogin}
                                ref={c => {
                                    this.form = c;
                                }}
                            >
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="name"
                                        label="Nombre de Usuario"
                                        type="text"
                                        fullWidth
                                        className={classes.textField}
                                        required
                                        onBlur={this.onChangeUsername}
                                        onKeyPress={this.onUserNameKeyPress}
                                    />

                                    <TextField
                                        margin="dense"
                                        id="name"
                                        label="Contraseña"
                                        type="password"
                                        fullWidth
                                        className={classes.textField}
                                        required
                                        onBlur={this.onChangePassword}
                                        onKeyPress={this.onPasswordKeyPress}
                                        ref={this.passwordInput}
                                    />

                                {this.state.message && (
                                    <div>
                                        <Typography paragraph color="secondary" className={classes.textField}>
                                            {this.state.message}
                                        </Typography>
                                    </div>
                                )}
                                <CheckButton
                                    style={{display: "none"}}
                                    ref={c => {
                                        this.checkBtn = c;
                                    }}
                                />
                            </Form>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            disabled={this.state.loading}
                            color="primary"
                            onClick={this.handleLogin}
                        >
                            {this.state.loading && (
                                <span className="spinner-border spinner-border-sm"></span>
                            )}
                            <span>Ingresar</span>
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default withStyles(useStyles)(Login);