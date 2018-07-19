      //
      // Streetview Map
      //

      function svinitialize() {

        console.log('No peaking!');

      
        var coordArray = ['43.194295, 76.887567', '43.2593256,76.9564866', '43.2617985,76.9708418', '43.3524966,79.07076', '43.0530802,76.9762786', '43.2543508,77.48596', '44.0033008,78.8382644', '43.142781, 77.004203', '43.156932,77.0602422', '43.219135,76.929427', '43.111948,77.074305', '42.932619, 78.339064'];
        var randCoord = coordArray[Math.floor(Math.random() * coordArray.length)];
        coordArrayLatLongs = randCoord.replace(/[\])}[{(]/g,'').split(',');

        window.locLL = coordArrayLatLongs[0]+","+coordArrayLatLongs[1];

        // Do streetview
        var whoamiLocation = new google.maps.LatLng(coordArrayLatLongs[0],coordArrayLatLongs[1]);
        var streetViewService = new google.maps.StreetViewService();
        var STREETVIEW_MAX_DISTANCE = 100;

        streetViewService.getPanoramaByLocation(whoamiLocation, STREETVIEW_MAX_DISTANCE, function (streetViewPanoramaData, status) {
            if (status === google.maps.StreetViewStatus.OK) {

              // We have a streetview pano for this location, so let's roll
              var panoramaOptions = {
                position: whoamiLocation,
                addressControl: false,
                linksControl: false,
                pov: {
                  heading: 270,
                  zoom: 1,
                  pitch: -10
                },
                visible: true
              };
              var panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'), panoramaOptions);

            } else {
                // no street view available in this range, or some error occurred
                alert('Streetview is not available for this location :( Mind telling us that you saw this?');
            }
        });

      };