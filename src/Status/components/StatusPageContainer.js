import React from "react";
import {inject, observer} from "mobx-react";
import {CircularProgress, Typography, makeStyles, Grid} from "@material-ui/core";
import {StatusListItem} from "./StatusListItem";
import {StatusCommentsList} from "./StatusCommentsList";

const useStyles = makeStyles(() => ({
    centered: {
        marginLeft: "auto",
        marginRight: "auto",
        display: "table"
    }
}));

const getLabelFromError = error => {
    if (error.response) {
        if (error.response.status === 404) {
            return "Status not found";
        } else {
            return `Could not load status, server responded with ${error.response.status} status`;
        }
    } else {
        return "Could not load status, server is unreachable";
    }
};

const _StatusPageContainer = ({
    status,
    pending,
    error,
    statusLikePending,
    statusAuthorSubscriptionPending,
    currentUser,
    followStatusAuthor,
    unfollowStatusAuthor,
    favouriteStatus,
    unfavouriteStatus
}) => {
    const classes = useStyles();

    if (pending) {
        return <CircularProgress size={25} color="primary" className={classes.centered}/>
    }

    if (error) {
        return (
            <Typography variant="body1">
                {getLabelFromError(error)}
            </Typography>
        )
    }

    const handleFavouriteStatusChange = () => {
        if (status.favourited) {
            unfavouriteStatus();
        } else {
            favouriteStatus();
        }
    };

    if (!status) {
        return null;
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <StatusListItem status={status}
                                statusLikePending={statusLikePending}
                                onUnfollowRequest={unfollowStatusAuthor}
                                onFollowRequest={followStatusAuthor}
                                onFavouriteStatusChange={handleFavouriteStatusChange}
                                currentUserIsAuthor={currentUser && currentUser.id === status.account.id}
                                displayMenu={Boolean(currentUser)}
                />
            </Grid>
            <Grid item xs={12}>
                <StatusCommentsList/>
            </Grid>
        </Grid>
    )
};

const mapMobxToProps = ({statusPage, authorization}) => ({
    status: statusPage.status,
    pending: statusPage.pending,
    error: statusPage.error,
    statusLikePending: statusPage.statusLikePending,
    statusAuthorSubscriptionPending: statusPage.statusAuthorSubscriptionPending,
    currentUser: authorization.currentUser,
    followStatusAuthor: statusPage.followStatusAuthor,
    unfollowStatusAuthor: statusPage.unfollowStatusAuthor,
    favouriteStatus: statusPage.favouriteStatus,
    unfavouriteStatus: statusPage.unfavouriteStatus
});

export const StatusPageContainer = inject(mapMobxToProps)(observer(_StatusPageContainer));
