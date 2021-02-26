var flatpickr;
flatpickr.l10ns.default.firstDayOfWeek = 1;
var currentPage = 1;
var url = new URL(window.location.href);
if (url.searchParams.get('page')) {
    currentPage = parseInt(url.searchParams.get('page'));
}
var data = [];
var currentData = [];
var allEventDates = [];
fetch('assets/data/mock_data2019.json')
    .then(function (response) {
    return response.json();
})
    .then(function (myJson) {
    var dateTime;
    var t;
    for (t = 0; t < myJson.length; t++) {
        dateTime = new Date(myJson[t].date + ' ' + myJson[t].time);
        myJson[t].dateTime = dateTime;
    }
    myJson.sort(function (a, b) {
        var c = a.dateTime;
        var d = b.dateTime;
        return c - d;
    });
    data = myJson;
    currentData = myJson;
    var minDateF = currentData[0].dateTime;
    var maxDateF = currentData[currentData.length - 1].dateTime;
    var filterMinDate = minDateF;
    var filterMaxDate = maxDateF;
    var itemsPerPage = 6;
    var totalPages = Math.ceil(currentData.length / itemsPerPage);
    var currentPageItems = [];
    window.history.pushState({ page: currentPage }, "title " + currentPage, "?page=" + currentPage);
    function paginate(currentData, itemsPerPage, currentPage) {
        currentPageItems = currentData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
        var currentPageDOM = '';
        var i;
        for (i = 0; i < currentPageItems.length; i++) {
            var imgURL = (currentPageItems[i].lead_image == null) ? "assets/img/placeholder.svg" : currentPageItems[i].lead_image;
            currentPageDOM += '<div class="col-6 col-sm-6 col-md-4 item"><a href="#"><div class="date">' + new Date(currentPageItems[i].dateTime).toLocaleDateString('lv-LV', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'utc' }) +
                '</div><div class="img-ct"><img loading="lazy" src="' + imgURL +
                '" alt="' + currentPageItems[i].title + '"></div><div class="category"><span>' + currentPageItems[i].type
                + '</span></div><h3>' + currentPageItems[i].title + '</h3></a></div>';
        }
        document.getElementById("item_list").innerHTML = currentPageDOM;
        document.querySelectorAll('.item > a').forEach(function (item) {
            item.addEventListener('click', function (event) {
                event.preventDefault();
            });
        });
    }
    var prevPageBtn = document.querySelector('.pager.prev');
    var nextPageBtn = document.querySelector('.pager.next');
    var setPage = function (currentPage, currentData) {
        window.scrollTo(0, 0);
        totalPages = Math.ceil(currentData.length / itemsPerPage);
        document.querySelector('#total_pages').innerHTML = totalPages.toString();
        if (currentPage <= 1) {
            currentPage = 1;
            prevPageBtn.classList.add("disabled");
        }
        else {
            prevPageBtn.classList.remove("disabled");
        }
        if (currentPage >= totalPages) {
            currentPage = totalPages;
            nextPageBtn.classList.add("disabled");
        }
        else {
            nextPageBtn.classList.remove("disabled");
        }
        document.querySelector('#current_page').innerHTML = currentPage.toString();
        paginate(currentData, itemsPerPage, currentPage);
    };
    prevPageBtn.addEventListener('click', function (e) {
        currentPage = currentPage - 1;
        window.history.pushState({ page: currentPage }, "title " + currentPage, "?page=" + currentPage);
        setPage(currentPage, currentData);
    });
    nextPageBtn.addEventListener('click', function (e) {
        currentPage = currentPage + 1;
        window.history.pushState({ page: currentPage }, "title " + currentPage, "?page=" + currentPage);
        setPage(currentPage, currentData);
    });
    setPage(currentPage, currentData);
    window.addEventListener('popstate', function (event) {
        currentPage = event.state.page;
        setPage(currentPage, currentData);
    });
    function addHoursToDate(date, hours) {
        return new Date(new Date(date).setHours(date.getHours() + hours));
    }
    var d;
    for (d = 0; d < currentData.length; d++) {
        allEventDates.push(Date.parse(currentData[d].date));
    }
    var dateRangeFilter = flatpickr("#datepicker", {
        mode: "range",
        locale: "lv",
        minDate: minDateF,
        maxDate: maxDateF,
        disableMobile: "true",
        onDayCreate: function (dObj, dStr, fp, dayElem) {
            if (allEventDates.indexOf(+dayElem.dateObj) !== -1) {
                dayElem.className += " has-event";
            }
        },
        onClose: function (selectedDates, dateStr, instance) {
            console.log(selectedDates[0], selectedDates[1]);
            filterMinDate = new Date(selectedDates[0]);
            filterMaxDate = new Date(selectedDates[1]);
            filterMaxDate = addHoursToDate(filterMaxDate, 24);
            document.querySelectorAll('#type_filters input[type="checkbox"]').forEach(function (checkbox) {
                var input = document.getElementById(checkbox.id);
                epicFilteringFn(event, input);
            });
        }
    });
    function buildFiltersDOM(currentData) {
        var typeValues = [];
        typeValues = currentData.map(function (value) { return value.type; }).filter(function (value, index, _arr) { return _arr.indexOf(value) == index; });
        typeValues.unshift("Visas tēmas");
        var categoryFiltersDOM = '';
        var i;
        for (i = 0; i < typeValues.length; i++) {
            categoryFiltersDOM += '<div class="form-check py-1"><input class="form-check-input" type="checkbox" value="' + typeValues[i] + '" id="' + typeValues[i] + '"><label class="form-check-label" for="' + typeValues[i] + '">' + typeValues[i] + '</label></div>';
        }
        document.getElementById("type_filters").innerHTML = categoryFiltersDOM;
    }
    buildFiltersDOM(data);
    function epicFilteringFn(event, input) {
        var filteredArray = [];
        var activeFilters = [];
        var checkedFilters;
        currentPage = 1;
        if (input.value == "Visas tēmas") {
            if (input.checked) {
                currentData = data;
                currentData = currentData.filter(function (_item) {
                    var dateTime = _item.dateTime;
                    return (dateTime >= filterMinDate && dateTime <= filterMaxDate);
                });
                setPage(currentPage, currentData);
                window.history.pushState({ page: currentPage }, "title " + currentPage, "?page=" + currentPage);
                filteredArray = [];
                var j;
                for (j = 1; j < allCheckboxes.length; j++) {
                    allCheckboxes[j].checked = false;
                }
            }
        }
        else {
            if (document.querySelectorAll('#type_filters input[type="checkbox"]:checked').length <= 0) {
                currentData = data;
                currentData = currentData.filter(function (_item) {
                    var dateTime = _item.dateTime;
                    return (dateTime >= filterMinDate && dateTime <= filterMaxDate);
                });
                setPage(currentPage, currentData);
                window.history.pushState({ page: currentPage }, "title " + currentPage, "?page=" + currentPage);
            }
            else {
                allCheckboxes[0].checked = false;
                checkedFilters = document.querySelectorAll('#type_filters input[type="checkbox"]:checked');
                var i = 0;
                checkedFilters.forEach(function (checkbox) {
                    if (i < checkedFilters.length) {
                        var input = document.getElementById(checkbox.id);
                        activeFilters.push(input.value);
                        filteredArray = filteredArray.concat(data.filter(function (_item) { return _item.type.indexOf(input.value) > -1; }));
                    }
                    if (i + 1 == checkedFilters.length) {
                        filteredArray.sort(function (a, b) {
                            var c = a.dateTime;
                            var d = b.dateTime;
                            return c - d;
                        });
                        currentData = filteredArray.filter(function (_item) {
                            var dateTime = _item.dateTime;
                            return (dateTime >= filterMinDate && dateTime <= filterMaxDate);
                        });
                        setPage(currentPage, currentData);
                        window.history.pushState({ page: currentPage }, "title " + currentPage, "?page=" + currentPage);
                    }
                    i++;
                });
            }
        }
    }
    var allCheckboxes = document.querySelectorAll('#type_filters input[type="checkbox"]');
    allCheckboxes[0].checked = true;
    document.querySelectorAll('#type_filters input[type="checkbox"]').forEach(function (checkbox) {
        var input = document.getElementById(checkbox.id);
        input.addEventListener('change', function (event) {
            epicFilteringFn(event, input);
        });
    });
    document.getElementById("loading").classList.add("loaded");
    setTimeout(function () {
        document.getElementById("loading").remove();
    }, 1000);
    var mobSidebarToggle = document.getElementById("menu-button");
    mobSidebarToggle.addEventListener('click', function (e) {
        mobSidebarToggle.classList.toggle("opened");
        document.getElementById("sidebar_filter").classList.toggle("opened");
        document.getElementsByTagName("BODY")[0].classList.toggle("noscroll");
    });
});
