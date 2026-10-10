/**
 * Home page and the four ad pages (owner, 10 Oct 2026: "place cta in hero in middle of content above and below"): the hero's
 * button (".pth-cta" on the ad pages; on phones the home page's ".rz-cta", the button with its note under it) is moved up or
 * down so the space between it and the words above it equals the space between it and the words or icons below it. The
 * spaces change with the screen width, so they are measured (before the first paint, again once the fonts load and on
 * resize); the button is moved with "translate" only (a style rule added to the page, so the button itself is untouched and
 * React sees the same page it sent), so nothing else on the page moves. Where nothing sits close below
 * the button (tablets, where the photo comes next) it is left where it is. A page can then move its button a set distance off
 * that place with "--cta-nudge" on the button (in px; e.g. the personal tax hero, ads.css). Place inside the hero section.
 */
export default function HeroCtaCentre() {
  const js = `(function(){var s=document.currentScript,hero=s&&s.closest("section");if(!hero)return;
var SKIP=".desk-hero-card,.mc,.hero-bar,[hidden]",st=document.createElement("style");document.head.appendChild(st);
function vis(e){var r=e.getBoundingClientRect(),c=getComputedStyle(e);return r.height>0&&c.display!=="none"&&c.visibility!=="hidden"}
function fit(){st.textContent="";var cs=[].slice.call(hero.querySelectorAll(".pth-cta,.rz-cta"));
var cta=cs.filter(vis)[0];if(!cta)return;var c=cta.getBoundingClientRect(),above=-1e9,below=1e9;
var w=document.createTreeWalker(hero,4);for(var n=w.nextNode();n;n=w.nextNode()){if(!n.textContent.trim()||cta.contains(n)||n.parentElement.closest(SKIP)||!vis(n.parentElement))continue;
var g=document.createRange();g.selectNodeContents(n);var rs=g.getClientRects();for(var i=0;i<rs.length;i++){var r=rs[i];if(r.width<1||r.right<c.left||r.left>c.right)continue;
if(r.bottom<=c.top+1&&r.bottom>above)above=r.bottom;if(r.top>=c.bottom-1&&r.top<below)below=r.top}}
var im=hero.querySelectorAll("img");for(var j=0;j<im.length;j++){var q=im[j].getBoundingClientRect();if(q.width>80||q.width<1||im[j].closest(SKIP)||q.right<c.left||q.left>c.right)continue;if(q.top>=c.bottom-1&&q.top<below)below=q.top}
var nd=parseFloat(getComputedStyle(cta).getPropertyValue("--cta-nudge"))||0;
var d=above<-1e8||below>1e8||below-c.bottom>200?0:(above+below)/2-(c.top+c.bottom)/2;if(Math.abs(d)<0.5&&!nd)return;
var t=(getComputedStyle(cta).translate||"").split(" "),x=t[0]&&t[0]!=="none"?t[0]:"0px",y=parseFloat(t[1])||0;st.textContent=(cta.classList.contains("pth-cta")?".pth .pth-cta":".desk-hero .rz-cta")+"{translate:"+x+" "+(y+d+nd)+"px!important}"}
function run(){requestAnimationFrame(function(){requestAnimationFrame(fit)})}
fit();run();if(document.fonts)document.fonts.ready.then(run);addEventListener("load",run);addEventListener("resize",run)})()`;
  return <script dangerouslySetInnerHTML={{ __html: js }} />;
}
