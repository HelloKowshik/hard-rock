const searchInputText = document.querySelector('#search-input');
const searchBtn = document.querySelector('.search-btn');
let showData = document.querySelector('#showLyricsDiv');
let showLyrics = document.querySelector('#show-lyrics');
let showTitle = document.querySelector('#show-title');
let showArtist = document.querySelector('#show-artist');
let errorText = document.querySelector('#error-text');
let lyric = document.querySelector('#lyric');
showData.innerHTML = '';

function getButtonData() {
    if (searchInputText.value === '') {
        errorText.innerHTML = 'Please Input Song Title/Artist Name';
        showData.innerHTML = '';
        showLyrics.innerHTML = '';

    }
    else {
        errorText.innerHTML = '';
        fetchAlbumDetails(searchInputText.value);
    }
}

function lyricsBtnEvent(e) {
    let dataTitle = e.target.getAttribute('data-title');
    let dataArtist = e.target.getAttribute('data-artist');
    getLyrics(dataTitle, dataArtist);
}


async function getLyrics(title, artist) {
    const fetchedLyrics = await fetch(`https://api.lyrics.ovh/v1/${artist}/${title}`);
    const response = await fetchedLyrics.json();
    showTitle.innerHTML = `${title} - `;
    showArtist.innerHTML = artist;
    if (!response.lyrics) {
        lyric.innerHTML = 'Lyrics Not Found';
    } else {
        lyric.innerHTML = response.lyrics;
    }
}

async function fetchAlbumDetails(val) {
    const fetchedData = await fetch(`https://api.lyrics.ovh/suggest/${val}`);
    const response = await fetchedData.json();
    const responsedData = response.data;
    if (responsedData.length === 0) {
        errorText.innerHTML = 'Song/Album/Artist Name Not Found!';
        searchInputText.value = '';
    }
    else {
        errorText.innerHTML = '';
        searchInputText.value = '';
        for (let i = 0; i < 10; i++) {
        let albumName = responsedData[i].album.title;
        let title = responsedData[i].title;
        let artist = responsedData[i].artist.name;
        let artistPhoto = responsedData[i].artist.picture_small;
        let preview = responsedData[i].preview;
        showData.innerHTML += `<div class="single-result row align-items-center my-3 p-3">
                <div class="col-md-9">
                    <h5 class="title-name">Song: ${title}</h3>
                    <h5 class="album-name">Album: ${albumName}</h4>
                    <p class="author lead">Artist: <span>${artist}</span></p>
                    <img src="${artistPhoto}" alt="" id="artist-image" /><br/><br/>
                    <audio id="myAudio" src="${preview}" controls></audio>
                </div>
                <div class="col-md-3 text-md-right text-center">
                    <button class="btn btn-success get-lyrics" data-artist='${artist}' data-title='${title}'>Get Lyrics</button>
                </div>
            </div>`;
        let getLyricsBtn = document.querySelectorAll('.get-lyrics');
        for (let j = 0; j < getLyricsBtn.length; j++) {
            getLyricsBtn[j].addEventListener('click', lyricsBtnEvent);
        }
    }
    }
}

searchBtn.addEventListener('click', getButtonData);


