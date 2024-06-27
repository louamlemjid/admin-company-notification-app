import { useEffect,useState } from "react";
import { createPortal } from "react-dom";

const UrgentsForm=({isOpen, onClose})=>{
    const [urgentsForm,setUrgentsForm]=useState({
        subject:''
    })
    const handleChange=(event)=>{
        const {name,value}=event.target;
        setUrgentsForm({...urgentsForm,[name]:value})
    }
    const handleSubmit=(event)=>{
        event.preventDefault();
        window.electron.ipcRenderer.send('add-urgents',urgentsForm)
    }
    if(!isOpen)return null;
 return createPortal(
        
        <div className="popup">
            <div className="closePopup" onClick={onClose}>
                X
            </div>
            <form className="popupFrom" onSubmit={handleSubmit}>
                <h1>new Urgents</h1>
                <input type="text" name="subject" 
                placeholder="subject"
                value={urgentsForm.subject}
                onChange={handleChange}
                id="formInput"
                className="form-control bg-transparent text-dark"/>
               
                <button className="btn btn-outline-info" type="submit">Add Event</button>

            </form>
        </div>
        ,document.getElementById('Urgentsform')
    )
}
export default UrgentsForm;