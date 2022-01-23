import _ from 'lodash'
import {
    divisions,
    districts,
    upzilas,
    postcodes
} from "./BDLocation/locations"

// postcode list
export const postCodeList = () => {
    // const language = localStorage.getItem('language') === 'bn' ? true : false

    const items = []
    if (postcodes && postcodes.length) {
        for (let i = 0; i < postcodes.length; i++) {
            const element = postcodes[i]
            const district = _.find(districts, { "id": element.district_id })
            const division = _.find(divisions, { "id": element.division_id })

            items.push({
                label: element.postCode + " - " + element.postOffice,
                value: element.postCode + " - " + element.postOffice,
                upazila: element.upazila,
                postOffice: element.postOffice,
                postCode: element.postCode,
                district: district ? district.name : null,
                division: division ? division.name : null
            })
        }
    }

    return items
}

// search location
export const location = (zip) => {
    let language = localStorage.getItem('language') === 'bn' ? true : false
    let address = {
        district: "",
        district_id: "",
        division: "",
        division_id: "",
        postCode: "",
        postOffice: ""

    }
    postcodes.map((item) => {
        if (item.postCode === zip || item.postOffice === zip) {
            address = item
        }
        return address
    })
    if (address?.postOffice) {
        divisions.map((item) => {
            if (item.id === address.division_id) {
                if (language) {
                    address.division = item.bn_name
                } else {
                    address.division = item.name
                }
            }
            return address
        })
        districts.map((item) => {
            if (item.id === address.district_id) {
                if (language) {
                    address.district = item.bn_name
                } else {
                    address.district = item.name
                }
            }
            return address
        })
        upzilas.map((item) => {
            if (item.name === address.upazila) {
                if (language) {
                    address.upazila = item.bn_name
                } else {
                    address.upazila = item.name
                }
            }
            if (item.name === address.postOffice) {
                if (language) {
                    address.postOffice = item.bn_name
                } else {
                    address.postOffice = item.name
                }
            }
            return address
        })
    }
    return address
}
