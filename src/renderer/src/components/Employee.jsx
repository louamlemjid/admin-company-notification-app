import { useState,useEffect } from "react"
import { Link } from "react-router-dom"
import company from '../assets/company.jpg'
import arrow from '../assets/arrow.jpg'
const Employee =()=>{
    const [message,setMessage]=useState('')
    const [formData,setFormData]=useState({
        userId:'',
        password:'',
        name:'',
        passwordRetype:'',
        email:'',
        companyId:''
    })
    const handleInputChange=(event)=>{
        const {name,value}=event.target
        setFormData({...formData,[name]:value })
    }
    const handleSubmit=(event)=>{
        event.preventDefault();
        formData.password===formData.passwordRetype?
        window.electron.ipcRenderer.send('signup-employee',formData)
        :
        null
    }
    useEffect(()=>{
        window.electron.ipcRenderer.on('signup-employee',(event,message)=>{
            console.log("result employee signup: ",message)
            setMessage(message)
        })
    },[])
    return(
        <section className='login'>
        
        <div className='leftLogin'>
        <Link to='/' id="backLink">
            <img src={arrow} alt="back arrow" width={40} />
            <p id="back">Back to login</p>
        </Link>
            <h1>Sign Up A Company</h1>
            <img src={company}  alt="logo NotMe" width={240} style={{borderRadius:'50%'}} />
            
            <div className='signup'>
                {/* <Link id='info' >Forgot Password</Link> */}
                <Link id='signup' to='/signupcompany'>Company</Link>
            </div>
        </div>
        <form className='rightLogin' onSubmit={handleSubmit}>
            <h2>Employee info</h2>
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
                <input type="text"
                    className="form-control bg-light text-dark"
                    placeholder="company serial id.."
                    name="companyId"
                    id="companyId"
                    value={formData.companyId}
                    onChange={handleInputChange}
                    required />
                    <span className="text-danger">{`*${message}`}</span>
            <button type='submit' className='btn btn-success'>Sign Up</button>
            
        </form>
        </section>
    )
}
export default Employee