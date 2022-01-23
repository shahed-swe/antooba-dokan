import { Text } from '../text/Text'
import './styles.scss'
import { ShoppingCart } from 'react-feather'
import { Toastify } from '../toastify/Toastify'
import { DangerButton, GrayButton } from '../button/Index'


export const Product = (props) => {
    const { product, handleProduct } = props


    // caculate discout
    const discountCalculate = (corePrice, discountType, discountAmount) => {
        let newPrice

        if (discountType && discountType === "taka") {
            newPrice = parseInt(corePrice) - parseInt(discountAmount)
        } else {
            const discount = (corePrice * discountAmount) / 100
            newPrice = parseInt(corePrice - discount)
        }

        return newPrice
    }

    return (

        <div className="general-product-container">
            <div className="normal">
                <div className="card">
                    <div className="card-body" style={{ height: props.height || 260 }}>
                        <div className="image__container">
                            <img src={product.featured_image} className="img-fluid card__image_size" alt={product.name} />
                        </div>

                        <div className="product__content">
                            <Text className="fs-14">{product.name}</Text>

                            {/* Price container */}
                            {product.discount_type && product.discount_amount ?
                                <div className="d-flex">
                                    <div className="pe-2"><del><p className="product__price_del text-muted">{`${product.selling_price}৳`}</p></del></div>
                                    <div className="pl-2">
                                        <p className="product__price">
                                            {discountCalculate(product.selling_price, product.discount_type, product.discount_amount)}৳
                                        </p>
                                    </div>
                                </div>
                                :
                                <p className="product__price_del text-muted">{product.selling_price}৳</p>
                            }
                        </div>
                        {!props.order ? product.quantity <= 0 ? <DangerButton onClick={() => Toastify.Error("Out Of Stock")} className="stock__badge_danger user-select-none"><ShoppingCart size={18} /></DangerButton> : <GrayButton className="stock__badge_success" onClick={() => { handleProduct(product, discountCalculate(product.selling_price, product.discount_type, product.discount_amount)); props.busketShake(product) }}><ShoppingCart size={18} /></GrayButton> : null}
                        {product.discount_type && product.discount_amount ?
                            <div className="discount__sticker rounded-circle flex-center flex-column text-center">
                                <p className="mb-0">-{product.discount_amount}{product.discount_type === 'taka' ? '৳' : '%'}</p>
                            </div>
                            : null
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}