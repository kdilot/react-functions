//  날짜 표현식
export const dateExpress = (date: string) => {
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

//  base64 => File
export const base64toFile = (dataurl: any, fileName: any) => {
    let arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n)

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }

    // Edge/IE는 don't support File()
    // return new File([u8arr], fileName, { type: mime});
    return new Blob([u8arr], { type: mime })
}
