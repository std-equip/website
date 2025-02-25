
function _app_regionChoose(urlDomain,protocol, regionsList,suffix){
	const data = {
		visible: false,
		urlDomain:urlDomain,
		protocol:protocol,
		regionsList:regionsList,
		suffix:suffix,
		searchVal:'',
		filterList:[],
	};
return new Vue({
	el: '#app_regionChoose',
	data: data,
	watch:{
		searchVal(new_value){
            if(new_value.length>0){
                $('.search_clear--city').show();
                this.filterList=[];
                this.changeValueSearch();
            } else {
                $('.search_clear--city').hide();
                this.filterList=[];
            }

		}	
	},
	methods:{
		open:function(){
			this.visible = true;
			$('.header_region_arrow').toggleClass('rotate');
			$('body').css('overflow-y','hidden');
		},
		close: function() {
            this.filterList=[];
			this.visible = false;
			$('.header_region_arrow').toggleClass('rotate');
			$('body').css('overflow-y','auto');
		},
		formatUrl:function(red, latin){
			let url;
			if(!red){
                let pathname = window.location.pathname;
                if (window.location.href.includes('catalog/?viewaction')) {
                    pathname = '/news/';
                }
				if (window.location.href.includes('profile/?draft=')) {
                    pathname = '/profile/?draft=' +  new URLSearchParams(window.location.search).get("draft");
                }
                if (window.location.href.includes('profile/?viewdraft=')) {
                    pathname = '/profile/?viewdraft=' +  new URLSearchParams(window.location.search).get("viewdraft");
                }
				url=this.protocol + '://' + latin + '.' + urlDomain + pathname;
			}
			return url;
		},
		changeValueSearch:function(){
			let self=this;
			regionsList.forEach(function(region){
				let cityList=region.list;
				let result=cityList.filter(function(city){
					return city.name.toLowerCase().includes(self.searchVal.toLowerCase())
				})
				if(result.length){
					let temp={
						'name':region.name,
						'list':result
					}
					self.filterList.push(temp);
				}
			})
		},
		clearVal: function(){
			this.filterList=[];
			this.searchVal='';
		}
	}
})
}
