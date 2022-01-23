import React, { useState } from 'react'
import ReactImageMagnify from 'react-image-magnify'
import { useWindowSize } from '../window/windowSize'
import { Container } from '../container/Index'

export const Gallery = (props) => {
    const size = useWindowSize()
    const [largeImage, setLargeImage] = useState(props.image ? props.image[0].path : "")


    return (
        <Container.Row>
            {/* Large images container */}
            <Container.Column className="mb-2">
                <ReactImageMagnify {...{
                    smallImage: {
                        alt: '...',
                        src: largeImage,
                        width: size.width <= 1200 ? 300 : 450,
                        height: size.width <= 1200 ? 300 : 450
                    },
                    style: { margin: 'auto' },
                    imageClassName: 'magnifiySmallImage',
                    largeImage: {
                        src: largeImage,
                        width: 1200,
                        height: 1800
                    },
                    enlargedImageContainerStyle: { background: '#fff', zIndex: 9 }
                }} />
            </Container.Column>
            {/* Small images container */}
            <Container.Column>
                <Container.Fluid>
                    <Container.Row className="justify-content-md-center">

                        {/* <div
                            className="border float-left m-1"
                            onClick={() => setLargeImage(props.image && props.image ? props.image[0].path : null)}
                            style={{ cursor: "pointer" }}
                        >
                            <img src={props.image ? props.image[0].path : null} className="img-fluid" alt="..." width={size.width < 374 ? "60" : size.width < 380 ? "70": "80"} height={size.width < 374 ? "60" : size.width < 380 ? "70": "80"} />
                        </div> */}
                        {props.image && props.image.length ?
                            props.image.map((item, i) =>
                                <div
                                    key={i}
                                    className="border float-left m-1"
                                    onClick={() => setLargeImage(item.path)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <img src={item.path} className="img-fluid" alt="..." width={size.width < 374 ? "60" : size.width < 380 ? "70": "80"} height={size.width < 374 ? "60" : size.width < 380 ? "70": "80"} />
                                </div>
                            ) : null
                        }
                    </Container.Row>
                </Container.Fluid>
            </Container.Column>
        </Container.Row>
    );
};