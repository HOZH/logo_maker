import React, {Component} from 'react';

import {Redirect} from 'react-router-dom';
import Banner from '../Banner'
export default class LoginScreen extends Component {
    state = {
        email: '',
        password: '',
        mode:'ok'
    }

    doChange = (e) => {
        const {target} = e;

        this.setState(state => ({
            ...state,
            [target.id]: target.value,
        }));
    }

    doSubmit = (e) => {
        e.preventDefault();
        console.log(123)
        

        
        fetch('http://localhost:3000/users/login', {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            // credentials: 'omit', // include, *same-origin, omit
            headers: {

                // "Access-Control-Allow-Origin":"*",
              'Content-Type': 'application/json'
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body:JSON.stringify({email:this.state.email,password:this.state.password})
        })
.then(res=>res.json())
        .then(data=>{
            console.log(data)
            if(data.token=="false"){
                if(data.reason=="email")
                this.setState({mode:"invalid-email"})
                
                else
                {this.setState({mode:"invalid-password"})}
            }
            else{
                this.setState({mode:"ok"})
        
                window.localStorage.setItem('token',JSON.stringify(data.token))
                window.localStorage.setItem('user',JSON.stringify(data.user))


                fetch('http://localhost:3000/graphiql', {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            // credentials: 'omit', // include, *same-origin, omit
            headers: {

                // "Access-Control-Allow-Origin":"*",
              'Content-Type': 'application/json'
              // 'Content-Type': 'application/x-www-form-urlencoded',
            }
        })
.then(res=>res)
        .then(data=>{
            console.log(data)
        })
            }
        })
        
    }

    render() {
        let {auth, authError} = this.props;
 
        return (
            <div className="container">
                <div className="row">
                    <form onSubmit={this.doSubmit} className="form-signin">
                        <div className="input-field">
                            <label htmlFor="email">Email</label>
                            <input className="form-control" type="email" name="email" id="email" onChange={this.doChange}/>
                        </div>
                        <div className="input-field">
                            <label htmlFor="password">Password</label>
                            <input className="form-control" type="password" name="password" id="password"
                                   onChange={this.doChange}/>
                        </div>
                        <div className="input-field">
                            <button type="submit" className="btn btn-lg btn-primary btn-block">Login</button>
                            {authError ? <div className="red-text center"><p>{authError}</p></div> : null}
                        </div>
                       {this.state.mode=='ok'?null:this.state.mode=='invalid-email'?<p>email not found in the database</p>:<p>wrong password</p>} 
                    </form>
                  
                    <div className="col s8">
                        <Banner/>
                    </div>

                </div>
            </div>
        );
    }
}