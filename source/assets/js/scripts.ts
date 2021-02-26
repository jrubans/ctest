let flatpickr: any;
flatpickr.l10ns.default.firstDayOfWeek = 1;




// JSON PARSING
let currentPage: number = 1;
let url = new URL(window.location.href);
if (url.searchParams.get('page')) {
	currentPage = parseInt(url.searchParams.get('page'));
}
let data: any = []
let currentData: any = []
let allEventDates: any = []
fetch('assets/data/mock_data2019.json')
.then(function(response) {
	return response.json();
})
.then(function(myJson) {
	let dateTime: any;
	var t;
	for (t = 0; t < myJson.length; t++) {
		dateTime = new Date(myJson[t].date + ' ' + myJson[t].time);
		myJson[t].dateTime = dateTime;
	}
	myJson.sort(function(a,b){
		var c: any = a.dateTime;
		var d: any = b.dateTime;
		return c-d;
	});
	data=myJson
	currentData=myJson




// FLATPICKR DATE RANGE DEFINITION
let minDateF: any = currentData[0].dateTime;
let maxDateF: any = currentData[currentData.length -1].dateTime;
let filterMinDate: any = minDateF;
let filterMaxDate: any = maxDateF;




// PAGINATION
let itemsPerPage: number = 6;
let totalPages: number = Math.ceil(currentData.length / itemsPerPage);




// PAGINATE JSON ARRAY AND BUILD PAGE DOM
let currentPageItems: any = [];
window.history.pushState({page: currentPage}, "title " + currentPage, "?page=" + currentPage);
function paginate(currentData, itemsPerPage, currentPage) {
	currentPageItems = currentData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
	let currentPageDOM: string = '';
	var i;
	for (i = 0; i < currentPageItems.length; i++) {
		var imgURL = (currentPageItems[i].lead_image == null) ? "assets/img/placeholder.svg" : currentPageItems[i].lead_image;
		currentPageDOM += '<div class="col-6 col-sm-6 col-md-4 item"><a href="#"><div class="date">' + new Date(currentPageItems[i].dateTime).toLocaleDateString('lv-LV', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'utc'}) +
		'</div><div class="img-ct"><img loading="lazy" src="' + imgURL + 
		'" alt="' + currentPageItems[i].title + '"></div><div class="category"><span>' + currentPageItems[i].type 
		+ '</span></div><h3>' + currentPageItems[i].title + '</h3></a></div>';
	}
	document.getElementById("item_list").innerHTML = currentPageDOM;
	document.querySelectorAll('.item > a').forEach(item => {
		item.addEventListener('click', event => {
			event.preventDefault();
		});
	});
}





// DEALING WITH PAGE NAVIGATION
let prevPageBtn = document.querySelector('.pager.prev');
let nextPageBtn = document.querySelector('.pager.next');
var setPage = function(currentPage, currentData) {
	window.scrollTo(0, 0);
	totalPages = Math.ceil(currentData.length / itemsPerPage);
	document.querySelector('#total_pages').innerHTML = totalPages.toString();

	if (currentPage <= 1) {
		currentPage = 1;
		prevPageBtn.classList.add("disabled")
	} else {
		prevPageBtn.classList.remove("disabled")
	}
	if (currentPage >= totalPages) {
		currentPage = totalPages;
		nextPageBtn.classList.add("disabled")
	} else {
		nextPageBtn.classList.remove("disabled")
	}
	document.querySelector('#current_page').innerHTML = currentPage.toString();
	paginate(currentData, itemsPerPage, currentPage);
}
prevPageBtn.addEventListener('click', e => {
	currentPage = currentPage - 1
	window.history.pushState({page: currentPage}, "title " + currentPage, "?page=" + currentPage);
	setPage(currentPage, currentData);
	
});
nextPageBtn.addEventListener('click', e => {
	currentPage = currentPage + 1
	window.history.pushState({page: currentPage}, "title " + currentPage, "?page=" + currentPage);
	setPage(currentPage, currentData);
});
setPage(currentPage, currentData);
window.addEventListener('popstate', (event) => {
	currentPage = event.state.page;
	setPage(currentPage, currentData);
});





// DATEPICKER
function addHoursToDate(date: Date, hours: number): Date {
  return new Date(new Date(date).setHours(date.getHours() + hours));
}

var d;
for (d = 0; d < currentData.length; d++) {
	allEventDates.push(currentData[d].dateTime);
}

const dateRangeFilter = flatpickr("#datepicker", {
	mode: "range",
	locale: "lv",
	minDate: minDateF,
	maxDate: maxDateF,
	defaultDate: minDateF,
	disableMobile: "true",
	onDayCreate: function(dObj, dStr, fp, dayElem) {
		if (allEventDates.indexOf(+dayElem.dateObj) !== -1) {
			dayElem.className += " has-event";
		}
	},
	onClose: function(selectedDates, dateStr, instance){
		console.log(selectedDates[0], selectedDates[1]);
		filterMinDate = new Date(selectedDates[0]);
		filterMaxDate = new Date(selectedDates[1]);
		filterMaxDate = addHoursToDate(filterMaxDate,24)
document.querySelectorAll('#type_filters input[type="checkbox"]').forEach(checkbox => {
	let input: any = document.getElementById(checkbox.id);
epicFilteringFn(event, input);
});
	}
});







// BUILD POST FILTER DOM FROM ARRAY
function buildFiltersDOM(currentData) {
	let typeValues: any = [];
	typeValues = currentData.map( (value) => value.type).filter( (value, index, _arr) => _arr.indexOf(value) == index);
	typeValues.unshift("Visas tēmas")
	let categoryFiltersDOM: string = '';
	var i;
	for (i = 0; i < typeValues.length; i++) {
		categoryFiltersDOM += '<div class="form-check py-1"><input class="form-check-input" type="checkbox" value="' + typeValues[i] + '" id="' + typeValues[i] + '"><label class="form-check-label" for="' + typeValues[i] + '">' + typeValues[i] + '</label></div>';
	}
	document.getElementById("type_filters").innerHTML = categoryFiltersDOM;
}
buildFiltersDOM(data);





// EPIC FILTERING FUNCTION
function epicFilteringFn(event, input) {
	let filteredArray: any = [];
	let activeFilters: any = [];
	let checkedFilters: any;
	currentPage = 1;
	if (input.value == "Visas tēmas") {
		if (input.checked) {
			currentData = data;
			currentData = currentData.filter(_item => {
				var dateTime = _item.dateTime;
				return (dateTime >= filterMinDate && dateTime <= filterMaxDate);
			});
			setPage(currentPage, currentData);
			window.history.pushState({page: currentPage}, "title " + currentPage, "?page=" + currentPage);
			filteredArray = [];
			var j;
			for (j = 1; j < allCheckboxes.length; j++) {
				allCheckboxes[j].checked = false;
			}
		}
	} else {
		if (document.querySelectorAll('#type_filters input[type="checkbox"]:checked').length <= 0) {
			currentData = data;
			currentData = currentData.filter(_item => {
				var dateTime = _item.dateTime;
				return (dateTime >= filterMinDate && dateTime <= filterMaxDate);
			});
			setPage(currentPage, currentData);
			window.history.pushState({page: currentPage}, "title " + currentPage, "?page=" + currentPage);
		} else {
			allCheckboxes[0].checked = false;
			checkedFilters = document.querySelectorAll('#type_filters input[type="checkbox"]:checked');
			var i = 0;
			checkedFilters.forEach(checkbox => {
				if (i < checkedFilters.length) {
					var input: any = document.getElementById(checkbox.id);
					activeFilters.push(input.value);
					filteredArray = filteredArray.concat(data.filter(_item => _item.type.indexOf(input.value) > -1))
				}
				if (i+1 == checkedFilters.length) {
					filteredArray.sort(function(a,b){
						var c: any = a.dateTime;
						var d: any = b.dateTime;
						return c-d;
					});
					currentData = filteredArray.filter(_item => {
			var dateTime = _item.dateTime;
			return (dateTime >= filterMinDate && dateTime <= filterMaxDate);
		});
					setPage(currentPage, currentData);
					window.history.pushState({page: currentPage}, "title " + currentPage, "?page=" + currentPage);
				}
				i++;
			});
		}
	}
}






// ATTACH FILTERING FUNCTIONALITY TO SIDEBAR CHECKBOXES
let allCheckboxes: any = document.querySelectorAll('#type_filters input[type="checkbox"]');
allCheckboxes[0].checked = true;
document.querySelectorAll('#type_filters input[type="checkbox"]').forEach(checkbox => {
	let input: any = document.getElementById(checkbox.id);
	input.addEventListener('change', event => {
		epicFilteringFn(event, input);
	});
});






// LOADING SCREEN IN CASE TESTING WITH 3G SPEEDS
document.getElementById("loading").classList.add("loaded");
setTimeout(function(){ 
	document.getElementById("loading").remove();
}, 1000);




// MOBILE FILTER MENU TOGGLE
let mobSidebarToggle: any = document.getElementById("menu-button");
mobSidebarToggle.addEventListener('click', e => {
	mobSidebarToggle.classList.toggle("opened");
	document.getElementById("sidebar_filter").classList.toggle("opened");
	document.getElementsByTagName("BODY")[0].classList.toggle("noscroll");

});


});