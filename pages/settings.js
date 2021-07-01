import React from "react";
import {
    withStyles,
    Grid,
    List,
    ListItem,
    ListItemText,
    Container,
} from "@material-ui/core";
import { withRouter } from 'next/router'
import { authInitialProps } from "../lib/auth";
import { AccountCircle, Book, Star } from "@material-ui/icons";
import NavBar from "../components/Navbar/NavBar";
import MyProfile from "../components/settings/MyProfile";
import MyCourses from "../components/settings/MyCourses";
import MyStarItems from "../components/settings/MyStarItems";

const Content = (props) => {
    const { auth } = props;

    return (
        <React.Fragment>
            {props.settingOption === 1 && <MyProfile auth={props.auth} />}
            {props.settingOption === 2 && <MyCourses auth={props.auth} />}
            {props.settingOption === 3 && <MyStarItems auth={props.auth} />}
        </React.Fragment>
    );
};

class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.state = { selectedIndex: 1};
        this.filterOptions = this.filterOptions.bind(this);
        this.handleListItemClick = this.handleListItemClick.bind(this);
    }

    filterOptions = (options) => {
        // const { auth } = this.props;
        // if (!auth.user.isAnOrganization) options.splice(2, 1);
        // if (auth.user.isAnOrganization) options.splice(3, 1);
        return options;
    };

    handleListItemClick = (event, index) => {
        this.setState({ selectedIndex: index });
    };

    render() {
        const { auth } = this.props;

        console.log(this.props)

        const settingOptions = this.filterOptions([
            { id: 1, title: "Profile", icon: <AccountCircle /> },
            { id: 2, title: "Courses", icon: <Book /> },
            // { id: 3, title: "Starred", icon: <Star /> },
        ]);

        const { selectedIndex } = this.state;

        return (
            <NavBar auth={auth} mode={0} max>
                <Container className="settings">
                    <Grid item className="settings-header">
                        <h3 className="settings-header-title">
                            Account Settings
                        </h3>
                        <h5 className="settings-header-desc">
                            Change account information and settings
                        </h5>
                    </Grid>
                    <Grid item className="settings-body">
                        <Grid item className="settings-body-left">
                            <List className="settings-body-menu-list">
                                {settingOptions.map((item) => (
                                    <ListItem
                                        disableRipple
                                        button
                                        key={item.id}
                                        selected={selectedIndex === item.id}
                                        onClick={(event) =>
                                            this.handleListItemClick(
                                                event,
                                                item.id
                                            )
                                        }
                                    >
                                        <ListItemText primary={item.title} />
                                    </ListItem>
                                ))}
                            </List>
                        </Grid>
                        <Grid item className="settings-body-right">
                            <Content
                                auth={auth}
                                settingOption={selectedIndex}
                            />
                        </Grid>
                    </Grid>
                </Container>
            </NavBar>
        );
    }
}

Settings.getInitialProps = authInitialProps(true);

export default withRouter(Settings);
