/**
 * Created by Thomas Anderson on 2016/8/19.
 */

var myAddressList = Array();

var myAddress = {
    SingleLine: "4800 Calhoun Rd, Houston, Texas"
    /*Street: "118 N Browne St",
     City: "Spokane",
     State: "Washington",
     Zone: ""*/
};

myAddressList.push(myAddress);

myAddress = {
    SingleLine: "Louisiana St, Houston, Texas"
};

myAddressList.push(myAddress);

myAddress = {
    SingleLine: "Franklin St, Houston, Texas"
};

myAddressList.push(myAddress);

/*
myAddress = {
    SingleLine: "Silver St, Houston, Texas"
};

myAddressList.push(myAddress);

myAddress = {
    SingleLine: "Panama St, Houston, Texas"
};

myAddressList.push(myAddress);
*/


require([
    "esri/tasks/Locator",
    "esri/widgets/Compass",
    "esri/widgets/Locate",
    "esri/widgets/Search",
    "esri/Map",
    "esri/views/MapView",
    "esri/Graphic",
    "esri/geometry/SpatialReference",
    "esri/geometry/support/webMercatorUtils",
    "esri/layers/FeatureLayer",
    "esri/layers/GraphicsLayer",
    "esri/layers/TileLayer",
    "esri/PopupTemplate",
    "esri/symbols/TextSymbol",
    "esri/symbols/PictureMarkerSymbol",
    "esri/tasks/RouteTask",
    "esri/tasks/support/RouteParameters",
    "esri/tasks/support/RouteResult",
    "esri/tasks/support/FeatureSet",
    "esri/tasks/support/DirectionsFeatureSet",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/widgets/Home",
    "esri/Color",
    "esri/core/urlUtils",
    "dojo/dom",
    "dojo/on",
    "dojo/domReady!"
], function(
    Locator, Compass, Locate, Search, Map, MapView, Graphic, SpatialReference, webMercatorUtils,
    FeatureLayer, GraphicsLayer, TileLayer, PopupTemplate, TextSymbol, PictureMarkerSymbol,
    RouteTask, RouteParameters, RouteResult, FeatureSet, DirectionsFeatureSet, SimpleMarkerSymbol,
    SimpleLineSymbol, Home, Color, urlUtils, dom, on
) {

    // proxy the route requests to avoid prompt for log in
    urlUtils.addProxyRule({
        urlPrefix: "route.arcgis.com",
        proxyUrl: "/sproxy/"
    });

    // Point the URL to a valid route service
    var routeTask = new RouteTask({
        url:"http://sampleserver3.arcgisonline.com/ArcGIS/rest/services/Network/USA/NAServer/Route"
    });

    // The stops and route result will be stored in this layer
    var routeByLoadLyr = new GraphicsLayer();

    var highlightRouteLyr = new GraphicsLayer();

    var routeStopLyr = new GraphicsLayer();

    var searchResultLyr = new GraphicsLayer();

    var routeBySearchLyr = new GraphicsLayer();

    // Setup the route parameters
    var routeParams = new RouteParameters({
        stops: new FeatureSet(),
        returnDirections: true,
        returnStops: true,
        outSpatialReference: { // autocasts as new SpatialReference()
            wkid: 3857
        }
    });

    // Define the symbology used to display the stops
    var stopSymbol = new SimpleMarkerSymbol({
        style: "cross",
        size: 15,
        outline: { // autocasts as new SimpleLineSymbol()
            width: 4
        }
    });

    var symbol = new PictureMarkerSymbol({
        url: "img/location1.png",
        width: "8px",
        height: "8px"
    });

    var normalStopSymbol = new PictureMarkerSymbol({
        url: "img/location1.png",
        width: "32px",
        height: "32px",
        xoffset: "-10px",
        yoffset: "15px"
    });

    var highlightStopSymbol = new PictureMarkerSymbol({
        url: "img/location2.png",
        width: "32px",
        height: "32px",
        xoffset: "-10px",
        yoffset: "15px"
    });

    // Define the symbology used to display the route
    var routeSymbol = new SimpleLineSymbol({
        color: [0, 0, 255, 0.5],
        width: 5
    });

    var highlightRouteSymbol = new SimpleLineSymbol({
        color: [255, 87, 34, 1],
        width: 7
    });

    var transportationLyr = new TileLayer({
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer",
        // This property can be used to uniquely identify the layer
        id: "streets",
        visible: false
    });


    var map = new Map({
        basemap: "streets",
        layers: [transportationLyr, routeBySearchLyr, searchResultLyr, routeByLoadLyr, highlightRouteLyr, routeStopLyr] // Add the route layer to the map
    });


    var view = new MapView({
        container: "viewDiv", // Reference to the scene div created in step 5
        map: map, // Reference to the map object created before the scene
        center: [-95.3031, 29.7000],
        zoom: 12
    });

    var homeBtn = new Home({
        view: view
    });
    homeBtn.startup();

    // Add the home widget to the top left corner of the view
    view.ui.add(homeBtn, "top-left");

    var streetsLyrToggle = dom.byId("streetsLyr");

    /*****************************************************************
     * The visible property on the layer can be used to toggle the
     * layer's visibility in the view. When the visibility is turned off
     * the layer is still part of the map, which means you can access
     * its properties and perform analysis even though it isn't visible.
     *******************************************************************/

    on(streetsLyrToggle, "change", function() {
        transportationLyr.visible = streetsLyrToggle.checked;
    });

    var locatorTask = new Locator({
        url: "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"
        /*
        outSpatialReference: { // autocasts as new SpatialReference()
            wkid: 3857
        }
        */
    });

    var compassWidget = new Compass({
        view: view
    });
    view.ui.add(compassWidget, "top-left");
    var locateBtn = new Locate({
        view: view
    });
    locateBtn.startup();
    view.ui.add(locateBtn, {
        position: "bottom-left",
    });
    var searchWidget = new Search({
        view: view
    });
    searchWidget.startup();
    view.ui.add(searchWidget, {
        position: "top-right",
        index: 0
    });


    /*******************************************************************
     * This click event sets generic content on the popup not tied to
     * a layer, graphic, or popupTemplate. The location of the point is
     * used as input to a reverse geocode method and the resulting
     * address is printed to the popup content.
     *******************************************************************/
    /*
    view.on("click", function(evt) {

        // Get the coordinates of the click on the view
        var lat = Math.round(evt.mapPoint.latitude * 1000) / 1000;
        var lon = Math.round(evt.mapPoint.longitude * 1000) / 1000;

        view.popup.open({
            // Set the popup's title to the coordinates of the location
            title: "Reverse geocode: [" + lon + ", " + lat + "]",
            location: evt.mapPoint // Set the location of the popup to the clicked location
        });

        // Display the popup
        // Execute a reverse geocode using the clicked location
        locatorTask.locationToAddress(evt.mapPoint).then(function(
            response) {
            // If an address is successfully found, print it to the popup's content
            var address = response.address.Match_addr;
            view.popup.content = address;
        }).otherwise(function(err) {
            // If the promise fails and no result is found, print a generic message
            // to the popup's content
            view.popup.content =
                "No address was found for this location";
        });
    });
    */


    var allStops = Array();
    for(var i = 0; i < myAddressList.length; i++){
        var stop = Object();
        allStops.push(stop);
    }

    var sendRoute = Array();
    for(var i = 0; i < myAddressList.length - 1; i++){
        var singleRoute = Object();
        sendRoute.push(singleRoute);
    }

    var searchResult = Array();

    var singleRoute = Object();

    var onClickButton1Time = 0;
    var stopNum = 0;
    var stopList = Array();
    var sendRouteNum = 0;

    /**网络分析结果
     * strpoint
     * endpoint
     * dis (total)
     * totalLength
     * text[]
     * length[]
     * time[]
     */

    var shortestRoute = Array();

    document.getElementById("baseMapSelect").addEventListener("change", baseMapSelectChange);

    document.getElementById("load").addEventListener("click", onButtonClicked_load);

    document.getElementById("route").addEventListener("click", onButtonClicked_route);

    function baseMapSelectChange() {
        map.basemap = document.getElementById("baseMapSelect").value;
    }

    function removeAll() {
        routeByLoadLyr.removeAll();
        highlightRouteLyr.removeAll();
        routeStopLyr.removeAll();
        searchResultLyr.removeAll();
        routeBySearchLyr.removeAll();
    }

    function onButtonClicked_route() {

        removeAll();

        if(document.getElementById("startPoint").value.length == 0){
            document.getElementById("startPointMessage").innerText = "Start address cannot be null !";
        }
        if(document.getElementById("endPoint").value.length == 0){
            document.getElementById("endPointMessage").innerText = "End address cannot be null !";
        }
        else{
            document.getElementById("startPointMessage").innerText = "";
            document.getElementById("endPointMessage").innerText = "";
            var startAddress = {
                SingleLine: document.getElementById("startPoint").value
            };
            //alert(startAddress);
            var endAddress = {
                SingleLine: document.getElementById("endPoint").value
            };
            //alert(endAddress);

            //万一搜索无结果，removeAll该怎么办？
            searchResult.splice(0, searchResult.length);
            searchResultLyr.removeAll();
            routeBySearchLyr.removeAll();
            routeByLoadLyr.removeAll();
            routeStopLyr.removeAll();
            
            locatorTask.addressToLocations(startAddress)
                .then(expressAddressPoint)
                .then(calRouteBySearch, function (error) {alert(error);});
            locatorTask.addressToLocations(endAddress)
                .then(expressAddressPoint)
                .then(calRouteBySearch, function (error) {alert(error);});

        }
    }

    function expressAddressPoint(response) {

        /*
        var textSymbol = new TextSymbol({
            color: "red",
            haloColor: "black",
            haloSize: "1px",
            text: response[0].address,
            xoffset: 0,
            yoffset: 10,
            font: {  // autocast as esri/symbols/Font
                size: 12,
                family: "sans-serif",
                weight: "bolder"
            }
        });
        */

        var stop = new Graphic({
            attributes: {
                "address": response[0].address
            },
            geometry: response[0].location,
            popupTemplate: {
                title: "Location",
                content: "<p><b>" + response[0].address  + "</b></p>",
            },
            symbol: normalStopSymbol
        });

        /*
        var stopText = new Graphic({
            geometry: response[0].location,
            symbol: textSymbol
        });
        */

        searchResultLyr.add(stop);

        //searchResultLyr.add(stopText);

        searchResult.push(stop);

    }

    function calRouteBySearch() {
        if(searchResult.length != 2){
            return;
        }
        else{
            routeParams.stops.features.splice(0, routeParams.stops.features.length);

            routeParams.stops.features.push(searchResult[0]);
            routeParams.stops.features.push(searchResult[1]);


            if (routeParams.stops.features.length >= 2) {
                routeTask.solve(routeParams).then(showRoute2);
            }
        }
    }


    function onButtonClicked_load_1() {

    }
    
    function onButtonClicked_load_2() {
        
    }


    function onButtonClicked_load() {
        
        

        removeAll();
        allStops = Array();
        sendRoute = Array();
        stopNum = 0;
        topList = Array();
        sendRouteNum = 0;

        for (var i = 0; i < myAddressList.length; i++) {

            //alert("enter myfunction, i = " + i.toString());

            var time = 0;

            locatorTask.addressToLocations(myAddressList[i]).then(function (response) {

                /*
                var textSymbol = new TextSymbol({
                    color: "red",
                    haloColor: "black",
                    haloSize: "1px",
                    text: response[0].address,
                    xoffset: 0,
                    yoffset: 10,
                    font: {  // autocast as esri/symbols/Font
                        size: 12,
                        family: "sans-serif",
                        weight: "bolder"
                    }
                });
                */

                var stop = new Graphic({
                    attributes: {
                        "address": response[0].address
                    },
                    geometry: response[0].location,
                    popupTemplate: {
                        title: "Location",
                        content: "<p><b>" + response[0].address  + "</b></p>",
                    },
                    symbol: normalStopSymbol
                });

                /*
                var stopText = new Graphic({
                    geometry: response[0].location,
                    symbol: textSymbol
                });
                */

                routeStopLyr.add(stop);

                //routeStopLyr.add(stopText);

                //异步执行地理编码，会导致点数组的顺序混乱，通过规定地址格式，并且与地理编码的地址比较，
                //使其结果顺序存储，以便路径绘制
                for(var j = 0; j < myAddressList.length; j++){
                    var match = response[0].address.indexOf(myAddressList[j].SingleLine);
                    //alert("response[0].address = " + response[0].address + "|\n"
                    //+ "myAddressList[" + j.toString() + "] = " + myAddressList[j].SingleLine + "|\n"
                    //+ "match result = " + match.toString());

                    if(match >= 0){
                        allStops[j] = stop;
                        /**allStops' SpatialRference wkid = 4326
                         *
                         */

                        stopList.push(stopNum);
                        stopNum++;

                        //alert("allStops[" + j.toString() +"] = stop");
                        break;
                    }
                    else{
                        //alert("string match failed " + j.toString());
                    }
                }



            }).then(calRoute, function (error) {
                alert(error);
            });

        }

    }

    function calRoute() {

        if(stopNum != myAddressList.length){
            return;
        }

        //以下代码只执行一次？

        searchResultLyr.removeAll();
        routeBySearchLyr.removeAll();
        routeByLoadLyr.removeAll();


        /*
        alert("allStops' SpatialRference: wkid = " + allStops[0].geometry.spatialReference.wkid.toString());
        for(var i = 0; i < allStops.length; i++){
            alert("allStops[" + i.toString() + "]" + "\n"
                + "x = " + allStops[i].geometry.x + "\n"
                + "y = " + allStops[i].geometry.y + "\n"
            );
        }
        */

        for(var i = 0; i + 1 < allStops.length; i++){

            routeParams.stops.features.splice(0, routeParams.stops.features.length);
            routeParams.stops.features.push(allStops[i]);
            routeParams.stops.features.push(allStops[i + 1]);

            var startAddress = Object();
            startAddress.text = myAddressList[i].SingleLine;
            startAddress.x = allStops[i].geometry.x;
            startAddress.y = allStops[i].geometry.y;
            var endAddress = Object();
            endAddress.text = myAddressList[i + 1].SingleLine;
            endAddress.x = allStops[i + 1].geometry.x;
            endAddress.y = allStops[i + 1].geometry.y;

            var singleSendRoute = Object();
            singleSendRoute.startAddress = startAddress;
            singleSendRoute.endAddress = endAddress;

            sendRoute[i] = singleSendRoute;


            /*
            alert("sendRoute[" + i.toString() + "].startAddress.x = " + sendRoute[i].startAddress.x + "\n"
            + "sendRoute[" + i.toString() + "].startAddress.y = " + sendRoute[i].startAddress.y + "\n"
            + "sendRoute[" + i.toString() + "].endAddress.x = " + sendRoute[i].endAddress.x + "\n"
            + "sendRoute[" + i.toString() + "].endAddress.y = " + sendRoute[i].endAddress.y + "\n"
            );
            */

            if (routeParams.stops.features.length >= 2) {
                routeTask.solve(routeParams).then(showRoute);
            }
        }

    }

    var showRouteNum = 0;

    function showRoute(data) {
        showRouteNum++;
        //alert("enter showRoute ! " + "\n" + "showRouteNum = " + showRouteNum.toString() + "\n" + "sendRouteNum = " + sendRouteNum.toString());
        var routeResult = data.routeResults[0].route;
        routeResult.symbol = routeSymbol;
        routeByLoadLyr.add(routeResult);
        //alert("add to layer");

        var routeDirection = data.routeResults[0].directions;

        var totalLength = routeDirection.totalLength;

        var totalTime = routeDirection.totalTime;

        var features = routeDirection.features;

        var text = Array();

        for(var i = 0; i < features.length; i++){
            var singleText = features[i].getAttribute("text");
            text.push(singleText);
        }

        var length = Array();

        for(var i = 0; i < features.length; i++){
            var singleLength = features[i].getAttribute("length");
            length.push(singleLength);
        }

        var time = Array();

        for(var i = 0; i < features.length; i++){
            var singleTime = features[i].getAttribute("time");
            time.push(singleTime);
        }

        var stops = data.routeResults[0].stops;
        /**stops' SpatialRference wkid = 102100
         *
         */
        /*
        alert("stops' SpatialRference: wkid = " + stops[0].geometry.spatialReference.wkid.toString());
        alert("stops number = " + stops.length.toString() + "\n"
            + "stops[0].x = " + stops[0].geometry.x + "\n"
            + "stops[0].y = " + stops[0].geometry.y + "\n"
            + "stops[1].x = " + stops[1].geometry.x + "\n"
            + "stops[1].y = " + stops[1].geometry.y);
            */

        //alert("create stopPoint0 !");
        var stopPoint0 = webMercatorUtils.webMercatorToGeographic(stops[0].geometry);
        //alert("create stopPoint1 !");
        var stopPoint1 = webMercatorUtils.webMercatorToGeographic(stops[1].geometry);

        /*
        alert("new stops' SpatialRference: wkid = " + stopPoint0.spatialReference.wkid.toString());
        alert("stops number = " + stops.length.toString() + "\n"
            + "stops0.x = " + stopPoint0.x + "\n"
            + "stops0.y = " + stopPoint0.y + "\n"
            + "stops1.x = " + stopPoint1.x + "\n"
            + "stops1.y = " + stopPoint1.y);
            */

        for(var i = 0; i < myAddressList.length - 1; i++) {
            //alert("enter match period ! " + "\n" + " i = " + i.toString());
            /**每个分支路径的数据容器和计算结果只要比较出发点是否相同即可
             *geographic和webMercator之间的转换会有一定的误差
             * 判断相等时精确到千分之一
             */

            var startX1 = Math.round(sendRoute[i].startAddress.x * 1000) / 1000;
            var startY1 = Math.round(sendRoute[i].startAddress.y * 1000) / 1000;
            var startX2 = Math.round(stopPoint0.x * 1000) / 1000;
            var startY2 = Math.round(stopPoint0.y * 1000) / 1000;

            /*
            alert(sendRoute[i].startAddress.text + " to " + sendRoute[i].endAddress.text + "\n"
            + "startX1 = " + startX1.toString() + ", startY1 = " + startY1.toString() + "\n"
            + "startX2 = " + startX2.toString() + ", startY2 = " + startY2.toString());
            */

            if (startX1 == startX2 && startY1 == startY2) {
                //alert("match!");
                sendRouteNum++;
                //alert("showRouteNum = " + showRouteNum.toString() + "\n" + "sendRouteNum = " + sendRouteNum.toString());
                sendRoute[i].directions = data.routeResults[0].directions;
                sendRoute[i].totalLength = totalLength;
                sendRoute[i].totalTime = totalTime;
                sendRoute[i].text = text;
                sendRoute[i].length = length;
                sendRoute[i].time = time;
                sendRoute[i].totalGraphic = routeResult;
                sendRoute[i].segments = features;
            }
            else{
                //alert("not match!");
                //alert("showRouteNum = " + showRouteNum.toString() + "\n" + "sendRouteNum = " + sendRouteNum.toString());
            }
        }

        if(sendRouteNum == myAddressList.length - 1) {
            document.getElementById("test").innerHTML = "";
            //alert("print all !");
            //alert("showRouteNum = " + showRouteNum.toString() + "\n" + "sendRouteNum = " + sendRouteNum.toString());
            //document.getElementById("test").innerHTML += "<ul id='routeDirection'>";
            for(var i = 0; i < sendRouteNum; i++){



                document.getElementById("test").innerHTML +=

                    "<button id='direPoint2Point_" + i.toString() + "'>From " + sendRoute[i].startAddress.text + " to " + sendRoute[i].endAddress.text +
                    "<br>( " + Math.round(sendRoute[i].totalLength * 1000) / 1000 + " miles, "
                    + Math.round(sendRoute[i].totalTime * 1000) / 1000 + " minutes )</button>";


                for (var j = 0; j < sendRoute[i].text.length; j++) {



                    if(j == 0){
                        var start = sendRoute[i].text[j].replace(/Location 1/, sendRoute[i].startAddress.text);
                        document.getElementById("test").innerHTML +=
                            "<button id='direPoint2Point_" + i.toString() + "_Segment_" + j.toString() + "'>"
                            + start + "</button>";
                    }
                    else if(j == sendRoute[i].text.length - 1){
                        var end = sendRoute[i].text[j].replace(/Location 2/, sendRoute[i].endAddress.text);
                        document.getElementById("test").innerHTML +=
                            "<button id='direPoint2Point_" + i.toString() + "_Segment_" + j.toString() + "'>"
                            + end + "</button>";
                    }
                    else{
                        document.getElementById("test").innerHTML +=
                            "<button id='direPoint2Point_" + i.toString() + "_Segment_" + j.toString() + "'>"
                            + sendRoute[i].text[j] + "<br>( "
                            + Math.round(sendRoute[i].length[j] * 1000) / 1000 + " miles, "
                            + Math.round(sendRoute[i].time[j] * 1000) / 1000 + " minutes )</button>";
                    }

                }

            }

            /**
             * Route from one address to another
             * SpatialRference wkid = 102100
             */
            for(var i = 0; i < sendRoute.length; i++){
                var cell = document.getElementById("direPoint2Point_" + i.toString());
                cell.onclick = function () {
                    highlightRouteLyr.removeAll();
                    var id = this.id;
                    var num = id.substring("direPoint2Point_".length, id.length);
                    var totalRoute = sendRoute[num].totalGraphic;
                    view.goTo(totalRoute);
                    var highlightRouteResult = totalRoute;
                    highlightRouteResult.symbol= highlightRouteSymbol;
                    highlightRouteLyr.add(highlightRouteResult);
                    //alert(document.getElementById(id).innerHTML);
                    var pointsNum = totalRoute.geometry.paths[0].length;
                    /*
                    alert("pointsNum = " + pointsNum);
                    for(var j = 0; j < totalRoute.geometry.paths.length; j++){
                        alert(totalRoute.geometry.paths[i]);
                        for(var k = 0; k < totalRoute.geometry.paths[0].length; j++){
                            alert(totalRoute.geometry.paths[i][j]);
                        }
                    }
                    */
                    num++;
                    view.popup.open({
                        // Set the popup's title to the coordinates of the location
                        title: "Route " + num.toString(),
                        content: document.getElementById(id).innerHTML,
                        location: totalRoute.geometry.getPoint(0, Math.round(pointsNum/2)),
                        visible: true
                    });
                };
            }

            /**
             * Segments of route from one address to another
             * initial SpatialRference  = null
             * Need to set SpatialRference wkid = 102100
             */
            for(var i = 0; i < sendRoute.length; i++){

                var segmentsNum = sendRoute[i].segments.length;

                for(var j = 0; j < segmentsNum; j++){

                    var cell = document.getElementById("direPoint2Point_" + i.toString() + "_Segment_" + j.toString());

                    cell.onclick = function () {
                        highlightRouteLyr.removeAll();
                        var id = this.id;
                        var num = id.substring("direPoint2Point_".length, id.length);
                        var num1 = "";
                        var num2 = "";
                        var numOf_ = 0;
                        var num1End = false;
                        for(var k = 0; k < num.length; k++){
                            if(num.charAt(k) != "_" && !num1End){
                                num1 += num.charAt(k);
                            }
                            else{
                                num1End = true;
                                if(num.charAt(k) == "_"){
                                    numOf_++;
                                }
                            }
                            if(numOf_ == 2){
                                num2 = num.substring(k + 1,num.length);
                                break;
                            }
                        }
                        var routeSegment = sendRoute[num1].segments[num2];
                        routeSegment.geometry.spatialReference = new SpatialReference({ // autocasts as new SpatialReference()
                            wkid: 3857
                        });
                        view.goTo(routeSegment);
                        var highlightRouteResult = routeSegment;
                        highlightRouteResult.symbol= highlightRouteSymbol;
                        highlightRouteLyr.add(highlightRouteResult);
                        var pointsNum = routeSegment.geometry.paths[0].length;

                        view.popup.open({
                            // Set the popup's title to the coordinates of the location
                            title: "Segment " + num2.toString(),
                            content: document.getElementById(id).innerHTML,
                            location: routeSegment.geometry.getPoint(0, Math.round(pointsNum/2)),
                            visible: true
                        });
                    };
                }

            }

        }

    }

    function showRoute2(data) {

        var routeResult = data.routeResults[0].route;
        routeResult.symbol = routeSymbol;
        routeBySearchLyr.add(routeResult);

        singleRoute = Object();

        var routeDirection = data.routeResults[0].directions;

        var totalLength = routeDirection.totalLength;

        var totalTime = routeDirection.totalTime;

        var features = routeDirection.features;

        var text = Array();

        for(var i = 0; i < features.length; i++){
            var singleText = features[i].getAttribute("text");
            text.push(singleText);
        }

        var length = Array();

        for(var i = 0; i < features.length; i++){
            var singleLength = features[i].getAttribute("length");
            length.push(singleLength);
        }

        var time = Array();

        for(var i = 0; i < features.length; i++){
            var singleTime = features[i].getAttribute("time");
            time.push(singleTime);
        }

        singleRoute.totalGraphic = routeResult;
        singleRoute.totalLength = totalLength;
        singleRoute.totalTime = totalTime;
        singleRoute.text = text;
        singleRoute.time = time;
        singleRoute.segments = features;

        document.getElementById("test").innerHTML = "";

        var address0 = searchResult[0].getAttribute("address");
        var address1 = searchResult[1].getAttribute("address");

        document.getElementById("test").innerHTML +=

            "<button id='singleRoute'>From " + address0 + " to " + address1 +
            "<br>( " + Math.round(totalLength * 1000) / 1000 + " miles, "
            + Math.round(totalTime * 1000) / 1000 + " minutes )</button>";


        for (var j = 0; j < text.length; j++) {

            if(j == 0){
                var start = text[j].replace(/Location 1/, address0);
                document.getElementById("test").innerHTML +=
                    "<button id='Segment_" + j.toString() + "'>" + start + "</button>";
            }
            else if(j == text.length - 1){
                var end = text[j].replace(/Location 2/, address1);
                document.getElementById("test").innerHTML +=
                    "<button id='Segment_" + j.toString() + "'>" + end + "</button>";
            }
            else{
                document.getElementById("test").innerHTML +=
                    "<button id='Segment_" + j.toString() + "'>"
                    + text[j] + "<br>( "
                    + Math.round(length[j] * 1000) / 1000 + " miles, "
                    + Math.round(time[j] * 1000) / 1000 + " minutes )</button>";
            }

        }

        /**
         * Route from one address to another
         * SpatialRference wkid = 102100
         */
        for(var i = 0; i < text.length; i++){
            var cell = document.getElementById("singleRoute");
            cell.onclick = function () {
                highlightRouteLyr.removeAll();
                //var id = this.id;
                //var num = id.substring("direPoint2Point_".length, id.length);
                //var totalRoute = sendRoute[num].totalGraphic;
                var totalRoute = singleRoute.totalGraphic;
                view.goTo(totalRoute);
                var highlightRouteResult = totalRoute;
                highlightRouteResult.symbol= highlightRouteSymbol;
                highlightRouteLyr.add(highlightRouteResult);
                //alert(document.getElementById(id).innerHTML);
                var pointsNum = totalRoute.geometry.paths[0].length;

                 /*
                 alert("pointsNum = " + pointsNum);
                 for(var j = 0; j < totalRoute.geometry.paths.length; j++){
                 alert(totalRoute.geometry.paths[i]);
                 for(var k = 0; k < totalRoute.geometry.paths[0].length; j++){
                 alert(totalRoute.geometry.paths[i][j]);
                 }
                 }
                 */
                view.popup.open({
                    // Set the popup's title to the coordinates of the location
                    title: "Route",
                    content: document.getElementById("singleRoute").innerHTML,
                    location: totalRoute.geometry.getPoint(0, Math.round(pointsNum/2)),
                    visible: true
                });
            };
        }


        /**
         * Segments of route from one address to another
         * initial SpatialRference  = null
         * Need to set SpatialRference wkid = 102100
         */


            var segmentsNum = singleRoute.segments.length;

            for(var j = 0; j < segmentsNum; j++){

                var cell = document.getElementById("Segment_" + j.toString());

                cell.onclick = function () {
                    highlightRouteLyr.removeAll();
                    var id = this.id;
                    var num = id.substring("Segment_".length, id.length);
                    var routeSegment = singleRoute.segments[num];
                    routeSegment.geometry.spatialReference = new SpatialReference({ // autocasts as new SpatialReference()
                        wkid: 3857
                    });
                    view.goTo(routeSegment);
                    var highlightRouteResult = routeSegment;
                    highlightRouteResult.symbol= highlightRouteSymbol;
                    highlightRouteLyr.add(highlightRouteResult);
                    var pointsNum = routeSegment.geometry.paths[0].length;

                    view.popup.open({
                        // Set the popup's title to the coordinates of the location
                        title: "Segment " + num.toString(),
                        content: document.getElementById(id).innerHTML,
                        location: routeSegment.geometry.getPoint(0, Math.round(pointsNum/2)),
                        visible: true
                    });
                };
            }




        /*

        document.getElementById("watch").innerHTML = "";

        document.getElementById("watch").innerHTML += "( "
            + totalLength + " miles,  "
            + totalTime + " minutes )"
            + "<br\>";


        document.getElementById("watch").innerHTML += text.length.toString() + " directions:" + "<br\>";

        for(var j = 0; j < text.length; j++){
            document.getElementById("watch").innerHTML += text[j] + "  ( "
                + length[j] + " miles,  "
                + time[j] + " minutes )"
                + "<br\>";
        }

        document.getElementById("watch").innerHTML += "<br\>";

        */

    }

});