import React from "react";
import {withStyles} from "@material-ui/core/styles";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

const useStyles = theme => ({
    button: {
        margin: theme.spacing(1),
        marginTop: theme.spacing(2)
    },
    divider: {
        margin: theme.spacing(2),
    },
    textField: {
        margin: theme.spacing(1),
    }
});

class EditDocumentTypeForm extends React.Component {

    renderDocumentTypeOptions() {
        if (this.props.documentTypes != null) {
            return this.props.documentTypes.map((documentType) => {
                return (
                    <MenuItem
                        label="Seleccione un Tipo de Documento"
                        value={documentType.id}
                        key={documentType.id} name={documentType.name}
                        >{documentType.name}</MenuItem>
                );
            });
        }
    }

    render() {
        const {classes} = this.props;

        return (<div>
                <Dialog fullWidth open={this.props.open} onClose={this.props.handleCloseEditDocumentType}
                        aria-labelledby="form-dialog-title" >
                    <DialogTitle id="form-dialog-title">Cambiar tipo de Documento</DialogTitle>
                    <DialogContent>

                        <InputLabel id="demo-simple-select-label"
                                    className={classes.textField}>Tipo de Documento</InputLabel>

                        <Select id="delivery_select" className={classes.textField} style={{width: '50%'}}
                                value={this.props.documentType.id}
                                onChange={this.props.onChangeDocumentType}
                        >
                            {this.renderDocumentTypeOptions()}
                        </Select>

                        {this.props.message && (
                            <div>
                                <Typography display="inline" paragraph color="secondary"
                                            className={classes.textField}>
                                    {this.props.message}
                                </Typography>
                            </div>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.props.handleEditDocumentType} color="primary">
                            Guardar
                        </Button>
                        <Button onClick={this.props.handleCloseEditDocumentType} color="primary">
                            Cerrar
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default withStyles(useStyles)(EditDocumentTypeForm);