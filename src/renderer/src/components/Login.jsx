import { useEffect, useState } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import icon from '../assets/messaging.png'
import BackgroundRemover from './BackgroundRemover'
const Login = () => {
    const [message,setMessage]=useState('')
    const navigate=useNavigate()
    const [formData,setFormData]=useState({
        userId:'',
        password:''
    })
    const handleInputChange=(event)=>{
        const {name,value}=event.target
        setFormData({...formData,[name]:value })
    }
    const handleSubmit=(event)=>{
        event.preventDefault();
        window.electron.ipcRenderer.send('login',formData)
    }
    
    useEffect(()=>{
        window.electron.ipcRenderer.on('hi',(event,message)=>{
            console.log(message)
        })
    },[])
    useEffect(()=>{
        window.electron.ipcRenderer.on('login',(event,loginInfo)=>{
            console.log(loginInfo)
            loginInfo!="notFound"?navigate(`/${loginInfo}menu`):setMessage(loginInfo)
        })
    },[])
    useEffect(()=>{
        window.electron.ipcRenderer.send('trigger')
    },[])
    
    return (
        <section className='login'>
        <div className='leftLogin'>
            {/* <img src={icon} alt="logo NotMe" className='fade-in-image' width={240} />
            <h1>Teeb3a</h1> */}
            <BackgroundRemover/>
        </div>
        <form className='rightLogin' onSubmit={handleSubmit}>
            <input type="text"
                    className="form-control bg-outline-light text-dark input"
                    placeholder="user id"
                    name="userId"
                    id="userId"
                    value={formData.userId}
                    onChange={handleInputChange}
                    required />
            <input 
                type="password"
                className="form-control bg-outline-light text-dark input"
                placeholder="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleInputChange}
                required/>
            <span className='text-danger'>{message}</span>
            <button type='submit' className='button'>Log in</button>
            <div className='info'>
                <Link id='info' >Forgot Password</Link>
                <Link id='info' to='/signupemployee'>Sign Up</Link>
            </div>
        </form>
        </section>
    )
}
export default Login