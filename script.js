$(function (){
let city;
function formatParams(params) {
    return Object.keys(params)
    .map(key => `${key}=${params[key]}`).join('&');
}

function hideHomePage() {
    $('.homePage').addClass('hidden');
}
function displayButtons(city) {
    $('.results').removeClass('hidden');
    
}
function searchAgain() {
    $('#searchAgain').on('click', e => {
        $('.homePage').removeClass('hidden');
        $('.results').addClass('hidden');
        $('.displayWeather').empty();
        $('.displayResults').empty();
        });
    };

    
function watchForm() {
    $('form').submit(function(e) {
    e.preventDefault();
    city=$('#city').val().replace(/\s/g,'');
    $('#city').val("");
    searchWeather(city);
    searchUrl(city);
    hideHomePage();
    displayButtons(city);
    searchAgain();
    changeActiveSearch(city);
  })
}

function displayWeather(response) {
    let location = response['location']['name']+" "+response['location']['region'];
    let tempF = response['current']['temp_f'];
    let tempC = response['current']['temp_c'];
    let condition = response['current']['condition']['text'];
    let conditionIconUrl = response['current']['condition']['icon'];
    $('.displayWeather').append(
        `<h1><strong>Current Weather for ${location}</strong></h1>
        <img src="https:${conditionIconUrl}">
        <p>Description: ${condition}</p>
        <p>Temperature: F:${tempF} C:${tempC} </p>`        
)};

function searchWeather(city) {
    const url=`https://api.apixu.com/v1/current.json?key=b3ddd0b9be884a1b969140151190604&q=${city}`
    fetch(url) 
        .then(response => {
         return response.json();
        })
        .then(response => {
            displayWeather(response);
         })
        .catch(function(error) {
         console.error(error);
        });
};

function searchUrl(city){
    let active = document.getElementsByClassName('active')[0].id;
    const url =`https://api.foursquare.com/v2/venues/explore?limit=10&radius=250&near=${city}&`;
    let params = {
        client_id: 'L3TKFKNJ2AXEJW5L1ILMIBHOMGLSLPE45GK1EI0V05YBSMLX',
        client_secret: '0CPKJLIZUPM4OHFWTT5UIGMDXTANUCG1NOIR0APWYRYZXZ4D',
        v: '20180323',
        section: active
    };
    let newUrl = url + formatParams(params); 
    fetch(newUrl) 
        .then(response => {
            if(response.ok) {
                return response.json();
        }
            throw new Error(response.statusText);
        })
        .then(response => {
            display(response)
        })
        .catch(function(error) {
        console.error(error);
        });
};
function display(response) {
    console.log(response);
    response.response.groups[0].items.forEach(index =>{
        $('.displayResults').append(
            `<li>
            <p class='venueName'>${index.venue.name}</p>
            <p>address: ${index.venue.location.formattedAddress[0]} ${index.venue.location.formattedAddress[1]}</p>
            </li>`
            );
    });  
};

function changeActiveSearch(city){
    $('body').on('click', '.venues', function(e) {
        e.preventDefault();
        let current=$('.active');
        if(!$(this).hasClass('active')){
            current.toggleClass('active');
            $(this).toggleClass('active');
            }
            $('.displayResults').empty();
            searchUrl(city);
        
    });
};

watchForm();
});


