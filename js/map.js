/**
 * Created by Thomas Anderson on 2016/8/25.
 */

var ladinginfoList = new Array();


var inStation = new Array();


var myAddressList = Array();

var currentSegment = Object();

var allStations = Array();

var notStation = Array();

function addressInit() {
    var majorStation = {
        SingleLine: "5105 Westhaven Dr, Fort Worth, Texas",
        goods: Array()
    };
    allStations.push(majorStation);
    var branchStation = {
        SingleLine: "925 W 5th St, Austin, Texas",
        goods: Array()
    };
    allStations.push(branchStation);
    branchStation = {
        SingleLine: "701 Commerce St, Dallas, Texas",
        goods: Array()
    };
    allStations.push(branchStation);
    branchStation = {
        SingleLine: "911 Andrews St, Houston, Texas",
        goods: Array()
    };
    allStations.push(branchStation);
    branchStation = {
        SingleLine: "321 S Main Ave, San Antonio, Texas",
        goods: Array()
    };
    allStations.push(branchStation);
}

function filter(){
    for(var i = 0; i < ladinginfoList.length; i++){
        for(var j = 0; j < allStations.length; j++){
            if(ladinginfoList[i].getNowPosition() == allStations[j].SingleLine){
                ladinginfoList[i].SingleLine = ladinginfoList[i].getNowPosition();//SingleLine For Geocoding
                allStations[j].goods.push(ladinginfoList[i]);
                inStation[i] = true;
            }
        }
    }
    for(var i = 0; i < ladinginfoList.length; i++){
        if(inStation[i] == false){
            ladinginfoList[i].SingleLine = ladinginfoList[i].getNowPosition();//SingleLine For Geocoding
            notStation.push(ladinginfoList[i]);
        }
    }
}




function pathInit(data) {
    for(var i = 0; i < data.length; i++){
        var myAddress = {
            SingleLine: data[i]
        };
        myAddressList.push(myAddress);
    }
}


function currentSegmentInit(i, j) {
    currentSegment.startIndex = i;
    currentSegment.endIndex = j;
}


require([
    "esri/tasks/Locator",
    "esri/widgets/Compass",
    "esri/widgets/Locate",
    "esri/widgets/Search",
    "esri/Map",
    "esri/views/MapView",
    "esri/Graphic",
    "esri/geometry/Extent",
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
    Locator, Compass, Locate, Search, Map, MapView, Graphic, Extent, SpatialReference, webMercatorUtils,
    FeatureLayer, GraphicsLayer, TileLayer, PopupTemplate, TextSymbol, PictureMarkerSymbol,
    RouteTask, RouteParameters, RouteResult, FeatureSet, DirectionsFeatureSet, SimpleMarkerSymbol,
    SimpleLineSymbol, Home, Color, urlUtils, dom, on
) {

    initdata(ladinginfoList);//LadingInfo Array
    for(var i = 0; i < ladinginfoList.length; i++){
        inStation[i] = false;
    }
    addressInit();
    filter();

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

    var normalRouteStopLyr = new GraphicsLayer();

    var highlightRouteStopLyr = new GraphicsLayer();

    var searchResultLyr = new GraphicsLayer();

    var stationLyr = new GraphicsLayer();

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

    var normalStopSymbol = new PictureMarkerSymbol({
        url: "images/location1.png",
        width: "32px",
        height: "32px",
        xoffset: "-10px",
        yoffset: "15px"
    });

    var highlightStopSymbol = new PictureMarkerSymbol({
        url: "images/location2.png",
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
        layers: [transportationLyr, routeBySearchLyr, searchResultLyr, routeByLoadLyr, highlightRouteLyr, normalRouteStopLyr, stationLyr,
            highlightRouteStopLyr] // Add the route layer to the map
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
    view.ui.add(homeBtn, "bottom-right");



    /*****************************************************************
     * The visible property on the layer can be used to toggle the
     * layer's visibility in the view. When the visibility is turned off
     * the layer is still part of the map, which means you can access
     * its properties and perform analysis even though it isn't visible.
     *******************************************************************/

    var locatorTask = new Locator({
        url: "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"
    });

    var compassWidget = new Compass({
        view: view
    });
    view.ui.add(compassWidget, "bottom-right");

    var searchWidget = new Search({
        view: view
    });
    searchWidget.startup();
    view.ui.add(searchWidget, {
        position: "top-left",
        index: 0
    });

    var searchWidget2 = new Search({
        view: view
    });
    searchWidget2.startup();
    view.ui.add(searchWidget2, {
        position: "top-left",
        index: 1
    });

    view.ui.add(document.getElementById("map_menu"),{
        position:"top-left",
        index:2
    });

    view.ui.add(document.getElementById("ladingStations_ladings"),{
        position:"bottom-left"
    });

    document.getElementById("stop_search").addEventListener("click",function () {
        $("#map_menu").slideUp("slow");
        removeAll();
    });

    document.getElementById("esri_widgets_Search_0_input").setAttribute("placeholder","出发位置");
    document.getElementById("esri_widgets_Search_1_input").setAttribute("placeholder","目的位置");

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


    // document.getElementById("baseMapSelect").addEventListener("change", baseMapSelectChange);

    // document.getElementById("load").addEventListener("click", onButtonClicked_load);

    document.getElementById("search_route").addEventListener("click", onButtonClicked_route);

    document.getElementById("station_1").addEventListener("click", onButtonClicked_station);

    document.getElementById("station_2").addEventListener("click", onButtonClicked_station);

    document.getElementById("station_3").addEventListener("click", onButtonClicked_station);

    document.getElementById("station_4").addEventListener("click", onButtonClicked_station);

    document.getElementById("station_5").addEventListener("click", onButtonClicked_station);

    document.getElementById("station_x").addEventListener("click", onButtonClicked_station);

    function onButtonClicked_station() {
        var id = this.id;
        var stationName=null;
        switch (this.value)
        {
            case 0:stationName="Texas";break;
            case 1:stationName="SanAntonio";break;
            case 2:stationName="Houston";break;
            case 3:stationName="Dallas";break;
            case 4:stationName="Austin";break;
            case 5:stationName="其他";break;
        }
        document.getElementById("ladingStationsName").innerHTML=stationName;

        //alert(id);
        var stationNum = id.substring(8);
        //alert(stationNum);

        document.getElementById("goods").innerHTML = "";

        if(stationNum.toString() != "x"){
            //alert("stationNum.toString() != 'x'");
            stationNum--;
            //alert(stationNum);
            document.getElementById("goods").innerHTML +=
                "<button class='mdl-button mdl-js-button mdl-route-button' id='welcome2station_" + stationNum.toString() + "'>Welcome to " + allStations[stationNum].SingleLine + "!</button>";

            //alert("stationNum.toString(): " + stationNum.toString());


            for(var i = 0; i < allStations[stationNum].goods.length; i++){
                //alert("stationNum.toString(): " + stationNum.toString() + ", i = " + i.toString() + " have goods");
                //var goodId = myAddressList[stationNum].goods[i].id;
                var goodIndex = i;
                //alert(goodIndex);
                var receiverAddress = allStations[stationNum].goods[i].getReceiverAddress();
                //alert(receiverAddress);
                var nowPosition = allStations[stationNum].goods[i].getNowPosition();
                //alert(nowPosition);
                document.getElementById("goods").innerHTML +=

                    "<button class='mdl-button mdl-js-button mdl-route-button' id='station_" + stationNum + "_good_" + goodIndex + "'>ID: " + goodIndex + "<br>"
                    + "receiverAddress: " + receiverAddress + "<br>"
                    + "nowPosition: " + nowPosition + "</button>";
            }

            var cell = document.getElementById("welcome2station_" + stationNum.toString());
            //alert("cell.id = " + cell.id);

            cell.onclick = function () {
                //alert("locator");
                var id = this.id;
                //alert(id);
                var num = id.substring(id.length - 1);
                //alert(num);
                locatorTask.addressToLocations(allStations[num])
                    .then(expressStation, function (error) {alert(error);});
            };

            for(var i = 0; i < allStations[stationNum].goods.length; i++){
                //alert("onclick for goods, stationNum = " + stationNum);
                var good = document.getElementById("station_" + stationNum.toString() + "_good_" + i.toString());
                //alert(good.id);
                good.onclick = function () {
                    //alert("locator");
                    var id = this.id;
                    //alert(id);
                    var num = id.substring("station_".length);
                    //alert(num);
                    var num1 = num.substring(0, 1);
                    //alert(num1);
                    var num2 = num.substring("0_good_".length, num.length);
                    //alert(num2);
                    locatorTask.addressToLocations(allStations[num1].goods[num2])//Maybe have problem SingleLine
                        .then(expressStation, function (error) {alert(error);});

                    /**
                     * findpath
                     * @type {null}
                     */


                    var idnum = allStations[num1].goods[num2].getLadingIdNum();

                    var info = null;
                    var path = new Array();
                    FindPahtByid(idnum,info,path);

                    pathInit(path);

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

                    onButtonClicked_load();


                }

            }
        }

        if(stationNum.toString() == "x"){
            //alert("stationNum.toString() == 'x'");
            /*
             document.getElementById("goods").innerHTML +=
             "<button>These goods do not belong to any station.</button>";
             */

            for(var i = 0; i < notStation.length; i++){
                var goodIndex = i;
                var receiverAddress = notStation[i].receiverAddress.SingleLine;
                var nowPosition = notStation[i].nowPosition.SingleLine;
                document.getElementById("goods").innerHTML +=

                    "<button class='mdl-button mdl-js-button mdl-route-button' id='station_x_good_" + goodIndex + "'>ID: " + goodIndex + "<br>"
                    + "receiverAddress: " + receiverAddress + "<br>"
                    + "nowPosition: " + nowPosition + "</button>";
            }

            for(var i = 0; i < notStation.length; i++){
                //alert("onclick for goods, stationNum = " + stationNum);
                var good = document.getElementById("station_x_good_" + i.toString());
                //alert(good.id);
                good.onclick = function () {
                    //alert("locator");
                    var id = this.id;
                    //alert(id);
                    var num = id.substring("station_x_good_".length);
                    //alert(num);
                    //var num1 = num.substring(0, 1);
                    //alert(num1);
                    //var num2 = num.substring("0_good_".length, num.length);
                    //alert(num2);
                    locatorTask.addressToLocations(notStation[num].nowPosition)
                        .then(expressStation, function (error) {alert(error);});
                }

            }

        }

    }

    $(".baseMap_menu_item").click(
        function(){
            var mapName=this.id;
            document.getElementById("baseMapName").innerHTML=mapName;
            map.basemap = mapName.toString();
        });

    function removeAll() {
        routeByLoadLyr.removeAll();
        highlightRouteLyr.removeAll();
        normalRouteStopLyr.removeAll();
        highlightRouteStopLyr.removeAll();
        searchResultLyr.removeAll();
        routeBySearchLyr.removeAll();
        stationLyr.removeAll();
        view.popup.close();
    }

    function onButtonClicked_route() {
        removeAll();

        if(document.getElementById("esri_widgets_Search_0_input").value.length == 0){
        }
        if(document.getElementById("esri_widgets_Search_1_input").value.length == 0){
        }
        else{
            var startAddress = {
                SingleLine: document.getElementById("esri_widgets_Search_0_input").value
            };
            var endAddress = {
                SingleLine: document.getElementById("esri_widgets_Search_1_input").value
            };

            //万一搜索无结果，removeAll该怎么办？
            searchResult.splice(0, searchResult.length);
            searchResultLyr.removeAll();
            routeBySearchLyr.removeAll();
            routeByLoadLyr.removeAll();
            normalRouteStopLyr.removeAll();

            locatorTask.addressToLocations(startAddress)
                .then(expressAddressPoint)
                .then(calRouteBySearch, function (error) {alert(error);});
            locatorTask.addressToLocations(endAddress)
                .then(expressAddressPoint)
                .then(calRouteBySearch, function (error) {alert(error);});

        }
    }

    function expressAddressPoint(response) {

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

        searchResultLyr.add(stop);
        searchResult.push(stop);

    }

    function expressStation(response) {

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

        stationLyr.add(stop);
        stationResult.push(stop);

        view.goTo(stop);

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
                routeTask.solve(routeParams).then(showRoute2).then(function () {
                    $("#map_menu").slideDown("slow");
                });

            }
        }
    }



    function onButtonClicked_load() {

        removeAll();
        allStops = Array();
        sendRoute = Array();
        stopNum = 0;
        topList = Array();
        sendRouteNum = 0;
        view.popup.close();

        function showHighlightRouteStop() {
            var stop = view.popup.selectedFeature;
            var highlightstop = new Graphic({
                geometry: stop.geometry,
                symbol: highlightStopSymbol
            });
            highlightRouteStopLyr.add(highlightstop);
        }

        function cancelShowHighlightRouteStop() {
            //alert("cancel");
            var stop = view.popup.selectedFeature;
            var highlightstop = new Graphic({
                geometry: stop.geometry,
                symbol: normalStopSymbol
            });
            highlightRouteStopLyr.add(highlightstop);
        }

        // view.popup.on("open", function(evt){
        //     showHighlightRouteStop();
        // });

        view.popup.on("trigger-action", function(evt){
            if(evt.action.id === "highlight-routestop"){
                showHighlightRouteStop();
            }
            else if(evt.action.id === "cancel-highlight-routestop"){
                cancelShowHighlightRouteStop();
            }
        });

        for (var i = 0; i < myAddressList.length; i++) {


            locatorTask.addressToLocations(myAddressList[i]).then(function (response) {


                //异步执行地理编码，会导致点数组的顺序混乱，通过规定地址格式，并且与地理编码的地址比较，
                //使其结果顺序存储，以便路径绘制
                for(var j = 0; j < myAddressList.length; j++){

                    var match = response[0].address.indexOf(myAddressList[j].SingleLine);

                    if(match >= 0){


                        // Defines an action to zoom out from the selected feature
                        var highlightRouteStop = {
                            // This text is displayed as a tooltip
                            title: "高亮",
                            // The ID by which to reference the action in the event handler
                            id: "highlight-routestop",
                            // Sets the icon font used to style the action button
                            className: "esri-icon-environment-settings"
                        };
                        var cancelHighlightRouteStop = {
                            // This text is displayed as a tooltip
                            title: "取消高亮",
                            // The ID by which to reference the action in the event handler
                            id: "cancel-highlight-routestop",
                            // Sets the icon font used to style the action button
                            className: "esri-icon-environment-settings"
                        };
                        var template = new PopupTemplate({
                            title: "Location",
                            content: "<p><b>" + response[0].address + "</b></p>" +
                            "<ul><li>courierNum: " + myAddressList[j].courierNum + "</li>" +
                            "<li>goodsNum: " + myAddressList[j].goodsNum + "</li>" +
                            "<li>goodsWeigh: " + myAddressList[j].goodsWeigh + "</li><ul>"
                        });

                        // Adds the custom action to the PopupTemplate.
                        template.actions.push(highlightRouteStop);
                        template.actions.push(cancelHighlightRouteStop);

                        var stop = new Graphic({
                            attributes: {
                                "address": response[0].address,
                                "courierNum": myAddressList[j].courierNum,
                                "goodsNum": myAddressList[j].goodsNum,
                                "goodsWeigh": myAddressList[j].goodsWeigh
                            },
                            geometry: response[0].location,
                            popupTemplate: template,
                            symbol: normalStopSymbol
                        });

                        // This event fires for each click on any action
                        // Notice this event is handled on the default popup of the View
                        // NOT on an instance of PopupTemplate


                        /*
                         stop.onclick = function () {
                         stop.symbol = highlightRouteSymbol;
                         };
                         */


                        /*
                         stop.symbol.height = ( 2 * myAddressList[j].courierNum).toString() + "px";
                         stop.symbol.width = ( 2 * myAddressList[j].courierNum).toString() + "px";
                         */

                        normalRouteStopLyr.add(stop);

                        allStops[j] = stop;
                        /**allStops' SpatialRference wkid = 4326
                         *
                         */

                        stopList.push(stopNum);
                        stopNum++;

                        break;
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

            if (routeParams.stops.features.length >= 2) {
                routeTask.solve(routeParams).then(showRoute);
            }
        }

    }

    var showRouteNum = 0;

    function showRoute(data) {
        showRouteNum++;
        var routeResult = data.routeResults[0].route;
        routeResult.symbol = routeSymbol;
        routeByLoadLyr.add(routeResult);

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

        var stopPoint0 = webMercatorUtils.webMercatorToGeographic(stops[0].geometry);
        var stopPoint1 = webMercatorUtils.webMercatorToGeographic(stops[1].geometry);


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

            if (startX1 == startX2 && startY1 == startY2) {
                sendRouteNum++;
                sendRoute[i].directions = data.routeResults[0].directions;
                sendRoute[i].totalLength = totalLength;
                sendRoute[i].totalTime = totalTime;
                sendRoute[i].text = text;
                sendRoute[i].length = length;
                sendRoute[i].time = time;
                sendRoute[i].totalGraphic = routeResult;
                sendRoute[i].segments = features;
            }
        }

        if(sendRouteNum == myAddressList.length - 1) {

            routeParams.stops.features.splice(0, routeParams.stops.features.length);
            for(var i = 0; i < allStops.length; i++){
                routeParams.stops.features.push(allStops[i]);
            }
            if (routeParams.stops.features.length >= 2) {
                routeTask.solve(routeParams).then(showExtent);
            }

            document.getElementById("test").innerHTML = "";
            //alert("print all !");
            //alert("showRouteNum = " + showRouteNum.toString() + "\n" + "sendRouteNum = " + sendRouteNum.toString());
            //document.getElementById("test").innerHTML += "<ul id='routeDirection'>";
            for(var i = 0; i < sendRouteNum; i++){

                document.getElementById("test").innerHTML +=

                    "<button class='mdl-button mdl-js-button mdl-route-button' id='direPoint2Point_" + i.toString() + "'>From " + sendRoute[i].startAddress.text + " to " + sendRoute[i].endAddress.text +
                    "<br>( " + Math.round(sendRoute[i].totalLength * 1000) / 1000 + " miles, "
                    + Math.round(sendRoute[i].totalTime * 1000) / 1000 + " minutes )</button>";

                for (var j = 0; j < sendRoute[i].text.length; j++) {

                    if(j == 0){
                        var start = sendRoute[i].text[j].replace(/Location 1/, sendRoute[i].startAddress.text);
                        document.getElementById("test").innerHTML +=
                            "<button class='mdl-button mdl-js-button mdl-route-button' id='direPoint2Point_" + i.toString() + "_Segment_" + j.toString() + "'>"
                            + start + "</button>";
                    }
                    else if(j == sendRoute[i].text.length - 1){
                        var end = sendRoute[i].text[j].replace(/Location 2/, sendRoute[i].endAddress.text);
                        document.getElementById("test").innerHTML +=
                            "<button class='mdl-button mdl-js-button mdl-route-button' id='direPoint2Point_" + i.toString() + "_Segment_" + j.toString() + "'>"
                            + end + "</button>";
                    }
                    else{
                        document.getElementById("test").innerHTML +=
                            "<button class='mdl-button mdl-js-button mdl-route-button' id='direPoint2Point_" + i.toString() + "_Segment_" + j.toString() + "'>"
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
                    var pointsNum = totalRoute.geometry.paths[0].length;
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

                        if(num2 == 0){
                            var stop = allStops[num1];
                            var highlightstop = new Graphic({
                                geometry: stop.geometry,
                                symbol: highlightStopSymbol
                            });
                            highlightRouteStopLyr.add(highlightstop);
                        }
                        else if(num2 == sendRoute[num1].segments.length - 1){
                            var stop = allStops[++num1];
                            var highlightstop = new Graphic({
                                geometry: stop.geometry,
                                symbol: highlightStopSymbol
                            });
                            highlightRouteStopLyr.add(highlightstop);
                        }

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

        routeParams.stops.features.splice(0, routeParams.stops.features.length);
        for(var i = 0; i < searchResult.length; i++){
            routeParams.stops.features.push(searchResult[i]);
        }
        if (routeParams.stops.features.length >= 2) {
            routeTask.solve(routeParams).then(showExtent);
        }

        document.getElementById("test").innerHTML = "";

        var address0 = searchResult[0].getAttribute("address");
        var address1 = searchResult[1].getAttribute("address");

        document.getElementById("test").innerHTML +=
            "<button class='mdl-button mdl-js-button mdl-route-button' id='singleRoute'>From " + address0 + " to " + address1 +
            "<br>( " + Math.round(totalLength * 1000) / 1000 + " miles, "
            + Math.round(totalTime * 1000) / 1000 + " minutes )</button>";

        for (var j = 0; j < text.length; j++) {
            if(j == 0){
                var start = text[j].replace(/Location 1/, address0);
                document.getElementById("test").innerHTML +=
                    "<button class='mdl-button mdl-js-button mdl-route-button' id='Segment_" + j.toString() + "'>" + start + "</button>";
            }
            else if(j == text.length - 1){
                var end = text[j].replace(/Location 2/, address1);
                document.getElementById("test").innerHTML +=
                    "<button class='mdl-button mdl-js-button mdl-route-button' id='Segment_" + j.toString() + "'>" + end + "</button>";
            }
            else{
                document.getElementById("test").innerHTML +=
                    "<button class='mdl-button mdl-js-button mdl-route-button' id='Segment_" + j.toString() + "'>"
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
                var totalRoute = singleRoute.totalGraphic;
                view.goTo(totalRoute);
                var highlightRouteResult = totalRoute;
                highlightRouteResult.symbol= highlightRouteSymbol;
                highlightRouteLyr.add(highlightRouteResult);
                var pointsNum = totalRoute.geometry.paths[0].length;
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
                if(num == 0 || num == singleRoute.segments.length - 1){
                    view.popup.open({
                        // Set the popup's title to the coordinates of the location
                        title: "Segment " + num.toString(),
                        content: document.getElementById(id).innerHTML,
                        location: {
                            x: routeSegment.geometry.getPoint(0, Math.round(pointsNum/2)).x,
                            /**
                             * how much offset of y ?
                             * 直接写+ 数值 会随着地图缩放而产生偏差
                             */
                            y: routeSegment.geometry.getPoint(0, Math.round(pointsNum/2)).y,
                        },
                        visible: true
                    });
                }
                else{
                    view.popup.open({
                        // Set the popup's title to the coordinates of the location
                        title: "Segment " + num.toString(),
                        content: document.getElementById(id).innerHTML,
                        location: routeSegment.geometry.getPoint(0, Math.round(pointsNum/2)),
                        visible: true
                    });
                }

                if(num == 0){
                    var stop = searchResult[0];
                    var highlightstop = new Graphic({
                        geometry: stop.geometry,
                        symbol: highlightStopSymbol
                    });
                    highlightRouteStopLyr.add(highlightstop);
                }
                else if(num == singleRoute.segments.length - 1){
                    var stop = searchResult[1];
                    var highlightstop = new Graphic({
                        geometry: stop.geometry,
                        symbol: highlightStopSymbol
                    });
                    highlightRouteStopLyr.add(highlightstop);
                }
            };
        }
    }

    function showExtent(data) {

        var totalExtent = data.routeResults[0].route;
        view.goTo(totalExtent);
    }

});
