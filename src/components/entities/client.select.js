import React from "react";
import {withStyles} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import SearchIcon from "@material-ui/icons/Search";
import IconButton from "@material-ui/core/IconButton";
import ClientSelectForm from "./forms/client.select.form";

const useStyles = theme => ({
    button: {
        margin: theme.spacing(1),
    },
    divider: {
        margin: theme.spacing(2),
    },
    textField: {
        margin: theme.spacing(1),
    }
});

class ClientSelect extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showSearchClientForm: false
        }
        this.clickOnSearchClient = this.clickOnSearchClient.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.clientSelected = this.clientSelected.bind(this);
    }

    clickOnSearchClient() {
        this.setState({
            showSearchClientForm: true
        });
    }

    handleClose() {
        this.setState({
            showSearchClientForm: false
        });
    }

    clientSelected(selectedClient) {
        this.setState({
            showSearchClientForm: false
        })
        this.props.clientSelected(selectedClient);
    }

    render() {
        const {classes} = this.props;

        return(<div>
            <TextField
                margin="dense"
                id="client"
                label="Cliente/s"
                type="text"
                style={{width: '50%'}}
                className={classes.textField}
                value={this.props.clientsNames}
            />
            <IconButton
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={this.clickOnSearchClient}
                disabled={this.props.isViewMode}
            >
                <SearchIcon/>
            </IconButton>

            {this.state.showSearchClientForm ?
                <div>
                    <ClientSelectForm open={this.state.showSearchClientForm}
                    handleClose={this.handleClose} deliveries={this.props.deliveries}
                    multiselect={this.props.multiselect} clientSelected={this.clientSelected}>

                    </ClientSelectForm>
                </div>
            : ''}
        </div>);
    }

}

export default withStyles(useStyles)(ClientSelect);
