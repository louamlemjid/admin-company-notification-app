import { useEffect,useState } from "react";
import { createPortal } from "react-dom";

const FormWindow=({isOpen, onClose})=>{
    const [eventForm,setEventForm]=useState({
        name:'',
        date:'',
        description:'',
        place:''
    })
    const handleSubmit=(event)=>{
        event.preventDefault()
        window.electron.ipcRenderer.send('add-event',eventForm)
    }
    const handleChange=(event)=>{
        const {name,value}=event.target;
        setEventForm({...eventForm,[name]:value})
    }
    if(!isOpen)return null;
 return createPortal(
        
        <div className="popup">
            <div className="closePopup" onClick={onClose}>
                X
            </div>
            <form className="popupFrom" onSubmit={handleSubmit} >
                <h1>New event</h1>
                <input type="text" name="name" 
                value={eventForm.name}
                onChange={handleChange}
                placeholder="name"
                id="formInput"
                className="form-control bg-transparent text-dark"/>

                <input type="date" name="date" 
                value={eventForm.date}
                onChange={handleChange}
                id="formInput"
                className="form-control bg-transparent text-dark"/>

                <input type="text" name="description" 
                placeholder="description"
                value={eventForm.description}
                onChange={handleChange}
                id="formInput"
                className="form-control bg-transparent text-dark"/>

                <input type="text" name="place"
                placeholder="place"
                value={eventForm.place}
                onChange={handleChange}
                id="formInput"
                 className="form-control bg-transparen0 text-dark"/>
                <button className="btn btn-outline-info" type="submit">Add Event</button>
            </form>
        </div>
        ,document.getElementById('form')
    )
}
export default FormWindow;