//import firebase from 'firebase';

// 5-import type to use, curly braces cuz there are many in 'types'
import { 
    EMAIL_CHANGED, 
    PASSWORD_CHANGED, 
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAIL,
    LOGIN_USER
 } from './type';



// is a javascript function take in 'text' as payload 
// 1.1- create 'emailChanged' action then import it in component
export const emailChanged = (text) => {
    return {
        type: EMAIL_CHANGED,
        payload: text
    };
};

export const passwordChanged = (text) => {
    return {
        type: PASSWORD_CHANGED,
        payload: text
    };
};
// dispatch will send the action to all reducers 
// it act the same as 'return' above
//this action will try to login first. if successful will try to do other actions which 
// will be sent to other reducers
export const loginUser = ({ email, password}) => {
//**** We can use this dispatch() because we import and install Redux Thunk in App.js */
// Redux thunk is : return () => {}
    return (dispatch) => {
        // dispatch({type: LOGIN_USER});
        // firebase.auth().signInWithEmailAndPassword(email,password)
        // .then(user => loginUserSuccess(dispatch,user))
        // .catch((error) => {
        //     firebase.auth().createUserWithEmailAndPassword(email,password)
        //         .then(user => loginUserSuccess(dispatch,user))
        //         .catch(() => loginUserFail(dispatch));
        // });
    };
};
const loginUserFail = (dispatch) => {
    dispatch({type: LOGIN_USER_FAIL})
};


const loginUserSuccess = (dispatch, user) => {
    dispatch({type: LOGIN_USER_SUCCESS, payload: user});
//we switch from login screen to next screen here
// employeeList() is from key="employeeList" in Router
// main() is from key="main" in Router
   // Actions.main();
 
};
