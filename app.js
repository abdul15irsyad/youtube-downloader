const express = require('express')
const app = express()
const fs = require('fs')
const ytdl = require('ytdl-core')
require('dotenv').config()

app.set('view engine', 'pug')
app.set('views', './views')

app.use('/public', express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const PORT = process.env.PORT || '3000'
const router = express.Router()

router.get('/', (req, res) => {
    res.render('index')
})

router.post('/search', (req, res) => {
    let { url } = req.body
    ytdl.getBasicInfo(url)
        .then(response => {
            res.status(200).json({
                status: true,
                data: response.videoDetails
            })
        }).catch(error => {
            res.status(200).json({
                status: false,
                message: error.message
            })
        })
})

router.get('/download', async (req, res) => {
    let { url } = req.query
    let info = await ytdl.getBasicInfo(url)
    res.header('Content-Disposition', `attachment;filename="${info.videoDetails.title}.mp4"`)
    ytdl(url, { format: 'mp4' }).pipe(res);
})

app.use('/', router)

app.listen(PORT, () => console.log(`server running on port ${PORT}`))