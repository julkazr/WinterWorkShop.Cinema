import React, { useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { NotificationManager } from 'react-notifications';
import * as authCheck from '../helpers/authCheck';

export const UserRoute = ({ component: Component, ...rest }) => {
    useEffect(() => {
        if(!authCheck.isUser()){
            NotificationManager.error('You are not logged in, please log in!');
        }
      });
    return (
    <Route {...rest} render={ props => localStorage.getItem('jwt') ? ( <Component {...props} />) : 
            ( <Redirect to={{ pathname: "/", state: { from: props.location } }} />
        )}/>
    )
}