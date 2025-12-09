export const stringJoinQuery = (bindings): string => {
    let joinQuery = ``

    if (+bindings.length <= 0) {
        return ''
    }

    if (typeof bindings === 'string') {
        const newArray = bindings.split(',')

        newArray.forEach((string, index) => {
            if (index === 0) {
                joinQuery += `'` + string.trim() + `'`
            } else {
                joinQuery += `, '` + string.trim() + `'`
            }
        })
        return joinQuery
    }

    bindings.forEach((object: string, index: number) => {
        if (index === 0) {
            joinQuery += `'` + object + `'`
        } else {
            joinQuery += `, '` + object + `'`
        }
    })

    return joinQuery
}

export const arrayJoinQuery = (bindings): string[] => {
    const joinQuery = []

    if (+bindings.length <= 0) {
        return []
    }

    if (typeof bindings === 'string') {
        const newArray = bindings.split(',')

        newArray.forEach((string, index) => {
            joinQuery.push(string.trim())
        })

        return joinQuery
    }
}

export const stringToNumberArray = (value: string, sort = false): number[] => {
    if (!value) return []

    const numbers = value.split(',').reduce((acc: number[], item: string) => {
        const num = Number(item.trim())
        if (!isNaN(num) && item.trim() !== '') {
            acc.push(num)
        }
        return acc
    }, [])

    return sort ? numbers.sort((a, b) => a - b) : numbers
}

export const arrayToNumberArray = (array: any[], sort = false): number[] => {
    if (!Array.isArray(array) || array.length === 0) return []

    const numbers = array.reduce((acc: number[], item: any) => {
        const num = Number(item)
        if (!isNaN(num)) {
            acc.push(num)
        }
        return acc
    }, [])

    return sort ? numbers.sort((a, b) => a - b) : numbers
}

export const getCdnImageUrl = (url: string) => {
    if (!url) {
        return ''
    }
    if (/^https:\/\//.test(url)) {
        return url
    } else {
        return `${process.env.CLOUD_IMAGE_URL}/${url}`
    }
}


export const priceRegularExpression = async (price: number) => {
    return price.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * 첫 글자만 대문자로 치환
 */
export const firstStringUpperCase = (caseString: string) => {
    return caseString.charAt(0).toUpperCase() + caseString.slice(1)
}

/**
 * 랜덤 텍스트 반환
 */
export const getCharacterRandom = async (length: number) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let text = ''
    for (let i = 0; i < length; i++) {
        text += characters.charAt(Math.floor(Math.random() * characters.length))
    }

    return text
}

/**
 * X 좌표 반환
 */
export const getMapX = (address: string) => {
    const first = address.slice(0, 3)
    const last = address.slice(3)

    return first + '.' + last
}

/**
 * Y 좌표 반환
 */
export const getMapY = (address: string) => {
    const first = address.slice(0, 2)
    const last = address.slice(2)

    return first + '.' + last
}

/**
 * 법정동 검색코드로 반환
 */
export const bjdCodeFormatting = (code: string) => {
    const cleanedCode = code.replace(/0+$/, '')
    const bjdCd = /^\d+$/.test(cleanedCode) ? cleanedCode : '0'
    const codeLength = bjdCd.length

    switch (codeLength) {
        case 3:
        case 4:
        case 5:
            return bjdCd.padEnd(5, '0')
        case 6:
        case 7:
        case 8:
            return bjdCd.padEnd(8, '0')
        case 10:
            return bjdCd.padEnd(5, '0')
        default:
            return '0000000000'
    }
}

/**
 * 이름 마킹
 */
export const replaceName = (name: string) => {
    switch (name.length) {
        case 2:
            return name.replace(name.substring(0, 1), '*')
        default:
            return name[0] + '*'.repeat(name.substring(1, name.length - 1).length) + name[name.length - 1]
    }
}

/**
 * 아이디 마킹
 */
export const replaceId = (id: string) => {
    const len = id.length

    if (len <= 4) return '*'.repeat(len) // 길이가 4 이하라면 전체 마스킹

    const start = id.slice(0, 2) // 앞 2글자
    const end = id.slice(-2) // 뒤 2글자

    return start + '*'.repeat(len - 4) + end
}

/**
 * 핸드폰번호 마킹
 */
export const replacePhoneNumber = (phoneNumber: string) => {
    const reg = /[\{\}\[\]\/?.,;:\s|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi // 특수문자 제거
    const phone = phoneNumber.replace(reg, '')

    return phone.substring(0, 3) + '****' + phone.substring(+phone.length - 4, phone.length)
}

/**
 * 빌링 카드번호 마킹
 */
export const replaceCardNumber = (cardNumber: string): string => {
    // 1. 숫자만 남김
    const cleanNumber = cardNumber.replace(/\D/g, ''); 

    // 2. 16자리 숫자열을 원하는 패턴으로 변환
    // (XXXX) (XX) (XX) (XXXX) (XXX) (*)
    return cleanNumber.replace(
        /^(\d{4})(\d{2})\d{2}(\d{4})(\d{3})(\d{1}).*$/, 
        '$1-$2**-****-$4*'
    );
};

export const uniqueRandomValues = (array, count) => {
    const shuffled = array.sort(() => Math.random() - 0.5)
    const checkShuffled = shuffled.slice(0, count)
    return [...new Set(checkShuffled)] // 중복값 제거
}

export const replaceHypenHp = async (hp: string) => {
    hp = hp.replace(/[^0-9]/g, '')

    let tempArray = []

    if (hp.length > 3) {
        tempArray.push(hp.substring(0, 3))

        const remainStr = hp.substring(3)

        if (remainStr.length > 4) {
            tempArray.push(remainStr.substring(0, remainStr.length - 4))
            tempArray.push(remainStr.substring(remainStr.length - 4))
        } else {
            tempArray.push(remainStr)
        }
    } else {
        tempArray.push(hp)
    }

    return tempArray.join('-')
}

export const dateFormatCheck = async (dateString: string) => {
    // 정규식: 4자리 연도, 2자리 월(01~12), 2자리 일(01~31)
    const regex = /^(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])$/
    return regex.test(dateString)
}

/**
 * 시구군 -> 시코드로 변경
 * 1165000000 -> 1100000000
 */
export const getAreaMetroCode = async (num: number) => {
    const digits = Math.floor(Math.log10(num))
    return Math.floor(num / 10 ** (digits - 1)) * 10 ** (digits - 1)
}
