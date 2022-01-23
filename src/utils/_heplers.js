export const englishToBengali = (english) => {
    localStorage.getItem('language')
    if (localStorage.getItem('language') === 'bn') {
        english = numberE2B(english)
    }
    return english
};

export const numberE2B = (number) => {
    let bengaliNumber = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']
    let englishNumber = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    number = number + ''
    for (let i = 0; i < englishNumber.length; i++) {
        number = number.replaceAll(englishNumber[i], bengaliNumber[i])
    }
    return number
}

// Phone number valid check
export const isValidPhone = () => {
    const regex = /^(?:\+88|88)?(01[3-9]\d{8})$/i
    return regex
}

// E-mail valid check
export const isValidEmail = () => {
    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
    return regex
}

// Date formate
export const dateFormate = (date) => {
    date = new Date(date)
    const cdate = date.toDateString();
    return cdate;
}

// Date Formate mm/dd/yyyy
export const dateFormat2 = (date) => {
    date = new Date(date)
    const newdate = date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear()
    return newdate
}

// Date Year Format yyyy/mm/dd
export const dateYearFormat = (date) => {
    date = new Date(date)
    const yearDate = date.getFullYear() + '-' + parseInt(date.getMonth()+1) + "-" + date.getDate()
    return yearDate
}

// Date formate with AM/PM
export const formatDateWithAMPM = date => {
    date = new Date(date)
    const cdate = date.toDateString();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = cdate + ', ' + hours + ':' + minutes + ' ' + ampm;
    return strTime;
}


export const BatchIdGenerator = () => {
    const date = new Date()
    const string = localStorage.getItem('dokanname')
    const slicer = string.slice(0, 3) + "-" + date.getFullYear() + date.getMonth() + 1 + date.getDate() + date.getMilliseconds() + "-" + Math.floor((Math.random() * 100) + 1);
    return slicer
}

