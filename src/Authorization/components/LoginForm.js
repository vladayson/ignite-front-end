import React, {Fragment} from "react";
import {inject, observer} from "mobx-react";
import {Button, Card, CardContent, CircularProgress, makeStyles, TextField, Typography} from "@material-ui/core";
import {localized} from "../../localization/components";

const useStyles = makeStyles(theme => ({
    loginCard: {
        backgroundColor: "#FBF7F6",
    },
    loginButton: {
        maxWidth: 374,
        borderRadius: 30,
        marginLeft: "auto",
        marginRight: "auto",
        display: "table",
        height: "40px",
        fontFamily: "Museo Sans Cyrl",
        fontStyle: "normal",
        fontWeight: "600",
        fontSize: "15px",
        lineHeight: "18px",
        textAlign: "center",
        color: "##FFFFFF",
        marginTop: "24px"
        
    },
    signUpButton: {
        maxWidth: 374,
        marginLeft: "auto",
        marginRight: "auto",
        display: "table",
        fontFamily: "Museo Sans Cyrl",
        fontStyle: "normal",
        fontWeight: "600",
        fontSize: "15px",
        lineHeight: "18px",
        textAlign: "center",
        color: theme.palette.primary.main,
        marginTop: "24px"
    },
    errorLabel: {
        color: theme.palette.error.main
    }
}));

const getLabelFromSubmissionError = (error, l) => {
    if (error.response) {
        if (error.response.status === 401) {
            return l("authorization.login.error.invalid-credentials");
        } else {
            console.log(error);
            return l("authorization.login.error.unknown", {responseStatus: error.response.status});
        }
    } else {
        return l("authorization.login.error.no-response");
    }
};

const _LoginForm = ({
    loginForm,
    submissionError,
    pending,
    setFormValue,
    doLogin,
    setSignUpDialogOpen,
    hideLoginButton,
    hideSignUpButton,
    disableCard,
    setLoginDialogOpen,
    l
}) => {
    const classes = useStyles();

    const content = (
        <Fragment>
            <TextField label={l("authorization.login.wallet-address")}
                       value={loginForm.username}
                       onChange={event => setFormValue("username", event.target.value)}
                       fullWidth
                       margin="dense"
                       className="input-default"
            />
            <TextField label={l("authorization.login.private-key")}
                       value={loginForm.password}
                       onChange={event => setFormValue("password", event.target.value)}
                       fullWidth
                       margin="dense"
                       type="password"
            />
            {submissionError && (
                <Typography variant="body1"
                            className={classes.errorLabel}
                >
                    {getLabelFromSubmissionError(submissionError, l)}
                </Typography>
            )}
            {!hideLoginButton && (
                <Button className={classes.loginButton}
                        color="primary"
                        variant="contained"
                        onClick={doLogin}
                        disabled={pending}
                        fullWidth
                >
                    {pending && <CircularProgress size={14} color="primary"/>}
                    {l("authorization.login")}
                </Button>
            )}
            {!hideSignUpButton && (
                <Button variant="text"
                        color="primary"
                        fullWidth
                        className={classes.signUpButton}
                        onClick={() => {
                            setLoginDialogOpen(false);
                            setSignUpDialogOpen(true);
                        }}
                        disabled={pending}
                >
                    {l("sign-up.beta-testing")}
                </Button>
            )}
        </Fragment>
    );

    return ( disableCard
            ? content
            : (
                <Fragment>
                    <Card className={classes.loginCard}>
                        <CardContent>
                            {content}
                        </CardContent>
                    </Card>
                </Fragment>
            )
    )
};

const mapMobxToProps = ({login, signUp}) => ({
    loginForm: login.loginForm,
    pending: login.pending,
    submissionError: login.submissionError,
    setFormValue: login.setFormValue,
    doLogin: login.doLogin,
    setSignUpDialogOpen: signUp.setSignUpDialogOpen,
    setLoginDialogOpen: login.setLoginDialogOpen
});

export const LoginForm = localized(
    inject(mapMobxToProps)(observer(_LoginForm))
);
