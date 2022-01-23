import React from 'react'
import { Text } from '../text/Text'
import { Image } from '../image/Index'
import { Images } from '../../utils/Images'

export const EmptyCart = (props) => {

    const styles={
        img: {
            position: 'absolute',
            top: "190px",
        }
    }

    return (
        <div className="text-center w-100" style={styles.img}>
            <Image
                src={Images.EmptyCart}
                alt="Network error"
                x={350}
                y={300}
            />
            <Text className="text-muted fs-17 mt-4">{props.message}</Text>
        </div>
    );
};
