import React from 'react'
import { Text } from '../text/Text'
import { Images } from '../../utils/Images'

export const NoContent = (props) => {
    return (
        <div className="text-center w-100">
            <img src={Images.NoContent} className="img-fluid" alt="..." />
            <Text className="text-muted fs-17 mt-4">{props.message}</Text>
        </div>
    );
};
