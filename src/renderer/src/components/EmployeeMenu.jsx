import profil from '../assets/profil.png'
import React,{useEffect,useState} from 'react'
import { useNavigate } from 'react-router-dom'
import FormWindow from './FormWindow'
import UrgentsForm from './UrgentsForm'
import RulesForm from './RulesForm'
import plus from '../assets/sign.png'
import ProductForm from './ProductForm'
import settings from '../assets/settings.png'
import notification from '../assets/notification.png'
import welcomeImage from '../assets/welcomeImage.jpg'
import openLogo from '../assets/openLogo.png'
const EmployeeMenu=()=>{
   
    const navigate=useNavigate()
    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
    const [open,setOpen]=useState(true)
    const [formState,setFormState]=useState(true)
    const [voteForm,setVoteForm]=useState({vote:''})
    const [voteResult,setVoteResult]=useState({subject:'',vote:''})
    const [motivation,setMotivation]=useState({text:'Quote',author:'Author',rule:[],events:[]})
    const [urgents,setUrgents]=useState([])
    const [products,setProducts]=useState([])
    const dateToString=(date)=>{
        return `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`
    }
    useEffect(()=>{
        window.electron.ipcRenderer.send('notification-starter-employee')
        console.log("starter notification is sent") 
        window.electron.ipcRenderer.send('notification-employee')
        console.log("first notification trigger is sent") 
        window.electron.ipcRenderer.send('vote-employee')
        console.log("vote checker is sent") 
},[])
useEffect(()=>{
    window.electron.ipcRenderer.on('fire',(event,data)=>{
        console.log(" fired: ",data)
        data.urgents?setUrgents(data.urgents):null
        data.events?setMotivation({events:data.events}):null
        data.products?setProducts(data.products):null
        if(data.voteSubject!=''&&data.voteSubject!=undefined){
            setVoteResult({subject:data.voteSubject})
            setFormState(false)
        }else{
            setFormState(true)
        }
        
    })
},[])
    useEffect(()=>{
        
        console.log("useeffect is triggured")
        window.electron.ipcRenderer.on('notification-employee',(event,data)=>{
            console.log("receved message: ")   
            setMotivation({text:data.text,author:data.author,
                rule:data.rule,events:data.events})
                setUrgents(data.urgents)
                setProducts(data.products)
            console.log(data)
            console.log("motivation: ",motivation)
        })
    },[])
    const handleVoteChange=(event)=>{
        const {name,value}=event.target
        setVoteForm({...voteForm,[name]:value})
    }
    const handleVoteSubmit=(event)=>{
        event.preventDefault()
        voteForm.vote?
            window.electron.ipcRenderer.send('vote-employee',voteForm)
        :null
    }
    const handleLogout=()=>{
        window.electron.ipcRenderer.send('logout')
        navigate("/")
    }
    useEffect(()=>{
        window.electron.ipcRenderer.on('vote-employee',(event,data)=>{
            console.log("vote result receved: ",data)
            setVoteResult({subject:data.subject,vote:data.vote})
            setFormState(true)
        })
    },[])
    return(
        <>
        {open?
        <div className='openLogo'>
            <img src={openLogo} alt="company logo" className='fade-in-image' width={400} />
            {/* <img src={profil} alt="profil" width={30} onClick={handleLogout}/> */}
        </div>:
        <section className="body">
        <nav className="navBar">
            <div className="upNav">
                <span><img src={notification} alt="notification icon" width={30} /></span>
            </div>
            <div className="downNav">
                <p><img src={settings} alt="settings logo" width={30}/></p>
                <img src={profil} alt="profil" width={30} onClick={handleLogout}/>
            </div>
        </nav>
        <main className="menu">
        <div className="leftMenu">
            <div className="upLeftMenu">
                <div className='notification'>
                    <h4>{weekday[new Date().getDay()]}</h4>
                    <h1 style={{fontSize:50}}>{new Date().getDate()}th</h1>
                    <h5>hello , louam !</h5>
                    <h6>{motivation.text?`"${motivation.text}"`:null}{motivation.text?`by ${motivation.author}`:null}</h6>
                </div>
                <img src={welcomeImage} width={250} style={{borderRadius:40}} alt="welcome icon" />
            </div>
            <div className="downLeftMenu">
                <div className="leftDownLeftMenu">
                    <div className="rules"  >
                        <h4>Rules</h4>
                        {motivation.rule.map((ruleElement,ruleIndex)=>(
                            <h5 className='rule' key={ruleIndex}>{ruleElement}</h5>
                        ))}
                    </div>
                    <div className="urgents" >
                        <h4>Urgents</h4>
                        {urgents.map((urgent,indexUrgent)=>(
                            <p className="urgent" key={indexUrgent}>
                                {urgent}
                            </p>
                        ))}
                    </div>
                </div>
                <div className="rightDownLeftMenu">
                    <div className="tasks" >
                    <h2 style={{fontSize:20,width:"80%",margin:"auto",borderBottom:"solid 2px rgba(96, 122, 126, 0.251)"}}>Products</h2>
                        {products?
                        products.map((product,indexProduct)=>(
                            <div className='product' key={indexProduct}>
                                <h2 style={{fontSize:20}}>{product.name}</h2>
                                <h4 style={{fontSize:10,width:50,borderRadius:10,margin:"auto",backgroundColor:"rgba(0, 183, 255, 0.516)"}}>{dateToString(product.deadline)}</h4>
                                <p style={{fontSize:12}}>{product.team}</p>
                            </div>
                        )):
                        null}
                    </div>
            
                </div>
            </div>
            
        </div>
       <div className="rightMenu">
        <div className="vote">
                    {formState?
                    <div className='voteEmployee'>
                        <h5>Vote Field</h5>
                        <div className='details'>
                            <p>{voteResult.subject}</p>
                            <p>{voteResult.vote}</p>
                        </div>
                    </div>
                    :
                    <form className='voteForm' onSubmit={handleVoteSubmit}>
                    <h5>Vote</h5>
                    <h2>vote for {voteResult.subject}</h2>
                    <input type="text"
                    name='vote'
                    value={voteForm.vote}
                    onChange={handleVoteChange} 
                    placeholder='vote' className='form-control bg-light text-dark' />
                    <button className='btn btn-success'
                    type='submit'>Start Vote</button>
                </form>}
        </div>
        <div className="events"  >
                <h3>Events</h3>
                {motivation.events.map((event,index)=>(
                    <div className='event' key={index}>
                        <h2 style={{fontSize:20}}>{event.name}</h2>
                        <div style={{display:"flex",flexDirection:"row",margin:"auto 30%"}}>
                        <h6 style={{fontSize:10,width:50,borderRadius:10,backgroundColor:"rgba(255, 230, 0, 0.556)"}}>{event.place}</h6>
                        <h6 style={{fontSize:10,width:50,borderRadius:10,backgroundColor:"rgba(0, 183, 255, 0.516)"}}>{dateToString(event.date)}</h6>
                        </div>
                        <p style={{fontSize:12}}>{event.description}</p>
                    </div>
                ))}
                
            </div>
       </div>
       
        </main>
        
    </section>}
        </>
    )
}
export default EmployeeMenu;