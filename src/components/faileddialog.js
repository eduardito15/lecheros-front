import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import {withStyles} from "@material-ui/core/styles";
import DialogContentText from "@material-ui/core/DialogContentText";
import ErrorIcon from "@material-ui/icons/Error"
import Typography from "@material-ui/core/Typography";

const useStyles = theme => ({
    button: {
        margin: theme.spacing(1),
    },
    resultIcon: {
        align: 'center',
        margin: theme.spacing(1),
        width:'100%',
        fontSize:100
    }
});

class FailedDialog extends React.Component {

    render() {
        const { classes } = this.props;
        return (
            <div>
                <Dialog open={this.props.showFailedDialog} onClose={this.props.handleCloseFailedDialog} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">{this.props.title}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            <ErrorIcon color="secondary" className={classes.resultIcon}/>
                        </DialogContentText>
                        <DialogContentText id="alert-dialog-description">

                            <Typography paragraph>
                                {this.props.resultDialogMessage}
                            </Typography>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.props.handleCloseFailedDialog} color="primary" className={classes.button}>
                            Ok
                        </Button>
                    </DialogActions>
                </Dialog>

            </div>
        );
    }
}

export default withStyles(useStyles)(FailedDialog);