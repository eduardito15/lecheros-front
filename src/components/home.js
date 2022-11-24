import Typography from "@material-ui/core/Typography";
import React from "react";
import {createStyles, makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) =>
    createStyles({
        drawerHeader: {
            display: 'flex',
            alignItems: 'center',
            padding: theme.spacing(0, 1),
            // necessary for content to be below app bar
            ...theme.mixins.toolbar,
            justifyContent: 'flex-end',
        }
    }),
);

function Home() {
    const classes = useStyles();

    return (
        <div>

            <div className={classes.drawerHeader} />
            <Typography paragraph>
                Pagina Principal
            </Typography>
            <Typography paragraph>
                Tenemos que determinar si ponemos algo aca, que ponemos.

                Un resumen del dia ? Con las liquidaciones ? compras ? facturas ? gastos? etc, del dia ?
            </Typography>
        </div>
    );
}

export default Home;
