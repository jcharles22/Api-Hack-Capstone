$(function (){
let city;
const catagories ={
    food: '4d4b7105d754a06374d81259',
    events: '4d4b7105d754a06373d81259',
    nightlife: '4d4b7105d754a06376d81259',
    hotel: '4bf58dd8d48988d1fa931735'
};
const url =`https://api.foursquare.com/v2/venues/explore?limit=10&radius=250&`;
const params = {
    client_id: 'L3TKFKNJ2AXEJW5L1ILMIBHOMGLSLPE45GK1EI0V05YBSMLX',
    client_secret: '0CPKJLIZUPM4OHFWTT5UIGMDXTANUCG1NOIR0APWYRYZXZ4D',
    v: '20180323'
};
function formatParams(params) {
    return Object.keys(params).map(key => `${key}=${params[key]}`).join('&');
};

function hideHomePage() {
    $('.homePage').addClass('hidden');
};
function displayButtons() {
    $('.results').removeClass('hidden');
    
};
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
    searchWeather();
    searchUrl();
    hideHomePage();
    displayButtons();
    searchAgain();
    changeActiveSearch();
  });
};

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

function searchWeather() {
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

function searchUrl(){
    params['near']=city;
    params.categoryId=catagories[document.getElementsByClassName('active')[0].id];
    fetch(url + formatParams(params)) 
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
            displayError(error);
        });
};

function displayError(error) {
    $('.displayResults').append(
        `<p>${error}</p>`
        );
}

function display(response) {
    console.log(response);
    if(response.response.groups[0].items.length===0) {
        $('.displayResults').append(
        `<p>Sorry no ${document.getElementsByClassName('active')[0].id} listed at this time.</p>`
        );
    }
    response.response.groups[0].items.forEach(index =>{
        $('.displayResults').append(
            `<li>
            <pclass='venueName'><img src='${index.venue.categories[0].icon.prefix}bg_32${index.venue.categories[0].icon.suffix}'>${index.venue.name}</p>
            <p>Address: ${index.venue.location.formattedAddress[0]} ${index.venue.location.formattedAddress[1]}</p>
            </li>`
            );
    });  
};

function changeActiveSearch(){
    $('body').on('click', '.venues', function(e) {
        e.preventDefault();
        let current=$('.active');
        if(!$(this).hasClass('active')){
            current.toggleClass('active');
            $(this).toggleClass('active');
             $('.displayResults').empty();
            searchUrl(city);
        }

           
    });
};

watchForm();
});


