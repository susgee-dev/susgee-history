export type SeasonalTheme = 'halloween' | 'christmas';

export const SEASONAL_STORAGE_KEY = 'susgee.seasonalDecor';

export function getSeasonalTheme(date = new Date()): SeasonalTheme | null {
	const month = date.getMonth();
	if (month === 9) return 'halloween';
	if (month === 11) return 'christmas';
	return null;
}

/** Sync head script: opt-out + atmosphere (do not rely on deferred Next Script). */
export const SEASONAL_BOOT_SCRIPT = `(function(){var K=${JSON.stringify(SEASONAL_STORAGE_KEY)};var m=new Date().getMonth();var t=m===9?"halloween":m===11?"christmas":null;var r=document.documentElement;var off=false;try{off=localStorage.getItem(K)==="off"}catch(e){}if(off||!t){r.removeAttribute("data-theme")}else{r.setAttribute("data-theme",t)}function snow(i){var l=((i*37)%100)+(i%7)*0.35,s=0.12+((i*13)%28)/100,d=9+((i*17)%16),a=-((i*23)%22),dr=((i%9)-4)*1.4,o=0.35+((i*11)%45)/100;return"left:"+l+"%;width:"+s+"rem;height:"+s+"rem;opacity:"+o+";animation-duration:"+d+"s;animation-delay:"+a+"s;--snow-drift:"+dr+"vw"}function html(){if(t==="halloween"){return'<div class="seasonal-atmosphere__fog seasonal-atmosphere__fog--halloween"></div><div class="seasonal-atmosphere__orb seasonal-atmosphere__orb--halloween-a"></div><div class="seasonal-atmosphere__orb seasonal-atmosphere__orb--halloween-b"></div><div class="seasonal-atmosphere__orb seasonal-atmosphere__orb--halloween-c"></div><div class="seasonal-atmosphere__bat seasonal-atmosphere__bat--1"></div><div class="seasonal-atmosphere__bat seasonal-atmosphere__bat--2"></div><div class="seasonal-atmosphere__bat seasonal-atmosphere__bat--3"></div>'}var f="";for(var i=0;i<40;i++)f+='<span class="seasonal-atmosphere__flake" style="'+snow(i)+'"></span>';return'<div class="seasonal-atmosphere__fog seasonal-atmosphere__fog--christmas"></div><div class="seasonal-atmosphere__glow seasonal-atmosphere__glow--christmas"></div><div class="seasonal-atmosphere__orb seasonal-atmosphere__orb--christmas-a"></div><div class="seasonal-atmosphere__orb seasonal-atmosphere__orb--christmas-b"></div><div class="seasonal-atmosphere__orb seasonal-atmosphere__orb--christmas-c"></div><div class="seasonal-atmosphere__snow">'+f+"</div>"}function inject(){if(!t||off||!document.body||document.querySelector(".seasonal-atmosphere"))return;var w=document.createElement("div");w.setAttribute("aria-hidden","true");w.className="seasonal-atmosphere seasonal-atmosphere--"+t;w.innerHTML=html();document.body.insertBefore(w,document.body.firstChild)}if(document.body)inject();else document.addEventListener("DOMContentLoaded",inject)})();`;
