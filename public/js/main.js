document.addEventListener('DOMContentLoaded', () => {
    let form = document.querySelector('form#download')
    let url = form.querySelector('input[name="url"]')
    form.addEventListener('submit', async e => {
        e.preventDefault()
        let response = await axios.post('/search', { url: url.value })
        if (response.data.status) {
            let { thumbnails, title, lengthSeconds } = response.data.data
            let time = convertSeconds(lengthSeconds)
            console.log({ thumbnails, title, time })
            let downloadLink = `/download?url=${url.value}`
            renderResult({ thumbnail: thumbnails[3].url, title, time, downloadLink })
        } else {
            console.log(response.data)
        }
    })
    url.addEventListener('focus', e => {
        url.select()
    })
})

let renderResult = ({ thumbnail, title, time, downloadLink }) => {
    let resultContainer = document.querySelector('.row-result')
    let videoImage = resultContainer.querySelector('.video-image')
    let videoTitle = resultContainer.querySelector('.video-title')
    let videoTime = resultContainer.querySelector('.video-time span')
    let btnDownload = resultContainer.querySelector('.btn-download')
    videoImage.setAttribute('src', thumbnail)
    videoTitle.innerHTML = title
    let hour = time.hours > 0 ? `${time.hours}:` : ''
    let minute = time.hours > 0 && time.minutes < 10 ? `0${time.minutes}:` : `${time.minutes}:`
    let second = time.seconds < 10 ? `0${time.seconds}` : time.seconds
    videoTime.innerHTML = `${hour}${minute}${second}`
    btnDownload.setAttribute('href', downloadLink)
    resultContainer.style.display = 'flex'
}

let convertSeconds = seconds => {
    let hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    let minutes = Math.floor(seconds / 60)
    seconds %= 60;
    return { hours, minutes, seconds }
}