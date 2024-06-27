import { useEffect,useState } from "react";
import { createPortal } from "react-dom";

const RulesForm=({isOpen, onClose})=>{
    const [rulesForm,setRulesForm]=useState({
        rule:''
    })
    const handleChange=(event)=>{
        const {name,value}=event.target
        setRulesForm({...rulesForm,[name]:value })
    }
    const handleSubmit=(event)=>{
        event.preventDefault();
        window.electron.ipcRenderer.send('add-rules',rulesForm)
    }
    if(!isOpen)return null;
 return createPortal(
        
        <div className="popup">
            <div className="closePopup" onClick={onClose}>
                X
            </div>
            <form className="popupFrom" onSubmit={handleSubmit}>
                <h1>New Rule</h1>
                <input type="text" name="rule" 
                value={rulesForm.rule}
                onChange={handleChange}
                id="formInput"
                className="form-control bg-transparent text-dark"/>
                
                <button className="btn btn-outline-info" type="submit">Add Event</button>

            </form>
        </div>
        ,document.getElementById('RulesForm')
    )
}
export default RulesForm;