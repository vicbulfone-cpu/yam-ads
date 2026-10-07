/**
 * Home page, laptops and desktops (owner, 7 Oct 2026): the steps line "Tell us your needs → Enter your postcode → Get
 * matched with one accountant" is sized so the last "t" of "accountant" ends exactly under the "n" of "obligation" in the
 * three points above. The points' width changes with the screen, so the size is measured (before the first paint, again
 * once the fonts load and on resize). Only when the three points sit in one row (from about 1400px); otherwise the
 * steps keep their CSS size. Place straight after the steps list. Also used on the ad pages (owner, 7 Oct 2026), where the
 * points sit in the same hero grid (.bz-grid) rather than beside the steps.
 */
export default function HomeStepsFit() {
  const js = `(function(){var s=document.currentScript,ol=s&&s.previousElementSibling,ul=ol&&(ol.closest(".bz-grid")||ol.parentElement).querySelector(".desk-hero-points");if(!ol||!ul)return;var K=ol.classList.contains("home-steps")?".home-steps":".bz-hero .bz-steps";var st=document.createElement("style");document.head.appendChild(st);
function R(e){var r=document.createRange();r.selectNodeContents(e);var a=r.getClientRects(),m=-1e9;for(var i=0;i<a.length;i++)m=Math.max(m,a[i].right);return m}
function fit(){st.textContent="";var li=ul.children;if(innerWidth<1024||li.length<3)return;if(Math.abs(li[2].getBoundingClientRect().top-li[0].getBoundingClientRect().top)>2)return;
var rule=K+"{flex-wrap:nowrap!important;white-space:nowrap!important}";st.textContent=rule;var last=ol.lastElementChild.lastElementChild,L=ol.getBoundingClientRect().left,T=R(li[2]);
for(var k=0;k<4;k++){var f=parseFloat(getComputedStyle(ol).fontSize),c=R(last);if(Math.abs(c-T)<0.3)break;st.textContent=rule+K+"{font-size:"+(f*(T-L)/(c-L)).toFixed(3)+"px!important}"}}
fit();if(document.fonts)document.fonts.ready.then(fit);addEventListener("resize",fit)})()`;
  return <script dangerouslySetInnerHTML={{ __html: js }} />;
}
