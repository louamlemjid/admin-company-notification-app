import { useEffect,useState } from "react";
import { createPortal } from "react-dom";

const ProductForm=({isOpen, onClose})=>{
    const [productForm,setProductForm]=useState({
        name:'',
        deadline:'',
        team:''
    })
    const handleSubmit=(event)=>{
        event.preventDefault()
        window.electron.ipcRenderer.send('add-products',productForm)
    }
    const handleChange=(event)=>{
        const {name,value}=event.target;
        setProductForm({...productForm,[name]:value})
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
                placeholder="name"
                value={productForm.name}
                onChange={handleChange}
                id="formInput"
                className="form-control bg-transparent text-dark"/>

                <input type="date" name="deadline" 
                value={productForm.deadline}
                onChange={handleChange}
                id="formInput"
                className="form-control bg-transparent text-dark"/>

                <input type="text" name="team" 
                placeholder="team"
                value={productForm.team}
                onChange={handleChange}
                id="formInput"
                className="form-control bg-transparent text-dark"/>

                {/* <input type="text" name="completion"
                value={productForm.completion}
                onChange={handleChange}
                 id="formInput"
                className="form-control bg-transparent text-dark"/> */}
                <button className="btn btn-outline-info" type="submit">Add Event</button>
            </form>
        </div>
        ,document.getElementById('products')
    )
}
export default ProductForm;