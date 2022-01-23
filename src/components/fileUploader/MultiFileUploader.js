import React, { useState } from 'react'
import './style.scss'
import { Plus, XCircle } from 'react-feather'

export const MultiFileUploader = (props) => {

    const { images, handleLocalImageDelete, handleServerImageDelete } = props;
    const [error, setError] = useState("")

    // Handle image
    const handleImage = event => {
        const file = event.target.files[0]
        if (file) {
            const size = parseInt(file.size) / 1000

            if (size > props.limit) {
                setError(`Select less than ${props.limit}KB file.` )
                return
            }

            props.dataHandeller(file)
        }
    }

    return (
        <div className="img-select-container mr-2">
            <div className="form-group mb-4">
                {error ? <small className="text-danger">{error}</small> : props.error ? <small className="text-danger">{props.error}</small> : <small>{props.title}</small>}

                <div className="d-flex">
                    {
                        props.imageURLS && props.imageURLS.map((image => 
                        <div key={image.uid} className="preview-container text-center mr-2">
                            <div
                                className="image border"
                                style={{ width: props.width ? props.width : 80, height: props.height ? props.height : 80 }}
                            >
                                
                                <img src={image.path} className="img-fluid" alt="..." />
                                <XCircle onClick={() => handleServerImageDelete(image.uid)} size={16} style={{cursor: "pointer", position:"absolute",left: "88%", top: "2px"}}/>
                            </div>
                        </div>
                        ))
                    }

                    {
                        images.map((image, i) => <div key={i} className="preview-container text-center mr-2">
                            <div
                                className="image border"
                                style={{ width: props.width ? props.width : 80, height: props.height ? props.height : 80 }}
                            >
                                <img src={URL.createObjectURL(image)} className="img-fluid" alt="..." />
                                <XCircle onClick={() => handleLocalImageDelete(i) } size={16} style={{cursor: "pointer", position:"absolute",left: "88%", top: "2px"}}/>
                                {props.loading ?
                                    <div className="thumbnail-overlay flex-center flex-column">
                                        <div className="loader"></div>
                                    </div>
                                    : null}
                            </div>
                        </div>)
                    }

                    <div className="add-container text-center">
                        <div
                            className="image-plus border"
                            style={{ width: props.width ? props.width : 80, height: props.height ? props.height : 80 }}
                        >
                            <input type="file" className="upload" onChange={handleImage} />
                            <div className="flex-center flex-column">
                                <Plus size={22} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};