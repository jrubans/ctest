var flatpickr;flatpickr.l10ns.default.firstDayOfWeek=1;var currentPage=1,url=new URL(window.location.href);url.searchParams.get("page")&&(currentPage=parseInt(url.searchParams.get("page")));var data=[],currentData=[],allEventDates=[];fetch("assets/data/mock_data2019.json").then((function(e){return e.json()})).then((function(e){var t,a;for(a=0;a<e.length;a++)t=new Date(e[a].date+" "+e[a].time),e[a].dateTime=t;e.sort((function(e,t){return e.dateTime-t.dateTime})),data=e;var r=(currentData=e)[0].dateTime,n=currentData[currentData.length-1].dateTime,c=r,i=n,l=Math.ceil(currentData.length/6),u=[];window.history.pushState({page:currentPage},"title "+currentPage,"?page="+currentPage);var o,d=document.querySelector(".pager.prev"),s=document.querySelector(".pager.next"),g=function(e,t){window.scrollTo(0,0),l=Math.ceil(t.length/6),document.querySelector("#total_pages").innerHTML=l.toString(),e<=1?(e=1,d.classList.add("disabled")):d.classList.remove("disabled"),e>=l?(e=l,s.classList.add("disabled")):s.classList.remove("disabled"),document.querySelector("#current_page").innerHTML=e.toString(),function(e,t,a){u=e.slice((a-1)*t,a*t);var r,n="";for(r=0;r<u.length;r++){var c=null==u[r].lead_image?"assets/img/placeholder.svg":u[r].lead_image;n+='<div class="col-6 col-sm-6 col-md-4 item"><a href="#"><div class="date">'+new Date(u[r].dateTime).toLocaleDateString("lv-LV",{year:"numeric",month:"long",day:"numeric",timeZone:"utc"})+'</div><div class="img-ct"><img loading="lazy" src="'+c+'" alt="'+u[r].title+'"></div><div class="category"><span>'+u[r].type+"</span></div><h3>"+u[r].title+"</h3></a></div>"}document.getElementById("item_list").innerHTML=n,document.querySelectorAll(".item > a").forEach((function(e){e.addEventListener("click",(function(e){e.preventDefault()}))}))}(t,6,e)};for(d.addEventListener("click",(function(e){currentPage-=1,window.history.pushState({page:currentPage},"title "+currentPage,"?page="+currentPage),g(currentPage,currentData)})),s.addEventListener("click",(function(e){currentPage+=1,window.history.pushState({page:currentPage},"title "+currentPage,"?page="+currentPage),g(currentPage,currentData)})),g(currentPage,currentData),window.addEventListener("popstate",(function(e){currentPage=e.state.page,g(currentPage,currentData)})),o=0;o<currentData.length;o++)allEventDates.push(Date.parse(currentData[o].date));flatpickr("#datepicker",{mode:"range",locale:"lv",minDate:r,maxDate:n,disableMobile:"true",onDayCreate:function(e,t,a,r){-1!==allEventDates.indexOf(+r.dateObj)&&(r.className+=" has-event")},onClose:function(e,t,a){var r,n;console.log(e[0],e[1]),c=new Date(e[0]),i=new Date(e[1]),r=i,n=24,i=new Date(new Date(r).setHours(r.getHours()+n)),document.querySelectorAll('#type_filters input[type="checkbox"]').forEach((function(e){var t=document.getElementById(e.id);m(event,t)}))}});function m(e,t){var a,r,n=[],l=[];if(currentPage=1,"Visas tēmas"==t.value){if(t.checked)for(currentData=(currentData=data).filter((function(e){var t=e.dateTime;return t>=c&&t<=i})),g(currentPage,currentData),window.history.pushState({page:currentPage},"title "+currentPage,"?page="+currentPage),n=[],r=1;r<f.length;r++)f[r].checked=!1}else if(document.querySelectorAll('#type_filters input[type="checkbox"]:checked').length<=0)currentData=(currentData=data).filter((function(e){var t=e.dateTime;return t>=c&&t<=i})),g(currentPage,currentData),window.history.pushState({page:currentPage},"title "+currentPage,"?page="+currentPage);else{f[0].checked=!1,a=document.querySelectorAll('#type_filters input[type="checkbox"]:checked');var u=0;a.forEach((function(e){if(u<a.length){var t=document.getElementById(e.id);l.push(t.value),n=n.concat(data.filter((function(e){return e.type.indexOf(t.value)>-1})))}u+1==a.length&&(n.sort((function(e,t){return e.dateTime-t.dateTime})),currentData=n.filter((function(e){var t=e.dateTime;return t>=c&&t<=i})),g(currentPage,currentData),window.history.pushState({page:currentPage},"title "+currentPage,"?page="+currentPage)),u++}))}}!function(e){var t=[];(t=e.map((function(e){return e.type})).filter((function(e,t,a){return a.indexOf(e)==t}))).unshift("Visas tēmas");var a,r="";for(a=0;a<t.length;a++)r+='<div class="form-check py-1"><input class="form-check-input" type="checkbox" value="'+t[a]+'" id="'+t[a]+'"><label class="form-check-label" for="'+t[a]+'">'+t[a]+"</label></div>";document.getElementById("type_filters").innerHTML=r}(data);var f=document.querySelectorAll('#type_filters input[type="checkbox"]');f[0].checked=!0,document.querySelectorAll('#type_filters input[type="checkbox"]').forEach((function(e){var t=document.getElementById(e.id);t.addEventListener("change",(function(e){m(0,t)}))})),document.getElementById("loading").classList.add("loaded"),setTimeout((function(){document.getElementById("loading").remove()}),1e3);var p=document.getElementById("menu-button");p.addEventListener("click",(function(e){p.classList.toggle("opened"),document.getElementById("sidebar_filter").classList.toggle("opened"),document.getElementsByTagName("BODY")[0].classList.toggle("noscroll")}))}));