//  base64 => Blob
export const base64tBlob = (dataurl: any, fileName: any) => {
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

export const getImageOrientation = async (file: any) => {
    const orientation = await new Promise(function (resolve, reject) {
        let reader = new FileReader()
        reader.onload = (event: any) => {
            let view = new DataView(event.target.result)

            if (view.getUint16(0, false) !== 0xffd8) resolve(-2)

            let length = view.byteLength,
                offset = 2

            while (offset < length) {
                let marker = view.getUint16(offset, false)
                offset += 2

                if (marker === 0xffe1) {
                    if (view.getUint32((offset += 2), false) !== 0x45786966) {
                        resolve(-1)
                    }
                    let little = view.getUint16((offset += 6), false) === 0x4949
                    offset += view.getUint32(offset + 4, little)
                    let tags = view.getUint16(offset, little)
                    offset += 2

                    for (let i = 0; i < tags; i++)
                        if (view.getUint16(offset + i * 12, little) === 0x0112)
                            resolve(view.getUint16(offset + i * 12 + 8, little))
                } else if ((marker & 0xff00) !== 0xff00) break
                else offset += view.getUint16(offset, false)
            }
            resolve(-1)
        }

        reader.readAsArrayBuffer(file.slice(0, 64 * 1024))
    })
    return orientation
}

export const base64ImageRotate: any = async (
    base64: any,
    quality: number = 0.7
) => {
    const filename = await new Promise(function (resolve, reject) {
        let image = new Image()
        image.src = base64
        image.onload = function () {
            let resizedDataUrl = rotateImage(image, quality)
            resolve(resizedDataUrl)
        }
    })
    return filename
}

export const rotateImage = (
    image: any,
    quality: number,
    degree: number = 90
) => {
    // PC 에서는 자동으로 회전감지, iOS 에서는 자동으로 회전감지
    // 안드로이드 에서는 회전 적용이 필요(세로 이미지가 옆으로 누워서 인식)
    // orientation 값에 따라 degree 각도 조절 필요
    let canvas = document.createElement('canvas')

    let width = image.width
    let height = image.height

    canvas.width = degree % 180 === 0 ? width : height
    canvas.height = degree % 180 === 0 ? height : width

    let ctx: any = canvas.getContext('2d')

    ctx.save()
    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.rotate((degree * Math.PI) / 180)
    ctx.drawImage(image, image.width / -2, image.height / -2)
    ctx.restore()
    return canvas.toDataURL('image/jpeg', quality)
}

export const base64ImageResize = async (
    base64: any,
    maxWidth: number,
    maxHeight: number
) => {
    const filename = await new Promise(function (resolve, reject) {
        let image = new Image()
        image.src = base64
        image.onload = function () {
            let resizedDataUrl = resizeImage(image, maxWidth, maxHeight)
            resolve(resizedDataUrl)
        }
        // let reader = new FileReader();
        // reader.readAsDataURL(file);
        // reader.onload = function (event: any) {
        //     let dataUrl = event.target.result;
        //     console.log(dataUrl);
        //     let image = new Image();
        //     image.src = dataUrl;
        //     image.onload = function () {
        //         let resizedDataUrl = resizeImage(
        //             image,
        //             maxWidth,
        //             maxHeight,
        //             0.7,
        //         resolve(resizedDataUrl);
        //     };
        // };
    })
    return filename
}

export const resizeImage = (
    image: any,
    maxWidth: number,
    maxHeight: number,
    quality: number = 0.7
) => {
    let canvas = document.createElement('canvas')

    let width = image.width
    let height = image.height

    if (width > height) {
        if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width)
            width = maxWidth
        }
    } else {
        if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height)
            height = maxHeight
        }
    }

    canvas.width = width
    canvas.height = height

    let ctx: any = canvas.getContext('2d')
    ctx.drawImage(image, 0, 0, width, height)

    return canvas.toDataURL('image/jpeg', quality)
}

//   이미지 사이즈 제한
export const isOverSizeBase64 = (images: any) => {
    if (Array.isArray(images)) {
        const isOverSize = images.map((m: any) => {
            const base64Split = m.split(',')
            return calculateImageSize(base64Split[1])
        })
        if (isOverSize.includes(true)) {
            return true
        }
    }
    return false
}

export const calculateImageSize = (base64String: string) => {
    let padding: number, inBytes: number, base64StringLength: number
    if (base64String.endsWith('==')) padding = 2
    else if (base64String.endsWith('=')) padding = 1
    else padding = 0

    base64StringLength = base64String.length
    inBytes = (base64StringLength / 4) * 3 - padding
    if (inBytes / 1000 / 1000 > 10) {
        // 10 MB
        return true
    }
    return false
}
