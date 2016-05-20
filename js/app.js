var map;
var lat = 30.266483;
var long = -97.74176;

// Search function
var searchJobs = function() {
  var jobsearched = document.getElementById('jobsearched').value;
  var location = document.getElementById('location').value;
  document.getElementById('googleMap').style.display = "block";
  document.getElementById('jobs').style.display = "block";
  google.maps.event.trigger(map, 'resize');

  /*** Testing logs
  console.log(jobsearched);
  console.log(location); ***/

  // Indeed API to search job listings
  var indeed_client = new Indeed("6036548186486047");
      indeed_client.search({
          q: jobsearched,
          l: location,
          latlong: 1,
          limit: '5',
          userip: '1.2.3.4',
          useragent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2)',
      }, function(search_response){

          // Loop through results
          for (var i = 0; i < search_response.results.length; i++) {

            // Displaying results
            document.getElementById("joblink" + i).href = search_response.results[i].url;

            console.log(search_response.results[i]);

            var li = document.getElementById("jobtitle" + i);
            var p = document.getElementById("jobcompany" + i);

            var litxt = document.createTextNode(search_response.results[i].jobtitle);
            var ptxt = document.createTextNode(search_response.results[i].company);

            li.innerText = litxt.textContent;
            p.innerText = ptxt.textContent;

            //Placing Markers
            var jobLat = search_response.results[i].latitude;
            var jobLong = search_response.results[i].longitude;
            var jobLocation = new google.maps.LatLng(jobLat, jobLong);
            addMarker(jobLocation, search_response.results[i].jobtitle);
          };

          // Panning Map
          reslat = search_response.results[0].latitude;
          reslong = search_response.results[0].longitude;

          var center = new google.maps.LatLng(reslat, reslong);
          map.panTo(center);

          var meetupURL = "http://api.meetup.com/2/open_events.json?lat=" + jobLat + "&lon=" + jobLong + "&radius=50&topic=" + jobsearched + "&status=upcoming&time=,1w&key=3583b60765c354f3914142724a124a&callback=?";
          console.log(meetupURL);
          $.getJSON(meetupURL, function (data) {
            var htmlString = "";
            $.each(data.results, function (i, item) {
              htmlString += '<a class="meetuplink list-group-item" href="' + item.event_url + '" target="_blank">' + item.name + '<li class="meetupgroup">' + item.group.name + '</li></a>'; });
              $('#upcoming').html(htmlString);
          });



      });
}


// Google Maps
function initialize() {
  var mapProp = {
    center:new google.maps.LatLng(lat,long),
    zoom:10,
    mapTypeId:google.maps.MapTypeId.ROADMAP

  };
  map = new google.maps.Map(document.getElementById("googleMap"),mapProp);
}
google.maps.event.addDomListener(window, 'load', initialize);

// Function for adding a marker to the page.
function addMarker(location, jobName) {
    marker = new google.maps.Marker({
        position: location,
        animation: google.maps.Animation.DROP,
        map: map
    });
}
