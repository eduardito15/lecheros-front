import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import {withStyles} from "@material-ui/core/styles";
import DialogContentText from "@material-ui/core/DialogContentText";
import WarningIcon from "@material-ui/icons/Warning"
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

class ConfirmDeleteDialog extends React.Component {

    render() {
        const { classes } = this.props;
        return (
            <div>
                <Dialog open={this.props.showConfirmDeleteDialog} onClose={this.props.handleCloseConfirmDeleteDialog} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">
                        {this.props.title}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            <WarningIcon className={classes.resultIcon} style={{ color: '#d2d24c' }}/>
                            <Typography paragraph>
                                {this.props.resultDialogMessage}
                            </Typography>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.props.handleCloseConfirmDeleteDialog} color="primary">
                            No
                        </Button>
                        <Button onClick={this.props.handleDeleteConfirmDeleteDialog} color="primary">
                            Si
                        </Button>
                    </DialogActions>
                </Dialog>

            </div>
        );
    }
}

export default withStyles(useStyles)(ConfirmDeleteDialog);