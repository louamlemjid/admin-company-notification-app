import profil from '../assets/profil.png'
import React,{useEffect,useState} from 'react'
import { useNavigate } from 'react-router-dom'
import FormWindow from './FormWindow'
import UrgentsForm from './UrgentsForm'
import RulesForm from './RulesForm'
import plus from '../assets/sign.png'
import ProductForm from './ProductForm'
import welcomeImage from '../assets/welcomeImage.jpg'
import settings from '../assets/settings.png'
import notification from '../assets/notification.png' 

const CompanyMenu=()=>{
    const navigate=useNavigate()
    const [newEmployee,setNewEmployee]=useState({
        userId:'',
        password:''
    })
    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
    const [formState,setFormState]=useState(true)
    const [voteForm,setVoteForm]=useState({subject:''})
    const [voteResult,setVoteResult]=useState({subject:'',result:'',nbVotes:'',percentage:''})
    const [isOpen, setOpen]= useState(false)
    const [isOpenUrgents, setOpenUrgents]= useState(false)
    const [isOpenRules, setOpenRules]= useState(false)
    const [isOpenProduct, setOpenProduct]= useState(false)
    const [motivation,setMotivation]=useState({text:'Quote',author:'Author',rule:[],events:[]})

    const [urgents,setUrgents]=useState([])
    const [products,setProducts]=useState([])
    const dateToString=(date)=>{
        return `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`
    }
    useEffect(()=>{
        window.electron.ipcRenderer.send('notification-starter')
        console.log("starter notification is sent") 
        window.electron.ipcRenderer.send('notification')
        console.log("first notification trigger is sent") 
        window.electron.ipcRenderer.send('vote')
        console.log("vote checker is sent") 
},[])
    
    useEffect(()=>{
        
        console.log("useeffect is triggured")
        window.electron.ipcRenderer.on('notification',(event,data)=>{
            console.log("receved message: ")   
            setMotivation({text:data.text,author:data.author,
                rule:data.rule,events:data.events,
            randomIndex:Math.floor(Math.random()*motivation.rule.length)})
            data.urgents?setUrgents(data.urgents):null
            data.products?setProducts(data.products):null
            console.log(data)
            console.log("motivation: ",motivation)
        })
    },[])
    useEffect(()=>{
        window.electron.ipcRenderer.on('add-urgents',(event,data)=>{
            setUrgents(data.urgents)
        })
    },[])
    useEffect(()=>{
        window.electron.ipcRenderer.on('add-products',(event,data)=>{
            setProducts(data.products)
        })
    },[])
    
    const handleVoteFormChange=(event)=>{
        const {name,value}=event.target
        setVoteForm({...voteForm,[name]:value})
    }
    const handleVoteFormSubmit=(event)=>{
        event.preventDefault()
        voteForm.subject?
            window.electron.ipcRenderer.send('vote',voteForm)&&
            setFormState(false)
        :null
    }
    const handleNewEmployeeFormChange=(event)=>{
        const {name,value}=event.target
        setNewEmployee({...voteForm,[name]:value})
    }
    const handleNewEmployeeFormSubmit=(event)=>{
        event.preventDefault()
        window.electron.ipcRenderer.send('add-employee',newEmployee)
    }
    useEffect(()=>{
        window.electron.ipcRenderer.on('vote',(event,data)=>{
            console.log("vote result receved: ",data)
            setVoteResult({subject:data.subject,result:data.result,nbVotes:data.nbVotes,percentage:data.percentage})
            setFormState(false)
        })
    },[])
    return(
        <>
        <FormWindow isOpen= {isOpen} onClose={()=>setOpen(false)}/>
        <UrgentsForm isOpen= {isOpenUrgents} onClose={()=>setOpenUrgents(false)}/>
        <RulesForm isOpen= {isOpenRules} onClose={()=>setOpenRules(false)}/>
        <ProductForm isOpen= {isOpenProduct} onClose={()=>setOpenProduct(false)}/>
        <section className="body">
            <nav className="navBar">
            <div className="upNav">
                    <span><img src={notification} alt="notification icon" width={30} />
                    <p className='nbNot'>{motivation.rule.length}</p></span>
                </div>
                <div className="downNav">
                    <p><img src={settings} alt="settings logo" width={30}/></p>
                    <img src={profil} alt="profil" width={30} onClick={()=>navigate('/')} />
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
                    <img src={plus} alt="add rule" className="add" width={40} 
                    onClick={()=> {setOpenRules(true)}}/>
                    
                            {motivation.rule.map((ruleElement,ruleIndex)=>(
                                <h5 className='rule' key={ruleIndex}>{ruleElement}</h5>
                            ))}
                    </div>
                    <div className="urgents" >
                    <h4>Urgents</h4>
                    <div>
                        <img src={plus} onClick={()=> {setOpenUrgents(true)}}
                         alt="add event" width={20} className="add"/>
                    </div>
                    {urgents.map((urgent,indexUrgent)=>(
                        <p className="urgent" key={indexUrgent}>
                            {urgent}
                        </p>
                    ))}
                </div>
                    </div>
                    <div className="rightDownLeftMenu">
                        <div className="tasks" >
                        <h4>Products</h4>
                        <div className='addproduct' >
                            <img src={plus} alt="add task" width={50}
                            onClick={()=> {setOpenProduct(true)}} className='add'/>
                        </div>
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
                <h4>Vote</h4>
                        {formState?
                        <form className='voteForm' onSubmit={handleVoteFormSubmit}>
                            
                            <input type="text"
                            name='subject'
                            value={voteForm.subject}
                            onChange={handleVoteFormChange} 
                            placeholder='vote subject' id='vote' className='form-control bg-outline-light text-dark' />
                            <button className='button'
                            type='submit'>Start Vote</button>
                        </form>:
                        <div className='voteResult'>
                            <h5>{voteResult.subject}</h5>
                            <div className='details'>
                                <span>{voteResult.result?voteResult.result:"waiting..."}</span>
                                <span>{voteResult.nbVotes} votes</span>
                                <p>{voteResult.percentage}%</p>
                            </div>
                            <button onClick={()=>setFormState(true)} className="button">Stop Vote</button>
                        </div>}
                </div>
                <div className="events"  >
                <h4>Events</h4>
                    <div  >
                        <img src={plus} className='add'
                         alt="add event" onClick={()=> {setOpen(true)}}
                        width={30}/>
                    </div>
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
                <div className='newEmployee'>
                    <form onSubmit={handleNewEmployeeFormSubmit} >
                        <h5>Add Employee</h5>
                        <input type="text"
                        onChange={handleNewEmployeeFormChange}
                        placeholder='userId' id='userId' 
                        className='form-control bg-outline-light text-dark'
                        name='userId'
                        value={newEmployee.userId}
                        />
                        <input type="text"
                        name='password'
                        onChange={handleNewEmployeeFormChange}
                        placeholder='Password' id='password' 
                        className='form-control bg-outline-light text-dark'
                        value={newEmployee.password}
                        />
                        <button type='submit' className='button'>Add</button>
                    </form>
                </div>
            </div>
        
            </main>
        </section>
        </>
    )
}
export default CompanyMenu;