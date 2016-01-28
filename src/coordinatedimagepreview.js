/* 
 Created on : Jan 19, 2016
 Author     : yeozkaya@gmail.com
 */
;
(function ($) {

    var options = {
        imageServiceAddress: "http://yourImageSearchAddress",
        openButtonTitle: "Show Pictures",
        closeButtonTitle: "Hide Pictures",
        limit: 10,
        isOpen: false
    };

    var coordinatedImagePreviewControlTempMarker;
    var lastImages;

    function CoordinatedImagePreviewControl(item, userDefinedOptions) {

        var keys = Object.keys(userDefinedOptions);

        for (var i = 0; i < keys.length; i++) {
            options[keys[i]] = userDefinedOptions[keys[i]];
        }
        this.item = $(item);
        this.init();
    }

    CoordinatedImagePreviewControl.prototype = {
        init: function () {
            init(this.item);
        }
    };

    $.fn.CoordinatedImagePreviewControl = function (userDefinedOptions) {

        var args = Array.prototype.slice.call(arguments, 1);
        return this.each(function () {
            var item = $(this), instance = item.data('CoordinatedImagePreviewControl');
            if (!instance) {
                item.data('CoordinatedImagePreviewControl', new CoordinatedImagePreviewControl(this, userDefinedOptions));
            } else {
                if (typeof userDefinedOptions === 'string') {
                    instance[userDefinedOptions].apply(instance, args);
                }
            }
        });
    };

    function init(item) {

        var element = item;
        element.addClass("coordinatedImagePreviewControlContainer");
        element.append('<input id="coordinatedImagePreviewControlOpenButton" class="coordinatedImagePreviewControlButton" type="image" src="./image/open.png" alt="Submit" title="' + options.openButtonTitle + '">');

        var parent = $("#map").parent();
        parent.append('<div id="coordinatedImagePreviewControlMainDiv" class="coordinatedImagePreviewControlMainDiv content horizontal-images"><ul id="coordinatedImagePreviewControlListUl" class="coordinatedImagePreviewControlUl"></ul></div>');

        $('#coordinatedImagePreviewControlMainDiv').append('<input id="coordinatedImagePreviewControlCloseButton" class="coordinatedImagePreviewControlButton" type="image" src="./image/close.png" alt="Submit" title="' + options.closeButtonTitle + '">');

        $("#coordinatedImagePreviewControlOpenButton").click(function () {
            $("#coordinatedImagePreviewControlMainDiv")[0].style.visibility = "visible";
            map.on('moveend', CoordinatedImagePreviewControlMoveEndFunction);
            $("#coordinatedImagePreviewControlMenuImage").addClass("coordinatedImagePreviewControlCloseMenuImage");
            $("#coordinatedImagePreviewControlMenuImage").removeClass("coordinatedImagePreviewControlOpenMenuImage");
            $("#coordinatedImagePreviewControlOpenButton")[0].style.visibility = "hidden";
            queryPictures();
        });

        $("#coordinatedImagePreviewControlCloseButton").click(function () {
            $("#coordinatedImagePreviewControlMainDiv")[0].style.visibility = "hidden";
            map.off('moveend', CoordinatedImagePreviewControlMoveEndFunction);
            $("#coordinatedImagePreviewControlMenuImage").removeClass("coordinatedImagePreviewControlCloseMenuImage");
            $("#coordinatedImagePreviewControlMenuImage").addClass("coordinatedImagePreviewControlOpenMenuImage");
            $("#coordinatedImagePreviewControlOpenButton")[0].style.visibility = "visible";
        });

        if (options.isOpen) {
            $("#coordinatedImagePreviewControlOpenButton")[0].click();
        }

    }

    var CoordinatedImagePreviewControlMoveEndFunction = function () {
        queryPictures();
    };

    function queryPictures() {
        var center = map.getCenter();
        var bounds = map.getBounds();

        $.ajax({
            url: options.imageServiceAddress,
            type: 'GET',
            data:
                    {
                        lng: center.lng,
                        lat: center.lat,
                        minx: bounds._southWest.lng,
                        miny: bounds._southWest.lat,
                        maxx: bounds._northEast.lng,
                        maxy: bounds._northEast.lat,
                        limit: options.limit
                    },
            dataType: 'json',
            success: function (featureCollection) {
                $("#coordinatedImagePreviewControlListUl").empty();
                lastImages = featureCollection.features;
                for (var i = 0; i < lastImages.length; i++) {
                    var imgHtml = '<li id="coordinatedImagePreviewControlLi' + i + '" class="coordinatedImagePreviewControlLi"><a class="example-image-link" href="' + lastImages[i].properties.imageLink + '" data-lightbox="example-set" data-title="' + lastImages[i].properties.description + '"><img width="150" height="100" class="example-image" src="' + lastImages[i].properties.thumbnailLink + '" alt=""/></a></li>';

                    $("#coordinatedImagePreviewControlListUl").append(imgHtml);

                    $("#coordinatedImagePreviewControlLi" + i).mouseenter(function () {
                        imageListElementMouseEnter(this);
                    });

                    $("#coordinatedImagePreviewControlLi" + i).mouseleave(function () {
                        imageListElementMouseLeave(this);
                    });

                    $("#coordinatedImagePreviewControlLi" + i).mousedown(function () {
                        imageListElementMouseDown(this);
                    });
                }

            }
        });
    }

    function imageListElementMouseEnter(imageListElement) {
        var index = parseInt(imageListElement.id.substr(32));
        addTempMarker(lastImages[index]);
    }

    function imageListElementMouseLeave() {
        map.removeLayer(coordinatedImagePreviewControlTempMarker);
    }


    function imageListElementMouseDown(imageListElement) {
        var index = parseInt(imageListElement.id.substr(32));

        lastImages[index].id;
    }

    function addTempMarker(data) {
        if (coordinatedImagePreviewControlTempMarker !== undefined) {
            map.removeLayer(coordinatedImagePreviewControlTempMarker);
            coordinatedImagePreviewControlTempMarker = undefined;
        }
        coordinatedImagePreviewControlTempMarker = L.geoJson(data, {
            pointToLayer: function (feature, latlng) {
                return L.marker(latlng, {bounceOnAdd: true, bounceOnAddOptions: {duration: 500, height: 100}});
            },
            onEachFeature: function (feature, layer) {
                layer.bindLabel(feature.properties.title, {noHide: true, direction: 'auto'}).addTo(map);
            }
        }).addTo(map);
    }
})(jQuery);