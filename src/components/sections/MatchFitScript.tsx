import { matchFit } from "@/lib/match-fit";

/**
 * Place inside a hero match box wrapper, after the box. Runs as the page is read, before the browser first draws it,
 * so the box appears at its fitted size straight away instead of shrinking once the page's JavaScript starts.
 * (MatchCardServices keeps it fitted when the window is resized.)
 */
export default function MatchFitScript() {
  const js = `(function(){var s=document.currentScript,b=s&&s.parentElement.querySelector(".mc");if(!b)return;var f=(${matchFit.toString()})(b);if(f==null)return;var st=document.createElement("style");st.textContent=":is(.desk-hero-card,.mc-hero-card,.bz-card-col) .mc{--mc-fit:"+f+"}";document.head.appendChild(st)})()`;
  return <script dangerouslySetInnerHTML={{ __html: js }} />;
}
