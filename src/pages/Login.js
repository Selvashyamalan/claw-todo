import { LoginApi } from '../services/Api';
import { isAuthenticated } from '../services/Auth';
import { storeUserData } from '../services/Storage';
import { Link,Navigate } from 'react-router-dom';
import './Login.css'
import { useState } from 'react';
export default function Login () {

    const initialStateErrors = {
        email:{required:false},
        password:{required:false},
        custom_error:null
    }
    const [errors, setErrors] = useState(initialStateErrors);

    const [loading, setLoading] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        let errors = initialStateErrors; 
        let hasError = false;

        if(inputs.email === ''){
            errors.email.required = true;
            hasError = true;
        }
        if(inputs.password === ''){
            errors.password.required = true;
            hasError = true;
        }

        if(hasError !== true){
            setLoading(true)
            LoginApi(inputs).then((response) => {
                console.log(response);
                storeUserData(response.data.idToken);
            }).catch((err)=> {
                if(err.code == "ERR_BAD_REQUEST"){
                    setErrors({...errors, custom_error: "Invalid Credentials"})
                }
            }).finally(() => {
                setLoading(false)
            })
        }

        setErrors({...errors})
    }

    const [inputs, setInputs] = useState({
        email:'',
        password:'',
    })

    const handleInput = (event) => {
        setInputs({...inputs, [event.target.name]:event.target.value})
    }

    if(isAuthenticated()){
        return <Navigate to='/todo'/>
    }

    return(
        <div>
            <section className="login-block">
                <div className="container">
                    <div className="row">
                        <div className="col login-sec">
                            <h2 className="text-center">Login Now</h2>
                            <form onSubmit={handleSubmit} className="login-form" action="">
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1" className="text-uppercase">Email</label>
                                    <input type="email" className="form-control" onChange={handleInput} name="email" id="" placeholder="email"/>
                                    {errors.email.required ? 
                                        (<span className='text-danger'>Email is required.</span>) : null 
                                    }
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputPassword1" className="text-uppercase">Password</label>
                                    <input type="password" className='form-control' onChange={handleInput} name="password" placeholder="Password" id=""/>
                                    {errors.password.required ? 
                                        (<span className='text-danger'>Password is required.</span>) : null
                                    }
                                </div>
                                <div className="form-group">
                                    {loading ?
                                        (<div className="text-center">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="sr-only"></span>
                                            </div>
                                        </div>) : null
                                    } 
                                    <span className="text-danger">
                                        {errors.custom_error ? 
                                            (<p>{errors.custom_error}</p>) : null 
                                        }
                                    </span>
                                    <input type="submit" className="btn btn-login float-right" disabled={loading} value="login"/>
                                </div>
                                <div className="clearfix"></div>
                                <div className="form-group">
                                    Create new account ? Please <Link to='/register'>Register</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}