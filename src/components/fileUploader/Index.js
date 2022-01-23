import React, { useState } from 'react'
import './style.scss'
import { Plus } from 'react-feather'

export const FileUploader = (props) => {

    const [selectedFile, setSelectedFile] = useState(props.deafult ? props.deafult : null)

    // Handle image
    const handleImage = event => {
        const file = event.target.files[0]
        if (file) {
            const size = parseInt(file.size) / 1000

            if (size > props.limit) {
                props.dataHandeller({ error: `Select less than ${props.limit}KB file.` })
                return
            }

            props.dataHandeller({ image: file })
            setSelectedFile(URL.createObjectURL(file))
        }
    }

    return (
        <div className="img-select-container">
            <div className="form-group mb-4">
                {props.error ? <small className="text-danger">{props.error}</small> : <small>{props.title}</small>}

                <div className="d-flex">
                    {selectedFile || props.imageURL ?
                        <div className="preview-container text-center mr-2">
                            <div
                                className="image border"
                                style={{ width: props.width ? props.width : 80, height: props.height ? props.height : 80 }}
                            >
                                <img src={selectedFile || props.imageURL} className="img-fluid" alt="..." />
                                {props.loading ?
                                    <div className="thumbnail-overlay flex-center flex-column">
                                        <div className="loader"></div>
                                    </div>
                                    : null}
                            </div>
                        </div>
                        : null}

                    <div className="add-container text-center mr-3">
                        <div
                            className="image-plus border "
                            style={{ width: props.width ? props.width : 80, height: props.height ? props.height : 80 }}
                        >
                            <input type="file" className="upload" onChange={handleImage} />
                            <div className="flex-center flex-column">
                                <Plus size={18} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};