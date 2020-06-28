//  날짜 표현식
export const dateExpress = (date: string) => {
    if (!date) return false
    const time = new Date(date)
    const betweenTime = Math.floor(
        (new Date().getTime() - time.getTime()) / 1000 / 60
    )
    if (betweenTime < 1) return '방금전'
    if (betweenTime < 60) {
        return `${betweenTime}분전`
    }

    const betweenTimeHour = Math.floor(betweenTime / 60)
    if (betweenTimeHour < 24) {
        return `${betweenTimeHour}시간 전`
    }

    const betweenTimeDay = Math.floor(betweenTime / 60 / 24)
    if (betweenTimeDay < 7) {
        return `${betweenTimeDay}일 전`
    }

    const betweenTimeWeeek = Math.floor(betweenTime / 60 / 24 / 7)
    if (betweenTimeWeeek < 5) {
        return `${betweenTimeWeeek}주 전`
    }

    return `${time.getFullYear() - 2000}.${
        time.getMonth() + 1
    }.${time.getDate()}`
}

//  replaceAll
export const replaceAll = (
    str: string,
    searchStr: string,
    replaceStr: string
) => {
    return str.split(searchStr).join(replaceStr)
}

//  get string length
export const stringLengthLimit = (text: string, len: number = 50) => {
    return text.length > len ? true : false
}
