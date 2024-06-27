import { useState,useEffect } from "react"
import { Link } from "react-router-dom"
import employees from '../assets/employees.jpg'
import arrow from '../assets/arrow.jpg'
const Company =()=>{
    const [message,setMessage]=useState('')
    const [formData,setFormData]=useState({
        userId:'',
        password:'',
        name:'',
        passwordRetype:'',
        email:''
    })
    const handleInputChange=(event)=>{
        const {name,value}=event.target
        setFormData({...formData,[name]:value })
    }
    const handleSubmit=(event)=>{
        event.preventDefault();
        formData.password===formData.passwordRetype?
        window.electron.ipcRenderer.send('signup-company',formData)
        :
        null
    }
    useEffect(()=>{
        window.electron.ipcRenderer.on('signup-company',(event,message)=>{
            console.log("result company signup: ",message)
            setMessage(message)
        })
    },[])
    return(
        <>
        <section className='login'>
        <div className='leftLogin'>
        <Link to='/' id="backLink">
            <img src={arrow} alt="back arrow" width={40} />
            <p id="back">Back to login</p>
        </Link>
            <h1>Sign Up An Employee</h1>
            <img src={employees}  alt="logo NotMe" width={240} style={{borderRadius:'50%'}} />
            
            <div className='signup'>
                {/* <Link id='info' >Forgot Password</Link> */}
                <Link id='signup' to='/signupemployee'>Employee</Link>
            </div>
        </div>
        <form className='rightLogin' onSubmit={handleSubmit}>
            <h2>Company info</h2>
            <input type="text" name="name" id="name" 
            className="form-control bg-light text-dark" 
            placeholder="name.."
            value={formData.name}
            onChange={handleInputChange}
            required/>
            <input type="text"
                    className="form-control bg-light text-dark"
                    placeholder="userId.."
                    name="userId"
                    id="userId"
                    value={formData.userId}
                    onChange={handleInputChange}
                    required />
            <input type="email"
                    className="form-control bg-light text-dark"
                    placeholder="email.."
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required />
            
            
            <input 
                type="password"
                className="form-control bg-light text-dark"
                placeholder="password.."
                name="password"
                id="password"
                value={formData.password}
                onChange={handleInputChange}
                required/>
                <input 
                type="password"
                className="form-control bg-light text-dark"
                placeholder="re-type password.."
                name="passwordRetype"
                id="passwordRetype"
                value={formData.passwordRetype}
                onChange={handleInputChange}
                required/>
                <span className="text-danger">{`*${message}`}</span>
            <button type='submit' className='btn btn-success'>Sign Up</button>
            
        </form>
        </section>
        </>
    )
}
export default Company